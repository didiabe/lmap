import L from 'leaflet';
import LE from 'esri-leaflet';
import * as turf from '@turf/turf';
import * as meta from '@turf/meta';
import * as lmap from '../libs/lmap';
import taxi_img from '../images/local_taxi.png';
import construction_img from '../images/construction.png';
import accident_img from '../images/accident.png';
import control_img from '../images/traffic_control.png';
import * as lmsg from '../libs/lmsg';
import * as Ds from '../libs/DataService';
import traffic_warning_img from '../images/Traffic_Warning.png';

export function addGracLayer(layerName, data) {
    console.log(data);
    switch (layerName.id) {
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
        color: '#7FFF00'
    });
    var yellowMarker = lmap.icon({
        iconSize: [15, 15],
        color: '#EEC900'
    });
    var orangeMarker = lmap.icon({
        iconSize: [15, 15],
        color: '#EE9A00'
    });
    var brownMarker = lmap.icon({
        iconSize: [15, 15],
        color: '#D2691E'
    });
    var redMarker = lmap.icon({
        iconSize: [15, 15],
        color: '#CD0000'
    });

    var pointMarkerOption = null;

    var pointLayer;



    function panTotarget(e) {
        if (map.getZoom() <= 16) {
            map.setZoomAround(e.target._latlng, 17);
        } else map.panTo(e.target._latlng);
        var popupCross = $('<div/>');
        popupCross.append($('<p>   路口名称:  ' + e.target.feature.properties.name + '</p>'));
        popupCross.append($('<button class="green_button">更新</button>').click(function() {
            lmsg.send('openModal_updIdx', {
                id: e.target.feature.properties.id,
                index: e.target.feature.properties.index,
                type: 3 //（1区域(region) 2 路段(road) 3 路口(cross)）
            });
        }));
        popupCross.append($('<button class="green_button">实时</button>').click(function() {
            console.log(e.target.feature.properties.id);
            lmsg.send('lksszs', {
                params: 'cross',
                isTime: '1',
                ID: e.target.feature.properties.id,
                name: e.target.feature.properties.name
            });
        }));
        popupCross.append($('<button class="green_button">档案</button>').click(function() {
            lmsg.send('lkjt', {
                params: 'cross',
                isTime: '2',
                ID: e.target.feature.properties.id,
                name: e.target.feature.properties.name
            });
        }));

        pointLayer.bindPopup(popupCross[0])
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
            if (indexVal > 0 && indexVal <= 2) pointMarkerOption = greenMarker;
            else if (indexVal > 2 && indexVal <= 4) pointMarkerOption = yellowMarker;
            else if (indexVal > 4 && indexVal <= 6) pointMarkerOption = orangeMarker;
            else if (indexVal > 6 && indexVal <= 8) pointMarkerOption = brownMarker;
            else if (indexVal > 8) pointMarkerOption = redMarker;

            return L.marker(latlng, {
                icon: pointMarkerOption
            });
        },
        onEachFeature: eachPointFeature

    }).addTo(map);

};

