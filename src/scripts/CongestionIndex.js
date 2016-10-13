import L from 'leaflet';
import LE from 'esri-leaflet';
import * as lmap from '../libs/lmap';
import taxi_img from '../images/local_taxi.png';
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
        popupCross.append($('<button class="aa">更新</button>').click(function() {
            alert("update index")
        }));
        popupCross.append($('<button class="aa">实时</button>').click(function() {
            console.log(e.target.feature.properties.id);
            lmsg.send('crsBtn', {
                params: 'cross',
                isTime: '1',
                ID: e.target.feature.properties.id,
                name: e.target.feature.properties.name
            });
        }));
        popupCross.append($('<button class="aa">档案</button>').click(function() {
            lmsg.send('crsBtn', {
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
        popupRoad.append($('<button class="aa">更新</button>').click(function() {
            alert("update index")
        }));
        popupRoad.append($('<button class="aa">实时</button>').click(function() {
            ///console.log(e.target);
            lmsg.send('crsBtn', {
                params: 'road',
                isTime: '1',
                ID: e.target.feature.properties.id,
                name: e.target.feature.properties.name
            });
        }));
        popupRoad.append($('<button class="aa">档案</button>').click(function() {
            lmsg.send('crsBtn', {
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
        popupArea.append($('<button class="aa">更新</button>').click(function() {
            alert("update index")
        }));
        popupArea.append($('<button class="aa">实时</button>').click(function() {
            //console.log(e.target.feature.properties.id);
            lmsg.send('crsBtn', {
                params: 'area',
                isTime: '1',
                ID: e.target.feature.properties.id,
                name: e.target.feature.properties.name
            });
        }));
        popupArea.append($('<button class="aa">档案</button>').click(function() {
            lmsg.send('crsBtn', {
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
        specialstyle = null;


    if (ref == 'fudongche') {
        _APIpath = "/map/floatCar.json";
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
        _APIpath = "/map/roadConstruction.json";
        specialstyle = (feature) => {
            return {
                fillColor: '#007D7D',
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

    } else if (ref == 'guanzhi') {
        _APIpath = "/map/trafficControl.json";
        specialstyle = (feature) => {
            return {
                fillColor: '#EEC900',
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }
    } else if (ref == 'shigu') {
        _APIpath = "/map/trafficAccident.json";
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
    } else if (ref == 'yongdu_cross') {
        _APIpath = "/map/cfydCross.json";
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
        param = {
            flag: data.flag,
            date: data.date
        }
    } else if (ref == 'yongdu_road') {
        _APIpath = "/map/cfydRoad.json";
        specialstyle = (feature) => {
            return {
                fillColor: '#D2691E',
                weight: 2,
                opacity: 1,
                color: 'yellow',
                fillOpacity: 0.7
            };
        }
        param = {
            flag: data.flag,
            date: data.date
        }
    } else if (ref == 'jiari_cross') {
        _APIpath = "/map/holiday.json";
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
            qyType: 1,
            date: '20160818'
        }
    } else if (ref == 'jiari_road') {
        _APIpath = "/map/holiday.json";
        specialstyle = (feature) => {
            return {
                fillColor: '#D2691E',
                weight: 2,
                opacity: 1,
                color: 'blue',
                fillOpacity: 0.7
            };
        }
        param = {
            type: 'road',
            qyType: 1,
            date: '20160818'
        }
    } else if (ref == 'jiari_zone') {
        _APIpath = "/map/holiday.json";
        specialstyle = (feature) => {
            return {
                fillColor: '#D2691E',
                weight: 2,
                opacity: 1,
                color: 'blue',
                fillOpacity: 0.7
            };
        }
        param = {
            type: 'region',
            qyType: 0,
            date: '20160818'
        }
    }

    Ds.DataService(_APIpath, param, (resp) => {
        console.log(resp.data);
        featurecollectiondata = resp.data;
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
            Ds.DataService("/floatcar/fdcarMessage.json", sendparamID, (resp) => {
                console.log(resp);
                popupData = resp.data;
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

        } else if (ref == "shigong") {
            Ds.DataService("/roadconstruction/queryConstOne.json", sendparamID, (resp) => {
                console.log(resp);
                popupData = resp.data;
            }, (e) => {
                alert('后台传输错误');
                console.log(e)
            });
            specialpopup = L.popup().setContent(
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
            Ds.DataService("/trafficControl/queryControlOne.json", sendparamID, (resp) => {
                console.log(resp);
                popupData = resp.data;
            }, (e) => {
                alert('后台传输错误');
                console.log(e)
            });
            specialpopup = L.popup().setContent(
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
            Ds.DataService("/trifficAccident/queryAccidentOne.json", sendparamID, (resp) => {
                console.log(resp);
                popupData = resp.data;
            }, (e) => {
                alert('后台传输错误');
                console.log(e)
            });
            specialpopup = L.popup().setContent(
                "事故等级: " + popupData.accidentlevel + '<br/>' +
                "事故类型: " + popupData.accidenttype + '<br/>' +
                "发生位置: " + popupData.locationdesc + '<br/>' +
                "发生时间: " + popupData.occurrencedate + '<br/>' +
                "接报人: " + popupData.recipientperson + '<br/>' +
                "事故描述: " + popupData.remark + '<br/>' +
                "上报人: " + popupData.reportperson + '<br/>' +
                "上报人联系方式: " + popupData.reportpersoncontact + '<br/>');
        }


        //var specialpopup = L.popup().setContent("这是浮动车信息");
        SpecificLayer.bindPopup(specialpopup).addTo(map);

        if (specialpointlayer) {
            if (map.getZoom() <= 16) {
                map.setZoomAround(e.target._latlng, 17);
            } else map.panTo(e.target._latlng);
        } else map.fitBounds(e.target.getBounds());
    }

    function eachUniFeature(feature, layer) {
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
    map.addLayer(SpecificLayer);

}

var taxiInterval = null;

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

        var taxiRoute = Ds.DataService('/map/track.json', sendtaxiparams, (resp) => {
            console.log(resp.data)
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
            var taxijson = resp.data;
            var routestyle = (feature) => {
                return {
                    fillColor: '#2db7f5',
                    weight: 2,
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
        color: '#EEC900'
    });
    var RoadLine = {
        "color": "#bc18dc",
        "weight": 2,
        "opacity": 0.8
    };
    var ZoneRegion = {
        fillColor: "#26d249",
        fillOpacity: 1,
        color: "#e5e5e5",
        weight: 2,
        opacity: 0.8
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
                return ZoneRegion;
            }
        }).addTo(map);
    }

}

export const displayConfigLayer_road = (data) => {
    console.log('data', data)
    map.eachLayer((layer) => {
        if (layer.options.id != 'roadLayer' && layer.options.id != 'streetLayer')
            map.removeLayer(layer);
    });
    var GeoJsonLines = data;

    let orangeLine = {
        "color": "#FFA500",
        "weight": 3,
        "opacity": 0.8
    };

    var lineLayer;

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
            return orangeLine;
            var indexVal = feature.properties.index;
        },
        onEachFeature: eachLineFeature
    }).addTo(map);

};