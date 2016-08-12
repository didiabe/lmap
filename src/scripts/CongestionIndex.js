import L from 'leaflet';
import LE from 'esri-leaflet';
import { statesData, GeoJsonPoints } from '../test/US';

export function addGracLayer(layerName) {
    switch (layerName.id) {
        case 'cross':
            crossLayer();
            break;
        case 'road':
            roadLayer();
            break;
        case 'area':
            areaLayer();
            break;
        default:
            break;
    }

}
const crossLayer = function() {
    map.eachLayer((layer) => {
        if (layer.options.id != 'crossLayer' && layer.options.id != 'streetLayer')
            map.removeLayer(layer);
    });
    /*这个GeoJsonPoints是需要后台请求的*/
    var GeoJsonPoints = {
        "type": "FeatureCollection",
        "features": [
            { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.6672, 45.5254] }, "properties": { "index": "1" } },
            { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.6662, 45.5262] }, "properties": { "index": "2" } },
            { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.6651, 45.5255] }, "properties": { "index": "3" } },
            { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.6672, 45.5262] }, "properties": { "index": "4" } },
            { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.6673, 45.5268] }, "properties": { "index": "2" } },
            { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.6682, 45.5261] }, "properties": { "index": "3" } },
            { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.6652, 45.5268] }, "properties": { "index": "1" } },
            { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.6682, 45.5272] }, "properties": { "index": "2" } },
            { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.6678, 45.5252] }, "properties": { "index": "5" } }
        ]
    };
    var greenMarker = {
        radius: 9,
        fillColor: "#7FFF00",
        color: "#7FFF00",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
    };
    var yellowMarker = {
        radius: 9,
        fillColor: "#EEC900",
        color: "#EEC900",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
    };
    var orangeMarker = {
        radius: 9,
        fillColor: "#EE9A00",
        color: "#EE9A00",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
    };
    var brownMarker = {
        radius: 9,
        fillColor: "#D2691E",
        color: "#D2691E",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
    };
    var redMarker = {
        radius: 9,
        fillColor: "#CD0000",
        color: "#CD0000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
    };
    var pointMarkerOption = null;

    var pointLayer;

    function panTotarget(e) {
        //console.log(map.getZoom());
        if (map.getZoom() <= 16) {
            map.setZoomAround(e.target._latlng, 17);
        } else map.panTo(e.target._latlng);

    };

    function highlightFeature(e) {
        var l = e.target;
        l.setStyle({
            weight: 3,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.9
        });
    };

    function resetFeature(e) {
        var l = e.target;
        l.setStyle({
            radius: 9,
            fillColor: e.target.defaultOptions.fillColor,
            color: e.target.defaultOptions.fillColor,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.9
        });
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
            if (indexVal > 0 && indexVal <= 1) pointMarkerOption = greenMarker;
            else if (indexVal > 1 && indexVal <= 2) pointMarkerOption = yellowMarker;
            else if (indexVal > 2 && indexVal <= 3) pointMarkerOption = orangeMarker;
            else if (indexVal > 3 && indexVal <= 4) pointMarkerOption = brownMarker;
            else if (indexVal > 4 && indexVal <= 5) pointMarkerOption = redMarker;
            return L.circleMarker(latlng, pointMarkerOption);
        },
        onEachFeature: eachPointFeature

    });

    var popup1 = L.popup().setContent("hello, this is a popup");

    pointLayer.bindPopup(popup1)
        .addTo(map);
};
const roadLayer = function() {
    map.eachLayer((layer) => {
        if (layer.options.id != 'roadLayer' && layer.options.id != 'streetLayer')
            map.removeLayer(layer);
    });
    /*这个GeoJsonLines是需要后台请求的*/
    var GeoJsonLines = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [-122.6672, 45.5254],
                    [-122.6572, 45.5254],
                    [-122.6672, 45.5354]
                ]
            },
            "properties": { "index": 1 }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [-122.6311, 45.4354],
                    [-122.6844, 45.4133],
                    [-122.6722, 45.4321],
                    [-122.6611, 45.4211]
                ]
            },
            "properties": { "index": 2 }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [-122.6222, 45.4354],
                    [-122.6811, 45.4511],
                    [-122.6672, 45.5354],
                    [-122.6652, 45.5654],
                    [-122.6431, 45.5422]
                ]
            },
            "properties": { "index": 3 }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [-122.6122, 45.4454],
                    [-122.6411, 45.4311],
                    [-122.6572, 45.5654],
                    [-122.6652, 45.5254],
                    [-122.6731, 45.5122]
                ]
            },
            "properties": { "index": 4 }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [-122.6222, 45.5354],
                    [-122.6611, 45.5111],
                    [-122.6682, 45.5354],
                    [-122.6452, 45.5554],
                    [-122.6451, 45.5522]
                ]
            },
            "properties": { "index": 5 }
        }]
    };

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
            if (indexVal > 0 && indexVal <= 1) return greenLine;
            else if (indexVal > 1 && indexVal <= 2) return yellowLine;
            else if (indexVal > 2 && indexVal <= 3) return orangeLine;
            else if (indexVal > 3 && indexVal <= 4) return brownLine;
            else if (indexVal > 4 && indexVal <= 5) return redLine;
        },
        onEachFeature: eachLineFeature
    });
    var popup2 = L.popup().setContent("hello, this is a popup LINE");
    lineLayer.bindPopup(popup2).addTo(map);
};

