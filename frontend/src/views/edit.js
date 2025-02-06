import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';

const EditScreen = () => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
    >
      <TextInput
        ref={inputRef}
        style={styles.textInput}
        placeholder="开始输入..."
        multiline
      />
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
