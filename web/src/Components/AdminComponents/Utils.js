import React, { Component } from "react";
import { Link } from "react-router-dom";
import NumberFormat from "react-number-format";
import key from "weak-key/index";
import moment from "moment-timezone";

import { Divider, Tooltip, Tag, Icon, Spin as AntSpin, message } from "antd/lib/index";

export function copy(o) {
  var output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
    v = o[key];
    output[key] = typeof v === "object" ? copy(v) : v;
  }
  return output;
}

export function get_check_nocheck(val) {
  return val ? get_check() : get_nocheck();
}

export function get_check() {
  return (
    <Icon
      key="check"
      type="check-circle"
      theme="twoTone"
      twoToneColor="#52c41a"
    />
  );
}

export function get_nocheck() {
  return (
    <Icon
      key="nocheck"
      type="close-circle"
      theme="twoTone"
      twoToneColor="#eb2f96"
    />
  );
}

export function get_nonecheck() {
  return (
    <Icon
      key="nonecheck"
      type="minus-circle"
      theme="twoTone"
      twoToneColor="#999999"
    />
  );
}

export function get_pendingcheck() {
  return <AntSpin size="small" />;
}

export function get_merit_tag(rating) {
  if (rating == "Excellent") {
    return <Tag color="green">{rating}</Tag>;
  } else if (rating == "Satisfactory") {
    return <Tag color="blue">{rating}</Tag>;
  } else if (rating == "Unsatisfactory") {
    return <Tag color="red">{rating}</Tag>;
  } else {
    return "-";
  }
}

// ----- TABLE LIST FORMATTING -----

export function add_dividers(list) {
  return list.reduce(
    (r, a) =>
      r.length
        ? r.concat([<Divider type="vertical" key={"div-" + r.length} />, a])
        : [a],
    []
  );
}

export function add_dividers_horiz(list) {
  return list.reduce(
    (r, a) =>
      r.length
        ? r.concat([
            <Divider
              style={{ margin: "-6px 0px 4px 0px" }}
              key={"div-" + r.length}
            />,
            a
          ])
        : [a],
    []
  );
}

export function add_brs(list) {
  return list.reduce(
    (r, a) => (r.length ? r.concat([<br key={"br-" + r.length} />, a]) : [a]),
    []
  );
}

export function if_empty(list, other) {
  return list.length > 0 ? list : other;
}

// ----- ARRAY FUNCTIONS -----

export function avg(arr) {
  if (arr.length == 0) {
    return 0;
  }
  return arr.reduce((r, a) => r + a, 0) / (1.0 * arr.length);
}

// ----- STRING FUNCTIONS -----

export function oxford(list) {
  if (!list) {
    return "";
  }
  if (list.length == 0) {
    return "";
  }
  if (list.length == 1) {
    return list[0];
  }
  if (list.length == 2) {
    return [list[0], " and ", list[1]];
  }

  return list
    .slice(0, -1)
    .reduce((r, a) => r.concat([a, ", "]), [])
    .concat([" and ", list[list.length - 1]]);
}

export function format_percent(value, precision) {
  return (
    <NumberFormat
      decimalScale={precision}
      displayType={"text"}
      suffix="%"
      value={100 * value}
    />
  );
}

export function format_decimal(value, precision) {
  return (
    <NumberFormat decimalScale={precision} displayType={"text"} value={value} />
  );
}

export function format_nuid(nuid) {
  if (nuid) {
    var s = nuid + "";
    while (s.length < 9) {
      s = "0" + s;
    }
    return s;
  } else {
    return "";
  }
}

// ----- LOAD COUNT FUNCTIONS -----

export function round_load(val) {
  return Math.round(val * 24) / 24.0;
}

export function get_section_loadcount(section) {
  return (
    (section.instructors.length > 0
      ? (section.loadcount * 1.0) / section.instructors.length
      : section.loadcount) / (section.crosslist ? 2.0 : 1.0)
  );
}

export function get_load_total(load) {
  if (!load) {
    return 0;
  }

  var result = load.load;
  if (load.overload) {
    result += load.overload;
  }
  if (load.buyout) {
    result -= load.buyout;
  }
  if (load.reduction) {
    result -= load.reduction;
  }

  return result;
}

export function print_load(load) {
  if (!load) {
    return "";
  }

  var result = load.load;
  if (load.overload) {
    result += " + " + load.overload;
  }
  if (load.buyout || load.reduction) {
    result += " − " + (load.buyout + load.reduction);
  }

  return result;
}

// ----- TA FUNCTIONS -----

export function is_assigned(state) {
  return (
    state == "Assigned" ||
    state == "Accepted" ||
    state == "Processed" ||
    state == "Hired"
  );
}

export function getTAStatus(ta_id, apps) {
  return apps.filter(
    el => el.ta.id == ta_id && el.state != "Reviewed" && el.state != "Submitted"
  );
}

export function renderStatus(status) {
  const clr =
    status == "Submitted" || (status == "Reviewed") | (status == "In Line")
      ? "grey"
      : status == "Assigned" || status == "Processed"
      ? "orange"
      : status == "Accepted" || status == "Hired" || status == "Open"
      ? "green"
      : "red";
  return <Tag color={clr}>{status}</Tag>;
}

export function renderAuditStatus(status) {
  const clr =
    status == "Requested" || status == "Submitted"
      ? "grey"
      : status == "Accurate"
      ? "green"
      : "red";
  return <Tag color={clr}>{status}</Tag>;
}

export function getSemesterWeeks(semester) {
  const start = moment(semester.startdate, "YYYY-MM-DD");
  const end = moment(semester.enddate, "YYYY-MM-DD");

  var date = start;
  var dates = [start];
  while (date < end) {
    date = moment(date).add(1, "days");
    dates.push(date);
  }

  return dates.reduce((r, a) => {
    (r[a.format("ww")] = r[a.format("ww")] || []).push(a);
    return r;
  }, {});
}

export function getWeekDeadline(lastdate) {
  //return lastdate.clone().add(3, 'd').tz("America/New_York").set({ hour: 23, minute: 59, second: 59 });
  return lastdate
    .clone()
    .add(1, "weeks")
    .tz("America/New_York")
    .isoWeekday("Monday")
    .set({ hour: 23, minute: 59, second: 59 });
}

export function isWeekConfirmable(lastdate) {
  return getWeekDeadline(lastdate) >= moment();
}

class Spin extends Component {
  render() {
    return (
      <div className="loading-center">
        <AntSpin tip={this.props.tip} />
      </div>
    );
  }
}

export { Spin };
