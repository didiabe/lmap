import React from 'react';
import ReactDOM from 'react-dom';
import TrafficConditions from './menu/Traffic';
import UpdateIndex from './menu/updateIndex';
import Drawsth from './menu/Drawsth';
import UniqueSub from './menu/UniqueSub';
import ConfigSub from './menu/ConfigSub';
import styles from './_toolBar.css';
//import * as DRAW from '../../scripts/drawtest';
import * as lmsg from '../../libs/lmsg';

class ToolBar extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {}
    render() {
        return (
            <div id='toolBar' className={styles.layerbox}>
                <div id="layerbox" className={styles.layerboxIn}>
                    <div id="toolBar">
                        <ul ref="toolbar">
                            <TrafficConditions/>
                            <UpdateIndex />
                            <UniqueSub/>
                            <Drawsth/>
                            <ConfigSub/>
                        </ul>
                    </div>
                    <div id='presetBox'/>
                    </div> 
                </div>

        )
    }
}

export default ToolBar