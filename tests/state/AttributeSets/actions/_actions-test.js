import commonActionsTests, {
	USE_ACTIONS,
	EDIT_ACTIONS,
	SETTING_ACTIVE_KEYS_ACTIONS,
	RESTORE_STATE_ACTIONS,
} from '../../_common/actions/';
import actions, {
	dataType,
	beCategoryPath,
} from '../../../../src/state/AttributeSets/actions';
import testBatchRunner, {
	getDispatchedActionsModificator,
	getTestsByActionName,
} from '../../helpers';

const actionNames = [
	...USE_ACTIONS,
	...EDIT_ACTIONS,
	...SETTING_ACTIVE_KEYS_ACTIONS,
	...RESTORE_STATE_ACTIONS.withSetActiveKeys,
	'updateStore',
];

const store = 'ATTRIBUTE_SETS';
const storePath = 'attributeSets';
const tests = getTestsByActionName(actionNames, commonActionsTests);
// FIXME temporary commented
// describe(
// 	'common ATTRIBUTE_SETS actions',
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

// TODO updateStore
