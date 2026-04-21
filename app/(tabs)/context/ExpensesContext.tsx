import { createContext, useContext, useState } from 'react'

type Expense = { 
    id: number
    name: string
    amount: number
    timeStamps: Date
    category: string
    transactionType: 'debit' | 'credit' | string 
}

type ExpenseContextType = {
    expenses: Expense[]
    setExpenses: (expenses: Expense[]) => void
    balance: number
    setBalance: (balance: number) => void
}

const ExpenseContext = createContext<ExpenseContextType | null>(null)

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [balance, setBalance] = useState(0)

    return (
        <ExpenseContext.Provider value={{ expenses, setExpenses, balance, setBalance }}>
            {children}
        </ExpenseContext.Provider>
    )
}

export function useExpenses() {
    const context = useContext(ExpenseContext)
    if (!context) throw new Error('useExpenses must be used within ExpenseProvider')
    return context
}