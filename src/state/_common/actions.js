import _, {isEqual, omit} from 'lodash';
import path from 'path';
import moment from 'moment';

import request from './request';
import commonHelpers from './helpers';
import commonSelectors from './selectors';
import Select from '../Select';
import ActionTypes from '../../constants/ActionTypes';

import {utils} from '@gisatcz/ptr-utils';
import {configDefaults} from '@gisatcz/ptr-core';

const DEFAULT_CATEGORY_PATH = 'metadata';

// ============ factories ===========

// eslint-disable-next-line no-unused-vars
const add = action => {
	return data => {
		return dispatch => {
			if (!_.isArray(data)) data = [data];
			dispatch(action(data));
		};
	};
};

const apiDelete = (dataType, categoryPath, data) => {
	return (dispatch, getState) => {
		const localConfig = Select.app.getCompleteLocalConfiguration(getState());
		const apiPath = path.join(categoryPath, 'nodes/remove');
		const payload = {
			keys: [data[0].key],
		};
		return request(localConfig, apiPath, 'PATCH', null, payload, null, null)
			.then(result => {
				if (
					(result.errors && result.errors[dataType]) ||
					(result.data && !result.data[dataType])
				) {
					dispatch(
						actionGeneralError(result.errors[dataType] || new Error('no data'))
					);
				} else {
					const itemsDeleted = result.keys;
					if (itemsDeleted.length > 0) {
						return result;
					} else {
						console.warn(`No data updated for ${dataType} metadata type`);
					}
				}
			})
			.catch(error => {
				dispatch(actionGeneralError(error));
			});
	};
};

const apiUpdate = (
	getSubstate,
	dataType,
	actionTypes,
	categoryPath,
	editedData
) => {
	return (dispatch, getState) => {
		const localConfig = Select.app.getCompleteLocalConfiguration(getState());
		const apiPath = path.join(categoryPath, 'nodes/change');
		const payload = editedData;
		return request(localConfig, apiPath, 'PATCH', null, payload, null, null)
			.then(result => {
				if (
					(result.errors && result.errors[dataType]) ||
					(result.data && !result.data[dataType])
				) {
					dispatch(
						actionGeneralError(result.errors[dataType] || new Error('no data'))
					);
				} else {
					const updateNodeKey = result.body[0];
					return dispatch(
						loadKey(dataType, actionTypes, updateNodeKey, categoryPath)
					).then(item => {
						dispatch(
							receiveUpdated(
								getSubstate,
								actionTypes,
								item,
								dataType,
								categoryPath
							)
						);
					});
				}
			})
			.catch(error => {
				dispatch(actionGeneralError(error));
			});
	};
};

const updateEdited = (getSubstate, actionTypes) => {
	return (modelKey, key, value) => {
		return (dispatch, getState) => {
			if (!getSubstate) {
				return dispatch(
					actionGeneralError(
						'common/actions#updateEdited: setSubstate parameter is missing!'
					)
				);
			}
			if (!actionTypes) {
				return dispatch(
					actionGeneralError(
						'common/actions#updateEdited: actionTypes parameter is missing!'
					)
				);
			}
			if (!modelKey) {
				return dispatch(
					actionGeneralError(
						'common/actions#updateEdited: Model key is missing!'
					)
				);
			}
			if (!key) {
				return dispatch(
					actionGeneralError(
						'common/actions#updateEdited: Property key is missing!'
					)
				);
			}

			let originalModel = commonSelectors.getByKey(getSubstate)(
				getState(),
				modelKey
			);

			// delete property from edited, if the value in update is the same as in state
			//TODO - test
			if (
				originalModel &&
				(value === originalModel.data[key] ||
					isEqual(originalModel.data[key], value))
			) {
				dispatch(actionRemovePropertyFromEdited(actionTypes, modelKey, key));
			} else {
				dispatch(
					actionUpdateEdited(actionTypes, [
						{key: modelKey, data: {[key]: value}},
					])
				);
			}
		};
	};
};

