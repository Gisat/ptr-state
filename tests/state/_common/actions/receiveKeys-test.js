import commonActions from '../../../../src/state/_common/actions';
import testBatchRunner from '../../helpers';
import {commonActionTypesObj as actionTypes} from '../../../constants';

const tests = [
	{
		name: 'It dispatch receiveKeys.',
		action: (actions, actionTypes, options) => {
			const action = actions.receiveKeys(
				actionTypes,
				{data: {[options.dataType]: [{key: 'k1'}]}},
				options.dataType,
				['k1', 'k2']
			);

			return action;
		},
		dispatchedActions: [
			{type: 'ADD', data: [{key: 'k1'}], filter: undefined},
			{type: 'ADD_UNRECEIVED', keys: ['k2']},
		],
	},
];

const dataType = 'testStore';
const categoryPath = 'metadata';
// FIXME temporary commented
// describe(
// 	'receiveKeys',
// 	testBatchRunner(dataType, categoryPath, tests, commonActions, actionTypes)
// );

export default tests;
