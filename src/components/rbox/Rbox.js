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
import Pager from './menu/Pager';
import * as lmsg from '../../libs/lmsg';


class Rbox extends React.Component {
    constructor() {
        super();
        this.state = {
            contraction: false,
            timing: null
        }
    }
    contractionBtnClick() {
        this.setState({
            contraction: !this.state.contraction
        })
    }
    renderList() {
        let rboxkey = this.props.search.rboxKey;
        //console.log(rboxkey);
        let dataRec = null;
        console.log(this.props.cra.cralist)
        switch (rboxkey) {
            case 'search':
                dataRec = this.props.search.list;
                return React.createElement(SearchResults, dataRec, rboxkey);
                /*return this.props.search.list.map(item => {
                   console.log(item);
                    return React.createElement(SearchResults, item);
                });*/
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
        if (this.state.timing) this.setState({
            timing: null
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
        return (
            <div id="rbox" className={styles.rbox}>
                <div id="navBody" className={this.state.contraction ? styles.navBody_none : styles.navBody_display}>
                    <section id="rboxPanels" className={styles.rboxPanels}>
                        <ul id='nav' className={styles.nav}>
                            <li id='cross' ref='cross' className={styles.craLi} onClick={() => {this.crsBtnClick(this.refs.cross.id, this.state.timing)} }>
                                <span className={styles.navTxt}>路口</span>
                            </li>
                            <li id='road' ref='road' className={styles.craLi} onClick={() => this.crsBtnClick(this.refs.road.id, this.state.timing) }>
                                <span className={styles.navTxt}>路段</span>
                            </li>
                            <li id='area' ref='area' className={styles.craLi} onClick={() => this.crsBtnClick(this.refs.area.id, this.state.timing) }>
                                <span className={styles.navTxt}>区域</span>
                            </li>
                            
                        </ul>
                        <div id='resultPanel' className={styles.resultPanel}>
                            {this.renderList() }
                            <Pager page={page} totalPage={totalPage} onChangePage={i => this.props.fetchList(null, i) } />
                        </div>
                    </section>
                </div>
                <div id="contractionBtn" className={styles.rboxPanCtrl} onClick={() => this.contractionBtnClick() }>
                    <i className={styles.fa + ' ' + styles.faChevronUp} id="contractionInsideBtnUp"></i>
                </div>
            </div>
        )
    }

    componentDidMount() {
        //self的是代表整个component的this，如果是lmsg的，就错了
        var self = this;
        self.setState({
            timing: null
        });
        //console.log("self1", self);
        /* var data123 = {
             'sj': '2016',
             'flag': '3'
         };

         setTimeout(() => {

                 self.setState({
                     timing: data123
                 });
                 console.log(this.state);
                 self.refs.road.click();
             }, 2000)*/
        /* setTimeout(() => {
             console.log("self2", self);
             self.props.fetchCRAList("cross", {
                 'sj': '2016',
                 'flag': '3'
             });
         }, 2000)*/

        lmsg.subscribe('crsBtnClick', (data) => {
            console.log(data);
            self.setState({
                timing: null
            });
            let param_cra = data.params;

            if (data.isTime == 1) {
                if (param_cra == 'cross') self.refs.cross.click();
                else if (param_cra == 'road') self.refs.road.click();
                else if (param_cra == 'area') self.refs.area.click();

            } else if (data.isTime == 2) {
                if (param_cra == 'cross') {
                    self.setState({
                        timing: param_cra.time
                    });
                    self.refs.cross.click();


                } else if (param_cra == 'road') {

                    self.setState({
                        timing: param_cra.time
                    });
                    self.refs.road.click();

                } else if (param_cra == 'area') {
                    self.setState({
                        timing: param_cra.time
                    });
                    self.refs.area.click();

                }
                console.log(self.state);
            } else alert("双屏通讯错误！");
            //   if (data.isTime == 1) self.crsBtnClick(param_cra);
            // else if (data.isTime == 2) self.crsBtnClick(param_cra, data.time);
            //       else alert("双屏通讯错误！");



            /*if (data.message == "road") {
                this.refs.cross.click();
            } else if (data.message == "road") {
                self.refs.road.click();
            } else {
                self.refs.area.click();
            }*/

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