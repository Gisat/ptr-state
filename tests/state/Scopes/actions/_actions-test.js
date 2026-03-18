import commonActionsTests, {
	USE_ACTIONS,
	EDIT_ACTIONS,
	SETTING_ACTIVE_KEY_ACTIONS,
	RESTORE_STATE_ACTIONS,
} from '../../_common/actions/';
import actions, {
	dataType,
	beCategoryPath,
} from '../../../../src/state/Scopes/actions';
import testBatchRunner, {
	getDispatchedActionsModificator,
	getTestsByActionName,
} from '../../helpers';

const actionNames = [
	...USE_ACTIONS,
	...EDIT_ACTIONS,
	...SETTING_ACTIVE_KEY_ACTIONS,
	...RESTORE_STATE_ACTIONS.withSetActiveKey,
];

const store = 'SCOPES';
const tests = getTestsByActionName(actionNames, commonActionsTests);

// FIXME temporary commented
// describe(
// 	'common SCOPES actions',
// 	testBatchRunner(
// 		dataType,
// 		beCategoryPath,
// 		tests,
// 		actions,
// 		null,
// 		getDispatchedActionsModificator(store),
// 		store
// 	)
// );

// FIXME updateStateFromView is specific, add more tests
