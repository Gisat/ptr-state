import Select from '../../../../src/state/Select';
import {assert} from 'chai';
import {DataSelectorsState} from '../../Data/selectors/_state';
import {MapsSelectorsState_2, MapsSelectorsState_3} from './_state';
import {setState} from '@jvitela/recompute';

const state = {
	...DataSelectorsState,
	...MapsSelectorsState_2,
	app: {
		localConfiguration: {
			apiBackendProtocol: 'http',
			apiBackendHost: 'localhost:3000',
		},
	},
	styles: {
		byKey: {
			style1: {key: 'style1', data: {definition: {}}},
			style2: {
				key: 'style1',
				data: {
					definition: {
						rules: [
							{
								styles: [
									{
										color: '#000000',
									},
									{
										bandIndex: 0,
										values: {
											0: {color: null},
										},
									},
									{
										bandIndex: 1,
										values: {
											0: {color: '#FF0000'},
										},
									},
								],
							},
						],
					},
				},
			},
		},
	},
	selections: {
		byKey: {
			selection1: {
				key: 'selection1',
				data: {
					style: 'default',
					hoveredStyle: 'default',
					featureKeysFilter: {
						keys: ['feature1'],
					},
				},
			},
		},
	},
};
const stateWithoutViewport = {
	...DataSelectorsState,
	...MapsSelectorsState_3,
	app: {
		localConfiguration: {
			apiBackendProtocol: 'http',
			apiBackendHost: 'localhost:3000',
		},
	},
	styles: {byKey: {style1: {key: 'style1', data: {definition: {}}}}},
	selections: {
		byKey: {
			selection1: {
				key: 'selection1',
				data: {
					style: 'default',
					hoveredStyle: 'default',
					featureKeysFilter: {
						keys: ['feature1'],
					},
				},
			},
		},
	},
};

