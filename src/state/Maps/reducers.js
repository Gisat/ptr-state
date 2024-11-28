import ActionTypes from '../../constants/ActionTypes';
import {stateManagement} from '@gisatcz/ptr-utils';
import helpers from '../Components/helpers';
import {
	isMatch as _isMatch,
	findIndex as _findIndex,
	indexOf as _indexOf,
	isEmpty as _isEmpty,
	remove as _remove,
} from 'lodash';

export const INITIAL_STATE = {
	activeSetKey: null,
	activeMapKey: null,
	inUse: {
		maps: [],
		sets: [],
	},
	maps: {},
	sets: {},
};

/**
 * Set active map key
 * @param state {Object}
 * @param mapKey {string}
 * @return {Object} updated state
 */
const setActiveMapKey = (state, mapKey) => {
	if (mapKey) {
		return {...state, activeMapKey: mapKey};
	} else {
		return state;
	}
};

/**
 * Add map to store
 * @param state {Object}
 * @param map {Object} map state
 * @return {Object} Updated state
 */
const addMap = (state, map) => {
	if (map?.key) {
		return {
			...state,
			maps: {
				...state.maps,
				[map.key]: map,
			},
		};
	} else {
		return state;
	}
};

/**
 * Add map set to store
 * @param state {Object}
 * @param mapSet {Object} map set state
 * @return {Object} Updated state
 */
const addMapSet = (state, mapSet) => {
	if (mapSet?.key) {
		return {
			...state,
			sets: {
				...state.sets,
				[mapSet.key]: mapSet,
			},
		};
	} else {
		return state;
	}
};

/**
 * Add map to map set
 * @param state {Object}
 * @param mapKey {string}
 * @param mapSetKey {string}
 * @return {Object} Updated state
 */
const addMapToSet = (state, mapKey, mapSetKey) => {
	if (mapKey && mapSetKey && state.sets[mapSetKey]) {
		return {
			...state,
			sets: {
				...state.sets,
				[mapSetKey]: {
					...state.sets[mapSetKey],
					maps: state.sets[mapSetKey].maps
						? [...state.sets[mapSetKey].maps, mapKey]
						: [mapKey],
				},
			},
		};
	} else {
		return state;
	}
};

/**
 * Remove map from map set
 * @param state {Object}
 * @param setKey {string}
 * @param mapKey {string}
 * @return {Object} updated state
 */
const removeMapFromSet = (state, setKey, mapKey) => {
	if (setKey && mapKey) {
		const index = _indexOf(state.sets[setKey]?.maps, mapKey);
		if (index > -1) {
			let updatedMaps = stateManagement.removeItemByIndex(
				state.sets[setKey].maps,
				index
			);

			return {
				...state,
				sets: {
					...state.sets,
					[setKey]: {
						...state.sets[setKey],
						maps: updatedMaps,
					},
				},
			};
		} else {
			return state;
		}
	} else {
		return state;
	}
};

/**
 * Remove map from store
 * @param state {Object}
 * @param mapKey {string}
 * @return {Object} Updated state
 */
const removeMap = (state, mapKey) => {
	if (mapKey && state.maps[mapKey]) {
		// eslint-disable-next-line no-unused-vars
		const {[mapKey]: map, ...restMaps} = state.maps;
		return {
			...state,
			maps: restMaps,
		};
	} else {
		return state;
	}
};

/**
 * Remove map set from store
 * @param state {Object}
 * @param mapSetKey {string}
 * @return {Object} Updated state
 */
const removeMapSet = (state, mapSetKey) => {
	if (mapSetKey && state.sets[mapSetKey]) {
		// eslint-disable-next-line no-unused-vars
		const {[mapSetKey]: set, ...restSets} = state.sets;
		return {
			...state,
			sets: restSets,
		};
	} else {
		return state;
	}
};

/**
 * Remove layer from map
 * @param state {Object}
 * @param mapKey {string}
 * @param layerKey {string}
 * @return {Object} Updated state
 */
