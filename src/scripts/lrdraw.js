import L from 'leaflet';
import turf from '@turf/turf';
import leaflet_draw from 'leaflet-draw';

export const test = (Map, options) => {
		L.DrawFeatures = L.Class.extend({
			statics: {},
			_map: null,
			_options: {
				_polyline: {
					show: true,
					color: '#f357a1',
					weight: 8,
					allowIntersection: false
				},
				_polygon: {
					show: true,
					color: '#007edf',
					allowIntersection: false
				},
				_rectangle: {
					show: true,
					color: '#bada55',
					allowIntersection: false,
					repeat: false
				},
				_circle: {
					show: true,
					color: '#333333',
					allowIntersection: false,
					repeat: false
				},
				_marker: {
					url: null,
					show: true
				}

			},
			initialize: (Map, options) => {
				console.log(Map, options)
				console.log(this)
				this._map = Map;
				console.log(this)
					//L.Util.setOptions(this.options, options);

				this.start = this._start || {};
				/*			this._polyline = {
								show: options.polyline.show || true,
								color: options.polyline.color || '#f357a1',
								weight: options.polyline.weight || 8,
								allowIntersection: options.polyline.allowIntersection || false
							};
							this._polygon = {
								show: options.polygon.show || true,
								color: options.polygon.color || '#007edf',
								allowIntersection: options.polygon.allowIntersection || false
							};
							this._rectangle = {
								show: options.rectangle.show || true,
								color: options.rectangle.color || '#bada55',
								allowIntersection: options.rectangle.allowIntersection || false,
								repeat: options.rectangle.repeat || false
							};
							this._circle = {
								show: options.circle.show || true,
								color: options.circle.color || '#333333',
								allowIntersection: options.circle.allowIntersection || false,
								repeat: options.circle.repeat || false
							};
							this._marker = {
								url: options.marker.url || null,
								show: options.circle.show || true
							}*/

			},
			_start() {
				var MyCustomMarker = L.Icon.extend({
					options: {
						shadowUrl: null,
						iconAnchor: new L.Point(12, 12),
						iconSize: new L.Point(24, 24),
						iconUrl: this._options._marker.url || null
					}
				});
				L.drawLocal = {
					draw: {
						toolbar: {
							actions: {
								title: 'Cancel drawing',
								text: '取消'
							},
							finish: {
								title: 'Finish drawing',
								text: '完成'
							},
							undo: {
								title: 'Delete last point drawn',
								text: '撤销'
							},
							buttons: {
								polyline: '绘制线',
								polygon: '绘制多边形',
								rectangle: '绘制矩形',
								circle: 'Draw a circle',
								marker: '绘制点'
							}
						},
						handlers: {
							circle: {
								tooltip: {
									start: 'Click and drag to draw circle.'
								},
								radius: 'Radius'
							},
							marker: {
								tooltip: {
									start: '点击地图标注一个点'
								}
							},
							polygon: {
								tooltip: {
									start: '点击开始绘制多边形',
									cont: '继续点击，继续绘制',
									end: '双击来结束绘制'
								}
							},
							polyline: {
								error: '<strong>Error:</strong> 不能重叠，重叠了',
								tooltip: {
									start: '点击开始绘制线',
									cont: '继续点击，继续绘制',
									end: '双击来结束绘制'
								}
							},
							rectangle: {
								tooltip: {
									start: '长按来绘制一个矩形'
								}
							},
							simpleshape: {
								tooltip: {
									end: '释放鼠标按键来结束绘制'
								}
							}
						}
					},
					edit: {
						toolbar: {
							actions: {
								save: {
									title: 'Save changes.',
									text: '保存'
								},
								cancel: {
									title: 'Cancel editing, discards all changes.',
									text: '取消'
								}
							},
							buttons: {
								edit: '编辑图形',
								editDisabled: '没有可编辑的图形',
								remove: '删除图形',
								removeDisabled: '没有可删除的图形'
							}
						},
						handlers: {
							edit: {
								tooltip: {
									text: '拖拽节点来编辑图形',
									subtext: '单击节点取消编辑'
								}
							},
							remove: {
								tooltip: {
									text: '选择想要删除的图形'
								}
							}
						}
					}
				};
				var editableLayers = new L.FeatureGroup();
				_map.addLayer(editableLayers);

				var drawControl = new L.Control.Draw({
					position: 'topright',
					draw: {
						polyline: this._options._polyline.show ? {
							shapeOptions: {
								color: this._options._polyline.color,
								weight: this._options._polyline.weight
							},
							allowIntersection: this._options._polyline.allowIntersection
						} : false,
						polygon: this._options._polygon.show ? {
							allowIntersection: this._options._polygon.allowIntersection,
							drawError: {
								color: '#e1e100',
								message: '<strong>重叠<strong>不可重叠'
							},
							shapeOptions: {
								color: this._options._polygon.color
							}
						} : false,
						circle: this._options._circle.show ? {
							allowIntersection: this._options._circle.allowIntersection,
							drawError: {
								color: '#e1e100',
								message: '<strong>重叠<strong>不可重叠'
							},
							shapeOptions: {
								color: this._options._circle.color
							},
							repeatMode: this._options._circle.repeat
						} : false,
						rectangle: this._options._rectangle.show ? {
							allowIntersection: _rectangle.allowIntersection,
							drawError: {
								color: '#e1e100',
								message: '<strong>重叠<strong>不可重叠'
							},
							shapeOptions: {
								color: this._options._rectangle.color
							},
							repeatMode: this._options._rectangle.repeat
						} : false,
						marker: this._options._marker.show ? {
							icon: new MyCustomMarker()
						} : false
					},
					edit: {
						featureGroup: editableLayers,
						remove: true,
						poly: {
							allowIntersection: _polygon.allowIntersection
						}
					}
				});
				_map.addControl(drawControl);
				map.on('draw:created', function(e) {
					var type = e.layerType,
						layer = e.layer;


					editableLayers.addLayer(layer);
				});
			},
			_stop() {
				console.log(11)
			}
		});
		return new L.DrawFeatures(map, options);
	}
	//export default DrawFeature