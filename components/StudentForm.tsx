import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { StudentInput } from '../types/student';

interface Props {
  initialValues?: StudentInput;
  onSubmit: (values: StudentInput) => void;
  loading: boolean;
}

const StudentForm: React.FC<Props> = ({ initialValues, onSubmit, loading }) => {
  const [form, setForm] = useState<StudentInput>(
    initialValues || { name: '', class: '', roll: '', mobile: '' }
  );

  const handleChange = (name: keyof StudentInput, value: string) => {
    setForm({ ...form, [name]: value });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(v) => handleChange('name', v)}
        placeholder="Enter student name"
      />

      <Text style={styles.label}>Class</Text>
      <TextInput
        style={styles.input}
        value={form.class}
        onChangeText={(v) => handleChange('class', v)}
        placeholder="e.g. 10"
      />

      <Text style={styles.label}>Roll No</Text>
      <TextInput
        style={styles.input}
        value={form.roll}
        onChangeText={(v) => handleChange('roll', v)}
        placeholder="e.g. 23"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Mobile No</Text>
      <TextInput
        style={styles.input}
        value={form.mobile}
        onChangeText={(v) => handleChange('mobile', v)}
        placeholder="Enter mobile number"
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={() => onSubmit(form)}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Processing...' : 'Save Student'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StudentForm;
