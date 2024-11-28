import {
	each as _each,
	isMatch as _isMatch,
	isNumber as _isNumber,
	omitBy as _omitBy,
	pickBy as _pickBy,
	includes as _includes,
	isEmpty as _isEmpty,
} from 'lodash';
import {map as mapUtils} from '@gisatcz/ptr-utils';

import ActionTypes from '../../constants/ActionTypes';
import Select from '../../state/Select';
import commonActions from '../_common/actions';
import commonHelpers from '../_common/helpers';
import commonSelectors from '../_common/selectors';

import SpatialDataSourcesActions from '../Data/SpatialDataSources/actions';
import DataActions from '../Data/actions';
import {
	TILED_VECTOR_LAYER_TYPES,
	SINGLE_VECTOR_LAYER_TYPES,
} from '../Data/constants';
import StylesActions from '../Styles/actions';

import helpers from './selectorHelpers';
import SelectionsAction from '../Selections/actions';

/* ==================================================
 * CREATORS
 * ================================================== */

/**
 * Add map to store and dispatch use
 * @param mapState {Object}
 */
const addMap = mapState => {
	return dispatch => {
		if (!mapState) {
			dispatch(commonActions.actionGeneralError(`No map state given`));
		} else if (!mapState.key) {
			dispatch(
				commonActions.actionGeneralError(`Undefined mapKey for map ${mapState}`)
			);
		} else {
			dispatch(actionAddMap(mapState));
			dispatch(use(mapState.key, null, null));
		}
	};
};

/**
 * If map set exists, add map to map set and dispatch use
 * @param mapKey {string}
 * @param mapSetKey {string}
 */
const addMapToSet = (mapKey, mapSetKey) => {
	return (dispatch, getState) => {
		if (mapKey && mapSetKey) {
			const state = getState();
			const mapSet = Select.maps.getMapSetByKey(state, mapSetKey);
			if (mapSet) {
				dispatch(actionAddMapToSet(mapKey, mapSetKey));
				dispatch(use(mapKey, null, null));
			} else {
				dispatch(
					commonActions.actionGeneralError(
						`No mapSet found for given key ${mapSetKey}`
					)
				);
			}
		} else {
			dispatch(
				commonActions.actionGeneralError(`No mapKey or mapSetKey given`)
			);
		}
	};
};

/**
 * Add map set to store and dispatch use for all maps from the map set
 * @param mapSetState {Object}
 */
const addMapSet = mapSetState => {
	return dispatch => {
		if (!mapSetState) {
			dispatch(commonActions.actionGeneralError(`No map state given`));
		} else if (!mapSetState.key) {
			dispatch(
				commonActions.actionGeneralError(
					`Undefined mapKey for map ${mapSetState}`
				)
			);
		} else {
			dispatch(actionAddMapSet(mapSetState));
			if (mapSetState.maps?.length) {
				dispatch(actionMapSetUseRegister(mapSetState.key));
				mapSetState.maps.forEach(mapKey => dispatch(use(mapKey, null, null)));
			}
		}
	};
};

/**
 * Add layers at the end of map layers list
 * @param mapKey {string}
 * @param layerStates {Array} A collection, where each object represents state of the layer
 */
const addMapLayers = (mapKey, layerStates) => {
	return (dispatch, getState) => {
		const state = getState();
		const map = Select.maps.getMapByKey(state, mapKey);
		if (map) {
			dispatch(actionAddMapLayers(mapKey, layerStates));
			dispatch(use(mapKey, null, null));
		} else {
			dispatch(
				commonActions.actionGeneralError(`No map exists for mapKey ${mapKey}`)
			);
		}
	};
};

/**
 * Add map layer to the specific position in the list
 * @param mapKey {string}
 * @param layerState {Object}
 * @param index {number} position
 */
const addMapLayerToIndex = (mapKey, layerState, index) => {
	return (dispatch, getState) => {
		const state = getState();
		const map = Select.maps.getMapByKey(state, mapKey);
		if (map) {
			dispatch(actionAddMapLayerToIndex(mapKey, layerState, index));
			dispatch(use(mapKey, null, null));
		} else {
			dispatch(
				commonActions.actionGeneralError(`No map exists for mapKey ${mapKey}`)
			);
		}
	};
};

/**
 * Remove map from store
 * @param mapKey {string}
 */