const removeMapLayer = (state, mapKey, layerKey) => {
	if (layerKey && mapKey) {
		const index = _findIndex(state.maps[mapKey]?.data.layers, {key: layerKey});
		if (index > -1) {
			let updatedLayers = stateManagement.removeItemByIndex(
				state.maps[mapKey]?.data.layers,
				index
			);

			return {
				...state,
				maps: {
					...state.maps,
					[mapKey]: {
						...state.maps[mapKey],
						data: {
							...state.maps[mapKey].data,
							layers: updatedLayers,
						},
					},
				},
			};
		} else {
			return state;
		}
	} else {
		return state;
	}
};

/**
 * Remove layers from map
 * @param state {Object}
 * @param mapKey {string}
 * @param layerKeys {Array}
 * @return {Object} Updated state
 */
const removeMapLayers = (state, mapKey, layerKeys) => {
	if (layerKeys?.length && mapKey) {
		let updatedLayers = [
			...(state.maps[mapKey]?.data?.layers
				? state.maps[mapKey].data.layers
				: []),
		];
		layerKeys.forEach(layerKey => {
			const index = _findIndex(updatedLayers, {
				key: layerKey,
			});
			if (index > -1) {
				updatedLayers = stateManagement.removeItemByIndex(updatedLayers, index);
			}
		});

		return {
			...state,
			maps: {
				...state.maps,
				[mapKey]: {
					...state.maps[mapKey],
					data: {
						...state.maps[mapKey].data,
						layers: updatedLayers,
					},
				},
			},
		};
	} else {
		return state;
	}
};

/**
 * Remove layers satisfying filter from map
 * @param state {Object}
 * @param mapKey {string}
 * @param filter {object}
 * @return {Object} Updated state
 */
const removeMapLayersByFilter = (state, mapKey, filter) => {
	if (!_isEmpty(filter) && mapKey) {
		const mapLayers = [
			...(state.maps[mapKey]?.data?.layers
				? state.maps[mapKey].data.layers
				: []),
		];
		const originalMapLayersLength = mapLayers.length;

		// remove layers satisfying filter
		_remove(mapLayers, l => _isMatch(l, filter));

		if (
			originalMapLayersLength > 0 &&
			originalMapLayersLength !== mapLayers.length
		) {
			return {
				...state,
				maps: {
					...state.maps,
					[mapKey]: {
						...state.maps[mapKey],
						data: {
							...state.maps[mapKey].data,
							layers: mapLayers,
						},
					},
				},
			};
		} else {
			return state;
		}
	} else {
		return state;
	}
};

/**
 * Remove all layers from map
 * @param state {Object}
 * @param mapKey {string}
 * @return {Object} Updated state
 */
const removeAllMapLayers = (state, mapKey) => {
	if (mapKey && state.maps[mapKey]?.data?.layers?.length) {
		return {
			...state,
			maps: {
				...state.maps,
				[mapKey]: {
					...state.maps[mapKey],
					data: {
						...state.maps[mapKey].data,
						layers: [],
					},
				},
			},
		};
	} else {
		return state;
	}
};

/**
 * Add layer states to map
 * @param state {Object}
 * @param mapKey {string}
 * @param layerStates {Array} A collection, where each object represents state of the layer
 * @return {Object} updated state
 */
const addMapLayers = (state, mapKey, layerStates) => {
	if (mapKey && layerStates && state.maps?.[mapKey]) {
		const oldLayers = state.maps[mapKey].data?.layers;
		let updatedLayers = oldLayers
			? [...oldLayers, ...layerStates]
			: layerStates;

		return {
			...state,
			maps: {
				...state.maps,
				[mapKey]: {
					...state.maps[mapKey],
					data: state.maps[mapKey].data
						? {
								...state.maps[mapKey].data,
								layers: updatedLayers,
						  }
						: {layers: updatedLayers},
				},
			},
		};
	} else {
		return state;
	}
};

/**
 * Add layer to the specific position
 * @param state {Object}
 * @param mapKey {string}
 * @param layerState {Object}
 * @param index {number}
 * @return {Object} updated state
 */
