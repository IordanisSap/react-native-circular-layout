import { SafeAreaView, View } from 'react-native';
import CircularView from 'react-native-circular-layout';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function Minimal() {

    const colors = ['#D2691E', '#FFA500', '#FF69B4', '#FFB6C1', '#8B4513'];
    return (
        <View style={{flex:1, backgroundColor:'white'}}>
            <GestureHandlerRootView>
                <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
                    <CircularView
                        radiusX={120}
                        radiusY={120}
                        snappingEnabled={true}
                    >
                        {colors.map((color, index) => (
                            <View key={index} style={{ width: 60, height: 60, backgroundColor: color, borderRadius:20 }} />
                        ))}
                    </CircularView>
                </SafeAreaView>
            </GestureHandlerRootView>
        </View >
    );
}




