import {assert} from 'chai';
import slash from 'slash';
import actions from '../../../../src/state/Data/actions';
import {resetFetch, setFetch} from '../../../../src/state/_common/request';
import getStoreSet from '../../../store';

import {
	responseWithSpatialAndAttributeData,
	responseWithRelationsSpatialAndAttributeData,
} from './mockData/mockData';

describe('state/Data/actions/loadIndexedPage', function () {
	afterEach(function () {
		resetFetch();
	});

	it('dispatch nothing', function () {
		const storeHelpers = getStoreSet();

		const getState = () => ({
			app: {
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: 'backend',
					requestPageSize: 1,
				},
				data: {
					spatialData: {
						indexes: [],
					},
					attributeData: {
						indexes: [],
					},
				},
			},
		});

		const dispatch = storeHelpers.getDispatch(getState);

		setFetch(function (url, options) {
			assert.strictEqual('http://localhost/rest/data/filtered', slash(url));

			return Promise.resolve({
				ok: true,
				json: function () {
					return Promise.resolve({});
				},
				headers: {
					get: function (name) {
						return {'Content-type': 'application/json'}[name];
					},
				},
				data: options.body,
			});
		});

		const styleKey = null;
		const relations = null;
		const spatialIndex = null;
		const spatialFilter = null;
		const loadGeometry = null;
		const loadAttributeRelations = false;
		const loadSpatialRelations = false;
		const loadAreaRelations = false;
		const order = null;
		const spatialRelationsFilter = null;
		const attributeRelationsFilter = null;
		const attributeDataFilter = null;
		dispatch(
			actions.loadIndexedPage(
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
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{type: 'ERROR'},
			]);
		});
	});

	it('request and proceed spatial and attribute data for one tile', function () {
		const storeHelpers = getStoreSet();
		const getState = () => ({
			app: {
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: 'backend',
				},
			},
			data: {
				attributeData: {
					indexes: [],
				},
				spatialData: {
					indexes: [],
				},
			},
		});

		const dispatch = storeHelpers.getDispatch(getState);

		setFetch(function (url, options) {
			assert.strictEqual('http://localhost/rest/data/filtered', slash(url));
			assert.deepStrictEqual(options, {
				body: JSON.stringify({
					layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
					relations: {
						offset: 0,
						limit: 100,
						attribute: false,
						spatial: false,
						area: false,
					},
					data: {
						spatialFilter: {
							tiles: [[1.40625, 49.21875]],
							level: 7,
						},
						geometry: true,
					},
				}),
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
			});

			return Promise.resolve({
				ok: true,
				json: function () {
					responseWithRelationsSpatialAndAttributeData;

					return Promise.resolve(responseWithSpatialAndAttributeData);
				},
				headers: {
					get: function (name) {
						return {'Content-type': 'application/json'}[name];
					},
				},
				data: options.body,
			});
		});

		const styleKey = null;
		const relations = null;
		const spatialIndex = null;
		const spatialFilter = {
			tiles: [[1.40625, 49.21875]],
			level: 7,
		};
		const loadGeometry = true;
		const loadAttributeRelations = false;
		const loadSpatialRelations = false;
		const loadAreaRelations = false;
		const order = null;
		const spatialRelationsFilter = {
			layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
		};
		const attributeRelationsFilter = null;
		const attributeDataFilter = null;
		dispatch(
			actions.loadIndexedPage(
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
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{
					type: 'DATA.SPATIAL_DATA.INDEX.ADD',
					changedOn: null,
					indexData: [
						{
							7: {
								'1.40625,49.21875': true,
							},
						},
					],
					order: null,
					filter: {
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
					},
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.SPATIAL_INDEX.ADD',
					changedOn: null,
					filter: null,
					indexData: [
						{
							7: {
								'1.40625,49.21875': true,
							},
						},
					],
					order: null,
				},
				{
					attributeDataSourceKey: '55f48ed1-ee67-47bd-a044-8985662ec29f',
					changedOn: null,
					data: {
						18502: '27',
					},
					filter: null,
					indexData: [
						{
							7: {
								'1.40625,49.21875': {
									'55f48ed1-ee67-47bd-a044-8985662ec29f': [18502],
								},
							},
						},
					],
					order: null,
					type: 'DATA.ATTRIBUTE_DATA.ADD_WITH_SPATIAL_INDEX',
				},
				{
					changedOn: null,
					dataByDataSourceKey: {
						'848e2559-936d-4262-a808-4c87aa60217d': {},
						'85e35be5-1706-402a-86ad-851397bae7aa': {
							18502: {
								type: 'MultiPolygon',
								coordinates: [
									[
										[
											[2.50647283, 50.63433838],
											[2.5012393, 50.63986206],
											[2.50829029, 50.64472198],
											[2.50647283, 50.63433838],
										],
									],
								],
							},
						},
					},
					indexData: [
						{
							7: {
								'1.40625,49.21875': {
									'848e2559-936d-4262-a808-4c87aa60217d': [],
									'85e35be5-1706-402a-86ad-851397bae7aa': [18502],
								},
							},
						},
					],
					level: '7',
					order: null,
					filter: {
						layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
					},
					type: 'DATA.SPATIAL_DATA.ADD_WITH_TILED_INDEX',
				},
			]);
		});
	});

	it('request and proceed relations, spatial and attribute data for one tile', function () {
		const storeHelpers = getStoreSet();
		const getState = () => ({
			app: {
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: 'backend',
				},
			},
			data: {
				attributeData: {
					indexes: [],
				},
				spatialData: {
					indexes: [],
				},
			},
		});

		setFetch(function (url, options) {
			assert.strictEqual('http://localhost/rest/data/filtered', slash(url));
			assert.deepStrictEqual(options, {
				body: JSON.stringify({
					modifiers: {
						scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
						placeKey: {
							in: [
								'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
								'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
							],
						},
						caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
						periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
					},
					layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
					styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
					relations: {
						offset: 0,
						limit: 100,
						attribute: true,
						spatial: true,
						area: false,
					},
					data: {
						featureKeys: [18502],
						spatialFilter: {
							tiles: [[1.40625, 49.21875]],
							level: 7,
						},
						geometry: true,
					},
				}),
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
			});

			return Promise.resolve({
				ok: true,
				json: function () {
					return Promise.resolve(responseWithRelationsSpatialAndAttributeData);
				},
				headers: {
					get: function (name) {
						return {'Content-type': 'application/json'}[name];
					},
				},
				data: options.body,
			});
		});

		const dispatch = storeHelpers.getDispatch(getState);

		const modifiers = {
			scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
			placeKey: {
				in: [
					'8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
					'9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
				],
			},
			caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
			periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
		};

		const styleKey = '460372b1-4fce-4676-92be-b1656a5415f5';
		const relations = null;
		const spatialIndex = null;
		const spatialFilter = {
			tiles: [[1.40625, 49.21875]],
			level: 7,
		};
		const loadGeometry = true;
		const loadAttributeRelations = true;
		const loadSpatialRelations = true;
		const loadAreaRelations = false;
		const order = null;
		const layerTemplateKey = '11c7cc1b-9834-4e85-aba6-eab5571705e4';
		const spatialRelationsFilter = {
			layerTemplateKey: layerTemplateKey,
			modifiers: modifiers,
		};
		const attributeRelationsFilter = {
			...spatialRelationsFilter,
			styleKey,
		};
		const attributeDataFilter = {
			...attributeRelationsFilter,
			featureKeys: [18502],
		};
		dispatch(
			actions.loadIndexedPage(
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
		);

		const _attributeDataFilter = {
			layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
			modifiers: modifiers,
			styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
			featureKeys: [18502],
		};
		const _attributeDataRelationsFilter = {
			layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
			modifiers: modifiers,
			styleKey: '460372b1-4fce-4676-92be-b1656a5415f5',
		};

		const _spatialFilter = {
			layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
			modifiers: modifiers,
		};

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{
					type: 'DATA.SPATIAL_DATA.INDEX.ADD',
					//FIXME remane spatialFilter to filter
					filter: _spatialFilter,
					order: null,
					indexData: [
						{
							7: {
								'1.40625,49.21875': true,
							},
						},
					],
					changedOn: null,
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.SPATIAL_INDEX.ADD',
					filter: _attributeDataFilter,
					order: null,
					indexData: [
						{
							7: {
								'1.40625,49.21875': true,
							},
						},
					],
					changedOn: null,
				},
				{
					data: [
						{
							key: '530c6982-af2a-4c2a-8fad-69c07f7d76e7',
							data: {
								scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
								periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
								placeKey: '8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
								attributeDataSourceKey: '55f48ed1-ee67-47bd-a044-8985662ec29f',
								layerTemplateKey: '758b72dd-76a8-4792-8e9f-bbf13784e992',
								scenarioKey: null,
								caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
								attributeSetKey: null,
								attributeKey: '528ac373-b82f-44cb-a883-4f3ef5b13d07',
								areaTreeLevelKey: null,
								applicationKey: null,
							},
						},
					],
					filter: _attributeDataRelationsFilter,
					type: 'DATA.ATTRIBUTE_RELATIONS.ADD',
				},
				{
					filter: _attributeDataRelationsFilter,
					order: null,
					count: 1,
					start: 1,
					data: [
						{
							key: '530c6982-af2a-4c2a-8fad-69c07f7d76e7',
							data: {
								scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
								periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
								placeKey: '8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
								attributeDataSourceKey: '55f48ed1-ee67-47bd-a044-8985662ec29f',
								layerTemplateKey: '758b72dd-76a8-4792-8e9f-bbf13784e992',
								scenarioKey: null,
								caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
								attributeSetKey: null,
								attributeKey: '528ac373-b82f-44cb-a883-4f3ef5b13d07',
								areaTreeLevelKey: null,
								applicationKey: null,
							},
						},
					],
					changedOn: null,
					type: 'DATA.ATTRIBUTE_RELATIONS.INDEX.ADD',
				},
				{
					data: [
						{
							key: '55f48ed1-ee67-47bd-a044-8985662ec29f',
							data: {
								nameInternal: 'gadm36_fra_4#num4',
								attribution: null,
								tableName: 'gadm36_FRA_4',
								columnName: 'num4',
								fidColumnName: 'ogc_fid',
							},
						},
					],
					filter: _attributeDataRelationsFilter,
					type: 'DATA.ATTRIBUTE_DATA_SOURCES.ADD',
				},
				{
					filter: _attributeDataRelationsFilter,
					order: null,
					count: 1,
					start: 1,
					data: [
						{
							key: '55f48ed1-ee67-47bd-a044-8985662ec29f',
							data: {
								nameInternal: 'gadm36_fra_4#num4',
								attribution: null,
								tableName: 'gadm36_FRA_4',
								columnName: 'num4',
								fidColumnName: 'ogc_fid',
							},
						},
					],
					changedOn: null,
					type: 'DATA.ATTRIBUTE_DATA_SOURCES.INDEX.ADD',
				},
				{
					type: 'DATA.ATTRIBUTE_DATA.ADD_WITH_SPATIAL_INDEX',
					attributeDataSourceKey: '55f48ed1-ee67-47bd-a044-8985662ec29f',
					data: {
						18502: '27',
					},
					filter: _attributeDataFilter,
					order: null,
					indexData: [
						{
							7: {
								'1.40625,49.21875': {
									'55f48ed1-ee67-47bd-a044-8985662ec29f': [18502],
								},
							},
						},
					],
					changedOn: null,
				},
				{
					data: [
						{
							key: '5d35a80c-e4bc-4054-9b04-7ae9829198ee',
							data: {
								scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
								periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
								placeKey: '8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
								spatialDataSourceKey: '85e35be5-1706-402a-86ad-851397bae7aa',
								layerTemplateKey: '758b72dd-76a8-4792-8e9f-bbf13784e992',
								scenarioKey: null,
								caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
								applicationKey: null,
							},
						},
						{
							key: '8b0e266c-40d4-4bfe-ad75-964d9af1f57f',
							data: {
								scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
								periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
								placeKey: '9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								spatialDataSourceKey: '848e2559-936d-4262-a808-4c87aa60217d',
								layerTemplateKey: '758b72dd-76a8-4792-8e9f-bbf13784e992',
								scenarioKey: null,
								caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
								applicationKey: null,
							},
						},
					],
					filter: _spatialFilter,
					type: 'DATA.SPATIAL_RELATIONS.ADD',
				},
				{
					filter: _spatialFilter,
					order: null,
					count: 2,
					start: 1,
					data: [
						{
							key: '5d35a80c-e4bc-4054-9b04-7ae9829198ee',
							data: {
								scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
								periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
								placeKey: '8b65f2c9-bd6a-4d92-bc09-af604761f2f1',
								spatialDataSourceKey: '85e35be5-1706-402a-86ad-851397bae7aa',
								layerTemplateKey: '758b72dd-76a8-4792-8e9f-bbf13784e992',
								scenarioKey: null,
								caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
								applicationKey: null,
							},
						},
						{
							key: '8b0e266c-40d4-4bfe-ad75-964d9af1f57f',
							data: {
								scopeKey: 'c81d59c8-0b4c-4df3-9c20-375f977660d3',
								periodKey: '439af632-5804-4fc0-b641-a9c34cc6a853',
								placeKey: '9e28f519-dc30-4ebb-bcc8-97f696d9cf2a',
								spatialDataSourceKey: '848e2559-936d-4262-a808-4c87aa60217d',
								layerTemplateKey: '758b72dd-76a8-4792-8e9f-bbf13784e992',
								scenarioKey: null,
								caseKey: '4c2afea6-0964-458e-88a7-a65318554487',
								applicationKey: null,
							},
						},
					],
					changedOn: null,
					type: 'DATA.SPATIAL_RELATIONS.INDEX.ADD',
				},
				{
					data: [
						{
							key: '85e35be5-1706-402a-86ad-851397bae7aa',
							data: {
								nameInternal: 'gadm36_fra_4',
								attribution: null,
								type: 'tiledVector',
								layerName: null,
								tableName: 'gadm36_FRA_4',
								fidColumnName: 'ogc_fid',
								geometryColumnName: 'geom',
							},
						},
						{
							key: '848e2559-936d-4262-a808-4c87aa60217d',
							data: {
								nameInternal: 'gadm36_deu_4',
								attribution: null,
								type: 'tiledVector',
								layerName: null,
								tableName: 'gadm36_DEU_4',
								fidColumnName: 'ogc_fid',
								geometryColumnName: 'geom',
							},
						},
					],
					filter: _spatialFilter,
					type: 'DATA.SPATIAL_DATA_SOURCES.ADD',
				},
				{
					filter: _spatialFilter,
					order: null,
					count: 2,
					start: 1,
					data: [
						{
							key: '85e35be5-1706-402a-86ad-851397bae7aa',
							data: {
								nameInternal: 'gadm36_fra_4',
								attribution: null,
								type: 'tiledVector',
								layerName: null,
								tableName: 'gadm36_FRA_4',
								fidColumnName: 'ogc_fid',
								geometryColumnName: 'geom',
							},
						},
						{
							key: '848e2559-936d-4262-a808-4c87aa60217d',
							data: {
								nameInternal: 'gadm36_deu_4',
								attribution: null,
								type: 'tiledVector',
								layerName: null,
								tableName: 'gadm36_DEU_4',
								fidColumnName: 'ogc_fid',
								geometryColumnName: 'geom',
							},
						},
					],
					changedOn: null,
					type: 'DATA.SPATIAL_DATA_SOURCES.INDEX.ADD',
				},
				{
					type: 'DATA.SPATIAL_DATA.ADD_WITH_TILED_INDEX',
					dataByDataSourceKey: {
						'85e35be5-1706-402a-86ad-851397bae7aa': {
							18502: {
								type: 'MultiPolygon',
								coordinates: [
									[
										[
											[2.50647283, 50.63433838],
											[2.5012393, 50.63986206],
											[2.50829029, 50.64472198],
											[2.50647283, 50.63433838],
										],
									],
								],
							},
						},
						'848e2559-936d-4262-a808-4c87aa60217d': {},
					},
					level: '7',
					filter: _spatialFilter,
					order: null,
					indexData: [
						{
							7: {
								'1.40625,49.21875': {
									'85e35be5-1706-402a-86ad-851397bae7aa': [18502],
									'848e2559-936d-4262-a808-4c87aa60217d': [],
								},
							},
						},
					],
					changedOn: null,
				},
			]);
		});
	});

	it('request and proceed attribute data for one tile', function () {
		const storeHelpers = getStoreSet();
		const getState = () => ({
			app: {
				localConfiguration: {
					apiBackendProtocol: 'http',
					apiBackendHost: 'localhost',
					apiBackendPath: 'backend',
				},
			},
			data: {
				attributeData: {
					indexes: [],
				},
				spatialData: {
					indexes: [],
				},
			},
		});

		setFetch(function (url, options) {
			assert.strictEqual('http://localhost/rest/data/filtered', slash(url));
			assert.deepStrictEqual(options, {
				body: JSON.stringify({
					layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
					relations: {
						offset: 0,
						limit: 100,
						attribute: false,
						spatial: false,
						area: false,
					},
					data: {
						spatialFilter: {
							tiles: [[1.40625, 49.21875]],
							level: 7,
						},
						geometry: false,
					},
				}),
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
			});

			return Promise.resolve({
				ok: true,
				json: function () {
					responseWithRelationsSpatialAndAttributeData;

					return Promise.resolve(responseWithSpatialAndAttributeData);
				},
				headers: {
					get: function (name) {
						return {'Content-type': 'application/json'}[name];
					},
				},
				data: options.body,
			});
		});

		const dispatch = storeHelpers.getDispatch(getState);

		const styleKey = null;
		const relations = null;
		const spatialIndex = null;
		const spatialFilter = {
			tiles: [[1.40625, 49.21875]],
			level: 7,
		};
		const loadGeometry = false;
		const loadAttributeRelations = false;
		const loadSpatialRelations = false;
		const loadAreaRelations = false;
		const order = null;
		const spatialRelationsFilter = {
			layerTemplateKey: '11c7cc1b-9834-4e85-aba6-eab5571705e4',
		};
		const attributeRelationsFilter = null;
		const attributeDataFilter = null;
		dispatch(
			actions.loadIndexedPage(
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
		);

		return storeHelpers.runFunctionActions({dispatch, getState}).then(() => {
			assert.deepStrictEqual(storeHelpers.getDispatchedActions(), [
				{
					type: 'DATA.ATTRIBUTE_DATA.SPATIAL_INDEX.ADD',
					changedOn: null,
					filter: null,
					indexData: [
						{
							7: {
								'1.40625,49.21875': true,
							},
						},
					],
					order: null,
				},
				{
					attributeDataSourceKey: '55f48ed1-ee67-47bd-a044-8985662ec29f',
					changedOn: null,
					data: {
						18502: '27',
					},
					filter: null,
					indexData: [
						{
							7: {
								'1.40625,49.21875': {
									'55f48ed1-ee67-47bd-a044-8985662ec29f': [18502],
								},
							},
						},
					],
					order: null,
					type: 'DATA.ATTRIBUTE_DATA.ADD_WITH_SPATIAL_INDEX',
				},
			]);
		});
	});
});
