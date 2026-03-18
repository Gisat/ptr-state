import ActionTypes from '../../../constants/ActionTypes';
import common, {DEFAULT_INITIAL_STATE} from '../../_common/reducers';

// import {
// 	TILED_VECTOR_LAYER_TYPES,
// 	SINGLE_VECTOR_LAYER_TYPES,
// } from '../constants';

export const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE,
};

const add = (state, action) => {
	if (action?.data?.length) {
		let newData = {...state.byKey};
		action.data.forEach(model => {
			const {
				key,
				data: {description, nameDisplay, nameInternal, datasourceType, source},
			} = {...newData[model.key], ...model};
			// FIXME - remapping vectorGeometry to vector type
			const datasourceTypeFixed =
				datasourceType === 'vectorGeometry' ? 'vector' : datasourceType;
			newData[key] = {
				key,
				data: {
					description,
					nameDisplay,
					nameInternal,
					...source,
				},
			};

			newData[model.key].data.type = datasourceTypeFixed;

			delete newData[model.key].outdated;
			delete newData[model.key].unreceived;
		});

		return {...state, byKey: newData};
	} else {
		return state;
	}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.DATA.SPATIAL_DATA_SOURCES.ADD:
			return add(state, action);
		case ActionTypes.DATA.SPATIAL_DATA_SOURCES.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.DATA.SPATIAL_DATA_SOURCES.UPDATE_STORE:
			return common.updateStore(state, action);
		default:
			return state;
	}
};
