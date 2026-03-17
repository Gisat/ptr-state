import commonActionsTests from '../../_common/actions/';
import actions, {
	dataType,
	beCategoryPath,
} from '../../../../src/state/AreaRelations/actions';
import testBatchRunner, {
	getDispatchedActionsModificator,
	getTestsByActionName,
} from '../../helpers';

const actionNames = [
	'add',
	'useIndexedRegister',
	'useIndexedClearAll',
	'ensureIndexed',
];

const store = 'AREA_RELATIONS';
const storePath = 'areaRelations';
const tests = getTestsByActionName(actionNames, commonActionsTests);

// FIXME temporary commented
// describe(
// 	'common AREA_RELATIONS actions',
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