const removeMap = mapKey => {
	return (dispatch, getState) => {
		const state = getState();
		const existingMap = Select.maps.getMapByKey(state, mapKey);

		if (existingMap) {
			const inUse = Select.maps.isMapInUse(state, mapKey);
			const mapSets = Select.maps.getMapSets(state);

			if (inUse) {
				dispatch(actionMapUseClear(mapKey));
			}

			if (mapSets) {
				_each(mapSets, mapSet => {
					const mapSetMapKey = _includes(mapSet?.maps, mapKey);
					if (mapSetMapKey) {
						dispatch(removeMapFromSet(mapSet.key, mapKey));
					}
				});
			}

			dispatch(actionRemoveMap(mapKey));
		}
	};
};

/**
 * Remove map set from store
 * @param setKey {string}
 */
const removeMapSet = setKey => {
	return (dispatch, getState) => {
		const state = getState();
		const existingSet = Select.maps.getMapSetByKey(state, setKey);

		if (existingSet) {
			const inUse = Select.maps.isMapSetInUse(state, setKey);

			if (inUse) {
				dispatch(actionMapSetUseClear(setKey));
			}

			dispatch(actionRemoveMapSet(setKey));
		}
	};
};

/**
 * Remove layer from map
 * @param mapKey {string}
 * @param layerKey {string}
 */
const removeMapLayer = (mapKey, layerKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const layerState = Select.maps.getLayerStateByLayerKeyAndMapKey(
			state,
			mapKey,
			layerKey
		);
		if (layerState) {
			dispatch(actionRemoveMapLayer(mapKey, layerKey));
		} else {
			dispatch(
				commonActions.actionGeneralError(
					`No layer with key ${layerKey} found for mapKey ${mapKey}`
				)
			);
		}
	};
};

// TODO test
const removeMapLayersByLayerTemplateKey = (mapKey, layerTemplateKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const layersState = Select.maps.getLayersStateByMapKey(state, mapKey);
		if (layersState?.length) {
			layersState.forEach(layer => {
				if (layer.layerTemplateKey === layerTemplateKey) {
					dispatch(actionRemoveMapLayer(mapKey, layer.key));
				}
			});
		}
	};
};

/**
 * Remove all layers satisfying filter from map
 * @param mapKey {string}
 * @param filter {object}
 */
const removeMapLayersByFilter = (mapKey, filter) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapLayers = Select.maps.getMapLayersStateWithModifiersByMapKey(
			state,
			mapKey
		);
		const mapLayersByFilter = mapLayers?.filter(l => _isMatch(l, filter));

		if (mapLayersByFilter?.length) {
			dispatch(actionRemoveMapLayersByFilter(mapKey, filter));
		} else {
			dispatch(
				commonActions.actionGeneralError(
					`No layers satisfying filter ${filter} found for mapKey ${mapKey}`
				)
			);
		}
	};
};

/**
 * Remove layers from map
 * @param mapKey {string}
 * @param layerKeys {Array}
 */
const removeMapLayers = (mapKey, layerKeys) => {
	return (dispatch, getState) => {
		if (layerKeys?.length) {
			const state = getState();
			const layersToRemove = [];

			layerKeys.forEach(layerKey => {
				const layerState = Select.maps.getLayerStateByLayerKeyAndMapKey(
					state,
					mapKey,
					layerKey
				);

				if (layerState) {
					layersToRemove.push(layerKey);
				} else {
					dispatch(
						commonActions.actionGeneralError(
							`No layer with key ${layerKey} found for mapKey ${mapKey}`
						)
					);
				}
			});

			if (layersToRemove.length) {
				dispatch(actionRemoveMapLayers(mapKey, layersToRemove));
			}
		}
	};
};

/**
 * Clear use of the map set
 * @param mapSetKey {string}
 */
const mapSetUseClear = mapSetKey => {
	return (dispatch, getState) => {
		const registered = Select.maps.isMapSetInUse(getState(), mapSetKey);
		if (registered) {
			dispatch(actionMapSetUseClear(mapSetKey));
		}
	};
};

/**
 * Register use of the map set
 * @param mapSetKey {string}
 */
const mapSetUseRegister = mapSetKey => {
	return (dispatch, getState) => {
		const alreadyRegistered = Select.maps.isMapSetInUse(getState(), mapSetKey);
		if (!alreadyRegistered) {
			dispatch(actionMapSetUseRegister(mapSetKey));
		}
	};
};

/**
 * Clear use of the map
 * @param mapKey {string}
 */
const mapUseClear = mapKey => {
	return (dispatch, getState) => {
		const registered = Select.maps.isMapInUse(getState(), mapKey);
		if (registered) {
			dispatch(actionMapUseClear(mapKey));
		}
	};
};

