import React, { PureComponent, Component } from 'react';
import { Balloon, Icon, Badge, Breadcrumb, Dropdown } from '@icedesign/base';
import IceImg from '@icedesign/img';
import Layout from '@icedesign/layout';
import Menu from '@icedesign/styled-menu';
import FoundationSymbol from 'foundation-symbol';
import { Link, hashHistory } from 'react-router';
import { headerNavs } from './../navs';
import Logo from './Logo';
import { Recrysuve, Storage, Cookie } from '../base/utils';
import AccountReq from '../pages/Account/reqs/AccountReq';
import CommonReq from '../base/reqs/CommonReq';

export default class Header extends PureComponent {

    getBreadCrumb(data, pathname) {
        let result = Recrysuve(data, pathname, 'value', 'leaf', 'breadcrumb')[0]
        return result;
    }

    /**
     * 退出登录，清空本地存储数据
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    logout(e) {
        e.preventDefault();

        AccountReq.logout().then((res) => {
            Storage.remove('MENUS');
            Storage.remove('USERINFO');
            Cookie.remove('PCTOKEN');

            this._redirectToLogin();
        })
    }

    /**
     * 退出登录跳转到登录页
     * 1. 替换当前系统关键字成login，例如贷前daikuan->login
     * 2. 跳转到登录页
     * @return {[type]} [description]
     */
    _redirectToLogin() {
        let _host = location.host;

        //替换当前系统的域名成登录域名，
        //eg:daikuan-staging.pingchang666.com=>login-staging.pingchang666.com
        _host = _host.replace('daikuan', 'login');
        location.href = '//' + _host + '/#/account/' + encodeURIComponent(location.href);
    // hashHistory.push('/account');
    }

    /**
     * 切换用户身份
     * 切换成功后进入默认页重新加载
     * @param  {[type]} identityId 用户身份ID
     * @return {[type]}            [description]
     */
    changeIdentity(identityId, e) {
        e.preventDefault();

        CommonReq.changeUserIdentity(identityId).then((res) => {
            if (res.code == 200) {
                CommonReq.tipSuccess('切换身份成功');
                location.href = '/';
            }
        });
    }

    render() {
        let {width, theme, isMobile, menus, pathname, routes, userinfo, identityList = []} = this.props;
        // let data = this.getBreadCrumb(menus, pathname);
        // let result = data ? [data.parentNode, data.node] : [{name: '未知页面'}];

        if (routes && routes.length > 0 && (routes[0].path == '/' || routes[0].path == '/dashboard')) {
            // 特殊处理默认首页的路由名称
            routes[0].name = 'DASHBOARD';
            routes = [routes[0]];
        }

        let nickname = '--';
        //获取登陆用户信息
        // let userinfo = Storage.get('USERINFO');
        if (userinfo) {
            nickname = userinfo.realName || userinfo.userName;
        }

        return (
            <Layout.Header theme={theme} className="ice-design-layout-header" style={{
                                                                             width
                                                                         }}>
                <Breadcrumb className='all-breadcrumb'>
                    {routes && routes.map((item, i) => {
                         return <Breadcrumb.Item link="javascript:void(0);" key={i}>
                                    {item.name || '未知'}
                                </Breadcrumb.Item>
                     })}
                </Breadcrumb>
                <div className="ice-design-layout-header-menu" style={{
                                                                          display: 'flex'
                                                                      }}>
                    {/* Header 菜单项 begin */}
                    {headerNavs && headerNavs.length > 0 ? (
                     <Menu mode="horizontal" selectedKeys={[]}>
                         {headerNavs.map((nav, idx) => {
                              const linkProps = {};
                              if (nav.newWindow) {
                                  linkProps.href = nav.to;
                                  linkProps.target = '_blank';
                              } else if (nav.external) {
                                  linkProps.href = nav.to;
                              } else {
                                  linkProps.to = nav.to;
                              }
                              return (
                                  <Menu.Item key={idx}>
                                      <Link {...linkProps}>
                                          {nav.text}
                                          {idx == 1 ? <Badge count={25} /> : ''}
                                          {/* <Badge count={25} /> */}
                                      </Link>
                                  </Menu.Item>
                                  );
                          })}
                     </Menu>
                     ) : null}
                    {/* Header 菜单项 end */}
                    {/* Header 右侧内容块 */}
                    <div className="ice-layout-header-right">
                        {identityList && identityList.length > 0 && (
                         <UserPanel
                             offset={[0, 11]}
                             size={20}
                             shape="circle"
                             userName="切换身份"
                             style={{
                                        marginRight: 20
                                    }}>
                             <div>
                                 <Menu style={{
                                                  minWidth: 120,
                                                  boxShadow: '0 0 2px #ccc'
                                              }}>
                                     {identityList.map((item, i) => {
                                          return (
                                              <Menu.Item>
                                                  <a href="#" onClick={this.changeIdentity.bind(this, item.organizationId)}>
                                                      {item.organizationName}
                                                  </a>
                                              </Menu.Item>
                                              );
                                      })}
                                 </Menu>
                             </div>
                         </UserPanel>)}
                        <UserPanel
                            offset={[0, 11]}
                            size={20}
                            shape="circle"
                            userName={nickname}
                            avatar="//img.alicdn.com/tfs/TB1JLbBQXXXXXcUapXXXXXXXXXX-215-185.png"
                            style={{
                                       marginRight: 20
                                   }}>
                            <div>
                                <Menu style={{
                                                 minWidth: 120,
                                                 boxShadow: '0 0 2px #ccc'
                                             }}>
                                    <Menu.Item>
                                        <a href="#" onClick={this.logout.bind(this)}>退出</a>
                                    </Menu.Item>
                                </Menu>
                            </div>
                        </UserPanel>
                    </div>
                    {/* Header 右侧内容块 */}
                </div>
            </Layout.Header>
            );
    }
}

// 项目内敛 用户面板 组件
class UserPanel extends Component {
    static displayName = 'UserPanel';


    static defaultProps = {
        size: 50,
        shape: 'sharp',
        type: 'cover',
        avatar: ''
    };

    constructor(props) {
        super(props);

        this.state = {
            dropdownVisible: false
        };
    }

    handleDropChange = value => {
        this.setState({
            dropdownVisible: value
        });
    };

    render() {
        const {offset, size, shape, type, avatar, style, children, className = ''} = this.props;
        const hasChildren = React.Children.count(children) > 0;
        const trigger = (
        <div className={`ice-user-panel ${className}`} style={{
                                                          ...style,
                                                          overflow: 'hidden',
                                                          cursor: hasChildren ? 'pointer' : 'default'
                                                      }}>
            <div className="avatar" style={{
                                               float: 'left',
                                               display: 'none'
                                           }}>
                <IceImg
                    height={size}
                    width={size}
                    type={type}
                    shape={shape}
                    src={avatar} />
            </div>
            <div className="user-name" style={{
                                                  float: 'left',
                                                  height: size,
                                                  lineHeight: `${size}px`
                                              }}>
                <span style={{
                                 padding: '10px'
                             }}>{this.props.userName}</span>
                <Icon type={this.state.dropdownVisible ? 'arrow-up' : 'arrow-down'} size="xxs" />
            </div>
        </div>
        );
        if (hasChildren) {
            return (
                <Dropdown offset={offset} align="tr br" trigger={trigger} onVisibleChange={this.handleDropChange}>
                    {this.props.children}
                </Dropdown>
                );
        } else {
            return trigger;
        }
    }
}
