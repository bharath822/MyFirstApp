import { creditCategories, debitCategories } from "./constants/categories";
import { useExpenses } from "./context/ExpensesContext";
import { PieChart } from 'react-native-chart-kit'
import { Dimensions, View, Text, StyleSheet } from 'react-native'

const screenWidth = Dimensions.get('window').width


export default function StatsScreen() {
    const { expenses } = useExpenses()
    const debits = expenses.filter(expense => expense.transactionType === 'debit')
    const credits = expenses.filter(expense => expense.transactionType === 'credit')
    const totalDebits = debits.reduce((sum, expense) => sum + expense.amount, 0)
    const totalCredits = credits.reduce((sum, expense) => sum + expense.amount, 0)

    const debitCategoryTotals = debits.reduce((totals, expense) => {
        const key = debitCategories.includes(expense.category) ? expense.category : 'Other'
        totals[key] = (totals[key] || 0) + expense.amount
        return totals
    }, {} as { [key: string]: number })
    const creditCategoryTotals = credits.reduce((totals, expense) => {
        const key = creditCategories.includes(expense.category) ? expense.category : 'Other'
        totals[key] = (totals[key] || 0) + expense.amount
        return totals
    }, {} as { [key: string]: number })
    const colors = ['#f00', '#00f', '#0f0', '#ff0', '#f0f']

    const debitChartData = Object.entries(debitCategoryTotals).map(([category, amount], index) => ({
        name: category,
        amount: amount,
        color: colors[index % colors.length],  // cycles through colors
        legendFontColor: '#333',
        legendFontSize: 12
    }))
    const creditChartData = Object.entries(creditCategoryTotals).map(([category, amount], index) => ({
        name: category,
        amount: amount,
        color: colors[index % colors.length],  // cycles through colors
        legendFontColor: '#333',
        legendFontSize: 12
    }))

    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
        <Text style = {styles.title}>Debit Stats</Text>
        {totalDebits === 0 ? (
            <Text>No debit transactions to display</Text>
        ) : (
            <PieChart
                data={debitChartData}
                width={screenWidth}
                height={220}
                chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
            />)}
            <Text style={styles.title}>Credit Stats</Text>
            {totalCredits === 0 ? (
            <Text>No credit transactions to display</Text>
        ) : (
            <PieChart
                data={creditChartData}
                width={screenWidth}
                height={220}
                chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
            />)}
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 15,
        color: '#153a13'
     }  
})