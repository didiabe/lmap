import L from 'leaflet';
import LE from 'esri-leaflet';
import * as turf from '@turf/turf';
import * as meta from '@turf/meta';
import * as lmap from '../libs/lmap';
import * as lmsg from '../libs/lmsg';
import * as Ds from '../libs/DataService';
import {
    message
} from 'antd';

export function addGracLayer(layerName, data) {
    switch (layerName) {
        case 'cross':
            crossLayer(data);
            break;
        case 'road':
            roadLayer(data);
            break;
        case 'area':
            areaLayer(data);
            break;
        default:
            break;
    }

}

const crossLayer = function(data) {
    map.eachLayer((layer) => {
        if (layer.options.id != 'crossLayer' && layer.options.id != 'streetLayer')
            map.removeLayer(layer);
    });
    var GeoJsonPoints = data.geoJson;
    var greenMarker = lmap.icon({
        iconSize: [15, 15],
        color: 'rgb(54,174,76)'
    });
    var yellowMarker = lmap.icon({
        iconSize: [15, 15],
        color: 'rgb(106,183,45)'
    });
    var orangeMarker = lmap.icon({
        iconSize: [15, 15],
        color: 'rgb(236,232,57)'
    });
    var brownMarker = lmap.icon({
        iconSize: [15, 15],
        color: 'rgb(242,150,24)'
    });
    var redMarker = lmap.icon({
        iconSize: [15, 15],
        color: 'rgb(228,26,22)'
    });

    var pointMarkerOption = null;
    var pointLayer;

    function panTotarget(e) {
        if (map.getZoom() <= 16) {
            map.setZoomAround(e.target._latlng, 17);
        } else map.panTo(e.target._latlng);
        var popupCross = document.createElement('div');
        var p = document.createElement('p');
        p.innerHTML = '路口名称:' + e.target.feature.properties.name
        var button1 = document.createElement('button');
        button1.classList.add('green_button');
        button1.innerHTML = '更新';
        button1.onclick = function() {
            lmsg.send('openModal_updIdx', {
                id: e.target.feature.properties.id,
                index: e.target.feature.properties.index,
                type: 3 //（1区域(region) 2 路段(road) 3 路口(cross)）
            });
        };
        var button2 = document.createElement('button');
        button2.classList.add('green_button');
        button2.innerHTML = '实时';
        button2.onclick = function() {
            lmsg.send('lksszs', {
                params: 'cross',
                isTime: '1',
                ID: e.target.feature.properties.id,
                name: e.target.feature.properties.name
            });
            console.log('传送成功-实时');
        };
        var button3 = document.createElement('button');
        button3.classList.add('green_button');
        button3.innerHTML = '档案';
        button3.onclick = function() {
            lmsg.send('lkjt', {
                params: 'cross',
                isTime: '2',
                ID: e.target.feature.properties.id,
                name: e.target.feature.properties.name
            });
            console.log('传送成功-档案');
        };
        popupCross.appendChild(p);
        popupCross.appendChild(button1);
        popupCross.appendChild(button2);
        popupCross.appendChild(button3);
        var customOptions = {
            'maxWidth': '500',
            'className': 'custom'
        };
        pointLayer.bindPopup(popupCross, customOptions)
            .addTo(map);
    };

    function highlightFeature(e) {
        var highlighticon = lmap.icon({
            iconSize: [25, 25],
            color: e.target.defaultOptions.icon.options.color
        });
        e.target.setIcon(highlighticon);
        /*L.popup({
            offset: [0, -8],
            closeButton: false
        }).setLatLng(e.target._latlng).setContent(e.target.feature.properties.name).openOn(map);*/
    };

    function resetFeature(e) {
        var reseticon = lmap.icon({
            iconSize: [15, 15],
            color: e.target.defaultOptions.icon.options.color
        });
        e.target.setIcon(reseticon);
        //map.closePopup();
    };

    function eachPointFeature(feature, layer) {
        layer.on({
            click: panTotarget,
            mouseover: highlightFeature,
            mouseout: resetFeature
        });
    };
    pointLayer = L.geoJson(GeoJsonPoints, {
        pointToLayer: function(feature, latlng) {
            var indexVal = feature.properties.index;
            if (indexVal > 0 && indexVal <= 2)
                pointMarkerOption = greenMarker;
            else if (indexVal > 2 && indexVal <= 4)
                pointMarkerOption = yellowMarker;
            else if (indexVal > 4 && indexVal <= 6)
                pointMarkerOption = orangeMarker;
            else if (indexVal > 6 && indexVal <= 8)
                pointMarkerOption = brownMarker;
            else if (indexVal > 8)
                pointMarkerOption = redMarker;

            return L.marker(latlng, {
                icon: pointMarkerOption
            });
        },
        onEachFeature: eachPointFeature

    }).addTo(map);

};

