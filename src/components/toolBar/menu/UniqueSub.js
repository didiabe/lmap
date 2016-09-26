import React from 'react';
import ReactDOM from 'react-dom';
/*import {
    Slider,
    Checkbox,
    Button,
    Progress,
    DatePicker,
    Tooltip,
    InputNumber,
    Row,
    Col,
    TimePicker
} from 'antd';
import QueueAnim from 'rc-queue-anim';*/
//import {Button, Icon } from 'antd';
import styles from '../_toolBar.css';
import UniqueStyles from './_UniqueSub.css'
import * as CI from '../../../scripts/CongestionIndex';

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
        <li id="trafficConditions" onClick={() => this.mountTrafficConditions() }>
                    <div type="subway">
                        <span className={this.state.active ? styles.subway_active : styles.subway}>专题</span>
                    </div>
                </li>
            </div>
        )
    }
    componentDidMount() {
        // ReactDOM.render(
        //         <TrafficConditions/>, document.getElementById("presetBox")
        //     )
    }
}

var Button = require('antd/lib/button');
var Icon = require('antd/lib/icon')
const ButtonGroup = Button.Group;
//var Carousel = require('antd/lib/Carousel')

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

    render() {
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
                    <Button id="yongdu" ref="yongdu" className={UniqueStyles.button1} type="primary" size="small" disabled={this.state.disabled} onClick={()=>this.onClickButton(this.refs.yongdu.props.id)}>常发拥堵</Button>
                    <Button id="OD" ref="OD" className={UniqueStyles.button1} type="primary" size="small" disabled={this.state.disabled} onClick={()=>this.onClickButton(this.refs.OD.props.id)}>O/D分析</Button>
                 </div>

            </div>
        )

    }

}

export default UniqueSub