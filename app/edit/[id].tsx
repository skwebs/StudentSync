import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { apiService } from '../../services/api';
import StudentForm from '../../components/StudentForm';
import { Student, StudentInput } from '../../types/student';

export default function EditStudentScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id, student } = useLocalSearchParams();
  
  const initialStudent: Student = student ? JSON.parse(student as string) : null;

  const handleSubmit = async (values: StudentInput) => {
    if (!values.name || !values.class || !values.roll || !values.mobile) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      await apiService.updateStudent({ id: id as string, ...values });
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update student');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {initialStudent && (
        <StudentForm 
          initialValues={initialStudent} 
          onSubmit={handleSubmit} 
          loading={loading} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
