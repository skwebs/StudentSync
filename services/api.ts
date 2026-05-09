import axios from 'axios';
import { CONFIG } from '../constants/Config';
import { Student, StudentInput } from '../types/student';

const API_URL = CONFIG.API_URL;

export const apiService = {
  getStudents: async (): Promise<Student[]> => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  addStudent: async (student: StudentInput): Promise<void> => {
    try {
      await axios.post(API_URL, {
        action: 'addStudent',
        ...student,
      });
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  },

  updateStudent: async (student: Student): Promise<void> => {
    try {
      await axios.post(API_URL, {
        action: 'updateStudent',
        ...student,
      });
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  deleteStudent: async (id: string): Promise<void> => {
    try {
      await axios.post(API_URL, {
        action: 'deleteStudent',
        id,
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },
};
