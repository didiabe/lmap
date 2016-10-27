import React from 'react';
import ReactDOM from 'react-dom';
import {
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
import QueueAnim from 'rc-queue-anim';
import styles from '../_toolBar.css';
import trafficStyles from './_traffic.css'
import * as CI from '../../../scripts/CongestionIndex';
import * as Ds from '../../../libs/DataService';

class Traffic extends React.Component {
    constructor() {
        super();
        this.state = {
            active: false
        }
    }
    mountTrafficConditions() {
        this.setState({
            active: !this.state.active
        })
        if (!document.getElementById('detailedRoad')) {
            ReactDOM.render(
                <TrafficConditions/>, document.getElementById("presetBox")
            )
        } else {
            ReactDOM.unmountComponentAtNode(document.getElementById("presetBox"))
        }
    }
    render() {
        return (

            <div>
                <li id="trafficConditions" onClick={() => this.mountTrafficConditions() }>
                    <div type="traffic">
                        <span className={this.state.active ? styles.traffic_active : styles.traffic}>路况</span>
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

class TrafficConditions extends React.Component {
    constructor() {
        super();
        this.state = {
            forecast: true,
            playback: false
        }
    }
    forecast() {
        this.setState({
            forecast: true,
            playback: false
        });
        ReactDOM.render(
            <Forecast/>, document.getElementById('traffic_detailed')
        )
    }
    playback() {
        this.setState({
            forecast: false,
            playback: true
        });
        ReactDOM.render(
            <Playback/>, document.getElementById('traffic_detailed')
        )
    }
    render() {
        return (
            <div className={trafficStyles.boxpanel}  id="detailedRoad">
                <div className={trafficStyles.panel_header}>
                    <ul className={trafficStyles.panel_tab}>
                        <li className={this.state.forecast ? trafficStyles.panel_tab_li_active : trafficStyles.panel_tab_li} id="traffic_current" type="current" onClick={() => this.forecast() }>预测</li>
                        <li className={this.state.playback ? trafficStyles.panel_tab_li_active : trafficStyles.panel_tab_li} id="traffic_forecast" type="forecast" onClick={() => this.playback() }>回放</li>
                    </ul>
                    <div className={trafficStyles.traffic_tag}>
                        <span className={trafficStyles.smooth_jam}>畅通</span>
                        <ul className={trafficStyles.traffic_level}>
                            <li className={trafficStyles.traffic_level_1}></li>
                            <li className={trafficStyles.traffic_level_2}></li>
                            <li className={trafficStyles.traffic_level_3}></li>
                            <li className={trafficStyles.traffic_level_4}></li>
                            <li className={trafficStyles.traffic_level_5}></li>
                        </ul>
                        <span className={trafficStyles.smooth_jam}>拥堵</span>
                    </div>
                </div>
                <div className={trafficStyles.panel_body} id="traffic_detailed">

                </div>
            </div>
        )
    }
    componentDidMount() {
        ReactDOM.render(
            <Forecast/>, document.getElementById('traffic_detailed')
        );
    }
}

class Forecast extends React.Component {
    constructor() {
        super();
        this.onSliderChange = this.onSliderChange.bind(this);
        this.startForcast = this.startForcast.bind(this);
        this.getCheckOption = this.getCheckOption.bind(this);
        this.state = {
            inputValue: 0,
            checked: false,
            isLoading: false,
            isLoaded: false,
            CraType: null,

        };
    }
    onSliderChange(val) {
        console.log(val);

        this.setState({
            inputValue: val
        });


    }
    getCheckOption(value) {
        //console.log(value);
        let CheckOptions = '';
        switch (value.length) {
            case 0:
                CheckOptions = "";
                break;
            case 1:
                CheckOptions = value[0];
                break;
            case 2:
                CheckOptions = value[0] + "-" + value[1];
                break;
            case 3:
                CheckOptions = "cross-road-region";
                break;
        }
        console.log(CheckOptions);
        if (CheckOptions.length !== 0) this.setState({
            checked: true,
            CraType: CheckOptions
        });
    }
    startForcast() {
        this.setState({
            isLoading: true
        });
        let param = {
            type: this.state.CraType,
            time: this.state.inputValue
        }
        Ds.DataService('/zone/forecast.json', param,
            (resp) => {
                if (markerPlayBack) markerPlayBack.clearLayer();
                this.setState({
                    isLoading: false,
                    isLoaded: true
                });
                console.log(resp.data);
                let geo_playback = resp.data;
                CI.displayCommonLayer(geo_playback);
                //markerPlayBack = CI.playback(geo_playback);
            },
            (e) => {
                console.log(e)
            });
        /*setTimeout(() => {
            if (markerPlayBack) markerPlayBack.clearLayer();
            this.setState({
                isLoading: false,
                isLoaded: true
            });


            var geo_playback = {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [121.35, 28.491]
                    },
                    "properties": {
                        "index": [{
                            time: "08:22-13:00",
                            val: 5.1
                        }, {
                            time: "08:22-13:05",
                            val: 9.5
                        }, {
                            time: "08:22-13:10",
                            val: 3.9
                        }, {
                            time: "08:22-13:15",
                            val: 2.9
                        }, {
                            time: "08:22-13:20",
                            val: 7
                        }],
                        "name": "友谊路"
                    }
                }, {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [121.35, 28.411]
                    },
                    "properties": {
                        "index": [{
                            time: "08:22-13:00",
                            val: 9
                        }, {
                            time: "08:22-13:05",
                            val: 5
                        }, {
                            time: "08:22-13:10",
                            val: 7
                        }, {
                            time: "08:22-13:15",
                            val: 3.5
                        }, {
                            time: "08:22-13:20",
                            val: 7.9
                        }],
                        "name": "延陵中路"
                    }
                }]
            };
            markerPlayBack = CI.playback(geo_playback);

        }, 1000);*/

    }
    clearForcast() {
        markerPlayBack.clearLayer();
    }

    render() {
        let b = new Date;
        let c = b.getFullYear();
        let d = b.getMonth() + 1;
        d = d < 10 ? "0" + d : d;
        let e = b.getDate();
        e = e < 10 ? "0" + e : e;
        let f = b.getHours();
        f = f < 10 ? "0" + f : f;
        let g = b.getMinutes().toString();
        g = g < 10 ? "0" + g : g;
        return (
            <div className={trafficStyles.panel_body}>
                    <Row>
                        <Col span={4}>{"当前时间: "}</Col>
                        <Col span={6}>{c+"-"+d+"-"+e}</Col>
                        <Col span={6}>{f+":"+g}</Col>
                    </Row>
                    <Row>
                        <Col span={4}></Col>
                        <Col span={12}><CheckboxGroup className={trafficStyles.checkboxes} options={CRA_options} onChange={this.getCheckOption} /></Col>
                    </Row>
                    <Row>
                        <Col span={4}>{"预测时间:"}</Col>
                        <Col span={14}>
                            <Slider min={0} max={30} onChange={this.onSliderChange} step={5} value={this.state.inputValue} />
                        </Col>
                        <Col span={2}>
                            <InputNumber min={0} max={30} value={this.state.inputValue} step={5} onChange={this.onSliderChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4}></Col>
                        <Col span={6}>
                            <Button type="primary" loading={this.state.isLoading} onClick={this.startForcast} disabled={!this.state.checked}>
                              {this.state.isLoaded ? "加载完成！" :"加载数据" }
                            </Button>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={6}>
                            <Button type="ghost" onClick={this.clearForcast} disabled={!this.state.isLoaded}>
                              {"清空图层"}
                            </Button>
                        </Col>
                        <Col span={2} className={trafficStyles.date} id="dateNow"></Col>

                    </Row>
            </div>
        )
    }
}

const RangePicker = DatePicker.RangePicker;
const CheckboxGroup = Checkbox.Group;
const CRA_options = [{
    label: "路口",
    value: "cross"
}, {
    label: "路段",
    value: "road"
}, {
    label: "区域",
    value: "region"
}];

var markerPlayBack;

class Playback extends React.Component {

    constructor() {
        super();
        /*callback函数里的this不同，需要bind*/
        this.getTimeRange = this.getTimeRange.bind(this);
        this.getCheckOption = this.getCheckOption.bind(this);
        this.loadingData = this.loadingData.bind(this);
        this.play = this.play.bind(this);
        this.clear = this.clear.bind(this);
        this.reload = this.reload.bind(this);
        this.state = {
            startTime: null,
            endTime: null,
            loading: false,
            isLoaded: false,
            isPlaying: false,
            playingBtn: false,
            percent: 0,
            each_percent: 0,
            checkedOptions: []
        }

    }
    play() {
        markerPlayBack.start();
        this.setState({
            playingBtn: !this.state.playingBtn,
            isPlaying: !this.state.isPlaying
        });

        var p = 0;
        var progressInterval = setInterval(() => {
            if (p < 100 && this.state.isPlaying) {
                p = p + this.state.each_percent;
                //console.log(p);
                this.setState({
                    percent: p
                });
            } else clearInterval(progressInterval);

        }, 1000);
    }

    clear() {
        markerPlayBack.clearLayer();
        this.setState({
            isPlaying: false,
            percent: 0
        });
    }
    speedUp() {
        markerPlayBack.speedUp();
    }
    speedDown() {
        markerPlayBack.speedDown();
    }
    reload() {
        this.clear();
        this.loadingData();
    }

    getTimeRange(value, dateString) {
        //console.log(dateString);
        if (this.state.isLoaded) this.clear();
        let StartTime = dateString[0];
        let EndTime = dateString[1];
        this.setState({
            startTime: StartTime,
            endTime: EndTime,
            isLoaded: false,
            percent: 0
        });
        if (this.state.playingBtn) this.setState({
            playingBtn: !this.state.playingBtn
        });

    }
    getCheckOption(value) {
        //console.log(value);
        let CheckOptions = '';
        switch (value.length) {
            case 0:
                CheckOptions = "";
                break;
            case 1:
                CheckOptions = value[0];
                break;
            case 2:
                CheckOptions = value[0] + "-" + value[1];
                break;
            case 3:
                CheckOptions = "cross-road-region";
                break;
        }
        console.log(CheckOptions);
        if (this.state.isLoaded) this.clear();
        this.setState({
            checkedOptions: CheckOptions,
            isLoaded: false,
            percent: 0
        });
        if (this.state.playingBtn) this.setState({
            playingBtn: !this.state.playingBtn
        });
    }

    loadingData() {
        if (this.state.startTime == null || this.state.endTime == null || this.state.checkedOptions.length == 0) {
            alert("请选择信息后查询");
            return;
        }
        let self = this;
        this.setState({
            loading: true
        });
        setTimeout(() => {
            var param1 = {
                kssj: self.state.startTime,
                jssj: self.state.endTime,
                type: self.state.checkedOptions
            }

            Ds.DataService("/zone/hisPlayBack.json", param1,
                (data) => {
                    let geo_playback = data.data;
                    console.log(geo_playback);
                    if (geo_playback.features.length < 1) {
                        self.setState({
                            loading: false,
                            isLoaded: false
                        });
                        alert("没有相应信息")
                    } else {
                        self.setState({
                            loading: false,
                            isLoaded: true
                        })
                        var percent_length = geo_playback.features[0].properties.index.length;
                        var each_percent = Math.round(100 / percent_length);

                        self.setState({
                            each_percent: each_percent
                        });
                        markerPlayBack = CI.playback(geo_playback);
                    }

                }, (e) => {
                    alert('后台传输错误');
                    console.log(e);
                });
        }, 1000)

        /* this.setState({
             loading: true,
             percent: 0,
         });*/


        /* var geo_playback = {
             "type": "FeatureCollection",
             "features": [{
                 "type": "Feature",
                 "geometry": {
                     "type": "Point",
                     "coordinates": [121.35, 28.491]
                 },
                 "properties": {
                     "index": [{
                         time: "08:22-13:00",
                         val: 5.1
                     }, {
                         time: "08:22-13:05",
                         val: 9.5
                     }, {
                         time: "08:22-13:10",
                         val: 3.9
                     }, {
                         time: "08:22-13:15",
                         val: 2.9
                     }, {
                         time: "08:22-13:20",
                         val: 7
                     }],
                     "name": "友谊路"
                 }
             }, {
                 "type": "Feature",
                 "geometry": {
                     "type": "Point",
                     "coordinates": [121.35, 28.411]
                 },
                 "properties": {
                     "index": [{
                         time: "08:22-13:00",
                         val: 9
                     }, {
                         time: "08:22-13:05",
                         val: 5
                     }, {
                         time: "08:22-13:10",
                         val: 7
                     }, {
                         time: "08:22-13:15",
                         val: 3.5
                     }, {
                         time: "08:22-13:20",
                         val: 7.9
                     }],
                     "name": "延陵中路"
                 }
             }]
         };*/

        /*  var percent_length = geo_playback.features[0].properties.index.length;
          var each_percent = 100 / percent_length;*/

        /* setTimeout(() => {
             this.setState({
                 loading: false,
                 isLoaded: true,
                 each_percent: each_percent
             });

             markerPlayBack = CI.playback(geo_playback);
         }, 1000);*/
        //<Slider max={30} min={0} onChange={this.onSliderChange} value={this.state.inputValue}/>
    }

    render() {
        const player_panel = this.state.isLoaded ? [
            <QueueAnim key='QueueAnim11' delay={500} className="queue-simple">
            <div key={'a'} id="hisPlayer" className={trafficStyles.hisPlayer_panel}>
                    
                    <Button key={'1'} className={trafficStyles.hisPlayer_btn2} type="ghost"  size="large" icon="plus" onClick={this.speedUp} /><br/>
                    <Button key={'2'} className={trafficStyles.hisPlayer_btnL} type="ghost"  onClick={this.reload} loading={this.state.loading} size="large" icon="reload" />
                    <Button key={'3'} className={trafficStyles.hisPlayer_btn1} type="ghost"  size="large" icon="fast-backward" />
                    <Button key={'4'} className={trafficStyles.hisPlayer_btn1} type="primary" onClick={this.play} size="large" icon={this.state.playingBtn ? "pause" : "play-circle"} />
                    <Button key={'5'} className={trafficStyles.hisPlayer_btn1} type="ghost" onClick={this.speedDown} size="large" icon="fast-forward" />
                    <Button key={'6'} className={trafficStyles.hisPlayer_btnR} type="ghost" onClick={this.clear} size="large" icon="file-excel" /><br/>
                    <Button key={'7'} className={trafficStyles.hisPlayer_btn2} type="ghost"  size="large" icon="minus" /><br/>
                    <Progress key={'8'} className={trafficStyles.date} percent={this.state.percent} />

                </div>
                </QueueAnim>
        ] : null;
        return (
            <div className={trafficStyles.panel_body}>
                <div>
                <ul>
                    <li>{"时间区间: "}<RangePicker format="YYYY-MM-DD HH:mm:ss" 
                    onChange={this.getTimeRange} getCalendarContainer={trigger=>trigger.parentNode} />
                    </li><br/>
                   <li><CheckboxGroup className={trafficStyles.checkboxes} options={CRA_options} onChange={this.getCheckOption} />
                    </li><br/>
                     <Button className={trafficStyles.loadingButton} type="primary" size="large" icon="cloud-upload" 
                     loading={this.state.loading} onClick={this.loadingData} disabled={this.state.isLoaded}>{this.state.isLoaded ? "加载完成!" : "加载数据"}</Button>
                    <br/>
                    <li className={trafficStyles.splitline_H}></li><br/>
                    <li className={trafficStyles.date} id='dateNow'></li>
                    </ul>
                </div>
                <br/>
                    <div className={trafficStyles.QueContent}>
                        {player_panel}
                    </div>

            </div>
        )
    }
    componentDidMount() {

    }
}

export default Traffic