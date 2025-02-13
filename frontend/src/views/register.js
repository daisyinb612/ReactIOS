import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/button';
import Input from '../components/input';
import axios from 'axios';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    // 检查邮箱和密码是否为空
    if (!email.trim()) {
      Alert.alert('Error', '邮箱不能为空');
      return; // 终止函数执行
    }
  
    if (!password.trim()) {
      Alert.alert('Error', '密码不能为空');
      return; // 终止函数执行
    }
  
    console.log("Email:", email); // 打印邮箱
    console.log("Password:", password); // 打印密码
  
    try {
      const response = await axios.post('http://localhost:5050/auth/register', {
        email,
        password,
      });
      Alert.alert('Success', response.data.message);
      navigation.navigate('Login');
    } catch (error) {
      console.error(error); // 打印错误信息
      Alert.alert('Error', error.response.data.message || 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>注册页面</Text>
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
        title="确认注册" 
        backgroundColor="#f0c040" 
        onPress={handleRegister} 
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

export default RegisterScreen;