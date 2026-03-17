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
	responseWithSpatialData_1,
	responseWithSpatialData_2,
} from './mockData/mockData_4_spatialData';

describe('state/Data/actions/loadMissingSpatialData', function () {
	afterEach(function () {
		resetFetch();
	});

	it('request and proceed spatial data.', function () {
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
					count: null,
					editedByKey: null,
					indexes: [],
					inUse: {
						indexes: null,
						keys: null,
					},
					lastChangedOn: null,
					loading: false,
					loadingKeys: null,
				},
				attributeDataSources: {
					indexes: [],
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
							geometry: true,
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
						return Promise.resolve(responseWithSpatialData_1);
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
							geometry: true,
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
						return Promise.resolve(responseWithSpatialData_2);
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
			actions.loadMissingSpatialData(
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
					type: 'DATA.SPATIAL_DATA.INDEX.ADD',
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
					indexData: [
						{
							7: {
								'0,1': {
									'55f48ed1-ee67-47bd-a044-8985662ec29f': [18502],
								},
							},
						},
					],
					changedOn: null,
				},
				{
					type: 'DATA.SPATIAL_DATA.ADD_WITH_TILED_INDEX',
					dataByDataSourceKey: {
						'85e35be5-1706-402a-86ad-851397bae7aa': {
							18502: {
								type: 'MultiPolygon',
								coordinates: [
									[
										[
											[2.50647283, 50.63433838],
											[2.5012393, 50.63986206],
											[2.50829029, 50.64472198],
											[2.50647283, 50.63433838],
										],
									],
								],
							},
						},
						'848e2559-936d-4262-a808-4c87aa60217d': {},
					},
					level: '7',
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
					indexData: [
						{
							7: {
								'0,1': {
									'85e35be5-1706-402a-86ad-851397bae7aa': [18502],
									'848e2559-936d-4262-a808-4c87aa60217d': [],
								},
							},
						},
					],
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
					indexData: [
						{
							7: {
								'0,2': {
									'55f48ed1-ee67-47bd-a044-8985662ec29f': [18503],
								},
							},
						},
					],
					changedOn: null,
				},
				{
					type: 'DATA.SPATIAL_DATA.ADD_WITH_TILED_INDEX',
					dataByDataSourceKey: {
						'85e35be5-1706-402a-86ad-851397bae7aa': {
							18503: {
								type: 'MultiPolygon',
								coordinates: [
									[
										[
											[2.50647283, 50.63433838],
											[2.5012393, 50.63986206],
											[2.50829029, 50.64472198],
											[2.50647283, 50.63433838],
										],
									],
								],
							},
						},
						'848e2559-936d-4262-a808-4c87aa60217d': {},
					},
					level: '7',
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
					indexData: [
						{
							7: {
								'0,2': {
									'85e35be5-1706-402a-86ad-851397bae7aa': [18503],
									'848e2559-936d-4262-a808-4c87aa60217d': [],
								},
							},
						},
					],
					changedOn: null,
				},
			]);
		});
	});
});
