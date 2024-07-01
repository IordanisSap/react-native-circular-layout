import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDecay, SharedValue } from 'react-native-reanimated';
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
}


const defaultAnimationConfig = {
    deceleration: 0.99975,
}


const EllipticalView = (props: EllipticalViewProps) => {
    const { radiusX, radiusY, childContainerStyle = null, rotateCentralComponent = false, animationConfig = defaultAnimationConfig ,panEnabled: scrollEnabled=true } = props;

    const angle = useSharedValue(0);
    const initialTouchAngle = useSharedValue(0);
    const [centerX, setCenterX] = React.useState(0);
    const [centerY, setCenterY] = React.useState(0);

    const [absoluteX, setAbsoluteX] = React.useState(0);
    const [absoluteY, setAbsoluteY] = React.useState(0);

    const numberOfChildren = React.Children.count(props.children);

    const createPanGesture = (theta: number, sizeX: number, sizeY: number) => {
        return Gesture.Pan()
            .onStart((e) => {
                const touchX = e.absoluteX - (absoluteX + centerX);
                const touchY = e.absoluteY - (absoluteY + centerY);
                initialTouchAngle.value = Math.atan2(touchY, touchX) - angle.value;
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

                const touchX = e.absoluteX - (absoluteX + centerX);
                const touchY = e.absoluteY - (absoluteY + centerY);

                let direction = Math.abs(velocityX) > Math.abs(velocityY) ? Math.sign(velocityX) : Math.sign(velocityY);
                if (Math.abs(velocityX) > Math.abs(velocityY) && touchY > 0) {
                    direction = -Math.sign(velocityX);
                } else if (Math.abs(velocityX) < Math.abs(velocityY) && touchX < 0) {
                    direction = -Math.sign(velocityY);
                }

                let velocity = (Math.abs(velocityX) + Math.abs(velocityY)) / 200;
                console.log('velocity: ', velocity);
                angle.value = withDecay({ velocity: velocity * direction, ...animationConfig });
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
                event.target.measure(
                    (x, y, width, height, pageX, pageY) => {
                        setCenterX(width / 2);
                        setCenterY(height / 2);
                        setAbsoluteX(pageX);
                        setAbsoluteY(pageY);
                    },
                );
            }}
        >
            {React.Children.map(props.children, (child, index) => {
                const theta = (2 * Math.PI * index) / numberOfChildren;
                return (
                    <Item theta={theta} index={index} createStyle={createStyle} createPanGesture={createPanGesture} child={child} />
                );
            })}
            <Animated.View style={rotateCentralComponent && rotatedCentralStyle}>
                {props.centralComponent && props.centralComponent}
            </Animated.View>
        </View>
    );
};



const Item = ({ theta, index, createStyle, createPanGesture, child }:
    { theta: number, index: number, createStyle: (theta: number, sizeX: number, sizeY: number) => any, createPanGesture: (theta: number, sizeX: number, sizeY: number) => any, child: React.ReactNode }) => {

    const [sizeX, setSizeX] = React.useState(0);
    const [sizeY, setSizeY] = React.useState(0);
    console.log('sizeX: ', sizeX);
    console.log('sizeY: ', sizeY);

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
