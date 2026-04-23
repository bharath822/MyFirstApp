import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'

    export default function UsersScreen() {
        type User = {
  id: number
  name: string
  email: string
  phone: string
}
    const [users, setUsers] = useState<User[]>([])       // empty array to start
  const [loading, setLoading] = useState(true) // show loading state

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      const data = await response.json()
      setUsers(data)
      setLoading(false)
    } catch (error) {
      console.log('Error:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
  <View style={styles.container}>
    <FlatList
      data={users}
      keyExtractor={(user) => user.id.toString()}
      ListHeaderComponent={
        <Text style={styles.title}>Users</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <Text style={styles.phone}>{item.phone}</Text>
        </View>
      )}
    />
  </View>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 60,
    color: '#153a13'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,  // Android shadow
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  phone: {
    fontSize: 14,
    color: '#999999',
  }
})