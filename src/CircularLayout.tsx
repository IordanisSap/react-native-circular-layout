import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDecay, SharedValue, withSequence, withTiming, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { DecayConfig } from 'react-native-reanimated/lib/typescript/reanimated2/animation/decay/utils';


const max_speed = 100;

interface EllipticalViewProps {
    children: React.ReactNode;
    radiusX: number | SharedValue<number>;
    radiusY: number | SharedValue<number>;
    centralComponent?: React.ReactNode;
    rotateCentralComponent?: boolean;
    childContainerStyle?: any;
    animationConfig?: DecayConfig;
    panEnabled?: boolean;
    index?: number;
    snappingEnabled?: boolean;
    onSnap?: (index: number) => void;
}


const defaultAnimationConfig = {
    deceleration: 0.99975,
}


const EllipticalView = (props: EllipticalViewProps) => {
    const { radiusX, radiusY, childContainerStyle = null, rotateCentralComponent = false, animationConfig = defaultAnimationConfig, panEnabled: scrollEnabled = true, snappingEnabled = true, index = 0, onSnap: onPick } = props;

    const angle = useSharedValue(0);
    const initialTouchAngle = useSharedValue(0);
    const [centerX, setCenterX] = React.useState(0);
    const [centerY, setCenterY] = React.useState(0);

    const numberOfChildren = React.Children.count(props.children);

    const snapPoints = React.useMemo(() => {
        const points = [];
        for (let i = 0; i < numberOfChildren; i++) {
            points.push((2 * Math.PI * i) / numberOfChildren);
        }
        return points;
    }, [numberOfChildren]);

    const createPanGesture = (theta: number, sizeX: number, sizeY: number) => {
        return Gesture.Pan()
            .onStart((e) => {
                console.log('onStart');

                const radiusXValue = typeof radiusX === 'number' ? radiusX : radiusX.value;
                const radiusYValue = typeof radiusY === 'number' ? radiusY : radiusY.value;
                const elementX = centerX + radiusXValue * Math.cos(theta + angle.value) - sizeX / 2;
                const elementY = centerY + radiusYValue * Math.sin(theta + angle.value) - sizeY / 2;

                const touchX = elementX + e.x;
                const touchY = elementY + e.y;

                initialTouchAngle.value = Math.atan2(touchY - centerY, touchX - centerX) - angle.value;
            })
            .onUpdate((e) => {
                if (!scrollEnabled) return;

                const radiusXValue = typeof radiusX === 'number' ? radiusX : radiusX.value;
                const radiusYValue = typeof radiusY === 'number' ? radiusY : radiusY.value;
                const elementX = centerX + radiusXValue * Math.cos(theta + angle.value) - sizeX / 2;
                const elementY = centerY + radiusYValue * Math.sin(theta + angle.value) - sizeY / 2;

                const touchX = elementX + e.x;
                const touchY = elementY + e.y;

                const currentTouchAngle = Math.atan2(touchY - centerY, touchX - centerX);

                angle.value = currentTouchAngle - initialTouchAngle.value;
            })
            .onEnd((e) => {
                if (!scrollEnabled) return;

                const velocityX = e.velocityX;
                const velocityY = e.velocityY;
                const radiusXValue = typeof radiusX === 'number' ? radiusX : radiusX.value;
                const radiusYValue = typeof radiusY === 'number' ? radiusY : radiusY.value;
                const elementX = centerX + radiusXValue * Math.cos(theta + angle.value) - sizeX / 2;
                const elementY = centerY + radiusYValue * Math.sin(theta + angle.value) - sizeY / 2;

                const touchX = elementX + e.x - centerX;
                const touchY = elementY + e.y - centerY;


                let direction = Math.abs(velocityX) > Math.abs(velocityY) ? Math.sign(velocityX) : Math.sign(velocityY);
                if (Math.abs(velocityX) > Math.abs(velocityY) && touchY > 0) {
                    direction = -Math.sign(velocityX);
                } else if (Math.abs(velocityX) < Math.abs(velocityY) && touchX < 0) {
                    direction = -Math.sign(velocityY);
                }

                let velocity = (Math.abs(velocityX) + Math.abs(velocityY)) / 200;
                console.log('velocity: ', velocity);

                if (!snappingEnabled) {
                    angle.value = withDecay({ velocity: velocity * direction, ...animationConfig });
                } else {
                    angle.value = withDecay({ velocity: velocity * direction, ...animationConfig }, () => {
                        const distances = snapPoints.map(point => {
                            const distanceToFullRotation = (angle.value - point) % (2 * Math.PI);
                            return Math.abs(distanceToFullRotation) > Math.PI
                                ? 2 * Math.PI - Math.abs(distanceToFullRotation)
                                : Math.abs(distanceToFullRotation);
                        });

                        const minDistance = Math.min(...distances);
                        const closestSnapIndex = distances.indexOf(minDistance);

                        console.log('closestSnapIndex: ', closestSnapIndex);
                        // Calculate the actual snap point
                        const closestSnapPoint = snapPoints[closestSnapIndex];
                        const actualSnapPoint = closestSnapPoint + Math.round((angle.value - closestSnapPoint) / (2 * Math.PI)) * 2 * Math.PI;
                        angle.value = withTiming(actualSnapPoint, { duration: 500 }, () => {
                            if (onPick) {
                                runOnJS(onPick)(closestSnapIndex);
                            }
                        });
                    });
                }
            });
    }


    const createStyle = (theta: number, sizeX: number, sizeY: number) => {
        const animatedStyle = useAnimatedStyle(() => {
            const radiusXValue = typeof radiusX === 'number' ? radiusX : radiusX.value;
            const radiusYValue = typeof radiusY === 'number' ? radiusY : radiusY.value;

            const x = centerX + radiusXValue * Math.cos(theta + angle.value) - sizeX / 2;
            const y = centerY + radiusYValue * Math.sin(theta + angle.value) - sizeY / 2;
            return {
                position: 'absolute',
                left: x,
                top: y,
            };
        });
        return [animatedStyle, childContainerStyle];
    }

    const rotatedCentralStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: angle.value + 'rad' }],
        };
    });

    return (
        <View style={styles.container}
            onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                setCenterX(width / 2);
                setCenterY(height / 2);
            }}
        >
            {React.Children.map(props.children, (child, ind) => {
                const theta = (2 * Math.PI * ind) / numberOfChildren + Math.PI * 3 / 2 + (index * Math.PI * 2 / numberOfChildren);
                console.log('theta: ', theta);
                return (
                    <Item theta={theta} index={ind} createStyle={createStyle} createPanGesture={createPanGesture} child={child} />
                );
            })}
            <Animated.View style={rotateCentralComponent && rotatedCentralStyle}>
                {props.centralComponent && props.centralComponent}
            </Animated.View>
        </View>
    );
};