const updateStore = (getSubstate, actionTypes) => {
	return data => {
		return dispatch => {
			dispatch(actionUpdateStore(actionTypes, data));
		};
	};
};

const removePropertyFromEdited = actionTypes => {
	return (modelKey, key) => {
		return dispatch => {
			return dispatch(
				actionRemovePropertyFromEdited(actionTypes, modelKey, key)
			);
		};
	};
};

const deleteItem = (
	getSubstate,
	dataType,
	actionTypes,
	categoryPath = DEFAULT_CATEGORY_PATH
) => {
	return item => {
		return (dispatch, getState) => {
			if (!item) {
				return dispatch(
					actionGeneralError(
						'common/actions#deleteItem: item to delete is missing!'
					)
				);
			}

			if (!item.key) {
				return dispatch(
					actionGeneralError(
						'common/actions#deleteItem: item key to delete is missing!'
					)
				);
			}
			//dispatch deleting?
			//TODO
			return dispatch(
				apiDelete(dataType, categoryPath, [{key: item.key}])
			).then(result => {
				const deletedKeys = result.keys;

				//Check if item deleted
				if (isEqual(deletedKeys, [item.key])) {
					// mark deleted items by "deleted" date
					const deleteDate = moment(new Date().toISOString()).utc().format();
					deletedKeys.forEach(key => {
						dispatch(actionMarkAsDeleted(actionTypes, key, deleteDate));
					});

					// remove dependencies in all edited metadata
					dispatch(
						actionRemovePropertyValuesFromAllEdited(dataType, deletedKeys)
					);
					// TODO check original metadata dependencies

					//refresh proper indexes
					const state = getState();
					const indexes =
						commonSelectors.getIndexesByFilteredItem(getSubstate)(
							state,
							item
						) || [];
					if (!_.isEmpty(indexes)) {
						indexes.forEach(index => {
							if (index) {
								//invalidate data
								dispatch(
									actionClearIndex(actionTypes, index.filter, index.order)
								);
								//refresh data
								dispatch(
									refreshIndex(
										getSubstate,
										dataType,
										index.filter,
										index.order,
										actionTypes,
										categoryPath
									)
								);
							}
						});
					}
				} else {
					//error
					return dispatch(
						actionGeneralError(
							'common/actions#deleteItem: Deleted key is not equal to key to delete!'
						)
					);
				}
			});
		};
	};
};

const saveEdited = (
	getSubstate,
	dataType,
	actionTypes,
	categoryPath = DEFAULT_CATEGORY_PATH
) => {
	return key => {
		return (dispatch, getState) => {
			if (!getSubstate) {
				return dispatch(
					actionGeneralError(
						'common/actions#saveEdited: setSubstate parameter is missing!'
					)
				);
			}
			if (!dataType) {
				return dispatch(
					actionGeneralError(
						'common/actions#saveEdited: dataType parameter is missing!'
					)
				);
			}
			if (!actionTypes) {
				return dispatch(
					actionGeneralError(
						'common/actions#saveEdited: actionTypes parameter is missing!'
					)
				);
			}
			if (!key) {
				return dispatch(
					actionGeneralError('common/actions#saveEdited: Model key is missing!')
				);
			}
			let state = getState();
			let saved = commonSelectors.getByKey(getSubstate)(state, key);
			let edited = commonSelectors.getEditedByKey(getSubstate)(state, key);

			if (saved) {
				// update
				//FIXME
				const editedRestructured = {key: edited.key, ...edited.data};
				return dispatch(
					apiUpdate(getSubstate, dataType, actionTypes, categoryPath, [
						editedRestructured,
					])
				);
			} else {
				// create
				// debugger;
			}
		};
	};
};

const useKeys = (
	getSubstate,
	dataType,
	actionTypes,
	categoryPath = DEFAULT_CATEGORY_PATH
) => {
	return (keys, componentId) => {
		return (dispatch, getState) => {
			const state = getState();
			const isRegistered = commonSelectors.haveAllKeysRegisteredUse(
				getSubstate
			)(state, componentId, keys);
			if (!isRegistered) {
				dispatch(actionUseKeysRegister(actionTypes, componentId, keys));
			}

			if (keys.length === 1) {
				return dispatch(
					ensureKey(getSubstate, dataType, actionTypes, keys[0], categoryPath)
				);
			} else {
				return dispatch(
					ensureKeys(getSubstate, dataType, actionTypes, keys, categoryPath)
				);
			}
		};
	};
};

