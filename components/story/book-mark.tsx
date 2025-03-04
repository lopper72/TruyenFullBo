import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookmarkScreen() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadBookmarks = async () => {
    const stored = await AsyncStorage.getItem('bookmarks');
    if (stored) setBookmarks(JSON.parse(stored));
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBookmarks();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push({
        pathname: '/StoryDetail',
        params: { urlStory: item.urlStory }
      })}
    >
      <Image source={{ uri: item.imgStory }} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={bookmarks}
      renderItem={renderItem}
      keyExtractor={(item) => item.truyenID}
      contentContainerStyle={styles.container}
      ListEmptyComponent={<Text style={styles.emptyText}>Chưa có truyện được đánh dấu</Text>}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  image: {
    width: 50,
    height: 75,
    borderRadius: 4,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    flexShrink: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});