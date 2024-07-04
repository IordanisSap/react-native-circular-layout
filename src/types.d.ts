import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import { DecayConfig } from 'react-native-reanimated/lib/typescript/reanimated2/animation/decay/utils';



export interface CircleViewProps {

    /**
     * The children to be displayed in the circular layout
     */

    children: React.ReactNode;

    /**
     * The radius of the ellipse in the x direction. Can be a number or a shared value
     */

    radiusX: number | SharedValue<number>;

    /**
     * The radius of the ellipse in the y direction. Can be a number or a shared value
     */

    radiusY: number | SharedValue<number>;

    /**
     * The central component to be displayed in the center of the circle/ellipse
     */

    centralComponent?: React.ReactNode;


    /**
     * The index of the child that is currently at currently snapped to the top.
     * 
     * Default: 0
     */

    index?: number;

    /**
     * Whether the view should snap to the nearest child
     * 
     * Default: false
     */

    snappingEnabled?: boolean;

    /**
     * The callback that is called when the view snaps to a child. Called when the animation ends.
     */

    onSnap?: (index: number) => void;


    /**
     * The callback that is called when the snapping animation starts
     */

    onSnapStart?: (index: number) => void;
    /**
     * The angle at which the view should snap to the nearest child
     * 
     * Default: SnapAngle.Top
     */

    snapAngle?: SnapAngle | number;
    /**
     * Whether the user can pan the view / rotate using touch
     * 
     * Default: true
     */

    gesturesEnabled?: boolean;


    /**
     * The callback that is called when the user starts a gesture
     */

    onGestureStart?: () => void;

    /**
     * The callback that is called when the user ends a gesture
     */

    onGestureEnd?: () => void;

    /** 
     * Whether the central component should rotate with the rest of the components
     * 
     * Default: false
     */

    rotateCentralComponent?: boolean;

    /**
     * The style of the container for the children
     */

    childContainerStyle?: any;

    /**
     * The duration of the snapping animation
     */

    snapDuration?: number;

    /**
     * The configuration for the decay animation
     * 
     * NOTE: deceleration values below 0.9 will cause the animation to stop almost immediately
     */

    animationConfig?: DecayConfig;


}