const useIndexed = (
	getSubstate,
	dataType,
	actionTypes,
	categoryPath = DEFAULT_CATEGORY_PATH
) => {
	return (filterByActive, filter, order, start, length, componentId) => {
		return (dispatch, getState) => {
			dispatch(
				actionUseIndexedRegister(
					actionTypes,
					componentId,
					filterByActive,
					filter,
					order,
					start,
					length
				)
			);
			let state = getState();
			const activeKeys = commonSelectors.getAllActiveKeys(state);

			let fullFilter = commonHelpers.mergeFilters(
				activeKeys,
				filterByActive,
				filter
			);
			return dispatch(
				ensureIndexed(
					getSubstate,
					dataType,
					fullFilter,
					order,
					start,
					length,
					actionTypes,
					categoryPath
				)
			);
		};
	};
};

/**
 * If not refresh data, call clearIndex to invalidate data.
 */
function refreshIndex(
	getSubstate,
	dataType,
	filter,
	order,
	actionTypes,
	categoryPath = DEFAULT_CATEGORY_PATH
) {
	return (dispatch, getState) => {
		let state = getState();
		let usesForIndex = commonSelectors.getUsedIndexPage(getSubstate)(
			state,
			filter,
			order
		);
		if (usesForIndex) {
			_.each(usesForIndex.uses, use => {
				dispatch(
					ensureIndexed(
						getSubstate,
						dataType,
						usesForIndex.filter,
						usesForIndex.order,
						use.start,
						use.length,
						actionTypes,
						categoryPath
					)
				);
			});
		}
	};
}

function receiveIndexed(actionTypes, result, dataType, filter, order, start) {
	return dispatch => {
		// add data to store
		if (result.data[dataType].length) {
			dispatch(actionAdd(actionTypes, result.data[dataType], filter));
		}

		// add to index
		dispatch(
			actionAddIndex(
				actionTypes,
				filter,
				order,
				result.total,
				start,
				result.data[dataType],
				result.changes && result.changes[dataType]
			)
		);
	};
}

function requestWrapper(
	apiPath,
	method,
	query,
	payload,
	successAction,
	errorAction,
	ttl,
	dataPath
) {
	return (dispatch, getState) => {
		const localConfig = Select.app.getCompleteLocalConfiguration(getState());

		request(localConfig, apiPath, method, query, payload, ttl, dataPath)
			.then(result => {
				dispatch(successAction(result.data));
			})
			.catch(error => {
				dispatch(errorAction(error));
			});
	};
}

function processPatchResponse(response, dataType) {
	const transformedResponse = response
		.filter(r => r.nodeType === dataType)
		.map(r => {
			// eslint-disable-next-line no-unused-vars
			const {key, nodeType, ...rest} = r;
			return {
				key,
				data: rest || {},
			};
		});
	return transformedResponse;
}

