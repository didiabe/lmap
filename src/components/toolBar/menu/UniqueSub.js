import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../_toolBar.css';
import UniqueStyles from './_UniqueSub.css'
import * as CI from '../../../scripts/CongestionIndex';
import * as DR from '../../../scripts/drawFeatures';
import * as lmsg from '../../../libs/lmsg';
import {
    connect
} from 'react-redux';
//import * as action from '../../actions/searchAction';

var Button = require('antd/lib/button');
var Icon = require('antd/lib/icon');
var Popover = require('antd/lib/popover');
var Modal = require('antd/lib/modal');
const ButtonGroup = Button.Group;
class UniqueSub extends React.Component {
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
        if (!document.getElementById('uniqueDetails')) {
            this.setState({
                active: !this.state.active
            });
            ReactDOM.render(
                <UniquePanel/>, document.getElementById("presetBox")
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
                    <div type="subway">
                        <span className={this.state.active ? styles.subway_active : styles.subway}>专题</span>
                    </div>
                </li>
            </div>
        )
    }
    componentDidMount() {
        /*setTimeout(function() {
            ReactDOM.render(
                <UniquePanel/>, document.getElementById("presetBox")
            )
        }, 3000)
*/
        //console.log(ReactDOM.unmountComponentAtNode(<UniquePanel/>))
        let self = this;
        lmsg.subscribe('locating', (data) => {

            console.log(data);
            ReactDOM.render(
                <UniquePanel/>, document.getElementById("presetBox")
            )
        });
        lmsg.subscribe('tracktaxi', (data) => {
            console.log(data);
            //data={startTracking=true, params:{id:223, time:20123039}}
            if (data.startTracking) {
                CI.trackingTaxi(data.params);
            } else if (!data.startTracking) CI.stopTrackingTaxi();
            else alert("追踪参数错误！");
        });
        lmsg.subscribe('cfxydBtnClick', (data) => {
            console.log(data);
            ReactDOM.render(
                <UniquePanel/>, document.getElementById("presetBox")
            )
        });

    }
}

var _APIpath = null;

var showModalWarning = () => {
    Modal.warning({
        title: '定位已经启动',
        content: '请点击屏幕右上角画图工具定位地图信息',
    });
}

