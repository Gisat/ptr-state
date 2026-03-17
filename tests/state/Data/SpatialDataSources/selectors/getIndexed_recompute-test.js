import {assert} from 'chai';
import {setState} from '@jvitela/recompute';
import selectors from '../../../../../src/state/Data/SpatialDataSources/selectors';

// FIXME temporary commented
// describe('getIndexed_recompute', function () {
// 	const state = {
// 		data: {
// 			spatialDataSources: {
// 				byKey: {
// 					dataSource1: {
// 						key: 'dataSource1',
// 						data: {
// 							type: 'vector',
// 						},
// 					},
// 					dataSource2: {
// 						key: 'dataSource2',
// 						data: {
// 							type: 'wmts',
// 						},
// 					},
// 				},
// 				indexes: [
// 					{
// 						filter: {
// 							modifiers: {
// 								scopeKey: 'scope1',
// 							},
// 						},
// 						index: {
// 							1: 'dataSource1',
// 							2: 'dataSource2',
// 						},
// 					},
// 					{
// 						filter: {
// 							modifiers: {
// 								scopeKey: 'scope2',
// 							},
// 						},
// 						index: {
// 							1: 'dataSource2',
// 						},
// 					},
// 					{
// 						filter: {
// 							modifiers: {
// 								scopeKey: 'scope3',
// 							},
// 						},
// 						index: {},
// 					},
// 				],
// 			},
// 		},
// 	};

// 	before(function () {
// 		setState(state);
// 	});

// 	it('Should select indexed data sources', function () {
// 		const filter = {
// 			modifiers: {
// 				scopeKey: 'scope1',
// 			},
// 		};

// 		const expectedResult = [
// 			{
// 				key: 'dataSource1',
// 				data: {
// 					type: 'vector',
// 				},
// 			},
// 			{
// 				key: 'dataSource2',
// 				data: {
// 					type: 'wmts',
// 				},
// 			},
// 		];

// 		assert.deepStrictEqual(
// 			selectors.getIndexed_recompute(filter),
// 			expectedResult
// 		);
// 	});

// 	it('Should return null, if no matching index', function () {
// 		const filter = {
// 			modifiers: {
// 				scopeKey: 'scope3',
// 			},
// 		};
// 		assert.isNull(selectors.getIndexed_recompute(filter));
// 	});

// 	it('Should select null, if data sources are empty', function () {
// 		setState({data: {spatialDataSources: {byKey: null}}});

// 		const filter = {
// 			modifiers: {
// 				scopeKey: 'scope1',
// 			},
// 		};
// 		assert.isNull(selectors.getIndexed_recompute(filter));
// 	});

// 	it('Should select null, if no model is indexed yet', function () {
// 		const filter = {
// 			modifiers: {
// 				scopeKey: 'scope3',
// 			},
// 		};
// 		assert.isNull(selectors.getIndexed_recompute(filter));
// 	});

// 	after(function () {
// 		setState(null);
// 	});
// });
