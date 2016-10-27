import React from 'react';
import styles from './_SearchResults.css';
import {
    Collapse,
    Icon
} from 'antd';

const Panel = Collapse.Panel;
class SearchResults extends React.Component {

    render() {
        let crossResults = this.props.cross;
        let roadResults = this.props.road;
        let regionResults = this.props.region;

        return (

            <Collapse defaultActiveKey={['1']} accordion>
    <Panel header={'路口信息'} key="1">
      <div className={styles.content}>
                                    <table className={styles.bordered}>
                                    <thead>
                                    <tr>
                                    <th>#</th>
                                    <th>路口名称</th>
                                    <th>路口指数</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {crossResults.map((item)=>{
                                        return <tr key={item.id}>
                                            <td key={item.id}><Icon type="loading" /></td>
                                            <td key={item.id}>{item.name}</td>
                                            <td key={item.id} className={item.index > 8 ? styles.font_color5 :
                                                           item.index > 6 ? styles.font_color4 :
                                                           item.index > 4 ? styles.font_color3 :
                                                           item.index > 2 ? styles.font_color2 :
                                                           styles.font_color1}>{item.jtzs}</td>
                                        </tr>
                                    })}
                                    </tbody>
                                    </table>
                                    </div>
    </Panel>
    <Panel header={'路段信息'} key="2">
      <div className={styles.content}>
                                    <table className={styles.bordered}>
                                    <thead>
                                    <tr>
                                    <th>#</th>
                                    <th>路段名称</th>
                                    <th>路段指数</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {roadResults.map((item)=>{
                                        return <tr key={item.id}>
                                            <td key={item.id}><Icon type="smile" /></td>
                                            <td key={item.id}>{item.name}</td>
                                            <td key={item.id} className={item.index > 8 ? styles.font_color5 :
                                                           item.index > 6 ? styles.font_color4 :
                                                           item.index > 4 ? styles.font_color3 :
                                                           item.index > 2 ? styles.font_color2 :
                                                           styles.font_color1}>{item.jtzs}</td>
                                        </tr>
                                    })}
                                    </tbody>
                                    </table>
                                    </div>
    </Panel>
    <Panel header={'区域信息'} key="3">
      <div className={styles.content}>
                                    <table className={styles.bordered}>
                                    <thead>
                                    <tr>
                                    <th>#</th>
                                    <th>区域名称</th>
                                    <th>区域指数</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {regionResults.map((item)=>{
                                        return <tr key={item.id}>
                                            <td key={item.id}><Icon type="smile" /></td>
                                            <td key={item.id}>{item.name}</td>
                                            <td key={item.id} className={item.index > 8 ? styles.font_color5 :
                                                           item.index > 6 ? styles.font_color4 :
                                                           item.index > 4 ? styles.font_color3 :
                                                           item.index > 2 ? styles.font_color2 :
                                                           styles.font_color1}>{item.jtzs}</td>
                                        </tr>
                                    })}
                                    </tbody>
                                    </table>
                                    </div>
    </Panel>
  </Collapse>



        )
    }
}


export default SearchResults