const Children = ({ children, activeIndex }: { children: React.ReactNode, activeIndex:number }) => {
    const numberOfChildren = React.Children.count(children);
    return <>
        {React.Children.map(children, (child, ind) => {
            const theta = (2 * Math.PI * ind) / numberOfChildren + Math.PI * 3 / 2 + (activeIndex * Math.PI * 2 / numberOfChildren);
            console.log('theta: ', theta);
            return (
                <Item theta={theta} index={ind} createStyle={createStyle} createPanGesture={createPanGesture} child={child} />
            );
        })}
    </>;
}



const Item = ({ theta, index, createStyle, createPanGesture, child }:
    { theta: number, index: number, createStyle: (theta: number, sizeX: number, sizeY: number) => any, createPanGesture: (theta: number, sizeX: number, sizeY: number) => any, child: React.ReactNode }) => {

    const [sizeX, setSizeX] = React.useState(0);
    const [sizeY, setSizeY] = React.useState(0);

    const panGesture = createPanGesture(theta, sizeX, sizeY);
    const style = createStyle(theta, sizeX, sizeY);

    return (
        <GestureDetector gesture={panGesture} key={index}>
            <Animated.View style={style}
                onLayout={(event) => {
                    setSizeX(event.nativeEvent.layout.width);
                    setSizeY(event.nativeEvent.layout.height);
                }}
            >
                {child}
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EllipticalView;