const addMapLayerToIndex = (state, mapKey, layerState, index) => {
	if (mapKey && layerState && state.maps?.[mapKey]) {
		let updatedLayers;
		const currentLayers = state.maps[mapKey].data?.layers;
		if (currentLayers) {
			if (index > -1 && index < currentLayers.length) {
				updatedLayers = stateManagement.addItemToIndex(
					currentLayers,
					index,
					layerState
				);
			} else {
				updatedLayers = [...currentLayers, layerState];
			}
		} else {
			updatedLayers = [layerState];
		}

		return {
			...state,
			maps: {
				...state.maps,
				[mapKey]: {
					...state.maps[mapKey],
					data: state.maps[mapKey].data
						? {
								...state.maps[mapKey].data,
								layers: updatedLayers,
						  }
						: {layers: updatedLayers},
				},
			},
		};
	} else {
		return state;
	}
};

/**
 * Set styleKey to the specific layer of the specific map
 * @param state {Object}
 * @param mapKey {string}
 * @param layerKey {string}
 * @param styleKey {string} uuid
 * @return {Object} state
 */
const setMapLayerStyleKey = (state, mapKey, layerKey, styleKey) => {
	const layers = state.maps[mapKey]?.data?.layers;

	if (layers) {
		const updatedLayers = layers.map(item => {
			if (item.key === layerKey) {
				return {
					...item,
					styleKey,
				};
			} else {
				return item;
			}
		});

		return {
			...state,
			maps: {
				...state.maps,
				[mapKey]: {
					...state.maps[mapKey],
					data: {
						...state.maps[mapKey].data,
						layers: updatedLayers,
					},
				},
			},
		};
	} else {
		return state;
	}
};

/**
 * Set map layer opacity
 * @param state {Object}
 * @param mapKey {string}
 * @param layerKey {string}
 * @param opacity {number}
 * @return {Object} state
 */
const setMapLayerOpacity = (state, mapKey, layerKey, opacity) => {
	const layers = state.maps[mapKey]?.data?.layers;

	if (layers) {
		const updatedLayers = layers.map(item => {
			if (item.key === layerKey) {
				return {
					...item,
					opacity,
				};
			} else {
				return item;
			}
		});

		return {
			...state,
			maps: {
				...state.maps,
				[mapKey]: {
					...state.maps[mapKey],
					data: {
						...state.maps[mapKey].data,
						layers: updatedLayers,
					},
				},
			},
		};
	} else {
		return state;
	}
};

/**
 * Set map layer option
 * @param state {Object}
 * @param mapKey {string}
 * @param layerKey {string}
 * @param optionKey {string} Name of the property or path to property
 * @param optionValue {*}
 * @return {Object} state
 */
const setMapLayerOption = (state, mapKey, layerKey, optionKey, optionValue) => {
	const layers = state.maps[mapKey]?.data?.layers;

	if (layers) {
		const updatedLayers = layers.map(item => {
			if (item.key === layerKey) {
				return {
					...item,
					options: helpers.setHelper(
						item.options || {},
						optionKey.split('.'),
						optionValue
					),
				};
			} else {
				return item;
			}
		});

		return {
			...state,
			maps: {
				...state.maps,
				[mapKey]: {
					...state.maps[mapKey],
					data: {
						...state.maps[mapKey].data,
						layers: updatedLayers,
					},
				},
			},
		};
	} else {
		return state;
	}
};

/**
 * Set map width and height
 * @param state {Object}
 * @param mapKey {string}
 * @param width {number} map width in px
 * @param height {number} map height in px
 * @return {Object} state
 */
const setMapViewport = (state, mapKey, width, height) => {
	if (mapKey && state.maps?.[mapKey] && width && height) {
		return {
			...state,
			maps: {
				...state.maps,
				[mapKey]: {
					...state.maps[mapKey],
					data: state.maps[mapKey].data
						? {
								...state.maps[mapKey].data,
								viewport: {
									width,
									height,
								},
						  }
						: {
								viewport: {
									width,
									height,
								},
						  },
				},
			},
		};
	} else {
		return state;
	}
};

/**
 * Set active map of the map set
 * @param state {Object}
 * @param setKey {string}
 * @param mapKey {string}
 * @return {Object} state
 */
