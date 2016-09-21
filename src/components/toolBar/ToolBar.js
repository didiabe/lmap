import React from 'react';
import ReactDOM from 'react-dom';
import TrafficConditions from './menu/Traffic';
import UpdateIndex from './menu/updateIndex';
import Drawsth from './menu/Drawsth';
import styles from './_toolBar.css';
//import * as DRAW from '../../scripts/drawtest';

class ToolBar extends React.Component {
    constructor() {
            super();
        }
        /* drawtest() {
             console.log(DRAW)
                 //console.log(DRAW.drawFeatures);
             DRAW.drawFeatures();

         }*/
    render() {
        return (
            <div id='toolBar' className={styles.layerbox}>
                <div id="layerbox" className={styles.layerboxIn}>
                    <div id="toolBar">
                        <ul>
                            <TrafficConditions/>
                            <UpdateIndex />
                            {/*<li id="satelliteMap">
                                <div type="satellite">
                                    <span className={styles.satellite}>回放</span>
                                </div>
                            </li>*/}

                            <li id="subway">
                                <div type="subway">
        <span className={styles.subway} >是啥</span>
                                </div>
                            </li>
                            {/*<li id="distanceMeasure">
                                <div type="ranging">
                                    <span className={styles.ranging}>工具</span>
                                </div>
                            </li>*/}
                            <Drawsth/>
                            <li id="fullScreen">
                                <div type="fullscreen">
                                    <span className={styles.fullscreen}>全屏</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div id='presetBox'/>
                    </div>
                   
                   
                </div>
        )
    }
}



export default ToolBar