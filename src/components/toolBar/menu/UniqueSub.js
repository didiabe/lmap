import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../_toolBar.css';
import UniqueStyles from './_UniqueSub.css'
import * as CI from '../../../scripts/CongestionIndex';
import * as DR from '../../../scripts/drawFeatures';
import * as lmsg from '../../../libs/lmsg';
import * as lmap from '../../../libs/lmap';
import * as Ds from '../../../libs/DataService';
import {
    connect
} from 'react-redux';

import {
    Button,
    Icon,
    Popover,
    Modal,
    message
} from 'antd';

const ButtonGroup = Button.Group;
class UniqueSub extends React.Component {
    constructor() {
        super();
        this.state = {
            active: null
        }
    }
    componentWillMount() {
        this.setState({
            active: this.props.isActive.active_Unique
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            active: nextProps.isActive.active_Unique
        });
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
        this.props.callbackParent({
            status1: !this.state.active,
            status2: !this.state.active,
            status3: this.state.active,
            status4: !this.state.active,
            status5: !this.state.active,
        });
    }
    render() {
        return (

            <div>
        <li ref="startUnipanel" id="trafficConditions" onClick={() => this.mountTrafficConditions() }>
                    <div type="subway">
                        <span className={this.state.active ? styles.subway_active : styles.subway}>专题</span>
                    </div>
                </li>
            </div>
        )
    }
    componentDidMount() {

        let self = this;

        lmsg.subscribe('locating', (data) => {
            ReactDOM.render(
                <UniquePanel/>, document.getElementById("presetBox")
            )
        });
        lmsg.subscribe('tracktaxi', (data) => {
            message.success('您已进入追踪浮动车页面');
            if (data.startTracking) {
                if (!data.params.id) {
                    alert('没有选中的浮动车');
                } else CI.trackingTaxi(data.params);
            } else if (!data.startTracking) CI.stopTrackingTaxi();
            else alert("追踪参数错误！");
            localStorage.removeItem('tracktaxi');
        });
        lmsg.subscribe('cfxydBtnClick', (data) => {
            ReactDOM.render(
                <UniquePanel/>, document.getElementById("presetBox")
            )
            localStorage.removeItem('cfxydBtnClick');
        });
        lmsg.subscribe('ODClick', (data) => {
            ReactDOM.render(
                <UniquePanel/>, document.getElementById("presetBox")
            );
            localStorage.removeItem('ODClick')
        });
        lmsg.subscribe('hbjjrToMap', (data) => {
            ReactDOM.render(
                <UniquePanel/>, document.getElementById("presetBox")
            );
            localStorage.removeItem('hbjjrToMap');
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
        lmap.removeEchartsLayer();
        CI.displayUniLayer(ref, data);
    }
    OD(data) {
        /*let params = {
            qssj: '2016-09-05',
            sd: '00:00-10:00',
            fx: '1'
        }*/
        if (data) {
            let params = {
                qssj: data.qssj,
                sd: data.sd,
                fx: data.flags
            }
            var dataRecv = null;
            Ds.DataService('/trafficindex_bodcollisionflowresult/migrationMap.json', params, (resp) => {
                dataRecv = resp.aaData;
            }, (e) => {
                console.log(e);
                alert('后台传输错误');
            });

            if (dataRecv && dataRecv.dataPoint.length > 0) {
                CI.clearLayer();
                var overlay = new lmap.echartsLayer('ODLayer', echarts);
                var chartsContainer = overlay.getEchartsContainer();
                var myChart = overlay.initECharts(chartsContainer);
                window.onresize = myChart.onresize;

                var option = {
                    color: ['gold', 'aqua', 'lime'],
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}'
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: ['北京 Top10'],
                        selectedMode: 'single',
                        selected: {
                            '上海 Top10': false,
                            '广州 Top10': false
                        },
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    dataRange: {
                        min: 0,
                        max: 100,
                        //calculable: true,
                        color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    series: [{
                        name: 'OD分析',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        geoCoord: eval('(' + dataRecv.geoCoord + ')'),
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: dataRecv.dataLine
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function(v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                    }
                                },
                                emphasis: {
                                    label: {
                                        position: 'top'
                                    }
                                }
                            },
                            data: dataRecv.dataPoint
                        }
                    }]
                };
                overlay.setOption(option);
                map.setView(map.getCenter());
            } else message.warning('没有相应地图数据');
        } else return;
    }
    componentDidMount() {
        let self = this;
        lmsg.subscribe('locating', (data) => {
            console.log('locating', data);
            switch (data.params) {
                case 'shigong':
                    message.success('您已进入道路施工页面');
                    DR.drawFeatures.disable();
                    self.refs.shigong.props.onClick();
                    break;
                case 'shigong_start':
                    //self.refs.shigong.props.onClick();
                    showModalWarning();
                    DR.drawFeatures.activate();
                    break;
                case 'guanzhi':
                    message.success('您已进入交通管制页面');
                    DR.drawFeatures.disable();
                    self.refs.guanzhi.props.onClick();
                    break;
                case 'guanzhi_start':
                    showModalWarning();
                    DR.drawFeatures.activate();
                    break;
                case 'shigu':
                    message.success('您已进入交通事故页面');
                    DR.drawFeatures.disable();
                    self.refs.shigu.props.onClick();
                    break;
                case 'shigu_start':
                    showModalWarning();
                    DR.drawFeatures.activate();
                    break;
                case 'fdc':
                    message.success('您已进入浮动车页面');
                    self.refs.fudongche.props.onClick();
                    break;
                default:
                    return;
            }
            localStorage.removeItem('locating');
        });

        lmsg.subscribe('cfxydBtnClick', (data) => {
            console.log('cfxydBtnClick', data);
            self.setState({
                cfydData: null
            });
            message.success('您已進入常發擁堵頁面');
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
            localStorage.removeItem('cfxydBtnClick');
        });
        lmsg.subscribe('ODClick', (data) => {
            console.log('ODClick', data);
            message.success('您已進入OD分析頁面');
            self.OD(data);
            localStorage.removeItem('ODClick');
        });
        lmsg.subscribe('hbjjrToMap', (data) => {
            console.log('hbjjrToMap', data)
            localStorage.removeItem('hbjjrToMap');
            if (data.messageType == '0' || data.messageType == '1' || data.messageType == '2' || data.messageType == '3') {
                message.success('您已進入節假日頁面');
                //清空图层
                CI.clearLayer();
            } else if (data.messageType == '4') {
                switch (data.messageData.ztType) {
                    case "1":
                        self.onClickButton('jiari_zone', data.messageData);
                        break;
                    case "2": //路口
                        self.onClickButton('jiari_cross', data.messageData);
                        break;
                    case "3": //路段
                        self.onClickButton('jiari_road', data.messageData);
                        break;
                }


            } else if (data.messageType == '5') {
                //新增区域
                Modal.success({
                    title: '定位已经启动',
                    content: '请点击屏幕右上角画图工具定位区域信息',
                });
                Ds.DataService('/trafficindex_map/listHolidayMap.json', null, (resp) => {
                    CI.displayCommonLayer(resp.aaData);
                    DR.DrawHoliday.drawRegion();
                }, (e) => {
                    console.log(e);
                    alert('后台传输错误');
                });

            } else if (data.messageType == '6') {
                //编辑区域
                Modal.success({
                    title: '定位已经启动',
                    content: '请点击屏幕右上角画图工具定位区域信息',
                });
                var params = {
                    id: data.messageData.qybh
                }
                Ds.DataService('/trafficindex_map/gotoHolidayMap.json', params, (resp) => {
                    CI.displayCommonLayer(resp.aaData);
                    DR.DrawHoliday.drawRegion();
                }, (e) => {
                    console.log(e);
                    alert('后台传输错误');
                });

            } else if (data.messageType == '7') {
                Modal.success({
                    title: '定位已经启动',
                    content: '请点击屏幕右上角画图工具圈选包含的道路路口',
                });
                //新增路口
                Ds.DataService('/trafficindex_map/listCrossMap.json', null, (resp) => {
                    CI.displayCommonLayer(resp.aaData); //展示路口
                    DR.DrawHoliday.selectCross(resp.aaData);
                }, (e) => {
                    console.log(e);
                    alert('后台传输错误');
                });

            } else if (data.messageType == '8') {
                Modal.success({
                    title: '定位已经启动',
                    content: '请点击屏幕右上角画图工具圈选包含的道路',
                });
                //新增路段
                Ds.DataService('/trafficindex_map/roadMap.json', null, (resp) => {
                    CI.displayConfigLayer_road(resp.aaData); //复合路段
                    DR.DrawHoliday.selectRoad(resp.aaData);
                }, (e) => {
                    console.log(e);
                    alert('后台传输错误');
                });
            }
        });

    }
    componentWillUnmount() {
        lmap.removeEchartsLayer();
    }
    render() {
        const yongduButton = (
            <div>
                    <Button id="yongdu_road" ref="yongdu_road" className={UniqueStyles.button1} disabled={true} type='ghost' size='small' onClick={()=>this.onClickButton('yongdu_road', this.state.cfydData)}>路段</Button>
        <Button id="yongdu_cross" ref="yongdu_cross" className={UniqueStyles.button1} disabled={true} type='ghost' size='small' onClick={()=>this.onClickButton('yongdu_cross', this.state.cfydData)}>路口</Button>
                </div>
        );
        const jiariButton = (
            <div>
                    <Button id="jiari_cross" ref="jiari_cross" className={UniqueStyles.button1} disabled={true} type='ghost' size='small' onClick={()=>this.onClickButton(this.refs.jiari_cross.props.id)}>路口</Button>
                    <Button id="jiari_road" ref="jiari_road" className={UniqueStyles.button1} disabled={true} type='ghost' size='small' onClick={()=>this.onClickButton(this.refs.jiari_road.props.id)}>路段</Button>
                    <Button id="jiari_zone" ref="jiari_zone" className={UniqueStyles.button1} disabled={true} type='ghost' size='small' onClick={()=>this.onClickButton(this.refs.jiari_zone.props.id)}>区域</Button>
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
                    <Button id="OD" ref="OD" className={UniqueStyles.button1} type="primary" size="small" disabled={!this.state.disabled} onClick={()=>this.OD()}>O/D分析</Button>
                 </div>

            </div>
        )

    }


}