const setSetActiveMapKey = (state, setKey, mapKey) => {
	if (setKey && state.sets?.[setKey]) {
		return {
			...state,
			sets: {
				...state.sets,
				[setKey]: {
					...state.sets[setKey],
					activeMapKey: mapKey,
				},
			},
		};
	} else {
		return state;
	}
};

/**
 * Set map set background layer state
 * @param state {Object}
 * @param setKey {string}
 * @param backgroundLayer {Object} background layer state
 * @return {Object} state
 */
const setSetBackgroundLayer = (state, setKey, backgroundLayer) => {
	if (setKey && state.sets?.[setKey] && backgroundLayer) {
		return {
			...state,
			sets: {
				...state.sets,
				[setKey]: {
					...state.sets[setKey],
					data: {
						...state.sets[setKey].data,
						backgroundLayer,
					},
				},
			},
		};
	} else {
		return state;
	}
};

/**
 * Set map set active 3D property
 * @param state {Object}
 * @param setKey {string}
 * @param active3D {boolean}
 * @return {Object} state
 */
const setSetActive3D = (state, setKey, active3D) => {
	if (
		setKey &&
		state.sets?.[setKey] &&
		(active3D === true || active3D === false)
	) {
		return {
			...state,
			sets: {
				...state.sets,
				[setKey]: {
					...state.sets[setKey],
					data: {
						...state.sets[setKey].data,
						active3D,
					},
				},
			},
		};
	} else {
		return state;
	}
};

const setMapSetSync = (state, mapSetKey, sync) => {
	if (mapSetKey && state.sets?.[mapSetKey]) {
		return {
			...state,
			sets: {
				...state.sets,
				[mapSetKey]: {
					...state.sets[mapSetKey],
					sync,
				},
			},
		};
	} else {
		return state;
	}
};

/**
 * Set map background layer state
 * @param state {Object}
 * @param mapKey {string}
 * @param backgroundLayer {Object} background layer state
 * @return {Object} state
 */
const setMapBackgroundLayer = (state, mapKey, backgroundLayer) => {
	if (mapKey && state.maps?.[mapKey] && backgroundLayer) {
		return {
			...state,
			maps: {
				...state.maps,
				[mapKey]: {
					...state.maps[mapKey],
					data: state.maps[mapKey].data
						? {
								...state.maps[mapKey].data,
								backgroundLayer,
						  }
						: {backgroundLayer},
				},
			},
		};
	} else {
		return state;
	}
};

/**
 * Set map active 3D state
 * @param state {Object}
 * @param mapKey {string}
 * @param active3D {boolean}
 * @return {Object} state
 */
const setActive3D = (state, mapKey, active3D) => {
	if (
		mapKey &&
		state.maps?.[mapKey] &&
		(active3D === true || active3D === false)
	) {
		return {
			...state,
			maps: {
				...state.maps,
				[mapKey]: {
					...state.maps[mapKey],
					data: state.maps[mapKey].data
						? {
								...state.maps[mapKey].data,
								active3D,
						  }
						: {active3D},
				},
			},
		};
	} else {
		return state;
	}
};

/**
 * Set map set layers state
 * @param state {Object}
 * @param setKey {string}
 * @param layers {Object} layers state
 * @return {Object} state
 */
const setSetLayers = (state, setKey, layers) => {
	if (setKey && layers && state.sets?.[setKey]) {
		return {
			...state,
			sets: {
				...state.sets,
				[setKey]: {
					...state.sets[setKey],
					data: state.sets[setKey].data
						? {
								...state.sets[setKey].data,
								layers,
						  }
						: {layers},
				},
			},
		};
	} else {
		return state;
	}
};

/**
 * Update whole map state
 * @param state {Object}
 * @param data {Object}
 * @return {Object}
 */
const update = (state, data) => {
	return {...state, ...data};
};

/**
 * Update map view
 * @param state {Object}
 * @param mapKey {string}
 * @param updates {Object} map view updates
 * @return {Object} state
 */
