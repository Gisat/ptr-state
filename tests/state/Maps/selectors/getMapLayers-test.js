import Select from '../../../../src/state/Select';
import {assert} from 'chai';
import {DataSelectorsState} from '../../Data/selectors/_state';
import {MapsSelectorsState_2} from './_state';
import {setState} from '@jvitela/recompute';

const state = {
	...DataSelectorsState,
	...MapsSelectorsState_2,
	styles: {byKey: {style1: {key: 'style1', data: {definition: {}}}}},
	selections: {
		byKey: {
			selection1: {
				key: 'selection1',
				data: {
					style: 'default',
					hoveredStyle: 'default',
					featureKeysFilter: {
						keys: ['feature1'],
					},
				},
			},
		},
	},
};

describe('getMapLayers', function () {
	it('should select layers defined directly', () => {
		setState(state);
		const mapKey = 'map4';
		const expectedOutput = [
			{
				key: 'layerDefinedDirectly',
				type: 'vector',
				metadataModifiers: null,
				filterByActive: null,
				options: {
					selected: {
						selection1: {
							hoveredStyle: 'default',
							keys: ['feature1'],
							style: 'default',
						},
					},
				},
			},
		];

		const output = Select.maps.getMapLayers(mapKey);
		assert.deepStrictEqual(output, expectedOutput);
		setState(null);
	});

	it('should select null, if type is not supported', () => {
		setState(state);
		const mapKey = 'map3';

		const output = Select.maps.getMapLayers(mapKey);
		assert.deepStrictEqual(output, [null]);
		setState(null);
	});

	it('should select null, if there is no layer state for given mapKey', () => {
		setState(state);
		const mapKey = 'mapXY';

		const output = Select.maps.getMapLayers(mapKey);
		assert.isNull(output);
		setState(null);
	});

	// FIXME temporary commented
	// it('should select layer controlled', () => {
	// 	setState(state);
	// 	const mapKey = 'map1';
	// 	const expectedOutput = [
	// 		{
	// 			key: 'layer1_spatialDataSource1',
	// 			layerKey: 'layer1',
	// 			name: undefined,
	// 			opacity: 1,
	// 			options: {
	// 				fidColumnName: 'fid',
	// 				geometryColumnName: 'geom',
	// 				tiles: [
	// 					{
	// 						features: [
	// 							{
	// 								geometry: {
	// 									coordinates: [0.2, 0.2],
	// 									type: 'Point',
	// 								},
	// 								key: 'featureKey1',
	// 								properties: {
	// 									attribute1: 'A',

	// 									fid: 'featureKey1',
	// 								},
	// 								type: 'Feature',
	// 							},
	// 							{
	// 								geometry: {
	// 									coordinates: [0.7, 0.7],
	// 									type: 'Point',
	// 								},
	// 								key: 'featureKey2',
	// 								properties: {
	// 									fid: 'featureKey2',
	// 									attribute1: 'B',
	// 								},
	// 								type: 'Feature',
	// 							},
	// 						],
	// 						level: 6,
	// 						tile: '0,0',
	// 					},
	// 				],
	// 			},
	// 			type: 'tiledVector',
	// 		},
	// 		{
	// 			key: 'layer1_spatialDataSource2',
	// 			layerKey: 'layer1',
	// 			name: undefined,
	// 			opacity: 1,
	// 			options: {
	// 				fidColumnName: 'fid',
	// 				geometryColumnName: undefined,
	// 				tiles: [
	// 					{
	// 						features: [
	// 							{
	// 								geometry: {
	// 									coordinates: [0.3, 0.4],
	// 									type: 'Point',
	// 								},
	// 								key: 'featureKey11',
	// 								properties: {
	// 									fid: 'featureKey11',
	// 								},
	// 								type: 'Feature',
	// 							},
	// 						],
	// 						level: 6,
	// 						tile: '0,0',
	// 					},
	// 				],
	// 			},
	// 			type: 'tiledVector',
	// 		},
	// 		{
	// 			key: 'layer1_spatialDataSource3',
	// 			layerKey: 'layer1',
	// 			name: undefined,
	// 			opacity: 1,
	// 			options: {
	// 				fidColumnName: 'fid',
	// 				geometryColumnName: undefined,
	// 				tiles: [
	// 					{
	// 						features: [
	// 							{
	// 								geometry: {
	// 									coordinates: [0.75, 0.7],
	// 									type: 'Point',
	// 								},
	// 								key: 'featureKey21',
	// 								properties: {
	// 									fid: 'featureKey21',
	// 								},
	// 								type: 'Feature',
	// 							},
	// 						],
	// 						level: 6,
	// 						tile: '0,0',
	// 					},
	// 				],
	// 			},
	// 			type: 'tiledVector',
	// 		},
	// 		{
	// 			key: 'layer1_spatialDataSource4',
	// 			layerKey: 'layer1',
	// 			name: undefined,
	// 			opacity: 1,
	// 			options: {
	// 				url: undefined,
	// 			},
	// 			type: 'wmts',
	// 		},
	// 	];

	// 	const output = Select.maps.getMapLayers(mapKey);
	// 	assert.deepStrictEqual(output, expectedOutput);
	// 	setState(null);
	// });
});
