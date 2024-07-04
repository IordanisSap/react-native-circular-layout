import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, ImageSourcePropType, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import EllipticalView from './src/CircularLayout';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withDecay, withRepeat, withSpring, withTiming } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
// import CircularView from './src/CircularLayout2';


const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export default function App() {

  const radiusX = useSharedValue(0);
  const radiusY = useSharedValue(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const childOpacity = useSharedValue(0);
  const isExpanding = useSharedValue(false);
  const [index, setIndex] = useState(0);

  const childStyle = useAnimatedStyle(() => {
    return {
      opacity: childOpacity.value,
    }
  });

  const onCentralPress = () => {
    setIndex((childComponents.length + index + 1) % childComponents.length);
    if (isExpanding.value) {
      radiusX.value = withTiming(0, { duration: 800, })
      radiusY.value = withTiming(0, { duration: 800, })
      childOpacity.value = withTiming(0, { duration: 500, })
      isExpanding.value = false;
    }
    else {
      radiusX.value = withTiming(150, { duration: 600, })
      radiusY.value = withTiming(150, { duration: 600, })
      childOpacity.value = withTiming(1, { duration: 600, })
      isExpanding.value = true;
    }
  }

  const childComponents = [
    { src: require('./assets/burger.png') },
    { src: require('./assets/pizza.png') },
    { src: require('./assets/cocktail.png') },
    { src: require('./assets/ice-cream.png') },
    { src: require('./assets/cup.png') }
  ];

  const colors = ['#D2691E', '#FFA500', '#FF69B4', '#FFB6C1', '#8B4513'];


  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          {/* <ScrollView>
            <View style={{ width: 400, height: 400, }}/> */}
          <View style={{ width: 400, height: 600, }}>
            <EllipticalView
              radiusX={radiusX}
              radiusY={radiusY}
              animationConfig={{ deceleration: 0.9995 }}
              centralComponent={<CentralComponent onPress={onCentralPress} />}
              gesturesEnabled={scrollEnabled}
              index={index} onSnapStart={(index) => setIndex(index)}
              onGestureStart={() => setIndex(-1)}
              onGestureEnd={() => console.log('Gesture End')}
            >
              {childComponents.map((item, ind) => (
                <ChildComponent
                  key={ind}
                  style={childStyle}
                  color={colors[ind]}
                  src={item.src}
                  selected={index === ind}
                />
              ))}
            </EllipticalView>
          </View>
          {/* </ScrollView> */}
        </SafeAreaView>
      </GestureHandlerRootView>
    </View >
  );
}

const CentralComponent = ({ onPress }: { onPress: () => void }) => (
  <AnimatedPressable style={styles.central} onPress={onPress} >
    <Text style={styles.text}>Press me!</Text>
  </AnimatedPressable>
);

const ChildComponent = ({ style, src, selected, color }: { style?: any, src: ImageSourcePropType, selected: boolean, color: any }) => {

  const sizeAnim = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: sizeAnim.value }],
      shadowColor: selected ? 'gray' : 'transparent',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: selected ? 0.75 : 0,
      shadowRadius: 5,
      elevation: 2,
    }
  });

  useEffect(() => {
    sizeAnim.value = withSpring(selected ? 1.4 : 1, { damping: 10, stiffness: 100 })
  }, [selected]);

  return (
    <AnimatedPressable style={[style, animatedStyle, { backgroundColor: color, padding: 15, borderRadius: 40 }]} >
      <Image source={src} style={{ width: 40, height: 40, }} resizeMode='contain' />
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 15,
  },
  central: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A17ADD',
    borderRadius: 50,
  },
  child: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childBig: {
    width: 130,
    height: 130,
  },
});
