import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { hashHistory } from 'react-router';

import { Form, Icon, Input, Button, Checkbox, Select, Switch, Radio, Grid, Field, Dialog } from '@icedesign/base';

const {Row, Col} = Grid;

import { FormBinderWrapper as IceFormBinderWrapper, FormBinder as IceFormBinder, FormError as IceFormError,
} from '@icedesign/form-binder';
import { Title } from 'components';

import ProcessFormName from '../../components/ProcessFormName';
import ProcessFormItemList from '../../components/ProcessFormItemList';
import ProcessFields from '../../components/ProcessFields';
import { PROCESS_VIEW } from '../../constants/ProcessViewConstant';

import ProcessAuthDetails from '../../components/ProcessAuth/ProcessAuthDetails';
export default class ProcessDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: PROCESS_VIEW.DETAIL
        };

        this.hasProcess = false;
    }

    /**
     * 初始化
     */
    componentDidMount() {
        let {actions, params} = this.props;
        if (params.id) {
            actions.getDetail(params.id);
        }
        actions.getCustomMenuList();
    }

    componentWillUnmount(){
        this.props.actions.changeHasProcess(false);
    }

    componentWillReceiveProps(nextProps){
        let {customMenuList, formData = {}, params, hasProcess} = nextProps;

        if(!hasProcess){
            this.assignTaskItems(params, customMenuList, formData);
        }
    }

    /**
     * 处理流程数据
     * 1. 该方法仅在初始化且获取完数据之后执行一次
     * 1. 新增时默认选择第一个进件模块
     * 2. 编辑时获取详情数据关联模块数据并计算模块的使用数量
     * @return {[type]} [description]
     */
    assignTaskItems(params, customMenuList, formData) {
        console.log('ProcessForm assignTaskItems')
        if (params.id) {
            if (!formData || !formData.taskItems || formData.taskItems.length == 0 || !customMenuList || customMenuList.length == 0) {
                return;
            }

            formData.taskItems.map((item, i) => {
                customMenuList.map((citem, j) => {
                    if (item.taskTypeId == citem.id) {
                        citem.limitedAddTimes--;
                        item = Object.assign(item, citem);
                    }
                })
            // item.cid = i;
            })

            // 只处理一次
            this.props.actions.changeHasProcess(true);
        } else {
            if (!customMenuList || customMenuList.length == 0) {
                return;
            }

            customMenuList[0].limitedAddTimes--;
            formData.taskItems = [];
            formData.taskItems.push(Object.assign({
                taskOrder: 0,
                taskAlias: customMenuList[0].taskTypeName,
                taskTypeId: customMenuList[0].id
            }, customMenuList[0]));

            // 只处理一次
            this.props.actions.changeHasProcess(true);
        }
    }

    // 取消
    handleCancel() {
        hashHistory.push('process');
    }

    /**
     * 切换显示的view
     * @param  {[type]} view [description]
     * @return {[type]}      [description]
     */
    changeView(view, item) {
        console.log('changeView', view);

        if(!view || typeof view != 'string'){
            // 默认返回当前编辑页，约定返回不传参数
            view = PROCESS_VIEW.DETAIL;
        }
        
        switch (view) {
            case PROCESS_VIEW.VIEWFIELD: {
                // 查看必要字段
                this.props.actions.getTasksFields(item.taskTypeId);
                break;
            }
            case PROCESS_VIEW.VIEWAUTH : {
                // 查看权限传入当前已选的权限
                this.setState({
                    privilegeItems: item.privilegeItems
                });
                break;
            }
            case PROCESS_VIEW.PREVIEWPAGE : {
                if(!item.pageId){
                    return;
                }
                
                actions.getPageDetail(item.pageId);
                this.setState({
                    pageId: item.pageId,
                });
                break;
            }
        }

        this.setState({
            view
        })
    }

    /**
     * 渲染
     */
    render() {
        let {customMenuList, formData = {}, params, tasksFields = {}, pageFields = {}} = this.props;
        let {privilegeItems} = this.state;

        return (
            <div className="">
                <IceContainer className="pch-container pch-process" style={{display: this.state.view == PROCESS_VIEW.DETAIL ? '' : 'none'}}>
                    <Title title="流程详情" />
                    <div className="pch-form">
                        <IceFormBinderWrapper value={formData} ref="form">
                            <Form size="large" labelAlign="left">
                                <ProcessFormName info={formData} editable={false} />
                                {/*顶部结束*/}
                                <div className="container">
                                    <ProcessFormItemList taskItems={formData.taskItems} changeView={this.changeView.bind(this)} editable={false} />
                                    <div className="next-btn-box pch-form-buttons">
                                        <Button type="secondary" size="large" onClick={this.handleCancel}>
                                            返回
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        </IceFormBinderWrapper>
                    </div>
                </IceContainer>
                <ProcessFields formData={formData} data={tasksFields.requiredFields} visible={this.state.view == PROCESS_VIEW.VIEWFIELD} changeView={this.changeView.bind(this)} />
                <ProcessAuthDetails formData={formData} data={privilegeItems} privilegeItems={this.state.privilegeItems} visible={this.state.view == PROCESS_VIEW.VIEWAUTH}  changeView={this.changeView.bind(this)} />
                <SetFontView_ id={this.state.pageId} resData={pageFields} visible={this.state.view == PROCESS_VIEW.PREVIEWPAGE} changeView={this.changeView.bind(this)}  />
            </div>
            );
    }
}
