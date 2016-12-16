var _mapConfig = {
		center: [28.39, 121.369], //中心点
		defaultZoom: 14, //默认zoom
		maxZoom: 17, //最大
		minZoom: 12, //最小
		panToZoomLevel: 16, //点击点放大的zoom
		bounds: {
			miny: 121.2074,
			minx: 28.2744,
			maxy: 121.6633,
			maxx: 28.5126
		}
	}
	/*var _initMap_global = {
	    center: [31.3, 120.55],
	    defaultZoom: 12,
	    minZoom: 1,
	    maxZoom: 18,
	    bounds: {
	        minx: 0,
	        miny: -180,
	        maxx: 90,
	        maxy: 180
	    }
	}*/
var _mapserverUrl = {
	streetLayer: 'http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineStreetColor/MapServer'
};
var _DataService = 'http://localhost:8080/shbaokangsoft';

var _imagePath = _DataService + '/map/images';