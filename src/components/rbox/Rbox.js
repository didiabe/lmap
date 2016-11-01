import React from 'react';
import ReactDOM from 'react-dom';
import {
    connect
} from 'react-redux';
import * as action from '../../actions/searchAction';
import styles from './_rbox.css';
import * as CI from '../../scripts/CongestionIndex';
import SearchResults from './menu/SearchResults';
import CraResults from './menu/CraResults';
//import Pager from './menu/Pager';
import * as lmsg from '../../libs/lmsg';
import * as Ds from '../../libs/DataService';
import {
    Table
} from 'antd';



class Rbox extends React.Component {
    constructor() {
        super();
        this.state = {
            contraction: false,
            initCraResults: true,
            isCFYDpanel: false,
            cfydTabledata: []
        }
        this.crsBtnClick = this.crsBtnClick.bind(this);
    }
    contractionBtnClick() {
        this.setState({
            contraction: !this.state.contraction
        });
    }

    renderList() {
        let rboxkey = this.props.search.rboxKey;
        let dataRec = null;
        //console.log('renderList', this.props.cra.cralist)
        switch (rboxkey) {
            case 'search':
                dataRec = this.props.search.list;
                return React.createElement(SearchResults, dataRec, rboxkey);
            case 'cross':
                dataRec = this.props.cra.cralist;
                CI.addGracLayer(cross, dataRec);
                return React.createElement(CraResults, dataRec, rboxkey);
            case 'road':
                dataRec = this.props.cra.cralist;
                CI.addGracLayer(road, dataRec);
                return React.createElement(CraResults, dataRec, rboxkey);
            case 'area':
                dataRec = this.props.cra.cralist;
                CI.addGracLayer(area, dataRec);
                return React.createElement(CraResults, dataRec, rboxkey);
            default:
                break;
        }
    }
    crsBtnClick(layerName, t) {
        this.setState({
            initCraResults: true,
            contraction: false
        });
        this.props.fetchCRAList(layerName, t);

    }
    render() {
        let {
            page,
            totalPage,
            dispatch
        } = this.props;
        let searchAvtive = (this.props.searchValue === "");
        const cfydTableContent =
            [{
                title: '排名',
                dataIndex: 'No',
            }, {
                title: '拥堵名称',
                dataIndex: 'Name',
            }, {
                title: '畅通指数',
                dataIndex: 'ctjls',
            }, {
                title: '缓行指数',
                dataIndex: 'hxjls',
            }, {
                title: '拥堵指数',
                dataIndex: 'ydjls',
            }];

        const sectionPanel = this.state.initCraResults ? [
            <section key={"rboxPanels"} id="rboxPanels" className={styles.rboxPanels}>
                        <ul id='nav' className={styles.nav}>
                            <li id='cross' ref='cross' className={styles.craLi} onClick={() => {this.crsBtnClick('cross')} }>
                                <span className={styles.navTxt}>路口</span>
                            </li>
                            <li id='road' ref='road' className={styles.craLi} onClick={() => this.crsBtnClick('road') }>
                                <span className={styles.navTxt}>路段</span>
                            </li>
                            <li id='area' ref='area' className={styles.craLi} onClick={() => this.crsBtnClick('area') }>
                                <span className={styles.navTxt}>区域</span>
                            </li>
                        </ul>
                        <div id='resultPanel' className={styles.resultPanel}>
                            {this.renderList()}  
                        </div>
                    </section>
        ] : this.state.isCFYDpanel ? [
            <section key={'rboxPanels2'} id="rboxPanels2" className={styles.rboxPanel2}>
                <Table columns={cfydTableContent} dataSource={this.state.cfydTabledata} size='middle' pagination={false}/>
            </section>
        ] : null;
        return (
            <div id="rbox" className={styles.rbox}>
        <div id="navBody" className={this.state.contraction ? styles.navBody_none : styles.navBody_display}>
                    {sectionPanel}
                </div>
                
                <div id="contractionBtn" className={styles.rboxPanCtrl} onClick={() => this.contractionBtnClick() }>
                    <i className={styles.fa + ' ' + styles.faChevronUp} id="contractionInsideBtnUp"></i>
                </div>
            </div>
        )
    }

