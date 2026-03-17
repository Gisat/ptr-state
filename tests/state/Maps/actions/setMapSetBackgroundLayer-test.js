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

import {responseWithRelationsSpatialAndAttributeData_1} from './mockData/data_2';
import {dispatchedActions} from './mockData/dispatched_actions_2';

// FIXME temporary commented
// describe('state/Maps/actions/setMapSetBackgroundLayer', function () {
// 	this.timeout(1000);
// 	afterEach(function () {
// 		resetFetch();
// 	});

// 	it('Dispatch setMapSetBackgroundLayer, apply use on each map in set', function (done) {
// 		const storeHelpers = getStoreSet();
// 		const reducers = combineReducers({
// 			app: AppReducers,
// 			data: combineReducers({
// 				attributeData: AttributeDataReducer,
// 				attributeRelations: AttributeRelationsReducer,
// 				attributeDataSources: AttributeDataSourcesReducer,
// 				spatialData: SpatialDataReducer,
// 				spatialRelations: SpatialRelationsReducer,
// 				spatialDataSources: SpatialDataSourcesReducer,
// 			}),
// 			maps: MapsReducers,
// 			styles: StylesReducer,
// 		});
// 		const mapsState = _cloneDeep(MapsSelectorsState);
// 		const defaultState = {
// 			app: {
// 				key: 'testApp',
// 				localConfiguration: {
// 					apiBackendProtocol: 'http',
// 					apiBackendHost: 'localhost',
// 					apiBackendPath: 'backend',
// 					requestPageSize: 1,
// 				},
// 			},
// 			maps: {
// 				...mapsState.maps,
// 				...{
// 					inUse: {maps: []},
// 					maps: {
// 						...mapsState.maps.maps,
// 						map1: {
// 							...mapsState.maps.maps.map1,
// 							data: {
// 								...mapsState.maps.maps.map1.data,
// 								viewport: {
// 									width: 10,
// 									height: 10,
// 								},
// 								view: {
// 									boxRange: 5000,
// 									center: {
// 										lat: 0.1,
// 										lon: 0.1,
// 									},
// 								},
// 							},
// 						},
// 						map2: {
// 							...mapsState.maps.maps.map2,
// 							data: {
// 								...mapsState.maps.maps.map2.data,
// 								viewport: {
// 									width: 10,
// 									height: 10,
// 								},
// 								view: {
// 									boxRange: 5000,
// 									center: {
// 										lat: 0.1,
// 										lon: 0.1,
// 									},
// 								},
// 							},
// 						},
// 					},
// 					sets: {
// 						...mapsState.maps.sets,
// 						set1: {
// 							...mapsState.maps.sets.set1,
// 							data: {
// 								...mapsState.maps.sets.set1.data,
// 								view: {
// 									center: {
// 										lat: 0.1,
// 										lon: 0.1,
// 									},
// 								},
// 							},
// 						},
// 					},
// 				},
// 			},
// 			data: {
// 				attributeData: {
// 					indexes: [],
// 					byDataSourceKey: {},
// 				},
// 				attributeRelations: {
// 					indexes: [],
// 				},
// 				attributeDataSources: {
// 					indexes: [],
// 				},
// 				spatialData: {
// 					indexes: [],
// 					byDataSourceKey: {},
// 				},
// 				spatialRelations: {
// 					indexes: [],
// 				},
// 				spatialDataSources: {
// 					indexes: [],
// 				},
// 			},
// 			styles: {
// 				indexes: [],
// 				inUse: {
// 					keys: [],
// 				},
// 			},
// 		};

// 		const store = createStore(reducers, defaultState);

// 		setState(store.getState());
// 		const getState = () => {
// 			return store.getState();
// 		};
// 		const dispatch = storeHelpers.getDispatch(getState, store.dispatch);

