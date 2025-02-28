import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, useWindowDimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useSearchParams, useRouter } from 'expo-router/build/hooks';
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
  const router = useRouter();
  const url = useSearchParams();
  const initialUrl = url.get('url');
  const [currentUrl, setCurrentUrl] = useState<string | null>(initialUrl);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUrl) {
        try {
          const data = await getInfoChapter(currentUrl);
          console.log('Fetched data:', data);
          setStory(data as Story);
        } catch (error) {
          console.error('Error fetching story:', error);
        }
      }
    };

    fetchData();
  }, [currentUrl]);

  useEffect(() => {
    console.log('Story updated:', story); // Log giá trị story khi nó thay đổi
  }, [story]); // Theo dõi sự thay đổi của story
  
  const handlePreviousPage = () => {
    if (story?.chapter_prev) {
      console.log('Navigating to previous chapter:', story.chapter_prev);
      setCurrentUrl(story.chapter_prev); // Cập nhật state với chapter_prev
    } else {
      console.log('No previous chapter available');
    }
  };

  const handleNextPage = () => {
    if (story?.chapter_next) {
      console.log('Navigating to next chapter:', story.chapter_next);
      setCurrentUrl(story.chapter_next); // Cập nhật state với chapter_next
    } else {
      console.log('No next chapter available');
    }
  };

  return (
    <View style={styles.container}>
      {story ? (
        <ScrollView>
          <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={[styles.button, !story?.chapter_prev && styles.disabledButton]} 
            onPress={story?.chapter_prev ? handlePreviousPage : undefined}
            disabled={!story?.chapter_prev}
          >
            <Text style={styles.buttonText}>Trang trước</Text>
          </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, !story?.chapter_next && styles.disabledButton]} 
              onPress={story?.chapter_next ? handleNextPage : undefined}
              disabled={!story?.chapter_next}
            >
              <Text style={styles.buttonText}>Trang sau</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.storyItem}>
            <View style={styles.imageContainer}>
              <Text style={styles.storyTitle}>{story.nameStory}</Text>
              <Text style={styles.chapterText}>Chapter: {story.chapter}</Text>
            
              <View style={{ maxWidth: width }}>
                <RenderHTML
                    contentWidth={width} // Đảm bảo bạn có chiều rộng của container
                    source={{ html: story.content }} // Chuyển đổi HTML thành văn bản
                />    
              </View>
            </View>
          </View>
          <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={[styles.button, !story?.chapter_prev && styles.disabledButton]} 
            onPress={story?.chapter_prev ? handlePreviousPage : undefined}
            disabled={!story?.chapter_prev}
          >
            <Text style={styles.buttonText}>Trang trước</Text>
          </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, !story?.chapter_next && styles.disabledButton]} 
              onPress={story?.chapter_next ? handleNextPage : undefined}
              disabled={!story?.chapter_next}
            >
              <Text style={styles.buttonText}>Trang sau</Text>
            </TouchableOpacity>
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
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});
