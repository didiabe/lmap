import React from 'react';
import L from 'leaflet';
import LE from 'esri-leaflet';
import * as LDraw from 'leaflet-draw';

class Map extends React.Component {
    constructor() {
        super();
    }
    componentWillReceiveProps(nextProps) {
        // var searchVal = this.props.searchVal;
        // console.log(nextProps.searchVal);
        // console.log(map)
        // LE.featureLayer({
        //     url: 'https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Heritage_Trees_Portland/FeatureServer/0'
        // }).addTo(map)
    }
    render() {
        return (<div id="map"></div>)
    }
    componentDidMount() {
        var map = L.map("map", {
            center: [28.31, 121.37],
            zoom: 12,
            drawControl: false,
            zoomControl: false

            //visualClick: false,


        });
        L.esri.tiledMapLayer({
            id: 'streetLayer',
            url: _mapserverUrl.streetLayer
        }).addTo(map);

        window.map = map;
    }
}

export default Map