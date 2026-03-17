import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import common from '../_common/actions';

export const dataType = 'area';
export const beCategoryPath = 'be-metadata';

// ============ creators ===========
const useIndexedRegister = common.useIndexedRegister(
	ActionTypes.AREA_RELATIONS
);
const ensureIndexed = (filter, order, start, length) =>
	common.ensureIndexed(
		Select.areaRelations.getSubstate,
		dataType,
		filter,
		order,
		start,
		length,
		ActionTypes.AREA_RELATIONS,
		beCategoryPath
	);
const add = common.add(ActionTypes.AREA_RELATIONS);
const addIndex = common.addIndex(ActionTypes.AREA_RELATIONS);
const useIndexedClearAll = common.useIndexedClearAll(
	ActionTypes.AREA_RELATIONS
);

/**
 * It ensure adding index and adding or updating received data from BE.
 * Add relations to state only when areaRelations received, in case of empty areaRelations it adds only index.
 * @param {Array} areaRelations Array received from BE contains areaRelations.
 * @param {Object} filter Filler object contains modifiers, layerTemplateKey or areaTreeLevelKey and styleKey.
 * @param {Array?} order
 * @param {Number} start
 * @param {Number} total
 * @param {string?} changedOn
 * @param {Number?} limit Limitation for loading relations
 */
function receiveIndexed(
	areaRelations,
	filter,
	order,
	start,
	total,
	changedOn,
	limit
) {
	return dispatch => {
		// add areaRelations to store
		if (areaRelations.length) {
			dispatch(add(areaRelations, filter));
		}

		// add to index
		dispatch(
			addIndex(filter, order, total, start, areaRelations, changedOn, limit)
		);
	};
}

// ============ export ===========

export default {
	add,
	useIndexedRegister,
	useIndexedClearAll,
	ensureIndexed,
	receiveIndexed,
};
