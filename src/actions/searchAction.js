import { cac } from '../utils/util';

// 设置rboxkey
export const SET_RBOX_KEY = 'SET_RBOX_KEY'
const setRboxKey = cac(SET_RBOX_KEY, 'rboxkey')


// search点击事件
export const RECEIVE_CRA_LIST = 'RECEIVE_CRA_LIST'
export const SET_KEYWORD = 'SET_KEYWORD'
export const PAGE_SIZE = 1

const receiveList = cac(RECEIVE_CRA_LIST, 'data', 'page')
const setKeyord = cac(SET_KEYWORD, 'value')

export const fetchSearchList = (keyword, rboxkey, page = 1) => {
        return (dispatch, getState) => {

            dispatch(setRboxKey(rboxkey))

            if (!keyword && keyword != '') {
                keyword = getState().search.keyword
            } else {
                dispatch(setKeyord(keyword))
            }
            window.$.ajax({
                url: 'http://www.tngou.net/api/search',
                data: { keyword, name: 'topword', page, rows: PAGE_SIZE },
                dataType: 'jsonp',
                success: (data) => {
                    if (data.status) {
                        dispatch(receiveList(data, page))
                    } else {
                        let Rdata = {};
                        Rdata.tngou = [{ title: '中国', description: '你好' }, { title: '奥运', description: '伟大的项目' }];
                        Rdata.total = 2;
                        dispatch(receiveList(Rdata, page))
                    }
                }
            })
        }
    }
    //fetch的方法
    /*const dataService = (api_path, param, a, b) =>{
        fetch("http://10.25.67.130:8080/trafficIndex_web"+ api_path,{method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},body: param})
        .then(response => response.json())
          .then(a)
          .b;
          //a => data{}
          //b => error{}
    }*/
const DataService = (api_path, param, a, b) => {
    window.$.ajax({
        type: 'POST',
        //10.25.67.72
        url: 'http://10.25.67.130:8080/trafficIndex_web' + api_path,
        data: param,
        dataType: 'json',
        async: false,
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        success: a,
        error: b
    });
};

// 路口路段区域事件
/*export const PUSH_CROSS_LIST = 'PUSH_CROSS_LIST'
export const PUSH_ROAD_LIST = 'PUSH_ROAD_LIST'
export const PUSH_AREA_LIST = 'PUSH_AREA_LIST'
export const pushCrossList = cac(PUSH_CROSS_LIST, 'list')
export const pushRoadList = cac(PUSH_ROAD_LIST, 'list')
export const pushAreaList = cac(PUSH_AREA_LIST, 'list')

var d = new Date();
var myday = d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
export const fetchCrossList = (rboxkey) => {
    console.log(rboxkey);
    return (dispatch, getState) => {
        dispatch(setRboxKey(rboxkey))
        var param1 = { queryTime: myday, pageIndex: 1, pageSize: 10, isFirst: true };
        DataService('/cross/ydlkMore.json', param1,
            (resp) => {
                //console.log(resp);
                let dataRecv = resp.data;
                dispatch(pushCrossList(dataRecv))
            },
            (e) => {
                console.log(e);
                alert("后台传输有误！")
            });
    }
}
export const fetchRoadList = (rboxkey) => {
    return (dispatch, getState) => {
        dispatch(setRboxKey(rboxkey))
        var param2 = { queryTime: myday, pageIndex: 1, pageSize: 10, isFirst: true };
        DataService('/road/ydldMore.json', param2,
            (resp) => {
                //console.log(resp);
                let dataRecv2 = resp.data;
                dispatch(pushRoadList(dataRecv2))
            },
            (e) => {
                console.log(e);
                alert("后台传输有误！")
            });
    }
}
export const fetchAreaList = (rboxkey) => {
    return (dispatch, getState) => {
        dispatch(setRboxKey(rboxkey))
        var param3 = { queryTime: myday, pageIndex: 1, pageSize: 10, isFirst: true };
        DataService('/zone/ydqyMore.json', param3,
            (resp) => {
                console.log(resp);
                let dataRecv3 = resp.data;
                dispatch(pushAreaList(dataRecv3))
            },
            (e) => {
                console.log(e);
                alert("后台传输有误！")
            });
    }
}*/

export const PUSH_CRA_LIST = 'PUSH_CRA_LIST'
export const pushCRAList = cac(PUSH_CRA_LIST, 'list')
var d = new Date();
var myday = d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
var last_Path;
export const fetchCRAList = (rboxkey) => {

    if (rboxkey == 'cross') last_Path = '/cross/ydlkMore.json';
    else if (rboxkey == 'road') last_Path = '/road/ydldMore.json';
    else if (rboxkey == 'area') last_Path = '/zone/ydqyMore.json';

    return (dispatch, getState) => {
        dispatch(setRboxKey(rboxkey))
        var param = { queryTime: myday, pageIndex: 1, pageSize: 10, isFirst: true };
        DataService(last_Path, param,
            (resp) => {
                //console.log(resp);
                let dataRecv = resp.data;
                dispatch(pushCRAList(dataRecv))
            },
            (e) => {
                console.log(e);
                alert("后台传输有误！")
            });
    }

}
