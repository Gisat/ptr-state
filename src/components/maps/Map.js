import {connect} from 'react-redux';
import {setState} from '@jvitela/recompute';
import Action from '../../state/Action';
import Select from '../../state/Select';
import {utils} from '@gisatcz/ptr-utils';

const mapStateToProps = (state, ownProps) => {
	setState(state);

	if (ownProps.stateMapKey) {
		return {
			active3D: Select.maps.getMapActive3DByMapKey(state, ownProps.stateMapKey),
			backgroundLayer: Select.maps.getMapBackgroundLayer(ownProps.stateMapKey),
			layers: Select.maps.getMapLayers(ownProps.stateMapKey),
			viewport: Select.maps.getViewportByMapKey(state, ownProps.stateMapKey),
			view: Select.maps.getViewByMapKey(state, ownProps.stateMapKey),
			viewLimits: Select.maps.getViewLimitsByMapKey(
				state,
				ownProps.stateMapKey
			),
			mapKey: ownProps.stateMapKey,
		};
	} else {
		return {
			backgroundLayer: Select.maps.getMapBackgroundLayer(
				ownProps.mapKey,
				ownProps.backgroundLayer
			),
			layers: Select.maps.getMapLayers(ownProps.mapKey, ownProps.layers),
		};
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'Map_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		if (ownProps.stateMapKey) {
			return {
				onMount: (mapWidth, mapHeight) => {
					dispatch(
						Action.maps.setMapViewport(
							ownProps.stateMapKey,
							mapWidth,
							mapHeight
						)
					);
					dispatch(Action.maps.use(ownProps.stateMapKey, null, null));
				},

				onResize: (mapWidth, mapHeight) => {
					dispatch(
						Action.maps.setMapViewport(
							ownProps.stateMapKey,
							mapWidth,
							mapHeight
						)
					);
					dispatch(Action.maps.use(ownProps.stateMapKey, null, null));
				},

				onUnmount: () => {
					dispatch(Action.maps.mapUseClear(ownProps.stateMapKey));
				},

				refreshUse: () => {},

				onViewChange: update => {
					dispatch(
						Action.maps.updateMapAndSetView(ownProps.stateMapKey, update)
					);
				},

				onPropViewChange: (update, mapWidth, mapHeight) => {
					dispatch(
						Action.maps.setMapViewport(
							ownProps.stateMapKey,
							mapWidth,
							mapHeight
						)
					);
					dispatch(Action.maps.use(ownProps.stateMapKey, undefined, undefined));
				},

				resetHeading: () => {},

				onClick: () => {
					dispatch(Action.maps.setMapSetActiveMapKey(ownProps.stateMapKey));
				},
				onLayerClick: (
					mapKey,
					layerKey,
					selectedFeatureKeys,
					position,
					options
				) => {
					if (typeof ownProps.onLayerClick === 'function') {
						ownProps.onLayerClick(
							mapKey,
							layerKey,
							selectedFeatureKeys,
							position,
							options
						);
					} else {
						dispatch(
							Action.maps.setLayerSelectedFeatureKeys(
								ownProps.stateMapKey,
								layerKey,
								selectedFeatureKeys
							)
						);
					}
				},
			};
		} else {
			let mapKey = ownProps.mapKey || componentId;

			return {
				onMount: () => {
					dispatch(
						Action.maps.use(mapKey, ownProps.backgroundLayer, ownProps.layers)
					);
				},

				onUnmount: () => {},

				refreshUse: () => {},

				onViewChange: ownProps.onViewChange || (() => {}),

				onClick: ownProps.onClick || (() => {}),
			};
		}
	};
};

export default connect(mapStateToProps, mapDispatchToPropsFactory, null, {
	forwardRef: true,
});
