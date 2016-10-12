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
var Select = require('antd/lib/select');
var QueueAnim = require('rc-queue-anim/lib/QueueAnim');

const FormItem = Form.Item;
const Option = Select.Option;
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
        this.onClickButton = this.onClickButton.bind(this);
    }
    onClickButton(ref) {
        let self = this;
        console.log(ref);
        /*if (this.state.isloaded1 || this.state.isloaded2 || this.state.isloaded3) {
            ReactDom.unmountCOmponentAtNode()
        }*/
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

        if (ref == 'roadConfig') {
            this.setState({
                isloading1: true,
                disabled2: true,
                disabled3: true
            });
            Ds.DataService('/map/roadMap.json', null, (resp) => {
                console.log(resp);
                CI.displayConfigLayer(resp.data);

                self.setState({
                    isloading1: false,
                    isloaded1: true
                });
                if (self.state.isloaded1) {
                    ReactDOM.render(
                        <RoadConfigPanel/>, document.getElementById("configPanel")
                    );
                }
            }, (e) => {
                console.log(e);
                alert('后台传输错误！');
                self.setState({
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
            });
            /*setTimeout(function() {
                self.setState({
                    isloading1: false,
                    isloaded1: true
                })
                ReactDOM.render(
                    <RoadConfigPanel/>, document.getElementById("configPanel")
                );
            }, 1000)*/
        } else if (ref == 'regionConfig') {
            this.setState({
                isloading2: true,
                disabled1: true,
                disabled3: true
            });
            Ds.DataService('/zoneConfig/map.json', null, (resp) => {
                //console.log(resp);
                CI.displayConfigLayer(resp.data);

                self.setState({
                    isloading2: false,
                    isloaded2: true
                });

                if (self.state.isloaded2) {
                    ReactDOM.render(
                        <RegionConfigPanel/>, document.getElementById("configPanel")
                    );
                }
            }, (e) => {
                console.log(e);
                alert('后台传输错误！');
                self.setState({
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
            });

        } else if (ref == 'odConfig') {
            self.setState({
                isloading3: true,
                disabled1: true,
                disabled2: true
            });
            Ds.DataService('/odRegion/initMap.json', null, (resp) => {
                console.log(resp);
                CI.displayConfigLayer(resp.data);

                self.setState({
                    isloading3: false,
                    isloaded3: true
                });
                if (self.state.isloaded3) {
                    ReactDOM.render(
                        <OdConfigPanel/>, document.getElementById("configPanel")
                    );
                }
            }, (e) => {
                console.log(e);
                alert('后台传输错误！');
                self.setState({
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
        });

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

let OdConfigPanel = React.createClass({
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
        const odNameProps = getFieldProps('odName', {
            rules: [{
                required: true,
                message: '请填写OD区域名称'
            }, ]
        })
        return (
            <Form inline onSubmit={this.handleSubmit}>
        <FormItem label="OD名称">
          <Input placeholder="请输入OD名称" size='small'
            {...odNameProps} type = 'odName' id='odName' name='odName'
          />
        </FormItem>
        <Button type="primary" size='small' htmlType="submit">保存</Button>
      </Form>
        );
    },
});
OdConfigPanel = Form.create()(OdConfigPanel);

let options = [];
for (let i = 10; i < 36; i++) {
    options.push(<Option key={i} value={i}>{i+i}</Option>)
}
let RoadConfigPanel = React.createClass({
    getInitialState() {
        return {
            options: [],
        };
    },
    handleSelection(value) {

        console.log(value)
    },
    handleSubmit(e) {
        e.preventDefault();
        //console.log(this.props.form.getFieldsValue());
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log(errors);
                alert('请输入路段名称');
            } else {
                console.log('传给后台的值', values);
            }

        });
    },
    render() {
        const {
            getFieldProps
        } = this.props.form;
        const roadNameProps = getFieldProps('roadName', {
            rules: [{
                required: true,
                message: '请填写路段名称'
            }, ]
        });
        const roadNameProps_start = getFieldProps('startCross', {
            rules: [{
                required: true,
                message: '请选择开始路口'
            }, ]
        });
        const roadNameProps_end = getFieldProps('endCross', {
            rules: [{
                required: true,
                message: '请选择结束路口'
            }, ]
        });
        return (
            <Form inline onSubmit={this.handleSubmit}>
        <FormItem label="路段名称">
          <Input placeholder="请输入路段名称" size='small'
            {...roadNameProps} type = 'roadName' id='roadName' name='roadName'
          />
        </FormItem>
        <FormItem label="开始路口">
        <Select 
        {...roadNameProps_start} 
        type = 'startCross' 
        id='startCross' 
        name='startCross' 
        size='small'
        defaultValue="1"
        style={{ width: 150 }}
        onChange={this.handleSelection}
        placeholder="请选择开始路口"
        getPopupContainer={()=>document.getElementById('configPanel')}
      >
        {options}
      </Select>
        </FormItem>
        <FormItem label="结束路口">
          <Select 
        {...roadNameProps_end} 
        type = 'startCross' 
        id='endCross' 
        name='endCross' 
        size='small'
        defaultValue="1"
        style={{ width: 150 }}
        onChange={this.handleSelection}
        placeholder="请选择结束路口"
        getPopupContainer={()=>document.getElementById('configPanel')}
      >
        {options}
      </Select>
        </FormItem>
        <Button type="primary" size='small' htmlType="submit">保存</Button>
      </Form>
        );
    },
});
RoadConfigPanel = Form.create()(RoadConfigPanel);

export default ConfigSub