const roadLayer = function(data) {
    console.log('data', data)
    map.eachLayer((layer) => {
        if (layer.options.id != 'roadLayer' && layer.options.id != 'streetLayer')
            map.removeLayer(layer);
    });
    var GeoJsonLines = data.geoJson;
    var greenLine = {
        "color": "#7FFF00",
        "weight": 9,
        "opacity": 0.8
    };
    var yellowLine = {
        "color": "#FFEB00",
        "weight": 9,
        "opacity": 0.8
    };
    var orangeLine = {
        "color": "#FFA500",
        "weight": 9,
        "opacity": 0.8
    };
    var brownLine = {
        "color": "#CD3333",
        "weight": 9,
        "opacity": 0.8
    };

    var redLine = {
        "color": "#FF0000",
        "weight": 9,
        "opacity": 0.8
    };
    var lineLayer;

    function panToBound(e) {
        //console.log(e.target);
        map.fitBounds(e.target.getBounds());
        var popupRoad = $('<div/>');
        popupRoad.append($('<p>   路段名称:  ' + e.target.feature.properties.name + '</p>'));
        popupRoad.append($('<button class="green_button">更新</button>').click(function() {
            lmsg.send('openModal_updIdx', {
                id: e.target.feature.properties.id,
                index: e.target.feature.properties.index,
                type: 2 //（1区域(region) 2 路段(road) 3 路口(cross)）
            });
        }));
        popupRoad.append($('<button class="green_button">实时</button>').click(function() {
            ///console.log(e.target);
            lmsg.send('ldsszs', {
                params: 'road',
                isTime: '1',
                ID: e.target.feature.properties.id,
                name: e.target.feature.properties.name
            });
        }));
        popupRoad.append($('<button class="green_button">档案</button>').click(function() {
            lmsg.send('ldjt', {
                params: 'road',
                isTime: '2',
                ID: e.target.feature.properties.id,
                name: e.target.feature.properties.name
            });
        }));

        lineLayer.bindPopup(popupRoad[0])
            .addTo(map);
    };

    function highlightFeature(e) {
        var l = e.target;
        l.setStyle({
            weight: 9,
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
    console.log(data);

    var GeoJsonRegion = data.geoJson;

    var greenRegion = {
        fillColor: "#7FFF00",
        fillOpacity: 1,
        color: "#fff",
        weight: 5,
        opacity: 0.8
    };
    var yellowRegion = {
        fillColor: "#FFEB00",
        fillOpacity: 1,
        color: "#fff",
        weight: 5,
        opacity: 0.8

    };
    var orangeRegion = {
        fillColor: "#FFA500",
        fillOpacity: 1,
        color: "#fff",
        weight: 5,
        opacity: 0.8

    };
    var brownRegion = {
        fillColor: "#CD3333",
        fillOpacity: 1,
        color: "#fff",
        weight: 5,
        opacity: 0.8
    };

    var redRegion = {
        fillColor: "#FF0000",
        fillOpacity: 1,
        color: "#fff",
        weight: 5,
        opacity: 0.8

    };
    var regionLayer;

    function panToBound(e) {
        map.fitBounds(e.target.getBounds());
        var popupArea = $('<div/>');
        popupArea.append($('<p>   区域名称:   ' + e.target.feature.properties.name + '</p>'))
        popupArea.append($('<button class="green_button">更新</button>').click(function() {
            lmsg.send('openModal_updIdx', {
                id: e.target.feature.properties.id,
                index: e.target.feature.properties.index,
                type: 1 //（1区域(region) 2 路段(road) 3 路口(cross)）
            });

        }));
        popupArea.append($('<button class="green_button">实时</button>').click(function() {
            //console.log(e.target.feature.properties.id);
            lmsg.send('qysszs', {
                params: 'area',
                isTime: '1',
                ID: e.target.feature.properties.id,
                name: e.target.feature.properties.name
            });
        }));
        popupArea.append($('<button class="green_button">档案</button>').click(function() {
            lmsg.send('qyjt', {
                params: 'area',
                isTime: '2',
                ID: e.target.feature.properties.id,
                name: e.target.feature.properties.name
            });
        }));

        regionLayer.bindPopup(popupArea[0])
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

export const displayUniLayer = (ref, data) => {
    console.log(ref);
    console.log(data);
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
            iconUrl: taxi_img,
            iconSize: [20, 20], // size of the icon
            iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
            popupAnchor: [20, 0] // point from which the popup should open relative to the iconAnchor
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
            iconUrl: construction_img,
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
            iconUrl: control_img,
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
            iconUrl: accident_img,
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
            iconUrl: traffic_warning_img,
            iconSize: [20, 20], // size of the icon
            iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
            popupAnchor: [20, 0] // point from which the popup should open relative to the iconAnchor
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
        var yongduCrossIcon = L.icon({
            iconUrl: traffic_warning_img,
            iconSize: [20, 20], // size of the icon
            iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
            popupAnchor: [20, 0] // point from which the popup should open relative to the iconAnchor
        });
        specialpointlayer = (feature, latlng) => {
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
            return {
                fillColor: '#D2691E',
                weight: 8,
                opacity: 1,
                color: 'blue',
                fillOpacity: 0.7
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
            return {
                fillColor: '#D2691E',
                weight: 8,
                opacity: 1,
                color: 'blue',
                fillOpacity: 0.7
            };
        }
        param = {
            type: 'region',
            qyType: data.qyType,
            date: data.date
        }
    }

    Ds.DataService(_APIpath, param, (resp) => {
        console.log(resp.aaData);
        featurecollectiondata = resp.aaData;
    }, (e) => {
        console.log(e);
        alert("后台传输错误");
    });

    clickPanBound = (e) => {
        var eachFeatureID = e.target.feature.properties.id;
        var sendparamID = {
            "xh": eachFeatureID
        };
        console.log(sendparamID);
        var popupData = null;
        if (ref == 'fudongche') {
            Ds.DataService("/trafficindex_floatCargp/listGetFdcarByCarid.json", sendparamID, (resp) => {
                console.log(resp);
                popupData = resp.aaData;
            }, (e) => {
                alert('后台传输错误');
                console.log(e)
            });
            specialpopup = L.popup().setContent(
                "车牌照: " + popupData.carid + '<br/>' +
                "车朝向: " + popupData.direction + '<br/>' +
                "浮动车类型: " + popupData.floatcartype + '<br/>' +
                "GPS时间: " + popupData.gpsDate + '<br/>' +
                "经度: " + popupData.gpsJd + '<br/>' +
                "纬度: " + popupData.gpsWd + '<br/>' +
                "浮动车速度: " + popupData.velocity + '<br/>');

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
            Ds.DataService("/trafficindex_trafficAccident/gotoBJtzsRoadconstruction.json", sendparamID, (resp) => {
                console.log(resp);
                popupData = resp.aaData;
            }, (e) => {
                alert('后台传输错误');
                console.log(e)
            });
            popup_spec = L.popup().setContent(
                "施工单位: " + popupData.company + '<br/>' +
                "联系人: " + popupData.contact + '<br/>' +
                "施工类别: " + popupData.objecttype + '<br/>' +
                "位置描述: " + popupData.locationdesc + '<br/>' +
                "施工名称: " + popupData.objectname + '<br/>' +
                "施工原因: " + popupData.reason + '<br/>' +
                "当前状态: " + popupData.state + '<br/>' +
                "开始时间: " + popupData.startdate + '<br/>' +
                "结束时间: " + popupData.enddate + '<br/>' +
                "联系电话: " + popupData.telephone + '<br/>');
        } else if (ref == "guanzhi") {
            Ds.DataService("/trafficindex_trafficControl/gotoBJtzsTrafficcontrol.json", sendparamID, (resp) => {
                console.log(resp);
                popupData = resp.aaData;
            }, (e) => {
                alert('后台传输错误');
                console.log(e)
            });
            popup_spec = L.popup().setContent(
                "申请时间: " + popupData.applydate + '<br/>' +
                "开始时间: " + popupData.startdate + '<br/>' +
                "预计结束时间: " + popupData.planenddate + '<br/>' +
                "实际结束时间: " + popupData.actualenddate + '<br/>' +
                "当前状态: " + popupData.state + '<br/>' +
                "所属辖区: " + popupData.area + '<br/>' +
                "责任单位: " + popupData.liablecompany + '<br/>' +
                "责任人: " + popupData.liableperson + '<br/>' +
                "联系电话: " + popupData.telephone + '<br/>' +
                "位置描述: " + popupData.locationdesc + '<br/>' +
                "管制名称: " + popupData.objectname + '<br/>' +
                "管制类型: " + popupData.type + '<br/>' +
                "管制说明: " + popupData.remark + '<br/>');
        } else if (ref == "shigu") {
            Ds.DataService("/trafficindex_trafficAccident/gotoBJtzsTrafficaccident.json", sendparamID, (resp) => {
                console.log(resp);
                popupData = resp.aaData;
            }, (e) => {
                alert('后台传输错误');
                console.log(e)
            });
            popup_spec = L.popup().setContent(
                "事故等级: " + popupData.accidentlevel + '<br/>' +
                "事故类型: " + popupData.accidenttype + '<br/>' +
                "发生位置: " + popupData.locationdesc + '<br/>' +
                "发生时间: " + popupData.occurrencedate + '<br/>' +
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
    /* var params = {
         id: '浙JT8001',
         date: '2010/10/26 1:11:11'
     }*/
    console.log(params);
    if (params) {
        var sendtaxiparams = {
            id: params.id,
            date: params.date
        };

        taxiRoute = Ds.DataService('/trafficindex_map/track.json', sendtaxiparams, (resp) => {
            console.log(resp.aaData);
            if (!resp.aaData) {
                alert('没有查询到浮动车信息');
                return;
            } else {
                map.eachLayer((layer) => {
                    if (layer.options.id !== "streetLayer") {
                        map.removeLayer(layer);
                    }
                });
                var fudongcheIcon = L.icon({
                    iconUrl: taxi_img,
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
            alert("后台传输错误");
        });

        taxiInterval = setInterval(() => {
            taxiRoute();
        }, 61000);


    } else alert("无法追踪");
}


export const stopTrackingTaxi = () => {
    clearInterval(taxiInterval);
    map.eachLayer((layer) => {
        if (layer.options.id !== "streetLayer") {
            map.removeLayer(layer);
        }
    });
}

export const changeConfigLayer = (data, ref) => {
    console.log(data);
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
            if (e.target.feature.properties.rgb) color1 = e.target.feature.properties.rgb;
            else color1 = 'LightSalmon';
            e.target.setStyle({
                fillColor: color1,
                fillOpacity: 1,
                color: color1,
                weight: 7,
                opacity: 0.9
            });
        }

        lmsg.send('openChangeConfigPanel', {
            ref: ref,
            id: e.target.feature.properties.id
        });

    }
    var showName = (e) => {
        /*e.target.setStyle({
            weight: 7,
            color: '#FF4500',
            dashArray: '',
            fillOpacity: 0.9
        });*/
        var popup = L.popup().setContent('名称：' + e.target.feature.properties.id);
        e.target.bindPopup(popup).openPopup();
    }
    var closePopup = (e) => {
        //ChangeConfigLayer.resetStyle(e.target);
        e.target.closePopup();
    }
    var ChangeConfigLayer = L.geoJson(ChangeLayerData, {
        style: function(feature) {
            var color1 = null;
            if (feature.properties.rgb) color1 = feature.properties.rgb;
            else color1 = 'LightSalmon';
            var styles = {
                fillColor: color1,
                fillOpacity: 1,
                color: color1,
                weight: 7,
                opacity: 0.9
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
    console.log(data);
    var Config_crossGeojson = null,
        Config_roadGeojson = null,
        Config_zoneGeojson = null,
        ConfigCrossLayer = null,
        ConfigRoadLayer = null,
        ConfigZoneLayer = null;
    if (data.cross) Config_crossGeojson = data.cross;
    if (data.road) Config_roadGeojson = data.road;
    if (data.zone) Config_zoneGeojson = data.zone;
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
                    fillColor: feature.properties.rgb,
                    fillOpacity: 1,
                    color: "white",
                    weight: 3,
                    opacity: 0.9
                };
                return ZoneRegion;
            }
        }).addTo(map);
    }

}

export const displayConfigLayer_road = (data) => {
    console.log('data', data);

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
        //console.log(e.target);
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
        popup2 = L.popup().setContent(l.feature.properties.id);
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
    console.log('data', data);

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

    /*function panToBound(e) {
        //console.log(e.target);
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
    };

    function resetFeature(e) {
        CommonLayer.resetStyle(e.target);
    };

    function eachLineFeature(feature, layer) {
        layer.on({
            click: panToBound,
            mouseover: highlightFeature,
            mouseout: resetFeature
        });
    };*/


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
}