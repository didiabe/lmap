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
        setTimeout(function() {
            ReactDOM.render(
                <UniquePanel/>, document.getElementById("presetBox")
            )
        }, 3000)

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

    }
}

var _APIpath = null;
class UniquePanel extends React.Component {
        constructor() {
            super();
            this.onClickButton = this.onClickButton.bind(this);
            this.state = {
                disabled: false,
            };
        }
        onClickButton(ref) {
            CI.displayUniLayer(ref);
        }
        componentDidMount() {
            let self = this;

            lmsg.subscribe('locating', (data) => {
                console.log(data)
                switch (data.params) {
                    case 'shigong':
                        self.refs.shigong.props.onClick();
                        DR.drawFeatures.activate();
                        break;
                    case 'guanzhi':
                        self.refs.guanzhi.props.onClick();
                        DR.drawFeatures.activate();
                        break;
                    case 'shigu':
                        self.refs.shigu.props.onClick();
                        DR.drawFeatures.activate();
                        break;
                    case 'fdc':
                        self.refs.fudongche.props.onClick();
                        break;
                    default:
                        return;
                }
            });
        }
        render() {
            const yongduButton = (
                <div>
                <Button type='ghost' size='small'>路段</Button>
                <Button type='ghost' size='small'>路口</Button>
                </div>
            );
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
                    <Button id="jiari" ref="jiari" className={UniqueStyles.button1} type="primary" size="small" disabled={this.state.disabled} onClick={()=>this.onClickButton(this.refs.jiari.props.id)}>节假专题</Button>
                    <Popover content={yongduButton} title="Title" trigger="hover">
                    <Button id="yongdu" ref="yongdu" className={UniqueStyles.button1} type="primary" size="small" disabled={this.state.disabled} onClick={()=>this.onClickButton(this.refs.yongdu.props.id)}>常发拥堵</Button>
                    </Popover>
                    <Button id="OD" ref="OD" className={UniqueStyles.button1} type="primary" size="small" disabled={this.state.disabled} onClick={()=>this.onClickButton(this.refs.OD.props.id)}>O/D分析</Button>
                    {/*<Button  onClick={()=>this.ttt()}>Odasd</Button>*/}
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