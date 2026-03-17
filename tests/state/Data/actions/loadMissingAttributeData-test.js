import {createStore, combineReducers} from 'redux';
import {assert} from 'chai';
import _ from 'lodash';
import slash from 'slash';
import actions from '../../../../src/state/Data/actions';
import {resetFetch, setFetch} from '../../../../src/state/_common/request';
import AttributeDataReducer from '../../../../src/state/Data/AttributeData/reducers';
import AttributeRelationsReducer from '../../../../src/state/Data/AttributeRelations/reducers';
import AttributeDataSourcesReducer from '../../../../src/state/Data/AttributeDataSources/reducers';
import SpatialDataReducer from '../../../../src/state/Data/SpatialData/reducers';
import SpatialRelationsReducer from '../../../../src/state/Data/SpatialRelations/reducers';
import SpatialDataSourcesReducer from '../../../../src/state/Data/SpatialDataSources/reducers';
import AppReducers from '../../../../src/state/App/reducers';
import getStoreSet from '../../../store';
import {
	responseWithRelationsSpatialAndAttributeData_1,
	responseWithRelationsSpatialAndAttributeData_2,
	responseWithAttributeData_1,
	responseWithAttributeData_2,
} from './mockData/mockData_3';

describe('state/Data/actions/loadMissingAttributeData', function () {
	afterEach(function () {
		resetFetch();
	});
	it('dispatch error because of missing spatialFilter', function () {
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
		});

		const defaultState = {
			app: {
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: 'backend',
				},
				data: {
					attributeData: {
						indexes: [],
					},
					attributeRelations: {
						indexes: [],
					},
					attributeDataSources: {
						indexes: [],
					},
					spatialData: {
						indexes: [],
					},
					spatialRelations: {
						indexes: [],
					},
					spatialDataSources: {
						indexes: [],
					},
				},
			},
		};

		const store = createStore(reducers, defaultState);

		const getState = () => {
			return store.getState();
		};

		const dispatch = storeHelpers.getDispatch(getState, store.dispatch);

		const spatialFilter = {};
		const styleKey = 'xxx';
		const order = null;
		const spatialRelationsFilter = {};
		const attributeRelationsFilter = {};
		const attributeDataFilter = {};

		dispatch(
			actions.loadMissingAttributeData(
				spatialFilter,
				styleKey,
				order,
				spatialRelationsFilter,
				attributeRelationsFilter,
				attributeDataFilter
			)
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{type: 'ERROR'},
			]);
		});
	});

	it('request and proceed relations and attribute data', function () {
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
		});

		const defaultState = {
			app: {
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: 'backend',
					requestPageSize: 1,
				},
			},
			data: {
				attributeData: {
					byDataSourceKey: {},
					indexes: [],
				},
				attributeRelations: {
					indexes: [],
				},
				attributeDataSources: {
					indexes: [],
				},
				spatialData: {
					byDataSourceKey: {},
					indexes: [],
				},
				spatialRelations: {
					indexes: [],
				},
				spatialDataSources: {
					indexes: [],
				},
			},
		};

		const store = createStore(reducers, defaultState);

		const getState = () => {
			return store.getState();
		};

		setFetch(function (url, options) {
			assert.strictEqual('http://localhost/rest/data/filtered', slash(url));
			if (
				_.isEqual(options, {
					body: JSON.stringify({
						modifiers: {
							scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
							placeKey: {
								in: [
									'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
									'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								],
							},
							caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
							periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
						},
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
						styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
						relations: {
							offset: 0,
							limit: 1,
							attribute: true,
							spatial: true,
							area: false,
						},
						data: {
							spatialFilter: {
								tiles: [
									['0', '1'],
									['0', '2'],
								],
								level: 7,
							},
							geometry: false,
						},
					}),
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					method: 'POST',
				})
			) {
				return Promise.resolve({
					ok: true,
					json: function () {
						return Promise.resolve(
							// add spatial relation
							{
								...responseWithRelationsSpatialAndAttributeData_1,
								spatialAttributeRelationsDataSources: {
									...responseWithRelationsSpatialAndAttributeData_1.spatialAttributeRelationsDataSources,
									spatialRelations: [],
									spatialDataSources: [
										{
											key: '9375d96e-ba66-4291-9251-e1cd7586e32e',
											data: {
												nameInternal:
													'spatial_surface_dynamics_berlin_showcase_c',
												attribution: null,
												type: 'tiledVector',
												layerName: 'Berlin',
												tableName: 'Berlin',
												fidColumnName: 'ogc_fid',
												geometryColumnName: 'geom',
											},
										},
									],
								},
							}
						);
					},
					headers: {
						get: function (name) {
							return {'Content-type': 'application/json'}[name];
						},
					},
					data: options.body,
				});
			}

			if (
				_.isEqual(options, {
					body: JSON.stringify({
						modifiers: {
							scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
							placeKey: {
								in: [
									'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
									'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								],
							},
							caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
							periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
						},
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
						styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
						relations: {
							offset: 1,
							limit: 1,
							attribute: false,
							spatial: true,
							area: false,
						},
						data: {
							spatialIndex: {tiles: [['0', '2']]},
							spatialFilter: {
								tiles: [
									['0', '1'],
									['0', '2'],
								],
								level: 7,
							},
							geometry: false,
						},
					}),
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					method: 'POST',
				})
			) {
				return Promise.resolve({
					ok: true,
					json: function () {
						return Promise.resolve(
							responseWithRelationsSpatialAndAttributeData_2
						);
					},
					headers: {
						get: function (name) {
							return {'Content-type': 'application/json'}[name];
						},
					},
					data: options.body,
				});
			}
		});

		const dispatch = storeHelpers.getDispatch(getState, store.dispatch);

		const modifiers = {
			scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
			placeKey: {
				in: [
					'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
					'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
				],
			},
			caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
			periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
		};

		const styleKey = '460372b1-4fce-4676-92be-b1656a5415f5';
		const layerTemplateKey = '11c7cc1b-9834-4e85-aba6-eab5571705e4';
		const spatialRelationsFilter = {
			layerTemplateKey: layerTemplateKey,
			modifiers: modifiers,
		};
		const attributeRelationsFilter = {
			...spatialRelationsFilter,
			styleKey,
		};
		const attributeDataFilter = {
			...attributeRelationsFilter,
		};

		const spatialFilter = {
			tiles: [
				['0', '1'],
				['0', '2'],
			],
			level: 7,
		};
		const order = null;

		dispatch(
			actions.loadMissingAttributeData(
				spatialFilter,
				styleKey,
				order,
				spatialRelationsFilter,
				attributeRelationsFilter,
				attributeDataFilter
			)
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{
					type: 'DATA.ATTRIBUTE_DATA.SPATIAL_INDEX.ADD',
					filter: {
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
						modifiers: {
							scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
							placeKey: {
								in: [
									'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
									'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								],
							},
							caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
							periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
						},
						styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
					},
					order: null,
					indexData: [
						{
							7: {
								'0,1': true,
								'0,2': true,
							},
						},
					],
					changedOn: null,
				},
				{
					data: [
						{
							key: '530c6982-af2a-4c2a-8fad-69c07f7d76e7',
							data: {
								scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
								periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
								placeKey: '8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
								attributeDataSourceKey: '55f48ed1-ee67-47bd-a044-8985662ec29f',
								layerTemplateKey: '758b72dd-76a8-4792-8e9f-bbf13784e992',
								scenarioKey: null,
								caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
								attributeSetKey: null,
								attributeKey: '528ac373-b82f-44cb-a883-4f3ef5b13d07',
								areaTreeLevelKey: null,
								applicationKey: null,
							},
						},
					],
					filter: {
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
						modifiers: {
							scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
							placeKey: {
								in: [
									'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
									'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								],
							},
							caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
							periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
						},
						styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
					},
					type: 'DATA.ATTRIBUTE_RELATIONS.ADD',
				},
				{
					filter: {
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
						modifiers: {
							scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
							placeKey: {
								in: [
									'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
									'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								],
							},
							caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
							periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
						},
						styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
					},
					order: null,
					count: 1,
					start: 1,
					data: [
						{
							key: '530c6982-af2a-4c2a-8fad-69c07f7d76e7',
							data: {
								scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
								periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
								placeKey: '8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
								attributeDataSourceKey: '55f48ed1-ee67-47bd-a044-8985662ec29f',
								layerTemplateKey: '758b72dd-76a8-4792-8e9f-bbf13784e992',
								scenarioKey: null,
								caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
								attributeSetKey: null,
								attributeKey: '528ac373-b82f-44cb-a883-4f3ef5b13d07',
								areaTreeLevelKey: null,
								applicationKey: null,
							},
						},
					],
					changedOn: null,
					type: 'DATA.ATTRIBUTE_RELATIONS.INDEX.ADD',
				},
				{
					data: [
						{
							key: '55f48ed1-ee67-47bd-a044-8985662ec29f',
							data: {
								nameInternal: 'gadm36_fra_4#num4',
								attribution: null,
								tableName: 'gadm36_FRA_4',
								columnName: 'num4',
								fidColumnName: 'ogc_fid',
							},
						},
					],
					filter: {
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
						modifiers: {
							scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
							placeKey: {
								in: [
									'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
									'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								],
							},
							caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
							periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
						},
						styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
					},
					type: 'DATA.ATTRIBUTE_DATA_SOURCES.ADD',
				},
				{
					filter: {
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
						modifiers: {
							scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
							placeKey: {
								in: [
									'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
									'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								],
							},
							caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
							periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
						},
						styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
					},
					order: null,
					count: 1,
					start: 1,
					data: [
						{
							key: '55f48ed1-ee67-47bd-a044-8985662ec29f',
							data: {
								nameInternal: 'gadm36_fra_4#num4',
								attribution: null,
								tableName: 'gadm36_FRA_4',
								columnName: 'num4',
								fidColumnName: 'ogc_fid',
							},
						},
					],
					changedOn: null,
					type: 'DATA.ATTRIBUTE_DATA_SOURCES.INDEX.ADD',
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.ADD_WITH_SPATIAL_INDEX',
					attributeDataSourceKey: '55f48ed1-ee67-47bd-a044-8985662ec29f',
					data: {
						18502: '27',
					},
					filter: {
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
						modifiers: {
							scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
							placeKey: {
								in: [
									'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
									'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								],
							},
							caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
							periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
						},
						styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
					},
					order: null,
					indexData: [{}],
					changedOn: null,
				},
				{
					data: [
						{
							key: '9375d96e-ba66-4291-9251-e1cd7586e32e',
							data: {
								nameInternal: 'spatial_surface_dynamics_berlin_showcase_c',
								attribution: null,
								type: 'tiledVector',
								layerName: 'Berlin',
								tableName: 'Berlin',
								fidColumnName: 'ogc_fid',
								geometryColumnName: 'geom',
							},
						},
					],
					filter: {
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
						modifiers: {
							scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
							placeKey: {
								in: [
									'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
									'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								],
							},
							caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
							periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
						},
					},
					type: 'DATA.SPATIAL_DATA_SOURCES.ADD',
				},
				{
					filter: {
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
						modifiers: {
							scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
							placeKey: {
								in: [
									'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
									'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								],
							},
							caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
							periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
						},
					},
					order: null,
					count: 2,
					start: 1,
					data: [
						{
							key: '9375d96e-ba66-4291-9251-e1cd7586e32e',
							data: {
								nameInternal: 'spatial_surface_dynamics_berlin_showcase_c',
								attribution: null,
								type: 'tiledVector',
								layerName: 'Berlin',
								tableName: 'Berlin',
								fidColumnName: 'ogc_fid',
								geometryColumnName: 'geom',
							},
						},
					],
					changedOn: null,
					type: 'DATA.SPATIAL_DATA_SOURCES.INDEX.ADD',
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.ADD_WITH_SPATIAL_INDEX',
					attributeDataSourceKey: '55f48ed1-ee67-47bd-a044-8985662ec29f',
					data: {
						18503: '30',
					},
					filter: {
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
						modifiers: {
							scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
							placeKey: {
								in: [
									'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
									'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								],
							},
							caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
							periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
						},
						styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
					},
					order: null,
					indexData: [{}],
					changedOn: null,
				},
			]);
		});
	});

	it('request and proceed attribute data.', function () {
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
		});

		//default state includes loaded attribute relations
		const defaultState = {
			app: {
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: 'backend',
					requestPageSize: 1,
				},
			},
			data: {
				attributeData: {
					byDataSourceKey: {},
					indexes: [],
				},
				attributeRelations: {
					activeKey: null,
					byKey: {
						'530c6982-af2a-4c2a-8fad-69c07f7d76e7': {
							key: '530c6982-af2a-4c2a-8fad-69c07f7d76e7',
							data: {
								scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
								periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
								placeKey: '8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
								attributeDataSourceKey: '55f48ed1-ee67-47bd-a044-8985662ec29f',
								layerTemplateKey: '758b72dd-76a8-4792-8e9f-bbf13784e992',
								scenarioKey: null,
								caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
								attributeSetKey: null,
								attributeKey: '528ac373-b82f-44cb-a883-4f3ef5b13d07',
								areaTreeLevelKey: null,
								applicationKey: null,
							},
						},
					},
					count: null,
					editedByKey: null,
					indexes: [
						{
							filter: {
								layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
								modifiers: {
									scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
									placeKey: {
										in: [
											'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
											'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
										],
									},
									caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
									periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
								},
								styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
							},
							order: null,
							count: 1,
							changedOn: null,
							index: {
								1: '530c6982-af2a-4c2a-8fad-69c07f7d76e7',
							},
						},
					],
					inUse: {
						indexes: null,
						keys: null,
					},
					lastChangedOn: null,
					loading: false,
					loadingKeys: null,
				},
				attributeDataSources: {
					activeKey: null,
					byKey: {
						'55f48ed1-ee67-47bd-a044-8985662ec29f': {
							key: '55f48ed1-ee67-47bd-a044-8985662ec29f',
							data: {
								nameInternal: 'gadm36_fra_4#num4',
								attribution: null,
								tableName: 'gadm36_FRA_4',
								columnName: 'num4',
								fidColumnName: 'ogc_fid',
							},
						},
					},
					count: null,
					editedByKey: null,
					indexes: [
						{
							filter: {
								layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
								modifiers: {
									scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
									placeKey: {
										in: [
											'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
											'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
										],
									},
									caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
									periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
								},
								styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
							},
							order: null,
							count: 1,
							changedOn: null,
							index: {
								1: '55f48ed1-ee67-47bd-a044-8985662ec29f',
							},
						},
					],
					inUse: {
						indexes: null,
						keys: null,
					},
					lastChangedOn: null,
					loading: false,
					loadingKeys: null,
				},
				spatialData: {
					activeKey: null,
					byKey: null,
					count: null,
					editedByKey: null,
					indexes: null,
					inUse: {
						indexes: null,
						keys: null,
					},
					lastChangedOn: null,
					loading: false,
					loadingKeys: null,
					byDataSourceKey: {},
				},
				spatialRelations: {
					activeKey: null,
					byKey: null,
					count: null,
					editedByKey: null,
					indexes: null,
					inUse: {
						indexes: null,
						keys: null,
					},
					lastChangedOn: null,
					loading: false,
					loadingKeys: null,
				},
				spatialDataSources: {
					activeKey: null,
					byKey: null,
					count: null,
					editedByKey: null,
					indexes: null,
					inUse: {
						indexes: null,
						keys: null,
					},
					lastChangedOn: null,
					loading: false,
					loadingKeys: null,
				},
			},
		};

		const store = createStore(reducers, defaultState);

		const getState = () => {
			return store.getState();
		};

		setFetch(function (url, options) {
			assert.strictEqual('http://localhost/rest/data/filtered', slash(url));
			if (
				_.isEqual(options, {
					body: JSON.stringify({
						modifiers: {
							scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
							placeKey: {
								in: [
									'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
									'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								],
							},
							caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
							periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
						},
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
						styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
						relations: {
							offset: 0,
							limit: 1,
							attribute: false,
							spatial: false,
							area: false,
						},
						data: {
							spatialIndex: {
								tiles: [['0', '1']],
							},
							spatialFilter: {
								tiles: [
									['0', '1'],
									['0', '2'],
								],
								level: 7,
							},
							geometry: false,
						},
					}),
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					method: 'POST',
				})
			) {
				return Promise.resolve({
					ok: true,
					json: function () {
						return Promise.resolve(responseWithAttributeData_1);
					},
					headers: {
						get: function (name) {
							return {'Content-type': 'application/json'}[name];
						},
					},
					data: options.body,
				});
			}

			if (
				_.isEqual(options, {
					body: JSON.stringify({
						modifiers: {
							scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
							placeKey: {
								in: [
									'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
									'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								],
							},
							caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
							periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
						},
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
						styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
						relations: {
							offset: 0,
							limit: 1,
							attribute: false,
							spatial: false,
							area: false,
						},
						data: {
							spatialIndex: {tiles: [['0', '2']]},
							spatialFilter: {
								tiles: [
									['0', '1'],
									['0', '2'],
								],
								level: 7,
							},
							geometry: false,
						},
					}),
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					method: 'POST',
				})
			) {
				return Promise.resolve({
					ok: true,
					json: function () {
						return Promise.resolve(responseWithAttributeData_2);
					},
					headers: {
						get: function (name) {
							return {'Content-type': 'application/json'}[name];
						},
					},
					data: options.body,
				});
			}
		});

		const dispatch = storeHelpers.getDispatch(getState, store.dispatch);

		const modifiers = {
			scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
			placeKey: {
				in: [
					'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
					'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
				],
			},
			caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
			periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
		};

		const styleKey = '460372b1-4fce-4676-92be-b1656a5415f5';
		const layerTemplateKey = '11c7cc1b-9834-4e85-aba6-eab5571705e4';
		const spatialRelationsFilter = {
			layerTemplateKey: layerTemplateKey,
			modifiers: modifiers,
		};
		const attributeRelationsFilter = {
			...spatialRelationsFilter,
			styleKey,
		};
		const attributeDataFilter = {
			...attributeRelationsFilter,
		};

		const spatialFilter = {
			tiles: [
				['0', '1'],
				['0', '2'],
			],
			level: 7,
		};
		const order = null;

		dispatch(
			actions.loadMissingAttributeData(
				spatialFilter,
				styleKey,
				order,
				spatialRelationsFilter,
				attributeRelationsFilter,
				attributeDataFilter
			)
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{
					type: 'DATA.ATTRIBUTE_DATA.SPATIAL_INDEX.ADD',
					filter: {
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
						modifiers: {
							scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
							placeKey: {
								in: [
									'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
									'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								],
							},
							caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
							periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
						},
						styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
					},
					order: null,
					indexData: [
						{
							7: {
								'0,1': true,
							},
						},
					],
					changedOn: null,
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.SPATIAL_INDEX.ADD',
					filter: {
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
						modifiers: {
							scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
							placeKey: {
								in: [
									'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
									'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								],
							},
							caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
							periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
						},
						styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
					},
					order: null,
					indexData: [
						{
							7: {
								'0,2': true,
							},
						},
					],
					changedOn: null,
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.ADD_WITH_SPATIAL_INDEX',
					attributeDataSourceKey: '55f48ed1-ee67-47bd-a044-8985662ec29f',
					data: {
						18502: '27',
					},
					filter: {
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
						modifiers: {
							scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
							placeKey: {
								in: [
									'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
									'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								],
							},
							caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
							periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
						},
						styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
					},
					order: null,
					indexData: [{}],
					changedOn: null,
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.ADD_WITH_SPATIAL_INDEX',
					attributeDataSourceKey: '55f48ed1-ee67-47bd-a044-8985662ec29f',
					data: {
						18503: '30',
					},
					filter: {
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
						modifiers: {
							scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
							placeKey: {
								in: [
									'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
									'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								],
							},
							caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
							periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
						},
						styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
					},
					order: null,
					indexData: [{}],
					changedOn: null,
				},
			]);
		});
	});
});