/**
 * Register use of the map
 * @param mapKey {string}
 */
const mapUseRegister = mapKey => {
	return (dispatch, getState) => {
		const alreadyRegistered = Select.maps.isMapInUse(getState(), mapKey);
		if (!alreadyRegistered) {
			dispatch(actionMapUseRegister(mapKey));
		}
	};
};

/**
 * Set metadataModifiers for map
 * @param mapKey {string}
 * @param metadataModifiers {Object}
 */
const setMapMetadataModifiers = (mapKey, metadataModifiers) => {
	return (dispatch, getState) => {
		const state = getState();
		const map = Select.maps.getMapByKey(state, mapKey);
		if (map) {
			dispatch(actionSetMapMetadataModifiers(mapKey, metadataModifiers));
			dispatch(use(mapKey, null, null));
		} else {
			dispatch(
				commonActions.actionGeneralError(`No map exists for mapKey ${mapKey}`)
			);
		}
	};
};

/**
 * @param mapKey {string}
 * @param backgroundLayer {Object} background layer definition
 * @param layers {Object} layers definition
 */
function use(mapKey, backgroundLayer, layers) {
	return (dispatch, getState) => {
		dispatch(mapUseRegister(mapKey));
		const state = getState();
		const mapViewport = Select.maps.getViewportByMapKey(state, mapKey);
		if (!mapViewport) {
			return;
		}
		const {width: mapWidth, height: mapHeight} = mapViewport;

		const spatialFilter = Select.maps.getVisibleTilesByMapKey(
			state,
			mapKey,
			mapWidth,
			mapHeight
		);
		//spatial filter is required for now
		if (!spatialFilter) {
			return;
		}
		// uncontrolled map - the map is not controlled from store, but layer data is collected based on stored metadata.
		if (backgroundLayer || layers) {
			layers = helpers.mergeBackgroundLayerWithLayers(layers, backgroundLayer);
		}
		// controlled map (with stateMapKey) - the map is completely controlled from store
		else {
			layers = Select.maps.getAllLayersStateByMapKey(state, mapKey);
		}

		if (layers) {
			layers.forEach(layer => {
				// apply layerUse asynchronous on each leyer
				// it cause better FPS and prevent long synchronous tasks
				if (!layer.type) {
					setTimeout(() => {
						dispatch(layerUse(layer, spatialFilter));
					}, 0);
				}
			});
		}
	};
}

/**
 * @param layerState {Object} layer definition
 * @param spatialFilter {{level: number}, {tiles: Array}}
 */
