import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Student List' }} />
      <Stack.Screen name="add" options={{ title: 'Add Student' }} />
      <Stack.Screen name="edit/[id]" options={{ title: 'Edit Student' }} />
    </Stack>
  );
}
