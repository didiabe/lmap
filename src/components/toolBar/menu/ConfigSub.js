import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../_toolBar.css';
import ConfigStyles from './_UniqueSub.css'
import * as CI from '../../../scripts/CongestionIndex';
//import * as DR from '../../../scripts/drawFeatures';
import * as lmsg from '../../../libs/lmsg';
import {
    connect
} from 'react-redux';
//import * as action from '../../actions/searchAction';
import * as Ds from '../../../libs/DataService';

var Button = require('antd/lib/button');
var Icon = require('antd/lib/icon');
var Form = require('antd/lib/form');
var Input = require('antd/lib/input');
//var Popover = require('antd/lib/popover');
var QueueAnim = require('rc-queue-anim/lib/QueueAnim');

const FormItem = Form.Item;
class ConfigSub extends React.Component {
    constructor() {
        super();
        this.state = {
            active: false
        }
    }
    mountTrafficConditions() {
        this.setState({
            active: !this.state.active
        });
        if (!document.getElementById('configDetails')) {
            this.setState({
                active: !this.state.active
            });
            ReactDOM.render(
                <ConfigSubPanel/>, document.getElementById("presetBox")
            )
        } else {
            this.setState({
                active: !this.state.active
            });
            ReactDOM.unmountComponentAtNode(document.getElementById("presetBox"))
        }
    }
    render() {
        return (

            <div>
        <li refs="startUnipanel" id="trafficConditions" onClick={() => this.mountTrafficConditions() }>
                    <div type="fullscreen">
                        <span className={this.state.active ? styles.fullscreen_active : styles.fullscreen}>配置</span>
                    </div>
                </li>
            </div>
        )
    }
    componentDidMount() {

    }
}

class ConfigSubPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            disabled1: false,
            disabled2: false,
            disabled3: false,
            isloading1: false,
            isloading2: false,
            isloading3: false,
            isloaded1: false,
            isloaded2: false,
            isloaded3: false,
        };

    }
    onClickButton(ref) {
        var self = this;
        console.log(ref);
        this.setState({
            isloading: true
        });
        if (ref == 'roadConfig') {
            this.setState({
                isloading1: true,
                disabled2: true,
                disabled3: true
            });
            Ds.DataService('', null, (resp) => {
                console.log(resp);
                this.setState({
                    isloading1: false,
                    isloaded1: true
                })
            }, (e) => {
                console.log(e);
                alert('后台传输错误！');
            });
        } else if (ref == 'regionConfig') {
            this.setState({
                isloading2: true,
                disabled1: true,
                disabled3: true
            });
            Ds.DataService('/zoneConfig/map.json', null, (resp) => {
                console.log(resp);
                this.setState({
                    isloading2: false,
                    isloaded2: false
                });
            }, (e) => {
                console.log(e);
                alert('后台传输错误！');
            });
            if (this.state.isloaded2) {
                ReactDOM.render(
                    <RegionConfigPanel/>, document.getElementById("configPanel")
                );
            } else {
                this.setState({
                    disabled1: false,
                    disabled2: false,
                    disabled3: false,
                    isloading1: false,
                    isloading2: false,
                    isloading3: false,
                    isloaded1: false,
                    isloaded2: false,
                    isloaded3: false,
                });
            }

            /* setTimeout(function() {
                 self.setState({
                     isloading2: false,
                     isloaded2: true
                 });


                 ReactDOM.render(
                     <RegionConfigPanel/>, document.getElementById("configPanel")
                 );

             }, 2000);*/

        } else if (ref == 'odConfig') {
            this.setState({
                isloading3: true,
                disabled1: true,
                disabled2: true
            });
            Ds.DataService('', null, (resp) => {
                console.log(resp);
                this.setState({
                    isloading3: false,
                    isloaded3: true
                })
            }, (e) => {
                console.log(e);
                alert('后台传输错误！');
            });
        } else alert('加载地图图层错误');


    }
    componentDidMount() {

    }
    render() {
        return (
            <div className={ConfigStyles.boxpanel}  id="configDetails">
                <div className={ConfigStyles.panel_header}>
                    配置信息
                </div>
                <div className={ConfigStyles.panel_body} id="Configpanel_body">
                   <Button id="crossConfig" ref="crossConfig" className={ConfigStyles.button1} type="primary" size="small" disabled={true} onClick={()=>this.onClickButton(this.refs.crossConfig.props.id)}>路口配置</Button>
                   <Button id="roadConfig" ref="roadConfig" className={ConfigStyles.button1} type="primary" size="small" loading={this.state.isloading1} disabled={this.state.disabled1} onClick={()=>this.onClickButton(this.refs.roadConfig.props.id)}>路段配置</Button>
                   <Button id="regionConfig" ref="regionConfig" className={ConfigStyles.button1} type="primary" size="small" loading={this.state.isloading2} disabled={this.state.disabled2} onClick={()=>this.onClickButton(this.refs.regionConfig.props.id)}>区域配置</Button>
                   <Button id="odConfig" ref="odConfig" className={ConfigStyles.button1} type="primary" size="small" loading={this.state.isloading3} disabled={this.state.disabled3} onClick={()=>this.onClickButton(this.refs.odConfig.props.id)}>OD配置</Button>
                </div><br/>
        <div id='configPanel'></div>
                   
            </div>
        )

    }


}
let RegionConfigPanel = React.createClass({
    handleSubmit(e) {
        e.preventDefault();
        //console.log(this.props.form.getFieldsValue());
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log(errors);
                alert('请输入区域名称');
            } else {
                console.log('传给后台的值', values);
            }

        });
    },
    render() {
        const {
            getFieldProps
        } = this.props.form;
        const regionNameProps = getFieldProps('regionName', {
            rules: [{
                required: true,
                message: '请填写区域名称'
            }, ]
        })
        return (
            <Form inline onSubmit={this.handleSubmit}>
        <FormItem label="区域名称">
          <Input placeholder="请输入区域名称" size='small'
            {...regionNameProps} type = 'regionName' id='regionName' name='regionName'
          />
        </FormItem>
        <Button type="primary" size='small' htmlType="submit">保存</Button>
      </Form>
        );
    },
});
RegionConfigPanel = Form.create()(RegionConfigPanel);

export default ConfigSub