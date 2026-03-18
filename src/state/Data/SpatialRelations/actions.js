import ActionTypes from '../../../constants/ActionTypes';
import common from '../../_common/actions';
import Select from '../../Select';

const actionTypes = ActionTypes.DATA.SPATIAL_RELATIONS;

export const dataType = 'spatial';
export const beCategoryPath = 'be-metadata';

const addIndex = common.addIndex(actionTypes);
const add = common.add(actionTypes);
const ensureIndexed = (filter, order, start, length) =>
	common.ensureIndexed(
		Select.data.spatialRelations.getSubstate,
		dataType,
		filter,
		order,
		start,
		length,
		ActionTypes.DATA.SPATIAL_RELATIONS,
		beCategoryPath
	);

const useIndexed = common.useIndexed(
	Select.data.spatialRelations.getSubstate,
	dataType,
	ActionTypes.DATA.SPATIAL_RELATIONS,
	beCategoryPath
);

const refreshUses = common.refreshUses(
	Select.data.spatialRelations.getSubstate,
	dataType,
	ActionTypes.DATA.SPATIAL_RELATIONS,
	beCategoryPath
);

// ============ creators ===========
/**
 * It ensure adding index and adding received spatialRelations from BE.
 * Add relations to state only when spatialRelations received, in case of empty spatialRelations it adds only index.
 * @param {Object} spatialRelations Object received from BE.
 * @param {Object} filter Filler object contains modifiers and layerTemplateKey or areaTreeLevelKey.
 * @param {Array?} order
 * @param {Number} start
 * @param {Number} total
 * @param {string?} changedOn
 */
function receiveIndexed(
	spatialRelations,
	filter,
	order,
	start,
	total,
	changes
) {
	return dispatch => {
		// add spatialRelations to store
		// There should be check if relation is already in the store.
		if (spatialRelations.length) {
			dispatch(add(spatialRelations, filter));
		}

		// add to index
		dispatch(addIndex(filter, order, total, start, spatialRelations, changes));
	};
}

const updateStore = common.updateStore(
	Select.data.spatialRelations.getSubstate,
	actionTypes
);

// ============ actions ============

// ============ export ===========

export default {
	refreshUses,
	receiveIndexed,
	updateStore,
	ensureIndexed,
	useIndexed,
};
