import commonActionsTests, {
	SETTING_ACTIVE_KEY_ACTIONS,
} from '../../../_common/actions/';
import actions, {
	dataType,
	beCategoryPath,
} from '../../../../../src/state/Areas/AreaTrees/actions';
import testBatchRunner, {
	getDispatchedActionsModificator,
	getTestsByActionName,
} from '../../../helpers';

const actionNames = [
	SETTING_ACTIVE_KEY_ACTIONS,
	'refreshUses',
	'useIndexed',
	'useIndexedClear',
	'useKeys',
	'useKeysClear',
];

const store = 'AREAS.AREA_TREES';
const storePath = 'areas.areaTrees';
const tests = getTestsByActionName(actionNames, commonActionsTests);
// FIXME temporary commented
// describe(
// 	'common AREAS.AREA_TREES actions',
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
