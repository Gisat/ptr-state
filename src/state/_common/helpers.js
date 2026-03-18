import createCachedSelector from 're-reselect';
import {
	find as _find,
	head as _head,
	isEqual as _isEqual,
	isEmpty as _isEmpty,
	isNumber as _isNumber,
	isObject as _isObject,
	reduce as _reduce,
	sortBy as _sortBy,
	tail as _tail,
} from 'lodash';

/**
 * Return index for given filter and order
 * @param indexes {Array} list of indexes
 * @param filter {Object}
 * @param order {Array}
 */
const getIndex = createCachedSelector(
	[
		indexes => indexes,
		(indexes, filter) => filter,
		(indexes, filter, order) => order,
	],
	(indexes, filter, order) => {
		if (indexes) {
			const index = _find(indexes, index =>
				isCorrespondingIndex(index, filter, order)
			);
			return index ? index : null;
		} else {
			return null;
		}
	}
)((indexes, filter, order) => {
	return `${JSON.stringify(filter)}${JSON.stringify(order)}`;
});

/**
 * Remove duplicate indexes from given indexes. Returns new Array.
 * @param {Array} indexes Array of indexes where can index duplicate.
 * @returns {Array} unique indexes
 */
function getUniqueIndexes(indexes) {
	if (!_isEmpty(indexes)) {
		return indexes.reduce((uniqueIndexes, index) => {
			if (
				_find(
					uniqueIndexes,
					i => i && isCorrespondingIndex(index, i.filter, i.order)
				)
			) {
				return uniqueIndexes;
			}

			return [...uniqueIndexes, index];
		}, []);
	} else {
		return null;
	}
}

/**
 * Remove index from given indexes that fit to filter and order.
 * If index does not exists under filter, same instance of indexes has return.
 * @param indexes {Array} Array of indexes
 * @param filter {Object}
 * @param order {Array}
 * @return {Array} New instance of indexes
 */
function removeIndex(indexes = [], filter, order) {
	if (indexes && !_isEmpty(indexes)) {
		const clearedIndexes = _reduce(
			indexes,
			(acc, index) => {
				const indexToBeCleared = isCorrespondingIndex(index, filter, order);
				if (indexToBeCleared) {
					return acc;
				} else {
					return [...acc, index];
				}
			},
			[]
		);

		if (clearedIndexes.length === indexes.length) {
			return indexes;
		} else {
			return clearedIndexes;
		}
	} else {
		return indexes;
	}
}

/**
 * Create set of updated indexes state based on current state and given indexUpdate.
 * It produce updated indexes state in case of existing index for given filter and order.
 * If index with filter and order is not in the state yet, its add to indexes state.
 * @param state {Object}
 * @param filter {Object}
 * @param order {Array}
 * @param indexUpdate {Array}
 * @param changedOn {string}
 * @param indexesPath {string} name of a property where indexes are stored
 */
function getUpdatedIndexes(
	state,
	filter,
	order,
	indexUpdate,
	changedOn,
	indexesPath = 'indexes'
) {
	let indexes = [];
	let selectedIndex = {};

	if (state[indexesPath]) {
		state[indexesPath].forEach(index => {
			if (_isEqual(index.filter, filter) && _isEqual(index.order, order)) {
				selectedIndex = index;
			} else {
				indexes.push(index);
			}
		});
	}

	let index;
	if (indexUpdate.length) {
		index = {...selectedIndex.index};
		indexUpdate.forEach((model, i) => {
			if (model.key) {
				index[i] = model.key;
			} else {
				//spatial data by spatialDataSourceKey, levels and tiles
				//update spatialDataSourceKey
				// in case of untiled data level is same like spatialDataSourceKey and dataByTiles is same like dataBySpatialDataSource
				//FIXME - add tests for untiled data
				for (const [level, dataByTiles] of Object.entries(model)) {
					if (Object.hasOwn(index, level) && index[level]) {
						//update data on level
						index[level] = {...index[level], ...dataByTiles};
					} else {
						index[level] = {...dataByTiles};
					}
				}
			}
		});
	}

	selectedIndex = {
		filter: selectedIndex.filter || filter,
		order: selectedIndex.order || order,
		changedOn: changedOn,
		index: index || selectedIndex.index,
	};
	indexes.push(selectedIndex);

	return indexes;
}

/**
 * Extend object "currentByDataSourceKey" by "update". Return new instance.
 * @param {Object} currentByDataSourceKey
 * @param {Object} update
 * @return {Object}
 */
