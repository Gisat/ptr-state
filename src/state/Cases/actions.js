import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/actions';
import Select from '../Select';

export const dataType = 'case';
export const beCategoryPath = 'be-metadata';

// ============ creators ===========

const add = common.add(ActionTypes.CASES);
const create = common.create(
	Select.cases.getSubstate,
	dataType,
	ActionTypes.CASES,
	beCategoryPath
);
const deleteItem = common.delete(
	Select.cases.getSubstate,
	dataType,
	ActionTypes.CASES,
	beCategoryPath
);
const saveEdited = common.saveEdited(
	Select.cases.getSubstate,
	dataType,
	ActionTypes.CASES,
	beCategoryPath
);
const setActiveKey = common.setActiveKey(ActionTypes.CASES);
const setActiveKeys = common.setActiveKeys(ActionTypes.CASES);
const updateEdited = common.updateEdited(
	Select.cases.getSubstate,
	ActionTypes.CASES
);
const updateStateFromView = common.updateSubstateFromView(ActionTypes.CASES);
const useKeys = common.useKeys(
	Select.cases.getSubstate,
	dataType,
	ActionTypes.CASES,
	beCategoryPath
);
const useKeysClear = common.useKeysClear(ActionTypes.CASES);
const useIndexed = common.useIndexed(
	Select.cases.getSubstate,
	dataType,
	ActionTypes.CASES,
	beCategoryPath
);
const useIndexedClear = common.useIndexedClear(ActionTypes.CASES);
const clearIndex = common.clearIndex(ActionTypes.CASES);
const refreshUses = common.refreshUses(
	Select.cases.getSubstate,
	dataType,
	ActionTypes.CASES,
	beCategoryPath
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

// ============ actions ===========

// ============ export ===========

export default {
	add,
	create,
	delete: deleteItem,

	refreshUses,

	saveEdited,
	setActiveKey: setActiveKeyAndEnsureDependencies,
	setActiveKeys: setActiveKeysAndEnsureDependencies,

	updateEdited,
	updateStateFromView,
	useIndexed,
	useIndexedClear,
	clearIndex,
	useKeys,
	useKeysClear,
};