// 		setFetch(function (url, options) {
// 			if (
// 				url === 'http://localhost/be-metadata/nodes/style1' &&
// 				options.method === 'GET'
// 			) {
// 				return Promise.resolve({
// 					ok: true,
// 					json: function () {
// 						return Promise.resolve([
// 							{
// 								key: 'styleKey1',
// 								nodeType: 'styles',
// 								nameDisplay: null,
// 								nameInternal: null,
// 								description: null,
// 								source: null,
// 								nameGeoserver: null,
// 								definition: {
// 									rules: [
// 										{
// 											styles: [
// 												{
// 													attributeKey: '528ac373-b82f-44cb-a883-4f3ef5b13d07',
// 												},
// 											],
// 										},
// 									],
// 								},
// 								applicationKey: null,
// 								tagKeys: null,
// 							},
// 						]);
// 					},
// 					headers: {
// 						get: function (name) {
// 							return {'Content-type': 'application/json'}[name];
// 						},
// 					},
// 					data: options.body,
// 				});
// 			}
// 			if (
// 				url === 'http://localhost/be-metadata/nodes/style3' &&
// 				options.method === 'GET'
// 			) {
// 				return Promise.resolve({
// 					ok: true,
// 					json: function () {
// 						return Promise.resolve([
// 							{
// 								key: 'style2',
// 								nodeType: 'styles',
// 								nameDisplay: null,
// 								nameInternal: null,
// 								description: null,
// 								source: null,
// 								nameGeoserver: null,
// 								definition: {
// 									rules: [
// 										{
// 											styles: [
// 												{
// 													attributeKey: '99bc373-b82f-44cb-a883-4f3ef5b13d07',
// 												},
// 											],
// 										},
// 									],
// 								},
// 								applicationKey: null,
// 								tagKeys: null,
// 							},
// 						]);
// 					},
// 					headers: {
// 						get: function (name) {
// 							return {'Content-type': 'application/json'}[name];
// 						},
// 					},
// 					data: options.body,
// 				});
// 			}
// 			if (
// 				_isEqual(options, {
// 					body: JSON.stringify({
// 						layerTemplateKey: 'layerTemplateBackground',
// 						relations: {
// 							offset: 0,
// 							limit: 1,
// 							attribute: true,
// 							spatial: true,
// 							area: false,
// 						},
// 						data: {
// 							spatialFilter: {
// 								tiles: [['0', '0']],
// 								level: 7,
// 							},
// 							geometry: true,
// 						},
// 					}),
// 					credentials: 'include',
// 					headers: {
// 						Accept: 'application/json',
// 						'Content-Type': 'application/json',
// 					},
// 					method: 'POST',
// 				})
// 			) {
// 				assert.strictEqual('http://localhost/rest/data/filtered', slash(url));
// 				return Promise.resolve({
// 					ok: true,
// 					json: function () {
// 						return Promise.resolve(
// 							responseWithRelationsSpatialAndAttributeData_1
// 						);
// 					},
// 					headers: {
// 						get: function (name) {
// 							return {'Content-type': 'application/json'}[name];
// 						},
// 					},
// 					data: options.body,
// 				});
// 			}
// 			if (
// 				_isEqual(options, {
// 					body: JSON.stringify({
// 						modifiers: {
// 							scopeKey: 'scope1',
// 							periodKey: 'period1',
// 						},
// 						layerTemplateKey: 'layerTemplate2',
// 						relations: {
// 							offset: 0,
// 							limit: 1,
// 							attribute: true,
// 							spatial: true,
// 							area: false,
// 						},
// 						data: {
// 							spatialFilter: {
// 								tiles: [['0', '0']],
// 								level: 7,
// 							},
// 							geometry: true,
// 						},
// 					}),
// 					credentials: 'include',
// 					headers: {
// 						Accept: 'application/json',
// 						'Content-Type': 'application/json',
// 					},
// 					method: 'POST',
// 				})
// 			) {
// 				assert.strictEqual('http://localhost/rest/data/filtered', slash(url));
// 				return Promise.resolve({
// 					ok: true,
// 					json: function () {
// 						return Promise.resolve(
// 							responseWithRelationsSpatialAndAttributeData_1
// 						);
// 					},
// 					headers: {
// 						get: function (name) {
// 							return {'Content-type': 'application/json'}[name];
// 						},
// 					},
// 					data: options.body,
// 				});
// 			}
// 			if (
// 				_isEqual(options, {
// 					body: JSON.stringify({
// 						modifiers: {
// 							scopeKey: 'scope1',
// 							placeKey: 'place1',
// 							scenarioKey: {
// 								in: ['scenario1', 'scenario2'],
// 							},
// 						},
// 						layerTemplateKey: 'layerTemplate1',
// 						styleKey: 'style1',
// 						relations: {
// 							offset: 0,
// 							limit: 1,
// 							attribute: true,
// 							spatial: true,
// 							area: false,
// 						},
// 						data: {
// 							spatialFilter: {
// 								tiles: [['0', '0']],
// 								level: 7,
// 							},
// 							geometry: true,
// 						},
// 					}),
// 					credentials: 'include',
// 					headers: {
// 						Accept: 'application/json',
// 						'Content-Type': 'application/json',
// 					},
// 					method: 'POST',
// 				})
// 			) {
// 				assert.strictEqual('http://localhost/rest/data/filtered', slash(url));
// 				return Promise.resolve({
// 					ok: true,
// 					json: function () {
// 						return Promise.resolve(
// 							responseWithRelationsSpatialAndAttributeData_1
// 						);
// 					},
// 					headers: {
// 						get: function (name) {
// 							return {'Content-type': 'application/json'}[name];
// 						},
// 					},
// 					data: options.body,
// 				});
// 			}
// 			if (
// 				_isEqual(options, {
// 					body: JSON.stringify({
// 						modifiers: {
// 							scopeKey: 'scope1',
// 							placeKey: 'place2',
// 							periodKey: 'period2',
// 						},
// 						layerTemplateKey: 'layerTemplate3',
// 						styleKey: 'style3',
// 						relations: {
// 							offset: 0,
// 							limit: 1,
// 							attribute: true,
// 							spatial: true,
// 							area: false,
// 						},
// 						data: {
// 							spatialFilter: {
// 								tiles: [['0', '0']],
// 								level: 7,
// 							},
// 							geometry: true,
// 						},
// 					}),
// 					credentials: 'include',
// 					headers: {
// 						Accept: 'application/json',
// 						'Content-Type': 'application/json',
// 					},
// 					method: 'POST',
// 				})
// 			) {
// 				assert.strictEqual('http://localhost/rest/data/filtered', slash(url));
// 				return Promise.resolve({
// 					ok: true,
// 					json: function () {
// 						return Promise.resolve(
// 							responseWithRelationsSpatialAndAttributeData_1
// 						);
// 					},
// 					headers: {
// 						get: function (name) {
// 							return {'Content-type': 'application/json'}[name];
// 						},
// 					},
// 					data: options.body,
// 				});
// 			}
// 		});

// 		dispatch(
// 			actions.setMapSetBackgroundLayer('set1', {
// 				type: 'wms',
// 				options: {
// 					url: 'http://cuzk.cz',
// 				},
// 			})
// 		);

// 		setTimeout(() => {
// 			storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
// 				if (_isEqual(storeHelpers.getDispatchedActions(), dispatchedActions)) {
// 					done();
// 				} else {
// 					done(new Error());
// 				}
// 			});
// 		}, 50);
// 	});
// });
