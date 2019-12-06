import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter
} from "react-router-dom";
import queryString from "query-string";
import key from "weak-key";
import LoggedInComponent from "./LoggedInComponent";
import { oxford } from "./Utils";

import {
  Layout,
  Menu,
  Breadcrumb,
  Icon,
  Table,
  Tag,
  Tooltip,
  Spin,
  Divider,
  message
} from "antd";
const { SubMenu } = Menu;
const { Content, Sider, Footer } = Layout;

class AppComponent extends LoggedInComponent {
  STATUS_GOOD = 0;
  STATUS_FAILED = 1;
  STATUS_PENDING = 2;
  STATUS_NONE = 3;

  get_text = e => {
    return e.props && e.props.children
      ? this.get_text(e.props.children)
      : Array.isArray(e)
      ? e
          .map(f => this.get_text(f))
          .flat()
          .reduce((r, a) => r + a, "")
      : e.toLowerCase
      ? e
      : "";
  };

  filter = (input, option) => {
    const text = this.get_text(option);
    return (
      text.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
      option.props.is_header
    );
  };

  grid = { gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 };

  grid_calendar = { gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 };

  grid_preference = { gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 };

  grid_photos = { gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 };

  getLink = dest => {
    return dest.startsWith("http")
      ? dest
      : dest + this.props.getQueryString(false);
  };

  is_beta = () =>
    window.location.hostname == "admin-beta.khoury.northeastern.edu";
  is_local = () => window.location.hostname == "127.0.0.1";

  top_margin = () => {
    return (
      32 +
      (this.is_beta() || this.is_local() ? 32 : 0) +
      (this.props.user.impersonator ? 32 : 0)
    );
  };

  permission = (type, required) => {
    const perm = this.props.user.groups.map(el => el.name);
    if (type == "can" || type == "cannot") {
      if (perm.includes("admin") && type == "can") return type == "can";
      return type == "can" ? perm.includes(required) : !perm.includes(required);
    } else if (type == "is") {
      return perm.includes(required);
    }
  }
  
  // Due to Django stupidity, it will return multiple copies of sections due to sorting.  We keep only the first one here.
  deduplicateSections = data => {
    const ids = [];
    return data.filter(e => {
      if (ids.includes(e.id)) {
        return false;
      } else {
        ids.push(e.id);
        return true;
      }
    });
  };

  // turns a table into something react-csv likes
  getCsvData = (data, columns) => {
    let all_data = [];
    data.forEach(e => {
      let dict = {};
      columns.forEach(column => {
        dict[column.title] = column.download ? column.download(e) : null;
      });
      all_data.push(dict);
    });
    return all_data;
  };

  lookup = (id, object, name) => {
    const value = object[id];
    if (!value) {
      if (id) {
        message.error("Could not find " + name + " with ID " + id + ".");
      }
      return null;
    }

    return value;
  };

  get_semester = semester_id => {
    return this.lookup(semester_id, this.props.semester_list, "semester");
  };

  get_semestertype = semestertype_id => {
    return this.lookup(
      semestertype_id,
      this.props.semestertype_list,
      "semester type"
    );
  };

  get_year = year_id => {
    return year_id;
  };

  calendar_year = (semester_id) => {
    const str = this.get_semester(semester_id).name;
    return str.substring(str.length-4);
  }

  get_committee = committee_id => {
    return this.lookup(committee_id, this.props.committee_list, "committee");
  };

  get_position = position_id => {
    return this.lookup(position_id, this.props.position_list, "position");
  };

  get_course = course_id => {
    return this.lookup(course_id, this.props.course_list, "course");
  };

  get_fund = fund_id => {
    return this.lookup(fund_id, this.props.fund_list, "fund");
  };

  get_grade = grade_id => {
    return this.lookup(grade_id, this.props.grade_list, "grade");
  };

  get_nupath = nupath_id => {
    return this.lookup(nupath_id, this.props.nupath_list, "NUPath");
  };

  get_nucore = nucore_id => {
    return this.lookup(nucore_id, this.props.nucore_list, "NUCore");
  };

  get_instructor = instructor_id => {
    return this.lookup(instructor_id, this.props.instructor_list, "instructor");
  };

  get_major = major_id => {
    return this.lookup(major_id, this.props.major_list, "major");
  };

  get_degreetype = degreetype_id => {
    return this.lookup(
      degreetype_id,
      this.props.degreetype_list,
      "degree type"
    );
  };

