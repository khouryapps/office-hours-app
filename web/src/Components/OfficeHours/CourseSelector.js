import React, { Component } from "react";
import AppComponent from "../AppComponent";
import Content from "../Content";
import Schedule from "./Schedule";
import { AddCourseForm, FeedbackForm } from "./Forms";

import { Table, Divider, Icon, Alert } from "antd";

export default class CourseSelector extends AppComponent {
  state = {
    endpoint_oh: "/api/officehours/ta/",
    endpoint_courses: "/api/officehours/profile/course/",
    endpoint_mytickets: "/api/officehours/profile/ticket/",

    endpoint_ta: "/api/ta/student/",
    ta: null,

    endpoint_sections: "/api/schedule/",
    sections: [],

    loading: true,
    courses: [],
    update: false,

    selected_course: null,
    ticket_id: null,
    selectedRowKeys: []
  };

  // get courses user is registered at the current semester
  getStudent = () => {
    const { user } = this.props;
    this.doGet(
      this.state.endpoint_sections +
        "?semester=" +
        this.props.semesters.join(",") +
        "&deleted=False",
      sections => {
        this.doGet(
          this.state.endpoint_ta +
            "?student__profile__user__username=" +
            this.props.user.username,
          ta => {
            // ta = ta && ta.length > 0 ? ta[0] : null;
            const course_list = this.course_list_from_sections(sections).map(
              c => {
                c.local =
                  sections.filter(
                    s => s.course == c.id && user.campuses.includes(s.campus)
                  ).length > 0;
                c.online =
                  sections.filter(s => s.course == c.id && s.campus == 118)
                    .length > 0;
                return c;
              }
            );
            const courses_local = course_list.filter(
              el => el.local || el.online
            );
            let courses = courses_local.filter(el =>
              ta[0].transcript
                .filter(
                  a =>
                    !a.withdrawn &&
                    this.get_semester(a.semester).code ==
                      this.get_semester(this.props.semesters[0]).code
                )
                .map(a => a.course)
                .includes(el.id)
            );
            console.log(courses);
            this.setState({
              courses: courses,
              loading: false,
              selectedRowKeys: [courses[0].id]
            });
            this.checkIfFeedbackIsRequired();
          }
        );
      }
    );
  };

  getTA = () => {
    this.doGet(
      this.state.endpoint_oh + "?semester=" + this.props.semesters.join(","),
      data => {
        console.log(data);
        this.setState({
          courses: data,
          loading: false,
          selectedRowKeys: [data[0].id]
        });
      }
    );
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
    isTA ? this.getTA() : this.getStudent();
  };

  // checks if the previously attended office hours require student's feedback
  checkIfFeedbackIsRequired = () => {
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

  // select the course
  onSelectChange = selectedRowKeys => {
    if (selectedRowKeys.length > 1) {
      const lastSelectedRowIndex = [...selectedRowKeys].pop();
      this.setState({ selectedRowKeys: lastSelectedRowIndex });
    }
    this.setState({ selectedRowKeys });
  };

  // delete the course from the list
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
        <p>Welcome to the new Office Hours Tracker</p>
        {!loading && !courses.length && isTA ? (
          <Alert
            message="You are not a TA this semester"
            description="this tab is meant for TA usage only"
            type="info"
            showIcon
          />
        ) : (
          <div>
            <Divider orientation="left">Select a course</Divider>
            <div
              style={{
                marginBottom: "20px",
                textAlign: "right"
              }}
            >
              {/* {!isTA && <AddCourseForm {...this.props} update={this.getData} />} */}
            </div>

            <Table
              rowSelection={rowSelection}
              dataSource={courses}
              columns={TAcolumns}
              loading={loading}
              pagination={false}
              rowKey="id"
            />
            {selectedRowKeys[0] != null && (
              <React.Fragment>
                <Schedule {...this.props} course_id={selectedRowKeys[0]} />
              </React.Fragment>
            )}
            <FeedbackForm
              {...this.props}
              ticket_id={this.state.ticket_id}
              visible={this.state.expectingFeedback}
              handleSubmit={this.checkIfFeedbackIsRequired}
              question={this.state.question}
              ta_helped={this.state.ta_helped}
              status={this.state.status}
            />
          </div>
        )}
      </Content>
    );
  }
}
