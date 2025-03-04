import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getStoriesByCategory } from '../api/api';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface Story {
  rowStories: string;
  imgStory: string;
  nameStory: string;
  urlStory: string;

  // Thêm các trường khác cần thiết
}

const ListStoryByCategoryScreen = () => {
  const params = useLocalSearchParams();
  const url = params.url;
  const name = params.name;
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        if (!url) return;
        
        const data = await getStoriesByCategory(url);
        console.log(data);
        setStories(data);
      } catch (err) {
        setError('Không thể tải danh sách truyện');
        console.error('Fetch stories error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [url]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size="large" 
          color="#2d2d2d"
        />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={stories}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.storyItem}
            onPress={() => router.push({
              pathname: '/StoryDetail',
              params: { urlStory: item.urlStory }
            })}
          >
            <Image 
              source={{ uri: item.imgStory }} 
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{item.nameStory}</Text>
              {item.rowStories && <Text style={styles.author}>{item.rowStories}</Text>}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.urlStory || ''}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#2d2d2d',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  storyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  thumbnail: {
    width: 60,
    height: 80,
    borderRadius: 4,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#6c757d',
  },
  separator: {
    height: 1,
    backgroundColor: '#dee2e6',
    marginVertical: 8,
  },
});

ListStoryByCategoryScreen.options = (params: any) => ({
  headerTitle: `Thể Loại: ${params.name || ''}`,
  headerTitleStyle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d2d2d'
  }
});

export default ListStoryByCategoryScreen; 