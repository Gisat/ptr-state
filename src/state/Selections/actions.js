import common from '../_common/actions';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import helpers from './helpers';

const add = common.add(ActionTypes.SELECTIONS);
const setActiveKey = common.setActiveKey(ActionTypes.SELECTIONS);
const updateStateFromView = common.updateSubstateFromView(
	ActionTypes.SELECTIONS
);

const setActiveSelectionFeatureKeysFilterKeys = selectionKeys => {
	return (dispatch, getState) => {
		let activeSelectionKey = Select.selections.getActiveKey(getState());
		if (activeSelectionKey && selectionKeys) {
			dispatch(setFeatureKeysFilterKeys(activeSelectionKey, selectionKeys));
		}
	};
};

/**
 * @param selectionKey {string} Id of selection, usually uuid
 * @param featureKeys {Array} list of features
 */
const setFeatureKeysFilterKeys = (selectionKey, featureKeys) => {
	return (dispatch, getState) => {
		const selection = Select.selections.getByKey(getState(), selectionKey);
		if (selection?.data?.featureKeysFilter) {
			const distinctItems = selection?.data?.distinctItems;
			if (distinctItems && selection.data.featureKeysFilter) {
				const featureKeysFilter =
					helpers.getUpdatedFeatureKeysFilterForDistinctItems(
						selection.data.featureKeysFilter,
						featureKeys
					);
				dispatch(actionSetFeatureKeysFilter(selectionKey, featureKeysFilter));
			} else {
				dispatch(actionSetFeatureKeysFilterKeys(selectionKey, featureKeys));
			}
		}
	};
};

const updateStateFromViewWithData = view => {
	return dispatch => {
		dispatch(updateStateFromView(view));
		if (view.data) {
			dispatch(add(view.data));
		}
	};
};

// ============ actions ===========
function clearFeatureKeysFilter(key) {
	return {
		type: ActionTypes.SELECTIONS.CLEAR.FEATURE_KEYS_FILTER,
		key,
	};
}

function actionSetFeatureKeysFilterKeys(key, featureKeys) {
	return {
		type: ActionTypes.SELECTIONS.SET.FEATURE_KEYS_FILTER.KEYS,
		key,
		featureKeys,
	};
}

function actionSetFeatureKeysFilter(key, featureKeysFilter) {
	return {
		type: ActionTypes.SELECTIONS.SET.FEATURE_KEYS_FILTER.SET,
		key,
		featureKeysFilter,
	};
}

export default {
	add,
	clearFeatureKeysFilter,
	setActiveSelectionFeatureKeysFilterKeys,
	setActiveKey,
	setFeatureKeysFilterKeys,
	updateStateFromView,
	updateStateFromViewWithData,
};