const roadLayer = function(data) {
    map.eachLayer((layer) => {
        if (layer.options.id != 'roadLayer' && layer.options.id != 'streetLayer')
            map.removeLayer(layer);
    });
    var GeoJsonLines = data.geoJson;
    var greenLine = {
        'fillColor': "rgb(54,174,76)",
        "color": "rgb(54,174,76)",
        "weight": 7,
        "opacity": 0.8,
        'fillOpacity': 1
    };
    var yellowLine = {
        'fillColor': "rgb(106,183,45)",
        "color": "rgb(106,183,45)",
        "weight": 7,
        "opacity": 0.8,
        'fillOpacity': 1
    };
    var orangeLine = {
        'fillColor': "rgb(236,232,57)",
        "color": "rgb(236,232,57)",
        "weight": 7,
        "opacity": 0.8,
        'fillOpacity': 1
    };
    var brownLine = {
        'fillColor': "rgb(242,150,24)",
        "color": "rgb(242,150,24)",
        "weight": 7,
        "opacity": 0.8,
        'fillOpacity': 1
    };

    var redLine = {
        'fillColor': "rgb(228,26,22)",
        "color": "rgb(228,26,22)",
        "weight": 7,
        "opacity": 0.8,
        'fillOpacity': 1
    };
    var lineLayer;

    function panToBound(e) {

        map.fitBounds(e.target.getBounds());
        var popupRoad = document.createElement('div');
        var p = document.createElement('p');
        p.innerHTML = '路段名称:' + e.target.feature.properties.name
        var button1 = document.createElement('button');
        button1.classList.add('green_button');
        button1.innerHTML = '更新';
        button1.onclick = function() {
            lmsg.send('openModal_updIdx', {
                id: e.target.feature.properties.id,
                index: e.target.feature.properties.index,
                type: 2 //（1区域(region) 2 路段(road) 3 路口(cross)）
            });
        };
        var button2 = document.createElement('button');
        button2.classList.add('green_button');
        button2.innerHTML = '实时';
        button2.onclick = function() {
            lmsg.send('ldsszs', {
                params: 'road',
                isTime: '1',
                ID: e.target.feature.properties.id,
                name: e.target.feature.properties.name
            });
            console.log('传送成功-实时');
        };
        var button3 = document.createElement('button');
        button3.classList.add('green_button');
        button3.innerHTML = '档案';
        button3.onclick = function() {
            lmsg.send('ldjt', {
                params: 'road',
                isTime: '2',
                ID: e.target.feature.properties.id,
                name: e.target.feature.properties.name
            });
            console.log('传送成功-档案');
        };
        popupRoad.appendChild(p);
        popupRoad.appendChild(button1);
        popupRoad.appendChild(button2);
        popupRoad.appendChild(button3);
        lineLayer.bindPopup(popupRoad)
            .addTo(map);
    };

    function highlightFeature(e) {
        var l = e.target;
        l.setStyle({
            weight: 7,
            color: '#007D7D',
            dashArray: '',
            fillOpacity: 0.9
        });
    };

    function resetFeature(e) {
        lineLayer.resetStyle(e.target);
    };

    function eachLineFeature(feature, layer) {
        layer.on({
            click: panToBound,
            mouseover: highlightFeature,
            mouseout: resetFeature
        });
    };


    lineLayer = L.geoJson(GeoJsonLines, {
        style: function(feature) {
            var indexVal = feature.properties.index;
            if (indexVal <= 2) return greenLine;
            else if (indexVal > 2 && indexVal <= 4) return yellowLine;
            else if (indexVal > 4 && indexVal <= 6) return orangeLine;
            else if (indexVal > 6 && indexVal <= 8) return brownLine;
            else if (indexVal > 8) return redLine;
        },
        onEachFeature: eachLineFeature
    }).addTo(map);

    /* var popup2 = L.popup().setContent('<button  >1</button');
     lineLayer.bindPopup(popup2).addTo(map);*/
};

