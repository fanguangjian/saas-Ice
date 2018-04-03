import CurdReq from '../../../base/reqs/CurdReq'

class FontConfigReq extends CurdReq{
	constructor(){
		super();
		//基本的curd接口
		//若有特殊定义的接口直接覆盖
		this.curd = {
            create: this._host + '/screen-schemes',
            update: this._host + '/screen-schemes',
            retrieve: this._host + '/screen-schemes',
            delete: this._host + '/detail.json',
        }
	}

	/**
   * 获取字段
   */
  getDetail(query='') {
    let data = {};

    let options = {
      url: this._host + '/fields?' + query,
    }
    return super.fetchData(options);
  }

	/**
   * 提交选中字段
   */
  fontCode(data, callback, callbackError) {
    let options = {
			url: this._host + '/screen-schemes',
			data: data,
			method: 'post',
			contentType: 'application/json'
    }
    return super.fetchData(options);
	}

		/**
   * 获取选中字段
   */
  getCode(id) {
    let options = {
			url: this._host + '/screen-schemes/'+ id,
			contentType: 'application/json'
    }
    return super.fetchData(options);
  }

		/**
   * 批量修改字段
   */
  changPageName(data,id) {
    let options = {
			url: this._host + '/screen-schemes/'+ id,
			contentType: 'application/json',
			method: 'put',
			data: data
    }
    return super.fetchData(options);
  }

	/**
   * 删除字段
   */
 deleteCode(id, fieldId) {
    let options = {
			url: this._host + '/screen-schemes/'+ id +'/fields/' + fieldId,
			method: 'delete',
			contentType: 'application/json'
    }
    return super.fetchData(options);
	}


	/**
   * 提交自定义字段
   */
  submitCustomeCode(data,id) {
    let options = {
			url: this._host + '/screen-schemes/'+ id + '/fields',
			method: 'post',
			data: data,
			contentType: 'application/json'
    }
    return super.fetchData(options);
	}
	
		/**
   * 修改字段
   */
  submitModifyCode(data,id, fieldId) {
    let options = {
			url: this._host + '/screen-schemes/'+ id +'/fields/' + fieldId,
			method: 'put',
			data: data,
			contentType: 'application/json'
    }
    return super.fetchData(options);
  }

	/**
	 * 自定义请求
	 * @return {[type]} [description]
	 */
	postDemo(){
		let options = {
			url: this._host + '/member/loginMobile',
			method: 'POST',
			contentType: 'application/x-www-form-urlencoded',
			params: 'mobile=13917538027&card=211224198612285536'
		}
		return super.fetchData(options);
	}
}

export default new FontConfigReq();