    componentDidMount() {
        //self的是代表整个component的this，如果是lmsg的，就错了
        let self = this;
        lmsg.subscribe('crsBtnClick', (data) => {
            console.log('crsBtnClick', data);
            self.setState({
                contraction: false,
                initCraResults: true
            });
            self.crsBtnClick(data.params, data.time);
            ReactDOM.unmountComponentAtNode(document.getElementById("presetBox"));
            localStorage.removeItem('crsBtnClick');
        });

        lmsg.subscribe('jrlzbbSend', (data) => {
            console.log('jrlzbbSend', data);
            Ds.DataService('/zone/initMap.json', {
                querytime: data.time
            }, (resp) => {
                CI.displayCommonLayer(resp.data);
                self.setState({
                    contraction: true,
                    initCraResults: false,
                    isCFYDpanel: false
                });
            }, (e) => {
                console.log(e);
                alert('后台传输错误');
            });
            localStorage.removeItem('jrlzbbSend');
        });

        lmsg.subscribe('cfxydBtnClick', (data) => {
            console.log('cfxydBtnClick', data);
            self.setState({
                cfydTabledata: []
            });
            if (data.isCross == 1) {
                //路口
                Ds.DataService('/recurrentCongestionCross/queryTheRankOfCongestionCrossTopTen.json', data.time, (resp) => {
                    var cfydTabledata = [];
                    if (!resp.data) alert('没有相应信息');
                    else {

                        for (var i = 0; i < resp.data.length; i++) {
                            cfydTabledata.push({
                                No: i + 1,
                                Name: resp.data[i].crossName,
                                ctjls: resp.data[i].ctjls,
                                ydjls: resp.data[i].hxjls,
                                ydjls: resp.data[i].ydjls
                            });
                        }
                        self.setState({
                            initCraResults: false,
                            isCFYDpanel: true,
                            contraction: true,
                            cfydTabledata: cfydTabledata
                        });
                    }
                }, (e) => {
                    console.log(e);
                    alert('后台传输错误');
                });

            } else if (data.isCross == 2) {
                //路段
                Ds.DataService('/recurrentCongestionRoad/queryTheRankOfCongestionRoadTopTen.json', data.time, (resp) => {
                    console.log(resp.data);
                    var cfydTabledata = [];
                    if (!resp.data) alert('没有相应信息');
                    else {

                        for (var i = 0; i < resp.data.length; i++) {
                            cfydTabledata.push({
                                No: i + 1,
                                Name: resp.data[i].roadName,
                                ctjls: resp.data[i].ctjls,
                                ydjls: resp.data[i].hxjls,
                                ydjls: resp.data[i].ydjls
                            });
                        }
                        self.setState({
                            initCraResults: false,
                            isCFYDpanel: true,
                            contraction: true,
                            cfydTabledata: cfydTabledata
                        });
                    }
                }, (e) => {
                    console.log(e);
                    alert('后台传输错误');
                });
            } else alert('双屏通讯错误');
            localStorage.removeItem('cfxydBtnClick');
        });

        lmsg.subscribe('locating', () => {
            self.setState({
                contraction: true,
                initCraResults: false,
                isCFYDpanel: false
            });
            localStorage.removeItem('locating');
        });
        lmsg.subscribe('tracktaxi', () => {
            self.setState({
                contraction: true,
                initCraResults: false,
                isCFYDpanel: false
            });
            localStorage.removeItem('tracktaxi');
        });
        lmsg.subscribe('ODClick', (data) => {
            self.setState({
                contraction: true,
                initCraResults: false,
                isCFYDpanel: false
            });
            localStorage.removeItem('ODClick');
        });
        lmsg.subscribe('hbjjr_init', (data) => {
            self.setState({
                contraction: true,
                initCraResults: false,
                isCFYDpanel: false
            });
            localStorage.removeItem('hbjjr_init');
        });
    }

}



function mapStateToProps(state) {
    return {
        search: state.search,
        cra: state.cra
    }
}
export default connect(mapStateToProps, action)(Rbox);