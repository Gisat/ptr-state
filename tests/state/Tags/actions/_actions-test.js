import commonActionsTests, {
	USE_ACTIONS,
	EDIT_ACTIONS,
	RESTORE_STATE_ACTIONS,
} from '../../_common/actions/';
import actions, {
	dataType,
	beCategoryPath,
} from '../../../../src/state/Tags/actions';
import testBatchRunner, {
	getDispatchedActionsModificator,
	getTestsByActionName,
} from '../../helpers';

const actionNames = [
	...USE_ACTIONS,
	...EDIT_ACTIONS,
	...RESTORE_STATE_ACTIONS.withSetActiveKey,
];

const store = 'TAGS';
const tests = getTestsByActionName(actionNames, commonActionsTests);
// FIXME temporary commented
// describe(
// 	'common TAGS actions',
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
