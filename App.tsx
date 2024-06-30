import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EllipticalView from './src/CircularLayout';
import { GestureHandlerRootView, TouchableHighlight } from 'react-native-gesture-handler';
// import CircularView from './src/CircularLayout2';

export default function App() {
  
  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          {/* <ScrollView>
            <View style={{ width: 400, height: 400, }}/> */}
          <View style={{ width: 400, height: 600, }}>
            <EllipticalView radiusX={150} radiusY={150} animationConfig={{ deceleration: 0.9995 }} centralComponent={<CentralComponent/>}>
              <ChildComponent />
              <ChildComponent />
              <ChildComponent />
              <ChildComponent />
              <ChildComponent />

            </EllipticalView>
          </View>
          {/* </ScrollView> */}
        </SafeAreaView>
      </GestureHandlerRootView>
    </View >
  );
}

const CentralComponent = () => (
  <TouchableOpacity style={styles.central}>
    <Text>Central</Text>
  </TouchableOpacity>
);

const ChildComponent = () => (
  <TouchableOpacity style={styles.child}>
    <Text>Child</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  central: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    borderRadius: 25,
  },
  child: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 12,
  },
});
