import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';

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
        renderItem={({ item, index }) => (
          <Text key={index} style={styles.story}>{item.name}</Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  story: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
});

export default CategoryScreen;
