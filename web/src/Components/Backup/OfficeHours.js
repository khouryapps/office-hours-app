import React, { Component } from "react";
import AppComponent from "../AdminComponents/AppComponent";
import Content from "../AdminComponents/Content";
import { renderStatus } from "../AdminComponents/Utils";
import moment from "moment-timezone";

import {
  Table,
  Form,
  Input,
  Divider,
  Select,
  Button,
  List,
  Avatar,
  Card,
  Icon,
  Col,
  Row,
  Menu,
  Dropdown
} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { Meta } = Card;

class Queue extends AppComponent {
  state = {
    enpoint_tickets: "/api/officehours/ticket/",
    enpoint_status: "/api/officehours/ticket/status/",
    loading: true
  };

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.queue_id !== this.props.queue_id) {
      this.getData();
    }
  }

  getData = () => {
    this.doGet(
      this.state.enpoint_tickets + "?queue_id=" + this.props.queue_id + "/",
      data =>
        this.setState({
          loading: false,
          tickets: data.slice()
        })
    );
  };

  action = (id, action) => {
    this.doPatch(
      this.state.enpoint_tickets + id + "/status/",
      () => {
        this.setState({ loading: true });

        this.getData();
      },
      JSON.stringify({ status: action })
    );
  };

  render() {
    return (
      <div>
        {/* {open_ticket && (
          <List.Item
            style={{ width: "700px", margin: "30px auto" }}
            key={open_ticket.id}
            actions={[
              <a key="list-edit" onClick={() => this.action(item, "Open")}>
                {" "}
                Help
              </a>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar size="large" src={open_ticket.creator.photo_url} />
              }
              title={<a>{open_ticket.creator.full_name}</a>}
              description={open_ticket.question}
            />
            <div> {renderStatus(open_ticket.status)}</div>
          </List.Item>
        )} */}

        <List
          style={{ width: "500px", margin: "20px auto" }}
          dataSource={this.state.tickets}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={
                this.state.tickets[0].id == item.id
                  ? item.status == "Open"
                    ? [
                        <a
                          key="list-edit"
                          onClick={() => this.action(item.id, "Resolved")}
                        >
                          Resolved
                        </a>,
                        <a
                          key="list-edit"
                          onClick={() => this.action(item.id, "Deferred")}
                        >
                          Deferred
                        </a>,
                        <a
                          key="list-edit"
                          onClick={() => this.action(item.id, "No Show")}
                        >
                          No Show
                        </a>
                      ]
                    : [
                        <a
                          key="list-edit"
                          onClick={() => this.action(item.id, "Open")}
                        >
                          Help
                        </a>
                      ]
                  : []
              }
            >
              <List.Item.Meta
                avatar={<Avatar size="large" src={item.creator.photo_url} />}
                title={<a>{item.creator.full_name}</a>}
                description={item.question}
              />
            </List.Item>
          )}
        ></List>
      </div>
    );
  }
}

class Schedule extends AppComponent {
  state = {
    endpoint: "/api/officehours/schedule/upcoming/",
    loading: true,
    data: [],
    attend: false
  };

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.course_id !== this.props.course_id) {
      this.getData();
    }
  }

  getData = () => {
    this.setState({ attend: false });

    this.doGet(
      this.state.endpoint + "?course_id=" + this.props.course_id,
      data => this.setState({ data: data, loading: false })
    );
  };

  attendOfficeHours = id => {
    this.setState({ attend: true, queue_id: id });
  };

  render() {
    console.log(this.props.course_id);

    console.log(this.state.data);
    const { data, loading } = this.state;

    return (
      <React.Fragment>
        <Row gutter={16}>
          {!loading &&
            data.map(item => (
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
                  <Meta title={item.ta_name} description={item.room} />
                  {moment(item.start).format("dddd")} {" | "}
                  {moment(item.start).format("h:mm:ss a")}
                  {" - "}
                  {moment(item.end).format("h:mm:ss a")}
                </Card>
              </Col>
            ))}
        </Row>

        {this.state.attend && (
          <div>
            <Divider orientation="center">Tickets</Divider>
            <Queue {...this.props} queue_id={this.state.queue_id} />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default class OfficeHours extends AppComponent {
  state = {
    endpoint: "/api/officehours/ta/",
    loading: true,
    courses: [],
    update: false,

    selected_course: null,
    selectedRowKeys: []
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.doGet(
      this.state.endpoint + "?semester=" + this.props.semesters.join(","),
      data => { console.log("DATA", data); this.setState({ courses: data, loading: false })}
    );
  };

  onSelectChange = selectedRowKeys => {
    if (selectedRowKeys.length > 1) {
      const lastSelectedRowIndex = [...selectedRowKeys].pop();
      this.setState({ selectedRowKeys: lastSelectedRowIndex });
    }
    this.setState({ selectedRowKeys });
  };

  render() {
    const { semester } = this.props;
    const { courses, loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      type: "radio"
    };

    console.log(courses);


    const columns = [
      {
        title: "Course",
        width: 350,
        render: (text, record, idx) =>
          this.print_course(record.course_id) +
          " " +
          this.get_course(record.course_id).title
      }
    ];
    return (
      <Content
        {...this.props}
        title={semester + " Office Hours"}
        breadcrumbs={[
          { text: "Students" },
          { text: "Office Hours" },
          { text: semester }
        ]}
      >
        <p>Welcome to the new Office hours Tracker</p>
        <React.Fragment>
          <Divider orientation="left">Select the course</Divider>
          <Table
            rowSelection={rowSelection}
            dataSource={courses}
            columns={columns}
            loading={loading}
            rowKey="course_id"
          />
          {selectedRowKeys[0] && (
            <React.Fragment>
              <Divider orientation="center">
                Offices hours for the selected course
              </Divider>
              <p></p>

              <Schedule {...this.props} course_id={selectedRowKeys[0]} />
            </React.Fragment>
          )}
        </React.Fragment>
      </Content>
    );
  }
}
