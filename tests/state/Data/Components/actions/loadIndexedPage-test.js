import {assert} from 'chai';
import slash from 'slash';
import actions from '../../../../../src/state/Data/Components/actions';
import {resetFetch, setFetch} from '../../../../../src/state/_common/request';
import getStoreSet from '../../../../store';

// import {
// 	responseWithSpatialAndAttributeData,
// 	responseWithRelationsSpatialAndAttributeData,
// } from './mockData/mockData';

describe('state/Data/Components/actions/loadIndexedPage', function () {
	afterEach(function () {
		resetFetch();
	});

	it('dispatch nothing', function () {
		const storeHelpers = getStoreSet();

		const getState = () => ({
			app: {
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: 'backend',
					requestPageSize: 1,
				},
				data: {
					spatialData: {
						indexes: [],
					},
					attributeData: {
						indexes: [],
					},
				},
			},
		});

		const dispatch = storeHelpers.getDispatch(getState);

		setFetch(function (url, options) {
			assert.strictEqual(
				'http://localhost/rest/attributeData/filtered',
				slash(url)
			);

			return Promise.resolve({
				ok: true,
				json: function () {
					return Promise.resolve({});
				},
				headers: {
					get: function (name) {
						return {'Content-type': 'application/json'}[name];
					},
				},
				data: options.body,
			});
		});

		const order = null;
		const commonFilter = {};
		const attributeDataFilterExtension = {};
		const loadRelations = null;
		const loadData = null;
		const relationsPagination = null;
		const attributeDataPagination = null;

		dispatch(
			actions.loadIndexedPage(
				order,
				commonFilter,
				attributeDataFilterExtension,
				loadRelations,
				loadData,
				relationsPagination,
				attributeDataPagination
			)
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{type: 'ERROR'},
			]);
		});
	});

	it('dispatch nothing', function () {
		const storeHelpers = getStoreSet();

		const getState = () => ({
			app: {
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: 'backend',
					requestPageSize: 1,
				},
				data: {
					spatialData: {
						indexes: [],
					},
					attributeData: {
						indexes: [],
					},
				},
			},
		});

		const dispatch = storeHelpers.getDispatch(getState);

		setFetch(function (url, options) {
			assert.strictEqual(
				'http://localhost/rest/attributeData/filtered',
				slash(url)
			);

			return Promise.resolve({
				ok: true,
				json: function () {
					return Promise.resolve({});
				},
				headers: {
					get: function (name) {
						return {'Content-type': 'application/json'}[name];
					},
				},
				data: options.body,
			});
		});

		const order = null;
		const commonFilter = {};
		const attributeDataFilterExtension = {};
		const loadRelations = null;
		const loadData = null;
		const relationsPagination = null;
		const attributeDataPagination = null;

		dispatch(
			actions.loadIndexedPage(
				order,
				commonFilter,
				attributeDataFilterExtension,
				loadRelations,
				loadData,
				relationsPagination,
				attributeDataPagination
			)
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{type: 'ERROR'},
			]);
		});
	});

	it('process attributeData and relations', function () {
		const storeHelpers = getStoreSet();

		const getState = () => ({
			app: {
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: 'backend',
					requestPageSize: 1,
				},
				data: {
					spatialData: {
						indexes: [],
					},
					attributeData: {
						indexes: [],
					},
				},
			},
		});

		const dispatch = storeHelpers.getDispatch(getState);

		const attributeData = {
			index: [18502],
			offset: 0,
			total: 1,
			attributeData: {
				'55f48ed1-ee67-47bd-a044-8985662ec29f': {
					18502: '27',
				},
			},
		};

		const attributeRelations = [
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
		];

		const result = {
			attributeData: {...attributeData},
			attributeRelationsDataSources: {
				offset: 0,
				total: 1,
				attributeRelations,
			},
		};

		setFetch(function (url, options) {
			assert.strictEqual(
				'http://localhost/rest/attributeData/filtered',
				slash(url)
			);

			return Promise.resolve({
				ok: true,
				json: function () {
					return Promise.resolve(result);
				},
				headers: {
					get: function (name) {
						return {'Content-type': 'application/json'}[name];
					},
				},
				data: options.body,
			});
		});

		const commonFilter = {appKey: 'testKey'};
		const relationsFilter = commonFilter;
		const attributeDataFilterExtension = {};

		const loadRelations = true;
		const loadData = true;
		const relationsLimit = 1;

		const order = null;
		const relationsPagination = null;
		const attributeDataPagination = null;

		dispatch(
			actions.loadIndexedPage(
				order,
				commonFilter,
				attributeDataFilterExtension,
				loadRelations,
				loadData,
				relationsPagination,
				attributeDataPagination
			)
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{
					type: 'DATA.ATTRIBUTE_RELATIONS.INDEX.ADD',
					filter: {
						appKey: 'testKey',
					},
					order: null,
					data: [...Array(100).fill({key: true})],
					start: 1,
					count: null,
					changedOn: null,
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.INDEX.ADD',
					filter: {
						appKey: 'testKey',
					},
					order: null,
					data: [...Array(100).fill({key: true})],
					start: 1,
					count: null,
					changedOn: null,
				},
				{
					type: 'DATA.ATTRIBUTE_RELATIONS.ADD',
					filter: relationsFilter,
					data: attributeRelations,
				},
				{
					type: 'DATA.ATTRIBUTE_RELATIONS.INDEX.ADD',
					filter: relationsFilter,
					order,
					count: relationsLimit,
					start: 1,
					limit: 100,
					data: attributeRelations,
					changedOn: null,
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.ADD_WITH_INDEX',
					filter: relationsFilter,
					limit: 100,
					order: null,
					total: 1,
					start: 1,
					index: [18502],
					data: {
						'55f48ed1-ee67-47bd-a044-8985662ec29f': {
							18502: '27',
						},
					},
					changedOn: null,
				},
			]);
		});
	});
});
