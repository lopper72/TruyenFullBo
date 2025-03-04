import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, useWindowDimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {getInfoChapter, getUpdateStory} from '../api/api';
import RenderHTML from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const url = useLocalSearchParams();
  const initialUrl = Array.isArray(url.url) ? url.url[0] : url.url || '';
  const [currentUrl, setCurrentUrl] = useState<string | null>(initialUrl);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUrl) {
        try {
          const data = await getInfoChapter(currentUrl);
          setStory(data as Story);
          
          // Lưu vào lịch sử đọc
          const historyEntry = {
            storyId: currentUrl,
            storyName: data.nameStory,
            chapter: data.chapter,
            timestamp: new Date().getTime()
          };

          const existingHistory = await AsyncStorage.getItem('readingHistory');
          let historyArray = existingHistory ? JSON.parse(existingHistory) : [];
          
          // Cập nhật điều kiện kiểm tra theo storyId
          const existingIndex = historyArray.findIndex((item: any) => 
            item.storyName === data.nameStory
          );
          if (existingIndex !== -1) {
            historyArray.splice(existingIndex, 1);
          }
          
          historyArray.unshift(historyEntry);
          // Giới hạn lịch sử 50 item gần nhất
          historyArray = historyArray.slice(0, 50);
          await AsyncStorage.setItem('readingHistory', JSON.stringify(historyArray));
        } catch (error) {
          console.error('Error fetching story:', error);
        }
      }
    };

    fetchData();
  }, [currentUrl]);

  useEffect(() => {
    //console.log('Story updated:', story); // Log giá trị story khi nó thay đổi
  }, [story]); // Theo dõi sự thay đổi của story
  
  const handlePreviousPage = () => {
    if (story?.chapter_prev) {
        setCurrentUrl(story.chapter_prev);
    }
  };

  const handleNextPage = () => {
    if (story?.chapter_next) {
        setCurrentUrl(story.chapter_next);
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
                    contentWidth={width}
                    source={{ html: story.content }}
                    baseStyle={{ 
                      fontSize: 20,
                      lineHeight: 28,
                      paddingHorizontal: 8,
                      fontFamily: 'System',
                      fontWeight: 'normal',
                    }}
                    tagsStyles={{
                      p: {
                        marginVertical: 12,
                        fontSize: 20,
                        lineHeight: 28,
                      },
                      span: {
                        fontSize: 20,
                        lineHeight: 28,
                      },
                      div: {
                        fontSize: 20,
                        lineHeight: 28,
                      },
                    }}
                    defaultTextProps={{
                      style: {
                        fontSize: 20,
                        lineHeight: 28,
                        color: '#333',
                      }
                    }}
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
