import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDecay } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { DecayConfig } from 'react-native-reanimated/lib/typescript/reanimated2/animation/decay/utils';


const max_speed = 100;

interface EllipticalViewProps {
    children: React.ReactNode;
    radiusX: number;
    radiusY: number;
    childContainerStyle?: any;
    animationConfig?: DecayConfig;
}


const defaultAnimationConfig = {
    deceleration: 0.99975,
}


const EllipticalView = (props: EllipticalViewProps) => {
    const { radiusX, radiusY, childContainerStyle = styles.child, animationConfig=defaultAnimationConfig } = props;

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
                const elementX = centerX + radiusX * Math.cos(theta + angle.value) - sizeX / 2;
                const elementY = centerY + radiusY * Math.sin(theta + angle.value) - sizeY / 2;

                const touchX = elementX + e.x;
                const touchY = elementY + e.y;

                const currentTouchAngle = Math.atan2(touchY - centerY, touchX - centerX);

                angle.value = currentTouchAngle - initialTouchAngle.value;
            })
            .onEnd((e) => {
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
                angle.value = withDecay({ velocity: velocity * direction,  ...animationConfig });
            });
    }

    const createStyle = (theta:number, sizeX: number, sizeY: number) => {
        const animatedStyle =  useAnimatedStyle(() => {
            const x = centerX + radiusX * Math.cos(theta + angle.value) - sizeX / 2;
            const y = centerY + radiusY * Math.sin(theta + angle.value) - sizeY / 2;
            return {
                position: 'absolute',
                left: x,
                top: y,
            };
        });
        return [animatedStyle, childContainerStyle];
    }

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
                    <Item theta={theta} index={index} createStyle={createStyle} createPanGesture={createPanGesture}  child={child} />
                );
            })}
        </View>
    );
};



const Item = ({theta, index, createStyle, createPanGesture, child }:
    { theta:number, index: number, createStyle: (theta: number, sizeX:number, sizeY:number) => any, createPanGesture: (theta: number, sizeX:number, sizeY:number) => any, child: React.ReactNode }) => {

    const [sizeX, setSizeX] = React.useState(0);
    const [sizeY, setSizeY] = React.useState(0);

    console.log('sizeX: ', sizeX);
    console.log('sizeY: ', sizeY);

    const panGesture = createPanGesture(theta, sizeX,sizeY);
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
        backgroundColor: 'lightgray',
    },
    child: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightblue',
        borderRadius: 50,
    },
});

export default EllipticalView;