function getUpdatedByDataSourceKey(currentByDataSourceKey, update = {}) {
	let updated = {...currentByDataSourceKey};
	for (const [key, values] of Object.entries(update)) {
		if (Object.hasOwn(updated, key)) {
			updated = {
				...updated,
				[key]: {
					...updated[key],
					...values,
				},
			};
		} else {
			updated = {
				...updated,
				[key]: {
					...values,
				},
			};
		}
	}
	return updated;
}

/**
 * True, if index.filter object and index.order array are deeply equal to given filter and order
 * @param index {Object} existing index
 * @param index.filter {Object}
 * @param index.order {Array}
 * @param filter {Object}
 * @param order {Array}
 * @return {boolean}
 */
function isCorrespondingIndex(index, filter, order) {
	return (
		_isEqual(index.filter || null, filter || null) &&
		_isEqual(index.order || null, order || null)
	);
}

/**
 * Check if filter fits given filter.
 * Not tested now.
 * Needs farther discusion. It will not be possible test item on complicated geometry filter.
 * @param {*} filter
 * @param {*} item
 * @returns {Boolean}
 */
function itemFitFilter(filter, item) {
	// null filter fit
	if (filter === null) {
		return true;
	}

	const entries = Object.entries(filter);

	return entries.every(([key, value]) => {
		const itemHasFilterKey = item?.data && Object.hasOwn(item.data, key);
		const itemHasFilterLinkKey =
			item.data && Object.hasOwn(item.data, `${key}Key`);
		if (itemHasFilterKey) {
			//apply condition
			//"column0": "hleda se rovnost",
			//"column1": null,
			if (item.data && item.data[key] === value) {
				return true;
			}

			// "column2": {
			// 	"like": "hleda se podobnost, castecny vyskyt"
			// },
			if (_isObject(value) && value['like']) {
				//now we dont deal like filter, refrest indexes
				return true;
			}

			// "column3": {
			// 	"in": ["existuje", "v", "poli", "prvku"]
			// },
			if (_isObject(value) && value['in']) {
				return value.in.includes(item.data[key]);
			}

			// "column4": {
			// 	"notin": ["neexistuje", "v", "poli", "prvku"]
			// }
			if (_isObject(value) && value['notin']) {
				return !value.notin.includes(item.data[key]);
			}
		}

		//check if filter contains linking like scopeKey, viewKey, ...
		if (itemHasFilterLinkKey) {
			if (item.data && item.data[`${key}Key`] === value) {
				return true;
			}
		}

		//if to filter fit return false
		return false;
	});
}

/**
 * Merge stores active keys with filter by active and filter
 * @param activeKeys {Object} {activeScopeKey: 'bbb', activePlaceKeys: ['ddd', 'eee'], ...}
 * @param filterByActive {Object} {scope: true, place: true, ...}
 * @param filter {Object} {scopeKey: 'aaa', placeKey: {in: ['fff']}, ...}
 * @return {Object} merged object which looks like this {scopeKey: 'aaa', placeKey: {in: ['bbb', 'ccc']}, ...}
 */
function mergeFilters(activeKeys, filterByActive, filter) {
	if (activeKeys && filterByActive) {
		let activeKeysFilter = {};
		if (filterByActive.application) {
			if (activeKeys.activeApplicationKey) {
				activeKeysFilter.applicationKey = activeKeys.activeApplicationKey;
			}
		}
		if (filterByActive.case) {
			if (activeKeys.activeCaseKey) {
				activeKeysFilter.caseKey = activeKeys.activeCaseKey;
			} else if (activeKeys.activeCaseKeys) {
				activeKeysFilter.caseKey = {in: activeKeys.activeCaseKeys};
			}
		}
		if (filterByActive.scope) {
			if (activeKeys.activeScopeKey) {
				activeKeysFilter.scopeKey = activeKeys.activeScopeKey;
			}
		}
		if (filterByActive.scenario) {
			if (activeKeys.activeScenarioKey) {
				activeKeysFilter.scenarioKey = activeKeys.activeScenarioKey;
			} else if (activeKeys.activeScenarioKeys) {
				activeKeysFilter.scenarioKey = {in: activeKeys.activeScenarioKeys};
			}
		}
		if (filterByActive.place) {
			if (activeKeys.activePlaceKey) {
				activeKeysFilter.placeKey = activeKeys.activePlaceKey;
			} else if (activeKeys.activePlaceKeys) {
				activeKeysFilter.placeKey = {in: activeKeys.activePlaceKeys};
			}
		}
		if (filterByActive.period) {
			if (activeKeys.activePeriodKey) {
				activeKeysFilter.periodKey = activeKeys.activePeriodKey;
			} else if (activeKeys.activePeriodKeys) {
				activeKeysFilter.periodKey = {in: activeKeys.activePeriodKeys};
			}
		}
		if (filterByActive.attribute) {
			if (activeKeys.activeAttributeKey) {
				activeKeysFilter.attributeKey = activeKeys.activeAttributeKey;
			} else if (activeKeys.activeAttributeKeys) {
				activeKeysFilter.attributeKey = {in: activeKeys.activeAttributeKeys};
			}
		}
		if (filterByActive.layerTemplate) {
			if (activeKeys.activeLayerTemplateKey) {
				activeKeysFilter.layerTemplateKey = activeKeys.activeLayerTemplateKey;
			}
		}
		if (filterByActive.areaTreeLevel) {
			if (activeKeys.activeAreaTreeLevelKey) {
				activeKeysFilter.areaTreeLevelKey = activeKeys.activeAreaTreeLevelKey;
			}
		}

		const finalFilter = {...activeKeysFilter, ...filter};
		return _isEmpty(finalFilter) ? null : finalFilter;
	} else {
		return filter;
	}
}

