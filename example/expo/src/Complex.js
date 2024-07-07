import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import CircularView from 'react-native-circular-layout';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { memo, useCallback, useMemo, useRef, useState } from 'react';


const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export default function Complex() {

  const [index, setIndex] = useState(0);
  const prevIndex = useRef(index);

  const radiusX = useSharedValue(150);
  const radiusY = useSharedValue(150);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const childOpacity = useSharedValue(1);
  const isExpanded = useSharedValue(true);

  const indexAnim = useSharedValue(0);

  const onSnapStart = useCallback((index) => {
    indexAnim.value = index;
    setIndex(index);
  }, []);

  const childStyle = useAnimatedStyle(() => {
    return {
      opacity: childOpacity.value,
    }
  });

  const childComponents = [
    { src: require('../assets/burger.png') },
    { src: require('../assets/pizza.png') },
    { src: require('../assets/cocktail.png') },
    { src: require('../assets/ice-cream.png') },
    { src: require('../assets/cup.png') }
  ];

  const colors = ['#D2691E', '#FFA500', '#FF69B4', '#FFB6C1', '#8B4513'];


  const memoizedChildComponents = useMemo(() =>
    childComponents.map((item, ind) => (
      <ChildComponent
        key={ind}
        style={childStyle}
        src={item.src}
        indexAnim={indexAnim}
        myIndex={ind}
        color={colors[ind]}
      />
    )),
    [childComponents, childStyle, colors, indexAnim]
  );

  const onCentralPress = () => {
    if (isExpanded.value) {
      radiusX.value = withTiming(0, { duration: 800, })
      radiusY.value = withTiming(0, { duration: 800, })
      childOpacity.value = withTiming(0, { duration: 500, })
      isExpanded.value = false;
      prevIndex.current = index;
      indexAnim.value = -1;
      setIndex((Math.floor(childComponents.length / 2) + indexAnim.value + 1) % childComponents.length);

    }
    else {
      radiusX.value = withTiming(150, { duration: 600, })
      radiusY.value = withTiming(150, { duration: 600, })
      childOpacity.value = withTiming(1, { duration: 600, })
      isExpanded.value = true;
      indexAnim.value = prevIndex.current;
      setIndex(prevIndex.current);
    }
  }


  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          {/* <ScrollView>
            <View style={{ width: 400, height: 400, }}/> */}
          <View style={{ width: 400, height: 600, }}>
            <CircularView
              radiusX={radiusX}
              radiusY={radiusY}
              animationConfig={{ deceleration: 0.9995 }}
              centralComponent={<CentralComponent onPress={onCentralPress} />}
              gesturesEnabled={scrollEnabled}
              index={index}
              onSnapStart={(index) => onSnapStart(index)}
              onGestureStart={() => indexAnim.value = -1}
              onGestureEnd={() => console.log('Gesture End')}
            >
              {memoizedChildComponents}
            </CircularView>
          </View>
          {/* </ScrollView> */}
        </SafeAreaView>
      </GestureHandlerRootView>
    </View >
  );
}

const CentralComponent = ({ onPress }) => {
  const animatedRotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${animatedRotation.value}deg` }]
    }
  });

  const onPressWrapper = () => {
    if (animatedRotation.value < 180) animatedRotation.value = withSpring(360, { damping: 10, stiffness: 100 });
    else animatedRotation.value = withSpring(0, { damping: 10, stiffness: 100 });
    onPress();
  }

  return (
    <AnimatedPressable style={[styles.central, animatedStyle]} onPress={onPressWrapper} >
      <Text style={styles.text}>Press me!</Text>
    </AnimatedPressable>
  )
};


const ChildComponent = memo(({ style, src, indexAnim, myIndex, color }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const selected = indexAnim.value === myIndex;
    return {
      transform: [{ scale: withSpring(selected ? 1.4 : 1, { damping: 10, stiffness: 100 }) }],
      shadowColor: 'gray',
      style: {
        shadowOffset: {
          width: 0,
          height: 2,
        },
      },
      shadowOpacity: withTiming(selected ? 0.8 : 0, { duration: 300 }),
      shadowRadius: 5,
      elevation: 2,
    };
  });

  return (
    <AnimatedPressable style={[style, animatedStyle, { backgroundColor: color, padding: 15, borderRadius: 40 }]} >
      <Image source={src} style={{ width: 40, height: 40 }} resizeMode='contain' />
    </AnimatedPressable>
  );
});

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
