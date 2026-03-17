import createCachedSelector from 're-reselect';
import {createSelector} from 'reselect';
import _ from 'lodash';
import {map as mapUtils} from '@gisatcz/ptr-utils';
import {mapConstants} from '@gisatcz/ptr-core';
import {grid} from '@gisatcz/ptr-tile-grid';
import commonHelpers from '../_common/helpers';

/* === HELPERS ======================================================================= */

/**
 * Get background layer in 'layer' format
 */
const getBackgroundLayerAsLayer = createCachedSelector(
	[backgroundLayer => backgroundLayer],
	backgroundLayer => {
		if (backgroundLayer) {
			return {...backgroundLayer, key: 'pantherBackgroundLayer'};
		} else {
			return null;
		}
	}
)(backgroundLayer => JSON.stringify(backgroundLayer));

/**
 * Merge background layer definition with layers to one collection
 */
const mergeBackgroundLayerWithLayers = createCachedSelector(
	[
		backgroundLayer => getBackgroundLayerAsLayer(backgroundLayer),
		(backgroundLayer, layers) => layers,
	],
	(backgroundLayer, layers) => {
		let finalLayers = layers || [];

		if (backgroundLayer) {
			finalLayers = [backgroundLayer, ...finalLayers];
		}

		return finalLayers.length ? finalLayers : null;
	}
)(
	(backgroundLayer, layers) =>
		`${JSON.stringify(backgroundLayer)}_${JSON.stringify(layers)}`
);

/**
 * Merge given activeKeys with layer's modifiers with layer's filter by active and add it to the layer state
 *
 * @param layer {Object} layers state
 * @param activeKeys {Object} {activeScopeKey: 'bbb', activePlaceKeys: ['ddd', 'eee'], ...}
 * @return {Object} Final layer state definition
 */
const mergeModifiersAndFilterByActiveToLayerStructure = (layer, activeKeys) => {
	let layerMetadataModifiers = {
		...(layer.metadataModifiers ? layer.metadataModifiers : {}),
	};
	let layerFilterByActive = {
		...(layer.filterByActive ? layer.filterByActive : {}),
	};

	const mergedModifiers = commonHelpers.mergeFilters(
		activeKeys,
		{...layerFilterByActive},
		layerMetadataModifiers
	);

	return {
		...layer,
		metadataModifiers: mergedModifiers,
		filterByActive: null,
	};
};

/**
 * It returns merged view from map and associated map set based on synced params
 * @param map {Object}
 * @param set {Object}
 * @return {Object|unknown} final map view
 */
const getView = (map, set) => {
	if (map) {
		if (set) {
			let mapView = map.data?.view;

			// omit synced view params from map
			if (set.sync && !_.isEmpty(set.sync)) {
				mapView = _.omitBy(mapView, (viewValue, viewKey) => {
					return set.sync[viewKey];
				});
			}

			let mapSetView = set.data?.view;
			return mapUtils.view.mergeViews(
				mapConstants.defaultMapView,
				mapSetView,
				mapView
			);
		} else {
			let view = map.data?.view;
			return mapUtils.view.mergeViews(mapConstants.defaultMapView, view);
		}
	} else {
		return null;
	}
};

/**
 * It returns merged previous view from map and associated map set based on synced params
 * @param map {Object}
 * @param set {Object}
 * @return {Object|unknown} final map view
 */
const getPreviousView = (map, set) => {
	if (map) {
		if (set) {
			let mapPreviousView = map.data?.previousView;

			// omit synced view params from map
			if (set.sync && !_.isEmpty(set.sync)) {
				mapPreviousView = _.omitBy(mapPreviousView, (viewValue, viewKey) => {
					return set.sync[viewKey];
				});
			}

			let mapSetPreviousView = set.data?.previousView;
			return mapUtils.view.mergeViews(mapSetPreviousView, mapPreviousView);
		} else {
			return map.data?.previousView;
		}
	} else {
		return null;
	}
};

/**
 * It transform filter object to active keys object.
 * Filter object has keys named like metadata [caseKey, applicationKey, periodKey...],
 * transfroem function convert them to [activeCaseKey, activeApplicationKey, activePeriodKey...].
 * @param {Object} filter
 * @returns {Object}
 */
const transformFilterToActiveKeys = (filter = {}) => {
	if (filter) {
		return {
			...Object.fromEntries(
				Object.entries(filter).map(([key, val]) => {
					// example: caseKey -> activeCaseKey
					return [`active${key.charAt(0).toUpperCase()}${key.slice(1)}`, val];
				})
			),
		};
	} else {
		return {};
	}
};

/**
 * Return default style required by leaflet for rendering COGs
 */
const getDefaultCogStyle = createSelector([], () => {
	return {
		rules: [
			{
				styles: [
					{
						color: '#000000',
					},
					{
						bandIndex: 0,
						values: {
							0: {color: null},
						},
					},
				],
			},
		],
	};
});

/**
 * Get zoom level of current view represented by mapWidth, mapHeight and boxRange.
 */
const getZoomLevel = createCachedSelector(
	[
		mapWidth => mapWidth,
		(mapWidth, mapHeight) => mapHeight,
		(mapWidth, mapHeight, boxRange) => boxRange,
	],
	(mapWidth, mapHeight, boxRange) => {
		const viewportRange = mapUtils.view.getMapViewportRange(
			mapWidth,
			mapHeight
		);
		const levelBoxRange = mapUtils.view.getNearestZoomLevelBoxRange(
			mapWidth,
			mapHeight,
			boxRange
		);
		return grid.getLevelByViewport(levelBoxRange, viewportRange);
	}
)((mapWidth, mapHeight, boxRange) => `${mapWidth}${mapHeight}${boxRange}`);

/**
 * Get tiles intersected by map extent.
 * Map extent is represented by mapWidth, mapHeight, center and boxRange.
 */
const getTiles = createCachedSelector(
	[
		mapWidth => mapWidth,
		(mapWidth, mapHeight) => mapHeight,
		(mapWidth, mapHeight, center) => center,
		(mapWidth, mapHeight, center, boxRange) => boxRange,
	],
	(mapWidth, mapHeight, center, boxRange) => {
		if (mapWidth && mapHeight && center && boxRange) {
			const levelBoxRange = mapUtils.view.getNearestZoomLevelBoxRange(
				mapWidth,
				mapHeight,
				boxRange
			);
			const tileGrid = grid.getTileGrid(
				mapWidth,
				mapHeight,
				levelBoxRange,
				center,
				true
			);
			return tileGrid.flat(1);
		} else {
			return null;
		}
	}
)(
	(mapWidth, mapHeight, center, boxRange) =>
		`${mapWidth}${mapHeight}${center?.lon}${center?.lat}${boxRange}`
);

export default {
	getBackgroundLayerAsLayer,
	getTiles,
	getPreviousView,
	getView,
	getZoomLevel,
	mergeBackgroundLayerWithLayers,
	mergeModifiersAndFilterByActiveToLayerStructure,
	getDefaultCogStyle,
	transformFilterToActiveKeys,
};
