import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Expense = { 
    id: string;
    name: string;
    amount: number;
    created_at: string | null;
    category: string;
    transaction_type: 'debit' | 'credit' | string;
};

type ExpenseContextType = {
    expenses: Expense[];
    balance: number;
    addExpense: (expense: Omit<Expense, 'id' | 'created_at'>) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
    loading: boolean;
};

const ExpenseContext = createContext<ExpenseContextType | null>(null);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUserId(session?.user?.id || null);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserId(session?.user?.id || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchExpenses();
        } else {
            setExpenses([]);
            setBalance(0);
            setLoading(false);
        }
    }, [userId]);

    const fetchExpenses = async () => {
        if (!userId) return;

        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching expenses:', error);
        } else {
            setExpenses(data || []);
            // Calculate balance from expenses
            const calculatedBalance = data?.reduce((acc, exp) => {
                return exp.transaction_type === 'debit' ? acc - exp.amount : acc + exp.amount;
            }, 0) || 0;
            setBalance(calculatedBalance);
        }
        setLoading(false);
    };

    const addExpense = async (expenseData: Omit<Expense, 'id' | 'created_at'>) => {
        if (!userId) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('expenses')
            .insert({
                ...expenseData,
                user_id: userId,
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding expense:', error);
            throw error;
        } else {
            setExpenses(prev => [data, ...prev]);
            setBalance(prev => expenseData.transaction_type === 'debit' ? prev - expenseData.amount : prev + expenseData.amount);
        }
    };

    const deleteExpense = async (id: string) => {
        const expenseToDelete = expenses.find(e => e.id === id);
        if (!expenseToDelete) return;

        const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting expense:', error);
        } else {
            setExpenses(prev => prev.filter(e => e.id !== id));
            setBalance(prev => expenseToDelete.transaction_type === 'debit' ? prev + expenseToDelete.amount : prev - expenseToDelete.amount);
        }
    };

    const updateExpense = async (id: string, updates: Partial<Expense>) => {
        const { error } = await supabase
            .from('expenses')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating expense:', error);
        } else {
            setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
            // Recalculate balance if amount or type changed
            fetchExpenses(); // Or optimize by recalculating locally
            setBalance(prev => {
                const expense = expenses.find(e => e.id === id);
                if (!expense) return prev;

                const oldAmount = expense.amount;
                const oldType = expense.transaction_type;
                const newAmount = updates.amount ?? oldAmount;
                const newType = updates.transaction_type ?? oldType;

                let adjustedBalance = prev;

                // Remove old amount
                adjustedBalance += oldType === 'debit' ? oldAmount : -oldAmount;
                // Add new amount
                adjustedBalance += newType === 'debit' ? -newAmount : newAmount;

                return adjustedBalance;
            });
        }
    };

    return (
        <ExpenseContext.Provider value={{ expenses, balance, addExpense, deleteExpense, updateExpense, loading }}>
            {children}
        </ExpenseContext.Provider>
    );
}

export function useExpenses() {
    const context = useContext(ExpenseContext);
    if (!context) throw new Error('useExpenses must be used within ExpenseProvider');
    return context;
}