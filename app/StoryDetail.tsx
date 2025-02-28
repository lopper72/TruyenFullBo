import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, useWindowDimensions, Button,ScrollView } from 'react-native';
import { useSearchParams } from 'expo-router/build/hooks';
import {getInfoStory, getUpdateStory} from '../api/api';
import RenderHTML from 'react-native-render-html';
import { useRouter } from 'expo-router';

interface Story {
  author: string;
  cats: string[]; // Mảng các chuỗi
  description: string;
  imgStory: string;
  name: string; // Đổi từ nameStory thành name
  source: string;
  status: string;
  truyenID: string; // Đảm bảo truyenID là chuỗi
  urlFirstChapter: string;
}

export default function StoryDetailScreen() {
  const { width } = useWindowDimensions();
  const [story, setStory] = useState<Story | null>(null);
  const router = useRouter();

  const url = useSearchParams();
  const urlStory = url.get('urlStory'); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInfoStory(urlStory);

        setStory(data as Story);
      } catch (error) {
        console.error('Error fetching story:', error); // Log lỗi nếu có
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    //console.log('Story updated:', story); // Log giá trị story khi nó thay đổi
  }, [story]); // Theo dõi sự thay đổi của story
  
  return (
    <ScrollView style={styles.container}>
      {story ? (
        <View style={styles.storyItem}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: story.imgStory }} style={styles.storyImage} />
            <View style={styles.textContainer}>
              <Text style={styles.storyTitle} numberOfLines={2} ellipsizeMode="tail">
                {story.name.length > 40 ? `${story.name.substring(0, 40)}...` : story.name}
              </Text>
              
              <Text style={styles.authorText}>Tác giả: {story.author}</Text>
              <Text style={styles.statusText}>Trạng thái: {story.status}</Text>
              <Text style={styles.categoryText}>Thể loại: {story.cats.join(', ')}</Text>
              <RenderHTML
                contentWidth={width} // Đảm bảo bạn có chiều rộng của container
                source={{ html: story.description }} // Chuyển đổi HTML thành văn bản
              />
              <Button 
                title="Đọc chương đầu" 
                onPress={() => router.push({ pathname: '/StoryContent', params: { url: story.urlFirstChapter } })}
              />
            </View>
          </View>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
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
