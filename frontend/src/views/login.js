import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/button';
import Input from '../components/input';
import { useUser } from '../user/UserContext';
import axios from 'axios';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setUserId } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5050/auth/login', {
        email,
        password,
      });
      const { id } = response.data;
      setUserId(id);
      Alert.alert('Success', response.data.message);
      navigation.navigate('Manage');
    } catch (error) {
      Alert.alert('Error', error.response.data.message || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>登录页面</Text>
      <Text style={styles.label}>邮箱</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          console.log("Email input:", text); // 打印输入的邮箱
          setEmail(text);
        }}
      />
      <Text style={styles.label}>密码</Text>
      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          console.log("Password input:", text); // 打印输入的密码
          setPassword(text);
        }}
      />
      <Button
        title="登录"
        backgroundColor="#f0c040"
        onPress={handleLogin}
      />
      <Button
        title="注册"
        backgroundColor="#ccc"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default LoginScreen;