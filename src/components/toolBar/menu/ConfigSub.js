import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../_toolBar.css';
import ConfigStyles from './_UniqueSub.css'
import * as CI from '../../../scripts/CongestionIndex';
import * as DR from '../../../scripts/drawFeatures';
import * as lmsg from '../../../libs/lmsg';
import * as lmap from '../../../libs/lmap';
import {
    connect
} from 'react-redux';

import * as Ds from '../../../libs/DataService';
import {
    Button,
    Icon,
    Form,
    Input,
    Select,
    Popover
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

var selectionOptions_road = null;
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
    componentWillUnmount() {
        lmap.removeEchartsLayer();
        DR.drawFeatures.disable();
    }
    render() {
        return (

            <div>
        <li ref="startUnipanel" id="trafficConditions" onClick={() => this.mountTrafficConditions() }>
                    <div type="fullscreen">
                        <span className={this.state.active ? styles.fullscreen_active : styles.fullscreen}>配置</span>
                    </div>
                </li>
            </div>
        )
    }
    componentDidMount() {


        lmsg.subscribe('peizhi', (data) => {
            ReactDOM.render(
                <ConfigSubPanel/>, document.getElementById("presetBox")
            )
        });

    }
}

class ConfigSubPanel extends React.Component {
    constructor() {
        super();
        this.state = {
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
        this.setState({
            isloading1: false,
            isloading2: false,
            isloading3: false,
            isloaded1: false,
            isloaded2: false,
            isloaded3: false,
        });

        if (ref == 'roadConfig') {
            console.log(self.state.isloading1);
            this.setState({
                isloading1: true,
            });
            Ds.DataService('/map/roadMap.json', null, (resp) => {
                self.setState({
                    isloading1: false,
                    isloaded1: true
                });
                CI.displayConfigLayer_road(resp.data);
                DR.DrawConfigLayer.DrawRoad.activate();
                ReactDOM.render(
                    <RoadConfigPanel/>, document.getElementById("configPanel")
                );
            }, (e) => {
                console.log(e);
                alert('后台传输错误！');
                self.setState({
                    isloading1: false,
                    isloading2: false,
                    isloading3: false,
                    isloaded1: false,
                    isloaded2: false,
                    isloaded3: false,
                });
            });

        } else if (ref == 'regionConfig') {
            this.setState({
                isloading2: true,
            });
            Ds.DataService('/zoneConfig/map.json', null, (resp) => {
                //console.log(resp);
                CI.displayConfigLayer(resp.data);

                self.setState({
                    isloading2: false,
                    isloaded2: true
                });
                DR.DrawConfigLayer.DrawRegion.activate();
                DR.DrawConfigLayer.DrawRegion.dataRecv(resp.data);
                ReactDOM.render(
                    <RegionConfigPanel/>, document.getElementById("configPanel")
                );

            }, (e) => {
                console.log(e);
                alert('后台传输错误！');
                self.setState({
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
            });
            Ds.DataService('/odRegion/initMap.json', null, (resp) => {
                //console.log(resp);
                CI.displayConfigLayer(resp.data);
                self.setState({
                    isloading3: false,
                    isloaded3: true
                });
                DR.DrawConfigLayer.DrawOD.activate();
                DR.DrawConfigLayer.DrawOD.dataRecv(resp.data);
                ReactDOM.render(
                    <OdConfigPanel/>,
                    document.getElementById("configPanel")
                );

            }, (e) => {
                console.log(e);
                alert('后台传输错误！');
                self.setState({
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
    ChangeConfig(ref) {
        ReactDOM.unmountComponentAtNode(document.getElementById("configPanel"));
        DR.drawFeatures.disable();
        if (ref == 'regionConfig') {
            Ds.DataService('/zoneConfig/map.json', null, (resp) => {
                CI.changeConfigLayer(resp.data.zone, ref);
            }, (e) => {
                console.log(e);
                alert('后台传输错误！');
            });
        } else if (ref == 'odConfig') {
            Ds.DataService('/odRegion/initMap.json', null, (resp) => {
                CI.changeConfigLayer(resp.data.zone, ref);
            }, (e) => {
                console.log(e);
                alert('后台传输错误！');
            });
        } else if (ref == 'roadConfig') {
            Ds.DataService('/map/roadMap.json', null, (resp) => {
                CI.changeConfigLayer(resp.data, ref);
            }, (e) => {
                console.log(e);
                alert('后台传输错误！');
            });
        }

    }
    componentDidMount() {
        //如果od在先remove
        lmap.removeEchartsLayer();
        let self = this;
        //路段配置下拉框内容
        Ds.DataService('/roadConfig/searchDoubleRoadList.json', null, (resp) => {
            selectionOptions_road = resp.data;
        }, (e) => {
            alert('后台传输错误！');
            console.log(e);
        });

        lmsg.subscribe('peizhi', (data) => {
            localStorage.removeItem('peizhi');
            switch (data.params) {
                case 'odqypz':
                    self.onClickButton("odConfig");
                    break;
                case 'ldpz':
                    self.onClickButton("roadConfig");
                    break;
                case 'qypz':
                    self.onClickButton("regionConfig");
                    break;
                case 'fhld_init':

                    break;
                case 'fhld_locating':

                    break;
            }

        });
        //lmsg.send('fhld_ok',{new_fhld:11, doublers:[{name:11, id:11},{name:11, id:11},{name:11, id:11}]})
        lmsg.subscribe('openChangeConfigPanel', (data) => {
            localStorage.removeItem('openChangeConfigPanel');

            if (data.ref == 'regionConfig') {
                console.log(data.id);
            } else if (data.ref == 'odConfig') {
                console.log(data.id);
            } else if (data.ref == 'roadConfig') {
                console.log(data.id);
            }
        });

    }
    render() {
        const regionConfig = (
            <div>
            <Button id="regionConfig_add" ref="regionConfig_add" className={ConfigStyles.button1} type="ghost" size="small" loading={this.state.isloading2}  onClick={()=>this.onClickButton("regionConfig")}>新增</Button>
            <Button id="regionConfig_fix" ref="regionConfig_fix" className={ConfigStyles.button1} type="ghost" size="small" loading={this.state.isloading2} onClick={()=>this.ChangeConfig("regionConfig")}>修改</Button>
        </div>);
        const odConfig = (
            <div>
            <Button id="odConfig_add" ref="odConfig_add" className={ConfigStyles.button1} type="ghost" size="small" loading={this.state.isloading2} onClick={()=>this.onClickButton("odConfig")}>新增</Button>
            <Button id="odConfig_fix" ref="odConfig_fix" className={ConfigStyles.button1} type="ghost" size="small" loading={this.state.isloading2} onClick={()=>this.ChangeConfig("odConfig")}>修改</Button>
        </div>);
        const roadConfig = (
            <div>
            <Button id="roadConfig_add" ref="roadConfig_add" className={ConfigStyles.button1} type="ghost" size="small" loading={this.state.isloading2} onClick={()=>this.onClickButton("roadConfig")}>新增</Button>
            <Button id="roadConfig_fix" ref="roadConfig_fix" className={ConfigStyles.button1} type="ghost" size="small" loading={this.state.isloading2} onClick={()=>this.ChangeConfig("roadConfig")}>修改</Button>
        </div>);

        return (
            <div className={ConfigStyles.boxpanel}  id="configDetails">
                <div className={ConfigStyles.panel_header}>
                    配置信息
                </div>
                <div className={ConfigStyles.panel_body} id="Configpanel_body">
                    <Button id="crossConfig" ref="crossConfig" className={ConfigStyles.button1} type="primary" size="small" disabled={true} onClick={()=>this.onClickButton(this.refs.crossConfig.props.id)}>复合路段</Button>
                    
                    <Popover ref="roadConfig" content={roadConfig} placement="topLeft" title="请选择" trigger="hover" getTooltipContainer={() => document.getElementById('configDetails')}>
                        <Button id="roadConfig" ref="roadConfig" className={ConfigStyles.button1} type="primary" size="small" loading={this.state.isloading1}>双向路段</Button>
                    </Popover>
                    <Popover ref="regionConfig" content={regionConfig} placement="top" title="请选择" trigger="hover" getTooltipContainer={() => document.getElementById('configDetails')}>
                        <Button id="regionConfig" ref="regionConfig" className={ConfigStyles.button1} type="primary" size="small" loading={this.state.isloading2}>区域配置</Button>
                    </Popover>
                    <Popover ref="odConfig" content={odConfig} placement="topRight" title="请选择" trigger="hover" getTooltipContainer={() => document.getElementById('configDetails')}>
                        <Button id="odConfig" ref="odConfig" className={ConfigStyles.button1} type="primary" size="small" loading={this.state.isloading3}>OD区域</Button>
                    </Popover>
                    
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
                alert('请检查错误');
            } else {
                //console.log('传给后台的值', values);
                var sendParams_region = {
                    qybh: values.regionNumber,
                    qymc: values.regionName,
                    qyfw: JSON.stringify(DR.DrawConfigLayer.DrawRegion.getValue()),
                    ylzd1: values.regionColor,
                    crossid: DR.DrawConfigLayer.DrawRegion.calculateWithin().crossIds.toString(),
                    roadid: DR.DrawConfigLayer.DrawRegion.calculateWithin().roadIds.toString()
                };
                console.log('传给后台的值', sendParams_region);
                Ds.DataService('/zoneConfig/save.json', sendParams_region, (resp) => {
                    console.log(resp);
                    if (resp.errorCode == 0) {
                        alert('保存成功');
                        DR.drawFeatures.disable();
                        ReactDOM.unmountComponentAtNode(document.getElementById("configPanel"));
                        lmsg.send('qypz', {
                            'data': 'success'
                        });
                    } else {
                        alert(resp.errorText);
                    }
                }, (e) => {
                    console.log(e);
                    alert('后台传输错误！')
                });


            }
        });


    },
    componentDidMount() {},
    checkPrime(rule, value, callback) {
        if (!value) {
            callback(new Error('编号值不能为空'));
        } else if (value.length !== 9) {
            callback(new Error('请输入9位区域编号'));
        } else {
            callback();
        }
    },
    render() {
        const {
            getFieldDecorator
        } = this.props.form;

        return (
            <Form inline onSubmit={this.handleSubmit}>
        <FormItem label="区域名称">
          {getFieldDecorator('regionName', {
            rules: [{
                required: true,
                message: '请填写区域名称'
            }, ]
        })(<Input placeholder="请输入名称" size='small'type = 'regionName' id='regionName' name='regionName'
          />)}
        </FormItem>
        <FormItem label="区域编号">
          {getFieldDecorator('regionNumber', {
            rules: [{
                required: true,
                validator: this.checkPrime
            }]
        })(<Input placeholder="请填写区域编号" size='small'
        type = 'number'
        id = 'regionNumber'
        name = 'regionNumber'
          />)}
        </FormItem>
        <FormItem label="区域颜色">
          
          {getFieldDecorator('regionColor', {
            rules: [{
                required: true,
                message: '请选择颜色'
            }]
        })(<Select size='small' style={{ width: 100 }} getPopupContainer={()=>document.getElementById('configPanel')} id='regionColor' name='regionColor'>
              <Option value="red" style={{color: 'red'}}>红色</Option>
              <Option value="green" style={{color: 'green'}}>绿色</Option>
              <Option value="yellow" style={{color: 'yellow'}}>黄色</Option>
              <Option value="blue" style={{color: 'blue'}}>蓝色</Option>
          </Select>)}
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
        this.props.form.validateFieldsAndScroll((errors, values) => {
            //console.log(errors)
            var regionFeature = DR.DrawConfigLayer.DrawOD.getValue();
            var selectedIDs = DR.DrawConfigLayer.DrawOD.calculateWithin().toString();

            if (!!errors) {
                alert('请检查错误');

            } else if (!regionFeature) {
                alert('请绘制图层');
            } else {
                //console.log('传给后台的值', values);
                var sendParams_od = {
                    qybh: values.odNumber,
                    qymc: values.odName,
                    qyfw: JSON.stringify(DR.DrawConfigLayer.DrawOD.getValue()),
                    ylzd1: values.odColor,
                    crossId: selectedIDs
                };
                console.log(sendParams_od);
                Ds.DataService('/odRegion/save.json', sendParams_od, (resp) => {
                    console.log(resp);
                    if (resp.errorCode == 0) {
                        alert('保存成功');
                        DR.drawFeatures.disable();
                        ReactDOM.unmountComponentAtNode(document.getElementById("configPanel"));
                        lmsg.send('odpz', {
                            'data': 'success'
                        });
                    } else {
                        alert(resp.errorText);
                    }
                }, (e) => {
                    console.log(e);
                    alert('后台传输错误！')
                });

            }

        });

    },
    componentDidMount() {

    },
    checkPrime(rule, value, callback) {
        if (!value) {
            callback(new Error('编号值不能为空'));
        } else if (value.length !== 9) {
            callback(new Error('请输入9位区域编号'));
        } else {
            callback();
        }
    },
    render() {
        const {
            getFieldDecorator
        } = this.props.form;

        return (
            <Form inline onSubmit={this.handleSubmit}>
        <FormItem label="OD名称">
          {getFieldDecorator('odName', {
            rules: [{
                required: true,
                message: '请填写OD区域名称'
            }]
        })(<Input placeholder="请输入OD名称" size='small' type = 'odName' id = 'odName' name = 'odName'/>)}
        </FormItem>
        <FormItem label="OD编号">
        {getFieldDecorator('odNumber', {
            rules: [{
                required: true,
                validator: this.checkPrime
            }]
        })(
          <Input placeholder="请填写OD编号" size='small'
        type = 'number'
        id = 'odNumber'
        name = 'odNumber'
          />)}
        </FormItem>
        <FormItem label="OD颜色">
{getFieldDecorator('odColor', {
            rules: [{
                required: true,
                message: '请选择颜色'
            }]
        })(<Select size='small' style={{ width: 100 }} getPopupContainer={()=>document.getElementById('configPanel')} id='odColor' name='odColor'>
            <Option value="red" style={{backgroundColor:'rgba(245,45,79,0.8)',}}>红色</Option>
            <Option value="green" style={{backgroundColor:'rgba(82,245,45,0.8)'}}>绿色</Option>
            <Option value="yellow" style={{backgroundColor:'rgba(245,223,45,0.8)'}}>黄色</Option>
            <Option value="blue" style={{backgroundColor:'rgba(45,183,245,0.8)'}}>蓝色</Option>
          </Select>)}
        </FormItem>
        <Button type="primary" size='small' htmlType="submit">保存</Button>
      </Form>
        );
    },
});
OdConfigPanel = Form.create()(OdConfigPanel);


let RoadConfigPanel = React.createClass({
    getInitialState() {
        return {
            options: [],
        };

    },
    componentDidMount() {

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
                alert('有误，请检查错误');
            } else {
                //console.log('传给后台的值', values);
                var sendParam_road = {
                    xgla: values.startSelect,
                    xglb: values.endSelect,
                    ldmc: values.roadName,
                    coordinates: JSON.stringify(DR.DrawConfigLayer.DrawRoad.getValue())
                }
                if (!sendParam_road.coordinates) alert('请画图先');
                Ds.DataService('/roadConfig/addDoubleSidedRoadInfo.json', sendParam_road, (resp) => {
                    console.log(resp);
                    if (resp.errorCode == 0) {
                        alert('保存成功');
                        DR.drawFeatures.disable();
                        ReactDOM.unmountComponentAtNode(document.getElementById("configPanel"));
                        lmsg.send('ldpz', {
                            'data': 'success'
                        });
                    } else {
                        alert(resp.errorText);
                    }
                }, (e) => {
                    alert('后台传输错误！');
                    console.log(e);
                });
            }

        });
    },
    render() {
        const {
            getFieldDecorator
        } = this.props.form;

        const RoadCrossOptions = selectionOptions_road.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>);

        return (
            <Form inline onSubmit={this.handleSubmit}>
        <FormItem label="路段名称">
          {getFieldDecorator('roadName', {
            rules: [{
                required: true,
                message: '请填写路段名称'
            }]
        })(<Input placeholder="请输入路段名称" size='small' type = 'roadName' id='roadName' name='roadName'/>)}
        </FormItem>
        <FormItem label="开始路口">
        {getFieldDecorator('startSelect', {
            rules: [
              { required: false, message: '请选择开始路口'},
            ],
          })(
            <Select showSearch optionFilterProp="children"  notFoundContent="未找到相应信息" placeholder="选择开始路口" style={{ width:150}} size='small' getPopupContainer={()=>document.getElementById('configPanel')}>
              {RoadCrossOptions}
            </Select>
          )}
        </FormItem>
        <FormItem label="结束路口">
          {getFieldDecorator('endSelect', {
            rules: [
              { required: false, message: '请选择结束路口' },
            ],
          })(
            <Select showSearch optionFilterProp="children"  notFoundContent="未找到相应信息" placeholder="选择结束路口" style={{ width:150}} size='small' getPopupContainer={()=>document.getElementById('configPanel')}>
              {RoadCrossOptions}
            </Select>
          )}
        </FormItem>
        <Button type="primary" size='small' htmlType="submit">保存</Button>
      </Form>
        );
    },
});
RoadConfigPanel = Form.create()(RoadConfigPanel);

export default ConfigSub