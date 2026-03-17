import {assert} from 'chai';
import slash from 'slash';
import {isEqual as _isEqual, cloneDeep as _cloneDeep} from 'lodash';
import {createStore, combineReducers} from 'redux';
import {setState} from '@jvitela/recompute';
import actions from '../../../../src/state/Maps/actions';
import getStoreSet from '../../../store';

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
import {expectedActions1} from './helpers/setMapSetLayers/expectedActions';
import {dataEndpointResponse1} from './helpers/setMapSetLayers/dataEndpointResponses';

describe('state/Maps/actions/setMapSetLayers', function () {
	this.timeout(1000);
	afterEach(function () {
		resetFetch();
	});

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
			activeSetKey: null,
			activeMapKey: null,
			inUse: {
				maps: ['map1'],
				sets: [],
			},
			maps: {
				map1: {
					key: 'map1',
					data: {
						viewport: {
							width: 10,
							height: 10,
						},
					},
				},
			},
			sets: {
				set1: {
					key: 'set1',
					maps: ['map1'],
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
	};

	// FIXME temporary commented
	// it('Dispatch setMapSetLayers', function (done) {
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
	// 					},
	// 					data: {
	// 						spatialFilter: {
	// 							tiles: [['0', '0']],
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
	// 					return Promise.resolve(dataEndpointResponse1);
	// 				},
	// 				headers: {
	// 					get: function (name) {
	// 						return {'Content-type': 'application/json'}[name];
	// 					},
	// 				},
	// 				data: options.body,
	// 			});
	// 		}

	// 		// Resolve requestswe do not carry on
	// 		return Promise.resolve({
	// 			ok: true,
	// 			json: function () {
	// 				return Promise.resolve({});
	// 			},
	// 			headers: {
	// 				get: function (name) {
	// 					return {'Content-type': 'application/json'}[name];
	// 				},
	// 			},
	// 			data: options.body,
	// 		});
	// 	});

	// 	const dispatch = storeHelpers.getDispatch(getState, store.dispatch);
	// 	dispatch(
	// 		actions.setMapSetLayers('set1', [
	// 			{
	// 				key: 'layer1',
	// 				layerTemplateKey: 'layerTemplateKey1',
	// 			},
	// 		])
	// 	);

	// 	setTimeout(() => {
	// 		storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
	// 			const dispatchedActions = storeHelpers.getDispatchedActions();
	// 			if (_isEqual(dispatchedActions, expectedActions1)) {
	// 				done();
	// 			} else {
	// 				done(
	// 					new Error(
	// 						`Dispatched actions are different from expected. Dispatched: ${JSON.stringify(
	// 							dispatchedActions
	// 						)}, expected: ${JSON.stringify(expectedActions1)}`
	// 					)
	// 				);
	// 			}
	// 		});
	// 	}, 50);
	// });

	it('Dispatch setMapSetLayers, but do not call use', function (done) {
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

		const expectedActions = [
			{
				type: 'MAPS.SET.LAYERS.SET',
				setKey: 'set1',
				layers: [
					{
						type: 'wmts',
						options: {
							url: 'http://wmts.eu',
						},
					},
				],
			},
		];

		const store = createStore(reducers, defaultState);

		setState(store.getState());
		const getState = () => {
			return store.getState();
		};
		const dispatch = storeHelpers.getDispatch(getState, store.dispatch);
		dispatch(
			actions.setMapSetLayers('set1', [
				{
					type: 'wmts',
					options: {
						url: 'http://wmts.eu',
					},
				},
			])
		);

		setTimeout(() => {
			storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
				const dispatchedActions = storeHelpers.getDispatchedActions();

				if (_isEqual(dispatchedActions, expectedActions)) {
					done();
				} else {
					done(
						new Error(
							`Dispatched actions are different from expected. Dispatched: ${JSON.stringify(
								dispatchedActions
							)}, expected: ${JSON.stringify(expectedActions)}`
						)
					);
				}
			});
		}, 50);
	});

	it('dispatch error, if map for given key was not found', function () {
		const storeHelpers = getStoreSet();
		const reducers = combineReducers({
			maps: MapsReducers,
		});

		const store = createStore(reducers, defaultState);

		setState(store.getState());
		const getState = () => {
			return store.getState();
		};
		const dispatch = storeHelpers.getDispatch(getState, store.dispatch);
		dispatch(
			actions.setMapSetLayers('setXY', [
				{
					type: 'wms',
					options: {
						url: 'http://cuzk.cz',
					},
				},
				{
					type: 'wmts',
					options: {
						url: 'http://wmts.eu',
					},
				},
			])
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{
					type: 'ERROR',
				},
			]);
		});
	});
});
