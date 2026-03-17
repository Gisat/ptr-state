import Select from '../../../../src/state/Select';
import {assert} from 'chai';
import testHelpers from '../../../helpers';
import {MapsSelectorsState as state} from './_state';
import {setState} from '@jvitela/recompute';

describe('getMapLayersStateWithModifiersByMapKey', function () {
	const expectedResult = [
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

	it('should return map layers for map 1', () => {
		setState(state);
		const output = Select.maps.getMapLayersStateWithModifiersByMapKey(
			state,
			'map1'
		);
		assert.deepStrictEqual(output, expectedResult);
		setState(null);
	});

	testHelpers.testCache(
		Select.maps.getMapLayersStateWithModifiersByMapKey,
		[state, 'map1'],
		expectedResult
	);

	it('should return map layers for map 2', () => {
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
							metadataModifiers: {
								...state.maps.sets.set1.data.metadataModifiers,
								caseKey: 'case1',
							},
						},
					},
				},
				maps: {
					...state.maps.maps,
					map1: {
						...state.maps.maps.map1,
						data: {
							...state.maps.maps.map1.data,
							layers: [
								...state.maps.maps.map1.data.layers,
								{
									key: 'layerWithMapSetCase',
									name: 'layerWithMapSetCase',
									layerTemplateKey: 'layerTemplate1',
									styleKey: 'style1',
									metadataModifiers: {
										placeKey: 'place1',
										scenarioKeys: ['scenario1', 'scenario2'],
									},
									filterByActive: {
										case: true,
										place: true,
									},
								},
							],
						},
					},
				},
			},
		};

		const expectedResultWithCase = [
			...expectedResult,
			{
				key: 'layerWithMapSetCase',
				name: 'layerWithMapSetCase',
				layerTemplateKey: 'layerTemplate1',
				styleKey: 'style1',
				metadataModifiers: {
					caseKey: 'case1',
					placeKey: 'place1',
					scenarioKeys: ['scenario1', 'scenario2'],
				},
				filterByActive: null,
			},
		];

		setState(updatedState);
		Select.maps.getMapFilterByMapKey.clearCache();
		Select.maps.getMapLayersStateWithModifiersByMapKey.clearCache();
		const output = Select.maps.getMapLayersStateWithModifiersByMapKey(
			updatedState,
			'map1'
		);
		assert.deepStrictEqual(output, expectedResultWithCase);
		setState(null);
	});

	it('should return map layers for map 3', () => {
		const updatedState = {
			...state,
			app: {key: 'app1'},
			maps: {
				...state.maps,
				sets: {
					...state.maps.sets,
					set1: {
						...state.maps.sets.set1,
						data: {
							...state.maps.sets.set1.data,
							metadataModifiers: {
								...state.maps.sets.set1.data.metadataModifiers,
								caseKey: 'case1',
								placeKey: 'place2',
							},
						},
					},
				},
				maps: {
					...state.maps.maps,
					map1: {
						...state.maps.maps.map1,
						data: {
							...state.maps.maps.map1.data,
							layers: [
								...state.maps.maps.map1.data.layers,
								{
									key: 'layerWithMapSetCase',
									name: 'layerWithMapSetCase',
									layerTemplateKey: 'layerTemplate1',
									styleKey: 'style1',
									metadataModifiers: {
										placeKey: 'place3',
										scenarioKeys: ['scenario1', 'scenario2'],
									},
									filterByActive: {
										application: true,
										case: true,
										place: true,
									},
								},
							],
						},
					},
				},
			},
		};

		const expectedResult = [
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
			{
				key: 'layerWithMapSetCase',
				name: 'layerWithMapSetCase',
				layerTemplateKey: 'layerTemplate1',
				styleKey: 'style1',
				metadataModifiers: {
					applicationKey: 'app1',
					caseKey: 'case1',
					placeKey: 'place3',
					scenarioKeys: ['scenario1', 'scenario2'],
				},
				filterByActive: null,
			},
		];

		setState(updatedState);
		Select.maps.getMapFilterByMapKey.clearCache();
		Select.maps.getMapLayersStateWithModifiersByMapKey.clearCache();
		const output = Select.maps.getMapLayersStateWithModifiersByMapKey(
			updatedState,
			'map1'
		);
		assert.deepStrictEqual(output, expectedResult);
		setState(null);
	});
});
