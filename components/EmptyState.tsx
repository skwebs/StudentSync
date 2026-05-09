import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  message?: string;
}

const EmptyState: React.FC<Props> = ({ message = 'No students found.' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
});

export default EmptyState;
