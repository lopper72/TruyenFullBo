import { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/auth-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

interface User {
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	gender: string;
	image: string;
	accessToken: string;
}

const LoginScreen = () => {
    const [email, setEmail] = useState<string>("emilys");
	const [password, setPassword] = useState<string>("emilyspass");
	const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
			Alert.alert("Error", "Tài khoản, mật khẩu không được để trống");
			return;
		}

		try {
			const response = await axios.post("https://dummyjson.com/auth/login", {
				username: email,
				password: password,
			});
			if (response.data.accessToken) {
				const userDemo: User = response.data as User;
                await login(userDemo.accessToken, userDemo);
				Alert.alert("Success", "Đăng nhập thành công!");
				router.replace("/(tabs)");
			} else {
				Alert.alert(
					"Error",
					response.data.message || "Đăng nhập thất bại. Vui lòng thử lại."
				);
			}
		} catch (error: any) {
			let errorMessage = error.response.data.message;
			Alert.alert("Error", errorMessage);
		}
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.logo}>📱</Text>
            <Text style={styles.welcomeText}>Welcome back.</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
            />

            <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signUpButton}>
                <Text style={styles.signUpText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#ffffff', // White background with dotted pattern (you can add a backgroundImage or pattern)
    },
    logo: {
        fontSize: 60, // Placeholder for logo; replace with actual image size
        textAlign: 'center',
        marginBottom: 20,
        color: '#7E57C2', // Purple color matching the logo in the image
    },
    welcomeText: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 30,
        color: '#333333',
        fontWeight: '600',
    },
    input: {
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#F9F9F9',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#007AFF', // Purple color for the link
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    loginButton: {
        backgroundColor: '#007AFF', // Purple button
        paddingVertical: 15,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpButton: {
        alignItems: 'center',
    },
    signUpText: {
        color: '#666666',
        fontSize: 14,
    },
});
export default LoginScreen;
