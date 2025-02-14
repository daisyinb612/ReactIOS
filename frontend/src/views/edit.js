import React, { useRef, useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Button, Alert, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

const EditScreen = ({ navigation }) => {
  const inputRef = useRef(null);
  const route = useRoute();
  const { note } = route.params; 
  const [editedContent, setEditedContent] = useState(note.content); 
  const [editedTitle, setEditedTitle] = useState(note.title); 
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const uploadImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo', // 选择照片
        includeBase64: false, // 是否包含 base64 编码
      },
      (response) => {
        if (response.didCancel) {
          console.log('用户取消了选择');
        } else if (response.error) {
          console.error('ImagePicker 错误: ', response.error);
        } else {
          const uri = response.assets[0].uri; // 获取选中的图片 URI
          setImageUri(uri); // 设置选中的图片 URI
          // 这里可以调用上传函数
          uploadImageToServer(uri);
        }
      }
    );
  };

  const uploadImageToServer = (uri) => {
    const formData = new FormData();
    const fileName = uri.split('/').pop();
    const fileType = fileName.split('.').pop();

    formData.append('image', {
      uri: uri,
      type: `image/${fileType}`,
      name: fileName,
    });

    fetch('http://localhost:5050/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('上传成功:', data);
        if (data.url) setImageUri(data.url);
      })
      .catch((error) => console.error('上传错误:', error));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5050/notes/${note.id}`, {
        title: editedTitle, 
        content: editedContent, 
      });
      Alert.alert('Success', response.data.message); 
      navigation.navigate('Manage', { refresh: true }); 
    } catch (error) {
      console.error("Error updating note:", error);
      Alert.alert('Error', 'Failed to update note'); 
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
    >
      <TextInput
        ref={inputRef}
        style={styles.textInput}
        placeholder="Title"
        value={editedTitle} 
        onChangeText={setEditedTitle} 
      />
      <TextInput
        style={styles.textInput}
        placeholder="开始输入..."
        multiline
        value={editedContent}
        onChangeText={setEditedContent} 
      />
      <Button title="Upload Image" onPress={uploadImage} /> 
      <View style={{ alignItems: 'center' }}>
        <Image 
          source={imageUri ? { uri: imageUri } : require('../assets/images/image.jpg')} 
          style={{ width: 100, height: 100 }} 
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Button title="Save" onPress={handleSave} />
      </View>
    </KeyboardAwareScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    height: 200, // 确保输入框有足够高度
  },
});

export default EditScreen;