class UniquePanel extends React.Component {
        constructor() {
            super();
            this.onClickButton = this.onClickButton.bind(this);
            this.state = {
                disabled: false,
                cfydData: null,
            };

        }
        onClickButton(ref, data) {
            CI.displayUniLayer(ref, data);
        }
        componentDidMount() {
            let self = this;

            /*            setTimeout(() => {
                            showModalWarning();
                            DR.drawFeatures.activate();
                        }, 3000)*/


            lmsg.subscribe('locating', (data) => {
                console.log(data)
                switch (data.params) {
                    case 'shigong':
                        DR.drawFeatures.disable();
                        self.refs.shigong.props.onClick();
                        //DR.drawFeatures.activate();
                        break;
                    case 'shigong_start':
                        //self.refs.shigong.props.onClick();
                        showModalWarning();
                        DR.drawFeatures.activate();
                        break;
                    case 'guanzhi':
                        DR.drawFeatures.disable();
                        self.refs.guanzhi.props.onClick();
                        break;
                    case 'guanzhi_start':
                        showModalWarning();
                        DR.drawFeatures.activate();
                        break;
                    case 'shigu':
                        DR.drawFeatures.disable();
                        self.refs.shigu.props.onClick();
                        break;
                    case 'shigu_start':
                        showModalWarning();
                        DR.drawFeatures.activate();
                        break;
                    case 'fdc':
                        self.refs.fudongche.props.onClick();
                        break;
                    default:
                        return;
                }
            });

            lmsg.subscribe('cfxydBtnClick', (data) => {
                console.log(data);
                self.setState({
                    cfydData: null
                });
                if (data.isCross == 1) {
                    //路口
                    self.setState({
                        cfydData: data.time
                    });
                    self.refs.yongduPop.props.content.props.children[1].props.onClick(); //路口yongdu_cross
                } else if (data.isCross == 2) {
                    //路段
                    self.setState({
                        cfydData: data.time
                    });
                    self.refs.yongduPop.props.content.props.children[0].props.onClick(); //路口yongdu_road
                } else alert('双屏通讯错误');

            });
            /*var data = {
                'isCross': 1,
                'time': {
                    'date': '20151122',
                    'flag': 0
                }
            };
            setTimeout(function() {

                    console.log(data);
                    self.setState({
                        cfydData: null
                    });
                    if (data.isCross == 1) {
                        //路口
                        self.setState({
                            cfydData: data.time
                        });
                        self.refs.yongduPop.props.content.props.children[1].props.onClick(); //路口yongdu_cross
                    } else if (data.isCross == 2) {
                        //路段
                        self.setState({
                            cfydData: data.time
                        });
                        self.refs.yongduPop.props.content.props.children[0].props.onClick(); //路口yongdu_road
                    } else alert('双屏通讯错误');
                })*/
            /*setTimeout(function() {
                console.log(self.refs)
                self.refs.yongduPop.props.content.props.children[1].props.onClick(); //路口yongdu_cross
            }, 2000)*/

        }
        render() {
            const yongduButton = (
                <div>
                    <Button id="yongdu_road" ref="yongdu_road" className={UniqueStyles.button1} type='ghost' size='small' onClick={()=>this.onClickButton('yongdu_road', this.state.cfydData)}>路段</Button>
        <Button id="yongdu_cross" ref="yongdu_cross" className={UniqueStyles.button1} type='ghost' size='small' onClick={()=>this.onClickButton('yongdu_cross', this.state.cfydData)}>路口</Button>
                </div>
            );
            const jiariButton = (
                <div>
                    <Button id="jiari_cross" ref="jiari_cross" className={UniqueStyles.button1} type='ghost' size='small' onClick={()=>this.onClickButton(this.refs.jiari_cross.props.id)}>路口</Button>
                    <Button id="jiari_road" ref="jiari_road" className={UniqueStyles.button1}type='ghost' size='small' onClick={()=>this.onClickButton(this.refs.jiari_road.props.id)}>路段</Button>
                    <Button id="jiari_zone" ref="jiari_zone" className={UniqueStyles.button1}type='ghost' size='small' onClick={()=>this.onClickButton(this.refs.jiari_zone.props.id)}>区域</Button>
                </div>);
            return (
                <div className={UniqueStyles.boxpanel}  id="uniqueDetails">
                <div className={UniqueStyles.panel_header}>
                    专题信息
                </div>
                <div className={UniqueStyles.panel_body} id="uniquepanel_body">
                    
                    <Button id="shigong" ref="shigong" className={UniqueStyles.button1} type="primary" size="small" disabled={this.state.disabled} onClick={()=>this.onClickButton(this.refs.shigong.props.id)}>道路施工</Button>
                    <Button id="guanzhi" ref="guanzhi" className={UniqueStyles.button1} type="primary" size="small" disabled={this.state.disabled} onClick={()=>this.onClickButton(this.refs.guanzhi.props.id)}>交通管制</Button>
                    <Button id="shigu" ref="shigu" className={UniqueStyles.button1} type="primary" size="small" disabled={this.state.disabled} onClick={()=>this.onClickButton(this.refs.shigu.props.id)}>交通事故</Button>
                    <Button id="fudongche" ref="fudongche" className={UniqueStyles.button1} type="primary" size="small" disabled={this.state.disabled} onClick={()=>this.onClickButton(this.refs.fudongche.props.id)}>浮动车</Button><br/>
                    <Popover content={jiariButton} placement="bottom" title="请选择" trigger="hover" getTooltipContainer={() => document.getElementById('uniqueDetails')}>
                        <Button id="jiari" ref="jiari" className={UniqueStyles.button1} type="primary" size="small" disabled={this.state.disabled}>节假专题</Button>
                    </Popover>
                    <Popover ref="yongduPop" content={yongduButton} placement="bottom" title="请选择" trigger="hover" getTooltipContainer={() => document.getElementById('uniqueDetails')}>
                        <Button id="yongdu" ref="yongdu" className={UniqueStyles.button1} type="primary" size="small" disabled={this.state.disabled}>常发拥堵</Button>
                    </Popover>
                    <Button id="OD" ref="OD" className={UniqueStyles.button1} type="primary" size="small" disabled={!this.state.disabled} onClick={()=>this.onClickButton(this.refs.OD.props.id)}>O/D分析</Button>
                 </div>

            </div>
            )

        }


    }
    /*function mapStateToProps(state) {
        return {
            search: state.search,
            cra: state.cra
        }
    }
    export default connect(mapStateToProps, action)(UniqueSub);*/
export default UniqueSub