import ActionTypes from '../../../constants/ActionTypes';

import common from '../../_common/actions';
import Select from '../../Select';

export const dataType = 'areaTreeLevels';
export const beCategoryPath = 'be-metadata';

// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.AREAS.AREA_TREE_LEVELS);
const useIndexed = common.useIndexed(
	Select.areas.areaTreeLevels.getSubstate,
	dataType,
	ActionTypes.AREAS.AREA_TREE_LEVELS,
	beCategoryPath
);
const useKeys = common.useKeys(
	Select.areas.areaTreeLevels.getSubstate,
	dataType,
	ActionTypes.AREAS.AREA_TREE_LEVELS,
	beCategoryPath
);
const refreshUses = common.refreshUses(
	Select.areas.areaTreeLevels.getSubstate,
	`areaTreeLevels`,
	ActionTypes.AREAS.AREA_TREE_LEVELS,
	beCategoryPath
);

const setActiveKeyAndEnsureDependencies = key => {
	return (dispatch, getState, options) => {
		dispatch(setActiveKey(key));
		if (options) {
			dispatch(options.ensureDependenciesOfActiveMetadataType('areaTreeLevel'));
		}
	};
};

// ============ actions ===========

function actionClearUseIndexed(componentId) {
	return {
		type: ActionTypes.AREAS.AREA_TREE_LEVELS.USE.INDEXED.CLEAR,
		componentId,
	};
}

// ============ export ===========

export default {
	refreshUses,
	setActiveKey: setActiveKeyAndEnsureDependencies,
	useIndexed,
	useIndexedClear: actionClearUseIndexed,
	useKeys,
};
