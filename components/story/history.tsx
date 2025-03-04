import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

interface HistoryItem {
  storyId: string;
  chapter: number;
  timestamp: number;
  storyName: string;
}

interface StoryHistory {
  [key: string]: HistoryItem;
}

const HistoryScreen = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('readingHistory');
      if (savedHistory) {
        const historyData: StoryHistory = JSON.parse(savedHistory);
        setHistory(Object.values(historyData));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  const deleteItem = async (timestamp: number) => {
    try {
      const filtered = history.filter(item => item.timestamp !== timestamp);
      await AsyncStorage.setItem('readingHistory', JSON.stringify(filtered));
      setHistory(filtered);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 30) return `${days} ngày trước`;
    return new Date(timestamp).toLocaleDateString('vi-VN');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lịch Sử</Text>
      {history.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có lịch sử đọc truyện</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.storyId}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadHistory().finally(() => setRefreshing(false));
              }}
              colors={['#ff0000']}
              tintColor="#ff0000"
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.historyItem}
              onPress={() => router.push({
                pathname: '/StoryContent',
                params: { 
                  url: item.storyId 
                }
              })}
            >
              <View style={styles.itemContent}>
                <Text style={styles.storyTitle}>{item.storyName}</Text>
                <Text>Chương: {item.chapter}</Text>
                <Text>Thời gian: {getTimeAgo(item.timestamp)}</Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  deleteItem(item.timestamp);
                }}
              >
                <Text style={styles.deleteText}>Xóa</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  historyItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  storyTitle: {
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HistoryScreen;