function create(
	getSubstate,
	dataType,
	actionTypes,
	categoryPath = DEFAULT_CATEGORY_PATH
) {
	return (key, appKey) => {
		return (dispatch, getState) => {
			const state = getState();
			const apiPath = path.join(categoryPath, 'nodes/change');
			const localConfig = Select.app.getCompleteLocalConfiguration(state);

			let applicationKey = null;
			if (appKey) {
				applicationKey = appKey;
			} else {
				let currentAppKey = Select.app.getKey(state);
				if (currentAppKey) {
					applicationKey = currentAppKey;
				}
			}

			const payload = getCreatePayload(dataType, key, applicationKey);
			return request(localConfig, apiPath, 'PATCH', null, payload, null, null)
				.then(result => {
					if (
						(result.errors && result.errors[dataType]) ||
						(result.data && !result.data[dataType])
					) {
						dispatch(
							actionGeneralError(
								result.errors[dataType] || new Error('no data')
							)
						);
					} else {
						// FIXME - response should have stable structure
						const items = processPatchResponse(result.body, dataType);

						dispatch(actionAdd(actionTypes, items));

						let indexes = [];
						items.forEach(item => {
							indexes =
								indexes.concat(
									// Find out indexes which could include new item
									commonSelectors.getIndexesByFilteredItem(getSubstate)(
										getState(),
										item
									)
								) || [];
						});

						let uniqueIndexes = commonHelpers.getUniqueIndexes(indexes);
						if (!_.isEmpty(uniqueIndexes)) {
							uniqueIndexes.forEach(index => {
								if (index) {
									//invalidate data
									dispatch(
										actionClearIndex(actionTypes, index.filter, index.order)
									);
									//refresh data
									dispatch(
										refreshIndex(
											getSubstate,
											dataType,
											index.filter,
											index.order,
											actionTypes,
											categoryPath
										)
									);
								}
							});
						}
					}
				})
				.catch(error => {
					dispatch(actionGeneralError(error));
				});
		};
	};
}

function ensureKeys(
	getSubstate,
	dataType,
	actionTypes,
	keys,
	categoryPath = DEFAULT_CATEGORY_PATH
) {
	return (dispatch, getState) => {
		const state = getState();
		const PAGE_SIZE =
			Select.app.getLocalConfiguration(state, 'requestPageSize') ||
			configDefaults.requestPageSize;

		let keysToLoad = commonSelectors.getKeysToLoad(getSubstate)(state, keys);
		let promises = [];

		if (keysToLoad) {
			keysToLoad = _.chunk(keysToLoad, PAGE_SIZE);
			_.each(keysToLoad, keysToLoadPage => {
				promises.push(
					dispatch(
						loadKeysPage(dataType, actionTypes, keysToLoadPage, categoryPath)
					)
				);
			});
		}

		return Promise.all(promises);
	};
}

function ensureKey(
	getSubstate,
	dataType,
	actionTypes,
	key,
	categoryPath = DEFAULT_CATEGORY_PATH
) {
	return (dispatch, getState) => {
		const state = getState();

		let keysToLoad = commonSelectors.getKeysToLoad(getSubstate)(state, [key]);
		let promises = [];
		if (keysToLoad) {
			promises.push(
				dispatch(loadKey(dataType, actionTypes, keysToLoad[0], categoryPath))
			);
		}

		return Promise.all(promises);
	};
}

function ensureIndexed(
	getSubstate,
	dataType,
	filter,
	order,
	start,
	length,
	actionTypes,
	categoryPath = DEFAULT_CATEGORY_PATH
) {
	return (dispatch, getState) => {
		const state = getState();
		const localConfig = Select.app.getCompleteLocalConfiguration(state);
		const PAGE_SIZE =
			localConfig.requestPageSize || configDefaults.requestPageSize;
		let total = commonSelectors.getIndexTotal(getSubstate)(
			state,
			filter,
			order
		);
		let changedOn = commonSelectors.getIndexChangedOn(getSubstate)(
			state,
			filter,
			order
		);

		if (total != null) {
			// we have existing index, we only load what we don't have

			const indexPage =
				commonSelectors.getIndexPage(getSubstate)(
					state,
					filter,
					order,
					start,
					length
				) || {};
			const pages = _.chunk(Object.values(indexPage), PAGE_SIZE);
			const promises = pages.map((page, i) => {
				const loadedKeys = page.filter(v => v != null);
				if (loadedKeys.length === page.length) {
					return; // page is already loaded
				}

				const completeFilter = loadedKeys.length
					? {...filter, key: {notin: loadedKeys}}
					: filter;

				return dispatch(
					loadIndexedPage(
						dataType,
						completeFilter,
						order,
						start + i * PAGE_SIZE,
						changedOn,
						actionTypes,
						categoryPath
					)
				).catch(err => {
					if (err.message === 'Index outdated') {
						dispatch(
							refreshIndex(
								getSubstate,
								dataType,
								filter,
								order,
								actionTypes,
								categoryPath
							)
						);
					}
				});
			});

			return Promise.all(promises);
		} else {
			// we don't have index, we need to load everything

			return dispatch(
				loadIndexedPage(
					dataType,
					filter,
					order,
					start,
					changedOn,
					actionTypes,
					categoryPath
				)
			)
				.then(response => {
					// check success to make sure it's our error from BE and not anything broken in render chain
					if (response && response.message && response.success === false) {
						// do nothing
					} else {
						// remaining pages
						if (length > PAGE_SIZE) {
							return dispatch(
								ensureIndexed(
									getSubstate,
									dataType,
									filter,
									order,
									start + PAGE_SIZE,
									length - PAGE_SIZE,
									actionTypes,
									categoryPath
								)
							);
						} // else already done
					}
				})
				.catch(err => {
					if (err.message === 'Index outdated') {
						dispatch(
							refreshIndex(
								getSubstate,
								dataType,
								filter,
								order,
								actionTypes,
								categoryPath
							)
						);
					} else {
						throw new Error(`_common/actions#ensure: ${err}`);
					}
				});
		}
	};
}