const areaLayer = function(data) {
    map.eachLayer((layer) => {
        if (layer.options.id != 'areaLayer' && layer.options.id != 'streetLayer')
            map.removeLayer(layer);
    });
    var GeoJsonRegion = data.geoJson;

    var greenRegion = {
        fillColor: "rgb(54,174,76)",
        fillOpacity: 1,
        color: "rgb(54,174,76)",
        weight: 5,
        opacity: 0.8
    };
    var yellowRegion = {
        fillColor: "rgb(106,183,45)",
        fillOpacity: 1,
        color: "rgb(106,183,45)",
        weight: 5,
        opacity: 0.8

    };
    var orangeRegion = {
        fillColor: "rgb(236,232,57)",
        fillOpacity: 1,
        color: "rgb(236,232,57)",
        weight: 5,
        opacity: 0.8

    };
    var brownRegion = {
        fillColor: "rgb(242,150,24)",
        fillOpacity: 1,
        color: "rgb(242,150,24)",
        weight: 5,
        opacity: 0.8
    };

    var redRegion = {
        fillColor: "rgb(228,26,22)",
        fillOpacity: 1,
        color: "rgb(228,26,22)",
        weight: 5,
        opacity: 0.8

    };
    var regionLayer;

    function panToBound(e) {
        map.fitBounds(e.target.getBounds());
        var popupArea = document.createElement('div');
        var p = document.createElement('p');
        p.innerHTML = '路段名称:' + e.target.feature.properties.name
        var button1 = document.createElement('button');
        button1.classList.add('green_button');
        button1.innerHTML = '更新';
        button1.onclick = function() {
            lmsg.send('openModal_updIdx', {
                id: e.target.feature.properties.id,
                index: e.target.feature.properties.index,
                type: 1 //（1区域(region) 2 路段(road) 3 路口(cross)）
            });
        };
        var button2 = document.createElement('button');
        button2.classList.add('green_button');
        button2.innerHTML = '实时';
        button2.onclick = function() {
            lmsg.send('qysszs', {
                params: 'area',
                isTime: '1',
                ID: e.target.feature.properties.id,
                name: e.target.feature.properties.name
            });
            console.log('传送成功-实时');
        };
        var button3 = document.createElement('button');
        button3.classList.add('green_button');
        button3.innerHTML = '档案';
        button3.onclick = function() {
            lmsg.send('qyjt', {
                params: 'area',
                isTime: '2',
                ID: e.target.feature.properties.id,
                name: e.target.feature.properties.name
            });
            console.log('传送成功-档案');
        };
        popupArea.appendChild(p);
        popupArea.appendChild(button1);
        popupArea.appendChild(button2);
        popupArea.appendChild(button3);
        regionLayer.bindPopup(popupArea)
            .addTo(map);
    };

    function highlightFeature(e) {
        var l = e.target;
        l.setStyle({
            weight: 5,
            color: '#007D7D',
            dashArray: '',
            fillOpacity: 0.9
        });
    };

    function resetFeature(e) {
        regionLayer.resetStyle(e.target);
    };

    function eachRegionFeature(feature, layer) {
        layer.on({
            click: panToBound,
            mouseover: highlightFeature,
            mouseout: resetFeature
        });
    };


    regionLayer = L.geoJson(GeoJsonRegion, {
        style: function(feature) {
            var indexVal = feature.properties.index;
            if (indexVal <= 2) return greenRegion;
            else if (indexVal > 2 && indexVal <= 4) return yellowRegion;
            else if (indexVal > 4 && indexVal <= 6) return orangeRegion;
            else if (indexVal > 6 && indexVal <= 8) return brownRegion;
            else if (indexVal > 8) return redRegion;
        },
        onEachFeature: eachRegionFeature
    });
    var popup3 = L.popup().setContent("hello, this is a popup REGION");
    regionLayer.bindPopup(popup3).addTo(map);

};


export const playback = (a) => {
    let markerPlayBack = lmap.geoTime(a, {
        map: map,
        duration: 1000
    });
    return markerPlayBack;
};

const formatDateTime = (data, ref) => {
    var formatedTime = null;
    if (data) {
        var d = new Date(data);
        var year = d.getFullYear();
        var day = d.getDate();
        day = day < 10 ? '0' + day : day;
        var month = d.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        var hour = d.getHours();
        hour = hour < 10 ? '0' + hour : hour;
        var minute = d.getMinutes();
        minute = minute < 10 ? '0' + minute : minute;
        var second = d.getSeconds();
        second = second < 10 ? '0' + second : second;
        if (ref == 0)
            formatedTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        else if (ref == 1)
            formatedTime = year + '-' + month + '-' + day;
        else
            formatedTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    } else
        formatedTime = null;
    return formatedTime;
}

