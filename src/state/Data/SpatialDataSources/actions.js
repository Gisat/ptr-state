import ActionTypes from '../../../constants/ActionTypes';
import common from '../../_common/actions';
import Select from '../../Select';

export const dataType = 'datasource';
export const beCategoryPath = 'be-metadata';

const actionTypes = ActionTypes.DATA.SPATIAL_DATA_SOURCES;

const addIndex = common.addIndex(actionTypes);
const add = common.add(actionTypes);
const useKeys = common.useKeys(
	Select.data.spatialDataSources.getSubstate,
	dataType,
	actionTypes,
	beCategoryPath
);

const ensureIndexed = (filter, order, start, length) => {
	return common.ensureIndexed(
		Select.data.spatialDataSources.getSubstate,
		dataType,
		filter,
		order,
		start,
		length,
		ActionTypes.DATA.SPATIAL_DATA_SOURCES,
		beCategoryPath
	);
};
// ============ creators ===========
/**
 * It ensure adding index and adding received spatialDataSources from BE.
 * Add dataSources to state only when spatialDataSources received, in case of empty spatialDataSources it adds only index.
 * @param {Object} spatialDataSources Object received from BE.
 * @param {Object} filter Filler object contains modifiers and layerTemplateKey or areaTreeLevelKey.
 * @param {Array?} order
 * @param {Number} start
 * @param {Number} total
 * @param {string?} changedOn
 */
function receiveIndexed(
	spatialDataSources,
	filter,
	order,
	start,
	total,
	changedOn
) {
	return dispatch => {
		// add spatialDataSources to store
		// There should be check if spatialDataSources is already in the store.
		if (spatialDataSources.length) {
			dispatch(add(spatialDataSources, filter));
		}

		// add to index
		dispatch(
			addIndex(filter, order, total, start, spatialDataSources, changedOn)
		);
	};
}

const updateStore = common.updateStore(
	Select.data.spatialDataSources.getSubstate,
	actionTypes
);

// ============ actions ============

// ============ export ===========

export default {
	add,
	receiveIndexed,
	updateStore,
	useKeys,
	ensureIndexed,
};
