import ActionTypes from '../../constants/ActionTypes';
import {map as _map} from 'lodash';

import request from '../_common/request';

import common from '../_common/actions';
import Select from '../Select';

import ScopesAction from '../Scopes/actions';
import PlacesAction from '../Places/actions';
import PeriodsAction from '../Periods/actions';
import TagsAction from '../Tags/actions';
import CasesAction from '../Cases/actions';

const TTL = 5;

export const userDataType = 'users';
export const groupDataType = 'groups';
export const dataType = 'users';
export const beCategoryPath = 'be-metadata';

// ============ creators ===========

const add = common.add(ActionTypes.USERS);
const create = common.create(
	Select.users.getSubstate,
	userDataType,
	ActionTypes.USERS,
	beCategoryPath
);
const deleteItem = common.delete(
	Select.users.getSubstate,
	userDataType,
	ActionTypes.USERS,
	beCategoryPath
);
const saveEdited = common.saveEdited(
	Select.users.getSubstate,
	userDataType,
	ActionTypes.USERS,
	beCategoryPath
);
const updateEdited = common.updateEdited(
	Select.users.getSubstate,
	ActionTypes.USERS
);
const setActiveKey = common.setActiveKey(ActionTypes.USERS);
const refreshUses = () => dispatch => {
	dispatch(
		common.refreshUses(
			Select.users.getSubstate,
			userDataType,
			ActionTypes.USERS,
			beCategoryPath
		)()
	);
	dispatch(
		common.refreshUses(
			Select.users.getGroupsSubstate,
			groupDataType,
			ActionTypes.USERS.GROUPS,
			beCategoryPath
		)()
	);
};
const useKeys = common.useKeys(
	Select.users.getSubstate,
	userDataType,
	ActionTypes.USERS,
	beCategoryPath
);
const useKeysClear = common.useKeysClear(ActionTypes.USERS);
const useIndexedUsers = common.useIndexed(
	Select.users.getSubstate,
	userDataType,
	ActionTypes.USERS,
	beCategoryPath
);
const useIndexedGroups = common.useIndexed(
	Select.users.getGroupsSubstate,
	groupDataType,
	ActionTypes.USERS.GROUPS,
	beCategoryPath
);

function onLogin() {
	return dispatch => {
		dispatch(common.actionDataSetOutdated());
		dispatch(apiLoadCurrentUser());

		dispatch(ScopesAction.refreshUses());
		dispatch(PlacesAction.refreshUses());
		dispatch(PeriodsAction.refreshUses());
		dispatch(refreshUses());
	};
}

function onLogout() {
	return dispatch => {
		dispatch(actionLogout());
		dispatch(setActiveKey(null));

		dispatch(CasesAction.refreshUses());
		dispatch(ScopesAction.refreshUses());
		dispatch(PlacesAction.refreshUses());
		dispatch(PeriodsAction.refreshUses());
		dispatch(TagsAction.refreshUses());
		dispatch(refreshUses());
	};
}

/**
 *
 * @param {string} email
 * @param {string} password
 * @param {Boolean} cookies If true, BE will set cookies
 * @returns
 */
function apiLoginUser(email, password, cookies = false) {
	return (dispatch, getState) => {
		const localConfig = Select.app.getCompleteLocalConfiguration(getState());
		dispatch(actionApiLoginRequest());

		let payload = {
			username: email,
			password: password,
			cookies,
			development: process.env.NODE_ENV === 'development', //if true, BE will set proper cookies even for development localhost
		};

		return request(localConfig, 'api/login/login', 'POST', null, payload)
			.then(result => {
				if (result.status === 200) {
					dispatch(onLogin());
					return result;
				}
			})
			.catch(error => {
				dispatch(common.actionGeneralError(error));
				return error;
			});
	};
}

// function apiLoad(ttl) {
// 	if (_.isUndefined(ttl)) ttl = TTL;
// 	return (dispatch, getState) => {
// 		let state = getState();
// 		if (state.users.loading) {
// 			// already loading, do nothing
// 		} else {
// 			dispatch(actionApiLoadRequest());
//
// 			let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/user');
//
// 			return fetch(url, {
// 				method: 'GET',
// 				credentials: 'include',
// 				headers: {
// 					'Content-Type': 'application/json',
// 					'Accept': 'application/json'
// 				}
// 			}).then(
// 				response => {
// 					let contentType = response.headers.get('Content-type');
// 					if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
// 						return response.json().then(data => {
// 							Promise.all(data.data.map(user => {
// 								return new User({data: user}).then(user => {
// 									user.key = user.id;
// 									return user;
// 								});
// 							})).then(users => {
// 								dispatch(actionAdd(users));
// 							});
// 						});
// 					} else {
// 						dispatch(actionApiLoadRequestError('scopes#action Problem with loading scopes.'));
// 					}
// 				},
// 				error => {
// 					if (ttl - 1) {
// 						dispatch(apiLoad(ttl - 1));
// 					} else {
// 						dispatch(actionApiLoadRequestError('scopes#action Problem with loading scopes.'));
// 					}
// 				}
// 			);
// 		}
// 	};
// }

