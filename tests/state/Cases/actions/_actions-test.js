import commonActionsTests, {
	USE_ACTIONS,
	EDIT_ACTIONS,
	SETTING_ACTIVE_KEYS_ACTIONS,
	RESTORE_STATE_ACTIONS,
} from '../../_common/actions/';
import actions, {
	dataType,
	beCategoryPath,
} from '../../../../src/state/Cases/actions';
import testBatchRunner, {
	getDispatchedActionsModificator,
	getTestsByActionName,
} from '../../helpers';

const actionNames = [
	...USE_ACTIONS,
	...EDIT_ACTIONS,
	...SETTING_ACTIVE_KEYS_ACTIONS,
	...RESTORE_STATE_ACTIONS.withSetActiveKeys,
];

const store = 'CASES';
const storePath = 'cases';

const tests = getTestsByActionName(actionNames, commonActionsTests);
// FIXME temporary commented
// describe(
// 	'common CASES actions',
// 	testBatchRunner(
// 		dataType,
// 		beCategoryPath,
// 		tests,
// 		actions,
// 		null,
// 		getDispatchedActionsModificator(store),
// 		store,
// 		storePath
// 	)
// );
