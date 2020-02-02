import React, { Component } from "react";
import AppComponent from "../AppComponent";
import { renderStatus } from "../Utils";
// import WebSocketInstance from "./WebSocket";
import { FeedbackForm, EnterQueueForm } from "./Forms";
import { QueueForm } from "./Forms";
import "./OfficeHours.css";
import moment from "moment-timezone";

import {
  Input,
  Button,
  List,
  Avatar,
  Steps,
  Typography,
  Radio,
  Divider,
  Alert
} from "antd";

const { Title } = Typography;
const { TextArea } = Input;

const stage = {
  enter_oh: 0,
  ask_question: 1,
  wait: 2,
  get_help: 3,
  leave_feedback: 4
};

const status = {
  close: 0,
  open: 1,
  over: 2
};

export default class Queue extends AppComponent {
  state = {
    endpoint_tickets: "/api/officehours/ticket/",
    endpoint_schedule: "/api/officehours/schedule/",
    stage: 0,
    loading: true,
    is_edit: false,
    is_open: false,
    is_over: false,
    is_validated: false,
    tickets: []
  };

  // Fetch data every 1 minute to get the updates about the queue
  componentDidMount() {
    this.getData();
    setInterval(() => {
      this.getData();
    }, 60000);

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
    if (
      prevProps.isTA !== this.props.isTA ||
      prevProps.semester !== this.props.semester ||
      prevProps.queue_id !== this.props.queue_id ||
      prevProps.oh_id !== this.props.oh_id
    ) {
      this.getData();
    }
  }

  changeStatus = data => {
    this.setState({
      oh_status:
        data.ta_arrived_on == null && data.ta_departed_on == null
          ? status.close
          : data.ta_arrived_on != null && data.ta_departed_on == null
          ? status.open
          : status.over
    });
  };

  getData = () => {
    const { isTA } = this.props;
    isTA ? this.getDataTA() : this.getDataStudent();
  };

  // if the user is a TA
  getDataTA = () => {
    // get tickets for the queue
    // filter the ta_id on the back end
    this.doGet(
      this.state.endpoint_tickets + "?queue=" + this.props.queue_id,
      data => {
        let tickets = data.slice();
        let open_tickets = tickets.filter(item => item.status == "Open");
        tickets = tickets.filter(item => item.status == "In Line");
        this.setState({
          loading: false,
          open_tickets: open_tickets,
          tickets: tickets
        });
      }
    );
    // check if the oh block is open
    this.doGet(this.state.endpoint_schedule + this.props.oh_id + "/", data =>
      this.changeStatus(data)
    );
  };

  // if the user is a Student
  getDataStudent = () => {
    // TODO: pass the TA info in the props
    // check if the oh block is open; get TA info
    this.doGet(this.state.endpoint_schedule + this.props.oh_id + "/", data => {
      this.changeStatus(data);
      this.setState({
        ta_name: data.ta_name,
        ta_photo: data.ta_photo
      });
    });
    // get tickets
    this.doGet(
      this.state.endpoint_tickets + "?queue=" + this.props.queue_id,
      data => {
        let tickets = data.slice();
        let open_tickets = tickets.filter(item => item.status == "Open");
        tickets = tickets.filter(item => item.status == "In Line");
        // find student's position in the queue
        let position = tickets.findIndex(
          item => item.creator.user == this.props.user.username
        );
        // find student's ticket
        let my_ticket = tickets.filter(
          item => item.creator.user == this.props.user.username
        )[0];
        // show only tickets that are infront of the student
        tickets = tickets.slice(0, position);

        this.setState({
          loading: false,
          tickets: tickets,
          open_tickets: open_tickets,
          position: position
        });

        my_ticket
          ? this.setState({
              stage: stage.wait,
              is_edit: false,
              ticket_id: my_ticket.id,
              my_ticket: my_ticket,
              question: my_ticket.question,
              public: my_ticket.public,
              status: my_ticket.status
            })
          : null;

        // check if the ticket ahs has been just resolved
        const just_resolved =
          this.state.my_ticket != my_ticket &&
          this.state.stage == stage.get_help;

        // define the current stage/state of the queue
        my_ticket
          ? my_ticket.status == "Open"
            ? this.setState({
                stage: stage.get_help
              })
            : this.setState({
                stage: stage.wait
              })
          : just_resolved
          ? this.setState({ stage: stage.leave_feedback })
          : this.state.is_validated
          ? this.setState({ stage: stage.ask_question })
          : this.setState({ stage: stage.enter_oh });
      }
    );
  };

