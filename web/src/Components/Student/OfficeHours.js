import React, { Component } from "react";
import AppComponent from "../AdminComponents/AppComponent";
import Content from "../AdminComponents/Content";
import { renderStatus } from "../AdminComponents/Utils";
// import WebSocketInstance from "./WebSocket";
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
  Steps,
  Typography,
  Collapse,
  Radio,
  Modal,
  Tabs,
  Alert
} from "antd";

const { TabPane } = Tabs;

const { Panel } = Collapse;

const { Title } = Typography;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { Meta } = Card;

const divStyle = {
  margin: 100,
  width: 360
};

const FeedbackForm = Form.create({ name: "feedback" })(
  class extends AppComponent {
    state = {
      message: "",
      endpoint_feedback: "/api/officehours/ticket/"
    };

    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          // const data = {
          //   question: values.question,
          //   public: values.public,
          //   queue: this.props.queue_id
          // };
          this.doPost(
            this.state.endpoint_feedback + this.props.ticket_id + "/feedback/",
            () => {
              this.props.form.resetFields();
              this.props.handleSubmit();
            },
            JSON.stringify(values)
          );
        }
      });
    };

    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Modal
          footer={null}
          title={"Feedback"}
          centered
          visible={this.props.visible}
          closable={false}
          okText="Submit"
        >
          <Form onSubmit={this.handleSubmit}>
            <Form.Item
              label="Problem Resolved"
              // extra=""
            >
              {getFieldDecorator("resolved", {
                rules: [{ required: true }]
              })(
                <Radio.Group>
                  <Radio value={false}>No</Radio>
                  <Radio value={true}>Yes</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="Clarity">
              {getFieldDecorator("clarity", {
                rules: [{ required: true }]
              })(
                <Radio.Group>
                  <Radio value={1}>Bad</Radio>
                  <Radio value={2}>Below Average</Radio>
                  <Radio value={3}>Average</Radio>
                  <Radio value={4}>Above Average</Radio>
                  <Radio value={5}>Good</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="Helpfulness">
              {getFieldDecorator("helpfulness", {
                rules: [{ required: true }]
              })(
                <Radio.Group>
                  <Radio value={1}>Bad</Radio>
                  <Radio value={2}>Below Average</Radio>
                  <Radio value={3}>Average</Radio>
                  <Radio value={4}>Above Average</Radio>
                  <Radio value={5}>Good</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="Wait Time">
              {getFieldDecorator("wait_time", {
                rules: [{ required: true }]
              })(
                <Radio.Group>
                  <Radio value={1}>Bad</Radio>
                  <Radio value={2}>Below Average</Radio>
                  <Radio value={3}>Average</Radio>
                  <Radio value={4}>Above Average</Radio>
                  <Radio value={5}>Good</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

const WQueueForm = Form.create({ name: "officehours" })(
  class extends AppComponent {
    state = {
      endpoint: "/api/officehours/queue/",
      enpoint_tickets: "/api/officehours/ticket/",
      stage: 0,
      loading: true,
      is_edit: false,
      is_feedback: false
    };

    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const data = {
            question: values.question,
            public: values.public,
            queue: this.props.queue_id
          };
          this.doPost(
            this.state.enpoint_tickets,
            () => {
              this.props.form.resetFields();
              this.props.handleSubmit();
            },
            JSON.stringify(data)
          );
        }
      });
    };

    render() {
      const { getFieldDecorator } = this.props.form;

      return (
        <div
          style={{
            width: "500px",
            margin: "20px auto",
            textAlignVertical: "center",
            textAlign: "center"
          }}
        >
          <Form onSubmit={this.handleSubmit}>
            <Form.Item
              label="Question"
              extra="Please briefly describe your problem"
            >
              {getFieldDecorator("question", {
                rules: [
                  { required: true, message: "Please input your question!" }
                ]
              })(
                <Input.TextArea
                  rows={3}
                  style={{ width: 350 }}
                  placeholder="Your question"
                />
              )}
            </Form.Item>
            <Form.Item
              label="Visibility"
              extra="Please set the visibility status of your ticket"
            >
              {getFieldDecorator("public", {
                rules: [{ required: true }]
              })(
                <Radio.Group>
                  <Radio value={true}>Public</Radio>
                  <Radio value={false}>Private</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      );
    }
  }
);

class Queue extends AppComponent {
  state = {
    endpoint: "/api/officehours/queue/",
    enpoint_tickets: "/api/officehours/ticket/",
    stage: 0,
    loading: true,
    is_edit: false,
    is_feedback: false
  };

  componentDidMount() {
    this.getData();
    // WebSocketInstance.connect();
    // this.waitForSocketConnection(() => {
    //   WebSocketInstance.initChatUser("tim");
    //   WebSocketInstance.addCallbacks(
    //     this.setMessages.bind(this),
    //     this.addMessage.bind(this)
    //   );
    //   WebSocketInstance.fetchMessages("tim");
    // });
  }

  // waitForSocketConnection(callback) {
  //   const component = this;
  //   setTimeout(function() {
  //     // Check if websocket state is OPEN
  //     if (WebSocketInstance.state() === 1) {
  //       console.log("Connection is made");
  //       callback();
  //       return;
  //     } else {
  //       console.log("wait for connection...");
  //       component.waitForSocketConnection(callback);
  //     }
  //   }, 100); // wait 100 milisecond for the connection...
  // }

  // addMessage(message) {
  //   this.setState({ messages: [...this.state.messages, message] });
  // }

  // setMessages(messages) {
  //   this.setState({ messages: messages.reverse() });
  // }

  componentDidUpdate(prevProps) {
    if (prevProps.queue_id !== this.props.queue_id) {
      this.getData();
    }
  }

  getData = () => {
    // this.doGet(this.state.endpoint + this.props.queue_id + "/", data =>
    //   this.setState({ data: data, loading: false })
    // );
    this.doGet(
      this.state.enpoint_tickets + "?queue_id=" + this.props.queue_id + "/",
      data => {
        console.log(data);
        let tickets = data.slice();
        let position = tickets.findIndex(
          item => item.creator.user == this.props.user.username
        );
        let my_ticket = tickets.filter(
          item => item.creator.user == this.props.user.username
        )[0];
        tickets = tickets.slice(0, position);

        this.setState({
          loading: false,
          tickets: tickets,
          position: position,
          my_ticket: my_ticket
        });

        my_ticket
          ? my_ticket.status == "Open"
            ? this.setState({
                stage: 2,
                is_edit: false,
                is_feedback: true,
                ticket_id: my_ticket.id,
                question: my_ticket.question,
                public: my_ticket.public
              })
            : this.setState({
                stage: 1,
                is_edit: false,
                question: my_ticket.question,
                public: my_ticket.public
              })
          : this.state.is_feedback
          ? this.setState({ stage: 3, is_feedback: false })
          : this.setState({ stage: 0 });
      }
    );
  };

  handleSubmit = () => {
    this.setState({ stage: (this.state.stage + 1) % 4 });
    this.getData();
  };

  handleDelete = id => {
    this.doDelete(
      this.state.endpoint_tickets + id + "/edit/",
      () => {
        // this.props.form.resetFields();
        this.getData();
      },
      null
    );
  };
  //
  // handleSave = id => {
  //   console.log(this.state.public);
  //   this.state.my_ticket.question
  //     ? this.doPatch(
  //         this.state.endpoint_tickets + id + "/edit/",
  //         () => {
  //           this.getData();
  //         },
  //         JSON.stringify({
  //           question: this.state.question,
  //           public: this.state.public
  //         })
  //       )
  //     : null;
  //   this.setState({ is_edit: !this.state.is_edit });
  // };

  render() {
    const { Step } = Steps;
    const { my_ticket } = this.state;
    return (
      <React.Fragment>
        <Steps
          size="small"
          current={this.state.stage}
          style={{ margin: "20px auto" }}
        >
          <Step title="Submit a question to enter the line" />
          <Step title="Wait" />
          <Step title="Get help" />
          <Step title="Leave feedback"></Step>
        </Steps>
        <br />
        <div style={{ textAlign: "center" }}></div>
        {this.state.my_ticket && (
          <div
            style={{
              width: "500px",
              margin: "20px auto"
            }}
          >
            <div
              style={{
                textAlign: "center"
              }}
            >
              <Button
                style={{ marginBottom: 20 }}
                type="primary"
                shape="round"
                icon="reload"
                onClick={() => this.getData()}
              >
                Refresh
              </Button>
              {my_ticket.status != "Open" ? (
                this.state.position > 1 ? (
                  <Title
                    level={2}
                    style={{
                      textAlignVertical: "center",
                      textAlign: "center"
                    }}
                  >
                    There are {this.state.position} people in front of you
                  </Title>
                ) : (
                  <Title
                    level={2}
                    style={{
                      textAlignVertical: "center",
                      textAlign: "center"
                    }}
                  >
                    You are next
                  </Title>
                )
              ) : (
                <Title
                  level={2}
                  style={{
                    textAlignVertical: "center",
                    textAlign: "center"
                  }}
                >
                  It is your turn
                </Title>
              )}
            </div>
            {this.state.tickets.length > 0 && (
              <List
                dataSource={this.state.tickets}
                renderItem={item => (
                  <List.Item
                    style={{
                      padding: 10,
                      margin: 20
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar size="large" src={item.creator.photo_url} />
                      }
                      title={item.creator.full_name}
                      description={
                        item.public ? item.question : "****************"
                      }
                    />
                    <div> {renderStatus(item.status)}</div>
                  </List.Item>
                )}
              ></List>
            )}
            <List.Item
              style={{
                padding: 10,
                backgroundColor: "#FAFAFA"
              }}
              key={my_ticket.id}
              actions={
                this.state.is_edit
                  ? [
                      <a
                        key="list-edit"
                        onClick={() => this.handleSave(my_ticket.id)}
                      >
                        {" "}
                        save
                      </a>,
                      <a
                        key="list-more"
                        onClick={() =>
                          this.setState({
                            is_edit: !this.state.is_edit,
                            question: this.state.my_ticket.question,
                            public: this.state.my_ticket.public
                          })
                        }
                      >
                        cancel
                      </a>
                    ]
                  : [
                      <a
                        key="list-edit"
                        onClick={() =>
                          this.setState({ is_edit: !this.state.is_edit })
                        }
                      >
                        {" "}
                        edit
                      </a>,
                      <a
                        key="list-more"
                        onClick={() => this.handleDelete(my_ticket.id)}
                      >
                        delete
                      </a>
                    ]
              }
            >
              <List.Item.Meta
                avatar={<Avatar src={my_ticket.creator.photo_url} />}
                title={my_ticket.creator.full_name}
                description={
                  !this.state.is_edit ? (
                    my_ticket.question
                  ) : (
                    <div>
                      <TextArea
                        rows={2}
                        defaultValue={this.state.question}
                        onChange={e =>
                          this.setState({ question: e.target.value })
                        }
                      />
                      <Radio.Group
                        onChange={e =>
                          this.setState({ public: e.target.value })
                        }
                        defaultValue={this.state.public}
                      >
                        <Radio value={true}>Public</Radio>
                        <Radio value={false}>Private</Radio>
                      </Radio.Group>
                    </div>
                  )
                }
              />
              {!this.state.is_edit && (
                <div> {renderStatus(my_ticket.status)}</div>
              )}
            </List.Item>
          </div>
        )}

        <FeedbackForm
          {...this.props}
          ticket_id={this.state.ticket_id}
          visible={this.state.stage == 3}
          handleSubmit={this.handleSubmit}
        />

        {this.state.stage == 0 && (
          <WQueueForm {...this.props} handleSubmit={this.handleSubmit}>
            {" "}
          </WQueueForm>
        )}
      </React.Fragment>
    );
  }
}

class Schedule extends AppComponent {
  state = {
    endpoint: "/api/officehours/schedule/",
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
    const customPanelStyle = {
      background: "#f7f7f7",
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: "hidden"
    };

    const { data, loading } = this.state;
    const today = data.filter(item =>
      moment(item.start).isSame(moment(), "day")
    );
    const tomorrow = data.filter(item =>
      moment(item.start).isSame(moment(new Date()).add(1, "days"), "day")
    );
    const week = data.filter(
      item =>
        !moment(item.start).isSame(moment(new Date()).add(1, "days"), "day") &&
        !moment(item.start).isSame(moment(), "day") &&
        moment(item.start).isSame(moment(), "week")
    );
    return (
      <React.Fragment>
        <Tabs defaultActiveKey="1" tabPosition="left">
          <TabPane tab="Today" key="1">
            <Row gutter={16} style={{ padding: "40px" }}>
              {!this.state.loading &&
                today.map(item => (
                  <Col span={8}>
                    <Card style={{ marginBottom: "1.5em" }}>
                      <Meta title={item.ta_name} description={item.room} />
                      {moment(item.start).format("dddd")} {" | "}
                      {moment(item.start).format("h:mm:ss a")}
                      {" - "}
                      {moment(item.end).format("h:mm:ss a")}
                      <Button
                        style={{ float: "right" }}
                        type="primary"
                        onClick={() => this.attendOfficeHours(item.queue)}
                      >
                        {" "}
                        Attend{" "}
                      </Button>
                    </Card>
                  </Col>
                ))}
              {today.length < 1 && (
                <Alert
                  message="Info Block"
                  description="There are no office hours for the selected day"
                  type="info"
                  showIcon
                />
              )}
            </Row>
          </TabPane>
          <TabPane tab="Tomorrow" key="2">
            <Row gutter={16} style={{ padding: "40px" }}>
              {!this.state.loading &&
                tomorrow.map(item => (
                  <Col span={8}>
                    <Card style={{ marginBottom: "1.5em" }}>
                      <Meta title={item.ta_name} description={item.room} />
                      {moment(item.start).format("dddd")} {" | "}
                      {moment(item.start).format("h:mm:ss a")}
                      {" - "}
                      {moment(item.end).format("h:mm:ss a")}
                      <Button
                        style={{ float: "right" }}
                        type="primary"
                        onClick={() => this.attendOfficeHours(item.queue)}
                      >
                        {" "}
                        Attend{" "}
                      </Button>
                    </Card>
                  </Col>
                ))}
              {tomorrow.length < 1 && (
                <Alert
                  message="Info Block"
                  description="There are no office hours for the selected day"
                  type="info"
                  showIcon
                />
              )}
            </Row>
          </TabPane>
          <TabPane tab="Later this week" key="3">
            <Row gutter={16} style={{ padding: "40px" }}>
              {!this.state.loading &&
                week.map(item => (
                  <Col span={8}>
                    <Card style={{ marginBottom: "1.5em" }}>
                      <Meta title={item.ta_name} description={item.room} />
                      {moment(item.start).format("dddd")} {" | "}
                      {moment(item.start).format("h:mm:ss a")}
                      {" - "}
                      {moment(item.end).format("h:mm:ss a")}
                      <Button
                        style={{ float: "right" }}
                        type="primary"
                        onClick={() => this.attendOfficeHours(item.queue)}
                      >
                        {" "}
                        Attend{" "}
                      </Button>
                    </Card>
                  </Col>
                ))}
              {week.length < 1 && (
                <Alert
                  message="Info Block"
                  description="There are no office hours for the selected time period"
                  type="info"
                  showIcon
                />
              )}
            </Row>
          </TabPane>
        </Tabs>

        {this.state.attend && (
          <Queue {...this.props} queue_id={this.state.queue_id} />
        )}
      </React.Fragment>
    );
  }
}

export default class OfficeHours extends AppComponent {
  state = {
    endpoint: "/api/officehours/me/",
    loading: true,
    courses: [],
    update: false,
    endpoint_section: "/api/schedule/",
    selected_course: null,
    selectedRowKeys: []
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.doGet(this.state.endpoint, data =>
      this.setState({ courses: data.courses, loading: false })
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
    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      type: "radio"
    };

    const { semester } = this.props;
    const { courses, loading } = this.state;

    const columns = [
      {
        title: "Course",
        key: "course",
        width: 350,
        render: (text, record, idx) =>

          this.print_course(record.id) + " " + this.get_course(record.id).title
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
            pagination={false}
            rowKey="id"
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
