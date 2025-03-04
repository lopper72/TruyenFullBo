import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

import axios from 'axios';
import cheerio from 'react-native-cheerio';      // Đảm bảo bạn import đúng
import {getAllCategories} from '../../api/api';



interface category {
  name: string;
  url: string;
  // Add other required properties from your API response
  slug?: string;
  count?: number;
}

const url = 'https://truyenfull.vision';  

const CategoryScreen = () => {
  const [stories, setStories] = useState<category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCategories(url);
        console.log('Fetched data:', JSON.stringify(data, null, 2));  // Modified log
        setStories(data as category[]);
      } catch (error) {
        console.error('Fetch error:', error);  // Add error handling
      }
    };

    console.log('Component mounted');  // Test if useEffect runs
    fetchData();
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Thể Loại</Text>
      <FlatList
        data={stories}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Link href={{ 
            pathname: "/ListStoryByCategory", 
            params: { 
              url: item.url,
              name: item.name
            } 
          }} asChild>
            <TouchableOpacity>
              <View style={styles.itemContainer}>
                <Text style={styles.storyName}>{item.name}</Text>
                {item.count && <Text style={styles.storyCount}>{item.count} truyện</Text>}
              </View>
            </TouchableOpacity>
          </Link>
        )}
        keyExtractor={(item) => item.slug || item.name}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2d2d2d',
    marginVertical: 20,
    alignSelf: 'flex-start',
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  storyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 4,
  },
  storyCount: {
    fontSize: 14,
    color: '#6c757d',
  },
});

export default CategoryScreen;
