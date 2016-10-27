import React from 'react';
import styles from './_craResults.css';
import * as lmsg from '../../../libs/lmsg';
import * as Ds from '../../../libs/DataService';
import {
    Pagination
} from 'antd';
import QueueAnim from 'rc-queue-anim';
var children_rboxkey = null,
    last_Path = null,
    JtzsList = null;
let d = new Date();
let month = d.getMonth() + 1;
class CraResults extends React.Component {
    constructor() {
        super();
        this.state = {
            tableContent: [],
            t: undefined
        }
        this.pagination = this.pagination.bind(this);
    }
    pagination(page) {
        let rboxkey1 = this.props.children;
        let self = this;
        var sendParam2;
        if (this.state.t == undefined) {
            let myday = d.getFullYear() + "/" + month + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            if (rboxkey1 == 'cross') last_Path = '/cross/ydlkMore.json';
            else if (rboxkey1 == 'road') last_Path = '/road/ydldMore.json';
            else if (rboxkey1 == 'area') last_Path = '/zone/ydqyMore.json';
            sendParam2 = {
                queryTime: myday,
                pageIndex: page,
                pageSize: 10,
                isFirst: false
            };
        } else if (this.state.t && (this.state.t.flags == null)) {
            if (this.state.t.rboxkey == 'cross') last_Path = '/cross/ydlkMore.json';
            else if (this.state.t.rboxkey == 'road') last_Path = '/road/ydldMore.json';
            else if (this.state.t.rboxkey == 'area') last_Path = '/zone/ydqyMore.json';
            sendParam2 = {
                queryTime: this.state.t.sj,
                pageIndex: page,
                pageSize: 10,
                isFirst: false
            };
        } else {
            let myday = this.state.t.sj;
            let YWD = this.state.t.flags;
            sendParam2 = {
                date: myday,
                flag: YWD,
                pageIndex: page,
                pageSize: 10,
                isFirst: false
            };
            if (rboxkey1 == 'cross') last_Path = '/map/crossJtda.json';
            else if (rboxkey1 == 'road') last_Path = '/map/roadJtda.json';
            else if (rboxkey1 == 'area') last_Path = '/map/zoneJtda.json';
        }

        Ds.DataService(last_Path, sendParam2, (resp) => {
            self.setState({
                tableContent: resp.data.jtzsPage.jtzsList
            });
        }, (e) => {
            console.log(e);
        });
    }
    componentDidMount() {
        //console.log('this.props', this.props);
        let self = this;
        this.setState({
            tableContent: JtzsList.jtzsList
        });
        lmsg.subscribe('crsBtnClick', (data) => {
            self.setState({
                t: data.time
            });
            localStorage.removeItem('crsBtnClick');
        });
    }
    componentWillReceiveProps() {
        console.log(112)
    }
    render() {

        children_rboxkey = this.props.children;
        JtzsList = this.props.jtzsPage;

        console.log('list', JtzsList);
        console.log('state', this.state.tableContent)
        if (!JtzsList) alert("错误");
        return (
            <div className={styles.traffic_tag}>
                <div>
                    <div>
                        <span className={styles.traffic_level_3}></span>
                        <span className={styles.smooth_jam}>轻度拥堵: </span>
                        <span className={styles.smooth_jam_num2}>{JtzsList.qdyds}</span>
                        <span id="separator" className={styles.separator_LV3}></span>
                        <span className={styles.traffic_level_1}></span>
                        <span className={styles.smooth_jam1}>畅通: </span>
                        <span className={styles.smooth_jam_num3}>{JtzsList.cts}</span>
                        <span id="separator" className={styles.separator_LV1}></span>
                    </div>
                    <div>
                        <span className={styles.traffic_level_4}></span>
                        <span className={styles.smooth_jam}>中度拥堵: </span>
                        <span className={styles.smooth_jam_num2}>{JtzsList.zdyds}</span>
                        <span id="separator" className={styles.separator_LV4}></span>
                        <span className={styles.traffic_level_2}></span>
                        <span className={styles.smooth_jam2}>基本畅通: </span>
                        <span className={styles.smooth_jam_num4}>{JtzsList.jbcts}</span>
                        <span id="separator" className={styles.separator_LV2}></span>
                    </div>
                    <div>
                        <span className={styles.traffic_level_5}></span>
                        <span className={styles.smooth_jam}>严重拥堵: </span>
                        <span className={styles.smooth_jam_num2}>{JtzsList.yzyds}</span>
                        <span id="separator" className={styles.separator_LV5}></span>
                        <span id="separator" className={styles.separator_LV0}></span>
                    </div>
                </div><br/>
                <div id='table' className={styles.table}>
                    <div>
                        <p>拥堵路口排名</p>
                        <span className={styles.smooth_jam_rank}>排名</span>
                        <span className={styles.smooth_jam_num_name}>名称</span>
                        <span className={styles.smooth_jam_num_index}>拥堵指数</span>
                        <span className={styles.smooth_jam_num_hierarchy}>拥堵等级</span>
                    </div>
                    <ul id='table_rows' className={styles.table_rows}>
                        {this.state.tableContent.map(item => {
                           // console.log(item);
                            return <QueueAnim key={item.id} delay={300} className="queue-simple"><TableRow key={item.id} item={item}/></QueueAnim>
                        }) }
                    </ul>
                    <div className={styles.pager}>
                <Pagination simple defaultCurrent={1} total={JtzsList.total} onChange={this.pagination}/>
           
                </div>
                </div>
                
            </div>
        )
    }
}

