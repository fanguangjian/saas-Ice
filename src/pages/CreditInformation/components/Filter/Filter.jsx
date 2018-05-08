import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Input, Grid, Select, Button, DatePicker, Form } from '@icedesign/base';

import { FormBinderWrapper as IceFormBinderWrapper, FormBinder as IceFormBinder,
} from '@icedesign/form-binder';

const {Row, Col} = Grid;
const {Option} = Select;
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 12
    }
};

export default class Filter extends Component {
    constructor() {
        super();

        // 搜索框表单的对应的值，可以设置默认值
        this.state = {
            value: {}

        };
    }

    filterFormChange = (value) => {
        this.setState({
            value: value,
        });
    }

    handleSubmit() {
        this.props.onSubmit && this.props.onSubmit(this.state.value);
    }

    handleBusinessTypeChange(v, data){
        let value  = this.state.value;
        value.businessTypeName = data.label;

        this.setState({value});
    }

    handleTenantChange(v, data){
        let value  = this.state.value;
        value.tenantName = data.label;

        this.setState({value});
    }

    render() {
        return (
            <div className="pch-condition">
                <IceFormBinderWrapper value={this.state.value} onChange={this.filterFormChange}>
                    <Form size="large" direction="hoz">
                      <Row wrap>
                        <Col s="8" l="8">
                          <FormItem {...formItemLayout} label="贷款编号：">
                            <IceFormBinder
                              name="code"
                            >
                              <Input size="large" placeholder="贷款编号" />
                            </IceFormBinder>
                          </FormItem>

                        </Col>
                        <Col s="8" l="8">
                          <FormItem {...formItemLayout} label="主贷人姓名：">
                            <IceFormBinder
                              name="borrowerName"
                            >
                              <Input size="large" placeholder="主贷人姓名" />
                            </IceFormBinder>
                          </FormItem>
                        </Col>
                        <Col s="8" l="8">
                          <FormItem {...formItemLayout} label="申请开始时间：">
                            <IceFormBinder
                              name="submitStart"
                            >
                              <DatePicker
                                size="large"
                                style={{width:"100%"}}
                                placeholder="申请开始时间"
                              />
                            </IceFormBinder>
                          </FormItem>
                        </Col>
                        <Col s="8" l="8">
                          <FormItem {...formItemLayout} label="申请结束时间：">
                            <IceFormBinder
                              name="submitEnd"
                            >
                              <DatePicker
                                size="large"
                                style={{width:"100%"}}
                                placeholder="申请结束时间" />
                            </IceFormBinder>
                          </FormItem>
                        </Col>
                        <Col s="8" l="8">
                          <FormItem {...formItemLayout} label="展厅名称：">
                            <IceFormBinder
                              name="exhibitionHallName"
                            >
                              <Input size="large" placeholder="展厅名称" />
                            </IceFormBinder>
                          </FormItem>
                        </Col>
                        <Col s="8" l="8">
                          <FormItem {...formItemLayout} label="&nbsp;" className="pch-condition-operate">
                            <Button onClick={this.handleSubmit.bind(this)} type="secondary">
                              查询
                            </Button>
                          </FormItem>
                        </Col>
                      </Row>
                    </Form>
                </IceFormBinderWrapper>
            </div>
            );
    }
}
