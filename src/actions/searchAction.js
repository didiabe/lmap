import {
    cac
} from '../utils/util';
import * as Ds from '../libs/DataService';
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
            Ds.DataService('/zone/queryByName.json', param,
                (resp) => {
                    console.log(resp.data);
                    let data = resp.data;
                    dispatch(receiveList(data, page))
                },
                (e) => {
                    console.log(e);
                    alert("传输错误", e)
                });

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
    /*const DataService = (api_path, param, a, b) => {
        window.$.ajax({
            type: 'POST',
            //10.25.67.72
            url: 'http://10.25.67.133:8080/trafficIndex_web' + api_path,
            data: param,
            dataType: 'json',
            async: false,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            success: a,
            error: b
        });
    };*/


export const PUSH_CRA_LIST = 'PUSH_CRA_LIST'
export const pushCRAList = cac(PUSH_CRA_LIST, 'list')
var d = new Date();
var myday = null;
var last_Path;
var sendParam2 = null;
var dataRecv = null;
export const fetchCRAList = (rboxkey, t) => {
    if (t == undefined) {
        myday = d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        if (rboxkey == 'cross') last_Path = '/cross/ydlkMore.json';
        else if (rboxkey == 'road') last_Path = '/road/ydldMore.json';
        else if (rboxkey == 'area') last_Path = '/zone/ydqyMore.json';
        console.log(myday)
        sendParam2 = {
            queryTime: myday,
            pageIndex: 1,
            pageSize: 10,
            isFirst: true
        };
    } else {
        myday = t.sj;
        var YWD = t.flag;
        sendParam2 = {
            date: myday,
            flag: YWD,
            pageIndex: 1,
            pageSize: 10,
            isFirst: true
        };
        if (rboxkey == 'cross') last_Path = '/map/crossJtda.json';
        else if (rboxkey == 'road') last_Path = '/map/roadJtda.json';
        else if (rboxkey == 'area') last_Path = '/map/zoneJtda.json';
    }
    Ds.DataService(last_Path, sendParam2,
        (resp) => {
            //console.log(resp);
            dataRecv = resp.data;
            console.log(dataRecv);
        },
        (e) => {
            console.log(e);
            alert("后台传输有误！")
        });

    return (dispatch, getState) => {

        dispatch(setRboxKey(rboxkey));

        //dispatch不执行
        dispatch(pushCRAList(dataRecv))


    }

}