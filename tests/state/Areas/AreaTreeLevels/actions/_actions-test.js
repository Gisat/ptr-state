import commonActionsTests, {
	SETTING_ACTIVE_KEY_ACTIONS,
} from '../../../_common/actions/';
import actions, {
	dataType,
	beCategoryPath,
} from '../../../../../src/state/Areas/AreaTreeLevels/actions';
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
];

const store = 'AREAS.AREA_TREE_LEVELS';
const storePath = 'areas.areaTreeLevels';
const tests = getTestsByActionName(actionNames, commonActionsTests);
// FIXME temporary commented
// describe(
// 	'common AREAS.AREA_TREE_LEVELS actions',
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
