import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import common from '../_common/actions';
import _ from 'lodash';

export const dataType = 'views';
export const beCategoryPath = 'be-metadata';

// ============ creators ===========

const add = common.add(ActionTypes.VIEWS);
const setActiveKey = common.setActiveKey(ActionTypes.VIEWS);
const setActiveKeys = common.setActiveKeys(ActionTypes.VIEWS);
const create = common.create(
	Select.views.getSubstate,
	dataType,
	ActionTypes.VIEWS,
	beCategoryPath
);
const deleteItem = common.delete(
	Select.views.getSubstate,
	dataType,
	ActionTypes.VIEWS,
	beCategoryPath
);
const saveEdited = common.saveEdited(
	Select.views.getSubstate,
	dataType,
	ActionTypes.VIEWS,
	beCategoryPath
);
const updateEdited = common.updateEdited(
	Select.views.getSubstate,
	ActionTypes.VIEWS,
	beCategoryPath
);
const useKeys = common.useKeys(
	Select.views.getSubstate,
	dataType,
	ActionTypes.VIEWS,
	beCategoryPath
);
const useKeysClear = common.useKeysClear(ActionTypes.VIEWS);
const useIndexedClear = common.useIndexedClear(ActionTypes.VIEWS);
const useIndexed = common.useIndexed(
	Select.views.getSubstate,
	dataType,
	ActionTypes.VIEWS,
	beCategoryPath
);
const clearIndex = common.clearIndex(ActionTypes.VIEWS);
const refreshUses = common.refreshUses(
	Select.views.getSubstate,
	dataType,
	ActionTypes.VIEWS,
	beCategoryPath
);

const updateStateFromView = common.updateSubstateFromView(ActionTypes.VIEWS);

// ============ actions ===========
const apply = (key, actions) => {
	return (dispatch, getState) => {
		return dispatch(
			common.ensureKeys(
				Select.views.getSubstate,
				'views',
				ActionTypes.VIEWS,
				[key],
				'views'
			)
		)
			.then(() => {
				let data = Select.views.getDataByKey(getState(), key);
				if (data && data.state) {
					let actionCreators = [];
					_.each(actions, (storeActions, key) => {
						if (
							Object.hasOwn(storeActions, 'updateStateFromView') &&
							data.state[key]
						) {
							actionCreators.push(
								storeActions.updateStateFromView(data.state[key])
							);
						}
					});

					if (actions.data.components && data.state.data?.components) {
						actionCreators.push(
							actions.data.components.addComponentsFromView(
								data.state.data.components
							)
						);
					}

					if (actions.data.components && data.state.data?.sets) {
						actionCreators.push(
							actions.data.components.addSetsFromView(data.state.data.sets)
						);
					}

					if (actions.specific) {
						_.each(actions.specific, (storeActions, key) => {
							if (
								Object.hasOwn(storeActions, 'updateStateFromView') &&
								data.state[key]
							) {
								actionCreators.push(
									storeActions.updateStateFromView(data.state[key])
								);
							}
						});
					}
					dispatch(actionCreators);
				} else {
					dispatch(
						common.actionGeneralError(
							"Views#apply: View or state of view doesn't exist! View key: " +
								key
						)
					);
				}
			})
			.catch(err => {
				dispatch(common.actionGeneralError('Views#apply: ' + err));
			});
	};
};

const applyAndSetActive = (key, actions) => {
	return dispatch => {
		return dispatch(apply(key, actions)).then(() => {
			dispatch(setActiveKey(key));
		});
	};
};

// ============ export ===========

export default {
	add,
	apply,
	applyAndSetActive,
	setActiveKey,
	setActiveKeys,
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
};