function layerUse(layerState) {
	return (dispatch, getState) => {
		const state = getState();

		// modifiers defined by key
		let metadataDefinedByKey = layerState.metadataModifiers
			? {...layerState.metadataModifiers}
			: {};

		// add layerTemplate od areaTreeLevelKey
		if (layerState.layerTemplateKey) {
			metadataDefinedByKey.layerTemplateKey = layerState.layerTemplateKey;
			// TODO use layerTemplate here?
		}

		if (layerState.areaTreeLevelKey) {
			metadataDefinedByKey.areaTreeLevelKey = layerState.areaTreeLevelKey;
			// TODO use areaTreeLevelKey here?
		}

		// Get actual metadata keys defined by filterByActive
		const activeMetadataKeys = layerState.filterByActive
			? commonSelectors.getActiveKeysByFilterByActive(
					state,
					layerState.filterByActive
			  )
			: null;

		// Merge metadata, metadata defined by key have priority
		const mergedMetadataKeys = commonHelpers.mergeMetadataKeys(
			metadataDefinedByKey,
			activeMetadataKeys
		);

		// Decouple modifiers from templates
		const {areaTreeLevelKey, layerTemplateKey, ...modifiers} =
			mergedMetadataKeys;

		// It converts modifiers from metadataKeys: ["A", "B"] to metadataKey: {in: ["A", "B"]}
		const modifiersForRequest =
			commonHelpers.convertModifiersToRequestFriendlyFormat(modifiers);
		if (layerTemplateKey || areaTreeLevelKey) {
			let commonRelationsFilter = {};

			if (layerTemplateKey) {
				commonRelationsFilter = {
					...(modifiersForRequest && {modifiers: modifiersForRequest}),
					layerTemplateKey,
				};
			}

			if (layerTemplateKey) {
				const order = null;
				const spatialDataSources = Select.data.spatialDataSources.getIndexed(
					state,
					commonRelationsFilter,
					order
				);

				//also for single tile
				const sdsContainsVector =
					spatialDataSources?.some(spatialDataSource =>
						[
							...TILED_VECTOR_LAYER_TYPES,
							...SINGLE_VECTOR_LAYER_TYPES,
						].includes(spatialDataSource?.data?.type)
					) || false;
				// load only dataSources that are supported type
				if (spatialDataSources && !sdsContainsVector) {
					return;
				}
			}

			if (areaTreeLevelKey) {
				commonRelationsFilter = {
					...(modifiersForRequest && {modifiers: modifiersForRequest}),
					areaTreeLevelKey,
				};
			}

			const styleKey = layerState.styleKey || null;

			// TODO ensure style here for now
			if (styleKey) {
				dispatch(
					StylesActions.useKeys(
						[layerState.styleKey],
						layerState.key + '_layerUse'
					)
				);
			}

			// const attributeDataFilterExtension = {
			// 	...(layerState?.options?.attributeFilter && {
			// 		attributeFilter: layerState.options.attributeFilter,
			// 	}),
			// 	...(layerState?.options?.dataSourceKeys && {
			// 		dataSourceKeys: layerState.options.dataSourceKeys,
			// 	}),
			// 	...(layerState?.options?.featureKeys && {
			// 		featureKeys: layerState.options.featureKeys,
			// 	}),
			// };

			const {modifiers, ...restFilter} = commonRelationsFilter;
			const relationFilter = {
				...(styleKey ? {styleKey} : {}),
				...(modifiers && Object.values(modifiers).length > 0 ? modifiers : {}),
				...(restFilter && Object.values(restFilter).length > 0
					? restFilter
					: {}),
			};
			// Ensure spatial data source at the first step
			dispatch(
				SpatialDataSourcesActions.ensureIndexed(relationFilter, null, 0, 100)
			).then(() => {
				const spatialDataSources =
					Select.data.spatialDataSources.getIndexed_recompute(
						// spatialRelationsFilter
						relationFilter
					);

				const sdsType = spatialDataSources?.[0]?.data?.type;

				if (
					[...TILED_VECTOR_LAYER_TYPES, ...SINGLE_VECTOR_LAYER_TYPES].includes(
						sdsType
					)
				) {
					// separate attributes from vectors
					// same endpoint? for just attribute data
					// save attributes
					// save geometry
					const sds = spatialDataSources[0];
					const featureIdColumnName = sds?.data?.fidColumnName;
					// const featureIdColumnName = null;
					// TODO - get attributes from style?
					const attributes = [];
					if (sds) {
						return dispatch(
							DataActions.newEnsureData(
								featureIdColumnName,
								attributes,
								sds?.data?.vectorKey,
								sds?.key,
								commonRelationsFilter
							)
						);
					}
				} else {
					// web type
					// do nothing
					// FIXME - remove
					console.log('xxx_data', spatialDataSources, sdsType);
				}
			});
		}
	};
}

/**
 * Ensure indexes with filter by active for each active map
 * @param filterByActive {Object}
 */
function ensureWithFilterByActive(filterByActive) {
	return (dispatch, getState) => {
		const state = getState();
		const activeKeys = commonSelectors.getAllActiveKeys(state);
		const mapKeys = Select.maps.getAllMapsInUse(state);

		if (mapKeys && activeKeys) {
			mapKeys.forEach(mapKey => {
				const mapViewport = Select.maps.getViewportByMapKey(state, mapKey);
				if (mapViewport) {
					const {width, height} = mapViewport;
					const spatialFilter = Select.maps.getVisibleTilesByMapKey(
						state,
						mapKey,
						width,
						height
					);

					if (spatialFilter) {
						const layers = Select.maps.getAllLayersStateByMapKey(state, mapKey);
						if (layers) {
							layers.forEach(layer => {
								if (
									layer.filterByActive &&
									_isMatch(layer.filterByActive, filterByActive)
								) {
									// apply layerUse asynchronous on each leyer
									// it cause better FPS and prevent long synchronous tasks
									setTimeout(() => {
										dispatch(layerUse(layer, spatialFilter, activeKeys));
									}, 0);
								}
							});
						}
					}
				}
			});
		}
	};
}

/**
 * @param mapKey {string}
 * @param layerKey {string}
 * @param selectedFeatureKeys {Array}
 */