  get_degree = degree_id => {
    return this.lookup(degree_id, this.props.degree_list, "degree");
  };

  get_instructorrank = rank_id => {
    return this.lookup(
      rank_id,
      this.props.instructorrank_list,
      "instructor rank"
    );
  };

  get_instructortype = type_id => {
    return this.instructortype_list().find(e => e.id == type_id);
  };

  get_method = method_id => {
    return this.lookup(method_id, this.props.method_list, "method");
  };

  get_campus = campus_id => {
    return this.lookup(campus_id, this.props.campus_list, "campus");
  };

  get_subject = subject_id => {
    return this.lookup(subject_id, this.props.subject_list, "subject");
  };

  get_room = room_id => {
    return this.lookup(room_id, this.props.room_list, "room");
  };

  get_meetingtime = meetingtime_id => {
    return this.lookup(
      meetingtime_id,
      this.props.meetingtime_list,
      "meeting time"
    );
  };

  cycle_to_text = short_hand => {
    return short_hand == "FL" ? "Fall" : "Spring";
  };

  course_comparator = (a, b) => {
    return a.subject == b.subject
      ? a.number - b.number
      : this.get_subject(a.subject).abbrv.localeCompare(
          this.get_subject(b.subject).abbrv
        );
  };

  meetingtime_comparator = (a, b) => {
    const compare_element = (a, b) => {
      return a < b ? -1 : a > b ? 1 : 0;
    };

    const compare = (a, b) => {
      const res = a.map((e, i) => compare_element(e, b[i])).find(el => el != 0);
      return res ? res : 0;
    };

    const compare_mtb = (a, b) => {
      if (!a) {
        return -1;
      }
      if (!b) {
        return 1;
      }

      const a_arr = [a.day, a.start, a.end];
      const b_arr = [b.day, b.start, b.end];

      return compare(a_arr, b_arr);
    };

    var a_mtb = a.meetingtimeblocks;
    var b_mtb = b.meetingtimeblocks;

    a_mtb.sort(compare_mtb);
    b_mtb.sort(compare_mtb);

    const res = a_mtb
      .map((e, i) => compare_mtb(e, b_mtb[i]))
      .find(el => el != 0);
    return res ? res : 0;
  };

  instructor_comparator = (a, b) => {
    return a.lastname == b.lastname
      ? a.firstname.localeCompare(b.firstname)
      : a.lastname.localeCompare(b.lastname);
  };

  lookup_list = (name, sorter) => {
    const list = Object.values(this.props[name]);
    if (sorter) {
      list.sort(sorter);
    }
    return list;
  };

  semester_sort = (a, b) => (b ? b.code : 0) - (a ? a.code : 0);

  semester_list = () => {
    return this.lookup_list("semester_list", this.semester_sort);
  };

  semester_list_grouped = () => {
    const s = this.props.semesters_list_grouped;
    const result = Object.keys(s).sort((a, b) =>
      s[b][0].startdate.localeCompare(s[a][0].startdate)
    );
    return result.map(el => {
      return { id: el, name: el };
    });
  };

  get_year = () => {
    return this.get_semester(this.props.semesters[0]).year;
  };

  semestertype_list = () => {
    return this.lookup_list("semestertype_list", (a, b) => a.id - b.id);
  };

  year_list = () => {
    var years = [];
    Object.values(this.props.semester_list)
      .map(el => el.year)
      .forEach(el => {
        if (!years.includes(el)) {
          years.push(el);
        }
      });
    years.sort();
    return years;
  };

  campus_sort = (a, b) => a.name.localeCompare(b.name);

  campus_list = () => {
    return this.lookup_list("campus_list", this.campus_sort);
  };

  committee_list = () => {
    return this.lookup_list("committee_list", (a, b) =>
      a.name.localeCompare(b.name)
    );
  };

  committeeyear_list = () => {
    return this.lookup_list("committeeyear_list", (a, b) =>
      a.year == b.year
        ? this.get_committee(a.committee).name.localeCompare(
            this.get_committee(b.committee).name
          )
        : a.year - b.year
    );
  };

  position_list = () => {
    return this.lookup_list("position_list", (a, b) =>
      a.name.localeCompare(b.name)
    );
  };

  positionyear_list = () => {
    return this.lookup_list("positionyear_list", (a, b) =>
      a.year == b.year
        ? this.get_position(a.position).name.localeCompare(
            this.get_position(b.position).name
          )
        : a.year - b.year
    );
  };

