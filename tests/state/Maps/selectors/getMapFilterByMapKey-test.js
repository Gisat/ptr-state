import Select from '../../../../src/state/Select';
import {assert} from 'chai';
import {setState} from '@jvitela/recompute';

const state = {
	periods: {
		activeKey: '2020',
	},
	cases: {
		activeKey: 'winter',
	},
	maps: {
		maps: {
			'map-1': {
				key: 'map-1',
				data: {
					metadataModifiers: {
						areaTreeLevelKey: 'areaTreeLevelKey2',
					},
					filterByActive: {
						period: true,
						case: true,
					},
				},
			},
		},
		sets: {
			mapSet1: {
				key: 'mapSet1',
				maps: ['map-1'],
				sync: {},
				activeMapKey: 'map-1',
				data: {
					metadataModifiers: {
						areaTreeLevelKey: 'areaTreeLevelKey1',
						periodKey: '2000',
					},
					filterByActive: {
						period: true,
					},
				},
			},
		},
	},
};

describe('getMapFilterByMapKey-test', function () {
	it('should return merged filter by active for map in set _1', () => {
		setState(state);

		const expectedResult = {
			periodKey: '2000',
			areaTreeLevelKey: 'areaTreeLevelKey2',
			caseKey: 'winter',
		};
		const output = Select.maps.getMapFilterByMapKey(state, 'map-1');
		assert.deepStrictEqual(output, expectedResult);

		setState(null);
	});

	it('should return merged filter by active for map in set _2', () => {
		const customState = {
			...state,
			maps: {
				...state.maps,
				maps: {
					...state.maps.sets,
					'map-1': {
						...state.maps.maps['map-1'],
						data: {
							...state.maps.maps['map-1'].data,
							filterByActive: {
								...state.maps.maps['map-1'].data.filterByActive,
								case: true,
							},
						},
					},
				},
			},
		};

		setState(state);

		const expectedResult = {
			periodKey: '2000',
			areaTreeLevelKey: 'areaTreeLevelKey2',
			caseKey: 'winter',
		};
		const output = Select.maps.getMapFilterByMapKey(customState, 'map-1');
		assert.deepStrictEqual(output, expectedResult);

		setState(null);
	});

	it('should return merged filter by active for map _1', () => {
		const state = {
			maps: {
				maps: {
					'map-1': {
						key: 'map-1',
						data: {},
					},
				},
			},
		};

		setState(state);

		const expectedResult = {};
		const output = Select.maps.getMapFilterByMapKey(state, 'map-1');
		assert.deepStrictEqual(output, expectedResult);

		setState(null);
	});

	it('should return merged filter by active for map _2', () => {
		const state = {
			maps: {
				maps: {
					'map-1': {
						key: 'map-1',
						data: {
							metadataModifiers: {
								caseKey: 'spring',
							},
						},
					},
				},
			},
		};

		setState(state);

		const expectedResult = {
			caseKey: 'spring',
		};
		const output = Select.maps.getMapFilterByMapKey(state, 'map-1');
		assert.deepStrictEqual(output, expectedResult);

		setState(null);
	});

	it('should return merged filter by active for map _3', () => {
		const state = {
			maps: {
				maps: {
					'map-1': {
						key: 'map-1',
						data: {
							filterByActive: {
								case: true,
							},
						},
					},
				},
			},
		};

		setState(state);

		const expectedResult = {};
		const output = Select.maps.getMapFilterByMapKey(state, 'map-1');
		assert.deepStrictEqual(output, expectedResult);

		setState(null);
	});

	it('should return merged filter by active for map _4', () => {
		const state = {
			cases: {
				activeKey: 'winter',
			},
			maps: {
				maps: {
					'map-1': {
						key: 'map-1',
						data: {
							filterByActive: {
								case: true,
							},
						},
					},
				},
			},
		};

		setState(state);

		const expectedResult = {caseKey: 'winter'};
		const output = Select.maps.getMapFilterByMapKey(state, 'map-1');
		assert.deepStrictEqual(output, expectedResult);

		setState(null);
	});

	it('should return merged filter by active for map _5', () => {
		const state = {
			app: {
				key: 'app1',
			},
			cases: {
				activeKey: 'winter',
			},
			maps: {
				maps: {
					'map-1': {
						key: 'map-1',
						data: {
							filterByActive: {
								case: true,
								application: true,
							},
						},
					},
				},
			},
		};

		setState(state);

		const expectedResult = {caseKey: 'winter', applicationKey: 'app1'};
		const output = Select.maps.getMapFilterByMapKey(state, 'map-1');
		assert.deepStrictEqual(output, expectedResult);

		setState(null);
	});
});
