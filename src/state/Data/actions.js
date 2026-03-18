import {
	isEmpty as _isEmpty,
	reduce as _reduce,
	flattenDeep as _flattenDeep,
	difference as _difference,
	intersection as _intersection,
} from 'lodash';
import {setState} from '@jvitela/recompute';
import {configDefaults} from '@gisatcz/ptr-core';
import attributeRelations from './AttributeRelations/actions';
import attributeDataSources from './AttributeDataSources/actions';
import attributeData from './AttributeData/actions';
import components from './Components/actions';
import spatialRelations from './SpatialRelations/actions';
import spatialDataSources from './SpatialDataSources/actions';
import spatialData from './SpatialData/actions';
import areaRelations from '../AreaRelations/actions';
import request from '../_common/request';
import commonActions from '../_common/actions';
import helpers from './SpatialData/helpers';
import {utils as tileGridUtils} from '@gisatcz/ptr-tile-grid';
import Select from '../Select';
import {getMissingTiles, getPageSize} from './helpers';
import {TILED_VECTOR_LAYER_TYPES} from './constants';

const DEFAULT_RELATIONS_PAGE = {
	offset: 0,
	limit: configDefaults.requestPageSize,
};

/**
 * Calculates how many page of relations is missing.
 * It assume that one page of size PAGE_SIZE was loaded.
 * @param {Number} attributeRelationsCount Wanted attributeRelations items
 * @param {Number} spatialRelationsCount Wanted spatialRelations items
 * @param {Number} areaRelationsCount Wanted areaRelations items
 * @param {Number} PAGE_SIZE How many items fit to one page
 * @returns Number How many pages remaining
 */
const getRestRelationsPages = (
	attributeRelationsCount,
	spatialRelationsCount,
	areaRelationsCount,
	PAGE_SIZE
) => {
	// What is higer to load? attributeRelations or spatialRelations
	const maxCountValue = Math.max(
		attributeRelationsCount,
		spatialRelationsCount,
		areaRelationsCount
	);
	if (maxCountValue === 0) {
		return 0;
	} else {
		const remainingPageCount = Math.ceil(
			(maxCountValue - PAGE_SIZE) / PAGE_SIZE
		);
		return remainingPageCount;
	}
};

// Check if all of spatialDataSources are tiled type.
const checkAllDSAreTiled = spatialDataSources => {
	const dsTiled = !_isEmpty(spatialDataSources)
		? spatialDataSources.every(ds =>
				TILED_VECTOR_LAYER_TYPES.includes(ds.data?.type)
		  )
		: false;
	return dsTiled;
};

const checkSomeDSAreVector = spatialDataSources => {
	const SDSvectorType = 'vector';
	const someDSisVectorType = !_isEmpty(spatialDataSources)
		? spatialDataSources.some(ds => ds.data?.type === SDSvectorType)
		: false;
	return someDSisVectorType;
};

const checkDSAreVector = spatialDataSources => {
	const SDSvectorType = 'vector';
	const everyDSisVectorType = !_isEmpty(spatialDataSources)
		? spatialDataSources.every(ds => ds.data?.type === SDSvectorType)
		: false;
	return everyDSisVectorType;
};

const transformSDStoTypes = spatialDataSources => {
	return !_isEmpty(spatialDataSources)
		? spatialDataSources.map(sds => ({
				data: {type: sds.data.type, key: sds.key},
		  }))
		: [];
};

/**
 * Helper function. Usually second step in requesting data.
 * Calculate if relations requests are missing based on attributeRelationsCount and spatialRelationsCount.
 * Each relations request loads one next tile from spatialFilter.
 * Rest tiles are loaded without relatiions.
 * @param {bool} loadGeometry Whether response should contain geometry
 * @param {Object} spatialFilter Spatial defined filter of level and its tiles
 * @param {string?} styleKey UUID
 * @param {Array?} order
 * @param {Object} spatialRelationsFilter Filler object contains modifiers and layerTemplateKey or areaTreeLevelKey.
 * @param {Object} attributeRelationsFilter Filler object contains modifiers, layerTemplateKey or areaTreeLevelKey and styleKey.
 * @param {Number} attributeRelationsCount Count of known attribute relations. Used for determinate further requests.
 * @param {Number} spatialRelationsCount Count of known spatial relations. Used for determinate further requests.
 * @param {Number} areaRelationsCount Count of known area relations. Used for determinate further requests.
 * @param {Array} preloadedSpatialDataSourcesTypes SpatialDataSources loaded by previous request.
 * @param {Object} attributeDataFilter Filler object contains modifiers, layerTemplateKey or areaTreeLevelKey, styleKey, and optional values for attributeFilter, dataSourceKeys and featureKeys.
 * @return {function} Return promise.
 */
