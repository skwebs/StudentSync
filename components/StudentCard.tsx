import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Student } from '../types/student';
import { useRouter } from 'expo-router';

interface Props {
  student: Student;
  onDelete: (id: string) => void;
}

const StudentCard: React.FC<Props> = ({ student, onDelete }) => {
  const router = useRouter();

  const handleDelete = () => {
    Alert.alert(
      'Delete Student',
      `Are you sure you want to delete ${student.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(student.id) },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.details}>Class: {student.class} | Roll: {student.roll}</Text>
        <Text style={styles.details}>Mobile: {student.mobile}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => router.push({ pathname: '/edit/[id]', params: { id: student.id, student: JSON.stringify(student) } })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default StudentCard;
