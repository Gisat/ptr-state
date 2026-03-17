import {assert} from 'chai';
import {pick as _pick} from 'lodash';
import slash from 'slash';
import commonActions from '../../../../src/state/_common/actions';
import testBatchRunner from '../../helpers';
import {commonActionTypesObj as actionTypes} from '../../../constants';

const tests = [
	{
		name: 'It compose and sent request for data defined by keys.',
		action: (actions, actionTypes, options) => {
			return (dispatch, getState) => {
				let action;
				const dataType = options.dataType;
				const keys = ['k1', 'k2'];
				const categoryPath = options.categoryPath;

				action = actions.loadKeysPage;
				return dispatch(action(dataType, actionTypes, keys, categoryPath));
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
		}),
		setFetch: (dataType, categoryPath) => (url, options) => {
			assert.strictEqual(
				`http://localhost/be-metadata/nodes-by-keys`,
				slash(url)
			);
			assert.deepStrictEqual(options, {
				body: JSON.stringify({
					keys: ['k1', 'k2'],
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
				data: [{key: 'k1', nodeType: dataType}],
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
			{type: 'ADD', filter: undefined, data: [{key: 'k1', data: {}}]},
			{keys: ['k2'], type: 'ADD_UNRECEIVED'},
		],
	},
];

const dataType = 'testStore';
const categoryPath = 'be-metadata';
// FIXME temporary commented
// describe(
// 	'loadKeysPage',
// 	testBatchRunner(dataType, categoryPath, tests, commonActions, actionTypes)
// );

export default tests;
