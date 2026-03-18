import {assert} from 'chai';
import _ from 'lodash';
import slash from 'slash';
import actions from '../../../../../src/state/Data/Components/actions';
import {resetFetch, setFetch} from '../../../../../src/state/_common/request';
import getStoreSet from '../../../../store';

import {
	oneAndLastResponseOfSecondPageOfRelations,
	oneAndLastResponseOfSecondPageOfAttributeData,
	oneAndLastResponseOfSecondPageOfAttributeAndRelationsData,
	firstResponseOfSecondPageOfAttributeAndRelationsData,
	secondResponseOfSecondPageOfAttributeAndRelationsData,
	thirthResponseOfSecondPageOfAttributeAndRelationsData,
} from './mockData/_1';

describe('state/Data/Components/actions/loadMissingRelationsAndData', function () {
	afterEach(function () {
		resetFetch();
	});

	it('dispatch nothing when remaining relations and attributeData is 0', function () {
		const storeHelpers = getStoreSet();

		const getState = () => ({
			app: {
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: 'backend',
					requestPageSize: 1,
				},
			},
			data: {
				components: {
					components: {
						byKey: [],
					},
				},
				spatialData: {
					indexes: [],
				},
				attributeData: {
					indexes: [],
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

		const componentKey = 'table';
		const order = null;
		const commonFilter = {};
		const attributeDataFilterExtension = {};
		const remainingRelationsPages = [];
		const remainingAttributeDataPages = [];
		const start = 1;
		const length = 2;
		const PAGE_SIZE = 1;

		dispatch(
			actions.loadMissingRelationsAndData(
				componentKey,
				order,
				commonFilter,
				attributeDataFilterExtension,
				remainingRelationsPages,
				remainingAttributeDataPages,
				start,
				length,
				PAGE_SIZE
			)
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), []);
		});
	});

	it('dispatch actions for load relations', function () {
		const storeHelpers = getStoreSet();

		const getState = () => ({
			app: {
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: 'backend',
					requestPageSize: 1,
				},
			},
			data: {
				components: {
					components: {
						byKey: [],
					},
				},
				spatialData: {
					indexes: [],
				},
				attributeData: {
					indexes: [],
				},
			},
		});

		const dispatch = storeHelpers.getDispatch(getState);

		setFetch(function (url, options) {
			assert.strictEqual(
				'http://localhost/rest/attributeData/filtered',
				slash(url)
			);

			if (
				_.isEqual(JSON.parse(options.body), {
					relations: {
						offset: 1,
						limit: 1,
						relations: true,
					},
					data: {
						offset: 0,
						limit: 0,
						data: false,
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
						return Promise.resolve(oneAndLastResponseOfSecondPageOfRelations);
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

		const componentKey = 'table';
		const order = null;
		const commonFilter = {appKey: 'testKey'};
		const attributeDataFilterExtension = {
			attributeFilter: {xxx: {in: [11]}},
		};
		const remainingRelationsPages = [1];
		const remainingAttributeDataPages = [];
		const start = 1;
		const length = 2;
		const PAGE_SIZE = 1;
		dispatch(
			actions.loadMissingRelationsAndData(
				componentKey,
				order,
				commonFilter,
				attributeDataFilterExtension,
				remainingRelationsPages,
				remainingAttributeDataPages,
				start,
				length,
				PAGE_SIZE
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
					data: [
						{
							key: true,
						},
					],
					start: 2,
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
					],
					filter: {
						appKey: 'testKey',
					},
					type: 'DATA.ATTRIBUTE_RELATIONS.ADD',
				},
				{
					filter: {
						appKey: 'testKey',
					},
					order: null,
					count: 1,
					start: 2,
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
					],
					changedOn: null,
					limit: 1,
					type: 'DATA.ATTRIBUTE_RELATIONS.INDEX.ADD',
				},
			]);
		});
	});

	it('dispatch actions for load attribute data', function () {
		const storeHelpers = getStoreSet();

		const getState = () => ({
			app: {
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: 'backend',
					requestPageSize: 1,
				},
			},
			data: {
				components: {
					components: {
						byKey: [],
					},
				},
				spatialData: {
					indexes: [],
				},
				attributeData: {
					indexes: [],
				},
			},
		});

		const dispatch = storeHelpers.getDispatch(getState);

		setFetch(function (url, options) {
			assert.strictEqual(
				'http://localhost/rest/attributeData/filtered',
				slash(url)
			);

			if (
				_.isEqual(JSON.parse(options.body), {
					relations: {
						offset: 0,
						limit: 0,
						relations: false,
					},
					data: {
						offset: 1,
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
							oneAndLastResponseOfSecondPageOfAttributeData
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

		const componentKey = 'table';
		const order = null;
		const commonFilter = {appKey: 'testKey'};
		const attributeDataFilterExtension = {
			attributeFilter: {xxx: {in: [11]}},
		};
		const remainingRelationsPages = [];
		const remainingAttributeDataPages = [1];
		const start = 1;
		const length = 2;
		const PAGE_SIZE = 1;
		dispatch(
			actions.loadMissingRelationsAndData(
				componentKey,
				order,
				commonFilter,
				attributeDataFilterExtension,
				remainingRelationsPages,
				remainingAttributeDataPages,
				start,
				length,
				PAGE_SIZE
			)
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{
					type: 'DATA.ATTRIBUTE_DATA.INDEX.ADD',
					filter: {
						appKey: 'testKey',
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
					start: 2,
					count: null,
					changedOn: null,
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.ADD_WITH_INDEX',
					filter: {
						appKey: 'testKey',
						attributeFilter: {
							xxx: {
								in: [11],
							},
						},
					},
					limit: 1,
					order: null,
					total: 1,
					start: 2,
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

	it('dispatch actions for load data and relations', function () {
		const storeHelpers = getStoreSet();

		const getState = () => ({
			app: {
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: 'backend',
					requestPageSize: 1,
				},
			},
			data: {
				components: {
					components: {
						byKey: [],
					},
				},
				spatialData: {
					indexes: [],
				},
				attributeData: {
					indexes: [],
				},
			},
		});

		const dispatch = storeHelpers.getDispatch(getState);

		setFetch(function (url, options) {
			assert.strictEqual(
				'http://localhost/rest/attributeData/filtered',
				slash(url)
			);

			if (
				_.isEqual(JSON.parse(options.body), {
					relations: {
						offset: 1,
						limit: 1,
						relations: true,
					},
					data: {
						offset: 1,
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
							oneAndLastResponseOfSecondPageOfAttributeAndRelationsData
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

		const componentKey = 'table';
		const order = null;
		const commonFilter = {appKey: 'testKey'};
		const attributeDataFilterExtension = {
			attributeFilter: {xxx: {in: [11]}},
		};
		const remainingRelationsPages = [1];
		const remainingAttributeDataPages = [1];
		const start = 1;
		const length = 2;
		const PAGE_SIZE = 1;
		dispatch(
			actions.loadMissingRelationsAndData(
				componentKey,
				order,
				commonFilter,
				attributeDataFilterExtension,
				remainingRelationsPages,
				remainingAttributeDataPages,
				start,
				length,
				PAGE_SIZE
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
					data: [
						{
							key: true,
						},
					],
					start: 2,
					count: null,
					changedOn: null,
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.INDEX.ADD',
					filter: {
						appKey: 'testKey',
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
					start: 2,
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
					],
					filter: {
						appKey: 'testKey',
					},
					type: 'DATA.ATTRIBUTE_RELATIONS.ADD',
				},
				{
					filter: {
						appKey: 'testKey',
					},
					order: null,
					count: 1,
					start: 2,
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
					],
					changedOn: null,
					limit: 1,
					type: 'DATA.ATTRIBUTE_RELATIONS.INDEX.ADD',
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.ADD_WITH_INDEX',
					filter: {
						appKey: 'testKey',
						attributeFilter: {
							xxx: {
								in: [11],
							},
						},
					},
					limit: 1,
					order: null,
					total: 1,
					start: 2,
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

	it('dispatch actions for load data and relations in three requests', function () {
		const storeHelpers = getStoreSet();

		const getState = () => ({
			app: {
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
						byKey: [],
					},
				},
				spatialData: {
					indexes: [],
				},
				attributeData: {
					indexes: [],
				},
			},
		});

		const dispatch = storeHelpers.getDispatch(getState);

		setFetch(function (url, options) {
			assert.strictEqual(
				'http://localhost/rest/attributeData/filtered',
				slash(url)
			);

			if (
				_.isEqual(JSON.parse(options.body), {
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

		const componentKey = 'table';
		const order = null;
		const commonFilter = {appKey: 'testKey'};
		const attributeDataFilterExtension = {
			attributeFilter: {xxx: {in: [11]}},
		};
		const remainingRelationsPages = [1];
		const remainingAttributeDataPages = [1, 2, 3];
		const start = 1;
		const length = 7;
		const PAGE_SIZE = 2;
		dispatch(
			actions.loadMissingRelationsAndData(
				componentKey,
				order,
				commonFilter,
				attributeDataFilterExtension,
				remainingRelationsPages,
				remainingAttributeDataPages,
				start,
				length,
				PAGE_SIZE
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
						appKey: 'testKey',
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
						appKey: 'testKey',
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
						appKey: 'testKey',
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
						appKey: 'testKey',
					},
					type: 'DATA.ATTRIBUTE_RELATIONS.ADD',
				},
				{
					filter: {
						appKey: 'testKey',
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
						appKey: 'testKey',
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
						appKey: 'testKey',
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
						appKey: 'testKey',
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
