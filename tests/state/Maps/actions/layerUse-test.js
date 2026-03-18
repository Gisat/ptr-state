import {assert} from 'chai';
import slash from 'slash';
import {isEqual as _isEqual} from 'lodash';
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

import {responseWithRelationsSpatialAndAttributeData_1} from './mockData/data_1';

describe('state/Maps/actions/layerUse', function () {
	afterEach(function () {
		resetFetch();
	});

	// FIXME temporary commented
	// it('Load one tile for one layer', function () {
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
	// 			inUse: {
	// 				sets: [],
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
	// 	const dispatch = storeHelpers.getDispatch(getState, store.dispatch);

	// 	setFetch(function (url, options) {
	// 		if (
	// 			url === 'http://localhost/be-metadata/nodes/styleKey1' &&
	// 			options.method === 'GET'
	// 		) {
	// 			return Promise.resolve({
	// 				ok: true,
	// 				json: function () {
	// 					return Promise.resolve([
	// 						{
	// 							key: 'styleKey1',
	// 							nodeType: 'styles',
	// 							nameDisplay: null,
	// 							nameInternal: null,
	// 							description: null,
	// 							source: null,
	// 							nameGeoserver: null,
	// 							definition: {
	// 								rules: [
	// 									{
	// 										styles: [
	// 											{
	// 												attributeKey: '528ac373-b82f-44cb-a883-4f3ef5b13d07',
	// 											},
	// 										],
	// 									},
	// 								],
	// 							},
	// 							applicationKey: null,
	// 							tagKeys: null,
	// 						},
	// 					]);
	// 				},
	// 				headers: {
	// 					get: function (name) {
	// 						return {'Content-type': 'application/json'}[name];
	// 					},
	// 				},
	// 				data: options.body,
	// 			});
	// 		}
	// 		if (
	// 			_isEqual(options, {
	// 				body: JSON.stringify({
	// 					modifiers: {
	// 						scopeKey: 'scope1',
	// 						applicationKey: 'testApp',
	// 					},
	// 					layerTemplateKey: 'layerTemplateKey1',
	// 					styleKey: 'styleKey1',
	// 					relations: {
	// 						offset: 0,
	// 						limit: 1,
	// 						attribute: true,
	// 						spatial: true,
	// 						area: false,
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
	// 					return Promise.resolve(
	// 						responseWithRelationsSpatialAndAttributeData_1
	// 					);
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

	// 	const layerState = {
	// 		styleKey: 'styleKey1', //cause styleKeyUse
	// 		key: 'layerKey1',
	// 		metadataModifiers: {
	// 			scopeKey: 'scope1',
	// 		},
	// 		layerTemplateKey: 'layerTemplateKey1',
	// 		areaTreeLevelKey: null,
	// 		filterByActive: {
	// 			application: true,
	// 		},
	// 		options: {
	// 			attributeFilter: null,
	// 			dataSourceKeys: null,
	// 			featureKeys: null,
	// 		},
	// 	};

	// 	const spatialFilter = {
	// 		tiles: [['0', '0']],
	// 		level: 7,
	// 	};
	// 	dispatch(actions.layerUse(layerState, spatialFilter));

	// 	return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
	// 		assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
	// 			{
	// 				componentId: 'layerKey1_layerUse',
	// 				keys: ['styleKey1'],
	// 				type: 'STYLES.USE.KEYS.REGISTER',
	// 			},
	// 			{
	// 				type: 'DATA.SPATIAL_DATA.INDEX.ADD',
	// 				filter: {
	// 					modifiers: {
	// 						scopeKey: 'scope1',
	// 						applicationKey: 'testApp',
	// 					},
	// 					layerTemplateKey: 'layerTemplateKey1',
	// 				},
	// 				order: null,
	// 				indexData: [
	// 					{
	// 						7: {
	// 							'0,0': true,
	// 						},
	// 					},
	// 				],
	// 				changedOn: null,
	// 			},
	// 			{
	// 				type: 'DATA.ATTRIBUTE_DATA.SPATIAL_INDEX.ADD',
	// 				filter: {
	// 					modifiers: {
	// 						scopeKey: 'scope1',
	// 						applicationKey: 'testApp',
	// 					},
	// 					layerTemplateKey: 'layerTemplateKey1',
	// 					styleKey: 'styleKey1',
	// 				},
	// 				order: null,
	// 				indexData: [
	// 					{
	// 						7: {
	// 							'0,0': true,
	// 						},
	// 					},
	// 				],
	// 				changedOn: null,
	// 			},
	// 			{
	// 				data: [
	// 					{
	// 						key: 'styleKey1',
	// 						data: {
	// 							nameDisplay: null,
	// 							nameInternal: null,
	// 							description: null,
	// 							source: null,
	// 							nameGeoserver: null,
	// 							definition: {
	// 								rules: [
	// 									{
	// 										styles: [
	// 											{
	// 												attributeKey: '528ac373-b82f-44cb-a883-4f3ef5b13d07',
	// 											},
	// 										],
	// 									},
	// 								],
	// 							},
	// 							applicationKey: null,
	// 							tagKeys: null,
	// 						},
	// 					},
	// 				],
	// 				filter: undefined,
	// 				type: 'STYLES.ADD',
	// 			},
	// 			{
	// 				data: [
	// 					{
	// 						key: '530c6982-af2a-4c2a-8fad-69c07f7d76e7',
	// 						data: {
	// 							areaTreeLevelKey: null,
	// 							attributeSetKey: null,
	// 							attributeKey: '528ac373-b82f-44cb-a883-4f3ef5b13d07',
	// 							attributeDataSourceKey: '55f48ed1-ee67-47bd-a044-8985662ec29f',
	// 							scopeKey: 'scope1',
	// 							periodKey: null,
	// 							placeKey: null,
	// 							spatialDataSourceKey: null,
	// 							layerTemplateKey: 'layerTemplateKey1',
	// 							scenarioKey: null,
	// 							caseKey: null,
	// 							applicationKey: 'testApp',
	// 						},
	// 					},
	// 				],
	// 				filter: {
	// 					modifiers: {
	// 						scopeKey: 'scope1',
	// 						applicationKey: 'testApp',
	// 					},
	// 					layerTemplateKey: 'layerTemplateKey1',
	// 					styleKey: 'styleKey1',
	// 				},
	// 				type: 'DATA.ATTRIBUTE_RELATIONS.ADD',
	// 			},
	// 			{
	// 				filter: {
	// 					modifiers: {
	// 						scopeKey: 'scope1',
	// 						applicationKey: 'testApp',
	// 					},
	// 					layerTemplateKey: 'layerTemplateKey1',
	// 					styleKey: 'styleKey1',
	// 				},
	// 				order: null,
	// 				count: 1,
	// 				start: 1,
	// 				data: [
	// 					{
	// 						key: '530c6982-af2a-4c2a-8fad-69c07f7d76e7',
	// 						data: {
	// 							areaTreeLevelKey: null,
	// 							attributeSetKey: null,
	// 							attributeKey: '528ac373-b82f-44cb-a883-4f3ef5b13d07',
	// 							attributeDataSourceKey: '55f48ed1-ee67-47bd-a044-8985662ec29f',
	// 							scopeKey: 'scope1',
	// 							periodKey: null,
	// 							placeKey: null,
	// 							spatialDataSourceKey: null,
	// 							layerTemplateKey: 'layerTemplateKey1',
	// 							scenarioKey: null,
	// 							caseKey: null,
	// 							applicationKey: 'testApp',
	// 						},
	// 					},
	// 				],
	// 				changedOn: null,
	// 				type: 'DATA.ATTRIBUTE_RELATIONS.INDEX.ADD',
	// 			},
	// 			{
	// 				data: [
	// 					{
	// 						key: '55f48ed1-ee67-47bd-a044-8985662ec29f',
	// 						data: {
	// 							nameInternal: 'gadm36_fra_4#num4',
	// 							attribution: null,
	// 							tableName: 'gadm36_FRA_4',
	// 							columnName: 'num4',
	// 							fidColumnName: 'ogc_fid',
	// 						},
	// 					},
	// 				],
	// 				filter: {
	// 					modifiers: {
	// 						scopeKey: 'scope1',
	// 						applicationKey: 'testApp',
	// 					},
	// 					layerTemplateKey: 'layerTemplateKey1',
	// 					styleKey: 'styleKey1',
	// 				},
	// 				type: 'DATA.ATTRIBUTE_DATA_SOURCES.ADD',
	// 			},
	// 			{
	// 				filter: {
	// 					modifiers: {
	// 						scopeKey: 'scope1',
	// 						applicationKey: 'testApp',
	// 					},
	// 					layerTemplateKey: 'layerTemplateKey1',
	// 					styleKey: 'styleKey1',
	// 				},
	// 				order: null,
	// 				count: 1,
	// 				start: 1,
	// 				data: [
	// 					{
	// 						key: '55f48ed1-ee67-47bd-a044-8985662ec29f',
	// 						data: {
	// 							nameInternal: 'gadm36_fra_4#num4',
	// 							attribution: null,
	// 							tableName: 'gadm36_FRA_4',
	// 							columnName: 'num4',
	// 							fidColumnName: 'ogc_fid',
	// 						},
	// 					},
	// 				],
	// 				changedOn: null,
	// 				type: 'DATA.ATTRIBUTE_DATA_SOURCES.INDEX.ADD',
	// 			},
	// 			{
	// 				type: 'DATA.ATTRIBUTE_DATA.ADD_WITH_SPATIAL_INDEX',
	// 				attributeDataSourceKey: '55f48ed1-ee67-47bd-a044-8985662ec29f',
	// 				data: {
	// 					18502: '27',
	// 				},
	// 				filter: {
	// 					modifiers: {
	// 						scopeKey: 'scope1',
	// 						applicationKey: 'testApp',
	// 					},
	// 					layerTemplateKey: 'layerTemplateKey1',
	// 					styleKey: 'styleKey1',
	// 				},
	// 				order: null,
	// 				indexData: [
	// 					{
	// 						7: {
	// 							'0,0': {
	// 								'55f48ed1-ee67-47bd-a044-8985662ec29f': [18502],
	// 							},
	// 						},
	// 					},
	// 				],
	// 				changedOn: null,
	// 			},
	// 			{
	// 				data: [
	// 					{
	// 						key: '8b0e266c-40d4-4bfe-ad75-964d9af1f57f',
	// 						data: {
	// 							scopeKey: 'scope1',
	// 							periodKey: null,
	// 							placeKey: null,
	// 							spatialDataSourceKey: null,
	// 							layerTemplateKey: 'layerTemplateKey1',
	// 							scenarioKey: null,
	// 							caseKey: null,
	// 							applicationKey: 'testApp',
	// 						},
	// 					},
	// 				],
	// 				filter: {
	// 					modifiers: {
	// 						scopeKey: 'scope1',
	// 						applicationKey: 'testApp',
	// 					},
	// 					layerTemplateKey: 'layerTemplateKey1',
	// 				},
	// 				type: 'DATA.SPATIAL_RELATIONS.ADD',
	// 			},
	// 			{
	// 				filter: {
	// 					modifiers: {
	// 						scopeKey: 'scope1',
	// 						applicationKey: 'testApp',
	// 					},
	// 					layerTemplateKey: 'layerTemplateKey1',
	// 				},
	// 				order: null,
	// 				count: 1,
	// 				start: 1,
	// 				data: [
	// 					{
	// 						key: '8b0e266c-40d4-4bfe-ad75-964d9af1f57f',
	// 						data: {
	// 							scopeKey: 'scope1',
	// 							periodKey: null,
	// 							placeKey: null,
	// 							spatialDataSourceKey: null,
	// 							layerTemplateKey: 'layerTemplateKey1',
	// 							scenarioKey: null,
	// 							caseKey: null,
	// 							applicationKey: 'testApp',
	// 						},
	// 					},
	// 				],
	// 				changedOn: null,
	// 				type: 'DATA.SPATIAL_RELATIONS.INDEX.ADD',
	// 			},
	// 			{
	// 				data: [
	// 					{
	// 						key: '848e2559-936d-4262-a808-4c87aa60217d',
	// 						data: {
	// 							nameInternal: 'gadm36_deu_4',
	// 							attribution: null,
	// 							type: 'tiledVector',
	// 							layerName: null,
	// 							tableName: 'gadm36_DEU_4',
	// 							fidColumnName: 'ogc_fid',
	// 							geometryColumnName: 'geom',
	// 						},
	// 					},
	// 				],
	// 				filter: {
	// 					modifiers: {
	// 						scopeKey: 'scope1',
	// 						applicationKey: 'testApp',
	// 					},
	// 					layerTemplateKey: 'layerTemplateKey1',
	// 				},
	// 				type: 'DATA.SPATIAL_DATA_SOURCES.ADD',
	// 			},
	// 			{
	// 				filter: {
	// 					modifiers: {
	// 						scopeKey: 'scope1',
	// 						applicationKey: 'testApp',
	// 					},
	// 					layerTemplateKey: 'layerTemplateKey1',
	// 				},
	// 				order: null,
	// 				count: 1,
	// 				start: 1,
	// 				data: [
	// 					{
	// 						key: '848e2559-936d-4262-a808-4c87aa60217d',
	// 						data: {
	// 							nameInternal: 'gadm36_deu_4',
	// 							attribution: null,
	// 							type: 'tiledVector',
	// 							layerName: null,
	// 							tableName: 'gadm36_DEU_4',
	// 							fidColumnName: 'ogc_fid',
	// 							geometryColumnName: 'geom',
	// 						},
	// 					},
	// 				],
	// 				changedOn: null,
	// 				type: 'DATA.SPATIAL_DATA_SOURCES.INDEX.ADD',
	// 			},
	// 			{
	// 				type: 'DATA.SPATIAL_DATA.ADD_WITH_TILED_INDEX',
	// 				dataByDataSourceKey: {
	// 					'848e2559-936d-4262-a808-4c87aa60217d': {
	// 						18502: {
	// 							type: 'MultiPolygon',
	// 							coordinates: [
	// 								[
	// 									[
	// 										[2.50647283, 50.63433838],
	// 										[2.5012393, 50.63986206],
	// 										[2.50829029, 50.64472198],
	// 										[2.50647283, 50.63433838],
	// 									],
	// 								],
	// 							],
	// 						},
	// 					},
	// 				},
	// 				level: '7',
	// 				filter: {
	// 					modifiers: {
	// 						scopeKey: 'scope1',
	// 						applicationKey: 'testApp',
	// 					},
	// 					layerTemplateKey: 'layerTemplateKey1',
	// 				},
	// 				order: null,
	// 				indexData: [
	// 					{
	// 						7: {
	// 							'0,0': {
	// 								'848e2559-936d-4262-a808-4c87aa60217d': [18502],
	// 							},
	// 						},
	// 					},
	// 				],
	// 				changedOn: null,
	// 			},
	// 		]);
	// 	});
	// });

	it('Load nothing, spatialDataSource is already loaded and is WMS typy', function () {
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
				inUse: {
					sets: [],
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
					// XXX
					byKey: {
						'848e2559-936d-4262-a808-4c87aa60217d': {
							key: '848e2559-936d-4262-a808-4c87aa60217d',
							data: {
								nameInternal: 'gadm36_deu_4',
								attribution: null,
								type: 'wms',
								layerName: null,
								tableName: 'gadm36_DEU_4',
								fidColumnName: 'ogc_fid',
								geometryColumnName: 'geom',
							},
						},
					},
					indexes: [
						{
							changedOn: null,
							count: 1,
							filter: {
								layerTemplateKey: 'layerTemplateKey1',
								modifiers: {
									scopeKey: 'scope1',
									applicationKey: 'testApp',
								},
							},
							index: {1: '848e2559-936d-4262-a808-4c87aa60217d'},
							order: null,
						},
					],
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

		const layerState = {
			styleKey: 'styleKey1', //cause styleKeyUse
			key: 'layerKey1',
			metadataModifiers: {
				scopeKey: 'scope1',
			},
			layerTemplateKey: 'layerTemplateKey1',
			areaTreeLevelKey: null,
			filterByActive: {
				application: true,
			},
			options: {
				attributeFilter: null,
				dataSourceKeys: null,
				featureKeys: null,
			},
		};

		const spatialFilter = {
			tiles: [['0', '0']],
			level: 7,
		};
		dispatch(actions.layerUse(layerState, spatialFilter));

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), []);
		});
	});
});
