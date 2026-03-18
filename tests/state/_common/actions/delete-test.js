import {assert} from 'chai';
import slash from 'slash';
import commonActions from '../../../../src/state/_common/actions';
import testBatchRunner, {extendStoreOnPath} from '../../helpers';
import {commonActionTypesObj as actionTypes} from '../../../constants';

const tests = [
	{
		name: 'Delete item',
		action: (actions, actionTypes, options) => {
			return (dispatch, getState) => {
				let action;
				// for common testing
				if (actionTypes && options) {
					action = actions.delete(
						options.getSubstate,
						options.dataType,
						actionTypes,
						options.categoryPath
					);
				} else {
					action = actions.delete;
				}

				return dispatch(action({key: 'k1'}));
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
						index: {1: null, 2: 'k1', 3: 'k2', 4: 'k3'},
					},
				],
			};
			return extendStoreOnPath(baseState, storePath, storeState);
		},
		setFetch: (dataType, categoryPath) => (url, options) => {
			assert.strictEqual(
				`http://localhost/be-metadata/nodes/remove`,
				slash(url)
			);
			assert.deepStrictEqual(options, {
				body: JSON.stringify({
					keys: ['k1'],
				}),
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'PATCH',
			});

			return Promise.resolve({
				ok: true,
				json: function () {
					return Promise.resolve(JSON.parse(options.body));
				},
				headers: {
					get: function (name) {
						return {'Content-type': 'application/json'}[name];
					},
				},
				data: options.body,
			});
		},
		dispatchedActionsModificator: (dispatchedActions, storeName) => {
			return dispatchedActions.map(action => {
				if (
					action.type === 'MARK_DELETED' ||
					action.type === `${storeName}.MARK_DELETED`
				) {
					// remove date from 'MARK_DLETED' action
					// date is add inside action and can not be controlled
					delete action.date;
				}
				return action;
			});
		},
		dispatchedActions: options => {
			return [
				{
					key: 'k1',
					type: 'MARK_DELETED',
				},
				{
					type: 'COMMON.EDITED.REMOVE_PROPERTY_VALUES',
					dataType: options.dataType,
					keys: ['k1'],
				},
			];
		},
	},
];

const dataType = 'testStore';
const categoryPath = 'be-metadata';
describe(
	'delete',
	testBatchRunner(dataType, categoryPath, tests, commonActions, actionTypes)
);

export default tests;
