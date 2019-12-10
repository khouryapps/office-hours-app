import React, { Component } from "react";
import key from "weak-key";

import { Select, Form } from 'antd';
import AppComponent from './AppComponent';

const Option = Select.Option;

const MenuSelect = Form.create({ name: 'form_in_navbar' })(
  class extends AppComponent {

  onClick = (value) => {
    this.props.data.forEach(el => { if (el.id == value) { this.props.onSet(el.id); }});
  }

  render() {
    const { onSet, data, selected, width, form, ...other } = this.props;
    const { getFieldDecorator } = form;

    return getFieldDecorator('menu', {
              initialValue: selected,
              onChange: this.onClick,
            })( <Select style={{ width: width }}>
                { data.map(el => (
                  <Option key={ el.id } value={ el.id }>{ el.name }</Option>
                 )) }
              </Select> );
  }
});

export default MenuSelect;