const updateMapView = (state, mapKey, updates) => {
	if (updates && !_isEmpty(updates)) {
		return {
			...state,
			maps: {
				...state.maps,
				[mapKey]: {
					...state.maps[mapKey],
					data: {
						...state.maps[mapKey].data,
						previousView: state.maps[mapKey].data?.view || null,
						view: state.maps[mapKey].data.view
							? {...state.maps[mapKey].data.view, ...updates}
							: updates,
					},
				},
			},
		};
	} else {
		return state;
	}
};

/**
 * Update map set view
 * @param state {Object}
 * @param setKey {string}
 * @param updates {Object} map view updates
 * @return {Object} state
 */
const updateSetView = (state, setKey, updates) => {
	if (updates && !_isEmpty(updates)) {
		return {
			...state,
			sets: {
				...state.sets,
				[setKey]: {
					...state.sets[setKey],
					data: {
						...state.sets[setKey].data,
						previousView: state.sets[setKey].data?.view || null,
						view: state.sets[setKey].data.view
							? {...state.sets[setKey].data.view, ...updates}
							: updates,
					},
				},
			},
		};
	} else {
		return state;
	}
};

/**
 * Remove map usage
 * @param state {Object}
 * @param mapKey {string}
 * @return {Object} state
 */
const mapUseClear = (state, mapKey) => {
	if (mapKey) {
		const index = _indexOf(state.inUse.maps, mapKey);
		if (index > -1) {
			const updatedInUse = stateManagement.removeItemByIndex(
				state.inUse.maps,
				index
			);

			return {
				...state,
				inUse: {
					...state.inUse,
					maps: updatedInUse,
				},
			};
		} else {
			return state;
		}
	} else {
		return state;
	}
};

/**
 * Remove map set usage
 * @param state {Object}
 * @param mapSetKey {string}
 * @return {Object} state
 */
const mapSetUseClear = (state, mapSetKey) => {
	if (mapSetKey) {
		const index = _indexOf(state.inUse.sets, mapSetKey);
		if (index > -1) {
			const updatedInUse = stateManagement.removeItemByIndex(
				state.inUse.sets,
				index
			);

			return {
				...state,
				inUse: {
					...state.inUse,
					sets: updatedInUse,
				},
			};
		} else {
			return state;
		}
	} else {
		return state;
	}
};

/**
 * Register map usage
 * @param state {Object}
 * @param mapKey {string}
 * @return {Object} state
 */
const mapUseRegister = (state, mapKey) => {
	if (mapKey) {
		return {
			...state,
			inUse: {
				...state.inUse,
				maps: [...state.inUse.maps, mapKey],
			},
		};
	} else {
		return state;
	}
};

/**
 * Register map set usage
 * @param state {Object}
 * @param mapSetKey {string}
 * @return {Object} state
 */
const mapSetUseRegister = (state, mapSetKey) => {
	if (mapSetKey) {
		return {
			...state,
			inUse: {
				...state.inUse,
				sets: [...state.inUse.sets, mapSetKey],
			},
		};
	} else {
		return state;
	}
};

/**
 * Set and overwrite metadataModifiers object for map
 * @param state {Object}
 * @param mapKey {string} Related mapKey
 * @param metadataModifiers {Object} New metadataModifiers state object
 * @return {Object} Updated state
 */
const setMetadataModifiersByMapKey = (state, mapKey, metadataModifiers) => {
	if (mapKey && state.maps[mapKey]?.data) {
		return {
			...state,
			maps: {
				...state.maps,
				[mapKey]: {
					...state.maps[mapKey],
					data: {
						...state.maps[mapKey].data,
						metadataModifiers,
					},
				},
			},
		};
	} else {
		return state;
	}
};

