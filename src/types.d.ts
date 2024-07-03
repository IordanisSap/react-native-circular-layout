import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import { DecayConfig } from 'react-native-reanimated/lib/typescript/reanimated2/animation/decay/utils';



export interface EllipticalViewProps {

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
     * The callback that is called when the view snaps to a child
     */

    onSnap?: (index: number) => void;

    /**
     * Whether the user can pan the view / rotate using touch
     * 
     * Default: true
     */

    panEnabled?: boolean;

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
     * The configuration for the decay animation
     * 
     * NOTE: deceleration values below 0.9 will cause the animation to stop almost immediately
     */

    animationConfig?: DecayConfig;

}