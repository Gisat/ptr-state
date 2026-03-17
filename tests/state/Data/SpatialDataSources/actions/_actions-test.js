import commonActionsTests from '../../../_common/actions/';
import actions, {
	dataType,
} from '../../../../../src/state/Data/SpatialDataSources/actions';
import testBatchRunner, {
	getDispatchedActionsModificator,
	getTestsByActionName,
} from '../../../helpers';

const actionNames = ['updateStore', 'useKeys'];

const store = 'DATA.SPATIAL_DATA_SOURCES';
const storePath = 'data.spatialDataSources';
const categoryPath = 'dataSources';
const tests = getTestsByActionName(actionNames, commonActionsTests);
// FIXME temporary commented
// describe(
// 	'common DATA/SPATIALDATASOURCES actions',
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
