import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { apiService } from '../services/api';
import StudentForm from '../components/StudentForm';
import { StudentInput } from '../types/student';

export default function AddStudentScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: StudentInput) => {
    if (!values.name || !values.class || !values.roll || !values.mobile) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      await apiService.addStudent(values);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to add student');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StudentForm onSubmit={handleSubmit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
