import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/auth-context'; // Adjust path as needed
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function ProtectedLayout() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/(tabs)/(account)/login');
        }
    }, [isAuthenticated, router]);

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="user-profile" options={{ headerShown: false }} />
        </Stack>
    );
}