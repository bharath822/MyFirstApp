import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'

export default function Counter() {
  const [currentValue, setCurrentValue] = useState({
  value: 0,
  steps: 0  // tracks how many times buttons were pressed
})
useEffect(() => {
  console.log('Counter screen loaded!')
}, [0])
  return (
    <View style={styles.container}>
      <Text style={styles.count}>value:{currentValue.value} {' '}steps:{currentValue.steps}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentValue({ ...currentValue, value: currentValue.value - 1, steps: currentValue.steps + 1 })}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentValue({ ...currentValue, value: currentValue.value + 1, steps: currentValue.steps + 1 })}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentValue({ ...currentValue, value: 0, steps: 0 })}
        >
          <Text style={styles.buttonText}>reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  count: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#153a13'
  },
  buttons: {
    flexDirection: 'row',
    gap: 20
  },
  button: {
    backgroundColor: '#153a13',
    width: 100,
    height: 70,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold'
  }
})