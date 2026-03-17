import ActionTypes from '../../../constants/ActionTypes';

import common from '../../_common/actions';
import Select from '../../Select';

export const dataType = 'areaTrees';
export const beCategoryPath = 'be-metadata';

// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.AREAS.AREA_TREES);
const useIndexed = common.useIndexed(
	Select.areas.areaTrees.getSubstate,
	dataType,
	ActionTypes.AREAS.AREA_TREES,
	beCategoryPath
);
const useKeys = common.useKeys(
	Select.areas.areaTrees.getSubstate,
	dataType,
	ActionTypes.AREAS.AREA_TREES,
	beCategoryPath
);
const refreshUses = common.refreshUses(
	Select.areas.areaTrees.getSubstate,
	dataType,
	ActionTypes.AREAS.AREA_TREES,
	beCategoryPath
);

// ============ actions ===========

function actionClearUseIndexed(componentId) {
	return {
		type: ActionTypes.AREAS.AREA_TREES.USE.INDEXED.CLEAR,
		componentId,
	};
}

// ============ export ===========

export default {
	refreshUses,
	setActiveKey,
	useIndexed,
	useIndexedClear: actionClearUseIndexed,
	useKeys,
	useKeysClear: common.useKeysClear(ActionTypes.AREAS.AREA_TREES),
};
