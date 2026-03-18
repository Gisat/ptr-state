import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/actions';
import Select from '../Select';

export const dataType = 'attribute';
export const beCategoryPath = 'be-metadata';

// ============ creators ===========
const add = common.add(ActionTypes.ATTRIBUTES);
const create = common.create(
	Select.attributes.getSubstate,
	dataType,
	ActionTypes.ATTRIBUTES,
	beCategoryPath
);
const refreshUses = common.refreshUses(
	Select.attributes.getSubstate,
	dataType,
	ActionTypes.ATTRIBUTES,
	beCategoryPath
);
const deleteItem = common.delete(
	Select.attributes.getSubstate,
	dataType,
	ActionTypes.ATTRIBUTES,
	beCategoryPath
);
const saveEdited = common.saveEdited(
	Select.attributes.getSubstate,
	dataType,
	ActionTypes.ATTRIBUTES,
	beCategoryPath
);
const setActiveKey = common.setActiveKey(ActionTypes.ATTRIBUTES);
const setActiveKeys = common.setActiveKeys(ActionTypes.ATTRIBUTES);
const updateEdited = common.updateEdited(
	Select.attributes.getSubstate,
	ActionTypes.ATTRIBUTES
);
const updateStore = common.updateStore(
	Select.attributes.getSubstate,
	ActionTypes.ATTRIBUTES
);
const useIndexed = common.useIndexed(
	Select.attributes.getSubstate,
	dataType,
	ActionTypes.ATTRIBUTES,
	beCategoryPath
);
const useIndexedClear = common.useIndexedClear(ActionTypes.ATTRIBUTES);
const clearIndex = common.clearIndex(ActionTypes.ATTRIBUTES);
const useKeys = common.useKeys(
	Select.attributes.getSubstate,
	dataType,
	ActionTypes.ATTRIBUTES,
	beCategoryPath
);
const useKeysClear = common.useKeysClear(ActionTypes.ATTRIBUTES);
const updateStateFromView = common.updateSubstateFromView(
	ActionTypes.ATTRIBUTES
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
