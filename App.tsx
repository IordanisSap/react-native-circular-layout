import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, ImageSourcePropType, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import EllipticalView from './src/CircularLayout';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withDecay, withRepeat, withSpring, withTiming } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
// import CircularView from './src/CircularLayout2';


const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export default function App() {

  const radiusX = useSharedValue(0);
  const radiusY = useSharedValue(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const childOpacity = useSharedValue(0);
  const isExpanding = useSharedValue(false);

  const childStyle = useAnimatedStyle(() => {
    return {
      opacity: childOpacity.value,
    }
  });

  const onCentralPress = () => {
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


  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          {/* <ScrollView>
            <View style={{ width: 400, height: 400, }}/> */}
          <View style={{ width: 400, height: 600, }}>
            <EllipticalView radiusX={radiusX} radiusY={radiusY} animationConfig={{ deceleration: 0.9995 }} centralComponent={<CentralComponent onPress={onCentralPress} />} panEnabled={scrollEnabled}>
              <ChildComponent style={childStyle} src={require('./assets/burger.png')} />
              <ChildComponent style={childStyle} src={require('./assets/pizza.png')} />
              <ChildComponent style={childStyle} src={require('./assets/cocktail.png')} />
              <ChildComponent style={childStyle} src={require('./assets/ice-cream.png')} />
              <ChildComponent style={childStyle} src={require('./assets/cup.png')} />

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

const ChildComponent = ({ style, src }: { style?: any, src: ImageSourcePropType }) => (
  <AnimatedPressable style={[styles.child, style]} >
    <ImageBackground source={require('./assets/bubble.png')} style={styles.child}>
      <Image source={src} style={{ width: 45, height: 45 }} resizeMode='contain'/>
    </ImageBackground >
  </AnimatedPressable>
);

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
});
