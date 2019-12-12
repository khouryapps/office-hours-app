import React, { Component } from "react";
import AppComponent from "./AdminComponents/AppComponent";
import Content from "./AdminComponents/Content";
import { renderStatus } from "./AdminComponents/Utils";
// import WebSocketInstance from "./WebSocket";
import Queue from "./Queue";
import {
  Divider,
  Card,
  Icon,
  Col,
  Row,
  Tabs,
  Alert,
  Typography,
  Radio
} from "antd";
import moment from "moment-timezone";

const { TabPane } = Tabs;
const { Meta } = Card;
const { Text } = Typography;


export default class Schedule extends AppComponent {
  state = {
    endpoint_schedule: "/api/officehours/schedule/",
    endpoint_upcoming: "/api/officehours/schedule/upcoming/",

    loading: true,
    attend: false,
    week_view: false
  };

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isTA !== this.props.isTA ||
      prevProps.semester !== this.props.semester ||
      prevProps.course_id !== this.props.course_id
    ) {
      this.getData();
    }
  }

  getData = () => {
    this.setState({ attend: false, loading: true });
    const { isTA } = this.props;
    this.doGet(
      this.state.endpoint_schedule + "?course_id=" + this.props.course_id,
      data => this.setState({ data: data, loading: false })
    );
  };

  attendOfficeHours = id => {
    this.setState({ attend: true, queue_id: id });
  };

  renderCalendar = () => {
    const { data } = this.state;
    console.log(moment().format("dddd"));
    const name = this.props.user.first_name + " " + this.props.user.last_name;

    const calendar = [
      {
        name: "Monday",
        data: data.filter(item => moment(item.start).weekday() == 1)
      },
      {
        name: "Tuesday",
        data: data.filter(item => moment(item.start).weekday() == 2)
      },
      {
        name: "Wednesday",
        data: data.filter(item => moment(item.start).weekday() == 3)
      },
      {
        name: "Thursday",
        data: data.filter(item => moment(item.start).weekday() == 4)
      },
      {
        name: "Friday",
        data: data.filter(item => moment(item.start).weekday() == 5)
      },
      {
        name: "Saturday",
        data: data.filter(item => moment(item.start).weekday() == 6)
      },
      {
        name: "Sunday",
        data: data.filter(item => moment(item.start).weekday() == 7)
      }
    ];
    return (
      <React.Fragment>
        <div className="Calendar">
          <Row>
            {calendar.map(item => (
              <Col
                span={3}
                style={{
                  textAlign: "center"
                }}
              >
                <Text
                  className={
                    item.name == moment().format("dddd") ? "ActiveDay" : null
                  }
                >
                  {item.name}
                </Text>
                <br />
                {item.data.map(item => (
                  <Card
                    // style={{ marginBottom: "1.5em" }}
                    className={item.ta_name == name ? "TACard" : null}
                    actions={[
                      <Icon
                        type="team"
                        key="edit"
                        onClick={() => this.attendOfficeHours(item.queue)}
                      />
                    ]}
                  >
                    <Meta title={item.ta_name} description={item.room} />
                    <span>
                      {moment(item.start).format("h:mm a")}
                      {" - "}
                      {moment(item.end).format("h:mm a")}
                    </span>
                  </Card>
                ))}
              </Col>
            ))}
          </Row>
        </div>
      </React.Fragment>
    );
  };

  renderStudent = () => {
    const isMobile = window.innerWidth < 480;
    const { data } = this.state;
    const list = [
      {
        name: "Today",
        data: data.filter(item => moment(item.start).isSame(moment(), "day")),
        key: "1"
      },
      {
        name: "Tomorrow",
        data: data.filter(item =>
          moment(item.start).isSame(moment(new Date()).add(1, "days"), "day")
        ),
        key: "2"
      },
      {
        name: "Later this week",
        data: data.filter(
          item =>
            !moment(item.start).isSame(
              moment(new Date()).add(1, "days"),
              "day"
            ) &&
            !moment(item.start).isSame(moment(), "day") &&
            moment(item.start).isSame(moment(), "week")
        ),
        key: "3"
      }
    ];
    return (
      <React.Fragment>
        <Tabs defaultActiveKey="1" tabPosition={isMobile ? "top" : "left"}>
          {list.map(item => (
            <TabPane tab={item.name} key={item.key}>
              <Row gutter={(16, 16)}>
                {item.data.map(item => (
                  <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                    <Card
                      style={{ marginBottom: "1.5em" }}
                      actions={[
                        <Icon
                          type="team"
                          key="edit"
                          onClick={() => this.attendOfficeHours(item.queue)}
                        />
                      ]}
                    >
                      <Meta title={item.ta_name} description={item.room} />
                      {moment(item.start).format("dddd")} {" | "}
                      {moment(item.start).format("h:mm a")}
                      {" - "}
                      {moment(item.end).format("h:mm a")}
                    </Card>
                  </Col>
                ))}
              </Row>
              {item.data.length < 1 && (
                <Alert
                  className="InfoBlock"
                  message="Info Block"
                  description="There are no office hours for the selected time period"
                  type="info"
                  showIcon
                />
              )}
            </TabPane>
          ))}
        </Tabs>
      </React.Fragment>
    );
  };

  renderTA = () => {
    const { data } = this.state;
    const ta_data = data.filter(
      item =>
        item.ta_name ==
        this.props.user.first_name + " " + this.props.user.last_name
    );
    return (
      <React.Fragment>
        <Row gutter={16}>
          {ta_data.map(item => (
            <Col span={8}>
              <Card
                style={{ marginBottom: "1.5em" }}
                actions={[
                  <Icon
                    type="team"
                    key="edit"
                    onClick={() => this.attendOfficeHours(item.queue)}
                  />
                ]}
              >
                <Meta title={item.room} />
                {moment(item.start).format("dddd, MMM Do")}
                <br />
                {moment(item.start).format("h:mm a")}
                {" - "}
                {moment(item.end).format("h:mm a")}
                {item.ta_name}
              </Card>
            </Col>
          ))}
        </Row>
      </React.Fragment>
    );
  };

  render() {
    const { isTA } = this.props;
    const { loading } = this.state;
    const isMobile = window.innerWidth < 480;
    return (
      <React.Fragment>
        <Divider style={{ marginBottom: 0 }}>
          Office hours for the selected course
        </Divider>
        {!isMobile && (
          <div style={{ display: "flex" }}>
            <span
              style={{
                display: "flex",
                marginLeft: "auto"
              }}
            >
              <Radio.Group
                style={{ marginBottom: 10 }}
                defaultValue="list"
                onChange={() =>
                  this.setState({ week_view: !this.state.week_view })
                }
              >
                <Radio.Button value="list">Upcoming</Radio.Button>
                <Radio.Button value="calendar">Schedule</Radio.Button>
              </Radio.Group>
            </span>
          </div>
        )}
        {!loading
          ? this.state.week_view
            ? this.renderCalendar()
            : isTA
            ? this.renderTA()
            : this.renderStudent()
          : null}
        {this.state.attend && (
          <Queue {...this.props} queue_id={this.state.queue_id} />
        )}
      </React.Fragment>
    );
  }
}
