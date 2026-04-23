import { useState } from "react";
import { ScrollView, TextInput, TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { FlatList } from "react-native";
import { Ionicons } from '@expo/vector-icons'
import { Modal } from 'react-native'
import { creditCategories, debitCategories } from "../(tabs)/constants/categories";
import { useExpenses } from "../(tabs)/context/ExpensesContext";
import { Link } from 'expo-router';

type expense = { 
    id: string
    name: string
    amount: number
    created_at: string | null
    category: string
    transaction_type: 'debit' | 'credit' | string 
}


export default function ExpenseTrackerScreen() {
   const { expenses, balance, addExpense, deleteExpense, updateExpense, loading } = useExpenses();
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        category: '',
        transaction_type: ''
    })
    const [editExpenseData, setEditExpenseData ] = useState({
        name: '',
        amount: '',
        category: '',
        transaction_type: ''
    })
    const [editCustomCategory, setEditCustomCategory] = useState('')
    const [customCategory, setCustomCategory] = useState('')
    const [editingExpense, setEditingExpense] = useState<expense | null>(null)

    if (loading) return <Text>Loading...</Text>;

    const setCategoryOptions = (transactionType: string) => {
        if (transactionType === 'credit') {
            return creditCategories
        } else if (transactionType === 'debit') {
            return debitCategories
        } else {
            return []
        }
    }
    const handleAddExpense = async () => {
        const finalCategory = formData.category === 'Other' ? customCategory : formData.category;
        try {
            await addExpense({
                name: formData.name,
                amount: parseFloat(formData.amount),
                category: finalCategory,
                transaction_type: formData.transaction_type,
            });
            clearForm();
        } catch (error) {
            console.error('Failed to add expense:', error);
        }
    };
    const clearForm = () => {
        setFormData({
            name: '',
            amount: '',
            category: '',
            transaction_type: '',
        })
        setCustomCategory('')
    }
    const handleChange = (field: string, value: string) => {
        if (field === 'transaction_type') {
            setFormData({...formData, [field]: value, category: '' })
        }
        else{setFormData({ ...formData, [field]: value })}     
    }
    const handleDelete = async (id: string) => { // Change id to string
        try {
            await deleteExpense(id);
        } catch (error) {
            console.error('Failed to delete expense:', error);
        }
    };

    const handleSave = async () => {
        if (!editingExpense) return;
        try {
            await updateExpense(editingExpense.id, {
                ...editExpenseData,
                amount: parseFloat(editExpenseData.amount),
                category: editExpenseData.category === 'Other' ? editCustomCategory : editExpenseData.category,
            });
            setEditingExpense(null);
        } catch (error) {
            console.error('Failed to update expense:', error);
        }
    };

    if (loading) return <Text>Loading...</Text>;

    return (
        <View style={{ flex: 1 }}>
        <View
         style={styles.container}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'left', }}>Add Expense</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="#999"
            value={formData.amount}
            onChangeText={(value) => handleChange('amount', value)}
            keyboardType="numeric"
        />
        <TextInput
            style={styles.input}
            placeholder="Enter name"
            placeholderTextColor="#999"
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
        />
        <Picker
            mode="dropdown"
            selectedValue={formData.transaction_type}
            onValueChange={(itemValue) => handleChange('transaction_type', itemValue)}
            style={styles.input}
        >
            <Picker.Item label="Select Transaction Type" value="" style={{ fontSize: 12 }} />
            <Picker.Item label="Debit" value="debit" style={{ fontSize: 12 }} />
            <Picker.Item label="Credit" value="credit" style={{ fontSize: 12 }} />
        </Picker>
        <Picker
            mode="dropdown"
            selectedValue={formData.category}
            onValueChange={(itemValue) => handleChange('category', itemValue)}
            style={styles.input}
        >   
        <Picker.Item label="Select Category" value="" style={{ fontSize: 12 }} />
        {setCategoryOptions(formData.transaction_type).map((category, index) => (
                <Picker.Item label={category} value={category} style={{ fontSize: 12 }} key={index}/>))}
        </Picker>
        {formData.category === 'Other' && (
            <TextInput
                placeholder="Enter custom category"
                placeholderTextColor="#999"
                style={styles.input}
                value={customCategory}
                onChangeText={(value) => setCustomCategory(value)}
            />
        )}
        <View style={styles.buttons}>
        <TouchableOpacity
                  style={styles.button}
                  onPress={handleAddExpense}
                >
                  <Text style={styles.buttonText}>Add Expense</Text>
                </TouchableOpacity>
        <TouchableOpacity
                  style={styles.button}
                  onPress={clearForm}
                >
                  <Text style={styles.buttonText}>Clear form</Text>
                </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>Current Balance : {balance.toFixed(2)} Rs
            <Link href="/statsScreen" style={{ color: 'blue', fontSize: 14, marginLeft: 10 }}>View Stats</Link>
        </Text>
        </View>
        <View style={ styles.transactionContainer }>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Transactions</Text>
        {expenses.length === 0 ? (
            <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', paddingTop: 20 }}>
                No transactions yet
            </Text>
        ): (
            <FlatList
                data={expenses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const isDebit = item.transaction_type === 'debit';
                    return (
                        <View style={styles.transactionItem}> 
                            <View>
                                <Text>{isDebit ? 'Sent to' : 'Received from'} {item.name}</Text>
                                <Text>Category: {item.category}</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setEditingExpense(item)
                                        setEditExpenseData({
                                            name: item.name,
                                            amount: item.amount.toString(),
                                            category: item.category,
                                            transaction_type: item.transaction_type
                                        })
                                    }}
                                >
                                    <Ionicons name="pencil-outline" size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={{ color: isDebit ? 'red' : 'green' }}>  {isDebit ? '-' : '+'} {item.amount.toString()} </Text>
                                <Text>{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</Text>
                                <TouchableOpacity
                                    onPress={() => handleDelete(item.id)}
                                >
                                    <Ionicons name="trash-outline" size={20} color="red" />
                                </TouchableOpacity>
                            </View>
                    </View>
                    )
                }}
            />
        )}
        </View>
        <Modal
            visible={editingExpense !== null}
            transparent={true}
            animationType="slide"
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <ScrollView style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10, maxHeight: '80%' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Edit Expense</Text>
                    <TextInput
                        style={styles.input}
                        value={editExpenseData.amount.toString()}
                        onChangeText={(value) => setEditExpenseData({ ...editExpenseData, amount: value })}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        value={editExpenseData.name}
                        onChangeText={(value) => setEditExpenseData({ ...editExpenseData, name: value })}
                    />
                    <Picker
                        mode="dropdown"
                        style={styles.input}
                        selectedValue={editExpenseData.transaction_type}
                        onValueChange={(itemValue) => setEditExpenseData({ ...editExpenseData, transaction_type: itemValue, category: '' })}
                    >
                        <Picker.Item label="Select Transaction Type" value="" style={{ fontSize: 12 }} />
                        <Picker.Item label="Credit" value="credit" style={{ fontSize: 12 }} />
                        <Picker.Item label="Debit" value="debit" style={{ fontSize: 12 }} />
                    </Picker>
                    <Picker
                        mode="dropdown"
                        selectedValue={editExpenseData.category}
                        onValueChange={(itemValue) => setEditExpenseData({ ...editExpenseData, category: itemValue })}
                        style={styles.input}
                    >   {setCategoryOptions(editExpenseData.transaction_type).map((category, index) => (
                            <Picker.Item label={category} value={category} style={{ fontSize: 12 }} key={index}/>))}
                    </Picker>
                    {editExpenseData.category === 'Other' && (
                        <TextInput
                            placeholder="Enter custom category"
                            style={styles.input}
                            value={editCustomCategory}
                            onChangeText={(value) => setEditCustomCategory(value)}
                        />
                    )}
                     <View style={styles.buttons}>
                    <TouchableOpacity
                        style={[styles.button, { alignSelf: 'flex-end', marginTop: 20 }]}
                        onPress={() => setEditingExpense(null)}
                    >
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { alignSelf: 'flex-end', marginTop: 20 }]}
                        onPress={() => handleSave()} 
                    >
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 15,
        paddingTop: 30,
        alignItems: 'flex-start',
        backgroundColor : '#f5f5f5'
    },
    input: {
        width: '80%',
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontSize: 12,
        color: "#000"
    },
    button: {
        backgroundColor: '#153a13',
        width: 140,
        height: 35,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttons: {
        flexDirection: 'row',
        gap: 40
    },
    transactionContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 0.5,
        borderRadius: 0.5,
        padding: 15
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    }
})