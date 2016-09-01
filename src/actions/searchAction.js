import {
    cac
} from '../utils/util';

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
            console.log(keyword);
            let param = {
                id: keyword
            }
            DataService('/zone/queryByName.json', param,
                (resp) => {
                    console.log(resp.data);
                    let data = resp.data;
                    dispatch(receiveList(data, page))
                },
                (e) => {
                    console.log(e);
                    alert("传输错误", e)
                });
            /*var data = {
                "cross": [{
                    "name": "dasd",
                    "index": 2
                }, {
                    "name": "nabbd",
                    "index": 4
                }, {
                    "name": "na11d",
                    "index": 3
                }, {
                    "name": "nad",
                    "index": 1
                }, {
                    "name": "nadqe",
                    "index": 3
                }, {
                    "name": "na565d",
                    "index": 5
                }, {
                    "name": "n4234gdgad",
                    "index": 9
                }, {
                    "name": "nad",
                    "index": 7
                }, {
                    "name": "nad",
                    "index": 1
                }, {
                    "name": "nad",
                    "index": 3
                }, {
                    "name": "nad",
                    "index": 8
                }, {
                    "name": "nad",
                    "index": 2
                }],
                "road": [{
                    "name": "dasd",
                    "index": 2
                }, {
                    "name": "nabbd",
                    "index": 4
                }, {
                    "name": "na11d",
                    "index": 3
                }, {
                    "name": "nad",
                    "index": 1
                }, {
                    "name": "nadqe",
                    "index": 3
                }, {
                    "name": "na565d",
                    "index": 5
                }, {
                    "name": "n4234gdgad",
                    "index": 9
                }],
                "region": [{
                    "name": "dasd",
                    "index": 2
                }, {
                    "name": "nadqe",
                    "index": 3
                }, {
                    "name": "na565d",
                    "index": 5
                }, {
                    "name": "n4234gdgad",
                    "index": 9
                }, {
                    "name": "nad",
                    "index": 7
                }, {
                    "name": "nad",
                    "index": 1
                }, {
                    "name": "nad",
                    "index": 3
                }, {
                    "name": "nad",
                    "index": 8
                }, {
                    "name": "nad",
                    "index": 2
                }]
            };*/



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
        url: 'http://10.25.67.78:8080/trafficIndex_web' + api_path,
        data: param,
        dataType: 'json',
        async: false,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        success: a,
        error: b
    });
};


export const PUSH_CRA_LIST = 'PUSH_CRA_LIST'
export const pushCRAList = cac(PUSH_CRA_LIST, 'list')
var d = new Date();
var myday = null;
var last_Path;
export const fetchCRAList = (rboxkey, t) => {

    if (rboxkey == 'cross') last_Path = '/cross/ydlkMore.json';
    else if (rboxkey == 'road') last_Path = '/road/ydldMore.json';
    else if (rboxkey == 'area') last_Path = '/zone/ydqyMore.json';

    return (dispatch, getState) => {
        dispatch(setRboxKey(rboxkey))
        if (t == null) myday = d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        else myday = t;
        var param = {
            queryTime: myday,
            pageIndex: 1,
            pageSize: 10,
            isFirst: true
        };
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