export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.MAPS.MAP.ADD:
			return addMap(state, action.map);
		case ActionTypes.MAPS.MAP.LAYERS.ADD:
			return addMapLayers(state, action.mapKey, action.layerStates);
		case ActionTypes.MAPS.MAP.LAYERS.ADD_TO_INDEX:
			return addMapLayerToIndex(
				state,
				action.mapKey,
				action.layerState,
				action.index
			);
		case ActionTypes.MAPS.MAP.LAYERS.REMOVE_LAYER:
			return removeMapLayer(state, action.mapKey, action.layerKey);
		case ActionTypes.MAPS.MAP.LAYERS.REMOVE_LAYERS:
			return removeMapLayers(state, action.mapKey, action.layerKeys);
		case ActionTypes.MAPS.MAP.LAYERS.REMOVE_LAYERS_BY_FILTER:
			return removeMapLayersByFilter(state, action.mapKey, action.filter);
		case ActionTypes.MAPS.MAP.LAYERS.REMOVE_ALL:
			return removeAllMapLayers(state, action.mapKey);
		case ActionTypes.MAPS.MAP.LAYERS.SET_OPACITY:
			return setMapLayerOpacity(
				state,
				action.mapKey,
				action.layerKey,
				action.opacity
			);
		case ActionTypes.MAPS.MAP.LAYERS.SET_OPTION:
			return setMapLayerOption(
				state,
				action.mapKey,
				action.layerKey,
				action.optionKey,
				action.optionValue
			);
		case ActionTypes.MAPS.MAP.LAYERS.SET_STYLE_KEY:
			return setMapLayerStyleKey(
				state,
				action.mapKey,
				action.layerKey,
				action.styleKey
			);
		case ActionTypes.MAPS.MAP.REMOVE:
			return removeMap(state, action.mapKey);
		case ActionTypes.MAPS.MAP.USE.CLEAR:
			return mapUseClear(state, action.mapKey);
		case ActionTypes.MAPS.MAP.USE.REGISTER:
			return mapUseRegister(state, action.mapKey);
		case ActionTypes.MAPS.MAP.VIEW.UPDATE:
			return updateMapView(state, action.mapKey, action.update);
		case ActionTypes.MAPS.MAP.VIEWPORT.SET:
			return setMapViewport(state, action.mapKey, action.width, action.height);
		case ActionTypes.MAPS.MAP.SET_BACKGROUND_LAYER:
			return setMapBackgroundLayer(
				state,
				action.mapKey,
				action.backgroundLayer
			);
		case ActionTypes.MAPS.MAP.SET_ACTIVE3D:
			return setActive3D(state, action.mapKey, action.active3D);
		case ActionTypes.MAPS.SET.ADD:
			return addMapSet(state, action.mapSet);
		case ActionTypes.MAPS.SET.ADD_MAP:
			return addMapToSet(state, action.mapKey, action.mapSetKey);
		case ActionTypes.MAPS.SET.REMOVE:
			return removeMapSet(state, action.mapSetKey);
		case ActionTypes.MAPS.SET.REMOVE_MAP:
			return removeMapFromSet(state, action.setKey, action.mapKey);
		case ActionTypes.MAPS.SET.SET_ACTIVE_MAP_KEY:
			return setSetActiveMapKey(state, action.setKey, action.mapKey);
		case ActionTypes.MAPS.SET.SET_BACKGROUND_LAYER:
			return setSetBackgroundLayer(
				state,
				action.setKey,
				action.backgroundLayer
			);
		case ActionTypes.MAPS.SET.SET_ACTIVE3D:
			return setSetActive3D(state, action.mapSetKey, action.active3D);
		case ActionTypes.MAPS.SET.SET_SYNC:
			return setMapSetSync(state, action.mapSetKey, action.sync);
		case ActionTypes.MAPS.SET.LAYERS.SET:
			return setSetLayers(state, action.setKey, action.layers);
		case ActionTypes.MAPS.SET.USE.CLEAR:
			return mapSetUseClear(state, action.mapSetKey);
		case ActionTypes.MAPS.SET.USE.REGISTER:
			return mapSetUseRegister(state, action.mapSetKey);
		case ActionTypes.MAPS.SET.VIEW.UPDATE:
			return updateSetView(state, action.setKey, action.update);
		case ActionTypes.MAPS.SET_ACTIVE_MAP_KEY:
			return setActiveMapKey(state, action.mapKey);
		case ActionTypes.MAPS.UPDATE:
			return update(state, action.data);
		case ActionTypes.MAPS.MAP.METADATA_MODIFIERS.SET:
			return setMetadataModifiersByMapKey(
				state,
				action.mapKey,
				action.metadataModifiers
			);
		default:
			return state;
	}
}