function loadMissingRelationsAndData(
	loadGeometry,
	spatialFilter,
	styleKey,
	order,
	spatialRelationsFilter,
	attributeRelationsFilter,
	attributeRelationsCount,
	spatialRelationsCount,
	areaRelationsCount,
	preloadedSpatialDataSourcesTypes = [],
	attributeDataFilter
) {
	return (dispatch, getState) => {
		const localConfig = Select.app.getCompleteLocalConfiguration(getState());
		const PAGE_SIZE = getPageSize(localConfig);

		const promises = [];

		// load remaining relations pages
		// ignoring first page
		const remainingRelationsPageCount = getRestRelationsPages(
			attributeRelationsCount,
			spatialRelationsCount,
			areaRelationsCount,
			PAGE_SIZE
		);
		let tilesPagination = 0;
		for (let i = 1; i <= remainingRelationsPageCount; i++) {
			//load only needed relations
			const loadAttributeRelations = attributeRelationsCount - i > 0;
			const loadSpatialRelations = spatialRelationsCount - i > 0;
			const loadAreaRelations = areaRelationsCount - i > 0;
			const relations = {
				offset: i * PAGE_SIZE,
				limit: PAGE_SIZE,
			};

			tilesPagination = i;
			const spatialIndex = {
				tiles: [spatialFilter.tiles[tilesPagination]],
			};
			promises.push(
				dispatch(
					loadIndexedPage(
						styleKey,
						relations,
						spatialIndex,
						spatialFilter,
						loadGeometry,
						loadAttributeRelations,
						loadSpatialRelations,
						loadAreaRelations,
						order,
						spatialRelationsFilter,
						attributeRelationsFilter,
						attributeDataFilter
					)
				)
			);
		}

		//
		//load rest of tiles
		//
		const remainingTilesPageCount = spatialFilter?.tiles?.length || 0;

		//first tile was loaded before loadMissingRelationsAndData first request
		for (let i = tilesPagination + 1; i < remainingTilesPageCount; i++) {
			const spatialIndex = {
				tiles: [spatialFilter.tiles[i]],
			};

			const relations = {};
			const loadRestTilesRelations = false;
			promises.push(
				dispatch(
					loadIndexedPage(
						styleKey,
						relations,
						spatialIndex,
						spatialFilter,
						loadGeometry,
						loadRestTilesRelations,
						loadRestTilesRelations,
						loadRestTilesRelations,
						order,
						spatialRelationsFilter,
						attributeRelationsFilter,
						attributeDataFilter
					)
				)
			);
		}
		if (promises.length > 0) {
			return Promise.all(promises).then((response = []) => {
				// All relations are loaded at this moment.
				// Check if all spatialDataSources relations from response and preloadedSpatialDataSourcesTypes are type of "unsupported" like raster/wms/wmts.
				// If all spatialDataSources are unsupported, then received data are empty and indexes needs to be removed.
				// If only some of spatialDataSources relations are unsupported, then loading status on index will be replaced by data.
				const spatialDataSourcesTypes = _flattenDeep(
					response.map(r =>
						transformSDStoTypes(
							r?.spatialAttributeRelationsDataSources?.spatialDataSources
						)
					)
				);
				const spatialDataSourcesPairs = [
					...spatialDataSourcesTypes,
					...preloadedSpatialDataSourcesTypes,
				];

				//test spatialDataSources only if some come from BE
				const allDataSourcesTiled = checkAllDSAreTiled(spatialDataSourcesPairs);

				// Indexes for unsupported layers can be cleared.
				// TODO -> what if only some DS should be cleared?
				if (!_isEmpty(spatialDataSourcesPairs) && !allDataSourcesTiled) {
					const clearIndexes = !checkSomeDSAreVector(spatialDataSourcesPairs);
					if (clearIndexes) {
						// Clear indexes for unsupported layer types like WMS, WMTS
						// Do not clear indexes for type vector
						// AttributeData and spatialData index represented by spatialRelationsFilter, attributeRelationsFilter and order can be deleted
						dispatch(spatialData.removeIndex(spatialRelationsFilter, order));
						dispatch(
							attributeData.removeSpatialIndex(attributeDataFilter, order)
						);
					}
				}
			});
		} else {
			return Promise.resolve();
		}
	};
}

/**
 * Ensure load missing attribute data and relations for tiles defined in spatialFilter that are not loaded or loading in state.
 *
 * @param {Object} spatialFilter Spatial defined filter of level and its tiles
 * @param {string?} styleKey UUID
 * @param {Array?} order
 * @param {Object} spatialRelationsFilter Filler object contains modifiers and layerTemplateKey or areaTreeLevelKey.
 * @param {Object} attributeRelationsFilter Filler object contains modifiers, layerTemplateKey or areaTreeLevelKey and styleKey.
 * @param {Object} attributeDataFilter Filler object contains modifiers, layerTemplateKey or areaTreeLevelKey, styleKey, and optional values for attributeFilter, dataSourceKeys and featureKeys.
 * @return {function}
 */
