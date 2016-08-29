import React from 'react';
import ReactDOM from 'react-dom';
import {
    Radio,
    Slider,
    Select,
    Checkbox,
    Table,
    QueueAnim,
    Button,
    Progress,
    DatePicker,
    Tooltip,
    Row,
    InputNumber,
    Col,
    Icon,
    TimePicker
} from 'antd';
/*import QueueAnim from 'rc-queue-anim';*/

import styles from '../_toolBar.css';
import UpdateIndexStyle from './_updateIndex.css'
import * as CI from '../../../scripts/CongestionIndex';



class updateIndex extends React.Component {
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
        if (!document.getElementById('updateDetails')) {
            this.setState({
                active: !this.state.active
            });
            ReactDOM.render(
                <UpdateIndexPanel/>, document.getElementById("presetBox")
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
                    <div type="traffic">
                        <span className={this.state.active ? styles.satellite_active : styles.satellite}>更新</span>
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
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const DropOption = Select.Option;
const RangePicker = DatePicker.RangePicker;
const columns = [{
    title: "名称",
    dataIndex: "name"
}, {
    title: "指数",
    dataIndex: "index"
}];

const DataService = (api_path, param, a, b) => {
    window.$.ajax({
        type: 'POST',
        //10.25.67.72
        url: 'http://10.25.67.130:8080/trafficIndex_web' + api_path,
        data: param,
        dataType: 'json',
        async: false,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        success: a,
        error: b
    });
};
const data = [];
for (let i = 0; i < 46; i++) {
    data.push({
        key: i,
        name: `李大嘴${i}`,
        index: `西湖区湖底公园${i}号`,
    });
}
/*"data":[
        {
            "id":"10",
            "jtzs":4.27,
            "name":"太平街道西",
            "xh":0,
            "yddj":""
        },
        {
            "id":"11",
            "jtzs":4.27,
            "name":"太平街道南",
            "xh":0,
            "yddj":""
        },
        {
            "id":"6",
            "jtzs":4.28,
            "name":"城西街道",
            "xh":0,
            "yddj":""
        },
        {
            "id":"7",
            "jtzs":4.36,
            "name":"城东街道",
            "xh":0,
            "yddj":""
        },
        {
            "id":"8",
            "jtzs":4.25,
            "name":"太平街道北",
            "xh":0,
            "yddj":""
        },
        {
            "id":"9",
            "jtzs":4.28,
            "name":"太平街道东",
            "xh":0,
            "yddj":""
        }
    ]*/
class UpdateIndexPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            CbtnChecked: false,
            RbtnChecked: false,
            selectedRowKeys: [],
            loading: false,
            isLoaded: false,
            updateToggle: true,
            craType: null,
            ConLevel: null,
            T1Checked: false,
            T2Checked: false,
            T3Checked: false,
            updateMins: null,
            newIndex: null,
            StartTime: null,
            EndTime: null,
        }
        this.selectCongestion = this.selectCongestion.bind(this);
        this.selectCRA = this.selectCRA.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.updateIndexVal = this.updateIndexVal.bind(this);
        this.loadData = this.loadData.bind(this);
        this.getStartTime = this.getStartTime.bind(this);
        this.getEndTime = this.getEndTime.bind(this);
        this.switchRadio = this.switchRadio.bind(this);
        this.updateMins = this.updateMins.bind(this);
        this.getIndex = this.getIndex.bind(this);

    }

