import slash from 'slash';
import _ from 'lodash';
import commonActions from '../../../../src/state/_common/actions';
import testBatchRunner, {extendStoreOnPath} from '../../helpers';
import {commonActionTypesObj as actionTypes} from '../../../constants';

const tests = [
	{
		name: 'Save edited',
		action: (actions, actionTypes, options) => {
			let action;
			// for common testing
			if (actionTypes && options) {
				action = actions.saveEdited(
					options.getSubstate,
					options.dataType,
					actionTypes,
					options.categoryPath
				);
			} else {
				action = actions.saveEdited;
			}
			return action('k1');
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
		setFetch: (dataType, categoryPath) => (url, options) => {
			if (
				_.isEqual('http://localhost/be-metadata/nodes/change', slash(url)) &&
				_.isEqual(options, {
					body: JSON.stringify([{key: 'k1', prop: 'val'}]),
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					method: 'PATCH',
				})
			) {
				const body = ['k1'];

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
			}
			if (
				_.isEqual('http://localhost/be-metadata/nodes/k1', slash(url)) &&
				_.isEqual(options, {
					body: null,
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					method: 'GET',
				})
			) {
				const body = [{key: 'k1', data: {prop: 'val'}, nodeType: dataType}];

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
			}
		},
		dispatchedActions: [
			{
				type: 'ADD',
				data: [{key: 'k1', data: {prop: 'val'}}],
				filter: undefined,
			},
			{
				type: 'ADD',
				data: [{key: 'k1', data: {prop: 'val'}}],
				filter: undefined,
			},
			{
				type: 'EDITED.REMOVE_PROPERTY',
				key: 'k1',
				property: 'prop',
			},
		],
	},
];

const dataType = 'testStore';
const categoryPath = 'be-metadata';
// FIXME temporary commented
// describe(
// 	'saveEdited',
// 	testBatchRunner(dataType, categoryPath, tests, commonActions, actionTypes)
// );

export default tests;