function processResponse(response, dataType) {
	const transformedResponse = response
		.filter(r => r.nodeType === dataType)
		.map(r => {
			const {key, data, ...rest} = r;
			const entity = {
				key: key,
				data: data || rest || {},
			};

			entity.data = omit(entity.data, ['lastUpdatedAt', 'nodeType']);
			return entity;
		});

	return {
		data: {
			[dataType]: transformedResponse,
		},
		// total: response.total,
		total: response.total || transformedResponse.length,
		changes: response.changes,
	};
}

function loadKeysPage(
	dataType,
	actionTypes,
	keys,
	categoryPath = DEFAULT_CATEGORY_PATH
) {
	return (dispatch, getState) => {
		const localConfig = Select.app.getCompleteLocalConfiguration(getState());
		const apiPath = path.join(categoryPath, 'nodes-by-keys');
		const PAGE_SIZE =
			localConfig.requestPageSize || configDefaults.requestPageSize;

		let payload = {
			keys: keys,
			limit: PAGE_SIZE,
		};

		return request(localConfig, apiPath, 'POST', null, payload, null, null)
			.then(result => {
				// FIXME - response should have stable structure
				result = processResponse(result.body, dataType);
				if (
					(result.errors && result.errors[dataType]) ||
					(result.data && !result.data[dataType])
				) {
					throw new Error(result.errors[dataType] || 'no data');
				} else {
					dispatch(
						receiveKeys(actionTypes, result.data[dataType], dataType, keys)
					);
				}
			})
			.catch(error => {
				dispatch(actionGeneralError(error));
				return error;
			});
	};
}

function loadKey(
	dataType,
	actionTypes,
	key,
	categoryPath = DEFAULT_CATEGORY_PATH
) {
	return (dispatch, getState) => {
		const localConfig = Select.app.getCompleteLocalConfiguration(getState());
		const apiPath = path.join(categoryPath, 'nodes', key);

		return request(localConfig, apiPath, 'GET', null, null, null, null)
			.then(result => {
				// FIXME - response should have stable structure
				// result = processResponse({data: result.data}, dataType);
				if (
					(result.errors && result.errors[dataType]) ||
					(result && result.nodeType !== dataType)
				) {
					throw new Error(result.errors[dataType] || 'no data');
				} else {
					dispatch(
						receiveKeys(
							actionTypes,
							[{key: result.key, data: result.data}],
							dataType,
							[key]
						)
					);
					return result;
				}
			})
			.catch(error => {
				dispatch(actionGeneralError(error));
				return error;
			});
	};
}

