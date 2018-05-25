import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { hashHistory } from 'react-router';
import { BaseApp } from 'base'
import { Title, PchTable, PchPagination } from 'components';
import FilterForm from './Filter';
import  Req from '../../reqs/ReviewApproveReq'

// import './Process.scss';

export default class ReviewApprove extends BaseApp {
    constructor(props) {
        super(props);
    }
    /**
     * 初始化
     */
    componentDidMount() {
        this.fetchData();
    }
    fetchData = (condition) => {
        console.log(condition)
        this.props.actions.search(condition);
    }
    //点击分页
    changePage = (currentPage) => {
        this.props.actions.search({
            page: currentPage
        });
    }

  //点击签收
  signIN = (taskId) =>{
    Req.signIn({
      taskId: taskId
    }).then((res) =>{
      if(res && res.code==200){
        this.fetchData();
      }
    }).catch((error) =>{

    });

  }


    /**
     * 处理行列表中操作栏的点击事件
     * @param data 传递给对应事件的行记录数据，okey一般为当前记录的主键
     * @param type 操作类型，根据不同类型处理不同事件
     */
    handleOperateClick(data, type) {
        switch (type) {
            //签收
            case this.OPERATE_TYPE.OTHER1: {
                this.signIN(data.taskId);
                break;
            }
            //审查审批详情
            case this.OPERATE_TYPE.VIEW: {
                hashHistory.push(`reviewApprove/3/detail/${data.loanId}`)
                break;
            }
            // 征信详情
            case this.OPERATE_TYPE.OTHER3: {
              hashHistory.push(`creditinformation/detail/${data.loanId}`)
              break;
            }
            // 征信录入
            case this.OPERATE_TYPE.OTHER4: {
              hashHistory.push(`creditinformation/add/${data.loanId}`)
              break;
            }
            // 面签详情
            case this.OPERATE_TYPE.OTHER5: {
              hashHistory.push(`interview/detail/${data.loanId}`)
              break;
            }
        }
    }
    /**
     * 渲染
     */
    render() {
        const {pageData ={}, columns, isFetching} = this.props;
        console.log(this.props)
        return (
            <IceContainer className="pch-container">
                <Title title="查询" />
                <FilterForm onSubmit={this.fetchData} />
                <PchTable isLoading={isFetching} dataSource={pageData.list} columns={columns} onOperateClick={this.handleOperateClick.bind(this)} />
                <PchPagination dataSource={pageData} onChange={this.changePage} />
            </IceContainer>
        )
    }
}