function loadMissingAttributeData(
	spatialFilter,
	styleKey,
	order,
	spatialRelationsFilter,
	attributeRelationsFilter,
	attributeDataFilter
) {
	return (dispatch, getState) => {
		const state = getState();
		const localConfig = Select.app.getCompleteLocalConfiguration(state);
		const PAGE_SIZE = getPageSize(localConfig);

		const relations = {
			// start: 0,
			// length: 1000,
			offset: 0,
			limit: PAGE_SIZE,
		};

		//
		// which attribute data to load
		//

		//get attribute data index with loaded and loading data
		const attributeDataIndex =
			Select.data.attributeData.getIndex(
				state,
				'spatialIndexes',
				attributeDataFilter,
				order
			) || [];

		//diff loaded attribute data from index with wanted spatial data
		const missingAttributeDataTiles =
			getMissingTiles(attributeDataIndex, spatialFilter) || [];

		// Load relations and data sources in first request if they are not already loaded.
		const attributeRelations = Select.data.attributeRelations.getIndex(
			state,
			attributeRelationsFilter,
			order
		);
		const attributeDataSources = Select.data.attributeDataSources.getIndex(
			state,
			attributeRelationsFilter,
			order
		);
		let loadAttributeRelationsAndDS = !(
			!_isEmpty(attributeRelations) && !_isEmpty(attributeDataSources)
		);

		//load only attribute data
		const loadGeometry = false;

		// Modified spatial filter with only missing attribute data tiles
		const spatialFilterWithMissingTiles = {
			...spatialFilter,
			tiles: missingAttributeDataTiles,
		};
		// Relations for given filters are missing
		if (loadAttributeRelationsAndDS) {
			// Only if spatialIndex is null then is set whole spatialFilter.tiles as loading true in one step
			const spatialIndex = null;
			const loadAttributeRelations = true;

			// If asked spatialDataSource is type vector, so we get all attributes in first response,
			// then its unnecessary to ask on tiles. Its reason why we ask on SpatialRelations (it includes SpatialDataSources).
			const loadSpatialRelations = true;

			const loadAreaRelations = false;
			// Load relations
			return dispatch(
				loadIndexedPage(
					styleKey,
					relations,
					spatialIndex,
					spatialFilterWithMissingTiles,
					loadGeometry,
					loadAttributeRelations,
					loadSpatialRelations,
					loadAreaRelations,
					order,
					spatialRelationsFilter,
					attributeRelationsFilter,
					attributeDataFilter
				)
			).then(response => {
				if (response instanceof Error) {
					return;
				}

				const spatialDataSources =
					response?.spatialAttributeRelationsDataSources?.spatialDataSources ||
					[];
				const preloadedSpatialDataSourcesTypes =
					transformSDStoTypes(spatialDataSources);

				const attributeRelationsCount =
					response.spatialAttributeRelationsDataSources.total
						.attributeRelations;
				const spatialRelationsCount =
					response.spatialAttributeRelationsDataSources.total.spatialRelations;
				const areaRelationsCount = loadAreaRelations
					? response.spatialAttributeRelationsDataSources.total.areaRelations
					: 0;

				const allDataSourcesTiled = checkAllDSAreTiled(spatialDataSources);

				// If all spatialDatasources are not type of tiledVector, then we dont need to ask for more tiles
				if (!allDataSourcesTiled) {
					return Promise.resolve();
				} else {
					return dispatch(
						loadMissingRelationsAndData(
							loadGeometry,
							spatialFilterWithMissingTiles,
							styleKey,
							order,
							spatialRelationsFilter,
							attributeRelationsFilter,
							attributeRelationsCount,
							spatialRelationsCount,
							areaRelationsCount,
							preloadedSpatialDataSourcesTypes,
							attributeDataFilter
						)
					);
				}
			});
		} else {
			const promises = [];
			const loadAttributeRelations = false;
			const loadSpatialRelations = false;
			const loadAreaRelations = false;

			for (const tile of missingAttributeDataTiles) {
				const spatialIndex = {
					tiles: [tile],
				};

				promises.push(
					dispatch(
						loadIndexedPage(
							styleKey,
							relations,
							spatialIndex,
							spatialFilter,
							loadGeometry,
							loadAttributeRelations,
							loadSpatialRelations,
							loadAreaRelations,
							order,
							spatialRelationsFilter,
							attributeRelationsFilter,
							attributeDataFilter
						)
					)
				);
			}
			return Promise.all(promises);
		}
	};
}

/**
 * Ensure load missing spatial data for tiles defined in spatialFilter that are not loaded or loading in state.
 * @param {Object} spatialFilter Spatial defined filter of level and its tiles
 * @param {string?} styleKey UUID
 * @param {Array?} order
 * @param {Object} spatialRelationsFilter Filler object contains modifiers and layerTemplateKey or areaTreeLevelKey.
 * @param {Object} attributeRelationsFilter Filler object contains modifiers, layerTemplateKey or areaTreeLevelKey and styleKey.
 * @param {Object} attributeDataFilter Filler object contains modifiers, layerTemplateKey or areaTreeLevelKey, styleKey, and optional values for attributeFilter, dataSourceKeys and featureKeys.
 * @return {function}
 */
function loadMissingSpatialData(
	spatialFilter,
	styleKey,
	order,
	spatialRelationsFilter,
	attributeRelationsFilter,
	attributeDataFilter
) {
	return (dispatch, getState) => {
		//
		//which spatial data to load
		//

		//get spatial data index with loaded and loading data
		const spatialDataIndex =
			Select.data.spatialData.getIndex(
				getState(),
				spatialRelationsFilter,
				order
			) || [];

		//diff spatial data loaded/loading and to load
		const missingSpatialDataTiles =
			getMissingTiles(spatialDataIndex, spatialFilter) || [];
		const loadGeometry = true;

		dispatch(
			setLoading(
				attributeDataFilter,
				{
					tiles: missingSpatialDataTiles,
				},
				spatialFilter,
				spatialRelationsFilter,
				order,
				loadGeometry
			)
		);
		const promises = [];
		for (const tile of missingSpatialDataTiles) {
			const spatialIndex = {
				tiles: [tile],
			};

			const relations = {};
			const loadRelations = false;
			promises.push(
				dispatch(
					loadIndexedPage(
						styleKey,
						relations,
						spatialIndex,
						spatialFilter,
						loadGeometry,
						loadRelations,
						loadRelations,
						loadRelations,
						order,
						spatialRelationsFilter,
						attributeRelationsFilter,
						attributeDataFilter
					)
				)
			);
		}
		return Promise.all(promises);
	};
}

/**
 * Ensure load spatial data, attribute data and relations for tiles defined in spatialFilter.
 * Makes load first page of data, if more data missing, pass filters to loadMissingRelationsAndData.
 * @param {Object} spatialFilter Spatial defined filter of level and its tiles
 * @param {string?} styleKey UUID
 * @param {Array?} order
 * @param {Object} spatialRelationsFilter Filler object contains modifiers and layerTemplateKey or areaTreeLevelKey.
 * @param {Object} attributeRelationsFilter Filler object contains modifiers, layerTemplateKey or areaTreeLevelKey and styleKey.
 * @param {Object} attributeDataFilter Filler object contains modifiers, layerTemplateKey or areaTreeLevelKey, styleKey, and optional values for attributeFilter, dataSourceKeys and featureKeys.
 * @return {function}
 */