function loadIndexedPage(
	dataType,
	filter,
	order,
	start,
	changedOn,
	actionTypes,
	categoryPath = DEFAULT_CATEGORY_PATH
) {
	return (dispatch, getState) => {
		const localConfig = Select.app.getCompleteLocalConfiguration(getState());
		const PAGE_SIZE =
			localConfig.requestPageSize || configDefaults.requestPageSize;
		// const apiPath = getAPIPath(categoryPath, dataType);
		const apiPath = path.join(categoryPath, 'nodes-by-type-and-edges');

		let payload = {
			edges: filter && Object.values(filter),
			nodeType: dataType,
			offset: start - 1,
			order: order,
			limit: PAGE_SIZE,
		};
		return request(localConfig, apiPath, 'POST', null, payload, null, null)
			.then(result => {
				// FIXME - response should have stable structure
				result = processResponse(result.data, dataType);
				if (
					(result.errors && result.errors[dataType]) ||
					(result.data && !result.data[dataType])
				) {
					throw new Error(result.errors[dataType] || 'no data');
				} else if (
					result.changes &&
					result.changes[dataType] &&
					moment(result.changes[dataType]).isAfter(changedOn)
				) {
					throw new Error('Index outdated');
				} else {
					dispatch(
						// FIXME - add order, start and result.total/count
						receiveIndexed(actionTypes, result, dataType, filter, order, start)
					);
				}
			})
			.catch(error => {
				dispatch(actionGeneralError(error));
				return error; //todo do we need to return this
			});
	};
}

function receiveUpdated(
	getSubstate,
	actionTypes,
	result,
	dataType,
	categoryPath
) {
	return (dispatch, getState) => {
		let data = result.data[dataType];
		if (data.length) {
			let originalData = commonSelectors.getAllAsObject(getSubstate)(
				getState()
			);
			dispatch(actionAdd(actionTypes, data));
			let editedData = commonSelectors.getEditedAllAsObject(getSubstate)(
				getState()
			);

			let indexes = [];
			data.forEach(model => {
				let original = originalData?.[model.key];
				let edited = editedData?.[model.key]?.data;
				_.forIn(edited, (value, key) => {
					if (model.data[key] === value) {
						dispatch(
							actionRemovePropertyFromEdited(actionTypes, model.key, key)
						);
					} else if (_.isObject(value)) {
						if (JSON.stringify(value) === JSON.stringify(model.data[key])) {
							dispatch(
								actionRemovePropertyFromEdited(actionTypes, model.key, key)
							);
						} else if (_.isArray(value) && _.isEmpty(value)) {
							if (
								_.isEmpty(model.data[key]) ||
								(model.data && !model.data[key])
							) {
								dispatch(
									actionRemovePropertyFromEdited(actionTypes, model.key, key)
								);
							}
						}
					}
				});

				//Find corresponding indexes for new model
				indexes = indexes.concat(
					commonSelectors.getIndexesByFilteredItem(getSubstate)(
						getState() || [],
						model
					)
				);
				//Find corresponding indexes for original model
				indexes = indexes.concat(
					commonSelectors.getIndexesByFilteredItem(getSubstate)(
						getState() || [],
						original
					)
				);
			});

			let uniqueIndexes = commonHelpers.getUniqueIndexes(indexes);
			if (!_.isEmpty(uniqueIndexes)) {
				uniqueIndexes.forEach(index => {
					if (index) {
						//invalidate data
						dispatch(actionClearIndex(actionTypes, index.filter, index.order));
						//refresh data
						dispatch(
							refreshIndex(
								getSubstate,
								dataType,
								index.filter,
								index.order,
								actionTypes,
								categoryPath
							)
						);
					}
				});
			}
		} else {
			console.warn(`No data updated for ${dataType} metadata type`);
		}
	};
}

function receiveKeys(actionTypes, result, dataType, keys) {
	return dispatch => {
		// add data to store
		if (result.length) {
			dispatch(actionAdd(actionTypes, result));
		}

		// add unreceived keys
		_.remove(keys, key => {
			return _.find(result, {key});
		});
		if (keys.length) {
			dispatch(actionAddUnreceivedKeys(actionTypes, keys));
		}
	};
}

