import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Grid, Form, Button, Select ,Field,NumberPicker, Balloon, Radio, Checkbox, DatePicker,Table, Upload } from '@icedesign/base';
import Req from '../../../reqs/EntryQueryReq';
const { Group: CheckboxGroup } = Checkbox;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Combobox } = Select;

const formItemLayout = {
  labelCol: { span: 11 },
  wrapperCol: { span: 13 }
};
const formItemLayoutR = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
};
const formItemLayoutCombobox = {
  labelCol: { span: 3 },
  wrapperCol: { span: 15 }
};
export default class FormRender extends Component {
  static displayName = 'FormRender';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {

    super(props);
    this.state = {
      value: {},
      Component :[],
      list:[]
    };
  }
  componentWillMount(){
    this.SelectList();
  }
  //渲染表单
  renderForm = (data)=>{
    // console.log(data)
    const  formList = [];
    if(data){
      data.map((item,index)=>{
        formList.push(
          <div className='info' key={index} id={item.name}>
            <h4 >{item.name}</h4>
            <div className='info-row'>
              {
                item.fields.map((el,i)=>{
                  return(
                    this.FromRender(el,index,i)
                  )
                })
              }
            </div>
          </div>
        )
      })
    }
    return formList;
  }
  //区块分类渲染
  FromRender = (el,outIndex,inIndex)=>{
    if(el.hasAttachedFields){
      return (<div className="subsidiary-field" key={el.name}>
        {this.RenderField(el,outIndex,inIndex)}
      </div>)
    }
    return this.RenderField(el,outIndex,inIndex)
  }
  //selectList
  SelectList = ()=>{

  }