function apiLoadCurrentUser() {
	return (dispatch, getState) => {
		const localConfig = Select.app.getCompleteLocalConfiguration(getState());
		dispatch(actionApiLoadCurrentUserRequest());

		return request(localConfig, 'rest/user/current', 'GET', null, null)
			.then(result => {
				if (result.errors) {
					//todo how do we return errors here?
					throw new Error(result.errors);
				} else {
					if (result.key === 0) {
						// no logged in user = guest
						dispatch(actionAddGroups(transformGroups(result.groups)));
					} else if (result.key) {
						// logged in user
						dispatch(setActiveKey(result.key));
						dispatch(add(transformUser(result)));
						dispatch(actionAddGroups(transformGroups(result.groups)));
					}
				}
			})
			.catch(error => {
				dispatch(common.actionGeneralError(error));
				return error;
			});
	};
}

function apiLogoutUser(ttl = TTL) {
	return (dispatch, getState) => {
		dispatch(actionApiLogoutRequest());

		const localConfig = Select.app.getCompleteLocalConfiguration(getState());

		let payload = {
			development: process.env.NODE_ENV === 'development',
		};

		return request(
			localConfig,
			'api/login/logout',
			'POST',
			null,
			payload,
			null,
			null
		).then(
			response => {
				console.log('#### logout user response', response);
				if (response.status === 200) {
					// window.location.reload();
					dispatch(onLogout());
				} else {
					dispatch(
						actionApiLogoutRequestError(
							'user#action logout Problem with logging out the User, please try later.'
						)
					);
				}
			},
			error => {
				console.log('#### logout user error', error);
				if (ttl - 1) {
					dispatch(apiLogoutUser(ttl - 1));
				} else {
					dispatch(
						actionApiLogoutRequestError(
							'user#action logout Problem with logging out the User, please try later.'
						)
					);
				}
			}
		);
	};
}

// ============ helpers ===========

function transformUser(user) {
	return {
		...user,
		//TODO remove -> workaround with permissions.guest.get
		permissions: {...user.permissions, guest: {get: false}},
		groups: _map(user.groups, 'key'),
	};
}
//TODO remove -> workaround with permissions.guest.get
function transformGroups(groups) {
	return groups.map(group => ({...group, permissions: {guest: {get: false}}}));
}

// ============ actions ===========

function actionClearUsersUseIndexed(componentId) {
	return {
		type: ActionTypes.USERS.USE.INDEXED.CLEAR,
		componentId,
	};
}

function actionClearGroupsUseIndexed(componentId) {
	return {
		type: ActionTypes.USERS.GROUPS.USE.INDEXED.CLEAR,
		componentId,
	};
}

function actionAddGroups(groups) {
	return {
		type: ActionTypes.USERS.GROUPS.ADD,
		data: groups,
	};
}

function actionApiLogoutRequest() {
	return {
		type: ActionTypes.USERS.LOGOUT_REQUEST,
	};
}

function actionApiLogoutRequestError(error) {
	return {
		type: ActionTypes.USERS.LOGOUT_REQUEST_ERROR,
		error: error,
	};
}

// eslint-disable-next-line no-unused-vars
function actionApiLoadRequest() {
	return {
		type: ActionTypes.USERS.LOAD_REQUEST,
	};
}

// eslint-disable-next-line no-unused-vars
function actionApiLoadRequestError(error) {
	return {
		type: ActionTypes.USERS.LOAD_REQUEST_ERROR,
		error: error,
	};
}

function actionApiLoginRequest() {
	return {
		type: ActionTypes.USERS.LOGIN.REQUEST,
	};
}

function actionApiLoadCurrentUserRequest() {
	return {
		type: ActionTypes.USERS.CURRENT.REQUEST,
	};
}

function actionLogout() {
	return {
		type: ActionTypes.COMMON.DATA.CLEANUP_ON_LOGOUT,
	};
}

// ============ export ===========

export default {
	add,
	create,
	delete: deleteItem,
	saveEdited,
	updateEdited,
	// apiLoad: apiLoad,
	apiLoadCurrentUser: apiLoadCurrentUser,
	apiLoginUser: apiLoginUser,
	apiLogoutUser: apiLogoutUser,
	refreshUses,
	setActiveKey,
	useKeys,
	useKeysClear,
	useIndexedUsers,
	useIndexedGroups,
	useIndexedUsersClear: actionClearUsersUseIndexed,
	useIndexedGroupsClear: actionClearGroupsUseIndexed,
};