export const displayUniLayer = (ref, data) => {
    map.eachLayer((layer) => {
        if (layer.options.id !== "streetLayer") {
            map.removeLayer(layer);
        }
    });
    var param = null,
        _APIpath = null,
        featurecollectiondata = null,
        specialpointlayer = null,
        clickPanBound = null,
        specialpopup = null,
        specialstyle = null,
        centerPointLogo = null;


    if (ref == 'fudongche') {
        _APIpath = "/trafficindex_map/floatCar.json";
        var fudongcheIcon = L.icon({
            iconUrl: _imagePath + '/local_taxi.png',
            iconSize: [20, 20],
            iconAnchor: [0, 0],
            popupAnchor: [20, 0]
        });
        specialpointlayer = (feature, latlng) => {
            //var indexVal = feature.properties.index;
            return L.marker(latlng, {
                icon: fudongcheIcon
            });
        }
    } else if (ref == 'shigong') {
        _APIpath = "/trafficindex_map/roadConstruction.json";
        specialstyle = (feature) => {
            return {
                fillColor: '#007D7D',
                weight: 8,
                opacity: 1,
                color: 'green',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }
        var icon = L.icon({
            iconUrl: _imagePath + '/construction.png',
            iconSize: [30, 30],
            iconAnchor: [0, 0],
            popupAnchor: [10, 0]
        });
        centerPointLogo = (feature, latlng) => {
            return L.marker(latlng, {
                icon: icon
            });
        }

    } else if (ref == 'guanzhi') {
        _APIpath = "/trafficindex_map/trafficControl.json";
        specialstyle = (feature) => {
            return {
                fillColor: '#EEC900',
                weight: 8,
                opacity: 1,
                color: 'red',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }
        var icon = L.icon({
            iconUrl: _imagePath + '/traffic_control.png',
            iconSize: [30, 30],
            iconAnchor: [0, 0],
            popupAnchor: [10, 0]
        });
        centerPointLogo = (feature, latlng) => {
            return L.marker(latlng, {
                icon: icon
            });
        }
    } else if (ref == 'shigu') {
        _APIpath = "/trafficindex_map/trafficAccident.json";
        specialstyle = (feature) => {
            return {
                fillColor: '#D2691E',
                weight: 2,
                opacity: 1,
                color: 'yellow',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }
        var icon = L.icon({
            iconUrl: _imagePath + '/accident.png',
            iconSize: [30, 30],
            iconAnchor: [0, 0],
            popupAnchor: [10, 0]
        });
        centerPointLogo = (feature, latlng) => {
            return L.marker(latlng, {
                icon: icon
            });
        }
    } else if (ref == 'yongdu_cross') {
        _APIpath = "/trafficindex_map/cfydCross.json";
        var yongduCrossIcon = L.icon({
            iconUrl: _imagePath + '/Traffic_Warning.png',
            iconSize: [20, 20],
            iconAnchor: [0, 0],
            popupAnchor: [20, 0]
        });
        specialpointlayer = (feature, latlng) => {
            //var indexVal = feature.properties.index;
            return L.marker(latlng, {
                icon: yongduCrossIcon
            });
        }
        var date2Java_date = null;
        if (data.flag == 3) {
            date2Java_date = data.date;
        } else if (data.flag == 2) {
            date2Java_date = data.date.replace(/-/g, "").substring(0, 6);
        } else if (data.flag == 1) {
            date2Java_date = data.date.replace(/-/g, "").replace(/,/g, "&");
        } else if (data.flag == 0) {
            date2Java_date = data.date.replace(/-/g, "");
        }
        param = {
            flag: data.flag,
            date: date2Java_date
        }
    } else if (ref == 'yongdu_road') {
        _APIpath = "/trafficindex_map/cfydRoad.json";
        specialstyle = (feature) => {
            return {
                fillColor: '#D2691E',
                weight: 8,
                opacity: 1,
                color: 'yellow',
                fillOpacity: 0.7
            };
        }
        var date2Java_date = null;
        if (data.flag == 3) {
            date2Java_date = data.date;
        } else if (data.flag == 2) {
            date2Java_date = data.date.replace(/-/g, "").substring(0, 6);
        } else if (data.flag == 1) {
            date2Java_date = data.date.replace(/-/g, "").replace(/,/g, "&");
        } else if (data.flag == 0) {
            date2Java_date = data.date.replace(/-/g, "");
        }
        param = {
            flag: data.flag,
            date: date2Java_date
        }

    } else if (ref == 'jiari_cross') {
        _APIpath = "/trafficindex_map/holiday.json";
        specialpointlayer = (feature, latlng) => {
            var indexVal = feature.properties.index;
            var yongduCrossIcon = lmap.icon({
                iconSize: [18, 18],
                color: (indexVal >= 0 && indexVal < 2) ? 'rgb(54,174,76)' : (indexVal >= 2 && indexVal < 4) ? 'rgb(106,183,45)' : (indexVal >= 4 && indexVal < 6) ? 'rgb(236,232,57)' : (indexVal >= 6 && indexVal < 8) ? 'rgb(242,150,24)' : (indexVal >= 8) ? 'rgb(228,26,22)' : 'LightSalmon'
            });
            return L.marker(latlng, {
                icon: yongduCrossIcon
            });
        }
        param = {
            type: 'cross',
            qyType: data.qyType,
            date: data.date
        }
    } else if (ref == 'jiari_road') {
        _APIpath = "/trafficindex_map/holiday.json";
        specialstyle = (feature) => {
            var indexVal = feature.properties.index;
            return {
                fillColor: (indexVal >= 0 && indexVal < 2) ? 'rgb(54,174,76)' : (indexVal >= 2 && indexVal < 4) ? 'rgb(106,183,45)' : (indexVal >= 4 && indexVal < 6) ? 'rgb(236,232,57)' : (indexVal >= 6 && indexVal < 8) ? 'rgb(242,150,24)' : (indexVal >= 8) ? 'rgb(228,26,22)' : 'LightSalmon',
                weight: 6,
                opacity: 0.8,
                color: (indexVal >= 0 && indexVal < 2) ? 'rgb(54,174,76)' : (indexVal >= 2 && indexVal < 4) ? 'rgb(106,183,45)' : (indexVal >= 4 && indexVal < 6) ? 'rgb(236,232,57)' : (indexVal >= 6 && indexVal < 8) ? 'rgb(242,150,24)' : (indexVal >= 8) ? 'rgb(228,26,22)' : 'LightSalmon',
                fillOpacity: 0.9
            };
        }
        param = {
            type: 'road',
            qyType: data.qyType,
            date: data.date
        }
    } else if (ref == 'jiari_zone') {
        _APIpath = "/trafficindex_map/holiday.json";
        specialstyle = (feature) => {
            var indexVal = feature.properties.index;
            return {
                fillColor: (indexVal >= 0 && indexVal < 2) ? 'rgb(54,174,76)' : (indexVal >= 2 && indexVal < 4) ? 'rgb(106,183,45)' : (indexVal >= 4 && indexVal < 6) ? 'rgb(236,232,57)' : (indexVal >= 6 && indexVal < 8) ? 'rgb(242,150,24)' : (indexVal >= 8) ? 'rgb(228,26,22)' : 'LightSalmon',
                weight: 6,
                opacity: 0.8,
                color: (indexVal >= 0 && indexVal < 2) ? 'rgb(54,174,76)' : (indexVal >= 2 && indexVal < 4) ? 'rgb(106,183,45)' : (indexVal >= 4 && indexVal < 6) ? 'rgb(236,232,57)' : (indexVal >= 6 && indexVal < 8) ? 'rgb(242,150,24)' : (indexVal >= 8) ? 'rgb(228,26,22)' : 'LightSalmon',
                fillOpacity: 0.9
            };
        }
        param = {
            type: 'region',
            qyType: data.qyType,
            date: data.date
        }
    }

    Ds.DataService(_APIpath, param, (resp) => {
        featurecollectiondata = resp.aaData;
        if (!featurecollectiondata.features || featurecollectiondata.features.length == 0) message.error('没有查询到相应地图数据！');
    }, (e) => {
        console.log(e);
        message.error("后台传输错误", 3);
    });

    clickPanBound = (e) => {
        var eachFeatureID = e.target.feature.properties.id;
        var sendparamID = {
            "xh": eachFeatureID
        };
        var popupData = null;
        if (ref == 'fudongche') {
            Ds.DataService("/trafficindex_floatCargp/listGetFdcarByCarid.json", sendparamID, (resp) => {
                popupData = resp.aaData;
            }, (e) => {
                message.error('后台传输错误', 3);
                console.log(e)
            });

            var floatcartype1 = popupData.floatcartype = 1 ? '公交车' : popupData.floatcartype = 2 ? '出租车' : '其他';
            specialpopup = L.popup().setContent(
                "车牌照: " + popupData.carid + '<br/>' +
                "车朝向: " + popupData.direction + '<br/>' +
                "浮动车类型: " + floatcartype1 + '<br/>' +
                "GPS时间: " + formatDateTime(popupData.gpsDate, 0) + '<br/>' +
                "经度: " + popupData.gpsJd + '<br/>' +
                "纬度: " + popupData.gpsWd + '<br/>' +
                "浮动车速度: " + popupData.velocity + ' km/h' + '<br/>');

        } else if (ref == 'jiari_zone' || ref == 'jiari_cross' || ref == 'jiari_road') {
            specialpopup = L.popup().setContent('名称：' + e.target.feature.properties.name + '<br/>' + '指数:' + e.target.feature.properties.index)
        }
        SpecificLayer.bindPopup(specialpopup).addTo(map);

        if (specialpointlayer) {
            if (map.getZoom() <= 16) {
                map.setZoomAround(e.target._latlng, 17);
            } else map.panTo(e.target._latlng);
        } else map.fitBounds(e.target.getBounds());
    }

    var eachUniFeature = (feature, layer) => {
        layer.on({
            click: clickPanBound,
            //mouseover: highlightFeature,
            //mouseout: resetFeature
        });
    };
    var SpecificLayer = L.geoJson(featurecollectiondata, {
        style: specialstyle,
        pointToLayer: specialpointlayer,
        onEachFeature: eachUniFeature
    });


    var displayDetails = (e) => {
        var eachFeatureID = e.target.feature.properties.id;
        var sendparamID = {
            "id": eachFeatureID
        };
        var popupData = null,
            popup_spec = null;
        if (ref == "shigong") {
            Ds.DataService("/trafficindex_RoadConst/gotoBJtzsRoadconstruction.json", sendparamID, (resp) => {
                popupData = resp.aaData;
            }, (e) => {
                message.error('后台传输错误', 3);
                console.log(e);
            });
            var construType = popupData.objecttype == 0 ? '路口' : popupData.objecttype == 1 ? '路段' : '其他';
            var construStatus = popupData.state == 0 ? '施工前' : popupData.state == 1 ? '施工中' : popupData.state == 2 ? '施工完成' : '其他';
            popup_spec = L.popup().setContent(
                "施工单位: " + popupData.company + '<br/>' +
                "联系人: " + popupData.contact + '<br/>' +
                "施工类别: " + construType + '<br/>' +
                "位置描述: " + popupData.locationdesc + '<br/>' +
                "施工名称: " + popupData.objectname + '<br/>' +
                "施工原因: " + popupData.reason + '<br/>' +
                "当前状态: " + construStatus + '<br/>' +
                "开始时间: " + formatDateTime(popupData.startdate, 1) + '<br/>' +
                "结束时间: " + formatDateTime(popupData.enddate, 1) + '<br/>' +
                "联系电话: " + popupData.telephone + '<br/>');
        } else if (ref == "guanzhi") {
            Ds.DataService("/trafficindex_trafficControl/gotoBJtzsTrafficcontrol.json", sendparamID, (resp) => {
                popupData = resp.aaData;
            }, (e) => {
                message.error('后台传输错误', 3);
                console.log(e);
            });
            var controlStatus = popupData.state == 0 ? '未申请' : popupData.state == 1 ? '已申请' : popupData.state == 2 ? '申请中' : '其他';
            var controlBelong = popupData.area == 0 ? '指挥中心' : popupData.area == 1 ? '管辖一区' : popupData.area == 2 ? '管辖二区' : '其他';
            var controlType = popupData.type == 0 ? '中高考' : popupData.type == 1 ? '节假日' : popupData.type == 2 ? '大型活动' : popupData.type == 3 ? '禁货' : popupData.type == 4 ? '禁大客' : popupData.type == 5 ? '禁危险品车辆' : popupData.type == 6 ? '禁摩托车' : popupData.type == 7 ? '路口禁止转向' : popupData.type == 8 ? '单行道路' : popupData.type == 9 ? '其他' : '其他';
            popup_spec = L.popup().setContent(
                "申请时间: " + formatDateTime(popupData.applydate, 1) + '<br/>' +
                "开始时间: " + formatDateTime(popupData.startdate, 1) + '<br/>' +
                "预计结束时间: " + formatDateTime(popupData.planenddate, 1) + '<br/>' +
                "实际结束时间: " + formatDateTime(popupData.actualenddate, 1) + '<br/>' +
                "当前状态: " + controlStatus + '<br/>' +
                "所属辖区: " + controlBelong + '<br/>' +
                "责任单位: " + popupData.liablecompany + '<br/>' +
                "责任人: " + popupData.liableperson + '<br/>' +
                "联系电话: " + popupData.telephone + '<br/>' +
                "位置描述: " + popupData.locationdesc + '<br/>' +
                "管制名称: " + popupData.objectname + '<br/>' +
                "管制类型: " + controlType + '<br/>' +
                "管制说明: " + popupData.remark + '<br/>');
        } else if (ref == "shigu") {
            Ds.DataService("/trafficindex_trafficAccident/gotoBJtzsTrafficaccident.json", sendparamID, (resp) => {
                popupData = resp.aaData;
            }, (e) => {
                message.error('后台传输错误', 3);
                console.log(e);
            });
            var accidentType = popupData.accidenttype == -1 ? '全部' : popupData.accidenttype == 0 ? '酒后驾车' : popupData.accidenttype == 1 ? '逆行' : popupData.accidenttype == 2 ? '违法吊车' : popupData.accidenttype == 3 ? '违法变道' : popupData.accidenttype == 4 ? '违法超载' : popupData.accidenttype == 5 ? '无证驾驶' : popupData.accidenttype == 6 ? '违反交通信号' : popupData.accidenttype == 7 ? '超速' : popupData.accidenttype == 8 ? '其他' : '其他';
            var accidentLevel = popupData.accidentlevel == -1 ? '全部' : popupData.accidentlevel == 0 ? '轻微事故' : popupData.accidentlevel == 1 ? '一般事故' : popupData.accidentlevel == 2 ? '重大事故' : popupData.accidentlevel == 3 ? '特大事故' : '其他';
            popup_spec = L.popup().setContent(
                "事故等级: " + accidentLevel + '<br/>' +
                "事故类型: " + accidentType + '<br/>' +
                "发生位置: " + popupData.locationdesc + '<br/>' +
                "发生时间: " + formatDateTime(popupData.occurrencedate, 1) + '<br/>' +
                "接报人: " + popupData.recipientperson + '<br/>' +
                "事故描述: " + popupData.remark + '<br/>' +
                "上报人: " + popupData.reportperson + '<br/>' +
                "上报人联系方式: " + popupData.reportpersoncontact + '<br/>');
        }
        if (map.getZoom() <= 15) {
            map.setZoomAround(e.target._latlng, 15);
        } else map.panTo(e.target._latlng);

        centerPointLayer.bindPopup(popup_spec).addTo(map);

    }
    var showLayer_spec = () => {
        map.addLayer(SpecificLayer);
    }
    var hideLayer_spec = () => {
        map.removeLayer(SpecificLayer);
    }

    var showHideLayer = (feature, layer) => {
        layer.on({
            click: displayDetails,
            mouseout: hideLayer_spec,
            mouseover: showLayer_spec
        });
    }
    map.addLayer(SpecificLayer);
    if (ref == 'shigu' || ref == 'shigong' || ref == 'guanzhi') {
        map.eachLayer((layer) => {
            if (layer.options.id !== "streetLayer") {
                map.removeLayer(layer);
            }
        });
        var centerPointsTotal = [];
        meta.featureEach(featurecollectiondata, (feature) => {
            var centerPoint1 = turf.centroid(feature);
            var centerPoint = turf.point(centerPoint1.geometry.coordinates, feature.properties)
            centerPointsTotal.push(centerPoint);
        });
        var centerCollection = turf.featureCollection(centerPointsTotal);
        var centerPointLayer = L.geoJson(centerCollection, {
            pointToLayer: centerPointLogo,
            onEachFeature: showHideLayer
        });
        map.addLayer(centerPointLayer);
    }
}

var taxiInterval = null,
    taxiRoute = null;

export const trackingTaxi = (params) => {
    if (params) {
        var sendtaxiparams = {
            id: params.id,
            date: params.time
        };
        var taxiInterval = null,
            taxiRoute = null;
        taxiRoute = Ds.DataService('/trafficindex_map/track.json', sendtaxiparams, (resp) => {
            if (!resp.aaData || !resp.aaData.feature || resp.aaData.feature.length == 0) {
                message.warning('没有查询到浮动车信息', 3);
                return;
            } else {
                map.eachLayer((layer) => {
                    if (layer.options.id !== "streetLayer") {
                        map.removeLayer(layer);
                    }
                });
                var fudongcheIcon = L.icon({
                    iconUrl: _imagePath + '/local_taxi.png',
                    iconSize: [20, 20], // size of the icon
                    iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
                    popupAnchor: [20, 0] // point from which the popup should open relative to the iconAnchor
                });
                var taxipointlayer = (feature, latlng) => {
                    //var indexVal = feature.properties.index;
                    return L.marker(latlng, {
                        icon: fudongcheIcon
                    });
                }
                var taxijson = resp.aaData;
                var routestyle = (feature) => {
                    return {
                        fillColor: '#2db7f5',
                        weight: 8,
                        opacity: 1,
                        color: '#2db7f5',
                        dashArray: '3',
                        fillOpacity: 0.7
                    };
                }
                var taxitracklayer = L.geoJson(taxijson, {
                    style: routestyle,
                    pointToLayer: taxipointlayer

                });
                map.addLayer(taxitracklayer);
            }

        }, (e) => {
            console.log(e);
            message.error("后台传输错误", 5);
        });

        /*  taxiInterval = setInterval(() => {
              taxiRoute();
          }, 61000);*/
        return taxiRoute;

    } else message.error("无法追踪", 3);
}


export const stopTrackingTaxi = () => {
    clearInterval(taxiInterval);
    map.eachLayer((layer) => {
        if (layer.options.id !== "streetLayer") {
            map.removeLayer(layer);
        }
    });
}

export const changeConfigLayer = (data, ref) => {;
    map.eachLayer((layer) => {
        if (layer.options.id !== "streetLayer") {
            map.removeLayer(layer);
        }
    });
    var ChangeLayerData = data;
    var onClickLayer = (e) => {

        if (e.target.options.color !== '#696969') {
            e.target.setStyle({
                weight: 7,
                color: '#696969',
                dashArray: '',
                fillOpacity: 0.9
            });
        } else {
            var color1;
            if (e.target.feature.properties.rgb)
                color1 = 'rgba(' + e.target.feature.properties.rgb + ')';
            else
                color1 = 'LightSalmon';
            e.target.setStyle({
                fillColor: color1,
                fillOpacity: 1,
                color: color1,
                weight: 7,
                opacity: 1
            });
        }

        lmsg.send('openChangeConfigPanel', {
            ref: ref,
            id: e.target.feature.properties.id,
            name: e.target.feature.properties.name,
            color: e.target.feature.properties.rgb
        });

    }
    var showName = (e) => {
        var popup = L.popup().setContent('名称：' + e.target.feature.properties.name);
        e.target.bindPopup(popup, {
            offset: [0, -30]
        }).openPopup();
    }
    var closePopup = (e) => {
        //ChangeConfigLayer.resetStyle(e.target);
        e.target.closePopup();
    }
    var ChangeConfigLayer = L.geoJson(ChangeLayerData, {
        style: function(feature) {
            var color1 = null;
            if (feature.properties.rgb) {
                color1 = 'rgba(' + feature.properties.rgb + ')';
            } else
                color1 = 'LightSalmon';
            var styles = {
                fillColor: color1,
                fillOpacity: 1,
                color: color1,
                weight: 7,
                opacity: 1
            };
            return styles;
        },
        onEachFeature: (feature, layer) => {
            layer.on({
                click: onClickLayer,
                mouseover: showName,
                mouseout: closePopup
            });
        }
    }).addTo(map);


}


export const displayConfigLayer = (data) => {
    var Config_crossGeojson = null,
        Config_roadGeojson = null,
        Config_zoneGeojson = null,
        ConfigCrossLayer = null,
        ConfigRoadLayer = null,
        ConfigZoneLayer = null;
    if (data.cross)
        Config_crossGeojson = data.cross;
    if (data.road)
        Config_roadGeojson = data.road;
    if (data.zone)
        Config_zoneGeojson = data.zone;
    map.eachLayer((layer) => {
        if (layer.options.id !== "streetLayer") {
            map.removeLayer(layer);
        }
    });
    var CrossMarker = lmap.icon({
        iconSize: [15, 15],
        color: 'rgba(243, 106, 90, 0.5)'
    });
    var RoadLine = {
        "color": "#32c5d2",
        "weight": 8,
        "opacity": 0.5
    };

    if (Config_crossGeojson) {
        ConfigCrossLayer = L.geoJson(Config_crossGeojson, {
            pointToLayer: function(feature, latlng) {
                    var indexVal = feature.properties.index;
                    return L.marker(latlng, {
                        icon: CrossMarker
                    });
                }
                //onEachFeature: eachPointFeature
        }).addTo(map);
    }

    if (Config_roadGeojson) {
        ConfigRoadLayer = L.geoJson(Config_roadGeojson, {
            style: function(feature) {
                return RoadLine;
            }
        }).addTo(map);
    }
    if (Config_zoneGeojson) {
        ConfigZoneLayer = L.geoJson(Config_zoneGeojson, {
            style: function(feature) {
                var ZoneRegion = {
                    fillColor: 'rgba(' + feature.properties.rgb + ')',
                    fillOpacity: 1,
                    color: 'rgba(' + feature.properties.rgb + ')',
                    weight: 3,
                    opacity: 1
                };
                return ZoneRegion;
            }
        }).addTo(map);
    }

}

export const displayConfigLayer_road = (data) => {
    map.eachLayer((layer) => {
        if (layer.options.id != 'streetLayer')
            map.removeLayer(layer);
    });
    var GeoJsonLines = data;

    let orangeLine = {
        "color": "#FFA500",
        "weight": 8,
        "opacity": 0.8
    };

    var lineLayer, popup2;

    function panToBound(e) {

        map.fitBounds(e.target.getBounds());
    };

    function highlightFeature(e) {
        var l = e.target;
        l.setStyle({
            weight: 9,
            color: '#007D7D',
            dashArray: '',
            fillOpacity: 0.9
        });
        popup2 = L.popup().setContent(l.feature.properties.name);
        l.bindPopup(popup2).openPopup();
    };

    function resetFeature(e) {
        lineLayer.resetStyle(e.target);
        e.target.closePopup();
    };

    function eachLineFeature(feature, layer) {
        layer.on({
            click: panToBound,
            mouseover: highlightFeature,
            mouseout: resetFeature
        });
    };


    lineLayer = L.geoJson(GeoJsonLines, {
        style: function(feature) {
            return orangeLine;
        },
        onEachFeature: eachLineFeature
    }).addTo(map);
    //lineLayer.bindPopup(popup2).addTo(map);


};

export const displayCommonLayer = (data) => {
    map.eachLayer((layer) => {
        if (layer.options.id != 'streetLayer')
            map.removeLayer(layer);
    });
    var GeoJson = data;

    let orangeLine = {
        "color": "#FFA500",
        "weight": 8,
        "opacity": 0.8
    };
    let Marker = lmap.icon({
        iconSize: [15, 15],
        color: '#7FFF00'
    });
    var CommonLayer;

    CommonLayer = L.geoJson(GeoJson, {
        style: function(feature) {
            return orangeLine;
        },
        pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
                    icon: Marker
                });
            }
            //onEachFeature: eachLineFeature
    }).addTo(map);
    //lineLayer.bindPopup(popup2).addTo(map);
};

export const clearLayer = () => {
    map.eachLayer((layer) => {
        if (layer.options.id != 'streetLayer')
            map.removeLayer(layer);
    });
    lmap.removeEchartsLayer();
}