export default UniqueSub


/*      var option = {
          color: ['gold', 'aqua', 'lime'],
          tooltip: {
              trigger: 'item',
              formatter: '{b}'
          },
          legend: {
              orient: 'vertical',
              x: 'left',
              data: ['北京 Top10'],
              selectedMode: 'single',
              selected: {
                  '上海 Top10': false,
                  '广州 Top10': false
              },
              textStyle: {
                  color: '#fff'
              }
          },
          dataRange: {
              min: 0,
              max: 100,
              //calculable: true,
              color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
              textStyle: {
                  color: '#fff'
              }
          },
          series: [{
              name: '北京 Top10',
              type: 'map',
              mapType: 'none',
              data: [],
              geoCoord: {
                  '上海': [121.4648, 31.2891],
                  '包头': [110.3467, 41.4899],
                  '北京': [116.4551, 40.2539],
                  '南宁': [108.479, 23.1152],
                  '南昌': [116.0046, 28.6633],
                  '大连': [122.2229, 39.4409],
                  '常州': [119.4543, 31.5582],
                  '广州': [113.5107, 23.2196],
                  '重庆': [107.7539, 30.1904]
              },
              markLine: {
                  smooth: true,
                  effect: {
                      show: true,
                      scaleSize: 1,
                      period: 30,
                      color: '#fff',
                      shadowBlur: 10
                  },
                  itemStyle: {
                      normal: {
                          borderWidth: 1,
                          lineStyle: {
                              type: 'solid',
                              shadowBlur: 10
                          }
                      }
                  },
                  data: [
                      [{
                          name: '北京'
                      }, {
                          name: '上海',
                          value: 95
                      }],
                      [{
                          name: '北京'
                      }, {
                          name: '广州',
                          value: 90
                      }],
                      [{
                          name: '北京'
                      }, {
                          name: '大连',
                          value: 80
                      }],
                      [{
                          name: '北京'
                      }, {
                          name: '南宁',
                          value: 70
                      }],
                      [{
                          name: '北京'
                      }, {
                          name: '南昌',
                          value: 60
                      }],
                      [{
                          name: '北京'
                      }, {
                          name: '包头',
                          value: 30
                      }],
                      [{
                          name: '北京'
                      }, {
                          name: '重庆',
                          value: 20
                      }],
                      [{
                          name: '北京'
                      }, {
                          name: '常州',
                          value: 10
                      }]
                  ]
              },
              markPoint: {
                  symbol: 'emptyCircle',
                  symbolSize: function(v) {
                      return 10 + v / 10
                  },
                  effect: {
                      show: true,
                      shadowBlur: 0
                  },
                  itemStyle: {
                      normal: {
                          label: {
                              show: false
                          }
                      },
                      emphasis: {
                          label: {
                              position: 'top'
                          }
                      }
                  },
                  data: [{
                      name: '上海',
                      value: 95
                  }, {
                      name: '广州',
                      value: 90
                  }, {
                      name: '大连',
                      value: 80
                  }, {
                      name: '南宁',
                      value: 70
                  }, {
                      name: '南昌',
                      value: 60
                  }, {
                      name: '包头',
                      value: 30
                  }, {
                      name: '重庆',
                      value: 20
                  }, {
                      name: '常州',
                      value: 10
                  }]
              }
          }]
      };*/