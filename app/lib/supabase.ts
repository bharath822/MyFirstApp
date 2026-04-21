import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const ExpoSecureStoreAdapter = {
    getItem: (key: string) => SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

const supabaseUrl = 'https://qgsmrgynfjmlhylrfknk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnc21yZ3luZmptbGh5bHJma25rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODMzMTksImV4cCI6MjA4OTU1OTMxOX0.OhxZdh8ZEEfjfQSsC7xu2eGL3owWFTPkuFpbgdSMT3w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})