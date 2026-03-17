import {assert} from 'chai';
import slash from 'slash';
import {isEqual as _isEqual, cloneDeep as _cloneDeep} from 'lodash';
import {createStore, combineReducers} from 'redux';
import {setState} from '@jvitela/recompute';
import actions from '../../../../src/state/Maps/actions';
import getStoreSet from '../../../store';
import {MapsSelectorsState} from '../selectors/_state';

import {resetFetch, setFetch} from '../../../../src/state/_common/request';
import MapsReducers from '../../../../src/state/Maps/reducers';
import AttributeDataReducer from '../../../../src/state/Data/AttributeData/reducers';
import AttributeRelationsReducer from '../../../../src/state/Data/AttributeRelations/reducers';
import AttributeDataSourcesReducer from '../../../../src/state/Data/AttributeDataSources/reducers';
import SpatialDataReducer from '../../../../src/state/Data/SpatialData/reducers';
import SpatialRelationsReducer from '../../../../src/state/Data/SpatialRelations/reducers';
import SpatialDataSourcesReducer from '../../../../src/state/Data/SpatialDataSources/reducers';
import StylesReducer from '../../../../src/state/Styles/reducers';
import AppReducers from '../../../../src/state/App/reducers';

describe('state/Maps/actions/setMapBackgroundLayer', function () {
	this.timeout(1000);
	afterEach(function () {
		resetFetch();
	});

	it('Dispatch setMapBackgroundLayer with full layer definition. Do not apply use.', function () {
		const storeHelpers = getStoreSet();
		const reducers = combineReducers({
			app: AppReducers,
			data: combineReducers({
				attributeData: AttributeDataReducer,
				attributeRelations: AttributeRelationsReducer,
				attributeDataSources: AttributeDataSourcesReducer,
				spatialData: SpatialDataReducer,
				spatialRelations: SpatialRelationsReducer,
				spatialDataSources: SpatialDataSourcesReducer,
			}),
			maps: MapsReducers,
			styles: StylesReducer,
		});
		const mapsState = _cloneDeep(MapsSelectorsState);
		const defaultState = {
			app: {
				key: 'testApp',
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: 'backend',
					requestPageSize: 1,
				},
			},
			maps: {
				...mapsState.maps,
				...{
					inUse: {maps: []},
					maps: {
						...mapsState.maps.maps,
						map1: {
							...mapsState.maps.maps.map1,
							data: {
								...mapsState.maps.maps.map1.data,
								viewport: {
									width: 10,
									height: 10,
								},
								view: {
									boxRange: 5000,
									center: {
										lat: 0.1,
										lon: 0.1,
									},
								},
							},
						},
					},
				},
			},
			data: {
				attributeData: {
					indexes: [],
					byDataSourceKey: {},
				},
				attributeRelations: {
					indexes: [],
				},
				attributeDataSources: {
					indexes: [],
				},
				spatialData: {
					indexes: [],
					byDataSourceKey: {},
				},
				spatialRelations: {
					indexes: [],
				},
				spatialDataSources: {
					indexes: [],
				},
			},
			styles: {
				indexes: [],
				inUse: {
					keys: [],
				},
			},
		};

		const store = createStore(reducers, defaultState);

		setState(store.getState());
		const getState = () => {
			return store.getState();
		};
		const dispatch = storeHelpers.getDispatch(getState, store.dispatch);

		dispatch(
			actions.setMapBackgroundLayer('map1', {
				type: 'wms',
				options: {
					url: 'http://cuzk.cz',
				},
			})
		);

		storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{
					type: 'MAPS.MAP.SET_BACKGROUND_LAYER',
					mapKey: 'map1',
					backgroundLayer: {
						type: 'wms',
						options: {
							url: 'http://cuzk.cz',
						},
					},
				},
			]);
		});
	});

	// FIXME temporary commented
	// it('Dispatch setMapBackgroundLayer with layerTemplateKey and apply use.', function () {
	// 	const storeHelpers = getStoreSet();
	// 	const reducers = combineReducers({
	// 		app: AppReducers,
	// 		data: combineReducers({
	// 			attributeData: AttributeDataReducer,
	// 			attributeRelations: AttributeRelationsReducer,
	// 			attributeDataSources: AttributeDataSourcesReducer,
	// 			spatialData: SpatialDataReducer,
	// 			spatialRelations: SpatialRelationsReducer,
	// 			spatialDataSources: SpatialDataSourcesReducer,
	// 		}),
	// 		maps: MapsReducers,
	// 		styles: StylesReducer,
	// 	});
	// 	const mapsState = _cloneDeep(MapsSelectorsState);
	// 	const defaultState = {
	// 		app: {
	// 			key: 'testApp',
	// 			localConfiguration: {
	// 				apiBackendProtocol: 'http',
	// 				apiBackendHost: 'localhost',
	// 				apiBackendPath: 'backend',
	// 				requestPageSize: 1,
	// 			},
	// 		},
	// 		maps: {
	// 			...mapsState.maps,
	// 			...{
	// 				inUse: {maps: []},
	// 				maps: {
	// 					...mapsState.maps.maps,
	// 					map1: {
	// 						...mapsState.maps.maps.map1,
	// 						data: {
	// 							...mapsState.maps.maps.map1.data,
	// 							viewport: {
	// 								width: 10,
	// 								height: 10,
	// 							},
	// 							view: {
	// 								boxRange: 5000,
	// 								center: {
	// 									lat: 0.1,
	// 									lon: 0.1,
	// 								},
	// 							},
	// 						},
	// 					},
	// 				},
	// 			},
	// 		},
	// 		data: {
	// 			attributeData: {
	// 				indexes: [],
	// 				byDataSourceKey: {},
	// 			},
	// 			attributeRelations: {
	// 				indexes: [],
	// 			},
	// 			attributeDataSources: {
	// 				indexes: [],
	// 			},
	// 			spatialData: {
	// 				indexes: [],
	// 				byDataSourceKey: {},
	// 			},
	// 			spatialRelations: {
	// 				indexes: [],
	// 			},
	// 			spatialDataSources: {
	// 				indexes: [],
	// 			},
	// 		},
	// 		styles: {
	// 			indexes: [],
	// 			inUse: {
	// 				keys: [],
	// 			},
	// 		},
	// 	};

	// 	const store = createStore(reducers, defaultState);

	// 	setState(store.getState());
	// 	const getState = () => {
	// 		return store.getState();
	// 	};

	// 	setFetch(function (url, options) {
	// 		if (
	// 			_isEqual(options, {
	// 				body: JSON.stringify({
	// 					layerTemplateKey: 'layerTemplateKey1',
	// 					relations: {
	// 						offset: 0,
	// 						limit: 1,
	// 						attribute: true,
	// 						spatial: true,
	// 						area: false,
	// 					},
	// 					data: {
	// 						spatialFilter: {
	// 							tiles: [['9.84375', '49.21875']],
	// 							level: 7,
	// 						},
	// 						geometry: true,
	// 					},
	// 				}),
	// 				credentials: 'include',
	// 				headers: {
	// 					Accept: 'application/json',
	// 					'Content-Type': 'application/json',
	// 				},
	// 				method: 'POST',
	// 			})
	// 		) {
	// 			assert.strictEqual('http://localhost/rest/data/filtered', slash(url));
	// 			return Promise.resolve({
	// 				ok: true,
	// 				json: function () {
	// 					return Promise.resolve({
	// 						spatialAttributeRelationsDataSources: {
	// 							total: {
	// 								attributeRelations: 0,
	// 								spatialRelations: 1,
	// 							},
	// 							offset: 0,
	// 							limit: 1000,
	// 							spatialRelations: [
	// 								{
	// 									key: 'aea42314-7480-4c52-9416-bc65df2f2af5',
	// 									data: {
	// 										scopeKey: null,
	// 										periodKey: null,
	// 										placeKey: null,
	// 										spatialDataSourceKey:
	// 											'd7616c35-3115-4fb4-8180-351e5139668a',
	// 										layerTemplateKey: '6fa5a08d-4247-49bf-9a7d-a65c19929aef',
	// 										scenarioKey: null,
	// 										caseKey: null,
	// 										applicationKey: null,
	// 									},
	// 								},
	// 							],
	// 							attributeRelations: [],
	// 							spatialDataSources: [
	// 								{
	// 									key: 'd7616c35-3115-4fb4-8180-351e5139668a',
	// 									data: {
	// 										nameInternal: null,
	// 										attribution: null,
	// 										type: 'wmts',
	// 										urls: [
	// 											'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
	// 										],
	// 									},
	// 								},
	// 							],
	// 							attributeDataSources: [],
	// 						},
	// 						spatialData: {},
	// 						attributeData: {},
	// 					});
	// 				},
	// 				headers: {
	// 					get: function (name) {
	// 						return {'Content-type': 'application/json'}[name];
	// 					},
	// 				},
	// 				data: options.body,
	// 			});
	// 		}
	// 	});

	// 	const dispatch = storeHelpers.getDispatch(getState, store.dispatch);

	// 	dispatch(
	// 		actions.setMapBackgroundLayer('map1', {
	// 			layerTemplateKey: 'layerTemplateKey1',
	// 		})
	// 	);

	// 	setTimeout(() => {
	// 		storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
	// 			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
	// 				{
	// 					type: 'MAPS.MAP.SET_BACKGROUND_LAYER',
	// 					mapKey: 'map1',
	// 					backgroundLayer: {
	// 						layerTemplateKey: 'layerTemplateKey1',
	// 					},
	// 				},
	// 				{
	// 					type: 'DATA.SPATIAL_DATA.INDEX.ADD',
	// 					filter: {
	// 						layerTemplateKey: 'layerTemplateKey1',
	// 					},
	// 					order: null,
	// 					indexData: [
	// 						{
	// 							7: {
	// 								'9.84375,49.21875': true,
	// 							},
	// 						},
	// 					],
	// 					changedOn: null,
	// 				},
	// 				{
	// 					type: 'DATA.ATTRIBUTE_DATA.SPATIAL_INDEX.ADD',
	// 					filter: {
	// 						layerTemplateKey: 'layerTemplateKey1',
	// 						styleKey: null,
	// 					},
	// 					order: null,
	// 					indexData: [
	// 						{
	// 							7: {
	// 								'9.84375,49.21875': true,
	// 							},
	// 						},
	// 					],
	// 					changedOn: null,
	// 				},
	// 				{
	// 					type: 'DATA.ATTRIBUTE_DATA.SPATIAL_INDEX.ADD',
	// 					filter: {
	// 						layerTemplateKey: 'layerTemplateKey1',
	// 						styleKey: null,
	// 					},
	// 					order: null,
	// 					indexData: [{}],
	// 					changedOn: null,
	// 				},
	// 				{
	// 					data: [
	// 						{
	// 							key: 'aea42314-7480-4c52-9416-bc65df2f2af5',
	// 							data: {
	// 								scopeKey: null,
	// 								periodKey: null,
	// 								placeKey: null,
	// 								spatialDataSourceKey: 'd7616c35-3115-4fb4-8180-351e5139668a',
	// 								layerTemplateKey: '6fa5a08d-4247-49bf-9a7d-a65c19929aef',
	// 								scenarioKey: null,
	// 								caseKey: null,
	// 								applicationKey: null,
	// 							},
	// 						},
	// 					],
	// 					filter: {
	// 						layerTemplateKey: 'layerTemplateKey1',
	// 					},
	// 					type: 'DATA.SPATIAL_RELATIONS.ADD',
	// 				},
	// 				{
	// 					filter: {
	// 						layerTemplateKey: 'layerTemplateKey1',
	// 					},
	// 					order: null,
	// 					count: 1,
	// 					start: 1,
	// 					data: [
	// 						{
	// 							key: 'aea42314-7480-4c52-9416-bc65df2f2af5',
	// 							data: {
	// 								scopeKey: null,
	// 								periodKey: null,
	// 								placeKey: null,
	// 								spatialDataSourceKey: 'd7616c35-3115-4fb4-8180-351e5139668a',
	// 								layerTemplateKey: '6fa5a08d-4247-49bf-9a7d-a65c19929aef',
	// 								scenarioKey: null,
	// 								caseKey: null,
	// 								applicationKey: null,
	// 							},
	// 						},
	// 					],
	// 					changedOn: null,
	// 					type: 'DATA.SPATIAL_RELATIONS.INDEX.ADD',
	// 				},
	// 				{
	// 					data: [
	// 						{
	// 							key: 'd7616c35-3115-4fb4-8180-351e5139668a',
	// 							data: {
	// 								nameInternal: null,
	// 								attribution: null,
	// 								type: 'wmts',
	// 								urls: [
	// 									'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
	// 								],
	// 							},
	// 						},
	// 					],
	// 					filter: {
	// 						layerTemplateKey: 'layerTemplateKey1',
	// 					},
	// 					type: 'DATA.SPATIAL_DATA_SOURCES.ADD',
	// 				},
	// 				{
	// 					filter: {
	// 						layerTemplateKey: 'layerTemplateKey1',
	// 					},
	// 					order: null,
	// 					count: 1,
	// 					start: 1,
	// 					data: [
	// 						{
	// 							key: 'd7616c35-3115-4fb4-8180-351e5139668a',
	// 							data: {
	// 								nameInternal: null,
	// 								attribution: null,
	// 								type: 'wmts',
	// 								urls: [
	// 									'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
	// 								],
	// 							},
	// 						},
	// 					],
	// 					changedOn: null,
	// 					type: 'DATA.SPATIAL_DATA_SOURCES.INDEX.ADD',
	// 				},
	// 				{
	// 					type: 'DATA.SPATIAL_DATA.INDEX.REMOVE',
	// 					filter: {
	// 						layerTemplateKey: 'layerTemplateKey1',
	// 					},
	// 					order: null,
	// 				},
	// 				{
	// 					type: 'DATA.ATTRIBUTE_DATA.SPATIAL_INDEX.REMOVE',
	// 					filter: {
	// 						layerTemplateKey: 'layerTemplateKey1',
	// 						styleKey: null,
	// 					},
	// 					order: null,
	// 				},
	// 			]);
	// 		});
	// 	}, 50);
	// });
});
