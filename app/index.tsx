import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { apiService } from '../services/api';
import { Student } from '../types/student';
import StudentCard from '../components/StudentCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

export default function HomeScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const fetchStudents = useCallback(async () => {
    try {
      const data = await apiService.getStudents();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    const filtered = students.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [search, students]);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await apiService.deleteStudent(id);
      fetchStudents();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  if (loading && !refreshing) return <Loading />;

  return (
    <View style={styles.container}>
      <SearchBar value={search} onChangeText={setSearch} />
      
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StudentCard student={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 15,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