function refreshUses(
	getSubstate,
	dataType,
	actionTypes,
	categoryPath = DEFAULT_CATEGORY_PATH
) {
	return () => {
		return (dispatch, getState) => {
			dispatch(actionClearIndexes(actionTypes));

			let state = getState();

			let usedKeys = commonSelectors.getKeysInUse(getSubstate)(state);
			dispatch(
				ensureKeys(getSubstate, dataType, actionTypes, usedKeys, categoryPath)
			);

			let usedIndexPages =
				commonSelectors.getUsedIndexPages(getSubstate)(state);

			const promises = _.flatMap(usedIndexPages, usedIndexPage => {
				_.map(usedIndexPage.uses, use => {
					return dispatch(
						ensureIndexed(
							getSubstate,
							dataType,
							usedIndexPage.filter,
							usedIndexPage.order,
							use.start,
							use.length,
							actionTypes,
							categoryPath
						)
					);
				});
			});

			return Promise.all(promises);
		};
	};
}

function ensureIndexesWithFilterByActive(
	getSubstate,
	dataType,
	actionTypes,
	categoryPath = DEFAULT_CATEGORY_PATH
) {
	return filterByActive => {
		return (dispatch, getState) => {
			const state = getState();
			const usedIndexes = commonSelectors.getUsesWithActiveDependency(
				getSubstate
			)(state, filterByActive);

			const promises = _.flatMap(usedIndexes, usedIndex => {
				_.map(usedIndex.uses, use => {
					return dispatch(
						ensureIndexed(
							getSubstate,
							dataType,
							usedIndex.filter,
							usedIndex.order,
							use.start,
							use.length,
							actionTypes,
							categoryPath
						)
					);
				});
			});

			return Promise.all(promises);
		};
	};
}

function updateSubstateFromView(actionTypes) {
	return data => {
		return dispatch => {
			if (data && data.activeKey) {
				dispatch(actionSetActiveKey(actionTypes, data.activeKey));
			} else if (data && data.activeKeys) {
				dispatch(actionSetActiveKeys(actionTypes, data.activeKeys));
			}
		};
	};
}

// ============ common namespace actions ===========

function actionDataSetOutdated() {
	return {
		type: ActionTypes.COMMON.DATA.SET_OUTDATED,
	};
}

function actionRemovePropertyValuesFromAllEdited(dataType, keys) {
	return {
		type: ActionTypes.COMMON.EDITED.REMOVE_PROPERTY_VALUES,
		dataType,
		keys,
	};
}

function actionGeneralError(e) {
	console.error('common/actions error', e);
	return {type: 'ERROR'};
}

// ============ specific store namespace actions ===========

const creator = action => {
	return actionTypes => {
		return (...args) => {
			return dispatch => {
				dispatch(action(actionTypes, ...args));
			};
		};
	};
};

function action(actionTypes, type, payload) {
	type = type.split('.');
	_.each(type, pathSegment => {
		if (!Object.hasOwn(actionTypes, pathSegment)) {
			console.error(
				'common/actions#action: Action not in namespace',
				type,
				payload
			);
			throw new Error('common/actions#action: Action not in namespace');
		}
		actionTypes = actionTypes[pathSegment];
	});
	if (typeof actionTypes !== 'string')
		throw new Error('common/actions#action: Action type not string');
	return {...payload, type: actionTypes};
}

function actionAdd(actionTypes, data, filter) {
	if (!_.isArray(data)) data = [data];
	return action(actionTypes, 'ADD', {data, filter});
}

function actionAddUnreceivedKeys(actionTypes, keys) {
	if (!_.isArray(keys)) keys = [keys];
	return action(actionTypes, 'ADD_UNRECEIVED', {keys});
}

/**
 *
 * @param {Object} actionTypes
 * @param {Object} filter
 * @param {Array?} order
 * @param {Number?} count
 * @param {Number} start
 * @param {Array} data
 * @param {string?} changedOn
 * @param {Number?} limit limitation for loading data
 * @returns
 */
function actionAddIndex(
	actionTypes,
	filter,
	order,
	count,
	start,
	data,
	changedOn,
	limit //optional
) {
	return action(actionTypes, 'INDEX.ADD', {
		filter,
		order,
		count,
		start,
		data,
		changedOn,
		...(limit && {limit: limit}),
	});
}
/**
 * Useful for invalidate data before refresh indexes
 */
