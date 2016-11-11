import React from 'react';
import ReactDOM from 'react-dom';
import Search from '../components/search/Search';
import ToolBar from '../components/toolBar/ToolBar';
import Rbox from '../components/rbox/Rbox';
import Map from '../components/map/Map';
import Emap from '../components/map/Emap';
import * as Ds from '../libs/DataService';

class CongestionIndex extends React.Component {
    constructor() {
        super();
        this.state = {
            islogin: true
        }
    }
    componentWillMount() {
        /*        let self = this;
                Ds.DataService('/isMaplogin.json', null, (resp) => {
                    console.log('asdaadas', resp)
                    var status = resp.aaData;
                    self.setState({
                        islogin: status
                    });
                }, (e) => {
                    console.log('error', e);
                    self.setState({
                        islogin: false
                    })
                });*/

    }
    render() {
        const loginPanel = this.state.islogin ? [
            <div key = 'a'>
                <Map/>
                <Search/>
                <ToolBar/>
                <Rbox/>
                </div>
        ] : [
            <h1 key = 'b'>无权访问，请先登陆</h1>
        ]
        return (
            <div>
        {loginPanel}
            </div>
        )
    }
}

export default CongestionIndex