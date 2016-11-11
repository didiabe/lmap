import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../_toolBar.css';
import ConfigStyles from './_UniqueSub.css'
import * as CI from '../../../scripts/CongestionIndex';
import * as DR from '../../../scripts/drawFeatures';
import * as lmsg from '../../../libs/lmsg';
import * as lmap from '../../../libs/lmap';
import * as Ds from '../../../libs/DataService';
import {
    Button,
    Icon,
    Form,
    Input,
    Select,
    Popover,
    Modal,
    Slider,
    InputNumber,
    Row,
    Col,
    message
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
var regionConfigModify_id = null,
    regionConfigModify_name = null,
    regionConfigModify_color = null,
    odConfigModify_id = null,
    odConfigModify_name = null,
    odConfigModify_color = null,
    roadConfigModify_id = null,
    roadConfigModify_name = null,
    selectionOptions_road = null;
class ConfigSub extends React.Component {
    constructor() {
        super();
        this.state = {
            active: null
        }
    }
    componentWillMount() {
        this.setState({
            active: this.props.isActive.active_Config
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            active: nextProps.isActive.active_Config
        });
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
        this.props.callbackParent({
            status1: !this.state.active,
            status2: !this.state.active,
            status3: !this.state.active,
            status4: !this.state.active,
            status5: this.state.active,
        });
    }
    componentWillUnmount() {
        lmap.removeEchartsLayer();
        DR.drawFeatures.disable();
    }
    render() {
        return (
            <div>
        <li
            ref="startUnipanel"
            id="trafficConditions"
            onClick={ () => this.mountTrafficConditions() }>
          <div type="fullscreen">
            <span className={ this.state.active ? styles.fullscreen_active : styles.fullscreen }>配置</span>
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
        this.setState({
            isloading1: false,
            isloading2: false,
            isloading3: false,
            isloaded1: false,
            isloaded2: false,
            isloaded3: false,
        });

        if (ref == 'roadConfig') {
            message.success('您已進入双向道路配置頁面');
            this.setState({
                isloading1: true,
            });
            Ds.DataService('/trafficindex_map/listSxRoadMap.json', null, (resp) => {
                self.setState({
                    isloading1: false,
                    isloaded1: true
                });
                CI.displayConfigLayer_road(resp.aaData);
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
            message.success('您已進入区域配置頁面');
            this.setState({
                isloading2: true,
            });
            Ds.DataService('/trafficindex_map/ListZoneMap.json', null, (resp) => {
                CI.displayConfigLayer(resp.aaData);
                self.setState({
                    isloading2: false,
                    isloaded2: true
                });
                DR.DrawConfigLayer.DrawRegion.activate();
                DR.DrawConfigLayer.DrawRegion.dataRecv(resp.aaData);
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
            message.success('您已進入OD区域配置頁面');
            self.setState({
                isloading3: true,
            });
            Ds.DataService('/trafficindex_map/listOdZoneMap.json', null, (resp) => {
                CI.displayConfigLayer(resp.aaData);
                self.setState({
                    isloading3: false,
                    isloaded3: true
                });
                DR.DrawConfigLayer.DrawOD.activate();
                DR.DrawConfigLayer.DrawOD.dataRecv(resp.aaData);
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

        } else if (ref = 'fhld') {
            message.success('您已進入复合路段配置頁面');
            Ds.DataService('/trafficindex_map/roadMap.json', null, (resp) => {
                CI.displayConfigLayer_road(resp.aaData); //这个加载的应该是符合路段的data
                //DR.DrawConfigLayer.DrawFhld.activate(resp.aaData); //这个data应该是双向路段的data
            }, (e) => {
                console.log(e)
            });

        } else if (ref = 'fhld_locating') {
            Ds.DataService('/trafficindex_map/listSxRoadMap.json', null, (resp) => {
                message.warning('开始绘制复合路段信息', 5);
                DR.DrawConfigLayer.DrawFhld.activate(resp.aaData); //这个data应该是双向路段的data
            }, (e) => {
                console.log(e)
            });
        } else alert('加载地图图层错误');
    }
    ChangeConfig(ref) {
        ReactDOM.unmountComponentAtNode(document.getElementById("configPanel"));
        DR.drawFeatures.disable();
        if (ref == 'regionConfig') {
            Ds.DataService('/trafficindex_map/ListZoneMap.json', null, (resp) => {
                CI.changeConfigLayer(resp.aaData.zone, ref);
                DR.DrawConfigLayer.DrawRegion.dataRecv(resp.aaData);
            }, (e) => {
                console.log(e);
                alert('后台传输错误！');
            });
        } else if (ref == 'odConfig') {
            Ds.DataService('/trafficindex_map/listOdZoneMap.json', null, (resp) => {
                CI.changeConfigLayer(resp.aaData.zone, ref);
                DR.DrawConfigLayer.DrawOD.dataRecv(resp.aaData);
            }, (e) => {
                console.log(e);
                alert('后台传输错误！');
            });
        } else if (ref == 'roadConfig') {
            Ds.DataService('/trafficindex_map/listSxRoadMap.json', null, (resp) => {
                CI.changeConfigLayer(resp.aaData, ref);
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
        lmsg.subscribe('peizhi', (data) => {
            console.log('peizhi', data);
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
                    Modal.success({
                        title: '路段配置',
                        content: '您已进入符合路段配置页面',
                    });
                    self.onClickButton("fhld");
                    break;
                case 'fhld_locating':
                    //self.onClickButton("fhld");
                    Modal.success({
                        title: '定位启动',
                        content: '请点击右上角绘图按钮开始绘制道路',
                    });
                    self.onClickButton("fhld_locating");
                    break;
            }

        });
        //lmsg.send('fhld_ok',{new_fhld:11, doublers:[{name:11, id:11},{name:11, id:11},{name:11, id:11}]})
        lmsg.subscribe('openChangeConfigPanel', (data) => {

            Modal.confirm({
                title: '您选择的道路/区域名称是：' + data.name,
                content: '确认修改请重新绘制并填入相关信息。',
                onOk() {
                    if (data.ref == 'regionConfig') {
                        console.log(data.id);
                        regionConfigModify_id = data.id;
                        regionConfigModify_name = data.name;
                        regionConfigModify_color = data.color;
                        ReactDOM.render(
                            <RegionConfigPanel_Modify/>, document.getElementById("configPanel")
                        );
                        DR.DrawConfigLayer.DrawRegion.activate();
                    } else if (data.ref == 'odConfig') {
                        console.log(data.id);
                        odConfigModify_id = data.id;
                        odConfigModify_name = data.name;
                        odConfigModify_color = data.color;
                        ReactDOM.render(
                            <OdConfigPanel_Modify/>, document.getElementById("configPanel")
                        );
                        DR.DrawConfigLayer.DrawOD.activate();
                    } else if (data.ref == 'roadConfig') {
                        console.log(data.id);
                        roadConfigModify_id = data.id;
                        roadConfigModify_name = data.name;
                        ReactDOM.render(
                            <RoadConfigPanel_Modify/>, document.getElementById("configPanel")
                        );
                        DR.DrawConfigLayer.DrawRoad.activate();
                    }
                    /*return new Promise((resolve, reject) => {
                        //setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                        setTimeout(resolve, 1000);
                    }).catch(() => console.log('Oops errors!'));*/
                },
                onCancel() {
                    self.ChangeConfig(data.ref);
                },
            });
            localStorage.removeItem('openChangeConfigPanel');
        });

    }
    render() {
        const regionConfig = (
            <div>
      <Button
              id="regionConfig_add"
              ref="regionConfig_add"
              className={ ConfigStyles.button1 }
              type="ghost"
              size="small"
              loading={ this.state.isloading2 }
              onClick={ () => this.onClickButton("regionConfig") }>
        新增
      </Button>
      <Button
              id="regionConfig_fix"
              ref="regionConfig_fix"
              className={ ConfigStyles.button1 }
              type="ghost"
              size="small"
              loading={ this.state.isloading2 }
              onClick={ () => this.ChangeConfig("regionConfig") }>
        修改
      </Button>
    </div>);
        const odConfig = (
            <div>
      <Button
              id="odConfig_add"
              ref="odConfig_add"
              className={ ConfigStyles.button1 }
              type="ghost"
              size="small"
              loading={ this.state.isloading2 }
              onClick={ () => this.onClickButton("odConfig") }>
        新增
      </Button>
      <Button
              id="odConfig_fix"
              ref="odConfig_fix"
              className={ ConfigStyles.button1 }
              type="ghost"
              size="small"
              loading={ this.state.isloading2 }
              onClick={ () => this.ChangeConfig("odConfig") }>
        修改
      </Button>
    </div>);
        const roadConfig = (
            <div>
      <Button
              id="roadConfig_add"
              ref="roadConfig_add"
              className={ ConfigStyles.button1 }
              type="ghost"
              size="small"
              loading={ this.state.isloading2 }
              onClick={ () => this.onClickButton("roadConfig") }>
        新增
      </Button>
      <Button
              id="roadConfig_fix"
              ref="roadConfig_fix"
              className={ ConfigStyles.button1 }
              type="ghost"
              size="small"
              loading={ this.state.isloading2 }
              onClick={ () => this.ChangeConfig("roadConfig") }>
        修改
      </Button>
    </div>);

        return (
            <div
           className={ ConfigStyles.boxpanel }
           id="configDetails">
        <div className={ ConfigStyles.panel_header }>
          配置信息
        </div>
        <div
             className={ ConfigStyles.panel_body }
             id="Configpanel_body">
          <Button
                  id="crossConfig"
                  ref="crossConfig"
                  className={ ConfigStyles.button1 }
                  type="primary"
                  size="small"
                  disabled={ false }
                  onClick={ () => this.onClickButton('fhld') }>
            复合路段
          </Button>
          <Popover
                   ref="roadConfig"
                   content={ roadConfig }
                   placement="topLeft"
                   title="请选择"
                   trigger="hover"
                   getTooltipContainer={ () => document.getElementById('configDetails') }>
            <Button
                    id="roadConfig"
                    ref="roadConfig"
                    className={ ConfigStyles.button1 }
                    type="primary"
                    size="small"
                    loading={ this.state.isloading1 }>
              双向路段
            </Button>
          </Popover>
          <Popover
                   ref="regionConfig"
                   content={ regionConfig }
                   placement="top"
                   title="请选择"
                   trigger="hover"
                   getTooltipContainer={ () => document.getElementById('configDetails') }>
            <Button
                    id="regionConfig"
                    ref="regionConfig"
                    className={ ConfigStyles.button1 }
                    type="primary"
                    size="small"
                    loading={ this.state.isloading2 }>
              区域配置
            </Button>
          </Popover>
          <Popover
                   ref="odConfig"
                   content={ odConfig }
                   placement="topRight"
                   title="请选择"
                   trigger="hover"
                   getTooltipContainer={ () => document.getElementById('configDetails') }>
            <Button
                    id="odConfig"
                    ref="odConfig"
                    className={ ConfigStyles.button1 }
                    type="primary"
                    size="small"
                    loading={ this.state.isloading3 }>
              OD区域
            </Button>
          </Popover>
        </div>
        <br/>
        <div id='configPanel'></div>
      </div>
        )

    }


}
let RegionConfigPanel = React.createClass({
    getInitialState() {
        return {
            sliderVal1: 0,
            sliderVal2: 0,
            sliderVal3: 0,
            sliderVal4: 1
        };
    },
    handleSubmit(e) {
        e.preventDefault();
        //console.log(this.props.form.getFieldsValue());
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                alert('请检查错误');
            } else if (DR.DrawConfigLayer.DrawRegion.getValue() == null) {
                alert('请先画图')
            } else {
                //console.log('传给后台的值', values);
                var sendParams_region = {
                    qybh: values.regionNumber,
                    qymc: values.regionName,
                    qyfw: JSON.stringify(DR.DrawConfigLayer.DrawRegion.getValue()),
                    ylzd1: this.state.sliderVal1 + ',' + this.state.sliderVal2 + ',' + this.state.sliderVal3 + ',' + this.state.sliderVal4,
                    crossid: DR.DrawConfigLayer.DrawRegion.calculateWithin().crossIds.toString(),
                    roadid: DR.DrawConfigLayer.DrawRegion.calculateWithin().roadIds.toString()
                };
                console.log('传给后台的值', sendParams_region);
                Ds.DataService('/trafficindex_zoneConfig/add.json', sendParams_region, (resp) => {
                    console.log(resp);
                    if (resp.errorCode == 'success') {
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

    checkPrime(rule, value, callback) {
        if (!value) {
            callback(new Error('编号值不能为空'));
        } else if (value.length !== 9) {
            callback(new Error('请输入9位区域编号'));
        } else {
            callback();
        }
    },
    SliderVal1(value) {
        this.setState({
            sliderVal1: value
        });
    },
    SliderVal2(value) {
        this.setState({
            sliderVal2: value
        });
    },
    SliderVal3(value) {
        this.setState({
            sliderVal3: value
        });
    },
    SliderVal4(value) {
        this.setState({
            sliderVal4: value
        });
    },
    componentDidMount() {

    },
    render() {

        const {
            getFieldDecorator
        } = this.props.form;

        return (
            <Form
            inline
            onSubmit={ this.handleSubmit }>
        <FormItem label="区域名称">
          { getFieldDecorator('regionName', {
              rules: [{
                required: true,
                message: '请填写区域名称'
              },]
            })(<Input
                      placeholder="请输入名称"
                      size='small'
                      type='regionName'
                      id='regionName'
                      name='regionName' />) }
        </FormItem>
        <FormItem label="区域编号">
          { getFieldDecorator('regionNumber', {
              rules: [{
                required: true,
                validator: this.checkPrime
              }]
            })(<Input
                      placeholder="请填写区域编号"
                      size='small'
                      type='number'
                      id='regionNumber'
                      name='regionNumber' />) }
        </FormItem>
        <Row>
        <Col span={2}>{'R'}</Col>
        <Col span={12}>
        <Slider min={0} max={255} value={this.state.sliderVal1} onChange = {this.SliderVal1}/>
        </Col>
        <Col span={4}>
        <InputNumber min={0} max={255} style={{ marginLeft: '16px' }} value={this.state.sliderVal1} onChange={this.SliderVal1}/>
          </Col>
        </Row>
        <Row>
        <Col span={2}>{'G'}</Col>
        <Col span={12}>
        <Slider min={0} max={255} value={this.state.sliderVal2} onChange = {this.SliderVal2}/>
        </Col>
        <Col span={4}>
        <InputNumber min={0} max={255} style={{ marginLeft: '16px' }} value={this.state.sliderVal2} onChange={this.SliderVal2}/>
          </Col>
        </Row>
        <Row>
        <Col span={2}>{'B'}</Col>
        <Col span={12}>
        <Slider min={0} max={255} value={this.state.sliderVal3} onChange = {this.SliderVal3}/>
        </Col>
        <Col span={4}>
        <InputNumber min={0} max={255} style={{ marginLeft: '16px' }} value={this.state.sliderVal3} onChange={this.SliderVal3}/>
          </Col>
        </Row>
        <Row>
        <Col span={2}>{'A'}</Col>
        <Col span={12}>
        <Slider min={0} max={1} step={0.1} value={this.state.sliderVal4} onChange = {this.SliderVal4}/>
        </Col>
        <Col span={4}>
        <InputNumber min={0} max={1} step={0.1} style={{ marginLeft: '16px' }} value={this.state.sliderVal4} onChange={this.SliderVal4}/>
          </Col>
        </Row>
        <Row>
        <Col span={7}>
        {'区域颜色预览:'}
        </Col>
        <Col span={10}>
        <div id = 'regionConfig_color' className={ConfigStyles.colorpickerDiv} style={ { backgroundColor: 'rgba(' + this.state.sliderVal1 + ',' + this.state.sliderVal2 + ',' + this.state.sliderVal3 + ',' + this.state.sliderVal4 + ')', marginLeft:'5px', width:'100px',height:'20px', borderRadius:'5px' } }></div>
         </Col>
         <Col span ={5}>
         <Button type="primary" size='small' htmlType="submit">
          保存
        </Button>
         </Col>
         </Row>     
        
 </Form>
        );
    },
})
RegionConfigPanel = Form.create()(RegionConfigPanel);

let OdConfigPanel = React.createClass({
    getInitialState() {
        return {
            sliderVal1: 0,
            sliderVal2: 0,
            sliderVal3: 0,
            sliderVal4: 1
        };
    },
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
                    ylzd1: this.state.sliderVal1 + ',' + this.state.sliderVal2 + ',' + this.state.sliderVal3 + ',' + this.state.sliderVal4,
                    crossId: selectedIDs,
                    point: '[' + DR.DrawConfigLayer.DrawOD.calculateCenterPoint().toString() + ']'

                };
                Ds.DataService('/trafficindex_bodregionconfig/add.json', sendParams_od, (resp) => {
                    console.log(resp);
                    if (resp.errorCode == 'success') {
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
    SliderVal1(value) {
        this.setState({
            sliderVal1: value
        });
    },
    SliderVal2(value) {
        this.setState({
            sliderVal2: value
        });
    },
    SliderVal3(value) {
        this.setState({
            sliderVal3: value
        });
    },
    SliderVal4(value) {
        this.setState({
            sliderVal4: value
        });
    },
    render() {
        const {
            getFieldDecorator
        } = this.props.form;

        return (
            <Form
            inline
            onSubmit={ this.handleSubmit }>
        <FormItem label="OD名称">
          { getFieldDecorator('odName', {
              rules: [{
                required: true,
                message: '请填写OD区域名称'
              }]
            })(<Input
                      placeholder="请输入OD名称"
                      size='small'
                      type='odName'
                      id='odName'
                      name='odName' />) }
        </FormItem>
        <FormItem label="OD编号">
          { getFieldDecorator('odNumber', {
              rules: [{
                required: true,
                validator: this.checkPrime
              }]
            })(
              <Input
                     placeholder="请填写OD编号"
                     size='small'
                     type='number'
                     id='odNumber'
                     name='odNumber' />) }
        </FormItem>
        <Row>
        <Col span={2}>{'R'}</Col>
        <Col span={12}>
        <Slider min={0} max={255} value={this.state.sliderVal1} onChange = {this.SliderVal1}/>
        </Col>
        <Col span={4}>
        <InputNumber min={0} max={255} style={{ marginLeft: '16px' }} value={this.state.sliderVal1} onChange={this.SliderVal1}/>
          </Col>
        </Row>
        <Row>
        <Col span={2}>{'G'}</Col>
        <Col span={12}>
        <Slider min={0} max={255} value={this.state.sliderVal2} onChange = {this.SliderVal2}/>
        </Col>
        <Col span={4}>
        <InputNumber min={0} max={255} style={{ marginLeft: '16px' }} value={this.state.sliderVal2} onChange={this.SliderVal2}/>
          </Col>
        </Row>
        <Row>
        <Col span={2}>{'B'}</Col>
        <Col span={12}>
        <Slider min={0} max={255} value={this.state.sliderVal3} onChange = {this.SliderVal3}/>
        </Col>
        <Col span={4}>
        <InputNumber min={0} max={255} style={{ marginLeft: '16px' }} value={this.state.sliderVal3} onChange={this.SliderVal3}/>
          </Col>
        </Row>
        <Row>
        <Col span={2}>{'A'}</Col>
        <Col span={12}>
        <Slider min={0} max={1} step={0.1} value={this.state.sliderVal4} onChange = {this.SliderVal4}/>
        </Col>
        <Col span={4}>
        <InputNumber min={0} max={1} step={0.1} style={{ marginLeft: '16px' }} value={this.state.sliderVal4} onChange={this.SliderVal4}/>
          </Col>
        </Row>
        <Row>
        <Col span={7}>
        {'区域颜色预览:'}
        </Col>
        <Col span={10}>
        <div id = 'regionConfig_color' className={ConfigStyles.colorpickerDiv} style={ { backgroundColor: 'rgba(' + this.state.sliderVal1 + ',' + this.state.sliderVal2 + ',' + this.state.sliderVal3 + ',' + this.state.sliderVal4 + ') ', marginLeft:'5px', width:'100px',height:'20px', borderRadius:'5px' } }></div>
         </Col>
         <Col span ={5}>
         <Button type="primary" size='small' htmlType="submit">
          保存
        </Button>
         </Col>
         </Row>
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
    componentWillMount() {
        //路段配置下拉框内容
        Ds.DataService('/trafficindex_roadConfiguration/listSearchDoubleRoad.json', null, (resp) => {
            selectionOptions_road = resp.aaData;
        }, (e) => {
            alert('后台传输错误！');
            console.log(e);
        });
    },
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                alert('有误，请检查错误');
            } else if (DR.DrawConfigLayer.DrawRoad.getValue() == null) {
                alert('请画一条道路再保存');
            } else {
                var sendParam_road = {
                    xgla: values.startSelect,
                    xglb: values.endSelect,
                    ldmc: values.roadName,
                    coordinates: JSON.stringify(DR.DrawConfigLayer.DrawRoad.getValue())
                }
                if (!sendParam_road.coordinates) alert('请画图先');
                Ds.DataService('/trafficindex_roadConfiguration/addDoubleSidedRoadInfo.json', sendParam_road, (resp) => {
                    if (resp.errorCode == 'success') {
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

        const RoadCrossOptions = selectionOptions_road.map(item => <Option
                                                                       key={ item.id }
                                                                       value={ item.id }>
                                                                 { item.name }
                                                               </Option>);

        return (
            <Form
            inline
            onSubmit={ this.handleSubmit }>
        <FormItem label="路段名称">
          { getFieldDecorator('roadName', {
              rules: [{
                required: true,
                message: '请填写路段名称'
              }]
            })(<Input
                      placeholder="请输入路段名称"
                      size='small'
                      type='roadName'
                      id='roadName'
                      name='roadName' />) }
        </FormItem>
        <FormItem label="开始路口">
          { getFieldDecorator('startSelect', {
              rules: [
                {
                  required: false,
                  message: '请选择开始路口'
                },
              ],
            })(
              <Select
                      showSearch
                      optionFilterProp="children"
                      notFoundContent="未找到相应信息"
                      placeholder="选择开始路口"
                      style={ { width: 150 } }
                      size='small'
                      getPopupContainer={ () => document.getElementById('configPanel') }>
                { RoadCrossOptions }
              </Select>
            ) }
        </FormItem>
        <FormItem label="结束路口">
          { getFieldDecorator('endSelect', {
              rules: [
                {
                  required: false,
                  message: '请选择结束路口'
                },
              ],
            })(
              <Select
                      showSearch
                      optionFilterProp="children"
                      notFoundContent="未找到相应信息"
                      placeholder="选择结束路口"
                      style={ { width: 150 } }
                      size='small'
                      getPopupContainer={ () => document.getElementById('configPanel') }>
                { RoadCrossOptions }
              </Select>
            ) }
        </FormItem>
        <Button
                type="primary"
                size='small'
                htmlType="submit">
          保存
        </Button>
      </Form>
        );
    },
});
RoadConfigPanel = Form.create()(RoadConfigPanel);

let RegionConfigPanel_Modify = React.createClass({
    getInitialState() {
        return {
            sliderVal1: 0,
            sliderVal2: 0,
            sliderVal3: 0,
            sliderVal4: 1
        };
    },
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            //if(!DR.DrawConfigLayer.DrawRegion.getValue()) alert('请先画图');

            var coloring = ((this.state.sliderVal1 + ',' + this.state.sliderVal2 + ',' + this.state.sliderVal3 + ',' + this.state.sliderVal4) == '0,0,0,1') ? regionConfigModify_color : this.state.sliderVal1 + ',' + this.state.sliderVal2 + ',' + this.state.sliderVal3 + ',' + this.state.sliderVal4;
            var sendParams_region = {
                qybh: regionConfigModify_id,
                qymc: values.regionName_modify,
                qyfw: DR.DrawConfigLayer.DrawRegion.getValue() ? JSON.stringify(DR.DrawConfigLayer.DrawRegion.getValue()) : '',
                ylzd1: coloring, //this.state.sliderVal1 + ',' + this.state.sliderVal2 + ',' + this.state.sliderVal3 + ',' + this.state.sliderVal4,
                crossid: DR.DrawConfigLayer.DrawRegion.getValue() ? DR.DrawConfigLayer.DrawRegion.calculateWithin().crossIds.toString() : '',
                roadid: DR.DrawConfigLayer.DrawRegion.getValue() ? DR.DrawConfigLayer.DrawRegion.calculateWithin().roadIds.toString() : ''
            };
            console.log('传给后台的值', sendParams_region);
            Ds.DataService('/trafficindex_zoneConfig/update.json', sendParams_region, (resp) => {
                if (resp.errorCode == 'success') {
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

        });
    },
    componentDidMount() {},
    SliderVal1(value) {
        this.setState({
            sliderVal1: value
        });
    },
    SliderVal2(value) {
        this.setState({
            sliderVal2: value
        });
    },
    SliderVal3(value) {
        this.setState({
            sliderVal3: value
        });
    },
    SliderVal4(value) {
        this.setState({
            sliderVal4: value
        });
    },
    render() {
        const {
            getFieldDecorator
        } = this.props.form;

        return (
            <Form
            inline
            onSubmit={ this.handleSubmit }>
        <FormItem label="区域名称">
          { getFieldDecorator('regionName_modify', {
              initialValue: regionConfigModify_name
            })(<Input
                      placeholder="请输入名称"
                      size='small'
                      type='regionName_modify'
                      id='regionName_modify'
                      name='regionName_modify' />) }
        </FormItem>
        <FormItem label="区域编号">
          { getFieldDecorator('regionNumber_modify', {
            
            })(<p
                  id='regionNumber_modify'
                  name='regionName_modify'>
                 { regionConfigModify_id }
               </p>) }
        </FormItem>
        <Row>
        <Col span={2}>{'R'}</Col>
        <Col span={12}>
        <Slider min={0} max={255} value={this.state.sliderVal1} onChange = {this.SliderVal1}/>
        </Col>
        <Col span={4}>
        <InputNumber min={0} max={255} style={{ marginLeft: '16px' }} value={this.state.sliderVal1} onChange={this.SliderVal1}/>
          </Col>
        </Row>
        <Row>
        <Col span={2}>{'G'}</Col>
        <Col span={12}>
        <Slider min={0} max={255} value={this.state.sliderVal2} onChange = {this.SliderVal2}/>
        </Col>
        <Col span={4}>
        <InputNumber min={0} max={255} style={{ marginLeft: '16px' }} value={this.state.sliderVal2} onChange={this.SliderVal2}/>
          </Col>
        </Row>
        <Row>
        <Col span={2}>{'B'}</Col>
        <Col span={12}>
        <Slider min={0} max={255} value={this.state.sliderVal3} onChange = {this.SliderVal3}/>
        </Col>
        <Col span={4}>
        <InputNumber min={0} max={255} style={{ marginLeft: '16px' }} value={this.state.sliderVal3} onChange={this.SliderVal3}/>
          </Col>
        </Row>
        <Row>
        <Col span={2}>{'A'}</Col>
        <Col span={12}>
        <Slider min={0} max={1} step={0.1} value={this.state.sliderVal4} onChange = {this.SliderVal4}/>
        </Col>
        <Col span={4}>
        <InputNumber min={0} max={1} step={0.1} style={{ marginLeft: '16px' }} value={this.state.sliderVal4} onChange={this.SliderVal4}/>
          </Col>
        </Row>
        <Row>
        <Col span={7}>
        {'区域颜色预览:'}
        </Col>
        <Col span={10}>
        <div id = 'regionConfig_color' className={ConfigStyles.colorpickerDiv} style={ { backgroundColor: 'rgba(' + this.state.sliderVal1 + ',' + this.state.sliderVal2 + ',' + this.state.sliderVal3 + ',' + this.state.sliderVal4 + ') ', marginLeft:'5px', width:'100px',height:'20px', borderRadius:'5px'  } }></div>
         </Col>
         <Col span ={5}>
         <Button type="primary" size='small' htmlType="submit">
          保存
        </Button>
         </Col>
         </Row>
      </Form>
        );
    },
});
RegionConfigPanel_Modify = Form.create()(RegionConfigPanel_Modify);

let OdConfigPanel_Modify = React.createClass({
    getInitialState() {
        return {
            sliderVal1: 0,
            sliderVal2: 0,
            sliderVal3: 0,
            sliderVal4: 1
        };
    },
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((errors, values) => {
            var coloring = ((this.state.sliderVal1 + ',' + this.state.sliderVal2 + ',' + this.state.sliderVal3 + ',' + this.state.sliderVal4) == '0,0,0,1') ? regionConfigModify_color : this.state.sliderVal1 + ',' + this.state.sliderVal2 + ',' + this.state.sliderVal3 + ',' + this.state.sliderVal4;
            var ODregionValue = DR.DrawConfigLayer.DrawOD.getValue();

            var sendParams_od = {
                qybh: odConfigModify_id,
                qymc: values.odName_modify,
                qyfw: ODregionValue ? JSON.stringify(DR.DrawConfigLayer.DrawOD.getValue()) : '',
                ylzd1: coloring,
                crossId: ODregionValue ? DR.DrawConfigLayer.DrawOD.calculateWithin().toString() : '',
                point: ODregionValue ? ('[' + DR.DrawConfigLayer.DrawOD.calculateCenterPoint().toString() + ']') : ''
            };
            if (sendParams_od.qymc.length !== 0) {
                Ds.DataService('/trafficindex_bodregionconfig/update.json', sendParams_od, (resp) => {
                    if (resp.errorCode == 'success') {
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
            } else alert('区域名称不能为空');
        });
    },
    componentDidMount() {},
    SliderVal1(value) {
        this.setState({
            sliderVal1: value
        });
    },
    SliderVal2(value) {
        this.setState({
            sliderVal2: value
        });
    },
    SliderVal3(value) {
        this.setState({
            sliderVal3: value
        });
    },
    SliderVal4(value) {
        this.setState({
            sliderVal4: value
        });
    },
    render() {
        const {
            getFieldDecorator
        } = this.props.form;

        return (
            <Form
            inline
            onSubmit={ this.handleSubmit }>
        <FormItem label="OD名称">
          { getFieldDecorator('odName_modify', {
              initialValue: odConfigModify_name
            })(<Input
                      placeholder="请输入OD名称"
                      size='small'
                      type='odName_modify'
                      id='odName_modify'
                      name='odName_modify' />) }
        </FormItem>
        <FormItem label="OD编号">
          { getFieldDecorator('odNumber_modify', {
            
            })(
              <p>
                { odConfigModify_id }
              </p>) }
        </FormItem>
       <Row>
        <Col span={2}>{'R'}</Col>
        <Col span={12}>
        <Slider min={0} max={255} value={this.state.sliderVal1} onChange = {this.SliderVal1}/>
        </Col>
        <Col span={4}>
        <InputNumber min={0} max={255} style={{ marginLeft: '16px' }} value={this.state.sliderVal1} onChange={this.SliderVal1}/>
          </Col>
        </Row>
        <Row>
        <Col span={2}>{'G'}</Col>
        <Col span={12}>
        <Slider min={0} max={255} value={this.state.sliderVal2} onChange = {this.SliderVal2}/>
        </Col>
        <Col span={4}>
        <InputNumber min={0} max={255} style={{ marginLeft: '16px' }} value={this.state.sliderVal2} onChange={this.SliderVal2}/>
          </Col>
        </Row>
        <Row>
        <Col span={2}>{'B'}</Col>
        <Col span={12}>
        <Slider min={0} max={255} value={this.state.sliderVal3} onChange = {this.SliderVal3}/>
        </Col>
        <Col span={4}>
        <InputNumber min={0} max={255} style={{ marginLeft: '16px' }} value={this.state.sliderVal3} onChange={this.SliderVal3}/>
          </Col>
        </Row>
        <Row>
        <Col span={2}>{'A'}</Col>
        <Col span={12}>
        <Slider min={0} max={1} step={0.1} value={this.state.sliderVal4} onChange = {this.SliderVal4}/>
        </Col>
        <Col span={4}>
        <InputNumber min={0} max={1} step={0.1} style={{ marginLeft: '16px' }} value={this.state.sliderVal4} onChange={this.SliderVal4}/>
          </Col>
        </Row>
        <Row>
        <Col span={7}>
        {'区域颜色预览:'}
        </Col>
        <Col span={10}>
        <div id = 'regionConfig_color' className={ConfigStyles.colorpickerDiv} style={ { backgroundColor: 'rgba(' + this.state.sliderVal1 + ',' + this.state.sliderVal2 + ',' + this.state.sliderVal3 + ',' + this.state.sliderVal4 + ') ', marginLeft:'5px', width:'100px', height:'20px', borderRadius:'5px'  } }></div>
         </Col>
         <Col span ={5}>
         <Button type="primary" size='small' htmlType="submit">
          保存
        </Button>
         </Col>
         </Row>
      </Form>
        );
    },
});
OdConfigPanel_Modify = Form.create()(OdConfigPanel_Modify);

let RoadConfigPanel_Modify = React.createClass({
    getInitialState() {
        return {
            options: [],
        };
    },
    componentWillMount() {
        //路段配置下拉框内容
        Ds.DataService('/trafficindex_roadConfiguration/listSearchDoubleRoad.json', null, (resp) => {
            selectionOptions_road = resp.aaData;
        }, (e) => {
            alert('后台传输错误！');
            console.log(e);
        });
    },

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (roadConfigModify_id) {
                var sendParam_road = {
                        xgla: values.startSelect,
                        xglb: values.endSelect,
                        ldmc: values.roadName,
                        coordinates: DR.DrawConfigLayer.DrawRoad.getValue() ? JSON.stringify(DR.DrawConfigLayer.DrawRoad.getValue()) : null,
                        doubleroadid: roadConfigModify_id
                    }
                    //if (!sendParam_road.coordinates) alert('请画图先');
                Ds.DataService('/trafficindex_roadConfiguration/updateRoadConfigInfoByComplexRoad.json', sendParam_road, (resp) => {
                    if (resp.errorCode == 'success') {
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

        const RoadCrossOptions = selectionOptions_road.map(item => <Option
                                                                       key={ item.id }
                                                                       value={ item.id }>
                                                                 { item.name }
                                                               </Option>);

        return (
            <Form
            inline
            onSubmit={ this.handleSubmit }>
        <FormItem label="路段名称">
          { getFieldDecorator('roadName', {
              rules: [{
                required: true,
                message: '请填写路段名称'
              }],
              initialValue: roadConfigModify_name
            })(<Input
                      placeholder="请输入路段名称"
                      size='small'
                      type='roadName'
                      id='roadName'
                      name='roadName' />) }
        </FormItem>
        <FormItem label="开始路口">
          { getFieldDecorator('startSelect', {
              rules: [
                {
                  required: false,
                  message: '请选择开始路口'
                },
              ],
            })(
              <Select
                      showSearch
                      optionFilterProp="children"
                      notFoundContent="未找到相应信息"
                      placeholder="选择开始路口"
                      style={ { width: 150 } }
                      size='small'
                      getPopupContainer={ () => document.getElementById('configPanel') }>
                { RoadCrossOptions }
              </Select>
            ) }
        </FormItem>
        <FormItem label="结束路口">
          { getFieldDecorator('endSelect', {
              rules: [
                {
                  required: false,
                  message: '请选择结束路口'
                },
              ],
            })(
              <Select
                      showSearch
                      optionFilterProp="children"
                      notFoundContent="未找到相应信息"
                      placeholder="选择结束路口"
                      style={ { width: 150 } }
                      size='small'
                      getPopupContainer={ () => document.getElementById('configPanel') }>
                { RoadCrossOptions }
              </Select>
            ) }
        </FormItem>
        <Button
                type="primary"
                size='small'
                htmlType="submit">
          保存
        </Button>
      </Form>
        );
    },
});
RoadConfigPanel_Modify = Form.create()(RoadConfigPanel_Modify);

export default ConfigSub