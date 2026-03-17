import {assert} from 'chai';
import slash from 'slash';
import commonActions from '../../../../src/state/_common/actions';
import testBatchRunner, {extendStoreOnPath} from '../../helpers';
import {commonActionTypesObj as actionTypes} from '../../../constants';

const tests = [
	{
		name: 'It register requested keys and loads them.',
		action: (actions, actionTypes, options) => {
			return (dispatch, getState) => {
				const keys = ['k1', 'k2'];
				const componentId = 'placeSelect';
				let action;
				if (actionTypes && options) {
					action = actions.useKeys(
						options.getSubstate,
						options.dataType,
						actionTypes,
						options.categoryPath
					);
				} else {
					action = actions.useKeys;
				}
				return dispatch(action(keys, componentId));
			};
		},
		getState: (dataType, store, storePath) => () => {
			const baseState = {
				app: {
					localConfiguration: {
						apiBackendProtocol: 'http',
						apiBackendHost: 'localhost',
						apiBackendPath: '',
					},
				},
			};
			const storeState = {
				byKey: {
					k2: {key: 'k2'},
				},
			};
			return extendStoreOnPath(baseState, storePath, storeState);
		},
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
				type: 'USE.KEYS.REGISTER',
				componentId: 'placeSelect',
				keys: ['k1', 'k2'],
			},
			{
				type: 'ADD',
				filter: undefined,
				data: [
					{
						key: 'k1',
						data: {},
					},
				],
			},
		],
	},
	{
		name: 'It register requested keys and don`t loads them.',
		action: (actions, actionTypes, options) => {
			return (dispatch, getState) => {
				const keys = ['k1', 'k2'];
				const componentId = 'placeSelect';
				let action;
				if (actionTypes && options) {
					action = actions.useKeys(
						options.getSubstate,
						options.dataType,
						actionTypes,
						options.categoryPath
					);
				} else {
					action = actions.useKeys;
				}
				return dispatch(action(keys, componentId));
			};
		},
		getState: (dataType, store, storePath) => () => {
			const baseState = {
				app: {
					localConfiguration: {
						apiBackendProtocol: 'http',
						apiBackendHost: 'localhost',
						apiBackendPath: '',
					},
				},
			};

			const storeState = {
				byKey: {
					k1: {key: 'k1'},
					k2: {key: 'k2'},
				},
			};

			return extendStoreOnPath(baseState, storePath, storeState);
		},
		setFetch: (dataType, categoryPath) => (url, options) => {},
		dispatchedActions: [
			{
				type: 'USE.KEYS.REGISTER',
				componentId: 'placeSelect',
				keys: ['k1', 'k2'],
			},
		],
	},
];

const dataType = 'testStore';
const categoryPath = 'be-metadata';
// FIXME temporary commented
// describe(
// 	'useKeys',
// 	testBatchRunner(dataType, categoryPath, tests, commonActions, actionTypes)
// );

export default tests;
