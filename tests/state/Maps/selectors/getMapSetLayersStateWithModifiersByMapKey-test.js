import Select from '../../../../src/state/Select';
import {assert} from 'chai';
import testHelpers from '../../../helpers';
import {MapsSelectorsState as state} from './_state';
import {setState} from '@jvitela/recompute';

describe('getMapSetLayersStateWithModifiersByMapKey', function () {
	const expectedResult = [
		{
			key: 'layer2',
			layerTemplateKey: 'layerTemplate2',
			metadataModifiers: {
				periodKey: 'period1',
			},
			filterByActive: null,
		},
	];

	it('should return map set layers for map 1', () => {
		setState(state);

		const output = Select.maps.getMapSetLayersStateWithModifiersByMapKey(
			state,
			'map1'
		);
		assert.deepStrictEqual(output, expectedResult);
		setState(null);
	});

	testHelpers.testCache(
		Select.maps.getMapSetLayersStateWithModifiersByMapKey,
		[state, 'map1'],
		expectedResult
	);

	it('should return map set layers for map 2', () => {
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
							layers: [
								...state.maps.sets.set1.data.layers,
								{
									key: 'layerWithMapSetCase',
									name: 'layerWithMapSetCase',
									layerTemplateKey: 'layerTemplate1',
									styleKey: 'style1',
									filterByActive: {
										application: true,
										case: true,
										place: true,
									},
								},
							],
							metadataModifiers: {
								...state.maps.sets.set1.data.metadataModifiers,
								caseKey: 'case1',
								placeKey: 'place2',
							},
						},
					},
				},
			},
		};

		const expectedResult = [
			{
				key: 'layer2',
				layerTemplateKey: 'layerTemplate2',
				metadataModifiers: {
					periodKey: 'period1',
				},
				filterByActive: null,
			},
			{
				key: 'layerWithMapSetCase',
				name: 'layerWithMapSetCase',
				layerTemplateKey: 'layerTemplate1',
				styleKey: 'style1',
				metadataModifiers: {
					applicationKey: 'app1',
					caseKey: 'case1',
					placeKey: 'place2',
				},
				filterByActive: null,
			},
		];

		setState(updatedState);
		Select.maps.getMapFilterByMapKey.clearCache();
		Select.maps.getMapSetLayersStateWithModifiersByMapKey.clearCache();
		const output = Select.maps.getMapSetLayersStateWithModifiersByMapKey(
			updatedState,
			'map1'
		);
		assert.deepStrictEqual(output, expectedResult);
		setState(null);
	});
});