function setLayerSelectedFeatureKeys(mapKey, layerKey, selectedFeatureKeys) {
	return (dispatch, getState) => {
		const state = getState();
		const layer = Select.maps.getLayerStateByLayerKeyAndMapKey(
			state,
			mapKey,
			layerKey
		);
		if (layer?.options?.selectable) {
			const activeSelectionKey = Select.selections.getActiveKey(state);
			if (
				activeSelectionKey &&
				layer?.options?.selected &&
				Object.hasOwn(layer.options.selected, activeSelectionKey)
			) {
				// TODO possible conflicts if features with same key from different layers are selected
				dispatch(
					SelectionsAction.setActiveSelectionFeatureKeysFilterKeys(
						selectedFeatureKeys
					)
				);
			} else {
				// TODO what if there is no active selection?
			}
		}
	};
}

/**
 * @param mapKey {string}
 * @param layerKey {string}
 * @param styleKey {string}
 */
function setMapLayerStyleKey(mapKey, layerKey, styleKey) {
	return (dispatch, getState) => {
		const layer = Select.maps.getLayerStateByLayerKeyAndMapKey(
			getState(),
			mapKey,
			layerKey
		);
		if (layer) {
			dispatch(actionSetMapLayerStyleKey(mapKey, layerKey, styleKey));
		}
	};
}

/**
 * Set map layer opacity
 * @param mapKey {string}
 * @param layerKey {string}
 * @param opacity {number} from 0 to 1
 */
function setMapLayerOpacity(mapKey, layerKey, opacity) {
	return (dispatch, getState) => {
		const layer = Select.maps.getLayerStateByLayerKeyAndMapKey(
			getState(),
			mapKey,
			layerKey
		);
		if (layer) {
			dispatch(actionSetMapLayerOpacity(mapKey, layerKey, opacity));
		} else {
			dispatch(
				commonActions.actionGeneralError(
					`No layer found for mapKey ${mapKey} and layerKey ${layerKey}`
				)
			);
		}
	};
}

/**
 * Set map layer option
 * @param mapKey {string}
 * @param layerKey {string}
 * @param optionKey {string}
 * @param optionValue {*}
 */
function setMapLayerOption(mapKey, layerKey, optionKey, optionValue) {
	return (dispatch, getState) => {
		const layer = Select.maps.getLayerStateByLayerKeyAndMapKey(
			getState(),
			mapKey,
			layerKey
		);
		if (layer) {
			dispatch(
				actionSetMapLayerOption(mapKey, layerKey, optionKey, optionValue)
			);
		} else {
			dispatch(
				commonActions.actionGeneralError(
					`No layer found for mapKey ${mapKey} and layerKey ${layerKey}`
				)
			);
		}
	};
}

/**
 * @param mapKey {string}
 */
function setMapSetActiveMapKey(mapKey) {
	return (dispatch, getState) => {
		const state = getState();
		const set = Select.maps.getMapSetByMapKey(state, mapKey);
		if (set) {
			const activeMapKey = Select.maps.getMapSetActiveMapKey(state, set.key);
			if (activeMapKey !== mapKey) {
				dispatch(actionSetMapSetActiveMapKey(set.key, mapKey));
			}
		}
	};
}

/**
 * @param setKey {string}
 * @param backgroundLayer {Object} background layer definition
 */
function setMapSetBackgroundLayer(setKey, backgroundLayer) {
	return (dispatch, getState) => {
		dispatch(actionSetMapSetBackgroundLayer(setKey, backgroundLayer));
		const maps = Select.maps.getMapSetMaps(getState(), setKey);
		if (maps) {
			maps.forEach(map => {
				// TODO is viewport always defined?
				dispatch(use(map.key, null, null));
			});
		}
	};
}

/**
 * Set active 3D for given mapSetKey
 * @param {string} setKey
 * @param {boolean} active3D
 * @returns
 */
function setMapSetActive3D(setKey, active3D) {
	return (dispatch, getState) => {
		const mapSet = Select.maps.getMapSetByKey(getState(), setKey);
		const active3DValid = active3D === true || active3D === false;
		if (mapSet && active3DValid) {
			dispatch(actionSetMapSetActive3D(setKey, active3D));
		} else {
			console.warn('No mapSet found for set key or active3D invalid.');
		}
	};
}

/**
 * Set active 3D for given mapKey
 * @param {string} mapKey
 * @param {boolean} active3D
 * @returns
 */
