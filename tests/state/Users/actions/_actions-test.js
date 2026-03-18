import commonActionsTests, {
	EDIT_ACTIONS,
	SETTING_ACTIVE_KEY_ACTIONS,
} from '../../_common/actions/';
import actions from '../../../../src/state/Users/actions';
import testBatchRunner, {
	getDispatchedActionsModificator,
	getTestsByActionName,
} from '../../helpers';

const actionNames = [...EDIT_ACTIONS, ...SETTING_ACTIVE_KEY_ACTIONS];

const store = 'USERS';
const dataType = 'users';
const categoryPath = 'user';
const tests = getTestsByActionName(actionNames, commonActionsTests);
// FIXME temporary commented
// describe(
// 	'common USERS actions',
// 	testBatchRunner(
// 		dataType,
// 		categoryPath,
// 		tests,
// 		actions,
// 		null,
// 		getDispatchedActionsModificator(store),
// 		store
// 	)
// );
