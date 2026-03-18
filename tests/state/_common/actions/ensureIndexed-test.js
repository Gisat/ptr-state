import {assert} from 'chai';
import slash from 'slash';
import commonActions from '../../../../src/state/_common/actions';
import testBatchRunner, {extendStoreOnPath} from '../../helpers';
import {commonActionTypesObj as actionTypes} from '../../../constants';

const tests = [
	{
		name: 'Already loaded',
		action: (actions, actionTypes, options) => {
			return (dispatch, getState) => {
				const filter = {name: 'fil'};
				const order = 'asc';
				const start = 1;
				const length = 5;

				// for common testing
				if (actionTypes && options) {
					return actions.ensureIndexed(
						options.getSubstate,
						options.dataType,
						filter,
						order,
						start,
						length,
						actionTypes,
						options.categoryPath
					);
				} else {
					return actions.ensureIndexed(filter, order, start, length);
				}
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
				indexes: [
					{
						filter: {name: 'fil'},
						order: 'asc',
						count: 5,
						changedOn: '2020-01-01',
						index: {1: 'k1', 2: 'k2', 3: 'k3', 4: 'k4', 5: 'k5'},
					},
				],
			};
			return extendStoreOnPath(baseState, storePath, storeState);
		},
		setFetch: (dataType, categoryPath) => (url, options) => {
			// assert.strictEqual(
			// 	`http://localhost/rest/${categoryPath}/filtered/${dataType}`,
			// 	slash(url)
			// );
		},
		dispatchedActions: [],
	},
	// FIXME
	// ADD BE support for notin
	// {
	// 	name: 'Add index',
	// 	action: (actions, actionTypes, options) => {
	// 		return (dispatch, getState) => {
	// 			const filter = {name: 'fil'};
	// 			const order = 'asc';
	// 			const start = 1;
	// 			const length = 5;
	// 			// for common testing
	// 			if (actionTypes && options) {
	// 				return actions.ensureIndexed(
	// 					options.getSubstate,
	// 					options.dataType,
	// 					filter,
	// 					order,
	// 					start,
	// 					length,
	// 					actionTypes,
	// 					options.categoryPath
	// 				);
	// 			} else {
	// 				return actions.ensureIndexed(filter, order, start, length);
	// 			}
	// 		};
	// 	},
	// 	getState: (dataType, store, storePath) => () => {
	// 		const baseState = {
	// 			app: {
	// 				localConfiguration: {
	// 					apiBackendProtocol: 'http',
	// 					apiBackendHost: 'localhost',
	// 					apiBackendPath: '',
	// 				},
	// 			},
	// 		};

	// 		const storeState = {
	// 			indexes: [
	// 				{
	// 					filter: {name: 'fil'},
	// 					order: 'asc',
	// 					count: 5,
	// 					changedOn: '2020-01-01',
	// 					index: {1: null, 2: 'k1', 3: 'k2', 4: 'k3'},
	// 				},
	// 			],
	// 		};
	// 		return extendStoreOnPath(baseState, storePath, storeState);
	// 	},
	// 	setFetch: (dataType, categoryPath) => (url, options) => {
	// 		assert.strictEqual(
	// 			// `http://localhost/rest/${categoryPath}/filtered/${dataType}`,
	// 			`http://localhost/be-metadata/nodes-by-type-and-edges`,
	// 			slash(url)
	// 		);
	// 		assert.deepStrictEqual(options, {
	// 			body: JSON.stringify({
	// 				filter: {
	// 					name: 'fil',
	// 					key: {
	// 						notin: ['k1', 'k2', 'k3'],
	// 					},
	// 				},
	// 				offset: 0,
	// 				order: 'asc',
	// 				limit: 100,
	// 			}),
	// 			credentials: 'include',
	// 			headers: {
	// 				Accept: 'application/json',
	// 				'Content-Type': 'application/json',
	// 			},
	// 			method: 'POST',
	// 		});

	// 		const body = {
	// 			data: {[dataType]: {k3: {}, k4: {}}},
	// 			total: 5,
	// 			changes: {
	// 				[dataType]: '2020-01-01',
	// 			},
	// 		};

	// 		return Promise.resolve({
	// 			ok: true,
	// 			json: function () {
	// 				return Promise.resolve(body);
	// 			},
	// 			headers: {
	// 				get: function (name) {
	// 					return {'Content-type': 'application/json'}[name];
	// 				},
	// 			},
	// 			data: JSON.stringify(body),
	// 		});
	// 	},
	// 	dispatchedActions: [
	// 		{
	// 			type: 'INDEX.ADD',
	// 			filter: {
	// 				name: 'fil',
	// 				key: {notin: ['k1', 'k2', 'k3']},
	// 			},
	// 			order: 'asc',
	// 			start: 1,
	// 			data: {k3: {}, k4: {}},
	// 			changedOn: '2020-01-01',
	// 			count: 5,
	// 		},
	// 	],
	// },
	{
		name: 'Nothing loaded',
		action: (actions, actionTypes, options) => {
			return (dispatch, getState) => {
				const filter = {name: 'fil'};
				const order = 'asc';
				const start = 1;
				const length = 5;
				// for common testing
				if (actionTypes && options) {
					return actions.ensureIndexed(
						options.getSubstate,
						options.dataType,
						filter,
						order,
						start,
						length,
						actionTypes,
						options.categoryPath
					);
				} else {
					return actions.ensureIndexed(filter, order, start, length);
				}
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

			const storeState = {};

			return extendStoreOnPath(baseState, storePath, storeState);
		},
		setFetch: (dataType, categoryPath) => (url, options) => {
			assert.strictEqual(
				// `http://localhost/rest/${categoryPath}/filtered/${dataType}`,
				`http://localhost/be-metadata/nodes-by-type-and-edges`,
				slash(url)
			);
			assert.deepStrictEqual(options, {
				body: JSON.stringify({
					edges: ['fil'],
					nodeType: dataType,
					offset: 0,
					order: 'asc',
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
				data: [
					{key: 'k1', nodeType: dataType},
					{key: 'k2', nodeType: dataType},
					{key: 'k3', nodeType: dataType},
					{key: 'k4', nodeType: dataType},
				],
				total: 5,
				changes: {
					[dataType]: '2020-01-01',
				},
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
				data: [
					{
						data: {},
						key: 'k1',
					},
					{
						data: {},
						key: 'k2',
					},
					{
						data: {},
						key: 'k3',
					},
					{
						data: {},
						key: 'k4',
					},
				],
				filter: {
					name: 'fil',
				},
				type: 'ADD',
			},
			{
				type: 'INDEX.ADD',
				filter: {
					name: 'fil',
				},
				order: 'asc',
				start: 1,
				data: [
					{
						data: {},
						key: 'k1',
					},
					{
						data: {},
						key: 'k2',
					},
					{
						data: {},
						key: 'k3',
					},
					{
						data: {},
						key: 'k4',
					},
				],
				changedOn: '2020-01-01',
				count: 5,
			},
		],
	},
];

const dataType = 'testStore';
const categoryPath = 'be-metadata';
// FIXME temporary commented
// describe(
// 	'ensureIndexed',
// 	testBatchRunner(dataType, categoryPath, tests, commonActions, actionTypes)
// );

export default tests;