  course_list = () => {
    return this.lookup_list("course_list", this.course_comparator);
  };

  fund_list = () => {
    return this.lookup_list("fund_list", (a, b) => a.index - b.index);
  };

  grade_sort = (a, b) => (a ? a.grade : "Z").localeCompare(b ? b.grade : "Z");

  grade_list = () => {
    return this.lookup_list("grade_list", this.grade_sort);
  };

  course_list_from_sections = sections => {
    const courses = sections.reduce((r, a) => {
      r[a.course] = 1;
      return r;
    }, {});
    return this.course_list().filter(el => courses[el.id]);
  };

  instructor_list_from_sections = sections => {
    const instructors = sections.reduce((r, a) => {
      a.instructors.forEach(i => (r[i] = 1));
      return r;
    }, {});
    return this.instructor_list().filter(el => instructors[el.id]);
  };

  course_campus_semester_list_from_sections = sections => {
    var objects = Object.values(
      sections
        .filter(s => !s.deleted)
        .reduce((r, a) => {
          const key = a.course + "-" + a.campus + "-" + a.semester;
          r[key] = {
            course: a.course,
            campus: a.campus,
            semester: a.semester,
            ta_ratio: this.get_course(a.course).ta_ratio,
            enrollment: a.enrollment + (r[key] ? r[key].enrollment : 0)
          };
          return r;
        }, {})
    );
    objects.sort((a, b) =>
      this.course_comparator(
        this.get_course(a.course),
        this.get_course(b.course)
      )
    );
    return objects;
  };

  course_list_missing_from_sections = sections => {
    const courses = sections.reduce((r, a) => {
      r[a.course] = 1;
      return r;
    }, {});
    return this.course_list().filter(el => !courses[el.id]);
  };

  instructor_list = () => {
    return this.lookup_list("instructor_list", this.instructor_comparator);
  };

  instructorrank_list = () => {
    return this.lookup_list("instructorrank_list", (a, b) =>
      a.mytype_id == b.mytype_id
        ? a.rank.localeCompare(b.rank)
        : a.mytype_id - b.mytype_id
    );
  };

  instructortype_list = () => {
    const r = this.instructorrank_list().reduce((r, a) => { r[a.mytype] = { id: a.mytype_id, mytype: a.mytype }; return r; }, {});
    return Object.values(r);
  }

  major_list = () => {
    return this.lookup_list("major_list", (a, b) =>
      a.name.localeCompare(b.name)
    );
  };

  degreetype_list = () => {
    return this.lookup_list("degreetype_list", (a, b) =>
      a.name.localeCompare(b.name)
    );
  };

  degree_list = () => {
    return this.lookup_list("degree_list", (a, b) =>
      this.get_degreetype(a.degree_type).abbrv ==
      this.get_degreetype(b.degree_type).abbrv
        ? a.name.localeCompare(b.name)
        : this.get_degreetype(a.degree_type).abbrv.localeCompare(
            this.get_degreetype(b.degree_type).abbrv
          )
    );
  };

  meetingtime_list = () => {
    return this.lookup_list("meetingtime_list", this.meetingtime_comparator);
  };

  method_list = () => {
    return this.lookup_list("method_list", (a, b) =>
      a.name.localeCompare(b.name)
    );
  };

  room_list = () => {
    return this.lookup_list("room_list", (a, b) =>
      a.building.name == b.building.name
        ? a.number.localeCompare(b.number)
        : a.building.name.localeCompare(b.building.name)
    );
  };

  building_list = () => {
    var buildings = [];
    Object.values(this.props.room_list)
      .map(el => el.building)
      .forEach(el => {
        if (!buildings.find(myel => myel.id == el.id)) {
          buildings.push(el);
        }
      });
    buildings.sort((a, b) => a.name.localeCompare(b.name));
    return buildings;
  };

  subject_list = () => {
    return this.lookup_list("subject_list", (a, b) =>
      a.abbrv.localeCompare(b.abbrv)
    );
  };

  print_semester = semester_id => {
    if (!semester_id) {
      return null;
    }
    const semester = this.get_semester(semester_id);
    return semester.name;
  };

  print_year = year_id => {
    return year_id - 1 + "-" + year_id;
  };

  print_semestertype = semestertype_id => {
    const semestertype = this.get_semestertype(semestertype_id);
    return semestertype.name;
  };