/**
 * Merge metadata defined by key with metadata keys defined by filterByActive
 * @param definedKeys {Object}
 * @param activeKeys {Object}
 * @return {Object|null}
 */
function mergeMetadataKeys(definedKeys, activeKeys) {
	if (definedKeys && activeKeys) {
		return {...activeKeys, ...definedKeys};
	} else {
		return definedKeys || activeKeys || null;
	}
}

/**
 * It converts modifiers from metadataKeys: ["A", "B"] to metadataKey: {in: ["A", "B"]}
 * @param modifiers {Object}
 * @return {Object|null}
 */
function convertModifiersToRequestFriendlyFormat(modifiers) {
	if (modifiers) {
		let modifiersForRequest = {};
		if (modifiers.scopeKey || modifiers.scopeKey === null) {
			modifiersForRequest.scopeKey = modifiers.scopeKey;
		}

		if (modifiers.placeKeys) {
			modifiersForRequest.placeKey = {in: modifiers.placeKeys};
		} else if (modifiers.placeKey || modifiers.placeKey === null) {
			modifiersForRequest.placeKey = modifiers.placeKey;
		}

		if (modifiers.caseKeys) {
			modifiersForRequest.caseKey = {in: modifiers.caseKeys};
		} else if (modifiers.caseKey || modifiers.caseKey === null) {
			modifiersForRequest.caseKey = modifiers.caseKey;
		}

		if (modifiers.scenarioKeys) {
			modifiersForRequest.scenarioKey = {in: modifiers.scenarioKeys};
		} else if (modifiers.scenarioKey || modifiers.scenarioKey === null) {
			modifiersForRequest.scenarioKey = modifiers.scenarioKey;
		}

		if (modifiers.periodKeys) {
			modifiersForRequest.periodKey = {in: modifiers.periodKeys};
		} else if (modifiers.periodKey || modifiers.periodKey === null) {
			modifiersForRequest.periodKey = modifiers.periodKey;
		}

		if (modifiers.areaTreeLevelKey) {
			modifiersForRequest.areaTreeLevelKey = modifiers.areaTreeLevelKey;
		}

		if (modifiers.applicationKey || modifiers.applicationKey === null) {
			modifiersForRequest.applicationKey = modifiers.applicationKey;
		}

		return !_isEmpty(modifiersForRequest) ? modifiersForRequest : null;
	} else {
		return null;
	}
}

/**
 * Check if given input is natural number
 * @param input
 * @return {boolean}
 */
function isNaturalNumber(input) {
	return _isNumber(input) && input > 0 && input % 1 === 0;
}

/**
 * @param interval {Object}
 * @return {boolean}
 */
function isInterval(interval) {
	return isNaturalNumber(interval?.start) && isNaturalNumber(interval?.length);
}

/**
 * Return only intervals which really are intervals
 * @param intervals {Array}
 * @return {Array}
 */
function getValidIntervals(intervals) {
	return intervals.filter(interval => isInterval(interval));
}

/**
 * Return sorted intervals
 * @param intervals {Array}
 * @return {Array}
 */
function getSortedValidIntervals(intervals) {
	return _sortBy(getValidIntervals(intervals), ['start', 'length']);
}

