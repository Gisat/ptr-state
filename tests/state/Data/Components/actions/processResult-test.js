import {assert} from 'chai';
import slash from 'slash';
import actions from '../../../../../src/state/Data/Components/actions';
import {resetFetch, setFetch} from '../../../../../src/state/_common/request';
import getStoreSet from '../../../../store';

describe('state/Data/Components/actions/processResult', function () {
	afterEach(function () {
		resetFetch();
	});

	it('dispatch nothing for empty result', function () {
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

		const result = {};
		const relationsFilter = {appKey: 'testKey'};
		const relationsOrder = null;
		const loadRelations = true;
		const attributeDataFilter = null;
		const order = null;
		const relationsLimit = 1;

		dispatch(
			actions.processResult(
				result,
				loadRelations,
				relationsFilter,
				relationsOrder,
				attributeDataFilter,
				order,
				relationsLimit
			)
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), []);
		});
	});

	it('process relations', function () {
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
			attributeData: {},
			attributeRelationsDataSources: {
				offset: 0,
				total: 1,
				attributeRelations,
			},
		};
		const relationsFilter = {appKey: 'testKey'};
		const relationsOrder = null;
		const loadRelations = true;
		const attributeDataFilter = null;
		const order = null;
		const relationsLimit = 1;

		dispatch(
			actions.processResult(
				result,
				loadRelations,
				relationsFilter,
				relationsOrder,
				attributeDataFilter,
				order,
				relationsLimit
			)
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
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
					limit: 1,
					data: attributeRelations,
					changedOn: null,
				},
			]);
		});
	});

	it('process attributeData', function () {
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

		const relationsFilter = {appKey: 'testKey'};
		const relationsOrder = null;
		const loadRelations = false;
		const relationsLimit = 1;

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

		const result = {
			attributeData: {...attributeData},
			attributeRelationsDataSources: {},
		};

		const attributeDataFilter = {appKey: 'testKey'};
		const order = null;
		const changedOn = null;
		const start = 0;
		const total = 1;

		dispatch(
			actions.processResult(
				result,
				loadRelations,
				relationsFilter,
				relationsOrder,
				attributeDataFilter,
				order,
				relationsLimit
			)
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{
					type: 'DATA.ATTRIBUTE_DATA.ADD_WITH_INDEX',
					filter: relationsFilter,
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

		const relationsFilter = {appKey: 'testKey'};
		const relationsOrder = null;
		const loadRelations = true;
		const relationsLimit = 1;

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

		const attributeDataFilter = {appKey: 'testKey'};
		const order = null;

		dispatch(
			actions.processResult(
				result,
				loadRelations,
				relationsFilter,
				relationsOrder,
				attributeDataFilter,
				order,
				relationsLimit
			)
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
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
					limit: 1,
					data: attributeRelations,
					changedOn: null,
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.ADD_WITH_INDEX',
					filter: relationsFilter,
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
