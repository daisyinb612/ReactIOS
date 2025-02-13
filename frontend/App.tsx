import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './src/user/UserContext';
import LoginScreen from './src/views/login';
import RegisterScreen from './src/views/register';
import ManageScreen from './src/views/manage';
import EditScreen from './src/views/edit';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: '登录' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: '注册' }} />
          <Stack.Screen name="Manage" component={ManageScreen} options={{ title: '管理' }} />
          <Stack.Screen name="Edit" component={EditScreen} options={{ title: '编辑' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
