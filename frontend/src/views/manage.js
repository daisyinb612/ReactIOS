import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Button, Modal, Alert } from 'react-native';
import { useNavigation, useRoute  } from '@react-navigation/native';
import { useUser } from '../user/UserContext';
import axios from 'axios';

const Manage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [notes, setNotes] = useState([]);
  const { userId } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const fetchNotes = async () => {
    console.log("Current userId:", userId); // 调试信息
    if (userId) {
      try {
        const response = await axios.get(`http://localhost:5050/notes?user_id=${userId}`);
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
        if (error.response) {
          console.error("Response data:", error.response.data); // 打印响应数据
        }
      }
    } else {
      console.warn("userId is not defined or empty."); // 提示信息
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchNotes(); // 每次页面获得焦点时重新获取笔记
    });

    return unsubscribe; // 清理监听器
  }, [navigation]);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchNotes(); // 如果有 refresh 参数，重新获取笔记
    }
  }, [route.params]); // 监听 route.params 的变化


  useEffect(() => {
    console.log("User ID:", userId); // Log the userId
  }, [userId]);

  useEffect(() => {
    const fetchNotes = async () => {
      console.log("Current userId:", userId); // 调试信息
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:5050/notes?user_id=${userId}`);
          setNotes(response.data);
        } catch (error) {
          console.error("Error fetching notes:", error);
          if (error.response) {
            console.error("Response data:", error.response.data); // 打印响应数据
          }
        }
      } else {
        console.warn("userId is not defined or empty."); // 提示信息
      }
    };

    fetchNotes(); // 在组件加载时调用 fetchNotes
  }, [userId]);

  const handleAddNote = async () => {
    if (!newNoteTitle || !newNoteContent) {
      Alert.alert('Error', 'Please enter both title and content'); // 输入验证
      return;
    }

    try {
      const response = await axios.post('http://localhost:5050/addnotes', {
        user_id: userId, // 读取当前页面的 userId
        title: newNoteTitle,
        content: newNoteContent,
      });
      // 处理成功响应
      console.log("Note added:", response.data.note);
      setNotes([...notes, response.data.note]); // 更新笔记列表
  
      // 关闭模态框
      setModalVisible(false);
      // 清空输入框
      setNewNoteTitle('');
      setNewNoteContent('');
    } catch (error) {
      console.error("Error adding note:", error);
      Alert.alert('Error', 'Failed to add note'); // 错误处理
    }
  };

  const deleteNote = async (noteId) => { // Added deleteNote function
    try {
      await axios.delete(`http://localhost:5050/notes/${noteId}`);
      setNotes(notes.filter(note => note.id !== noteId)); // Update state after deletion
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const renderNote = ({ item }) => (
    <TouchableOpacity
      style={styles.noteContainer}
      onPress={() => navigation.navigate('Edit', { note: item })} // Pass the entire note object
    >
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteDetails}>{item.content}</Text>
      <TouchableOpacity onPress={() => deleteNote(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>所有笔记</Text>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="搜索笔记"
      />
      <View style={styles.notesList}>
        <FlatList
          data={notes}
          renderItem={renderNote} // Use the renderNote function
          keyExtractor={item => item.id.toString()}
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{notes.length} Notes</Text>
        <Button title="Add Note" onPress={() => setModalVisible(true)} />
      </View>
      <Modal
        animationType="none" // 取消动画
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.headerTitle}>添加新笔记</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newNoteTitle}
              onChangeText={setNewNoteTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Content"
              value={newNoteContent}
              onChangeText={setNewNoteContent}
              multiline
            />
            <View style={styles.buttonContainer}>
              <Button title="Confirm" onPress={handleAddNote} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明背景
  },
  modalView: {
    width: '80%', // 弹窗宽度
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  searchBar: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginHorizontal: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  notesList: {
    flex: 1,
    marginTop: 8,
  },
  noteContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteDetails: {
    color: '#666',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  footerText: {
    color: '#666',
  },
});

export default Manage;