function setMapActive3D(mapKey, active3D) {
	return (dispatch, getState) => {
		const map = Select.maps.getMapByKey(getState(), mapKey);
		const active3DValid = active3D === true || active3D === false;
		if (map && active3DValid) {
			dispatch(actionSetMapActive3D(mapKey, active3D));
		} else {
			console.warn('No map found for key or active3D invalid.');
		}
	};
}
/**
 * Set background layer for map.
 * @param mapKey {string}
 * @param backgroundLayer {Object} background layer definition
 */
function setMapBackgroundLayer(mapKey, backgroundLayer) {
	return (dispatch, getState) => {
		const map = Select.maps.getMapByKey(getState(), mapKey);
		if (map) {
			dispatch(actionSetMapBackgroundLayer(mapKey, backgroundLayer));

			// Call use action only on state controlled layers
			if (!backgroundLayer.type) {
				const backgroundLayerState =
					Select.maps.getMapBackgroundLayerStateByMapKey(getState(), mapKey);

				const spatialFilter = Select.maps.getVisibleTilesByMapKey(
					getState(),
					mapKey,
					map?.data?.viewport?.width,
					map?.data?.viewport?.height
				);
				//spatial filter is required for now
				if (!spatialFilter || !backgroundLayerState) {
					return;
				}
				dispatch(layerUse(backgroundLayerState, spatialFilter));
			} else {
				return;
			}
		}
	};
}

/**
 * @param setKey {string}
 * @param layers {Array} layers definitions
 */
function setMapSetLayers(setKey, layers) {
	return (dispatch, getState) => {
		const set = Select.maps.getMapSetByKey(getState(), setKey);
		if (set) {
			dispatch(actionSetMapSetLayers(setKey, layers));
			const maps = Select.maps.getMapSetMaps(getState(), setKey);
			if (maps) {
				maps.forEach(map => {
					dispatch(use(map.key, null, null));
				});
			}
		} else {
			dispatch(
				commonActions.actionGeneralError(`No set exists for setKey ${setKey}`)
			);
		}
	};
}

/**
 * Set sync for map set. It tells which view params are synchronized for all maps in the set.
 * @param setKey {string}
 * @param sync {Object} layers definitions
 */
function setMapSetSync(setKey, sync) {
	return (dispatch, getState) => {
		const set = Select.maps.getMapSetByKey(getState(), setKey);
		if (set) {
			dispatch(actionSetMapSetSync(setKey, sync));
		}
	};
}

/**
 * @param setKey {string}
 */
function refreshMapSetUse(setKey) {
	return (dispatch, getState) => {
		const maps = Select.maps.getMapSetMaps(getState(), setKey);
		if (maps) {
			maps.forEach(map => {
				// TODO is viewport always defined?
				dispatch(use(map.key, null, null));
			});
		}
	};
}

/**
 * @param setKey {string}
 * @param mapKey {string}
 */
function removeMapFromSet(setKey, mapKey) {
	return (dispatch, getState) => {
		const state = getState();
		const mapSetMapKeys = Select.maps.getMapSetMapKeys(state, setKey);
		if (mapSetMapKeys && mapSetMapKeys.includes(mapKey)) {
			const activeMapKey = Select.maps.getMapSetActiveMapKey(state, setKey);
			dispatch(actionRemoveMapFromSet(setKey, mapKey));

			// if map to remove is active at the same time
			if (activeMapKey === mapKey) {
				// check map set map keys again & set first map as active
				const mapSetMapKeys = Select.maps.getMapSetMapKeys(getState(), setKey);
				if (!_isEmpty(mapSetMapKeys)) {
					dispatch(actionSetMapSetActiveMapKey(setKey, mapSetMapKeys[0]));
				}
			}
		}
	};
}

/**
 * @param mapKey {string}
 * @param update {Object} map view fragment
 */
function updateMapAndSetView(mapKey, update) {
	return (dispatch, getState) => {
		const set = Select.maps.getMapSetByMapKey(getState(), mapKey);
		let forSet, forMap;
		const map = Select.maps.getMapByKey(getState(), mapKey);
		if (set && set.sync && map) {
			// pick key-value pairs that are synced for set
			forSet = _pickBy(update, (updateVal, updateKey) => {
				return set.sync[updateKey];
			});

			forMap = _omitBy(update, (updateVal, updateKey) => {
				return set.sync[updateKey];
			});
		} else if (map) {
			forMap = update;
		}

		if (forSet && !_isEmpty(forSet)) {
			//check data integrity
			forSet = mapUtils.view.ensureViewIntegrity(forSet); //TODO test
			dispatch(actionUpdateSetView(set.key, forSet));
		}

		if (forMap && !_isEmpty(forMap)) {
			//check data integrity
			forMap = mapUtils.view.ensureViewIntegrity(forMap); //TODO test
			dispatch(actionUpdateMapView(mapKey, forMap));
		}
	};
}