class TableRow extends React.Component {
    constructor() {
        super();
        this.onClickRow = this.onClickRow.bind(this);
    }
    onClickRow(ref) {
        //console.log(this.props)
        var ID2screen1 = this.props.item.id;
        var Name2screen1 = this.props.item.name;
        var iscra = null;
        var children_rboxkey_key = null;
        switch (children_rboxkey) {
            case 'cross':
                children_rboxkey_key = 'lksszs';
                break;
            case 'road':
                children_rboxkey_key = 'ldsszs';
                break;
            case 'area':
                children_rboxkey_key = 'qysszs';
                break;
        };
        lmsg.send(children_rboxkey_key, {
            'params': children_rboxkey,
            'isTime': 1,
            'ID': ID2screen1,
            'name': Name2screen1
        });
    }

    componentDidMount() {}
    render() {
        var hierarchyStyle = null;
        switch (this.props.item.yddj) {
            case '畅通':
                hierarchyStyle = {
                    color: '#36AE4C',
                    float: 'left',
                    width: '60px',
                    height: '20px',
                    textAlign: 'center'
                };
                break;
            case '基本畅通':
                hierarchyStyle = {
                    color: '#6AB72D',
                    float: 'left',
                    width: '60px',
                    height: '20px',
                    textAlign: 'center'
                };
                break;
            case '轻度拥堵':
                hierarchyStyle = {
                    color: '#ECE839',
                    float: 'left',
                    width: '60px',
                    height: '20px',
                    textAlign: 'center'
                };
                break;
            case '中度拥堵':
                hierarchyStyle = {
                    color: '#F29618',
                    float: 'left',
                    width: '60px',
                    height: '20px',
                    textAlign: 'center'
                };
                break;
            case '严重拥堵':
                hierarchyStyle = {
                    color: '#E41A16',
                    float: 'left',
                    width: '60px',
                    height: '20px',
                    textAlign: 'center'
                };
                break;
            default:
                hierarchyStyle = {
                    float: 'left',
                    width: '60px',
                    height: '20px',
                    textAlign: 'center'
                };
                break;
        }
        return (
            <li id='row' className={styles.row}>
                <ul>
                    <li ref='IndexRank' id='rank' className={styles.rank}>{this.props.item.xh}</li>
                    <li ref='IndexName' id='name' className={styles.name} title={this.props.item.name} onClick={this.onClickRow}>{this.props.item.name}</li>
                    <li ref='IndexIndex' id='index' className={styles.index}>{this.props.item.jtzs}</li>
                    <li ref='IndexLevel' id='level' style={hierarchyStyle}>{this.props.item.yddj}</li>
                </ul>
            </li>

        )
    }
}

export default CraResults