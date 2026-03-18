import {assert} from 'chai';
import {cloneDeep as _cloneDeep} from 'lodash';
import {createStore, combineReducers} from 'redux';
import {setState} from '@jvitela/recompute';
import actions from '../../../../src/state/Maps/actions';
import getStoreSet from '../../../store';
import MapsReducers from '../../../../src/state/Maps/reducers';
import {MapsSelectorsState as state} from '../selectors/_state';

describe('state/Maps/actions/removeMapLayersByFilter', function () {
	it('dispatch remove map layer that satisfy complete filter', function () {
		const storeHelpers = getStoreSet();
		const reducers = combineReducers({
			maps: MapsReducers,
		});

		const defaultState = {
			maps: {..._cloneDeep(state.maps)},
		};

		const store = createStore(reducers, defaultState);

		setState(store.getState());
		const getState = () => {
			return store.getState();
		};
		const dispatch = storeHelpers.getDispatch(getState, store.dispatch);

		const completeLayerFilter = {
			layerTemplateKey: 'layerTemplate1',
			styleKey: 'style1',
			metadataModifiers: {
				placeKey: 'place1',
				scenarioKeys: ['scenario1', 'scenario2'],
			},
		};

		dispatch(actions.removeMapLayersByFilter('map4', completeLayerFilter));

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{
					type: 'MAPS.MAP.LAYERS.REMOVE_LAYERS_BY_FILTER',
					mapKey: 'map4',
					filter: _cloneDeep(completeLayerFilter),
				},
			]);
		});
	});

	it('dispatch remove map layer that satisfy partialy filter', function () {
		const storeHelpers = getStoreSet();
		const reducers = combineReducers({
			maps: MapsReducers,
		});

		const defaultState = {
			maps: {..._cloneDeep(state.maps)},
		};

		const store = createStore(reducers, defaultState);

		setState(store.getState());
		const getState = () => {
			return store.getState();
		};
		const dispatch = storeHelpers.getDispatch(getState, store.dispatch);

		const completeLayerFilter = {
			layerTemplateKey: 'layerTemplate1',
		};

		dispatch(actions.removeMapLayersByFilter('map4', completeLayerFilter));

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{
					type: 'MAPS.MAP.LAYERS.REMOVE_LAYERS_BY_FILTER',
					mapKey: 'map4',
					filter: _cloneDeep(completeLayerFilter),
				},
			]);
		});
	});

	it('dispatch nothing if filter does not sutisfy any layer', function () {
		const storeHelpers = getStoreSet();
		const reducers = combineReducers({
			maps: MapsReducers,
		});

		const defaultState = {
			maps: {..._cloneDeep(state.maps)},
		};

		const store = createStore(reducers, defaultState);

		setState(store.getState());
		const getState = () => {
			return store.getState();
		};
		const dispatch = storeHelpers.getDispatch(getState, store.dispatch);

		const completeLayerFilter = {
			layerTemplateKey: 'layerTemplate1',
		};

		dispatch(actions.removeMapLayersByFilter('map4', completeLayerFilter));

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{
					filter: {layerTemplateKey: 'layerTemplate1'},
					mapKey: 'map4',
					type: 'MAPS.MAP.LAYERS.REMOVE_LAYERS_BY_FILTER',
				},
			]);
		});
	});
});