  print_major = major_id => {
    return this.get_major(major_id).name;
  };

  print_degreetype = degreetype_id => {
    return this.get_degreetype(degreetype_id).abbrv;
  };

  print_full_degreetype = degreetype_id => {
    return this.get_degreetype(degreetype_id).name;
  };

  print_degree = degree_id => {
    const degree = this.get_degree(degree_id);
    return (
      this.print_degreetype(degree.degree_type) +
      " " +
      this.print_major(degree.major)
    );
  };

  print_committee = committee_id => {
    return this.get_committee(committee_id).name;
  };

  print_committee_description = committee_id => {
    return this.get_committee(committee_id).description;
  };

  print_position = position_id => {
    return this.get_position(position_id).name;
  };

  print_position_description = position_id => {
    return this.get_position(position_id).description;
  };

  link_committee = committee_id => {
    return (
      <Link
        key={committee_id}
        to={this.getLink("/faculty/committees/" + committee_id + "/")}
      >
        {this.print_committee(committee_id)}
      </Link>
    );
  };

  link_position = position_id => {
    return (
      <Link
        key={position_id}
        to={this.getLink("/faculty/positions/" + position_id + "/")}
      >
        {this.print_position(position_id)}
      </Link>
    );
  };

  print_committeeassignment = ca => {
    return this.print_committee(ca.committee) + (ca.chair ? " (Chair)" : "");
  };

  print_committeemembership_instructor = cm => {
    return [this.link_full_instructor(cm.instructor)]
      .concat(
        cm.chair
          ? [
              "\u00a0",
              <Tag size="small" key={"chair-" + cm.id} color="orange">
                Chair
              </Tag>
            ]
          : []
      )
      .concat(
        cm.ex_officio
          ? [
              "\u00a0",
              <Tag size="small" key={"ex_officio-" + cm.id} color="green">
                Ex officio
              </Tag>
            ]
          : []
      );
  };

  print_fund = fund_id => {
    return this.get_fund(fund_id).index;
  };

  print_full_fund = fund_id => {
    const fund = this.get_fund(fund_id);
    return fund.index + " " + fund.name;
  };

  print_grade = grade_id => {
    if (!grade_id) {
      return "";
    }
    return this.get_grade(grade_id).grade;
  };

  link_committeeassignment = ca => {
    return [
      this.link_committee(ca.committee),
      ca.chair
        ? [
            "\u00a0",
            <Tag key={"chair-" + ca.id} color="orange">
              Chair
            </Tag>
          ]
        : ""
    ];
  };

  print_course = course_id => {
    const course = this.get_course(course_id);
    const subject = this.get_subject(course.subject);
    return subject.abbrv + " " + course.number;
  };

  print_section = section => {
    return (
      this.print_course(section.course) +
      " section " +
      section.number +
      " (CRN " +
      section.crn +
      ")"
    );
  };

  print_subject = subject_id => {
    const subject = this.get_subject(subject_id);
    return subject.name;
  };

  print_subject_code = subject_id => {
    const subject = this.get_subject(subject_id);
    return subject.abbrv;
  };

  print_full_course = course_id => {
    return (
      <span key={"course-" + course_id}>
        {this.print_course(course_id)} {this.print_course_title(course_id)}
      </span>
    );
  };

  print_full_course_with_details = course => {
    return (
      <span key={"course-" + course.course}>
        {"CRN:" + course.crn + " "}
        {this.print_course(course.course) + "-" + course.number}{" "}
        {this.print_course_title(course.course)}
      </span>
    );
  };

  print_course_description = course_id => {
    return this.get_course(course_id).description;
  };

  print_course_description_short = course_id => {
    var desc = this.print_course_description(course_id);

    if (desc.length > 150) {
      desc = desc.substring(0, 147) + "...";
    }

    return desc;
  };

  print_course_title = course_id => {
    const course = this.get_course(course_id);
    return <i>{course.title}</i>;
  };

  link_course = course_id => {
    return (
      <Link
        key={course_id}
        to={this.getLink("/teaching/courses/" + course_id + "/")}
      >
        {this.print_course(course_id)}
      </Link>
    );
  };

  link_ta = (ta_id, name) => {
    return (
      <Link key={ta_id} to={this.getLink("/staff/ta/view/" + ta_id + "/")}>
        {name}
      </Link>
    );
  };