function ensureDataAndRelations(
	spatialFilter,
	styleKey,
	order,
	spatialRelationsFilter,
	attributeRelationsFilter,
	attributeDataFilter
) {
	return (dispatch, getState) => {
		const localConfig = Select.app.getCompleteLocalConfiguration(getState());
		const PAGE_SIZE = getPageSize(localConfig);

		const relations = {
			// start: 0,
			// length: 1000,
			offset: 0,
			limit: PAGE_SIZE,
		};

		const loadGeometry = true;
		const loadAttributeRelations = true;
		const loadSpatialRelations = true;
		const loadAreaRelations =
			// spatialRelationsFilter.hasOwnProperty('areaTreeLevelKey');
			Object.hasOwn(spatialRelationsFilter, 'areaTreeLevelKey');
		if (spatialFilter && !_isEmpty(spatialFilter)) {
			// Only if spatialIndex is null then is set whole spatialFilter.tiles as loading true in one step
			const spatialIndex = null;
			return dispatch(
				loadIndexedPage(
					styleKey,
					relations,
					spatialIndex,
					spatialFilter,
					loadGeometry,
					loadAttributeRelations,
					loadSpatialRelations,
					loadAreaRelations,
					order,
					spatialRelationsFilter,
					attributeRelationsFilter,
					attributeDataFilter
				)
			)
				.then(response => {
					if (response instanceof Error) {
						return;
					}

					const attributeRelationsCount =
						response.spatialAttributeRelationsDataSources.total
							.attributeRelations;
					const spatialRelationsCount =
						response.spatialAttributeRelationsDataSources.total
							.spatialRelations;
					const areaRelationsCount = loadAreaRelations
						? response.spatialAttributeRelationsDataSources.total.areaRelations
						: 0;

					const restRelationsPages = getRestRelationsPages(
						attributeRelationsCount,
						spatialRelationsCount,
						areaRelationsCount,
						PAGE_SIZE
					);

					const spatialDataSources =
						response?.spatialAttributeRelationsDataSources
							?.spatialDataSources || [];

					const allDataSourcesTiled =
						loadSpatialRelations || loadAreaRelations
							? checkAllDSAreTiled(spatialDataSources)
							: false;

					if (restRelationsPages === 0 && !allDataSourcesTiled) {
						// Stop getting next tiles if all DS is not tiled
						const clearIndexes = !checkSomeDSAreVector(spatialDataSources);
						if (clearIndexes) {
							// Clear indexes for unsupported layer types like WMS, WMTS
							// Do not clear indexes for type vector
							// AttributeData and spatialData index represented by spatialRelationsFilter, attributeRelationsFilter and order can be deleted
							dispatch(spatialData.removeIndex(spatialRelationsFilter, order));
							dispatch(
								attributeData.removeSpatialIndex(attributeDataFilter, order)
							);
						}
					} else {
						const preloadedSpatialDataSourcesTypes =
							transformSDStoTypes(spatialDataSources);

						return dispatch(
							loadMissingRelationsAndData(
								loadGeometry,
								spatialFilter,
								styleKey,
								order,
								spatialRelationsFilter,
								attributeRelationsFilter,
								attributeRelationsCount,
								spatialRelationsCount,
								areaRelationsCount,
								preloadedSpatialDataSourcesTypes,
								attributeDataFilter
							)
						);
					}
				})
				.catch(err => {
					if (err?.message === 'Index outdated') {
						// dispatch(
						// 	refreshIndex(
						// 		getSubstate,
						// 		dataType,
						// 		filter,
						// 		order,
						// 		actionTypes,
						// 		categoryPath
						// 	)
						// );
					} else {
						throw new Error(`data/actions#ensure: ${err}`);
					}
				});
		} else {
			return dispatch(
				commonActions.actionGeneralError(new Error('Missing spatial filter'))
			);
		}
	};
}

/**
 * Find out all tiles from spatialFilter without loaded attribute data
 * @param {Object} attributeDataIndex
 * @param {Object} spatialFilter Spatial defined filter of level and its tiles
 */
const hasMissingAttributesData = (attributeDataIndex, spatialFilter) => {
	const missingAttributeDataTiles =
		getMissingTiles(attributeDataIndex, spatialFilter) || spatialFilter.tiles;
	return missingAttributeDataTiles &&
		missingAttributeDataTiles.length &&
		missingAttributeDataTiles.length > 0
		? true
		: false;
};

/**
 * Find out all tiles from spatialFilter without loaded attribute data
 * @param {Object} spatialDataIndex
 * @param {Object} spatialFilter Spatial defined filter of level and its tiles
 */
const hasMissingSpatialData = (spatialDataIndex, spatialFilter) => {
	const missingSpatialDataTiles =
		getMissingTiles(spatialDataIndex, spatialFilter) || spatialFilter.tiles;
	return missingSpatialDataTiles &&
		missingSpatialDataTiles.length &&
		missingSpatialDataTiles.length > 0
		? true
		: false;
};

/**
 * It find out if for given spatialRelationsFilter exists relations index.
 * The Existence of index means it is loading or loaded or we can just find out missing data.
 * TODO - add support of areaTrees
 * TODO - add support of dataSourcesKeys
 * @param {Object} state App state object
 * @param {Object} spatialRelationsFilter Filler object contains modifiers and layerTemplateKey or areaTreeLevelKey.
 * @param {Array} order
 * @return {bool}
 */
const hasSpatialOrAreaRelations = (state, spatialRelationsFilter, order) => {
	let spatialRelationsIndex = null;
	let areaRelationsIndex = null;

	if (spatialRelationsFilter.layerTemplateKey) {
		spatialRelationsIndex = Select.data.spatialRelations.getIndex(
			state,
			spatialRelationsFilter,
			order
		);
	}

	if (spatialRelationsFilter.areaTreeLevelKey) {
		areaRelationsIndex = Select.areaRelations.getIndex(
			state,
			spatialRelationsFilter,
			order
		);
	}

	return spatialRelationsIndex !== null || areaRelationsIndex !== null;
};

/**
 * Entry function for requesting of loading new data. In first step are identified loaded indexes based on filters.
 * Next phase is request only data that are missing.
 * @param styleKey {string}
 * @param commonRelationsFilter {Object} Filter object with modifiers, layerTemplateKey or areaTreeLevelKey. It defines spatialRealations and after add styleKey is used as a attributeRelations filter.
 * @param {Object} spatialFilter Spatial defined filter of level and its tiles
 * @param attributeDataFilterExtension {Object} Filter object with optional values for attributeFilter, dataSourceKeys and featureKeys. After merge with attributeRelationsFilter it defines filter for attributeData
 * @return {function}
 */
