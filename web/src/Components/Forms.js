import React, { Component } from "react";
import AppComponent from "./AdminComponents/AppComponent";
import { renderStatus } from "./AdminComponents/Utils";

import { Form, Input, Select, Button, Typography, Radio, Modal } from "antd";

const { Text } = Typography;
const Option = Select.Option;

const FeedbackForm = Form.create({ name: "feedback" })(
  class extends AppComponent {
    state = {
      message: "",
      endpoint_feedback: "/api/officehours/ticket/",
      endpoint_tickets: "/api/officehours/ticket/"
    };

    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.doPost(
            this.state.endpoint_feedback + this.props.ticket_id + "/feedback/",
            () => {
              this.props.form.resetFields();
              this.handleClose();
            },
            JSON.stringify(values)
          );
        }
      });
    };

    handleClose = () => {
      this.doPatch(
        this.state.endpoint_tickets + this.props.ticket_id + "/edit/",
        () => {},
        JSON.stringify({
          expecting_feedback: false
        })
      );
      this.props.handleSubmit();
    };

    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Modal
          footer={null}
          title={"Feedback"}
          centered
          visible={this.props.visible}
          okText="Submit"
          maskClosable={false}
          onCancel={this.handleClose}
        >
          <div>
            <Text strong>Your question:</Text>
          </div>
          <div>{this.props.question}</div>
          <div style={{ float: "right" }}>
            {renderStatus(this.props.status)}
            <Text type="secondary"> by @{this.props.ta_helped}</Text>
          </div>
          <br />
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label="Problem Resolved">
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

const QueueForm = Form.create({ name: "queue" })(
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
          style={
            {
              // textAlign: "center"
            }
          }
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
                  style={{ width: 360 }}
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

const AddCourseForm = Form.create({ name: "add_course" })(
  class extends AppComponent {
    state = {
      message: "",
      endpoint_courses: "/api/officehours/courses/",
      endpoint_sections: "/api/schedule/",
      sections: [],
      loading_sections: true
    };

    componentDidMount() {
      this.getData();
    }

    getData = () => {
      this.doGet(
        this.state.endpoint_sections +
          "?semester=" +
          this.props.semesters.join(","),
        data => this.setState({ sections: data, loading_sections: false })
      );
    };

    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        console.log(values);
        if (!err) {
          this.doPatch(
            this.state.endpoint_courses,
            () => {
              this.props.form.resetFields();
              this.props.update();
            },
            JSON.stringify(values)
          );
        }
      });
    };

    render() {
      const { getFieldDecorator } = this.props.form;

      const { sections } = this.state;

      const course_semester_list = sections.map(el => {
        return {
          course: el.course,
          semester: el.semester,
          key: el.course + "-" + el.semester
        };
      });
      const course_semester_list_keys = course_semester_list.map(el => el.key);
      const distinct_course_semester_list = course_semester_list.filter(
        (obj, pos, arr) => course_semester_list_keys.indexOf(obj.key) == pos
        // && this.get_course(obj.course).number < 5000
      );

      return (
        <Form onSubmit={this.handleSubmit} layout="inline">
          <Form.Item wrapperCol={{ sm: 24 }} style={{ width: "40%" }}>
            {getFieldDecorator("course", {
              rules: [{ required: true, message: "Please select a course" }]
            })(
              <Select
                showSearch
                filterOption={this.filter}
                placeholder="Select a course to add"
              >
                {distinct_course_semester_list.map(el => (
                  <Option key={el.course} value={el.course}>
                    {this.print_full_course(el.course)}{" "}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      );
    }
  }
);

export { AddCourseForm, QueueForm, FeedbackForm };
