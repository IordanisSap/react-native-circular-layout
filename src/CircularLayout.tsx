import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDecay, SharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { CircleViewProps } from './types';
import { SnapAngle } from './constants';

const defaultAnimationConfig = {
    deceleration: 0.99975,
}


const CircularView = (props: CircleViewProps) => {
    const { radiusX, radiusY, centralComponent = null, rotateCentralComponent = false,
        snappingEnabled = true, index = 0, onSnap, onSnapStart, snapAngle = SnapAngle.TOP, snapDuration = 600,
        gesturesEnabled: scrollEnabled = true, animationConfig = defaultAnimationConfig,
        childContainerStyle = null, onGestureStart, onGestureEnd } = props;

    const angle = useSharedValue(snapAngle);
    const initialTouchAngle = useSharedValue(0);
    const centerX = useSharedValue(0);
    const centerY = useSharedValue(0);

    const numberOfChildren = React.Children.count(props.children);

    const snapPoints = React.useMemo(() => {
        const points = [];
        for (let i = 0; i < numberOfChildren; i++) {
            points.push((2 * Math.PI * i) / numberOfChildren + snapAngle);
        }
        return points;
    }, [numberOfChildren]);



    const createPanGesture = (theta: number, sizeX: SharedValue<number>, sizeY: SharedValue<number>) => {
        return Gesture.Pan()
            .onStart((e) => {
                onGestureStart && runOnJS(onGestureStart)();

                const radiusXValue = typeof radiusX === 'number' ? radiusX : radiusX.value;
                const radiusYValue = typeof radiusY === 'number' ? radiusY : radiusY.value;
                const elementX = centerX.value + radiusXValue * Math.cos(theta + angle.value) - sizeX.value / 2;
                const elementY = centerY.value + radiusYValue * Math.sin(theta + angle.value) - sizeY.value / 2;

                const touchX = elementX + e.x;
                const touchY = elementY + e.y;

                initialTouchAngle.value = Math.atan2(touchY - centerY.value, touchX - centerX.value) - angle.value;
            })
            .onUpdate((e) => {
                if (!scrollEnabled) return;

                const radiusXValue = typeof radiusX === 'number' ? radiusX : radiusX.value;
                const radiusYValue = typeof radiusY === 'number' ? radiusY : radiusY.value;
                const elementX = centerX.value + radiusXValue * Math.cos(theta + angle.value) - sizeX.value / 2;
                const elementY = centerY.value + radiusYValue * Math.sin(theta + angle.value) - sizeY.value / 2;

                const touchX = elementX + e.x;
                const touchY = elementY + e.y;

                const currentTouchAngle = Math.atan2(touchY - centerY.value, touchX - centerX.value);

                angle.value = currentTouchAngle - initialTouchAngle.value;
            })
            .onEnd((e) => {
                onGestureEnd && runOnJS(onGestureEnd)();
                if (!scrollEnabled) return;
                const velocityX = e.velocityX;
                const velocityY = e.velocityY;
                const radiusXValue = typeof radiusX === 'number' ? radiusX : radiusX.value;
                const radiusYValue = typeof radiusY === 'number' ? radiusY : radiusY.value;
                const elementX = centerX.value + radiusXValue * Math.cos(theta + angle.value) - sizeX.value / 2;
                const elementY = centerY.value + radiusYValue * Math.sin(theta + angle.value) - sizeY.value / 2;

                const touchX = elementX + e.x - centerX.value;
                const touchY = elementY + e.y - centerY.value;


                let direction = Math.abs(velocityX) > Math.abs(velocityY) ? Math.sign(velocityX) : Math.sign(velocityY);
                if (Math.abs(velocityX) > Math.abs(velocityY) && touchY > 0) {
                    direction = -Math.sign(velocityX);
                } else if (Math.abs(velocityX) < Math.abs(velocityY) && touchX < 0) {
                    direction = -Math.sign(velocityY);
                }

                let velocity = (Math.abs(velocityX) + Math.abs(velocityY)) / 200;

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

                        // Calculate the actual snap point
                        const closestSnapPoint = snapPoints[closestSnapIndex];
                        const actualSnapPoint = closestSnapPoint + Math.round((angle.value - closestSnapPoint) / (2 * Math.PI)) * 2 * Math.PI;

                        const returnedSnapIndex = closestSnapIndex ? snapPoints.length - closestSnapIndex : 0; //This is because the elements are placed clockwise but rotating clockwise reduces the angle

                        onSnapStart && runOnJS(onSnapStart)(returnedSnapIndex);

                        angle.value = withTiming(actualSnapPoint, { duration: snapDuration }, () => {
                            if (onSnap) {
                                runOnJS(onSnap)(returnedSnapIndex);
                            }
                        });
                    });
                }
            });
    }


    const createStyle = (theta: number, sizeX: SharedValue<number>, sizeY: SharedValue<number>) => {
        const animatedStyle = useAnimatedStyle(() => {
            const radiusXValue = typeof radiusX === 'number' ? radiusX : radiusX.value;
            const radiusYValue = typeof radiusY === 'number' ? radiusY : radiusY.value;

            const x = centerX.value + radiusXValue * Math.cos(theta + angle.value) - sizeX.value / 2;
            const y = centerY.value + radiusYValue * Math.sin(theta + angle.value) - sizeY.value / 2;

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

    const thetas = useMemo(() => {
        const thetas = [];
        for (let i = 0; i < numberOfChildren; i++) {
            thetas.push((2 * Math.PI * i) / numberOfChildren);
        }
        console.log(thetas);
        return thetas;
    }, [numberOfChildren]);


    useEffect(() => {
        if (index === -1) return;
        const invertedIndex = index ? snapPoints.length - index : 0;
        const snapPoint = snapPoints[invertedIndex] + Math.round((angle.value - snapPoints[invertedIndex]) / (2 * Math.PI)) * 2 * Math.PI;

        angle.value = withTiming(snapPoint, { duration: snapDuration }, () => {
            if (onSnap) {
                runOnJS(onSnap)(index);
            }
        });

    }, [index]);

    return (
        <View style={styles.container}
            onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                centerX.value = width / 2;
                centerY.value = height / 2;
            }}
        >
            {React.Children.map(props.children, (child, ind) => {
                const theta = thetas[ind];
                return (
                    <Item theta={theta} index={ind} createStyle={createStyle} createPanGesture={createPanGesture} child={child} />
                );
            })}
            <Animated.View style={rotateCentralComponent && rotatedCentralStyle}>
                {centralComponent}
            </Animated.View>
        </View>
    );
};




const Item = ({ theta, index, createStyle, createPanGesture, child }:
    { theta: number, index: number, createStyle: (theta: number, sizeX: SharedValue<number>, sizeY: SharedValue<number>) => any, createPanGesture: (theta: number, sizeX: SharedValue<number>, sizeY: SharedValue<number>) => any, child: React.ReactNode }) => {

    const sizeX = useSharedValue(0);
    const sizeY = useSharedValue(0);

    const panGesture = createPanGesture(theta, sizeX, sizeY);
    const style = createStyle(theta, sizeX, sizeY);


    return (
        <GestureDetector gesture={panGesture} key={index}>
            <Animated.View style={style}
                onLayout={
                    (event: LayoutChangeEvent) => {
                        const { width, height } = event.nativeEvent.layout;
                        sizeX.value = width;
                        sizeY.value = height;
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

export default CircularView;