function ensure(
	styleKey,
	commonRelationsFilter,
	spatialFilter,
	attributeDataFilterExtension
) {
	return (dispatch, getState) => {
		const state = getState();
		// Filter params - see Panther docs: Code/API/Data endpoint
		const spatialRelationsFilter = commonRelationsFilter;
		const attributeRelationsFilter = {...commonRelationsFilter, styleKey};
		const attributeDataFilter = {
			...attributeRelationsFilter,
			...attributeDataFilterExtension,
		};

		// ensure string datatype for tiles in filter
		spatialFilter.tiles = spatialFilter.tiles.map(
			tileGridUtils.tileAsStringArray
		);

		// Order for spatialData if null at the moment
		const order = null;

		const spatialDataIndex =
			Select.data.spatialData.getIndex(state, spatialRelationsFilter, order) ||
			{};
		//FIXME Select.data.attributeData.getIndex returns object where indec contains some methods
		const attributeDataIndex =
			Select.data.attributeData.getIndex(
				state,
				'spatialIndexes',
				attributeDataFilter,
				order
			) || {};

		const missingAttributesData = hasMissingAttributesData(
			attributeDataIndex,
			spatialFilter
		);

		const spatialDataSources = Select.data.spatialDataSources.getIndexed(
			state,
			spatialRelationsFilter,
			order
		);

		const allDSofTypeVector = spatialDataSources
			? checkDSAreVector(spatialDataSources)
			: false;

		const missingSpatialData = hasMissingSpatialData(
			spatialDataIndex,
			spatialFilter
		);

		const filterHasSpatialOrAreaRelations = hasSpatialOrAreaRelations(
			state,
			spatialRelationsFilter,
			order
		);

		const loadRelationsAndData =
			!filterHasSpatialOrAreaRelations && missingSpatialData;

		let modifiedSpatialFilterForAttributes = {...spatialFilter};
		let modifiedSpatialFilterForSpatial = {...spatialFilter};

		// If spatial relations are loaded and spatial and attribute date are missing,
		// find which only attribute tile are missing and which attribute tiles load with spatial data.
		if (!loadRelationsAndData && missingAttributesData) {
			const missingAttributeDataTiles =
				getMissingTiles(attributeDataIndex, spatialFilter) || [];
			const missingSpatialDataTiles =
				getMissingTiles(spatialDataIndex, spatialFilter) || [];

			const missingAttributeDataTilesToLoad = _difference(
				missingAttributeDataTiles,
				missingSpatialDataTiles
			);
			const missingSpatialAndAttributeDataTiles = _intersection(
				missingAttributeDataTiles,
				missingSpatialDataTiles
			);

			modifiedSpatialFilterForAttributes.tiles =
				missingAttributeDataTilesToLoad;

			modifiedSpatialFilterForSpatial.tiles =
				missingSpatialAndAttributeDataTiles;
		}

		const promises = [];

		if (allDSofTypeVector) {
			// if we know that all DS are type vector, it means that we have all relations
			// only these cases can occure
			// 		- we are missing spatial data
			// 		- we are missing attribute data
			// 		- we are missing spatial and attribute data
			const missingAttributesData = _isEmpty(attributeDataIndex);

			//use only firts tile from spatial filter
			let modifiedSpatialFilterForAttributes = {
				...spatialFilter,
				tiles: [spatialFilter.tiles[0]],
			};
			if (missingAttributesData) {
				promises.push(
					dispatch(
						loadMissingAttributeData(
							modifiedSpatialFilterForAttributes,
							styleKey,
							order,
							spatialRelationsFilter,
							attributeRelationsFilter,
							attributeDataFilter
						)
					)
				);
			}

			//FIXME add next methods by use case
		} else {
			if (loadRelationsAndData) {
				promises.push(
					dispatch(
						ensureDataAndRelations(
							spatialFilter,
							styleKey,
							order,
							spatialRelationsFilter,
							attributeRelationsFilter,
							attributeDataFilter
						)
					)
				);
			}

			if (
				filterHasSpatialOrAreaRelations &&
				missingSpatialData &&
				!_isEmpty(modifiedSpatialFilterForSpatial.tiles)
			) {
				promises.push(
					dispatch(
						loadMissingSpatialData(
							modifiedSpatialFilterForSpatial,
							styleKey,
							order,
							spatialRelationsFilter,
							attributeRelationsFilter,
							attributeDataFilter
						)
					)
				);
			}

			if (
				missingAttributesData &&
				!loadRelationsAndData &&
				!_isEmpty(modifiedSpatialFilterForAttributes.tiles)
			) {
				promises.push(
					dispatch(
						loadMissingAttributeData(
							modifiedSpatialFilterForAttributes,
							styleKey,
							order,
							spatialRelationsFilter,
							attributeRelationsFilter,
							attributeDataFilter
						)
					)
				);
			}
		}

		return Promise.all(promises);
	};
}

/**
 * Save result data to related stores.
 * If data are presented, then save them to attributeRelations, attributeDataSources, attributeData, spatialRelations, spatialDataSources, spatialData.
 * @param {Object} result result data from backend data endpoind
 * @param {bool} loadGeometry Whether response should contain geometry
 * @param {bool} loadAttributeRelations Whether response should contain relations
 * @param {bool} loadSpatialRelations Whether response should contain relations
 * @param {Array?} order
 * @param {Object} spatialRelationsFilter Filler object contains modifiers and layerTemplateKey or areaTreeLevelKey.
 * @param {Object} attributeRelationsFilter Filler object contains modifiers, layerTemplateKey or areaTreeLevelKey and styleKey.
 * @param {Object} attributeDataFilter Filler object contains modifiers, layerTemplateKey or areaTreeLevelKey, styleKey, and optional values for attributeFilter, dataSourceKeys and featureKeys.
 * @param {Object} start
 */
