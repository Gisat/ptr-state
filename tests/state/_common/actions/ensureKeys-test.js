import {assert} from 'chai';
import slash from 'slash';
import commonActions from '../../../../src/state/_common/actions';
import testBatchRunner from '../../helpers';
import {commonActionTypesObj as actionTypes} from '../../../constants';

const tests = [
	{
		name: 'It loads requested keys.',
		action: (actions, actionTypes, options) => {
			return (dispatch, getState) => {
				const keys = ['k1', 'k2'];
				const action = actions.ensureKeys(
					options.getSubstate,
					options.dataType,
					actionTypes,
					keys,
					options.categoryPath
				);
				return dispatch(action);
			};
		},
		getState: dataType => () => ({
			app: {
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: '',
				},
			},
			[dataType]: {
				byKey: {
					k2: {key: 'k2'},
				},
			},
		}),
		setFetch: (dataType, categoryPath) => (url, options) => {
			assert.strictEqual(
				`http://localhost/be-metadata/nodes-by-keys`,
				slash(url)
			);

			assert.deepStrictEqual(options, {
				body: JSON.stringify({
					keys: ['k1'],
					limit: 100,
				}),
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
			});

			return Promise.resolve({
				ok: true,
				json: function () {
					return Promise.resolve({data: [{key: 'k1', nodeType: dataType}]});
				},
				headers: {
					get: function (name) {
						return {'Content-type': 'application/json'}[name];
					},
				},
				data: options.body,
			});
		},
		dispatchedActions: [
			{
				type: 'ADD',
				filter: undefined,
				data: [
					{
						data: {},
						key: 'k1',
					},
				],
			},
		],
	},
	{
		name: 'It loads requested keys and add unreceived keys.',
		action: (actions, actionTypes, options) => {
			return (dispatch, getState) => {
				const keys = ['k1', 'k2', 'k3'];
				const action = actions.ensureKeys(
					options.getSubstate,
					options.dataType,
					actionTypes,
					keys,
					options.categoryPath
				);
				return dispatch(action);
			};
		},
		getState: dataType => () => ({
			app: {
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: '',
				},
			},
			[dataType]: {
				byKey: {
					k1: {},
				},
			},
		}),
		setFetch: (dataType, categoryPath) => (url, options) => {
			assert.strictEqual(
				`http://localhost/be-metadata/nodes-by-keys`,
				slash(url)
			);
			assert.deepStrictEqual(options, {
				body: JSON.stringify({
					keys: ['k2', 'k3'],
					limit: 100,
				}),
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
			});

			const body = {
				data: [{key: 'k2', nodeType: dataType}],
			};

			return Promise.resolve({
				ok: true,
				json: function () {
					return Promise.resolve(body);
				},
				headers: {
					get: function (name) {
						return {'Content-type': 'application/json'}[name];
					},
				},
				data: JSON.stringify(body),
			});
		},
		dispatchedActions: [
			{
				type: 'ADD',
				filter: undefined,
				data: [
					{
						key: 'k2',
						data: {},
					},
				],
			},
			{
				type: 'ADD_UNRECEIVED',
				keys: ['k3'],
			},
		],
	},
];

const dataType = 'testStore';
const categoryPath = 'be-metadata';
// FIXME temporary commented
// describe(
// 	'ensureKeys',
// 	testBatchRunner(dataType, categoryPath, tests, commonActions, actionTypes)
// );

export default tests;
