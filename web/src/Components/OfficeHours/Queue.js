import React, { Component } from "react";
import AppComponent from "../AppComponent";
import { renderStatus } from "../Utils";
// import WebSocketInstance from "./WebSocket";
import { FeedbackForm } from "./Forms";
import { QueueForm } from "./Forms";
import "./OfficeHours.css";

import {
  Input,
  Button,
  List,
  Avatar,
  Steps,
  Typography,
  Radio,
  Divider
} from "antd";

const { Title } = Typography;
const { TextArea } = Input;

export default class Queue extends AppComponent {
  state = {
    endpoint_status: "/api/officehours/ticket/status/",
    endpoint_tickets: "/api/officehours/ticket/",

    stage: 0,
    loading: true,
    is_edit: false,
    is_feedback: false,
    tickets: []
  };

  componentDidMount() {
    this.getData();
    setInterval(() => {
      console.log("fetch");
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
      prevProps.queue_id !== this.props.queue_id
    ) {
      this.getData();
    }
  }

  getData = () => {
    const { isTA } = this.props;
    isTA ? this.getDataTA() : this.getDataStudent();
  };

  getDataTA = () => {
    this.doGet(
      this.state.endpoint_tickets + "?queue=" + this.props.queue_id,
      data =>
        this.setState({
          loading: false,
          tickets: data.slice()
        })
    );
  };

  getDataStudent = () => {
    this.doGet(
      this.state.endpoint_tickets + "?queue=" + this.props.queue_id,
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
                ta_helped: my_ticket.ta_helped,
                status: my_ticket.status,
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

  handleSave = id => {
    console.log(id);
      if (this.state.my_ticket.question) {
          this.doPatch(
              this.state.endpoint_tickets + id + "/edit/",
              () => {
                  this.getData();
              },
              JSON.stringify({
                  question: this.state.question,
                  public: this.state.public
              })
          )
      } else {
          return null;
      }
    this.setState({ is_edit: !this.state.is_edit });
  };

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
    ) : null;
  };

  action = (id, action) => {
    console.log(id);
    this.doPatch(
      this.state.endpoint_tickets + id + "/status/",
      () => {
        this.setState({ loading: true });

        this.getData();
      },
      JSON.stringify({ status: action })
    );
  };

  renderTicketListTA = () => {
    return (
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
    );
  };

  renderTicketListStudent = () => {
    return this.state.tickets.length ? (
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
              avatar={<Avatar size="large" src={item.creator.photo_url} />}
              title={item.creator.full_name}
              description={
                item.public ? item.question : "[-Message is Hidden-]"
              }
            />
            <div> {renderStatus(item.status)}</div>
          </List.Item>
        )}
      ></List>
    ) : null;
  };

  renderMyTicket = () => {
    const { my_ticket } = this.state;
    console.log(my_ticket);
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
          title={my_ticket.creator.full_name}
          description={
            !this.state.is_edit
              ? my_ticket.question
              : this.renderQuestionEditBlock()
          }
        />
        {!this.state.is_edit && <div> {renderStatus(my_ticket.status)}</div>}
      </List.Item>
    ) : null;
  };

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

  renderQueueSteps = () => {
    const { Step } = Steps;

    return (
      <Steps className="QueueSteps" size="small" current={this.state.stage}>
        <Step title="Submit a question to enter the queue" />
        <Step title="Wait" />
        <Step title="Get help" />
        <Step title="Leave feedback"></Step>
      </Steps>
    );
  };

  renderStudent = () => {
    return (
      <React.Fragment>
        <div className="QueueSteps">{this.renderQueueSteps()}</div>
        <div className="Queue">
          {this.renderPositionInQueue()}
          {this.renderTicketListStudent()}
          {this.renderMyTicket()}
          {this.state.stage == 0 && (
            <QueueForm {...this.props} handleSubmit={this.handleSubmit} />
          )}
        </div>
        <FeedbackForm
          {...this.props}
          ticket_id={this.state.ticket_id}
          visible={this.state.stage == 3}
          handleSubmit={this.handleSubmit}
          question={this.state.question}
          ta_helped={this.state.ta_helped}
          status={this.state.status}
        />
      </React.Fragment>
    );
  };

  renderTA = () => {
    return <React.Fragment>{this.renderTicketListTA()}</React.Fragment>;
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