function processResult(
	result,
	loadGeometry,
	loadAttributeRelations,
	loadSpatialRelations,
	loadAreaRelations,
	order,
	spatialRelationsFilter,
	attributeRelationsFilter,
	attributeDataFilter,
	start
) {
	return dispatch => {
		////
		// Attributes
		////
		if (
			!!loadAttributeRelations &&
			result.spatialAttributeRelationsDataSources.attributeRelations &&
			!_isEmpty(result.spatialAttributeRelationsDataSources.attributeRelations)
		) {
			const changes = null;
			dispatch(
				attributeRelations.receiveIndexed(
					result.spatialAttributeRelationsDataSources.attributeRelations,
					attributeRelationsFilter,
					order,
					start,
					result.spatialAttributeRelationsDataSources.total.attributeRelations,
					changes
				)
			);
		}

		if (
			!!loadAttributeRelations &&
			result.spatialAttributeRelationsDataSources.attributeDataSources &&
			!_isEmpty(
				result.spatialAttributeRelationsDataSources.attributeDataSources
			)
		) {
			const changes = null;
			dispatch(
				attributeDataSources.receiveIndexed(
					result.spatialAttributeRelationsDataSources.attributeDataSources,
					attributeRelationsFilter,
					order,
					start,
					result.spatialAttributeRelationsDataSources.total.attributeRelations,
					changes
				)
			);
		}

		if (result.spatialData && result.attributeData) {
			const changes = null;
			const spatialDataTiled = helpers.isSpatialDataTiled(result.spatialData);
			let spatialIndexData = null;
			if (spatialDataTiled) {
				spatialIndexData = attributeData.getTiledIndexDataBySpatialData(
					result.spatialData,
					result.attributeData
				);
			} else {
				spatialIndexData = attributeData.getIndexData(attributeData);
			}
			dispatch(
				attributeData.receiveIndexedWithSpatialIndex(
					result.attributeData,
					spatialIndexData,
					attributeDataFilter,
					order,
					changes
				)
			);
		}

		////
		// Spatial data
		////
		if (
			!!loadSpatialRelations &&
			result.spatialAttributeRelationsDataSources.spatialRelations &&
			!_isEmpty(result.spatialAttributeRelationsDataSources.spatialRelations)
		) {
			const changes = null;
			dispatch(
				spatialRelations.receiveIndexed(
					result.spatialAttributeRelationsDataSources.spatialRelations,
					spatialRelationsFilter,
					order,
					start,
					result.spatialAttributeRelationsDataSources.total.spatialRelations,
					changes
				)
			);
		}

		if (
			!!loadSpatialRelations &&
			result.spatialAttributeRelationsDataSources.spatialDataSources &&
			!_isEmpty(result.spatialAttributeRelationsDataSources.spatialDataSources)
		) {
			const changes = null;
			dispatch(
				spatialDataSources.receiveIndexed(
					result.spatialAttributeRelationsDataSources.spatialDataSources,
					spatialRelationsFilter,
					order,
					start,
					result.spatialAttributeRelationsDataSources.total.spatialRelations ||
						result.spatialAttributeRelationsDataSources.total.areaRelations,
					changes
				)
			);
		}

		if (loadGeometry) {
			// Add data even if data are empty.
			// Override loading indicator in state index
			const changes = null;
			dispatch(
				spatialData.receiveIndexed(
					result.spatialData,
					spatialRelationsFilter,
					order,
					changes
				)
			);
		}

		////
		// Areas
		////
		if (
			!!loadAreaRelations &&
			result.spatialAttributeRelationsDataSources.areaRelations &&
			!_isEmpty(result.spatialAttributeRelationsDataSources.areaRelations)
		) {
			const changes = null;
			dispatch(
				areaRelations.receiveIndexed(
					result.spatialAttributeRelationsDataSources.areaRelations,
					spatialRelationsFilter,
					order,
					start,
					result.spatialAttributeRelationsDataSources.total.areaRelations,
					changes
				)
			);
		}
	};
}

/**
 * Create request payload for data endpoint
 * @param {Object} spatialRelationsFilter Filler object contains modifiers and layerTemplateKey or areaTreeLevelKey.
 * @param {string?} styleKey
 * @param {Object?} relations Pagination for relations.
 * @param {Object} attributeDataFilter Filler object contains modifiers, layerTemplateKey or areaTreeLevelKey, styleKey, and optional values for attributeFilter, dataSourceKeys and featureKeys.
 * @param {Object?} spatialIndex Object where under "tiles" key is array of tiles that should be loaded. Tiles are subset of tiles defined inspatilaFilter.
 * @param {bool} loadGeometry Whether response should contain geometry
 * @param {bool} loadAttributeRelations Whether response should contain attribute relations
 * @param {bool} loadSpatialRelations Whether response should contain spatial relations
 * @param {bool} loadAreaRelations Whether response should contain area relations
 * @param {Object} spatialFilter Spatial defined filter of level and its tiles
 * @returns
 */