/**
 * @param setKey {string}
 * @param update {Object} map view fragment
 */
function updateSetView(setKey, update) {
	return (dispatch, getState) => {
		let activeMapKey = Select.maps.getMapSetActiveMapKey(getState(), setKey);
		if (activeMapKey) {
			dispatch(updateMapAndSetView(activeMapKey, update));
		}
	};
}

/**
 * Update whole maps state from view definition
 * @param data {Object}
 */
function updateStateFromView(data) {
	return dispatch => {
		if (data) {
			dispatch(actionUpdate(data));
		}
	};
}

function setMapViewport(mapKey, width, height) {
	return (dispatch, getState) => {
		if (mapKey && _isNumber(width) && _isNumber(height)) {
			const state = getState();
			const existingMap = Select.maps.getMapByKey(state, mapKey);
			const currentViewport = Select.maps.getViewportByMapKey(state, mapKey);
			if (
				existingMap &&
				(!currentViewport ||
					currentViewport?.width !== width ||
					currentViewport?.height !== height)
			) {
				dispatch(actionSetMapViewport(mapKey, width, height));
			}
		}
	};
}

/* ==================================================
 * ACTIONS
 * ================================================== */

const actionAddMap = map => {
	return {
		type: ActionTypes.MAPS.MAP.ADD,
		map,
	};
};

const actionAddMapSet = mapSet => {
	return {
		type: ActionTypes.MAPS.SET.ADD,
		mapSet,
	};
};

const actionAddMapToSet = (mapKey, mapSetKey) => {
	return {
		type: ActionTypes.MAPS.SET.ADD_MAP,
		mapKey,
		mapSetKey,
	};
};

const actionAddMapLayers = (mapKey, layerStates) => {
	return {
		type: ActionTypes.MAPS.MAP.LAYERS.ADD,
		mapKey,
		layerStates,
	};
};

const actionAddMapLayerToIndex = (mapKey, layerState, index) => {
	return {
		type: ActionTypes.MAPS.MAP.LAYERS.ADD_TO_INDEX,
		mapKey,
		layerState,
		index,
	};
};

const actionRemoveMap = mapKey => {
	return {
		type: ActionTypes.MAPS.MAP.REMOVE,
		mapKey,
	};
};

const actionRemoveMapSet = mapSetKey => {
	return {
		type: ActionTypes.MAPS.SET.REMOVE,
		mapSetKey,
	};
};

const actionRemoveMapLayer = (mapKey, layerKey) => {
	return {
		type: ActionTypes.MAPS.MAP.LAYERS.REMOVE_LAYER,
		mapKey,
		layerKey,
	};
};

const actionRemoveMapLayers = (mapKey, layerKeys) => {
	return {
		type: ActionTypes.MAPS.MAP.LAYERS.REMOVE_LAYERS,
		mapKey,
		layerKeys,
	};
};
const actionRemoveMapLayersByFilter = (mapKey, filter) => {
	return {
		type: ActionTypes.MAPS.MAP.LAYERS.REMOVE_LAYERS_BY_FILTER,
		mapKey,
		filter,
	};
};

const actionRemoveAllMapLayers = mapKey => {
	return {
		type: ActionTypes.MAPS.MAP.LAYERS.REMOVE_ALL,
		mapKey,
	};
};

const actionRemoveMapFromSet = (setKey, mapKey) => {
	return {
		type: ActionTypes.MAPS.SET.REMOVE_MAP,
		setKey,
		mapKey,
	};
};

const actionSetActiveMapKey = mapKey => {
	return {
		type: ActionTypes.MAPS.SET_ACTIVE_MAP_KEY,
		mapKey,
	};
};

const actionSetMapLayerOpacity = (mapKey, layerKey, opacity) => {
	return {
		type: ActionTypes.MAPS.MAP.LAYERS.SET_OPACITY,
		mapKey,
		layerKey,
		opacity,
	};
};

const actionSetMapLayerOption = (mapKey, layerKey, optionKey, optionValue) => {
	return {
		type: ActionTypes.MAPS.MAP.LAYERS.SET_OPTION,
		mapKey,
		layerKey,
		optionKey,
		optionValue,
	};
};

