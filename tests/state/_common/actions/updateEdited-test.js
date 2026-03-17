import commonActions from '../../../../src/state/_common/actions';
import testBatchRunner, {extendStoreOnPath} from '../../helpers';
import {commonActionTypesObj as actionTypes} from '../../../constants';

const tests = [
	{
		name: 'It dispatch "EDITED.UPDATE" with data.',
		action: (actions, actionTypes, options) => {
			let action;
			if (actionTypes) {
				action = actions.updateEdited(options.getSubstate, actionTypes);
			} else {
				action = actions.updateEdited;
			}
			return action('users', 'k1', {
				key: 'k1',
				data: {prop: 'val'},
			});
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
				byKey: {k1: {key: 'k1'}},
				editedByKey: {k1: {key: 'k1', data: {prop: 'val'}}},
			};
			return extendStoreOnPath(baseState, storePath, storeState);
		},
		dispatchedActions: [
			{
				type: 'EDITED.UPDATE',
				data: [
					{
						data: {
							k1: {
								key: 'k1',
								data: {
									prop: 'val',
								},
							},
						},
						key: 'users',
					},
				],
			},
		],
	},
	{
		name: 'It dispatch "EDITED.UPDATE" with "undefined" value.',
		action: (actions, actionTypes, options) => {
			let action;
			if (actionTypes) {
				action = actions.updateEdited(options.getSubstate, actionTypes);
			} else {
				action = actions.updateEdited;
			}
			return action('users', 'k1');
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
				byKey: {k1: {key: 'k1'}},
				editedByKey: {k1: {key: 'k1', data: {prop: 'val'}}},
			};
			return extendStoreOnPath(baseState, storePath, storeState);
		},
		dispatchedActions: [
			{
				type: 'EDITED.UPDATE',
				data: [
					{
						data: {
							k1: undefined,
						},
						key: 'users',
					},
				],
			},
		],
	},
	{
		name: 'It dispatch "ERROR" because key is "undefined"',
		action: (actions, actionTypes, options) => {
			let action;
			if (actionTypes) {
				action = actions.updateEdited(options.getSubstate, actionTypes);
			} else {
				action = actions.updateEdited;
			}
			return action('users');
		},
		getState: dataType => () => ({
			[dataType]: {
				byKey: {k1: {key: 'k1'}},
				editedByKey: {k1: {key: 'k1', data: {prop: 'val'}}},
			},
		}),
		dispatchedActions: [
			{
				type: 'ERROR',
			},
		],
	},
	{
		name: 'It dispatch "ERROR" because model is "undefined"',
		action: (actions, actionTypes, options) => {
			let action;
			if (actionTypes) {
				action = actions.updateEdited(options.getSubstate, actionTypes);
			} else {
				action = actions.updateEdited;
			}
			return action(undefined, 'k1');
		},
		getState: dataType => () => ({
			[dataType]: {
				byKey: {k1: {key: 'k1'}},
				editedByKey: {k1: {key: 'k1', data: {prop: 'val'}}},
			},
		}),
		dispatchedActions: [
			{
				type: 'ERROR',
			},
		],
	},
];

const dataType = 'testStore';
const categoryPath = 'be-metadata';
describe(
	'updateEdited',
	testBatchRunner(dataType, categoryPath, tests, commonActions, actionTypes)
);

export default tests;