function composeDataEndpointPayload(
	spatialRelationsFilter,
	styleKey,
	relations,
	attributeDataFilter,
	spatialIndex,
	loadGeometry,
	loadAttributeRelations,
	loadSpatialRelations,
	loadAreaRelations,
	spatialFilter
) {
	const {areaTreeLevelKey, layerTemplateKey, modifiers} =
		spatialRelationsFilter || {};

	// Create payload
	const payload = {
		...(modifiers && {modifiers}),

		// which layer you want
		...(layerTemplateKey && {layerTemplateKey}),
		...(areaTreeLevelKey && {areaTreeLevelKey}),

		// get attributes from style
		...(styleKey && {styleKey}),

		// pagination for relations (& data sources)
		relations: {
			...relations,

			//should response contain attribute or spatial relations
			attribute: !!loadAttributeRelations,
			spatial: !!loadSpatialRelations,
			area: !!loadAreaRelations,
		},

		data: {
			// list of features you want
			...(attributeDataFilter?.featureKeys && {
				featureKeys: attributeDataFilter.featureKeys,
			}),

			// which tiles you want (pseudo-pagination)
			// spatialIndex: {
			//     tiles: [[lon, lat], ...],
			// },
			...(spatialIndex && {spatialIndex}),

			// extent
			spatialFilter,

			// filter features by attribute value
			// attributeFilter: {
			//     'attribute-uuid': "blue",
			//     'attribute-uuid': {
			//         in: [12, 13]
			//     },
			//     ...
			// },
			...(attributeDataFilter?.attributeFilter && {
				attributeFilter: attributeDataFilter.attributeFilter,
			}),

			//request for geometry
			geometry: !!loadGeometry,

			// use data source keys as filter or add them to filter
			...(attributeDataFilter?.dataSourceKeys && {
				dataSourceKeys: attributeDataFilter.dataSourceKeys,
			}),
		},
	};
	return payload;
}

/**
 * Set loading status to spatialData and attributeData stores to related indexes, level and tiles.
 * @param {Object} attributeDataFilter Filler object contains modifiers, layerTemplateKey or areaTreeLevelKey, styleKey, and optional values for attributeFilter, dataSourceKeys and featureKeys.
 * @param {Object?} spatialIndex Object where under "tiles" key is array of tiles that should be loaded. Tiles are subset of tiles defined inspatilaFilter.
 * @param {Object} spatialFilter Spatial defined filter of level and its tiles
 * @param {Object} spatialRelationsFilter Filler object contains modifiers and layerTemplateKey or areaTreeLevelKey.
 * @param {Array?} order
 * @param {bool} loadGeometry Whether response should contain geometry
 */
function setLoading(
	attributeDataFilter,
	spatialIndex,
	spatialFilter,
	spatialRelationsFilter,
	order,
	loadGeometry
) {
	return (dispatch, getState) => {
		setState(getState());
		const loadingTilesGeometry =
			spatialIndex?.tiles || spatialFilter?.tiles || [];

		//get loading tiles
		const spatialTilesInNotLoadingState = _reduce(
			loadingTilesGeometry,
			(acc = [], tile) => {
				const loading = Select.data.spatialData.isTileLoading(
					spatialRelationsFilter,
					spatialFilter.level,
					tileGridUtils.tileAsString(tile)
				);
				if (!loading) {
					return [...acc, tileGridUtils.tileAsStringArray(tile)];
				} else {
					return acc;
				}
			},
			[]
		);
		const attributesTilesInNotLoadingState = _reduce(
			loadingTilesGeometry,
			(acc = [], tile) => {
				const loading = Select.data.attributeData.isTileLoading(
					attributeDataFilter,
					spatialFilter.level,
					tileGridUtils.tileAsString(tile)
				);
				if (!loading) {
					return [...acc, tileGridUtils.tileAsStringArray(tile)];
				} else {
					return acc;
				}
			},
			[]
		);

		////
		// Spatial
		////
		if (loadGeometry && spatialTilesInNotLoadingState.length > 0) {
			dispatch(
				spatialData.addLoadingIndex(
					spatialRelationsFilter,
					order,
					spatialFilter.level,
					spatialTilesInNotLoadingState
				)
			);
		}

		////
		// Attribute
		////
		if (attributesTilesInNotLoadingState.length > 0) {
			dispatch(
				attributeData.addLoadingSpatialIndex(
					attributeDataFilter,
					order,
					spatialFilter.level,
					attributesTilesInNotLoadingState
				)
			);
		}
	};
}

/**
 * Central method for executing requests to data endpoint.
 * @param {string?} styleKey
 * @param {Object?} relations Pagination for relations.
 * @param {Object?} spatialIndex Object where under "tiles" key is array of tiles that should be loaded. Tiles are subset of tiles defined inspatilaFilter.
 * @param {Object} spatialFilter Spatial defined filter of level and its tiles
 * @param {bool} loadGeometry Whether response should contain geometry
 * @param {bool} loadAttributeRelations Whether response should contain relations
 * @param {bool} loadSpatialRelations Whether response should contain relations
 * @param {Array?} order
 * @param {Object} spatialRelationsFilter Filler object contains modifiers and layerTemplateKey or areaTreeLevelKey.
 * @param {Object} attributeRelationsFilter Filler object contains modifiers, layerTemplateKey or areaTreeLevelKey and styleKey.
 * @param {Object} attributeDataFilter Filler object contains modifiers, layerTemplateKey or areaTreeLevelKey, styleKey, and optional values for attributeFilter, dataSourceKeys and featureKeys.
 */
function loadIndexedPage(
	styleKey,
	relations,
	spatialIndex,
	spatialFilter,
	loadGeometry,
	loadAttributeRelations,
	loadSpatialRelations,
	loadAreaRelations,
	order,
	spatialRelationsFilter = {},
	attributeRelationsFilter,
	attributeDataFilter
) {
	return (dispatch, getState) => {
		const localConfig = Select.app.getCompleteLocalConfiguration(getState());
		const apiPath = 'rest/data/filtered';

		//Register loading to related indexes and tiles
		dispatch(
			setLoading(
				attributeDataFilter,
				spatialIndex,
				spatialFilter,
				spatialRelationsFilter,
				order,
				loadGeometry
			)
		);

		const usedRelations = relations ? {...relations} : DEFAULT_RELATIONS_PAGE;

		const payload = composeDataEndpointPayload(
			spatialRelationsFilter,
			styleKey,
			usedRelations,
			attributeDataFilter,
			spatialIndex,
			loadGeometry,
			loadAttributeRelations,
			loadSpatialRelations,
			loadAreaRelations,
			spatialFilter
		);

		const start = usedRelations.offset + 1;

		return request(localConfig, apiPath, 'POST', null, payload, undefined, null)
			.then(result => {
				if (result.errors) {
					const error = new Error('no data');
					dispatch(commonActions.actionGeneralError(error));
				} else {
					if (
						result.spatialAttributeRelationsDataSources &&
						result.spatialData &&
						result.attributeData
					) {
						dispatch(
							processResult(
								result,
								loadGeometry,
								loadAttributeRelations,
								loadSpatialRelations,
								loadAreaRelations,
								order,
								spatialRelationsFilter,
								attributeRelationsFilter,
								attributeDataFilter,
								start
							)
						);
						return result;
					} else {
						const error = new Error('no data');
						dispatch(commonActions.actionGeneralError(error));
						return error;
					}
				}
			})
			.catch(error => {
				dispatch(commonActions.actionGeneralError(error));
				return error; //todo do we need to return this
			});
	};
}

