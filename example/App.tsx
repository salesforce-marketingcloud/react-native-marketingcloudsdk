import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import MessageScreen from './MessagesScreen';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {backgroundColor: '#007BFF'},
          headerTintColor: 'white',
        }}>
        <Stack.Screen name="Home" component={HomeScreen} options={() => ({
            title: 'React Native Example app',

          })}/>
        <Stack.Screen
          name="MessageScreen"
          component={MessageScreen}
          options={({navigation}) => ({
            title: 'Messages',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon
                  name="chevron-left"
                  size={24}
                  color="white"
                  style={{marginLeft: 10}}
                />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
