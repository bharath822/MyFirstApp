import { StyleSheet, TextInput, View, Text, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { supabase } from "../lib/supabase"; // Make sure your path is correct

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false); // Toggle Logic

    async function handleAuth() {
        setLoading(true);

        // 1. LOCAL CHECKER (The Guard)
        if (email.trim() === "" || password.trim() === "") {
            Alert.alert("Error", "Please fill in all fields before submitting.");
            setLoading(false);
            return; // This 'return' stops the function so Supabase is never called
        }
        
        if (isSignUp) {
            // SIGN UP LOGIC
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                // Note: Sign up date is automatically tracked by Supabase as 'created_at'
            });
            if (error) Alert.alert("Sign Up Error", error.message);
            else Alert.alert("Check your email for verification!");
        } else {
            // LOGIN LOGIC (Verification)
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) Alert.alert("Login Error", error.message);
        }
        
        setLoading(false);
    }
    const handleForgotPassword = async () => {
        if (email.trim() === "") {
            Alert.alert("Error", "Please enter your email first");
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://yourapp.com/update-password', // todo: We will configure this later in Expo
        });

        if (error) Alert.alert("Error", error.message);
        else Alert.alert("Success", "Check your email for the reset link!");
    };

    return (
        <View style={Styles.container}>
            <Text style={Styles.title}>{isSignUp ? "Create Account" : "Login"}</Text>
            
            <TextInput 
                style={Styles.input}
                placeholder="Enter Email" 
                value={email} 
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput 
                style={Styles.input}
                placeholder="Enter Password" 
                secureTextEntry 
                value={password} 
                onChangeText={setPassword} 
            />
            {/* Show Forgot Password ONLY when NOT in Sign Up mode */}
            {!isSignUp && (
                <TouchableOpacity onPress={handleForgotPassword} style={{ alignSelf: 'flex-end', marginBottom: 15 }}>
                    <Text style={{ color: 'blue', fontSize: 12 }}>Forgot Password?</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity 
                style={[Styles.mainButton, { opacity: loading ? 0.5 : 1 }]} 
                onPress={handleAuth}
                disabled={loading}
            >
                <Text style={Styles.buttonText}>{loading ? "Processing..." : (isSignUp ? "Sign Up" : "Login")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={Styles.toggleText}>
                    {isSignUp ? "Already have an account? Login" : "New here? Create account"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const Styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f0f0f0' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
    mainButton: { backgroundColor: 'blue', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonText: { color: 'white', fontWeight: 'bold' },
    toggleText: { marginTop: 20, textAlign: 'center', color: 'blue' }
});