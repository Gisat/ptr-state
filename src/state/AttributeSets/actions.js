import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/actions';
import Select from '../Select';

export const dataType = 'attributeSets';
export const beCategoryPath = 'be-metadata';

// ============ creators ===========
const add = common.add(ActionTypes.ATTRIBUTE_SETS);
const create = common.create(
	Select.attributeSets.getSubstate,
	dataType,
	ActionTypes.ATTRIBUTE_SETS,
	beCategoryPath
);
const refreshUses = common.refreshUses(
	Select.attributeSets.getSubstate,
	dataType,
	ActionTypes.ATTRIBUTE_SETS,
	beCategoryPath
);
const deleteItem = common.delete(
	Select.attributeSets.getSubstate,
	dataType,
	ActionTypes.ATTRIBUTE_SETS,
	beCategoryPath
);
const saveEdited = common.saveEdited(
	Select.attributeSets.getSubstate,
	dataType,
	ActionTypes.ATTRIBUTE_SETS,
	beCategoryPath
);
const setActiveKey = common.setActiveKey(ActionTypes.ATTRIBUTE_SETS);
const setActiveKeys = common.setActiveKeys(ActionTypes.ATTRIBUTE_SETS);
const updateEdited = common.updateEdited(
	Select.attributeSets.getSubstate,
	ActionTypes.ATTRIBUTE_SETS
);
const updateStore = common.updateStore(
	Select.attributeSets.getSubstate,
	ActionTypes.ATTRIBUTE_SETS
);
const useIndexed = common.useIndexed(
	Select.attributeSets.getSubstate,
	dataType,
	ActionTypes.ATTRIBUTE_SETS,
	beCategoryPath
);
const useIndexedClear = common.useIndexedClear(ActionTypes.ATTRIBUTE_SETS);
const clearIndex = common.clearIndex(ActionTypes.ATTRIBUTE_SETS);
const useKeys = common.useKeys(
	Select.attributeSets.getSubstate,
	dataType,
	ActionTypes.ATTRIBUTE_SETS,
	beCategoryPath
);
const useKeysClear = common.useKeysClear(ActionTypes.ATTRIBUTE_SETS);
const updateStateFromView = common.updateSubstateFromView(
	ActionTypes.ATTRIBUTE_SETS
);

const setActiveKeyAndEnsureDependencies = key => {
	return (dispatch, getState, options) => {
		dispatch(setActiveKey(key));
		if (options) {
			dispatch(options.ensureDependenciesOfActiveMetadataType(dataType));
		}
	};
};

const setActiveKeysAndEnsureDependencies = keys => {
	return (dispatch, getState, options) => {
		dispatch(setActiveKeys(keys));
		if (options) {
			dispatch(options.ensureDependenciesOfActiveMetadataType(dataType));
		}
	};
};

// ============ export ===========

export default {
	add,
	create,
	delete: deleteItem,
	updateStateFromView,

	refreshUses,

	saveEdited,
	setActiveKey: setActiveKeyAndEnsureDependencies,
	setActiveKeys: setActiveKeysAndEnsureDependencies,

	updateEdited,
	updateStore,
	useIndexed,
	useIndexedClear,
	clearIndex,
	useKeys,
	useKeysClear,
};
