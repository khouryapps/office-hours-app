import React, { Component } from "react";
import AppComponent from "./AdminComponents/AppComponent";
import Content from "./AdminComponents/Content";
import Schedule from "./Schedule";
import { AddCourseForm, FeedbackForm } from "./Forms";

import { Table, Divider, Icon } from "antd";

export default class CourseSelector extends AppComponent {
  state = {
    endpoint_profile: "/api/officehours/me/",
    endpoint_ta: "/api/officehours/ta/",
    endpoint_courses: "/api/officehours/courses/",
    endpoint_mytickets: "/api/officehours/myticket/",

    loading: true,
    courses: [],
    update: false,

    selected_course: null,
    ticket_id: null,
    selectedRowKeys: []
  };

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isTA !== this.props.isTA ||
      prevProps.semester !== this.props.semester
    ) {
      this.getData();
    }
  }

  getData = () => {
    const { isTA } = this.props;
    this.setState({ loading: true });
    isTA
      ? this.doGet(
          this.state.endpoint_ta +
            "?semester=" +
            this.props.semesters.join(","),
          data => this.setState({ courses: data, loading: false })
        )
      : this.doGet(this.state.endpoint_profile, data => {
          this.setState({ courses: data.courses, loading: false });
          this.handleSubmit();
        });
  };

  handleSubmit = () => {
    this.doGet(this.state.endpoint_mytickets, data => {
      console.log(data);
      if (data.length) {
        this.setState({
          ticket_id: data[0].id,
          expectingFeedback: true,
          question: data[0].question,
          status: data[0].status,
          ta_helped: data[0].ta_helped
        });
      } else {
        this.setState({ expectingFeedback: false });
      }
    });
  };

  onSelectChange = selectedRowKeys => {
    if (selectedRowKeys.length > 1) {
      const lastSelectedRowIndex = [...selectedRowKeys].pop();
      this.setState({ selectedRowKeys: lastSelectedRowIndex });
    }
    this.setState({ selectedRowKeys });
  };

  handleDelete = id => {
    this.doDelete(
      this.state.endpoint_courses,
      () => {
        this.getData();
      },
      JSON.stringify({ course: id })
    );
  };

  render() {
    const { selectedRowKeys, courses, loading } = this.state;
    const { semester, isTA } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      type: "radio"
    };

    const columns = [
      {
        title: "Course",
        key: "course",
        render: (text, record, idx) =>
          this.print_course(record.id) + " " + this.get_course(record.id).title
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        width: 90,
        render: (text, record, idx) => (
          <a
            key="approval"
            href="#"
            onClick={e => {
              e.preventDefault();
              this.handleDelete(record.id);
            }}
          >
            <Icon
              style={{ fontSize: "1.5em" }}
              type="close-square"
              theme="twoTone"
            />
          </a>
        )
      }
    ];

    const TAcolumns = [
      {
        title: "Course",
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
          <div
            style={{
              marginBottom: "20px",
              textAlign: "right"
            }}
          >
            {!isTA && <AddCourseForm {...this.props} update={this.getData} />}
          </div>
          <Table
            rowSelection={rowSelection}
            dataSource={courses}
            columns={isTA ? TAcolumns : columns}
            loading={loading}
            pagination={false}
            rowKey="id"
          />

          {selectedRowKeys[0] != null && (
            <React.Fragment>
              <Schedule {...this.props} course_id={selectedRowKeys[0]} />
            </React.Fragment>
          )}
        </React.Fragment>
        <FeedbackForm
          {...this.props}
          ticket_id={this.state.ticket_id}
          visible={this.state.expectingFeedback}
          handleSubmit={this.handleSubmit}
          question={this.state.question}
          ta_helped={this.state.ta_helped}
          status={this.state.status}
        />
      </Content>
    );
  }
}
