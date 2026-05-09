import axios from 'axios';
import { CONFIG } from '../constants/Config';
import { Student, StudentInput } from '../types/student';
import { Alert } from 'react-native';

const API_URL = CONFIG.API_URL;

// Simple validation
const validateStudent = (student: StudentInput) => {
  if (!student.name || student.name.trim().length < 2) throw new Error('Valid name is required');
  if (!student.class || student.class.trim().length === 0) throw new Error('Class is required');
  if (!student.roll || student.roll.trim().length === 0) throw new Error('Roll number is required');
  if (!student.mobile || !/^\d{10}$/.test(student.mobile)) throw new Error('Valid 10-digit mobile number is required');
};

const handleApiError = (error: any) => {
  console.error('API Error:', error);
  const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
  Alert.alert('Network Error', message);
  throw error;
};

export const apiService = {
  getStudents: async (): Promise<Student[]> => {
    try {
      if (!API_URL) throw new Error('API_URL is not defined in .env');
      const response = await axios.get(API_URL, { timeout: 10000 });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  addStudent: async (student: StudentInput): Promise<void> => {
    try {
      validateStudent(student);
      await axios.post(API_URL, {
        action: 'addStudent',
        ...student,
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  updateStudent: async (student: Student): Promise<void> => {
    try {
      const { id, ...input } = student;
      validateStudent(input);
      await axios.post(API_URL, {
        action: 'updateStudent',
        ...student,
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteStudent: async (id: string): Promise<void> => {
    try {
      await axios.post(API_URL, {
        action: 'deleteStudent',
        id,
      });
    } catch (error) {
      handleApiError(error);
    }
  },
};