    selectCongestion(e) {
        if (e) {
            this.setState({
                CbtnChecked: true,
                ConLevel: e.target.value
            });
        }
    }
    selectCRA(value) {
        if (value) {
            this.setState({
                RbtnChecked: true,
                craType: value
            });
        }
    }
    loadData() {
        if (this.state.isLoaded) {
            this.setState({
                isLoaded: false
            });
        };
        this.setState({
            loading: true
        });
        let param = {
            type: this.state.craType,
            level: this.state.ConLevel
        };
        console.log(param);
        /*DataService("zone/zsLevel.json", param, 
            (resp)=>{
                console.log(resp);
            },
            (e)=>{
                console.log(e);
            });*/
        setTimeout(() => {
            this.setState({
                loading: false,
                isLoaded: true,
            });
        }, 1000)
    }
    updateIndexVal() {

        this.setState({
            loading: true
        });
        let param2 = {
            start: this.state.StartTime,
            end: this.state.EndTime,
            time: this.state.updateMins,
            zs: this.state.newIndex,
            type: this.state.craType,
            ids: this.state.selectedRowKeys
        };

        console.log(param2);
        // 模拟 ajax 请求，完成后清空
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    }
    onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({
            selectedRowKeys
        });
    }

    getStartTime(value, dateString) {
        console.log(dateString);
        this.setState({
            T1Checked: true,
            StartTime: dateString
        })

    }
    getEndTime(value, dateString) {
        console.log(dateString);
        this.setState({
            T2Checked: true,
            EndTime: dateString
        })
    }
    updateMins(val) {
        console.log(val);
        this.setState({
            updateMins: val
        });
    }
    switchRadio(e) {
        //console.log(e.target.value);
        this.setState({
            T3Checked: true,
            StartTime: null,
            EndTime: null,
            updateMins: null
        });
        switch (e.target.value) {
            case 1:
                this.setState({
                    updateToggle: true
                });
                break;
            case 2:
                this.setState({
                    updateToggle: false
                });
                break;
            default:
                break;
        }

    }
    getIndex(val) {
        console.log(val);
        this.setState({
            newIndex: val
        })
    }
    render() {
        const {
            loading,
            selectedRowKeys
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        const newArray = (start, end) => {
            const result = [];
            for (let i = start; i < end; i++) {
                result.push(i);
            }
            return result;
        }
        const myDate = new Date();
        const changeIndexPanel = this.state.updateToggle ? [
            <div>
            <Row>
            <Col span={4}>
        <RadioGroup onChange={this.switchRadio} defaultValue={1}>
                <Radio style={{
                  display: 'block',
                  height: '30px',
                  lineHeight: '30px',
                }} key="a" value={1}>方法1</Radio>
                    <Radio style={{
                  display: 'block',
                  height: '30px',
                  lineHeight: '30px',
                }} key="b" value={2}>方法2</Radio>
        </RadioGroup>
            </Col>
            <Col span={18}>
            {"更新时段: "}
            <TimePicker disabledSeconds={()=>{return newArray(0, 60).filter(value => value % 5 !== 0);}} onChange={this.getStartTime} hideDisabledOptions getPopupContainer={() => document.getElementById('updateDetails')}/> 
            {"~"}
            <TimePicker disabledSeconds={()=>{return newArray(0, 60).filter(value => value % 5 !== 0);}} onChange={this.getEndTime} hideDisabledOptions getPopupContainer={() => document.getElementById('updateDetails')}/> <br/> 
            {"更新指数: "}
            <InputNumber style={{marginTop: 3}} min={0} max={10} defaultValue={1} step={0.1} onChange={this.getIndex}></InputNumber>
            <Button style={{marginLeft:30}} type="primary" onClick={this.updateIndexVal}
                    disabled={!hasSelected || !this.state.T1Checked || !this.state.T2Checked} loading={loading}>更新</Button>
            </Col>
            </Row>
            </div>
        ] : [
            <div>
            <Row>
            <Col span={4}>
        <RadioGroup onChange={this.switchRadio} defaultValue={1}>
                <Radio style={{
                  display: 'block',
                  height: '30px',
                  lineHeight: '30px',
                }} key="a" value={1}>方法1</Radio>
                    <Radio style={{
                  display: 'block',
                  height: '30px',
                  lineHeight: '30px',
                }} key="b" value={2}>方法2</Radio>
        </RadioGroup>
            </Col>
            <Col span={18}>
            
            <Row>
            <Col span={5}>{"更新分钟:"}</Col>
            <Col span={10}>
            <Slider  min={1} max={500} onChange={this.updateMins} value={this.state.updateMins} />
              </Col>
              <Col span={4}>
                  <InputNumber min={1} max={500} style={{ marginLeft: '2px' }}
                    value={this.state.updateMins} onChange={this.updateMins}/>
                    </Col>
                    </Row>
            <Row>
           
            {"更新指数: "}
            <InputNumber style={{marginTop: 3}} min={0} max={10} defaultValue={1} step={0.1} onChange={this.getIndex}></InputNumber> 
            <Button style={{marginLeft:30}} type="primary" onClick={this.updateIndexVal}
                    disabled={!hasSelected || !this.state.T3Checked} loading={loading}>更新</Button>
              </Row>  
            </Col>
            </Row>
            </div>
        ];

        var ConListPanel = this.state.isLoaded ? [
            <div >
                <div style={{ marginBottom: 8 }}>
                  <span style={{ marginLeft: 20 }}>{hasSelected ? `您已选择 ${selectedRowKeys.length} 个对象` : ''}</span>
                </div>
                <Table size="small" rowSelection={rowSelection} columns={columns} dataSource={data} />

                <QueueAnim className={UpdateIndexStyle.QueContent} 
                    animConfig={[{ opacity: [1, 0], translateY: [0, 50] },{ opacity: [1, 0], translateY: [0, -50] }]} >
                        {changeIndexPanel}
                    </QueueAnim>
                
                
                
          </div>
        ] : null;

        return (
            <div className={UpdateIndexStyle.boxpanel}  id="updateDetails">
                <div className={UpdateIndexStyle.panel_header}>
                    
                   <span className={UpdateIndexStyle.tab1}>指数<b>批量</b>更新</span>                       
                    <div className={UpdateIndexStyle.traffic_tag}>
                        <span className={UpdateIndexStyle.smooth_jam}>畅通</span>
                        <ul className={UpdateIndexStyle.traffic_level}>
                            <li className={UpdateIndexStyle.traffic_level_1}></li>
                            <li className={UpdateIndexStyle.traffic_level_2}></li>
                            <li className={UpdateIndexStyle.traffic_level_3}></li>
                            <li className={UpdateIndexStyle.traffic_level_4}></li>
                            <li className={UpdateIndexStyle.traffic_level_5}></li>
                        </ul>
                        <span className={UpdateIndexStyle.smooth_jam}>拥堵</span>
                    </div>
                </div>
                <div className={UpdateIndexStyle.panel_body} id="traffic_detailed">
                <div className={UpdateIndexStyle.selectCra} >
                                <Select style={{ width: 80 }} placeholder={"请选择"} getPopupContainer={() => document.getElementById('updateDetails')} onChange={this.selectCRA}>
                                  <DropOption value="cross">路口</DropOption>
                                  <DropOption value="road">路段</DropOption>
                                  <DropOption value="region">区域</DropOption>
                                </Select>
                </div>    
                     <div className={UpdateIndexStyle.radio_btnGroup}>
                        <RadioGroup onChange={this.selectCongestion}>
                          <RadioButton value="1">畅通</RadioButton>
                          <RadioButton value="2">基本</RadioButton>
                          <RadioButton value="3">一般</RadioButton>
                          <RadioButton value="4">拥堵</RadioButton>
                          <RadioButton value="5">严重</RadioButton>
                        </RadioGroup>
                      </div>
                    <Button className={UpdateIndexStyle.loadingButton} type="primary" icon="cloud-upload" 
                     loading={this.state.loading} onClick={this.loadData} disabled = {!this.state.CbtnChecked || !this.state.RbtnChecked} > 
                     {"加载数据"}
                    </Button>
                    <QueueAnim className={UpdateIndexStyle.QueContent} 
                    animConfig={[{ opacity: [1, 0], translateY: [0, 50] },{ opacity: [1, 0], translateY: [0, -50] }]} >
                        {ConListPanel}
                    </QueueAnim>
        
                
                
                    
                </div>
            </div>
        )
    }

}



export default updateIndex
/*const disabledDate = (current) => {
            return current && current.getTime() < Date.now();
        }*/
/*<RangePicker disabledDate={disabledDate} showTime format="yyyy-MM-dd HH:mm:ss" onChange={this.getTimeRange} getCalendarContainer={() => document.getElementById('updateDetails')}></RangePicker>*/



/*<div>
        
      </div> */