  // on form submit, move to the next stage
  handleSubmit = () => {
    this.setState({ stage: (this.state.stage + 1) % 5, is_validated: true });
    this.getData();
  };

  // on ticket delete
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

  // on ticket save (after editing)
  handleSave = id => {
    this.state.my_ticket.question
      ? this.doPatch(
          this.state.endpoint_tickets + id + "/edit/",
          () => {
            this.getData();
          },
          JSON.stringify({
            question: this.state.question,
            public: this.state.public
          })
        )
      : null;
    this.setState({ is_edit: !this.state.is_edit });
  };

  // render student's current queue state/position
  renderPositionInQueue = () => {
    const { my_ticket } = this.state;

    return my_ticket ? (
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
              There are {this.state.position} people in front of you in the line
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
    ) : null;
  };

  // change the ticket status (by TA)
  action = (id, action) => {
    this.doPatch(
      this.state.endpoint_tickets + id + "/edit/",
      () => {
        this.setState({ loading: true });

        this.getData();
      },
      JSON.stringify({ status: action })
    );
  };

  // render TA's view on the ticket list
  renderTicketListTA = () => {
    return (
      <div>
        <div className="OpenTickets">
          <List
            style={{ width: "500px", margin: "20px auto" }}
            dataSource={this.state.open_tickets}
            renderItem={item => (
              <List.Item
                key={item.id}
                actions={[
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
                ]}
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

        <List
          style={{ width: "500px", margin: "20px auto" }}
          dataSource={this.state.tickets}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={
                this.state.tickets[0].id == item.id &&
                this.state.open_tickets.length < 3
                  ? [
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
  };

  // render student's view on the ticket list
  renderTicketListStudent = () => {
    return this.state.tickets.length ? (
      <List
        dataSource={this.state.open_tickets.concat(this.state.tickets)}
        renderItem={item => (
          <List.Item
            style={{
              padding: 10,
              margin: 20
            }}
          >
            <List.Item.Meta
              avatar={<Avatar size="large" src={item.creator.photo_url} />}
              title={
                <div>
                  {" "}
                  <div className="TAInfo">{renderStatus(item.status)}</div>
                  {item.creator.full_name}{" "}
                </div>
              }
              description={
                item.public ? item.question : "[-Message is Hidden-]"
              }
            />
          </List.Item>
        )}
      ></List>
    ) : null;
  };

  // render student's ticket
  renderMyTicket = () => {
    const { my_ticket } = this.state;
    const edit_buttons = [
      <a key="list-edit" onClick={() => this.handleSave(my_ticket.id)}>
        save
      </a>,
      <a
        key="list-more"
        onClick={() =>
          this.setState({
            is_edit: !this.state.is_edit,
            question: my_ticket.question,
            public: my_ticket.public
          })
        }
      >
        cancel
      </a>
    ];
    const action_buttons = [
      <a
        key="list-edit"
        onClick={() => this.setState({ is_edit: !this.state.is_edit })}
      >
        edit
      </a>,
      <a key="list-more" onClick={() => this.handleDelete(my_ticket.id)}>
        delete
      </a>
    ];

    return my_ticket ? (
      <List.Item
        style={{
          padding: 10,
          backgroundColor: "#FAFAFA"
        }}
        key={my_ticket.id}
        actions={this.state.is_edit ? edit_buttons : action_buttons}
      >
        <List.Item.Meta
          avatar={<Avatar src={my_ticket.creator.photo_url} />}
          title={
            <div>
              {" "}
              {!this.state.is_edit && (
                <div className="TAInfo">{renderStatus(my_ticket.status)}</div>
              )}
              {my_ticket.creator.full_name}{" "}
            </div>
          }
          description={
            !this.state.is_edit
              ? my_ticket.question
              : this.renderQuestionEditBlock()
          }
        />
      </List.Item>
    ) : null;
  };

  // render edit ticket view
  renderQuestionEditBlock = () => {
    return (
      <div>
        <TextArea
          rows={2}
          defaultValue={this.state.question}
          onChange={e => this.setState({ question: e.target.value })}
        />
        <Radio.Group
          onChange={e => this.setState({ public: e.target.value })}
          defaultValue={this.state.public}
        >
          <Radio value={true}>Public</Radio>
          <Radio value={false}>Private</Radio>
        </Radio.Group>
      </div>
    );
  };

  // render queue stages
  renderQueueSteps = () => {
    const { Step } = Steps;

    return (
      <Steps className="QueueSteps" size="small" current={this.state.stage}>
        <Step title="Submit the secret code" />
        <Step title="Ask your question" />
        <Step title="Wait" />
        <Step title="Get help" />
        <Step title="Leave feedback"></Step>
      </Steps>
    );
  };

  // render student's view
  renderStudent = () => {
    return this.state.oh_status == status.open ? (
      <React.Fragment>
        <div className="QueueSteps">{this.renderQueueSteps()}</div>
        <div className="TAInfo">
          <Avatar shape="square" size={100} src={this.state.ta_photo} />
          <Title style={{ marginTop: 10 }} level={4}>
            {this.state.ta_name}
          </Title>
        </div>
        {this.state.stage == stage.enter_oh && (
          <EnterQueueForm {...this.props} handleSubmit={this.handleSubmit} />
        )}
        <div className="Queue">
          {(this.state.stage == stage.wait ||
            this.state.stage == stage.get_help) && (
            <div>
              {this.renderPositionInQueue()}
              {this.renderTicketListStudent()}
              {this.renderMyTicket()}
            </div>
          )}
          {this.state.stage == stage.ask_question && (
            <QueueForm {...this.props} handleSubmit={this.handleSubmit} />
          )}
        </div>
        <FeedbackForm
          {...this.props}
          ticket_id={this.state.ticket_id}
          visible={this.state.stage == stage.leave_feedback}
          handleSubmit={this.handleSubmit}
          question={this.state.question}
          ta_helped={this.state.ta_helped}
          status={this.state.status}
        />
      </React.Fragment>
    ) : (
      <Alert message="The queue is closed" type="info" banner />
    );
  };

  // open or close the office hour block (by TA)
  queueOpenClose = () => {
    this.doPatch(
      this.state.endpoint_schedule + this.props.oh_id + "/",
      data => {
        this.getData();
      },
      JSON.stringify({
        oh_status: this.state.oh_status + 1
      })
    );
  };

  // render TA's view
  renderTA = () => {
    return (
      <React.Fragment>
        <div style={{ display: "flex" }}>
          <span
            style={{
              display: "flex",
              marginLeft: "auto"
            }}
          >
            <Button
              style={{ marginBottom: 20 }}
              type={
                this.state.oh_status == status.open
                  ? "danger"
                  : this.state.oh_status == status.close
                  ? "primary"
                  : "secondary"
              }
              disabled={this.state.oh_status == status.over}
              icon={this.state.oh_status == status.open ? "lock" : "unlock"}
              onClick={this.queueOpenClose}
            >
              {this.state.oh_status == status.open
                ? "End Office Hours"
                : "Start Office Hours"}
            </Button>
          </span>
        </div>
        {this.state.oh_status == status.open && this.renderTicketListTA()}
      </React.Fragment>
    );
  };

  render() {
    const { isTA } = this.props;
    return (
      <React.Fragment>
        <Divider> Queue </Divider>
        {isTA ? this.renderTA() : this.renderStudent()}
      </React.Fragment>
    );
  }
}
