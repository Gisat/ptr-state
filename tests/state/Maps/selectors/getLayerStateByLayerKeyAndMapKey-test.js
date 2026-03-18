import Select from '../../../../src/state/Select';
import {assert} from 'chai';
import {MapsSelectorsState as state} from './_state';
import testHelpers from '../../../helpers';
import {setState} from '@jvitela/recompute';

describe('getLayerStateByLayerKeyAndMapKey', function () {
	it('should return layer state', () => {
		setState(state);

		const expectedResult = {
			key: 'layer2',
			layerTemplateKey: 'layerTemplate2',
			metadataModifiers: {
				periodKey: 'period1',
			},
			filterByActive: null,
		};
		const output = Select.maps.getLayerStateByLayerKeyAndMapKey(
			state,
			'map1',
			'layer2'
		);
		assert.deepStrictEqual(output, expectedResult);
		setState(null);
	});

	it('should return null, if layer does not exists', () => {
		setState(state);

		const output = Select.maps.getLayerStateByLayerKeyAndMapKey(
			state,
			'map1',
			'layerXY'
		);
		assert.isNull(output);
		setState(null);
	});

	it('should return null, if there are no layers for map', () => {
		setState(state);
		const output = Select.maps.getLayerStateByLayerKeyAndMapKey(
			state,
			'map3',
			'layer3'
		);
		assert.isNull(output);
		setState(null);
	});
});
