import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/hooks/auth-context'; // Only import AuthProvider here
import { Searchbar } from 'react-native-paper';
import { TouchableOpacity, SafeAreaView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const WhiteTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff', // Màu nền trắng
    text: '#333333', // Màu chữ đậm
    card: '#f5f5f5', // Màu nền header
    border: '#e0e0e0', // Màu viền
  },
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const [searchQuery, setSearchQuery] = useState('');

    const onSearch = () => {
        // Điều hướng đến màn hình tìm kiếm với searchQuery
        // ... logic điều hướng ...
    };

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <AuthProvider>
            <ThemeProvider value={WhiteTheme}>
                <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                    <Stack initialRouteName="(tabs)">
                        <Stack.Screen 
                            name="(tabs)" 
                            options={{ 
                                headerShown: false
                            }} 
                        />
                        <Stack.Screen name="+not-found" />
                        <Stack.Screen name="StoryDetail" options={{ headerTitle: 'Thông Tin Truyện' }} />
                        <Stack.Screen name="StoryContent" options={{ headerTitle: 'Truyện' }} />
                        <Stack.Screen name="ListStoryByCategory" options={{ headerTitle: 'Thể Loại' }} />
                    </Stack>
                    <StatusBar style="dark" />
                </View>
            </ThemeProvider>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop:20,
    },
    searchbar: {
        width: '80%',
        paddingVertical: 0,
        padding:0,
        margin:10,
    },
    settingsButton: {
        position: 'absolute',
        right: 10,
        paddingTop:33,
    },
});