const areaLayer = function() {
    map.eachLayer((layer) => {
        if (layer.options.id != 'areaLayer' && layer.options.id != 'streetLayer')
            map.removeLayer(layer);
    });
    /*这个GeoJsonRegion是需要后台请求的*/
    var GeoJsonRegion = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [-122.6311, 45.4354],
                        [-122.6844, 45.4133],
                        [-122.6722, 45.4321],
                        [-122.6611, 45.4211]
                    ]
                ]
            },
            "properties": { "index": 1 }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [-122.6211, 45.4354],
                        [-122.6244, 45.4333],
                        [-122.6222, 45.4321],
                        [-122.6211, 45.4311]
                    ]
                ]
            },
            "properties": { "index": 2 }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [-122.6411, 45.4454],
                        [-122.6444, 45.4433],
                        [-122.6422, 45.4421],
                        [-122.6411, 45.4411]
                    ]
                ]
            },
            "properties": { "index": 3 }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [-122.6511, 45.4554],
                        [-122.6544, 45.4533],
                        [-122.6522, 45.4521],
                        [-122.6511, 45.4511]
                    ]
                ]
            },
            "properties": { "index": 4 }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [-122.6811, 45.4854],
                        [-122.6844, 45.4833],
                        [-122.6822, 45.4821],
                        [-122.6811, 45.4811]
                    ]
                ]
            },
            "properties": { "index": 5 }
        }]
    };
    var greenRegion = {
        fillColor: "#7FFF00",
        fillOpacity: 1,
        color: "#7FFF00",
        weight: 5,
        opacity: 0.8
    };
    var yellowRegion = {
        fillColor: "#FFEB00",
        fillOpacity: 1,
        color: "#FFEB00",
        weight: 5,
        opacity: 0.8

    };
    var orangeRegion = {
        fillColor: "#FFA500",
        fillOpacity: 1,
        color: "#FFA500",
        weight: 5,
        opacity: 0.8

    };
    var brownRegion = {
        fillColor: "#CD3333",
        fillOpacity: 1,
        color: "#CD3333",
        weight: 5,
        opacity: 0.8
    };

    var redRegion = {
        fillColor: "#FF0000",
        fillOpacity: 1,
        color: "#FF0000",
        weight: 5,
        opacity: 0.8

    };
    var regionLayer;

    function panToBound(e) {
        map.fitBounds(e.target.getBounds());
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
            if (indexVal > 0 && indexVal <= 1) return greenRegion;
            else if (indexVal > 1 && indexVal <= 2) return yellowRegion;
            else if (indexVal > 2 && indexVal <= 3) return orangeRegion;
            else if (indexVal > 3 && indexVal <= 4) return brownRegion;
            else if (indexVal > 4 && indexVal <= 5) return redRegion;
        },
        onEachFeature: eachRegionFeature
    });
    var popup3 = L.popup().setContent("hello, this is a popup REGION");
    regionLayer.bindPopup(popup3).addTo(map);

};
