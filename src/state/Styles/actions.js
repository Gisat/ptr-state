import ActionTypes from '../../constants/ActionTypes';

import common from '../_common/actions';
import Select from '../Select';

export const dataType = 'styles';
export const beCategoryPath = 'be-metadata';

// ============ creators ===========

const add = common.add(ActionTypes.STYLES);
const create = common.create(
	Select.styles.getSubstate,
	dataType,
	ActionTypes.STYLES,
	beCategoryPath
);
const deleteItem = common.delete(
	Select.styles.getSubstate,
	dataType,
	ActionTypes.STYLES,
	beCategoryPath
);
const saveEdited = common.saveEdited(
	Select.styles.getSubstate,
	dataType,
	ActionTypes.STYLES,
	beCategoryPath
);
const updateEdited = common.updateEdited(
	Select.styles.getSubstate,
	ActionTypes.STYLES
);
const useIndexed = common.useIndexed(
	Select.styles.getSubstate,
	dataType,
	ActionTypes.STYLES,
	beCategoryPath
);
const useKeys = common.useKeys(
	Select.styles.getSubstate,
	dataType,
	ActionTypes.STYLES,
	beCategoryPath
);
const useKeysClear = common.useKeysClear(ActionTypes.STYLES);
const updateStateFromView = common.updateSubstateFromView(ActionTypes.STYLES);

const useIndexedClear = common.useIndexedClear(ActionTypes.STYLES);
const clearIndex = common.clearIndex(ActionTypes.STYLES);
const refreshUses = common.refreshUses(
	Select.styles.getSubstate,
	dataType,
	ActionTypes.STYLES,
	beCategoryPath
);

// ============ export ===========

// TODO - common?
const updateStateFromViewWithData = view => {
	return dispatch => {
		dispatch(updateStateFromView(view));
		if (view.data) {
			dispatch(add(view.data));
		}
	};
};

export default {
	add,
	create,
	delete: deleteItem,

	refreshUses,

	useIndexed,
	useIndexedClear,
	clearIndex,
	useKeys,
	useKeysClear,
	updateStateFromView,
	updateStateFromViewWithData,

	saveEdited,
	updateEdited,
};
