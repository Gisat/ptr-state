import {assert} from 'chai';
import {setState} from '@jvitela/recompute';
import {createStore, combineReducers} from 'redux';
import _ from 'lodash';
import slash from 'slash';
import actions from '../../../../../src/state/Data/Components/actions';
import {resetFetch, setFetch} from '../../../../../src/state/_common/request';
import getStoreSet from '../../../../store';

import AttributeDataReducer from '../../../../../src/state/Data/AttributeData/reducers';
import AttributeRelationsReducer from '../../../../../src/state/Data/AttributeRelations/reducers';
import AttributeDataSourcesReducer from '../../../../../src/state/Data/AttributeDataSources/reducers';
import ComponentsReducer from '../../../../../src/state/Data/Components/reducers';
import SpatialDataReducer from '../../../../../src/state/Data/SpatialData/reducers';
import SpatialRelationsReducer from '../../../../../src/state/Data/SpatialRelations/reducers';
import SpatialDataSourcesReducer from '../../../../../src/state/Data/SpatialDataSources/reducers';
import AppReducers from '../../../../../src/state/App/reducers';

import {
	veryFirstResponseOfSecondPageOfAttributeAndRelationsData,
	firstResponseOfSecondPageOfAttributeAndRelationsData,
	secondResponseOfSecondPageOfAttributeAndRelationsData,
	thirthResponseOfSecondPageOfAttributeAndRelationsData,
} from './mockData/_1';