function actionClearIndex(actionTypes, filter, order) {
	return action(actionTypes, 'INDEX.CLEAR_INDEX', {filter, order});
}

const actionMarkAsDeleted = (actionTypes, key, date) => {
	return action(actionTypes, 'MARK_DELETED', {key, date});
};

function actionClearIndexes(actionTypes) {
	return action(actionTypes, 'INDEX.CLEAR_ALL');
}

// eslint-disable-next-line no-unused-vars
function actionDelete(actionTypes, keys) {
	return action(actionTypes, 'DELETE', {keys});
}

function actionSetActiveKey(actionTypes, key) {
	return action(actionTypes, 'SET_ACTIVE_KEY', {key});
}

function actionSetActiveKeys(actionTypes, keys) {
	return action(actionTypes, 'SET_ACTIVE_KEYS', {keys});
}

// eslint-disable-next-line no-unused-vars
function actionRemoveEdited(actionTypes, keys) {
	return action(actionTypes, 'EDITED.REMOVE', {keys});
}

function actionUpdateEdited(actionTypes, data) {
	return action(actionTypes, 'EDITED.UPDATE', {data});
}

function actionRemovePropertyFromEdited(actionTypes, key, property) {
	return action(actionTypes, 'EDITED.REMOVE_PROPERTY', {key, property});
}

function actionUseIndexedRegister(
	actionTypes,
	componentId,
	filterByActive,
	filter,
	order,
	start,
	length
) {
	return action(actionTypes, 'USE.INDEXED.REGISTER', {
		componentId,
		filterByActive,
		filter,
		order,
		start,
		length,
	});
}

function actionUseIndexedClear(actionTypes, componentId) {
	return action(actionTypes, 'USE.INDEXED.CLEAR', {componentId});
}

function actionUseIndexedClearAll(actionTypes) {
	return action(actionTypes, 'USE.INDEXED.CLEAR_ALL');
}

function actionUpdateStore(actionTypes, data) {
	return action(actionTypes, 'UPDATE_STORE', data);
}

function actionUseKeysClear(actionTypes, componentId) {
	return action(actionTypes, 'USE.KEYS.CLEAR', {componentId});
}

function actionUseKeysRegister(actionTypes, componentId, keys) {
	return action(actionTypes, 'USE.KEYS.REGISTER', {componentId, keys});
}

// ============ utilities ===========
const getAPIPath = (categoryPath = DEFAULT_CATEGORY_PATH, dataType) => {
	return path.join('rest', categoryPath, 'filtered', dataType);
};

const getCreatePayload = (datatype, key = utils.uuid(), applicationKey) => {
	const payload = {
		key,
		nodeType: datatype,
	};

	if (applicationKey) {
		payload.applicationKey = applicationKey;
	}

	return [payload];
};

// ============ export ===========

export default {
	action,
	actionDataSetOutdated,
	actionGeneralError,
	actionSetActiveKey,
	add: creator(actionAdd),
	addIndex: creator(actionAddIndex),
	apiUpdate,
	clearIndex: creator(actionClearIndex),
	create,
	creator,
	delete: deleteItem,
	ensure: ensureKeys,
	ensureIndexed,
	ensureIndexesWithFilterByActive,
	ensureKeys,
	loadIndexedPage,
	loadKeysPage,
	loadKey,
	receiveIndexed,
	receiveKeys,
	receiveUpdated,
	refreshUses,
	removePropertyFromEdited,
	request: requestWrapper,
	saveEdited,
	setActiveKey: creator(actionSetActiveKey),
	setActiveKeys: creator(actionSetActiveKeys),
	updateEdited,
	updateStore,
	updateSubstateFromView,
	useIndexed,
	useIndexedClear: creator(actionUseIndexedClear),
	useIndexedClearAll: creator(actionUseIndexedClearAll),
	useIndexedRegister: creator(actionUseIndexedRegister),
	useKeys,
	useKeysClear: creator(actionUseKeysClear),
};