/**
 * @param earlier {Object} interval
 * @param later {Object} interval
 * @return {boolean}
 */
function areIntervalsOverlappedOrSubsequent(earlier, later) {
	if (isInterval(earlier) && isInterval(later)) {
		return later.start <= earlier.start + earlier.length;
	} else {
		return false;
	}
}

/**
 * Merge relevant intervals together
 * @param intervals {Array}
 * @return {Array}
 */
function mergeIntervals(intervals) {
	const sortedIntervals = getSortedValidIntervals(intervals);
	if (sortedIntervals.length === 0) {
		return null;
	}

	//merge intervals
	return _tail(sortedIntervals).reduce(
		(mergedIntervals, interval) => {
			const last = mergedIntervals.pop();
			if (areIntervalsOverlappedOrSubsequent(last, interval)) {
				//merge last & current
				const end = Math.max(
					last.start + last.length,
					interval.start + interval.length
				);
				return [
					...mergedIntervals,
					{
						start: last.start,
						length: end - last.start,
					},
				];
			} else {
				//add both
				return [...mergedIntervals, last, interval];
			}
		},
		[_head(sortedIntervals)]
	);
}

/**
 * Add keys to index
 * @param index {Object}
 * @param models {Object} Collection of models
 * @param start {Number}
 * @return {Object} index
 */
function registerModelsToIndex(index, models, start) {
	if (models?.length && index && start > -1) {
		models.forEach((model, i) => {
			index[start + i] = model.key;
		});
		return index;
	} else {
		return index;
	}
}

function getActiveKeysByFilterByActiveHelper(filterByActive, activeKeys) {
	if (filterByActive && !_isEmpty(filterByActive)) {
		let keys = {};

		if (filterByActive.scope && activeKeys.activeScopeKey) {
			keys.scopeKey = activeKeys.activeScopeKey;
		}
		if (filterByActive.place) {
			if (activeKeys.activePlaceKey) {
				keys.placeKey = activeKeys.activePlaceKey;
			} else if (activeKeys.activePlaceKeys) {
				keys.placeKeys = activeKeys.activePlaceKeys;
			}
		}
		if (filterByActive.scenario) {
			if (activeKeys.activeScenarioKey) {
				keys.scenarioKey = activeKeys.activeScenarioKey;
			} else if (activeKeys.activeScenarioKeys) {
				keys.scenarioKeys = activeKeys.activeScenarioKeys;
			}
		}
		if (filterByActive.case) {
			if (activeKeys.activeCaseKey) {
				keys.caseKey = activeKeys.activeCaseKey;
			} else if (activeKeys.activeCaseKeys) {
				keys.caseKeys = activeKeys.activeCaseKeys;
			}
		}
		if (filterByActive.period) {
			if (activeKeys.activePeriodKey) {
				keys.periodKey = activeKeys.activePeriodKey;
			} else if (activeKeys.activePeriodKeys) {
				keys.periodKeys = activeKeys.activePeriodKeys;
			}
		}
		if (filterByActive.attribute) {
			if (activeKeys.activeAttributeKey) {
				keys.attributeKey = activeKeys.activeAttributeKey;
			} else if (activeKeys.activeAttributeKeys) {
				keys.attributeKeys = activeKeys.activeAttributeKeys;
			}
		}
		if (filterByActive.layerTemplate && activeKeys.activeLayerTemplateKey) {
			keys.layerTemplateKey = activeKeys.activeLayerTemplateKey;
		}
		if (filterByActive.areaTreeLevel && activeKeys.activeAreaTreeLevelKey) {
			keys.areaTreeLevelKey = activeKeys.activeAreaTreeLevelKey;
		}
		if (filterByActive.application && activeKeys.activeApplicationKey) {
			keys.applicationKey = activeKeys.activeApplicationKey;
		}

		return !_isEmpty(keys) ? keys : null;
	} else {
		return null;
	}
}

export default {
	convertModifiersToRequestFriendlyFormat,
	removeIndex,
	getActiveKeysByFilterByActiveHelper,
	getIndex,
	getUniqueIndexes,
	getUpdatedIndexes,
	getUpdatedByDataSourceKey,
	mergeFilters,
	mergeMetadataKeys,
	isCorrespondingIndex,
	itemFitFilter,
	registerModelsToIndex,

	// intervals
	areIntervalsOverlappedOrSubsequent,
	isInterval,
	isNaturalNumber,
	getValidIntervals,
	getSortedValidIntervals,
	mergeIntervals,
};