const actionSetMapLayerStyleKey = (mapKey, layerKey, styleKey) => {
	return {
		type: ActionTypes.MAPS.MAP.LAYERS.SET_STYLE_KEY,
		mapKey,
		layerKey,
		styleKey,
	};
};

const actionSetMapSetActiveMapKey = (setKey, mapKey) => {
	return {
		type: ActionTypes.MAPS.SET.SET_ACTIVE_MAP_KEY,
		mapKey,
		setKey,
	};
};

const actionSetMapSetBackgroundLayer = (setKey, backgroundLayer) => {
	return {
		type: ActionTypes.MAPS.SET.SET_BACKGROUND_LAYER,
		setKey,
		backgroundLayer,
	};
};

const actionSetMapBackgroundLayer = (mapKey, backgroundLayer) => {
	return {
		type: ActionTypes.MAPS.MAP.SET_BACKGROUND_LAYER,
		mapKey,
		backgroundLayer,
	};
};

const actionSetMapActive3D = (mapKey, active3D) => {
	return {
		type: ActionTypes.MAPS.MAP.SET_ACTIVE3D,
		mapKey,
		active3D,
	};
};

const actionSetMapSetActive3D = (mapSetKey, active3D) => {
	return {
		type: ActionTypes.MAPS.SET.SET_ACTIVE3D,
		mapSetKey,
		active3D,
	};
};

const actionSetMapSetLayers = (setKey, layers) => {
	return {
		type: ActionTypes.MAPS.SET.LAYERS.SET,
		setKey,
		layers,
	};
};

const actionSetMapSetSync = (mapSetKey, sync) => {
	return {
		type: ActionTypes.MAPS.SET.SET_SYNC,
		mapSetKey,
		sync,
	};
};

const actionSetMapViewport = (mapKey, width, height) => {
	return {
		type: ActionTypes.MAPS.MAP.VIEWPORT.SET,
		mapKey,
		width,
		height,
	};
};

const actionUpdate = data => {
	return {
		type: ActionTypes.MAPS.UPDATE,
		data,
	};
};

const actionUpdateMapView = (mapKey, update) => {
	return {
		type: ActionTypes.MAPS.MAP.VIEW.UPDATE,
		mapKey,
		update,
	};
};

const actionUpdateSetView = (setKey, update) => {
	return {
		type: ActionTypes.MAPS.SET.VIEW.UPDATE,
		setKey,
		update,
	};
};

const actionMapSetUseClear = mapSetKey => {
	return {
		type: ActionTypes.MAPS.SET.USE.CLEAR,
		mapSetKey,
	};
};

const actionMapSetUseRegister = mapSetKey => {
	return {
		type: ActionTypes.MAPS.SET.USE.REGISTER,
		mapSetKey,
	};
};

const actionMapUseClear = mapKey => {
	return {
		type: ActionTypes.MAPS.MAP.USE.CLEAR,
		mapKey,
	};
};

const actionMapUseRegister = mapKey => {
	return {
		type: ActionTypes.MAPS.MAP.USE.REGISTER,
		mapKey,
	};
};

const actionSetMapMetadataModifiers = (mapKey, metadataModifiers) => {
	return {
		type: ActionTypes.MAPS.MAP.METADATA_MODIFIERS.SET,
		mapKey,
		metadataModifiers,
	};
};

// ============ export ===========
export default {
	addMap,
	addMapLayers,
	addMapLayerToIndex,
	addMapSet,
	addMapToSet,
	ensureWithFilterByActive,
	layerUse,
	mapSetUseClear,
	mapSetUseRegister,
	mapUseClear,
	mapUseRegister,
	refreshMapSetUse,
	removeMap,
	removeMapFromSet,
	removeMapLayer,
	removeMapLayersByLayerTemplateKey,
	removeMapLayers,
	removeMapLayersByFilter,
	removeAllMapLayers: actionRemoveAllMapLayers,
	removeMapSet,
	setActiveMapKey: actionSetActiveMapKey,
	setLayerSelectedFeatureKeys,
	setMapLayerOpacity,
	setMapLayerOption,
	setMapLayerStyleKey,
	setMapSetActiveMapKey,
	setMapBackgroundLayer,
	setMapSetBackgroundLayer,
	setMapActive3D,
	setMapSetActive3D,
	setMapSetLayers,
	setMapSetSync,
	setMapViewport,
	setMapMetadataModifiers,
	updateMapAndSetView,
	updateSetView,
	updateStateFromView,
	use,
};