describe('getFinalLayerByDataSourceAndLayerState', function () {
	it('should select wmts layer', () => {
		setState(state);
		const spatialDataSource = {
			key: 'dataSource1',
			data: {
				type: 'wmts',
				url: 'https://back.ground',
			},
		};
		const layerKey = 'wmtsLayer';
		const layerState = {
			name: 'WMTS',
		};

		const expectedOutput = {
			key: `${layerKey}_${spatialDataSource.key}`,
			layerKey,
			opacity: 1,
			name: 'WMTS',
			type: 'wmts',
			options: {
				url: 'https://back.ground',
			},
		};

		const output = Select.maps.getFinalLayerByDataSourceAndLayerState(
			spatialDataSource,
			layerState,
			layerKey
		);
		assert.deepStrictEqual(output, expectedOutput);
		setState(null);
	});

	it('should select wmts layer with urls', () => {
		setState(state);
		const spatialDataSource = {
			key: 'dataSource1',
			data: {
				type: 'wmts',
				urls: ['https://back.ground'],
			},
		};
		const layerKey = 'wmtsLayer';
		const layerState = {
			name: 'WMTS',
		};

		const expectedOutput = {
			key: `${layerKey}_${spatialDataSource.key}`,
			layerKey,
			opacity: 1,
			name: 'WMTS',
			type: 'wmts',
			options: {
				url: 'https://back.ground',
				urls: ['https://back.ground'],
			},
		};

		const output = Select.maps.getFinalLayerByDataSourceAndLayerState(
			spatialDataSource,
			layerState,
			layerKey
		);
		assert.deepStrictEqual(output, expectedOutput);
		setState(null);
	});

	it('should select wms layer', () => {
		setState(state);
		const spatialDataSource = {
			key: 'dataSource2',
			data: {
				type: 'wms',
				url: 'https://wm.s',
				params: {
					a: 1,
				},
				layers: 'layer1',
			},
		};
		const layerKey = 'wmsLayer';
		const layerState = {
			name: 'WMS',
		};

		const expectedOutput = {
			key: `${layerKey}_${spatialDataSource.key}`,
			layerKey,
			opacity: 1,
			name: 'WMS',
			type: 'wms',
			options: {
				url: 'https://wm.s',
				singleTile: false,
				hoverable: false,
				fetchedTile: false,
				pickable: false,
				params: {
					layers: 'layer1',
					a: 1,
				},
			},
		};

		const output = Select.maps.getFinalLayerByDataSourceAndLayerState(
			spatialDataSource,
			layerState,
			layerKey
		);
		assert.deepStrictEqual(output, expectedOutput);
		setState(null);
	});

	it('should select wms layer and complete the url and optional CRS', () => {
		setState(state);
		const spatialDataSource = {
			key: 'dataSource2',
			data: {
				type: 'wms',
				url: 'wms.png',
				params: {
					a: 1,
				},
				layers: 'layer1',
				styles: 'styleName1',
			},
		};
		const layerKey = 'wmsLayer';
		const layerState = {
			name: 'WMS',
			crs: 'EPSG:4326',
		};

		const expectedOutput = {
			key: `${layerKey}_${spatialDataSource.key}`,
			layerKey,
			opacity: 1,
			name: 'WMS',
			type: 'wms',
			options: {
				url: 'http://localhost:3000/wms.png',
				singleTile: false,
				hoverable: false,
				fetchedTile: false,
				pickable: false,
				params: {
					layers: 'layer1',
					a: 1,
					crs: 'EPSG:4326',
					styles: 'styleName1',
				},
			},
		};

		const output = Select.maps.getFinalLayerByDataSourceAndLayerState(
			spatialDataSource,
			layerState,
			layerKey
		);
		assert.deepStrictEqual(output, expectedOutput);
		setState(null);
	});

	it('should select wms layer as single tile', () => {
		setState(state);
		const spatialDataSource = {
			key: 'dataSource2',
			data: {
				type: 'wms',
				url: 'https://wm.s',
				params: {
					a: 1,
				},
				layers: 'layer1',
				configuration: {
					singleTile: true,
				},
			},
		};
		const layerKey = 'wmsLayer';
		const layerState = {
			name: 'WMS',
		};

		const expectedOutput = {
			key: `${layerKey}_${spatialDataSource.key}`,
			layerKey,
			opacity: 1,
			name: 'WMS',
			type: 'wms',
			options: {
				url: 'https://wm.s',
				hoverable: false,
				fetchedTile: false,
				singleTile: true,
				pickable: false,
				params: {
					layers: 'layer1',
					a: 1,
				},
			},
		};

		const output = Select.maps.getFinalLayerByDataSourceAndLayerState(
			spatialDataSource,
			layerState,
			layerKey
		);
		assert.deepStrictEqual(output, expectedOutput);
		setState(null);
	});

	it('should select wms layer as fetch tile', () => {
		setState(state);
		const spatialDataSource = {
			key: 'dataSource2',
			data: {
				type: 'wms',
				url: 'https://wm.s',
				params: {
					a: 1,
				},
				layers: 'layer1',
				configuration: {
					fetchedTile: true,
				},
			},
		};
		const layerKey = 'wmsLayer';
		const layerState = {
			name: 'WMS',
		};

		const expectedOutput = {
			key: `${layerKey}_${spatialDataSource.key}`,
			layerKey,
			opacity: 1,
			name: 'WMS',
			type: 'wms',
			options: {
				url: 'https://wm.s',
				fetchedTile: true,
				hoverable: false,
				singleTile: false,
				pickable: false,
				params: {
					layers: 'layer1',
					a: 1,
				},
			},
		};

		const output = Select.maps.getFinalLayerByDataSourceAndLayerState(
			spatialDataSource,
			layerState,
			layerKey
		);
		assert.deepStrictEqual(output, expectedOutput);
		setState(null);
	});

	it('should select wms layer with pickable', () => {
		setState(state);
		const spatialDataSource = {
			key: 'dataSource2',
			data: {
				type: 'wms',
				url: 'https://wm.s',
				params: {
					a: 1,
				},
				layers: 'layer1',
				configuration: {
					pickable: true,
				},
			},
		};
		const layerKey = 'wmsLayer';
		const layerState = {
			name: 'WMS',
			options: {
				hoverable: true,
			},
		};

		const expectedOutput = {
			key: `${layerKey}_${spatialDataSource.key}`,
			layerKey,
			opacity: 1,
			name: 'WMS',
			type: 'wms',
			options: {
				url: 'https://wm.s',
				fetchedTile: false,
				hoverable: true,
				singleTile: false,
				pickable: true,
				params: {
					layers: 'layer1',
					a: 1,
				},
			},
		};

		const output = Select.maps.getFinalLayerByDataSourceAndLayerState(
			spatialDataSource,
			layerState,
			layerKey
		);
		assert.deepStrictEqual(output, expectedOutput);
		setState(null);
	});

	it('should select cog layer with default style', () => {
		setState(state);
		const spatialDataSource = {
			key: 'dataSource2',
			data: {
				type: 'cogBitmap',
				url: 'https://beautiful.cog',
			},
		};
		const layerKey = 'cogLayer';
		const layerState = {
			name: 'COG',
		};

		const expectedOutput = {
			key: `${layerKey}_${spatialDataSource.key}`,
			layerKey,
			opacity: 1,
			name: 'COG',
			type: 'cogBitmap',
			options: {
				url: 'https://beautiful.cog',
				style: {
					rules: [
						{
							styles: [
								{
									color: '#000000',
								},
								{
									bandIndex: 0,
									values: {
										0: {color: null},
									},
								},
							],
						},
					],
				},
			},
		};

		const output = Select.maps.getFinalLayerByDataSourceAndLayerState(
			spatialDataSource,
			layerState,
			layerKey
		);
		assert.deepStrictEqual(output, expectedOutput);
		setState(null);
	});

	it('should select cog layer for asked styleKey', () => {
		setState(state);
		const spatialDataSource = {
			key: 'dataSource2',
			data: {
				type: 'cogBitmap',
				url: 'https://beautiful.cog',
			},
		};
		const layerKey = 'cogLayer';
		const layerState = {
			name: 'COG',
			styleKey: 'style2',
		};

		const expectedOutput = {
			key: `${layerKey}_${spatialDataSource.key}`,
			layerKey,
			opacity: 1,
			name: 'COG',
			type: 'cogBitmap',
			options: {
				url: 'https://beautiful.cog',
				style: {
					rules: [
						{
							styles: [
								{
									color: '#000000',
								},
								{
									bandIndex: 0,
									values: {
										0: {color: null},
									},
								},
								{
									bandIndex: 1,
									values: {
										0: {color: '#FF0000'},
									},
								},
							],
						},
					],
				},
			},
		};

		const output = Select.maps.getFinalLayerByDataSourceAndLayerState(
			spatialDataSource,
			layerState,
			layerKey
		);
		assert.deepStrictEqual(output, expectedOutput);
		setState(null);
	});

	it('should select tiledVector layer', () => {
		setState(state);
		const spatialDataSource = {
			key: 'spatialDataSource1',
			data: {
				type: 'tiledVector',
				fidColumnName: 'fid',
			},
		};

		const layerState = {
			name: 'Point data',
			key: 'pointData',
			opacity: 0,
			options: {
				selected: {
					selection1: {},
				},
			},
		};

		const attributeDataSourceKeyAttributeKeyPairs = {
			attributeDataSource1: 'attribute1',
		};

		const mapKey = 'map1';

		const spatialRelationsFilter = {
			modifiers: {
				scopeKey: 'scope1',
				placeKey: 'place1',
			},
		};

		const attributeRelationsFilter = {
			modifiers: {
				scopeKey: 'scope1',
				placeKey: 'place1',
			},
		};

		const attributeDataFilter = {
			modifiers: {
				scopeKey: 'scope1',
				placeKey: 'place1',
			},
		};

		const expectedOutput = {
			key: `${layerState.key}_${spatialDataSource.key}`,
			layerKey: layerState.key,
			opacity: 0,
			name: 'Point data',
			type: 'tiledVector',
			options: {
				fidColumnName: 'fid',
				geometryColumnName: undefined,
				selected: {
					selection1: {
						hoveredStyle: 'default',
						keys: ['feature1'],
						style: 'default',
					},
				},
				tiles: [
					{
						features: [
							{
								geometry: {
									coordinates: [0.2, 0.2],
									type: 'Point',
								},
								key: 'featureKey1',
								properties: {
									attribute1: 'A',
									fid: 'featureKey1',
								},
								type: 'Feature',
							},
							{
								geometry: {
									coordinates: [0.7, 0.7],
									type: 'Point',
								},
								key: 'featureKey2',
								properties: {
									attribute1: 'B',
									fid: 'featureKey2',
								},
								type: 'Feature',
							},
						],
						level: 6,
						tile: '0,0',
					},
				],
			},
		};

		const output = Select.maps.getFinalLayerByDataSourceAndLayerState(
			spatialDataSource,
			layerState,
			null,
			attributeDataSourceKeyAttributeKeyPairs,
			mapKey,
			spatialRelationsFilter,
			attributeRelationsFilter,
			attributeDataFilter
		);
		assert.deepStrictEqual(output, expectedOutput);
		setState(null);
	});

	it('should select tiled-vector layer', () => {
		setState(state);
		const spatialDataSource = {
			key: 'spatialDataSource2',
			data: {
				type: 'tiled-vector',
				fidColumnName: 'fid',
			},
		};

		const layerState = {
			name: 'Point data 2',
			key: 'pointData2',
			opacity: 0,
			styleKey: 'style1',
		};

		const attributeDataSourceKeyAttributeKeyPairs = {
			attributeDataSource2: 'attribute2',
		};

		const mapKey = 'map1';

		const spatialRelationsFilter = {
			modifiers: {
				scopeKey: 'scope1',
				placeKey: 'place1',
			},
		};

		const attributeRelationsFilter = {
			modifiers: {
				scopeKey: 'scope1',
				placeKey: 'place1',
			},
		};

		const attributeDataFilter = {
			modifiers: {
				scopeKey: 'scope1',
				placeKey: 'place1',
			},
		};

		const expectedOutput = {
			key: `${layerState.key}_${spatialDataSource.key}`,
			layerKey: layerState.key,
			opacity: 0,
			name: 'Point data 2',
			type: 'tiled-vector',
			options: {
				fidColumnName: 'fid',
				geometryColumnName: undefined,
				style: {},
				tiles: [
					{
						features: [
							{
								geometry: {
									coordinates: [0.3, 0.4],
									type: 'Point',
								},
								key: 'featureKey11',
								properties: {
									attribute2: 105,
									fid: 'featureKey11',
								},
								type: 'Feature',
							},
						],
						level: 6,
						tile: '0,0',
					},
				],
			},
		};

		const output = Select.maps.getFinalLayerByDataSourceAndLayerState(
			spatialDataSource,
			layerState,
			null,
			attributeDataSourceKeyAttributeKeyPairs,
			mapKey,
			spatialRelationsFilter,
			attributeRelationsFilter,
			attributeDataFilter
		);
		assert.deepStrictEqual(output, expectedOutput);
		setState(null);
	});

	it('should select tiled-vector layer with missing "tiles" property, because missing viewport in map', () => {
		setState(stateWithoutViewport);
		const spatialDataSource = {
			key: 'spatialDataSource2',
			data: {
				type: 'tiled-vector',
				fidColumnName: 'fid',
			},
		};

		const layerState = {
			name: 'Point data 2',
			key: 'pointData2',
			opacity: 0,
			styleKey: 'style1',
		};

		const attributeDataSourceKeyAttributeKeyPairs = {
			attributeDataSource2: 'attribute2',
		};

		const mapKey = 'map1';

		const spatialRelationsFilter = {
			modifiers: {
				scopeKey: 'scope1',
				placeKey: 'place1',
			},
		};

		const attributeRelationsFilter = {
			modifiers: {
				scopeKey: 'scope1',
				placeKey: 'place1',
			},
		};

		const attributeDataFilter = {
			modifiers: {
				scopeKey: 'scope1',
				placeKey: 'place1',
			},
		};

		const expectedOutput = {
			key: `${layerState.key}_${spatialDataSource.key}`,
			layerKey: layerState.key,
			opacity: 0,
			name: 'Point data 2',
			type: 'tiled-vector',
			options: {
				fidColumnName: 'fid',
				geometryColumnName: undefined,
				style: {},
			},
		};

		const output = Select.maps.getFinalLayerByDataSourceAndLayerState(
			spatialDataSource,
			layerState,
			null,
			attributeDataSourceKeyAttributeKeyPairs,
			mapKey,
			spatialRelationsFilter,
			attributeRelationsFilter,
			attributeDataFilter
		);
		assert.deepStrictEqual(output, expectedOutput);
		setState(null);
	});
});
