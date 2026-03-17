import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/actions';
import Select from '../Select';

export const dataType = 'periods';
export const beCategoryPath = 'be-metadata';

// ============ creators ===========

const add = common.add(ActionTypes.PERIODS);
const create = common.create(
	Select.periods.getSubstate,
	dataType,
	ActionTypes.PERIODS,
	beCategoryPath
);
const deleteItem = common.delete(
	Select.periods.getSubstate,
	dataType,
	ActionTypes.PERIODS,
	beCategoryPath
);
const saveEdited = common.saveEdited(
	Select.periods.getSubstate,
	dataType,
	ActionTypes.PERIODS,
	beCategoryPath
);
const setActiveKey = common.setActiveKey(ActionTypes.PERIODS);
const setActiveKeys = common.setActiveKeys(ActionTypes.PERIODS);
const updateEdited = common.updateEdited(
	Select.periods.getSubstate,
	ActionTypes.PERIODS
);
const updateStateFromView = common.updateSubstateFromView(ActionTypes.PERIODS);
const useKeys = common.useKeys(
	Select.periods.getSubstate,
	dataType,
	ActionTypes.PERIODS,
	beCategoryPath
);
const useKeysClear = common.useKeysClear(ActionTypes.PERIODS);
const useIndexed = common.useIndexed(
	Select.periods.getSubstate,
	dataType,
	ActionTypes.PERIODS,
	beCategoryPath
);
const useIndexedClear = common.useIndexedClear(ActionTypes.PERIODS);
const clearIndex = common.clearIndex(ActionTypes.PERIODS);
const refreshUses = common.refreshUses(
	Select.periods.getSubstate,
	dataType,
	ActionTypes.PERIODS,
	beCategoryPath
);
const setActiveKeyAndEnsureDependencies = key => {
	return (dispatch, getState, options) => {
		dispatch(setActiveKey(key));
		if (options) {
			dispatch(options.ensureDependenciesOfActiveMetadataType('period'));
		}
	};
};

const setActiveKeysAndEnsureDependencies = keys => {
	return (dispatch, getState, options) => {
		dispatch(setActiveKeys(keys));
		if (options) {
			dispatch(options.ensureDependenciesOfActiveMetadataType('period'));
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
