import Select from '../../../../src/state/Select';
import {assert} from 'chai';
import {setState} from '@jvitela/recompute';
import testHelpers from '../../../helpers';
import {MapsSelectorsState as state} from './_state';

describe('getAllLayersStateByMapKey', function () {
	const expectedResult = [
		{
			key: 'pantherBackgroundLayer',
			layerTemplateKey: 'layerTemplateBackground',
		},
		{
			key: 'layer2',
			layerTemplateKey: 'layerTemplate2',
			metadataModifiers: {
				periodKey: 'period1',
			},
			filterByActive: null,
		},
		{
			key: 'layer1',
			name: 'Layer 1',
			layerTemplateKey: 'layerTemplate1',
			styleKey: 'style1',
			metadataModifiers: {
				placeKey: 'place1',

				scenarioKeys: ['scenario1', 'scenario2'],
			},
			filterByActive: null,
		},
		{
			key: 'layerDefinition1',
			name: 'Layer with definitions',
			type: 'vector',
			options: {
				features: [],
				style: {
					styles: [
						{
							fill: '#ff0000',
						},
					],
				},
			},
			filterByActive: null,
			metadataModifiers: null,
		},
	];

	it('should return all map layers for map 1', () => {
		setState(state);
		const output = Select.maps.getAllLayersStateByMapKey(state, 'map1');
		assert.deepStrictEqual(output, expectedResult);
		setState(null);
	});

	testHelpers.testCache(
		Select.maps.getAllLayersStateByMapKey,
		[state, 'map1'],
		expectedResult
	);

	it('should return all map layers for map 2', () => {
		setState(state);
		const expectedResult = [
			{
				key: 'pantherBackgroundLayer',
				type: 'wmts',
				options: {
					url: 'http://backgroundLayer.no',
				},
			},
			{
				key: 'layer2',
				layerTemplateKey: 'layerTemplate2',
				metadataModifiers: {
					periodKey: 'period1',
				},
				filterByActive: null,
			},
			{
				key: 'layer3',
				name: 'Layer 3',
				layerTemplateKey: 'layerTemplate3',
				styleKey: 'style3',
				metadataModifiers: {
					placeKey: 'place2',
				},
				filterByActive: null,
			},
		];
		const output = Select.maps.getAllLayersStateByMapKey(state, 'map2');
		assert.deepStrictEqual(output, expectedResult);
		setState(null);
	});

	it('should return null, if both backgroundLayer and layers is null', () => {
		setState(state);
		const updatedState = {
			...state,
			maps: {
				...state.maps,
				sets: {
					...state.maps.sets,
					set1: {
						...state.maps.sets.set1,
						data: {
							...state.maps.sets.set1.data,
							layers: null,
							backgroundLayer: null,
						},
					},
				},
				maps: {
					...state.maps.maps,
					map1: {
						...state.maps.maps.map1,
						data: {
							...state.maps.maps.map1.data,
							layers: null,
							backgroundLayer: null,
						},
					},
				},
			},
		};
		const output = Select.maps.getAllLayersStateByMapKey(updatedState, 'map1');
		assert.isNull(output);
		setState(null);
	});
});
