import _ from 'lodash';
import common from '../_common/selectors';
import StyleSelectors from '../Styles/selectors';
import {createSelector} from 'reselect';
import {
	createSelector as createRecomputeSelector,
	createObserver as createRecomputeObserver,
} from '@jvitela/recompute';

const getSubstate = state => state.selections;
const getActive = common.getActive(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getAll = common.getAll(getSubstate);
const getByKey = common.getByKey(getSubstate);

const getAllAsObjectWithStyles = createSelector(
	[getAllAsObject, StyleSelectors.getAllAsObject],
	(selections, allStyles) => {
		if (selections) {
			if (allStyles) {
				let selectionsWithStyles = {};
				_.forIn(selections, (selection, key) => {
					const styleKey = selection.data?.styleKey;
					if (styleKey && allStyles[styleKey]) {
						const selectionStyle =
							allStyles[styleKey].data?.definition?.rules?.[0].styles?.[0]; // TODO get first style of first rule for now
						if (selectionStyle) {
							selectionsWithStyles[key] = {
								...selection,
								data: {
									...selection.data,
									style: selectionStyle,
								},
							};
						} else {
							selectionsWithStyles[key] = selection;
						}
					} else {
						selectionsWithStyles[key] = selection;
					}
				});

				return selectionsWithStyles;
			} else {
				return selections;
			}
		} else {
			return null;
		}
	}
);

const getByKeyObserver = createRecomputeObserver(
	(state, key) => state.selections.byKey[key]
);

const prepareSelectionByLayerStateSelected = createRecomputeSelector(
	layerStateSelected => {
		let populatedSelections = {};
		_.forIn(layerStateSelected, (value, key) => {
			let selection = getByKeyObserver(key);
			let selectionData = selection?.data;

			if (selectionData) {
				const style = selectionData.style;
				const hoveredStyle = selectionData.hoveredStyle || style;
				const color = selectionData.color;
				const hoveredColor = selectionData.hoveredColor || color;

				if (selectionData.featureKeysFilter) {
					populatedSelections[key] = {
						...selectionData.featureKeysFilter,
					};

					if (selectionData.distinctItems) {
						populatedSelections[key].distinctItems = true;
					}
					if (selectionData.colourPalette) {
						populatedSelections[key].colourPalette =
							selectionData.colourPalette;
					}

					if (style) {
						populatedSelections[key].style = style;
						populatedSelections[key].hoveredStyle = hoveredStyle;
					} else {
						populatedSelections[key].style = {
							outlineColor: color,
							outlineWidth: 2,
						};
						populatedSelections[key].hoveredStyle = {
							outlineColor: hoveredColor,
							outlineWidth: 2,
						};
					}
				}

				//TODO other selection types
			}
		});

		return populatedSelections;
	}
);

export default {
	getActiveKey,
	getActive,
	getAll,
	getAllAsObject,

	getAllAsObjectWithStyles,
	getByKey,

	getByKey,

	prepareSelectionByLayerStateSelected,
};
