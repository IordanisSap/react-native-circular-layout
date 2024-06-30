import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDecay, ReduceMotion } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const radius = 150;
const max_speed = 100;

const CircularView = ({ children }) => {
    const angle = useSharedValue(0);
    const initialTouchAngle = useSharedValue(0);
    const [centerX, setCenterX] = React.useState(0);
    const [centerY, setCenterY] = React.useState(0);

    const [absoluteX, setAbsoluteX] = React.useState(0);
    const [absoluteY, setAbsoluteY] = React.useState(0);


    const numberOfChildren = React.Children.count(children);

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
            {React.Children.map(children, (child, index) => {
                const theta = (2 * Math.PI * index) / numberOfChildren;
                const animatedStyle = useAnimatedStyle(() => {
                    const x = centerX + radius * Math.cos(theta + angle.value) - 50;
                    const y = centerY + radius * Math.sin(theta + angle.value) - 50;
                    return {
                        position: 'absolute',
                        left: x,
                        top: y,
                    };
                });

                const panGesture = Gesture.Pan()
                .onStart((e) => {
                  const touchX = e.absoluteX - (absoluteX + centerX);
                  const touchY = e.absoluteY - (absoluteY + centerY);
                  initialTouchAngle.value = Math.atan2(touchY, touchX) - angle.value;
                })
                .onUpdate((e) => {
                    const elementX = centerX + radius * Math.cos(theta + angle.value) - 50;
                    const elementY = centerY + radius * Math.sin(theta + angle.value) - 50;
                
                    // Calculate the touch position relative to the parent
                    const touchX = elementX + e.x;
                    const touchY = elementY + e.y;
                
                    // Calculate the current angle based on the touch position
                    const currentTouchAngle = Math.atan2(touchY - centerY, touchX - centerX);
                
                    // Update the angle
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
        
                    let velocity =  (Math.abs(velocityX) + Math.abs(velocityY)) / 200;
                    console.log('velocity: ', velocity);
                    angle.value = withDecay({ velocity: velocity * direction, deceleration: 0.99975});
                });

                return (
                    <GestureDetector gesture={panGesture} key={index}>
                        <Animated.View style={[styles.child, animatedStyle]}>
                            {child}
                        </Animated.View>
                    </GestureDetector>
                );
            })}
        </View>
    );
};

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

export default CircularView;