describe('state/Data/Components/actions/ensureWithFilterByActive', function () {
	afterEach(function () {
		resetFetch();
	});

	it('dispatch nothing because table component is not in use', function () {
		const storeHelpers = getStoreSet();
		const reducers = combineReducers({
			app: AppReducers,
			data: combineReducers({
				attributeData: AttributeDataReducer,
				attributeRelations: AttributeRelationsReducer,
				attributeDataSources: AttributeDataSourcesReducer,
				components: ComponentsReducer,
				spatialData: SpatialDataReducer,
				spatialRelations: SpatialRelationsReducer,
				spatialDataSources: SpatialDataSourcesReducer,
			}),
		});

		const defaultState = {
			app: {
				key: 'testKey',
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: 'backend',
					requestPageSize: 2,
				},
			},
			data: {
				components: {
					components: {
						inUse: [],
						byKey: {
							table: {
								// start: 0
								attributeFilter: {
									xxx: {
										in: [11],
									},
								},
								filterByActive: {
									application: true,
								},
							},
						},
					},
				},
				spatialData: {
					indexes: [],
				},
				attributeData: {
					indexes: [],
				},
			},
		};

		const store = createStore(reducers, defaultState);
		setState(store.getState());
		const getState = () => {
			return store.getState();
		};
		const dispatch = storeHelpers.getDispatch(getState, store.dispatch);
		const componentKey = 'table';

		dispatch(
			actions.ensureWithFilterByActive({
				application: true,
			})
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {});
	});

	it('dispatch actions for load data and relations in four requests', function () {
		const storeHelpers = getStoreSet();
		const reducers = combineReducers({
			app: AppReducers,
			data: combineReducers({
				attributeData: AttributeDataReducer,
				attributeRelations: AttributeRelationsReducer,
				attributeDataSources: AttributeDataSourcesReducer,
				components: ComponentsReducer,
				spatialData: SpatialDataReducer,
				spatialRelations: SpatialRelationsReducer,
				spatialDataSources: SpatialDataSourcesReducer,
			}),
		});

		const defaultState = {
			app: {
				key: 'testKey',
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: 'backend',
					requestPageSize: 2,
				},
			},
			data: {
				components: {
					components: {
						inUse: ['table'],
						byKey: {
							table: {
								// start: 0
								attributeFilter: {
									xxx: {
										in: [11],
									},
								},
								filterByActive: {
									application: true,
								},
							},
						},
					},
				},
				spatialData: {
					indexes: [],
				},
				attributeData: {
					indexes: [],
				},
			},
		};

		const store = createStore(reducers, defaultState);
		setState(store.getState());
		const getState = () => {
			return store.getState();
		};
		const dispatch = storeHelpers.getDispatch(getState, store.dispatch);

		setFetch(function (url, options) {
			assert.strictEqual(
				'http://localhost/rest/attributeData/filtered',
				slash(url)
			);
			if (
				_.isEqual(JSON.parse(options.body), {
					modifiers: {applicationKey: 'testKey'},
					relations: {
						offset: 0,
						limit: 2,
						relations: true,
					},
					data: {
						offset: 0,
						limit: 2,
						data: true,
						attributeFilter: {
							xxx: {
								in: [11],
							},
						},
						attributeOrder: null,
					},
				})
			) {
				return Promise.resolve({
					ok: true,
					json: function () {
						return Promise.resolve(
							veryFirstResponseOfSecondPageOfAttributeAndRelationsData
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
				_.isEqual(JSON.parse(options.body), {
					modifiers: {applicationKey: 'testKey'},
					relations: {
						offset: 2,
						limit: 2,
						relations: true,
					},
					data: {
						offset: 2,
						limit: 2,
						data: true,
						attributeFilter: {
							xxx: {
								in: [11],
							},
						},
						attributeOrder: null,
					},
				})
			) {
				return Promise.resolve({
					ok: true,
					json: function () {
						return Promise.resolve(
							firstResponseOfSecondPageOfAttributeAndRelationsData
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
				_.isEqual(JSON.parse(options.body), {
					modifiers: {applicationKey: 'testKey'},
					relations: {
						offset: 0,
						limit: 0,
						relations: false,
					},
					data: {
						offset: 4,
						limit: 2,
						data: true,
						attributeFilter: {
							xxx: {
								in: [11],
							},
						},
						attributeOrder: null,
					},
				})
			) {
				return Promise.resolve({
					ok: true,
					json: function () {
						return Promise.resolve(
							secondResponseOfSecondPageOfAttributeAndRelationsData
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
				_.isEqual(JSON.parse(options.body), {
					modifiers: {applicationKey: 'testKey'},
					relations: {
						offset: 0,
						limit: 0,
						relations: false,
					},
					data: {
						offset: 6,
						limit: 1,
						data: true,
						attributeFilter: {
							xxx: {
								in: [11],
							},
						},
						attributeOrder: null,
					},
				})
			) {
				return Promise.resolve({
					ok: true,
					json: function () {
						return Promise.resolve(
							thirthResponseOfSecondPageOfAttributeAndRelationsData
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

		// const componentKey = 'table';

		// dispatch(actions.ensure(componentKey));

		dispatch(
			actions.ensureWithFilterByActive({
				application: true,
			})
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{
					type: 'DATA.ATTRIBUTE_RELATIONS.INDEX.ADD',
					filter: {
						modifiers: {applicationKey: 'testKey'},
					},
					order: null,
					data: [
						{
							key: true,
						},
						{
							key: true,
						},
					],
					start: 1,
					count: null,
					changedOn: null,
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.INDEX.ADD',
					filter: {
						modifiers: {applicationKey: 'testKey'},
						attributeFilter: {
							xxx: {
								in: [11],
							},
						},
					},
					order: null,
					data: [
						{
							key: true,
						},
						{
							key: true,
						},
					],
					start: 1,
					count: null,
					changedOn: null,
				},
				{
					data: [
						{
							key: 'aaac6982-af2a-4c2a-8fad-69c07f7d76e7',
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
								applicationKey: 'testKey',
							},
						},
						{
							key: 'bbbc6982-af2a-4c2a-8fad-69c07f7d76e7',
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
								applicationKey: 'testKey',
							},
						},
					],
					filter: {
						modifiers: {applicationKey: 'testKey'},
					},
					type: 'DATA.ATTRIBUTE_RELATIONS.ADD',
				},
				{
					filter: {
						modifiers: {applicationKey: 'testKey'},
					},
					order: null,
					count: 4,
					start: 1,
					data: [
						{
							key: 'aaac6982-af2a-4c2a-8fad-69c07f7d76e7',
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
								applicationKey: 'testKey',
							},
						},
						{
							key: 'bbbc6982-af2a-4c2a-8fad-69c07f7d76e7',
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
								applicationKey: 'testKey',
							},
						},
					],
					changedOn: null,
					limit: 2,
					type: 'DATA.ATTRIBUTE_RELATIONS.INDEX.ADD',
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.ADD_WITH_INDEX',
					filter: {
						modifiers: {applicationKey: 'testKey'},
						attributeFilter: {
							xxx: {
								in: [11],
							},
						},
					},
					limit: 2,
					order: null,
					total: 7,
					start: 1,
					index: [18500, 18501],
					data: {
						'55f48ed1-ee67-47bd-a044-8985662ec29f': {
							18500: '0',
							18501: '1',
						},
					},
					changedOn: null,
				},
				{
					type: 'DATA.ATTRIBUTE_RELATIONS.INDEX.ADD',
					filter: {
						modifiers: {applicationKey: 'testKey'},
					},
					order: null,
					data: [
						{
							key: true,
						},
						{
							key: true,
						},
					],
					start: 3,
					count: null,
					changedOn: null,
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.INDEX.ADD',
					filter: {
						modifiers: {applicationKey: 'testKey'},
						attributeFilter: {
							xxx: {
								in: [11],
							},
						},
					},
					order: null,
					data: [
						{
							key: true,
						},
						{
							key: true,
						},
					],
					start: 3,
					count: null,
					changedOn: null,
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.INDEX.ADD',
					filter: {
						modifiers: {applicationKey: 'testKey'},
						attributeFilter: {
							xxx: {
								in: [11],
							},
						},
					},
					order: null,
					data: [
						{
							key: true,
						},
						{
							key: true,
						},
					],
					start: 5,
					count: null,
					changedOn: null,
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.INDEX.ADD',
					filter: {
						modifiers: {applicationKey: 'testKey'},
						attributeFilter: {
							xxx: {
								in: [11],
							},
						},
					},
					order: null,
					data: [
						{
							key: true,
						},
					],
					start: 7,
					count: null,
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
								applicationKey: 'testKey',
							},
						},
						{
							key: 'xxxc6982-af2a-4c2a-8fad-69c07f7d76e7',
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
								applicationKey: 'testKey',
							},
						},
					],
					filter: {
						modifiers: {applicationKey: 'testKey'},
					},
					type: 'DATA.ATTRIBUTE_RELATIONS.ADD',
				},
				{
					filter: {
						modifiers: {applicationKey: 'testKey'},
					},
					order: null,
					count: 4,
					start: 3,
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
								applicationKey: 'testKey',
							},
						},
						{
							key: 'xxxc6982-af2a-4c2a-8fad-69c07f7d76e7',
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
								applicationKey: 'testKey',
							},
						},
					],
					changedOn: null,
					limit: 2,
					type: 'DATA.ATTRIBUTE_RELATIONS.INDEX.ADD',
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.ADD_WITH_INDEX',
					filter: {
						modifiers: {applicationKey: 'testKey'},
						attributeFilter: {
							xxx: {
								in: [11],
							},
						},
					},
					limit: 2,
					order: null,
					total: 7,
					start: 3,
					index: [18502, 18503],
					data: {
						'55f48ed1-ee67-47bd-a044-8985662ec29f': {
							18502: '27',
							18503: '3',
						},
					},
					changedOn: null,
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.ADD_WITH_INDEX',
					filter: {
						modifiers: {applicationKey: 'testKey'},
						attributeFilter: {
							xxx: {
								in: [11],
							},
						},
					},
					limit: 2,
					order: null,
					total: 7,
					start: 5,
					index: [18504, 18505],
					data: {
						'55f48ed1-ee67-47bd-a044-8985662ec29f': {
							18504: '4',
							18505: '5',
						},
					},
					changedOn: null,
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.ADD_WITH_INDEX',
					filter: {
						modifiers: {applicationKey: 'testKey'},
						attributeFilter: {
							xxx: {
								in: [11],
							},
						},
					},
					limit: 1,
					order: null,
					total: 7,
					start: 7,
					index: [18506],
					data: {
						'55f48ed1-ee67-47bd-a044-8985662ec29f': {
							18506: '6',
						},
					},
					changedOn: null,
				},
			]);
		});
	});
});
