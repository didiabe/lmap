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
//import * as lmsg from '../../../lmsg';

class Rbox extends React.Component {
    constructor() {
        super();
        this.state = {
            contraction: false
        }
    }
    contractionBtnClick() {
        this.setState({
            contraction: !this.state.contraction
        })
    }
    renderList() {
        let rboxkey = this.props.search.rboxKey;
        console.log(rboxkey);
        let dataRec = null;
        switch (rboxkey) {
            case 'search':
                dataRec = this.props.search.list;
                return React.createElement(SearchResults, dataRec);
                /*return this.props.search.list.map(item => {
                   console.log(item);
                    return React.createElement(SearchResults, item);
                });*/
            case 'cross':
                dataRec = this.props.cra.cralist;
                CI.addGracLayer(cross, dataRec);
                return React.createElement(CraResults, dataRec);
            case 'road':
                dataRec = this.props.cra.cralist;
                CI.addGracLayer(road, dataRec);
                return React.createElement(CraResults, dataRec);
            case 'area':
                dataRec = this.props.cra.cralist;
                CI.addGracLayer(area, dataRec);
                return React.createElement(CraResults, dataRec);
            default:
                break;

        }
    }
    crsBtnClick(layerName, t) {
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
                            <li id='cross' ref='cross' className={styles.craLi} onClick={() => this.crsBtnClick(this.refs.cross.id) }>
                                <span className={styles.navTxt}>路口</span>
                            </li>
                            <li id='road' ref='road' className={styles.craLi} onClick={() => this.crsBtnClick(this.refs.road.id) }>
                                <span className={styles.navTxt}>路段</span>
                            </li>
                            <li id='area' ref='area' className={styles.craLi} onClick={() => this.crsBtnClick(this.refs.area.id) }>
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

    /*componentDidMount() {
        let self = this;
        lmsg.subscribe('crsBtnClick', function getMes(data) {
            alert(JSON.stringify(data));
            // if (data.message == "cross") {
            //     self.refs.cross.click();
            // } else if (data.message == "road") {
            //     self.refs.road.click();
            // } else {
            //     self.refs.area.click();
            // }
        });


    }*/

}

function mapStateToProps(state) {
    return {
        search: state.search,
        cra: state.cra
    }
}

export default connect(mapStateToProps, action)(Rbox);