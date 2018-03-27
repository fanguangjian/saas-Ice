import React, { Component } from 'react';
import ProdOne from './components/ProdAdd/addOne'

export default class Product extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  };

  componentDidMount(){
    console.log('productDetail componentDidMount')
    this.props.actions.getDetail(1,2);
  }

  render() {
    let {view, actions, formData} = this.props;
    
    return (
      <div className="product-page">
        <ProdOne {...this.props} />
      </div>
    );
  }
}
