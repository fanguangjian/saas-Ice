/* eslint no-underscore-dangle: 0 */
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import {
  Table,
  Pagination,
  Field,
  Form,
  Grid,
  Select,
  Button,
  Input
 } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';

import FontConfigReq from './../../reqs/FontConfigReq.js'
import './FilterTable.scss';

const { Row, Col } = Grid;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 12
  }
};

class  SearchForm extends Component {
  constructor(props) {
    super(props)
    this.field = new Field(this)
  }
  addPage() {
    hashHistory.push('font/add')
  }
  //提交表单
  handleSubmit(e) {
    const { searchEvent } = this.props;
    e.preventDefault();
    this.field.validate((errors, values) => {
      if (errors) {
        return;
      }
      searchEvent(values)
    });
  }
  render() {
    const { init } = this.field;

    return(
        <IceFormBinderWrapper>
          <div className="pch-condition">
            <Form
              size="large"
              direction="hoz"
              >
              <Row>
                <Col s="8" l="8">
                  <FormItem {...formItemLayout} label="资方名称：">
                    <IceFormBinder
                      name="tenantId"
                    >
                      <Select
                        size="large"
                        placeholder="请选择"
                      >
                      </Select>
                    </IceFormBinder>
                  </FormItem>
                </Col>
                <Col s="8" l="8">
                  <FormItem {...formItemLayout} label="业务类型：">
                    <IceFormBinder
                    name="businessType"
                    >
                      <Select
                          size="large"
                          placeholder="请选择"
                        >
                      </Select>
                    </IceFormBinder>
                  </FormItem>
                </Col>
                <Col s="8" l="8">
                  <FormItem {...formItemLayout} label="功能模块：">
                    <IceFormBinder
                      name="functionType"
                    >
                     <Select
                      size="large"
                        placeholder="请选择"
                      >
                      </Select>
                    </IceFormBinder>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col s="8" l="8">
                  <FormItem {...formItemLayout} label="流程名称：">
                    <IceFormBinder
                      name="process"
                    >
                      <Select
                          size="large"
                          placeholder="请选择"
                        >
                        </Select>
                    </IceFormBinder>
                  </FormItem>
                </Col>
                <Col s="8" l="8">
                  <FormItem {...formItemLayout} label="页面名称：">
                    <IceFormBinder
                      name="name"
                    >
                      <Input
                        size="large"
                        placeholder="请输入"
                      />
                    </IceFormBinder>
                  </FormItem>
                  </Col>
                <Col s="8" l="8">
                  <FormItem {...formItemLayout} label="&nbsp;">
                    <Button type="secondary" htmlType='submit' onClick={this.handleSubmit.bind(this)}>
                      查询
                    </Button>
                    
                    <Button
                      type="primary"
                      style={{ marginLeft: '10px' }}
                      onClick={() =>this.addPage()}
                    >
                      新增
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </IceFormBinderWrapper>
    )
  }
}


export default class EnhanceTable extends Component {
  static displayName = 'EnhanceTable';

  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.actions.search();
  }

  //分页
  changePage = (currentPage) => {
    this.props.actions.search({page:currentPage});
  };

  searchConditon(values) {
    this.props.actions.search(values);
  }

  renderOperations = (value, index, record) => {
    return (
      <div
        className="filter-table-operation"
        style={styles.filterTableOperation}
      >
        <Link to={`/font/view?id=${record.id}`} className='operate-btn'>
          详情
        </Link>
        <Link to={`/font/set?id=${record.id}`}  className='operate-btn'>
          编辑
        </Link>
      </div>
    );
  };

  render() {
    const { list=[], total, limit, page } = this.props.pageData;
    return (
      <IceContainer className="pch-container">
      <div className="filter-table">
        <legend className="pch-legend" >
          <span className="pch-legend-legline"></span>页面配置
        </legend>
          <SearchForm searchEvent={(values) =>this.searchConditon(values)}/>
          <Table
            dataSource={list}
            className="basic-table"
            hasBorder={false}
          >
            <Table.Column
              title="业务类型"
              dataIndex="businessType"
              width={320}
            />
            <Table.Column title="功能模块" dataIndex="functionType" width={85} />
            <Table.Column
              title="页面名称"
              dataIndex="name"
              width={150}
            />
            <Table.Column
              title="流程"
              dataIndex=""
              width={85}
              cell={this.renderStatus}
            />
            <Table.Column
              title="最后修改时间"
              dataIndex="createdAt"
              width={150}
            />
            <Table.Column
              title="操作"
              width={150}
              cell={this.renderOperations}
              lock='right'
            />
          </Table>
          {
            list.length>0 && <div style={styles.paginationWrapper}>
                                <Pagination
                                  shape="arrow-only"
                                  current={page}
                                  pageSize={limit}
                                  total={total}
                                  onChange={this.changePage}
                                />
                              </div>
          }
      </div>
      </IceContainer>
    );
  }
}

const styles = {
  filterTableOperation: {
    lineHeight: '28px',
  },
  paginationWrapper: {
    textAlign: 'left',
    paddingTop: '26px',
  },
  marb0: {
    marginBottom: '0',
    borderRadius: '0'
  },
  filterTool: {
    width: '160px',
  },
   formItem: {
    height: '28px',
    lineHeight: '33px',
    marginBottom:'28px'
  },
  formLabel: {
    marginLeft: '85px',
    textAlign: 'right',
  },
};
