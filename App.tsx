import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EllipticalView from './src/CircularLayout';
import { GestureHandlerRootView, TouchableHighlight } from 'react-native-gesture-handler';
// import CircularView from './src/CircularLayout2';

export default function App() {
  return (
    <View style={styles.container}>
      <GestureHandlerRootView >
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          {/* <ScrollView>
            <View style={{ width: 400, height: 400, }}/> */}
            <View style={{ width: 400, height: 600, }}>
              <EllipticalView radiusX={150} radiusY={150} childContainerStyle={styles.child} animationConfig={{deceleration:0.9995}}>
                <Text>123</Text>
                <TouchableHighlight onPress={() => console.log('pressed')}>
                  <Text>456</Text>
                </TouchableHighlight>
                <Text>456</Text>
                <Text>789</Text>
                <Text>888</Text>
                <Text>999</Text>
              </EllipticalView>
            </View>
          {/* </ScrollView> */}
        </SafeAreaView>
      </GestureHandlerRootView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  child: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 25,
},
});
