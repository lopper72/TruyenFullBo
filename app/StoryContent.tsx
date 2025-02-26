import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import { useSearchParams } from 'expo-router/build/hooks';
import {getInfoChapter, getUpdateStory} from '../api/api';
import RenderHTML from 'react-native-render-html';

interface Story {
        chapter: '',
        chapter_prev: null,
        chapter_next: null,
        content: '',
        nameStory: '',
}

export default function StoryContentScreen() {
  const { width } = useWindowDimensions();
  const [story, setStory] = useState<Story | null>(null);

  const url = useSearchParams();
  const urlStory = url.get('url'); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInfoChapter(urlStory);
        console.log('Fetched data:', data); // Log dữ liệu đã lấy
        setStory(data as Story);
      } catch (error) {
        console.error('Error fetching story:', error); // Log lỗi nếu có
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log('Story updated:', story); // Log giá trị story khi nó thay đổi
  }, [story]); // Theo dõi sự thay đổi của story
  
  return (
    <View style={styles.container}>
      {story ? (
        <ScrollView>
          <View style={styles.storyItem}>
            <View style={styles.imageContainer}>
              <Text style={styles.storyTitle}>{story.nameStory}</Text>
              <Text style={styles.chapterText}>Chapter: {story.chapter}</Text>
            
              <RenderHTML
                  contentWidth={width} // Đảm bảo bạn có chiều rộng của container
                  source={{ html: story.content }} // Chuyển đổi HTML thành văn bản
                />    
            </View>
          </View>
        </ScrollView>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  storyItem: {
    flexDirection: 'column',
    marginRight: 10,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  storyImage: {
    width: 100,
    height: 150,
    borderRadius: 5,
    marginBottom: 5,
  },
  imageContainer: {

  },
  textContainer: {
    flexWrap: 'wrap',
  },
  storyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    width: '100%',
  },
  chapterText: {
    fontSize: 15,
  },
  authorText: {
    fontSize: 15,
  },
  statusText: {
    fontSize: 15,
  },
  categoryText: {
    fontSize: 15,
    paddingBottom:10,
  },
  urlText: {
    fontSize: 15,
  },
});
