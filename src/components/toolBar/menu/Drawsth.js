import React from 'react';
import ReactDOM from 'react-dom';
import * as DR from '../../../scripts/drawFeatures';
import * as CI from '../../../scripts/CongestionIndex';
import styles from '../_toolBar.css';

class Drawsth extends React.Component {
    constructor() {
        super();
        this.state = {
            active: false
        }

    }
    startDrawing() {
        this.setState({
            active: !this.state.active
        });
        if (this.state.active) DR.drawFeatures.disable();
        else DR.drawFeatures.activate();
    }
    render() {
        return (
            <div>
        <li id="ranging" onClick={() => this.startDrawing() }>
                    <div type="ranging">
                        <span className={this.state.active ? styles.ranging_active : styles.ranging}>绘图</span>
                    </div>
                </li>
            </div>

        )
    }
    componentDidMount() {

    }

}
export default Drawsth