/**
 * Import geojson to state
 * Separate geometry and attribute data to their stores.
 */
function importGeojson(
	geoJson,
	featureIdColumnName,
	spatialDataSourceKey,
	commonRelationsFilter,
	sqlFeatureIdColumnName,
	attributeColumns
) {
	return dispatch => {
		//PROCCESS SPATIAL DATA
		const spatialDataByFeatureID = geoJson.features.reduce((acc, feature) => {
			return {
				...acc,
				...{[feature.properties[featureIdColumnName]]: feature.geometry},
			};
		}, {});

		const spatialDataBySDSKey = {
			[spatialDataSourceKey]: {data: spatialDataByFeatureID},
		};

		const order = null;
		const changedOn = '';
		dispatch(
			spatialData.receiveIndexed(
				spatialDataBySDSKey,
				commonRelationsFilter,
				order,
				changedOn
			)
		);

		//PROCCESS ATTRIBUTE DATA
		const attibuteDataByFeatureID = geoJson.features.reduce((acc, feature) => {
			return {
				...acc,
				...{[feature.properties[sqlFeatureIdColumnName]]: feature.properties},
			};
		}, {});

		const featureIDs = Object.keys(attibuteDataByFeatureID);

		const attibuteDataBySDSKey = {
			attributeData: {
				[spatialDataSourceKey]: attibuteDataByFeatureID,
			},
			index: [...featureIDs],
		};

		// const spatialDataBySDSKey = {
		// 	[spatialDataSourceKey]: {data},
		// };

		const start = 0;
		const total = featureIDs.length;
		const limit = total;
		dispatch(
			attributeData.receiveIndexed(
				attibuteDataBySDSKey,
				commonRelationsFilter,
				order,
				start,
				total,
				changedOn,
				limit
			)
		);
	};
}

/**
 * Load data
 * @param {string?} styleKey
 * @param {Object?} relations Pagination for relations.
 * @param {Object?} spatialIndex Object where under "tiles" key is array of tiles that should be loaded. Tiles are subset of tiles defined inspatilaFilter.
 * @param {Object} spatialFilter Spatial defined filter of level and its tiles
 * @param {bool} loadGeometry Whether response should contain geometry
 * @param {bool} loadAttributeRelations Whether response should contain relations
 * @param {bool} loadSpatialRelations Whether response should contain relations
 * @param {Array?} order
 * @param {Object} spatialRelationsFilter Filler object contains modifiers and layerTemplateKey or areaTreeLevelKey.
 * @param {Object} attributeRelationsFilter Filler object contains modifiers, layerTemplateKey or areaTreeLevelKey and styleKey.
 * @param {Object} attributeDataFilter Filler object contains modifiers, layerTemplateKey or areaTreeLevelKey, styleKey, and optional values for attributeFilter, dataSourceKeys and featureKeys.
 */
function newEnsureData(
	featureIdColumnName,
	attributeColumns = [],
	vectorKey,
	spatialDataSourceKey,
	commonRelationsFilter
) {
	return (dispatch, getState) => {
		const promises = [];
		const order = null;
		const spatialDataIndex =
			Select.data.spatialData.getIndex(
				getState(),
				commonRelationsFilter,
				order
			) || {};

		if (!spatialDataIndex?.index) {
			const localConfig = Select.app.getCompleteLocalConfiguration(getState());
			const apiPath = 'be-gisdata/vectors'; //???

			// TODO
			// set loading

			const payload = {
				vectorKey,
				includeGeometry: true,
				attributes: [
					...(featureIdColumnName ? [featureIdColumnName] : []),
					...attributeColumns,
				],
			};

			const getDataRequest = request(
				localConfig,
				apiPath,
				'POST',
				null,
				payload,
				undefined,
				null
			)
				.then(result => {
					if (result.errors) {
						const error = new Error('no data');
						dispatch(commonActions.actionGeneralError(error));
					} else {
						//IMPORT GEOJSON
						dispatch(
							importGeojson(
								result,
								featureIdColumnName,
								spatialDataSourceKey,
								commonRelationsFilter,
								attributeColumns
							)
						);
					}
				})
				.catch(error => {
					dispatch(commonActions.actionGeneralError(error));
					return error; //todo do we need to return this
				});

			promises.push(getDataRequest);
		}

		return Promise.all(promises);
	};
}

export default {
	//new
	newEnsureData,

	//export of sub actions
	attributeData,
	attributeDataSources,
	attributeRelations,
	components,
	spatialData,
	spatialDataSources,
	spatialRelations,

	//export functions
	composeDataEndpointPayload,
	ensure,
	ensureDataAndRelations,
	getRestRelationsPages,
	hasMissingAttributesData,
	hasMissingSpatialData,
	hasSpatialOrAreaRelations,
	loadIndexedPage,
	loadMissingAttributeData,
	loadMissingRelationsAndData,
	loadMissingSpatialData,
	processResult,
	setLoading,
};
