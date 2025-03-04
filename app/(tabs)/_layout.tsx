import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, ScrollView, View, Text, ActivityIndicator, StatusBar, Keyboard } from 'react-native';
import { Stack } from 'expo-router';
import { Searchbar } from 'react-native-paper';
import { TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { useRouter } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Icon from 'react-native-vector-icons/Ionicons';
import { getStoriesBySearch } from '@/api/api';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const searchInputRef = React.useRef<any>(null);
  const [showResults, setShowResults] = React.useState(false);
  const [results, setResults] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const onSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
    console.log('vao');
      // Gọi API search
      const data = await getStoriesBySearch(searchQuery);
      console.log(data);
      
      setResults(data || []); // API trả về array trực tiếp, không có field 'items'
      setShowResults(true);
    } catch (err) {
      setError('Lỗi kết nối, vui lòng thử lại');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Thêm debounce nếu muốn search real-time
  React.useEffect(() => {
    if (searchQuery.trim()) {
      const debounceTimer = setTimeout(onSearch, 500);
      return () => clearTimeout(debounceTimer);
    }
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
    searchInputRef.current?.blur();
    Keyboard.dismiss();
  };

  const handleCancelSearch = () => {
    handleClearSearch();
    router.back();
  };

  const handleItemPress = (item: any) => {
    router.push({
        pathname: '/StoryDetail',
        params: { 
            urlStory: item.urlStory 
        }
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea]}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FF0000',
          tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: Platform.select({
              android: Colors[colorScheme ?? 'light'].background,
              ios: 'transparent'
            }),
            elevation: 0,
          },
          headerTitle: '',
          headerTransparent: Platform.OS === 'ios',
          headerSearchBarOptions: {
            placeholder: 'Tìm kiếm truyện',
            onChangeText: (event) => setSearchQuery(event.nativeEvent.text),
            onBlur: handleClearSearch,
            ...(Platform.OS === 'android' && {
              inputBackgroundColor: Colors[colorScheme ?? 'light'].searchBackground,
              headerIconColor: Colors[colorScheme ?? 'light'].tabIconDefault,
              textColor: Colors[colorScheme ?? 'light'].text,
            }),
            onClose: handleClearSearch,
          },
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Tủ Truyện',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="story-collection"
          options={{
            title: 'Khám Phá',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="category"
          options={{
            title: 'Thể Loại',
            tabBarIcon: ({ color }) => <Icon size={28} name="bar-chart" color={color} />,
          }}
        />
        <Tabs.Screen
          name="(account)"
          options={{
            title: 'Tài Khoản',
            tabBarIcon: ({ color }) => <Icon size={28} name="person" color={color} />,
            headerSearchBarOptions: undefined,
          }}
        />
      </Tabs>

      {showResults && (
        <ScrollView 
          style={styles.resultsContainer}
          keyboardShouldPersistTaps="handled"
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors[colorScheme ?? 'light'].tint} />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : results.length > 0 ? (
            results.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.resultItem}
                onPress={() => handleItemPress(item)}
              >
                <Text>{item.nameStory}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text>Không tìm thấy kết quả</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Platform.OS === 'android' ? Colors.light.background : 'transparent',
  },
  searchbar: {
    marginHorizontal: 0,
    elevation: 0,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  resultsContainer: {
    ...StyleSheet.absoluteFillObject,
    top: 125,
    backgroundColor: 'white',
    zIndex: 1,
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    backgroundColor: '#f5f5f5',
    paddingTop: StatusBar.currentHeight,
    width: '100%',
  },
});
