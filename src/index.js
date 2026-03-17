import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {reduxBatch} from '@manaflair/redux-batch';
import {
	setState as setRecomputeState,
	createSelector as createRecomputeSelector,
	createObserver as createRecomputeObserver,
} from '@jvitela/recompute';
import {connect, Provider, ReactReduxContext} from 'react-redux';

import connects from './components/connects';
import MountWrapper from './components/MountWrapper';

import {setFetch} from './state/_common/request';

import commonActionTypes from './constants/ActionTypes';
import Action from './state/Action';
import Select from './state/Select';

import commonActions from './state/_common/actions';
import commonHelpers from './state/_common/helpers';
import commonReducers, {DEFAULT_INITIAL_STATE} from './state/_common/reducers';
import commonSelectors from './state/_common/selectors';
import {recomputeSelectorOptions} from './state/_common/recomputeHelpers';

import activeMetadataActions from './state/_activeMetadata/actions';
import {STORES_TO_ENSURE_WITH_FILTER_BY_ACTIVE} from './state/_activeMetadata/constants';

import appReducers, {
	INITIAL_STATE as appInitialState,
} from './state/App/reducers';
import areasReducers, {
	INITIAL_STATE as areasInitialState,
} from './state/Areas/reducers';
import areaRelationsReducers, {
	INITIAL_STATE as areaRelationsInitialState,
} from './state/AreaRelations/reducers';
import attributesReducers, {
	INITIAL_STATE as attributesInitialState,
} from './state/Attributes/reducers';
import attributeSetsReducers, {
	INITIAL_STATE as attributeSetsInitialState,
} from './state/AttributeSets/reducers';
import casesReducers, {
	INITIAL_STATE as casesInitialState,
} from './state/Cases/reducers';
import componentsReducers, {
	INITIAL_STATE as componentsInitialState,
} from './state/Components/reducers';
import dataReducers, {
	INITIAL_STATE as dataInitialState,
} from './state/Data/reducers';
import layerTemplatesReducers, {
	INITIAL_STATE as layerTemplatesInitialState,
} from './state/LayerTemplates/reducers';
import layerTreesReducers, {
	INITIAL_STATE as layerTreesInitialState,
} from './state/LayerTrees/reducers';
import mapsReducers, {
	INITIAL_STATE as mapsInitialState,
} from './state/Maps/reducers';
import periodsReducers, {
	INITIAL_STATE as periodsInitialState,
} from './state/Periods/reducers';
import placesReducers, {
	INITIAL_STATE as placesInitialState,
} from './state/Places/reducers';
import scenariosReducers, {
	INITIAL_STATE as scenariosInitialState,
} from './state/Scenarios/reducers';
import scopesReducers, {
	INITIAL_STATE as scopesInitialState,
} from './state/Scopes/reducers';
import screensReducers, {
	INITIAL_STATE as screensInitialState,
} from './state/Screens/reducers';
import selectionsReducers, {
	INITIAL_STATE as selectionsInitialState,
} from './state/Selections/reducers';
import stylesReducers, {
	INITIAL_STATE as stylesInitialState,
} from './state/Styles/reducers';
import tagsReducers, {
	INITIAL_STATE as tagsInitialState,
} from './state/Tags/reducers';
import usersReducers, {
	INITIAL_STATE as usersInitialState,
} from './state/Users/reducers';
import viewsReducers, {
	INITIAL_STATE as viewsInitialState,
} from './state/Views/reducers';
import windowsReducers, {
	INITIAL_STATE as windowsInitialState,
} from './state/Windows/reducers';

const baseStores = {
	app: appReducers,
	areas: areasReducers,
	areaRelations: areaRelationsReducers,
	attributes: attributesReducers,
	attributeSets: attributeSetsReducers,
	cases: casesReducers,
	components: componentsReducers,
	data: dataReducers,
	layerTemplates: layerTemplatesReducers,
	layerTrees: layerTreesReducers,
	maps: mapsReducers,
	periods: periodsReducers,
	places: placesReducers,
	scenarios: scenariosReducers,
	scopes: scopesReducers,
	screens: screensReducers,
	selections: selectionsReducers,
	styles: stylesReducers,
	tags: tagsReducers,
	users: usersReducers,
	views: viewsReducers,
	windows: windowsReducers,
};

const initialStates = {
	app: appInitialState,
	areas: areasInitialState,
	areaRelations: areaRelationsInitialState,
	attributes: attributesInitialState,
	attributeSets: attributeSetsInitialState,
	cases: casesInitialState,
	components: componentsInitialState,
	data: dataInitialState,
	layerTemplates: layerTemplatesInitialState,
	layerTrees: layerTreesInitialState,
	maps: mapsInitialState,
	periods: periodsInitialState,
	places: placesInitialState,
	scenarios: scenariosInitialState,
	scopes: scopesInitialState,
	screens: screensInitialState,
	selections: selectionsInitialState,
	styles: stylesInitialState,
	tags: tagsInitialState,
	users: usersInitialState,
	views: viewsInitialState,
	windows: windowsInitialState,
};

/**
 * Helper function for creating redux store.
 * @param {Object} specificStores Object with speficic store/stores. Stores will by available in state under "specific" key.
 * @param {Array} rootStores Array of redux stores
 * @param {Array} middleware Array of redux middlewares.
 * @param {Object?} preloadedState Optional object used for store initialization as a default state.
 * @returns {Object} redux store instance
 */
const createBaseStore = (
	specificStores,
	rootStores = [],
	middleware = [],
	preloadedState
) => {
	const enhancedThunk = thunk.withExtraArgument(activeMetadataActions);

	let appliedMiddleware = applyMiddleware(enhancedThunk, ...middleware);
	if (process.env.NODE_ENV === 'development') {
		appliedMiddleware = applyMiddleware(enhancedThunk, logger, ...middleware);
	}
	let stores = specificStores
		? {...baseStores, ...rootStores, specific: combineReducers(specificStores)}
		: {...baseStores, ...rootStores};
	if (preloadedState) {
		return createStore(
			combineReducers(stores),
			preloadedState,
			compose(reduxBatch, appliedMiddleware, reduxBatch)
		);
	} else {
		return createStore(
			combineReducers(stores),
			compose(reduxBatch, appliedMiddleware, reduxBatch)
		);
	}
};

export {
	createStore,
	combineReducers,
	applyMiddleware,
	compose,
	connect,
	initialStates,
	Provider,
	ReactReduxContext,
	MountWrapper,
	baseStores,
	createBaseStore,
	connects,
	commonActionTypes,
	Action,
	Select,
	commonActions,
	commonHelpers,
	commonReducers,
	commonSelectors,
	DEFAULT_INITIAL_STATE,
	activeMetadataActions,
	STORES_TO_ENSURE_WITH_FILTER_BY_ACTIVE,
	thunk,
	logger,
	reduxBatch,
	createRecomputeObserver,
	createRecomputeSelector,
	recomputeSelectorOptions,
	setRecomputeState,
	setFetch,
};

// TODO remove?
export default {
	commonActionTypes,
	Action,
	Select,

	commonActions,
	commonHelpers,
	commonReducers,
	commonSelectors,

	initialStates,
	DEFAULT_INITIAL_STATE,
	setFetch,
};
