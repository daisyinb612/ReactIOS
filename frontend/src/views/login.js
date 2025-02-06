import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // 新增
import Button from '../components/button';
import Input from '../components/input';

const LoginScreen = () => {
  const navigation = useNavigation(); // 获取导航对象

  return (
    <View style={styles.container}>
      <Text style={styles.title}>登录页面</Text>
      <Text style={styles.label}>用户名</Text>
      <Input placeholder="Username" />
      <Text style={styles.label}>密码</Text>
      <Input placeholder="Password" secureTextEntry />
      <Button title="登录" backgroundColor="#f0c040" 
        onPress={() => navigation.navigate('Manage')} />
      <Button 
        title="注册" backgroundColor="#ccc" 
        onPress={() => navigation.navigate('Register')} // 跳转逻辑
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
