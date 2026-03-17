import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import common from '../_common/actions';

export const dataType = 'tags';
export const beCategoryPath = 'be-metadata';

// ============ creators ===========
const add = common.add(ActionTypes.TAGS);
const create = common.create(
	Select.tags.getSubstate,
	'tags',
	ActionTypes.TAGS,
	beCategoryPath
);
const deleteItem = common.delete(
	Select.tags.getSubstate,
	dataType,
	ActionTypes.TAGS,
	beCategoryPath
);
const saveEdited = common.saveEdited(
	Select.tags.getSubstate,
	dataType,
	ActionTypes.TAGS,
	beCategoryPath
);
const updateEdited = common.updateEdited(
	Select.tags.getSubstate,
	ActionTypes.TAGS
);
const useKeys = common.useKeys(
	Select.tags.getSubstate,
	dataType,
	ActionTypes.TAGS,
	beCategoryPath
);
const useKeysClear = common.useKeysClear(ActionTypes.TAGS);
const useIndexedClear = common.useIndexedClear(ActionTypes.TAGS);
const useIndexed = common.useIndexed(
	Select.tags.getSubstate,
	dataType,
	ActionTypes.TAGS,
	beCategoryPath
);
const clearIndex = common.clearIndex(ActionTypes.TAGS);
const refreshUses = common.refreshUses(
	Select.tags.getSubstate,
	dataType,
	ActionTypes.TAGS,
	beCategoryPath
);
const updateStateFromView = common.updateSubstateFromView(ActionTypes.TAGS);
const setActiveKey = common.setActiveKey(ActionTypes.TAGS);
const setActiveKeys = common.setActiveKeys(ActionTypes.TAGS);

// ============ actions ===========

// ============ export ===========

export default {
	add,
	create,
	delete: deleteItem,
	saveEdited,
	updateEdited,
	useKeys,
	useKeysClear,
	refreshUses,
	useIndexed,
	useIndexedClear,
	clearIndex,
	updateStateFromView,
	setActiveKey,
	setActiveKeys,
};