  //渲染字段
  RenderField = (el,outIndex,inIndex)=>{
    const init = this.props.field.init;
    const arr = [];
    var   disabled ;
    // console.log(el)
    if(el.type == "STRING"){
      return(
        <FormItem key={el.id} className='item' label={this.label(el.label)}
                  {...formItemLayout}>
          <Input
            defaultValue={el.value}
            {...init(el.name,{
              initValue: el.value,
              rules: [{ required:  el.isRequired, message: "请填写"+el.label }],
              props:{ onBlur:()=> this.refuse(el.name) }
            })}
            placeholder={"请输入"+el.label}
            disabled={el.isFixed || el.isReadonly}
          />
        </FormItem>
      )
    }else if(el.type == "SELECT"){
      if(el.name == 'car.id'){
       return(
               <FormItem  key={el.id} className='item half' label={this.label(el.label)}
                          {...formItemLayoutCombobox}>
               <Combobox
                     // onInputUpdate={this.onInputUpdate.bind(this)}
                     fillProps="label"
                     filterLocal={true}
                     placeholder={"请输入"+el.label}
                     style={{width:"100%"}}
                     autoWidth
                     hasClear
                     // onChange={this.onChange}
                     dataSource={this.state.list}
                     // onSearch ={this.onSearch}
                     onInputUpdate={this.onInputUpdate.bind(this)}
                     {...init(el.name, {
                       // initValue: el.value,
                       rules: [{ required:  el.isRequired, message: "请选择"+el.label }]
                     })}
                   />
               </FormItem>
             )
      }
      return(
        <FormItem  key={el.id} className='item' label={this.label(el.label)}
                   {...formItemLayout}>
          <Select
            defaultValue={el.value}
            disabled={el.isFixed || el.isReadonly }
            placeholder={"请选择"+el.label}
            style={{width:"100%"}}
            {...init(el.name, {
              initValue: el.value,
              rules: [{ required:  el.isRequired, message: "请选择"+el.label }]
            })}
            dataSource={el.options}
          >
          </Select>
        </FormItem>
      );
    }
    else if(el.type == 'DECIMAL'){
      if(el.isFixed){
        disabled = true
      }else{
        disabled = false
      }
      return(
        <FormItem key={el.id} className='item' label={this.label(el.label)}
                  {...formItemLayout}>
          <Input
            defaultValue={el.value}
            disabled={el.isFixed || el.isReadonly}
            htmlType="number"
            {...init(el.name,{
              initValue: el.value,
              rules: [{ required: el.isRequired, message: "请填写"+el.label}]
            })}
            placeholder={"请输入"+el.label}
          />
        </FormItem>
      )
    }
    else if(el.type == 'INT' || el.type ==  'LONG'){
      return(
        <FormItem key={el.id} className='item' label={this.label(el.label)}
                  {...formItemLayout}>
          <NumberPicker
            disabled={el.isFixed || el.isReadonly}
            defaultValue={el.value}
            min={0}
            max={el.maxValue}
            inputWidth={'100px'}
            {...init(el.name, {
              initValue: el.value,
              rules: [
                { required: el.isRequired,message: "请填写"+el.label}
              ]
            })}
          />
        </FormItem>
      )
    }
    else if(el.type == 'RADIO'){
      var Fields  =[];
      var Default =''
      if(el.options){
        el.options.map((item,index)=>{
          if(item.isDefault){
            Default =item.value;
          }
        })
      }
      if(el.hasAttachedFields){
        var value = ''
        value =  el.value !='' ||  el.value =='undefined' ? el.value : Default;
        Fields.push(<FormItem key={el.id} className='item single-line' label={this.label(el.label)}
                              {...formItemLayoutR}>
          <RadioGroup
            disabled={el.isReadonly}
            defaultValue ={value+''}
            {...init(el.name, {
              initValue: value+'',
              rules: [{ required: el.isRequired, message: "请选择"+el.label }],
              props:{
                onChange:()=> {
                  this.isChange(outIndex,inIndex);
                }
              }
            })}
            dataSource={el.options}
          >
          </RadioGroup>
        </FormItem>)
        if( el.attached[value]) {
          el.attached[value].map((item,index)=>{
            Fields.push(this.FromRender(item))
          })
          return(Fields)
        }
      }
      else{
        var   setValue = '';
        setValue =  el.value !='' ||  el.value =='undefined' ? el.value : Default;
        Fields.push(<FormItem key={el.id} className='item' label={this.label(el.label)}
                              {...formItemLayout}>
          <RadioGroup
            defaultValue ={setValue+''}
            disabled={el.isReadonly}
            dataSource={el.options}
            {...init(el.name, {
              initValue: setValue+'',
              rules: [{ required: el.isRequired, message: "请选择"+el.label }]
            })}
          >
          </RadioGroup>
        </FormItem>)
      }
      return(Fields)
    }else if(el.type == 'CHECKBOX'){
      return(
        <FormItem key={el.id} className='item' label={this.label(el.label)}
                  {...formItemLayout}>
          <CheckboxGroup
            defaultValue ={el.value}
            disabled={ el.isReadonly}
            {...init(el.name, {
              initValue: el.value,
              rules: [{ required: el.isRequired, message: "请选择"+el.label }]
            })}
            dataSource = {el.options}
          >
          </CheckboxGroup>
        </FormItem>
      )
    }
    else if(el.type == 'DATE'){
      return(
        <FormItem key={el.id} className='item' label={this.label(el.label)}
                  {...formItemLayout}>
          <DatePicker
            defaultValue={el.value}
            disabled={el.isReadonly}
            format={"YYYY-MM-DD"}
            // formater={["YYYY-MM-DD"]}
            style={{width:"100%"}}
            {...init(el.name, {
              initValue: el.value,
              getValueFromEvent: this.formater
            },{
              rules: [{ required: el.isRequired, message: "请选择"+el.label }]
            })}
          />
        </FormItem>
      )
    }
  }
  //改变value
  onChange =(value,option)=>{
    console.log(value)
    console.log(option)
  }
  onInputUpdate = (value)=>{
    const  productCode = this.props.field.getValue('productCode');
    var carList = {
      productCode : productCode,
      name : value
    }
    console.log(carList)
    Req.getSelectList(carList).then((res)=>{
      if(res && res.code == 200){
        const dataSource =  res.data.list.map((item,index)=>{
          return {
            label: item.brandName+'/'+item.seriesGroupName +'/'+item.modelName,
            value: item.id
          };
        })
        this.setState({
          list:dataSource
        });
      }
    }).catch((error)=>{

    })
  }
  //label的提示
  label = (label) =>{
    var  labelName= <span> {label}:</span>
    return(
      <Balloon
        type="primary"
        trigger={labelName}
        closable={false}
      >
        {label}
      </Balloon>
    )
  }
  //更改渲染附属字段
  isChange = (outIndex,inIndex)=>{
    var name = this.props.detail.list[outIndex].fields[inIndex].name;
    this.props.detail.list[outIndex].fields[inIndex].value = this.props.field.getValue(name);
  }
  //调用秒拒功能
  refuse = (name)=>{
    //担保人材料上传列表增加一列
    if(name == 'guarantor.name'){
      const  guarantorName = this.props.field.getValue('guarantor.name');
      var guarantorNameData = {id:'guarantorName',title:guarantorName ,draggable:true}
      this.props.addColumn(guarantorNameData);
    }
    //共同贷款人材料上传列表增加一列
    if(name == 'coBorrower.name'){
      const  coBorrowerName = this.props.field.getValue('coBorrower.name');
      var coBorrowerData = {id:'coBorrowerName',title:coBorrowerName ,draggable:true}
      this.props.addColumn(coBorrowerData);
    }
    //共同贷款人秒拒
    if(name == 'coBorrower.name' || name == 'coBorrower.idNo'|| name == 'coBorrower.mobile'){
      const  coBorrowerName = this.props.field.getValue('coBorrower.name');
      const  coBorrowerIdNo = this.props.field.getValue('coBorrower.idNo');
      const  coBorrowerMobile = this.props.field.getValue('coBorrower.mobile');
      if(coBorrowerName && coBorrowerIdNo && coBorrowerMobile){
        // alert('123')
      }
    }
    //担保人秒拒
    if(name == 'guarantor.name' || name == 'guarantor.idNo'|| name == 'guarantor.mobile'){
      const  guarantorName = this.props.field.getValue('guarantor.name');
      const  guarantorIdNo = this.props.field.getValue('guarantor.idNo');
      const  guarantorMobile = this.props.field.getValue('guarantor.mobile');
      if(guarantorName && guarantorIdNo && guarantorMobile){
        // alert('123')
      }
    }
  }
  render() {
    console.log(this.state.list)
    const { data, init } = this.props;
    return (
      this.renderForm(data)
  );
  }
}
