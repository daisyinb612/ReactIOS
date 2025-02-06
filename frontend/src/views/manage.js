import React from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const notes = [
  { id: '1', title: 'Title', time: 'Time', firstRow: 'First Row', folder: 'Folder' },
  { id: '2', title: 'Title', time: 'Time', firstRow: 'First Row', folder: 'Folder' },
  { id: '3', title: 'Title', time: 'Time', firstRow: 'First Row', folder: 'Folder' },
  { id: '4', title: 'Title', time: 'Time', firstRow: 'First Row', folder: 'Folder' },
  { id: '5', title: 'Title', time: 'Time', firstRow: 'First Row', folder: 'Folder' },
];

const Manage = () => {
  const navigation = useNavigation();
  const renderNote = ({ item }) => (
    <TouchableOpacity
      style={styles.noteContainer}
      onPress={() => navigation.navigate('Edit', { noteId: item.id })}
    >
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteDetails}>{item.time}  {item.firstRow}</Text>
      <Text style={styles.noteFolder}>{item.folder}</Text>
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
      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={item => item.id}
        style={styles.notesList}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>7 Notes</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add-circle" size={28} color="#FFD700" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#FFD700',
    marginLeft: 4,
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
  noteFolder: {
    color: '#666',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
  },
  footerText: {
    color: '#666',
  },
  addButton: {
    padding: 8,
  },
});

export default Manage;
