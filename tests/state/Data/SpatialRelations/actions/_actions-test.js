import commonActionsTests from '../../../_common/actions/';
import actions from '../../../../../src/state/Data/SpatialRelations/actions';
import testBatchRunner, {
	getDispatchedActionsModificator,
	getTestsByActionName,
} from '../../../helpers';

const actionNames = [
	'updateStore',
	'ensureIndexed',
	'useIndexed',
	'refreshUses',
];

const store = 'DATA.SPATIAL_RELATIONS';
const storePath = 'data.spatialRelations';
const dataType = 'spatial';
const categoryPath = 'relations';
const tests = getTestsByActionName(actionNames, commonActionsTests);

// FIXME temporary commented
// describe(
// 	'common DATA/SPATIALRELATIONS actions',
// 	testBatchRunner(
// 		dataType,
// 		categoryPath,
// 		tests,
// 		actions,
// 		null,
// 		getDispatchedActionsModificator(store),
// 		store,
// 		storePath
// 	)
// );
