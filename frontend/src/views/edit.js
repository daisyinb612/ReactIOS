import React, { useRef, useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

const EditScreen = ({ navigation }) => {
  const inputRef = useRef(null);
  const route = useRoute();
  const { note } = route.params; 
  const [editedContent, setEditedContent] = useState(note.content); // Initialize with note content
  const [editedTitle, setEditedTitle] = useState(note.title); // Initialize with note title

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5050/notes/${note.id}`, {
        title: editedTitle, // Send the updated title
        content: editedContent, // Send the updated content
      });
      Alert.alert('Success', response.data.message); // Show success message
      navigation.navigate('Manage', { refresh: true }); // Navigate back with refresh flag
    } catch (error) {
      console.error("Error updating note:", error);
      Alert.alert('Error', 'Failed to update note'); // Show error message
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
      <Button title="Save" onPress={handleSave} /> {/* Add a save button */}
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