import L from 'leaflet';
import turf from '@turf/turf';
import leaflet_draw from 'leaflet-draw';
import * as lmsg from '../libs/lmsg';

export const drawFeatures = {
	activate: function() {
		activateDrawToolbar();
	},
	disable: function() {
		stopDrawToolbar();
	}
}

var drawnItemsLayer = null,
	drawControl = null;

const activateDrawToolbar = function() {

	if (drawnItemsLayer) {
		map.removeLayer(drawnItemsLayer);
		drawnItemsLayer = null;
	}
	if (drawControl) {
		map.removeControl(drawControl);
		drawControl = null;
	}


	drawnItemsLayer = new L.FeatureGroup();
	map.addLayer(drawnItemsLayer);
	let MyCustomMarker = L.Icon.extend({
		options: {
			shadowUrl: null,
			iconAnchor: new L.Point(12, 12),
			iconSize: new L.Point(24, 24),
			//iconUrl: 'link/to/image.png'
		}
	});
	L.drawLocal.draw.toolbar.buttons.polygon = '绘制多边形';
	L.drawLocal.draw.toolbar.buttons.polyline = '绘制线';
	L.drawLocal.draw.toolbar.buttons.marker = '绘制图标';
	L.drawLocal.draw.toolbar.buttons.rectangle = '绘制矩形';
	L.drawLocal.edit.toolbar.buttons.remove = '删除图形';
	L.drawLocal.edit.toolbar.actions.save = {
		title: '保存更改',
		text: '保存'
	};
	L.drawLocal.edit.toolbar.actions.cancel = {
		title: '取消更改',
		text: '取消'
	};
	L.drawLocal.edit.handlers.remove.tooltip.text = '点击图形来删除';
	L.drawLocal.draw.handlers.rectangle.tooltip = {
		start: '开始绘图',
		cont: '双击结束绘图',
		end: '结束'
	};
	L.drawLocal.draw.handlers.polygon.tooltip = {
		start: '开始绘图',
		cont: '双击结束绘图',
		end: '结束'
	};
	L.drawLocal.draw.handlers.polyline.tooltip = {
		start: '开始绘图',
		cont: '双击结束绘图',
		end: '结束'
	};
	L.drawLocal.draw.handlers.marker.tooltip = {
		start: '开始绘图',
		cont: '双击结束绘图',
		end: '结束'
	};
	drawControl = new L.Control.Draw({
		edit: {
			featureGroup: drawnItemsLayer,
			edit: false
		},
		draw: {
			polyline: {
				allowIntersection: false,
				drawError: {
					color: '#e1e100',
					message: '<strong>STOP<strong>重叠了亲'
				},
				shapeOptions: {
					color: '#f357a1',
					weight: 10
				}
			},
			polygon: {
				allowIntersection: false,
				drawError: {
					color: '#b00b00',
					timeout: 1000
				},
				shapeOptions: {
					color: '#12e229'
				},
				//showArea: true
			},
			rectangle: false,
			circle: false
		},
		position: 'topright'
	});
	map.addControl(drawControl);
	map.on('draw:created', drawCreated);

}

const drawCreated = (e) => {

	let type = e.layerType;
	let layer = e.layer;
	//console.log(layer);
	var latlngs = [],
		coords = null,
		featureDrawn = null,
		measurement = null;
	if (type == 'polyline') {
		console.log("您已画了线");
		layer._latlngs.map((item) => {
			coords = [item.lng, item.lat];
			latlngs.push(coords);
		});
		featureDrawn = turf.lineString(latlngs);
		measurement = turf.lineDistance(featureDrawn, "kilometers");

	} else if (type == 'polygon') {
		console.log("您已画了面");
		layer._latlngs[0].map((item) => {
			coords = [item.lng, item.lat];
			latlngs.push(coords);
		});
		//第一个点和最后一个点要保持一致，要不turf解析不了。
		latlngs.push(latlngs[0])
		featureDrawn = turf.polygon([latlngs]);
		//面积是平方公里
		measurement = turf.area(featureDrawn) / 1000000;

	} else if (type == "marker") {
		latlngs = [layer._latlng.lng, layer._latlng.lat];
		measurement = latlngs;
		featureDrawn = turf.point(latlngs);
	} else {
		alert("创建图形失败");
		return;
	}

	console.log(measurement);
	console.log(featureDrawn);

	//传给1屏的,不包括后台
	if (measurement && featureDrawn) {
		console.log('transfer to screen 1');

		lmsg.send('located', {
			finish: true,
			params: {
				geometry: featureDrawn,
				measurement: measurement
			}
		});
	}

	drawnItemsLayer.addLayer(layer);
}

const stopDrawToolbar = () => {
	map.removeLayer(drawnItemsLayer);
	map.removeControl(drawControl);
	drawnItemsLayer = null;
	drawControl = null;
}