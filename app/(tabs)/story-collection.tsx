import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView } from 'react-native';
import NewStory from '@/components/story-collection/new-story';

const newStories = [
  { id: 1, title: 'Truyện 1', image: require('../../assets/images/logo.jpg'), latestChapter: 'Chương 5', publishedTime: '2 giờ trước' },
  { id: 2, title: 'Truyện 2', image: require('../../assets/images/logo.jpg'), latestChapter: 'Chương 3', publishedTime: '1 ngày trước' },
  { id: 3, title: 'Truyện 3', image: require('../../assets/images/logo.jpg'), latestChapter: 'Chương 2', publishedTime: '3 ngày trước' },
  { id: 4, title: 'Truyện 4', image: require('../../assets/images/logo.jpg'), latestChapter: 'Chương 1', publishedTime: '5 ngày trước' },
  { id: 5, title: 'Truyện 5', image: require('../../assets/images/logo.jpg'), latestChapter: 'Chương 4', publishedTime: '1 tuần trước' },
  { id: 6, title: 'Truyện 6', image: require('../../assets/images/logo.jpg'), latestChapter: 'Chương 6', publishedTime: '2 tuần trước' },
  { id: 7, title: 'Truyện 7', image: require('../../assets/images/logo.jpg'), latestChapter: 'Chương 7', publishedTime: '1 tháng trước' },
  { id: 8, title: 'Truyện 8', image: require('../../assets/images/logo.jpg'), latestChapter: 'Chương 8', publishedTime: '2 tháng trước' },
  { id: 9, title: 'Truyện 9', image: require('../../assets/images/logo.jpg'), latestChapter: 'Chương 9', publishedTime: '3 tháng trước' },
  { id: 10, title: 'Truyện 10', image: require('../../assets/images/logo.jpg'), latestChapter: 'Chương 10', publishedTime: '4 tháng trước' },
];

const StoryCollectionScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <NewStory/>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Đề cử</Text>
        <FlatList
          data={newStories}
          renderItem={({ item }) => (
            <View style={styles.storyItem}>
              <Image source={item.image} style={styles.storyImage} />
              <Text>{item.title}</Text>
              <Text>{item.latestChapter}</Text>
              <Text>{item.publishedTime}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thời gian thực</Text>
        <FlatList
          data={newStories}
          renderItem={({ item }) => (
            <View style={styles.storyItem}>
              <Image source={item.image} style={styles.storyImage} />
              <Text>{item.title}</Text>
              <Text>{item.latestChapter}</Text>
              <Text>{item.publishedTime}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mới đăng</Text>
        <FlatList
          data={newStories}
          renderItem={({ item }) => (
            <View style={styles.storyItem}>
              <Image source={item.image} style={styles.storyImage} />
              <Text>{item.title}</Text>
              <Text>{item.latestChapter}</Text>
              <Text>{item.publishedTime}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mới hoàn thành</Text>
        <FlatList
          data={newStories}
          renderItem={({ item }) => (
            <View style={styles.storyItem}>
              <Image source={item.image} style={styles.storyImage} />
              <Text>{item.title}</Text>
              <Text>{item.latestChapter}</Text>
              <Text>{item.publishedTime}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
};

export default StoryCollectionScreen; // Phải có export default

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
