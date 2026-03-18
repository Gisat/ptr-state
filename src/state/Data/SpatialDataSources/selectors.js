import {isEmpty as _isEmpty} from 'lodash';
import {stateManagement} from '@gisatcz/ptr-utils';
import {
	createSelector as createRecomputeSelector,
	createObserver as createRecomputeObserver,
} from '@jvitela/recompute';

import common from '../../_common/selectors';
import createCachedSelector from 're-reselect';
import commonHelpers from '../../_common/helpers';
import {recomputeSelectorOptions} from '../../_common/recomputeHelpers';

const getSubstate = state => state.data.spatialDataSources;

const getIndex = common.getIndex(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);

const getIndexesObserver = createRecomputeObserver(state =>
	common.getIndexes(getSubstate)(state)
);

/**
 * Merge vector data source with featureId datasource
 * @param {Array} dataSources
 * @returns {Array} dataSources
 */
const mergeVectorTypes = (dataSources = []) => {
	return dataSources.reduce((acc, val) => {
		if (val.data.type === 'vector') {
			//check if fid ds exists
			const dsIndex = acc.findIndex(
				ds => ds.data.vectorKey === val.data.vectorKey
			);

			if (dsIndex > -1) {
				//merge
				const merged = {
					...acc[dsIndex],
					...val,
					data: {
						...acc[dsIndex].data,
						...val.data,
					},
				};
				return stateManagement.replaceItemOnIndex(acc, dsIndex, merged);
			} else {
				return [...acc, val];
			}
		}

		if (val.data.type === 'featureId') {
			//check if fid ds exists
			const dsIndex = acc.findIndex(
				ds => ds.data.vectorKey === val.data.vectorKey
			);

			if (dsIndex > -1) {
				//merge
				const merged = {
					...acc[dsIndex],
					data: {
						...acc[dsIndex].data,
						fidColumnName: val.data.propertyName,
					},
				};

				return stateManagement.replaceItemOnIndex(acc, dsIndex, merged);
			} else {
				const blankVectorDSWithFID = {
					data: {
						vectorKey: val.data.vectorKey,
						fidColumnName: val.data.propertyName,
					},
				};
				return [...acc, blankVectorDSWithFID];
			}
		}

		return [...acc, val];
	}, []);
};

/**
 * It returns data source model for given key, if exists
 * @param key {string} data source key
 * @return {Object} Data source
 */
const getByKeyObserver = createRecomputeObserver((state, key) => {
	return getSubstate(state)?.byKey?.[key] || null;
});

/**
 * It returns data source models for given keys, if exist
 * @param keys {Array} data source keys
 * @return {Array} A collection of data sources
 */
const getByKeys = createRecomputeSelector(keys => {
	if (keys?.length) {
		let dataSources = [];
		keys.forEach(key => {
			const dataSource = getByKeyObserver(key);
			if (dataSource) {
				dataSources.push(dataSource);
			}
		});
		return dataSources.length ? dataSources : null;
	} else {
		return null;
	}
}, recomputeSelectorOptions);

/**
 * It returns whole index for given filter and order
 * @param filter {Object} Filter object contains modifiers and layerTemplateKey or areaTreeLevelKey.
 * @param order {Array}
 * @return index {Object}
 */
const getIndex_recompute = createRecomputeSelector((filter, order) => {
	const indexes = getIndexesObserver();
	if (indexes) {
		return commonHelpers.getIndex(indexes, filter, order);
	} else {
		return null;
	}
}, recomputeSelectorOptions);

/**
 * It returns a collection of indexed data sources for given filter
 * @param filter {Object} Filter object contains modifiers and layerTemplateKey or areaTreeLevelKey.
 * @return {Array}
 */
const getIndexed_recompute = createRecomputeSelector(filter => {
	const index = getIndex_recompute(filter, null);
	if (index?.index) {
		let keys = Object.values(index.index);
		if (keys) {
			const byKeys = getByKeys(keys);
			const merged = mergeVectorTypes(byKeys);
			return merged;
		} else {
			return null;
		}
	} else {
		return null;
	}
}, recomputeSelectorOptions);

/**
 * It returns a collection of indexed data sources for given filter.
 * @param state {Object}
 * @param filter {Object} Filter object contains modifiers and layerTemplateKey or areaTreeLevelKey.
 * @return {Array}
 */
const getIndexed = createCachedSelector(
	[getIndex, getAllAsObject],
	(index, dataSources) => {
		if (!_isEmpty(index) && index.index) {
			const dataSourceKeys = Object.values(index.index);
			if (!_isEmpty(dataSourceKeys)) {
				let filteredDataSources = [];
				dataSourceKeys.forEach(dataSourceKey => {
					const dataSource = dataSources[dataSourceKey];
					if (dataSource) {
						filteredDataSources.push(dataSource);
					}
				});

				if (filteredDataSources.length > 0) {
					return filteredDataSources;
				} else {
					return null;
				}
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
)((state, filter) => {
	return `${JSON.stringify(filter)}`;
});

export default {
	getSubstate,

	getByKeys,
	getByKeyObserver,

	getIndexesObserver,
	getIndexed,
	getIndexed_recompute,
	getIndex,
	getIndex_recompute,
};