  link_full_course = course_id => {
    return (
      <Link
        key={course_id}
        to={this.getLink("/teaching/courses/" + course_id + "/")}
      >
        {this.print_full_course(course_id)}
      </Link>
    );
  };

  print_nupath = nupath_id => {
    const NUPATH_COLORS = {
      AD: "volcano",
      FQ: "green",
      ND: "geekblue",
      WI: "gold",
      CE: "magenta",
      ER: "purple"
    };
    const nupath = this.get_nupath(nupath_id);
    return (
      <Tooltip title={nupath.name} key={nupath.code}>
        <Tag color={NUPATH_COLORS[nupath.code]}>{nupath.code}</Tag>
      </Tooltip>
    );
  };

  print_nucore = nucore_id => {
    const NUCORE_COLORS = {
      T1: "orange",
      M1: "blue",
      M2: "red",
      W2: "cyan",
      C1: "lime"
    };
    const nucore = this.get_nucore(nucore_id);
    return (
      <Tooltip title={nucore.name} key={nucore.code}>
        <Tag color={NUCORE_COLORS[nucore.code]}>{nucore.code}</Tag>
      </Tooltip>
    );
  };

  print_campus = campus_id => {
    if (!campus_id) {
      return "";
    }
    const campus = this.get_campus(campus_id);
    return campus.name;
  };

  print_method = method_id => {
    if (!method_id) {
      return "";
    }
    const method = this.get_method(method_id);
    return method.name;
  };

  print_full_room = room_id => {
    if (!room_id) {
      return "";
    }
    const room = this.get_room(room_id);
    return room.building.name + " " + room.number;
  };

  print_room = room_id => {
    if (!room_id) {
      return "";
    }
    const room = this.get_room(room_id);
    return room.building.abbrv + " " + room.number;
  };

  link_room = room_id => {
    if (!room_id) {
      return "";
    }
    return (
      <Link key={room_id} to={this.getLink("/teaching/rooms/" + room_id + "/")}>
        {this.print_room(room_id)}
      </Link>
    );
  };

  link_full_room = room_id => {
    if (!room_id) {
      return "";
    }
    return (
      <Link key={room_id} to={this.getLink("/teaching/rooms/" + room_id + "/")}>
        {this.print_full_room(room_id)}
      </Link>
    );
  };

  print_instructor = instructor_id => {
    if (!instructor_id) {
      return "";
    }
    const instructor = this.get_instructor(instructor_id);
    return instructor.lastname + ", " + instructor.firstname[0] + ".";
  };

  print_instructor_list = instructors => {
    return oxford(instructors.map(el => this.print_instructor(el)));
  };

  print_full_instructor = instructor_id => {
    if (!instructor_id) {
      return "";
    }
    const instructor = this.get_instructor(instructor_id);
    return instructor.firstname + " " + instructor.lastname;
  };

  link_instructor = instructor_id => {
    return this.permission("can", "admin") ? (
      <Link
        key={instructor_id}
        to={this.getLink("/faculty/instructors/" + instructor_id + "/")}
      >
        {this.print_instructor(instructor_id)}
      </Link>
    ) : (
      this.print_instructor(instructor_id)
    );
  };

  link_full_instructor = instructor_id => {
    return this.permission("can", "admin") ? (
      <Link
        key={instructor_id}
        to={this.getLink("/faculty/instructors/" + instructor_id + "/")}
      >
        {this.print_full_instructor(instructor_id)}
      </Link>
    ) : (
      this.print_full_instructor(instructor_id)
    );
  };

  print_instructorrank = rank_id => {
    if (!rank_id) {
      return "";
    }
    const rank = this.get_instructorrank(rank_id);
    return rank.rank;
  };

  print_full_instructorrank = rank_id => {
    if (!rank_id) {
      return "";
    }
    const rank = this.get_instructorrank(rank_id);
    return rank.rank + " (" + rank.mytype + ")";
  };

  print_instructortype = type_id => {
    if (!type_id) {
      return "";
    }
    const type = this.get_instructortype(type_id);
    return type.mytype;
  };

  print_meetingtime = meetingtime_id => {
    if (!meetingtime_id) {
      return "";
    }
    const meetingtime = this.get_meetingtime(meetingtime_id);
    //    return ( meetingtime.popular ? "(" + meetingtime.sequence + ") " : "") + meetingtime.name;
    return meetingtime.name;
  };
}

export default AppComponent;
