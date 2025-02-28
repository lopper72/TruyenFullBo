import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Image, StyleSheet, useWindowDimensions, Button,ScrollView, TouchableOpacity } from 'react-native';
import { useSearchParams } from 'expo-router/build/hooks';
import {getInfoStory, getAllChapters} from '../api/api';
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
  chapters: string[]; // Assuming chapters is an array of chapter titles
}

export default function StoryDetailScreen() {
  const { width } = useWindowDimensions();
  const [story, setStory] = useState<Story | null>(null);
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreChapters, setShowMoreChapters] = useState(false); // State to manage chapter visibility
  const scrollViewRef = useRef<ScrollView>(null); // Create a ref for the ScrollView
  const [showScrollToTop, setShowScrollToTop] = useState(false); // State to manage scroll to top button visibility

  const url = useSearchParams();
  const urlStory = url.get('urlStory') || ''; // Default to an empty string if urlStory is null
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
    console.log('Story updated:', story); // Log giá trị story khi nó thay đổi
  }, [story]); // Theo dõi sự thay đổi của story
  
  const [chapters, setChapters] = useState<{ chapter: string; urlChapter: string }[]>([]); // State to hold chapters

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInfoStory(urlStory);
        setStory(data as Story);

        // Fetch chapters after story data is retrieved
        const chapterData = await getAllChapters(data.truyenID, urlStory);
        setChapters(chapterData); // Set chapters state
      } catch (error) {
        console.error('Error fetching story:', error); // Log lỗi nếu có
      }
    };

    fetchData();
  }, []);

  // Function to scroll to the top
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <ScrollView 
      ref={scrollViewRef} // Attach the ref to the ScrollView
      style={styles.container}
      onScroll={({ nativeEvent }) => {
        // Show or hide the button based on scroll position
        const scrollPosition = nativeEvent.contentOffset.y; // Current scroll position
        const screenHeight = nativeEvent.layoutMeasurement.height; // Height of the visible area

        // Show button if scrolled down more than the height of two screens
        if (scrollPosition > 2 * screenHeight) {
          setShowScrollToTop(true);
        } else {
          setShowScrollToTop(false);
        }
      }}
      scrollEventThrottle={16} // Improve scroll performance
    >
      {story ? (
        <View style={styles.storyItem}>
          <View style={styles.imageContainer}>
            <View style={styles.imageButtonContainer}>
              <Image source={{ uri: story.imgStory }} style={styles.storyImage} />
              <View style={styles.buttonContainer}>
                <Button 
                    title="Đọc chương đầu" 
                    onPress={() => router.push({ pathname: '/StoryContent', params: { url: story.urlFirstChapter } })}
                    color="#FF6347" // Set a bright color for the button
                />
              </View>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.storyTitle} numberOfLines={2} ellipsizeMode="tail">
                {story.name.length > 40 ? `${story.name.substring(0, 40)}...` : story.name}
              </Text>
              
              <Text style={styles.authorText}>Tác giả: {story.author}</Text>
              <Text style={styles.statusText}>Trạng thái: {story.status}</Text>
              <Text style={styles.categoryText}>Thể loại: {story.cats.join(', ')}</Text>
              <View style={{ maxWidth: width }}>
                {isExpanded ? (
                  <TouchableOpacity onPress={() => setIsExpanded(false)}>
                    <Text style={{ color: '#FF6347', marginTop: 5 }}>Thu gọn</Text>
                  </TouchableOpacity>
                ) : null}
                <RenderHTML
                  contentWidth={width}
                  source={{ html: isExpanded ? story.description : `${story.description.substring(0, 100)}...` }}
                />
                {!isExpanded ? (
                  <TouchableOpacity onPress={() => setIsExpanded(true)}>
                    <Text style={{ color: '#FF6347', marginTop: 5 }}>Xem thêm</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
      <View style={styles.chapterList}>
        <Text style={styles.title}>Danh sách chương:</Text>
        {showMoreChapters ? (
          chapters.map((chapter, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.chapterItem} 
              onPress={() => router.push({ pathname: '/StoryContent', params: { url: chapter.urlChapter } })} // Navigate to StoryContent
            >
              <Text style={styles.chapterText}>{chapter.chapter}</Text>
            
            </TouchableOpacity>
          ))
        ) : (
          <>
            {chapters.slice(0, 5).map((chapter, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.chapterItem} 
                onPress={() => router.push({ pathname: '/StoryContent', params: { url: chapter.urlChapter } })} // Navigate to StoryContent
              >
                <Text style={styles.chapterText}>{chapter.chapter}</Text>
             
              </TouchableOpacity>
            ))}
            {chapters.length > 5 && (
              <TouchableOpacity onPress={() => setShowMoreChapters(true)}>
                <Text style={styles.seeMoreText}>Xem thêm</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
      {showScrollToTop && ( // Conditionally render the button
        <TouchableOpacity style={styles.scrollToTopButton} onPress={scrollToTop}>
          <Text style={styles.scrollToTopText}>Lên trên cùng</Text>
        </TouchableOpacity>
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
    marginRight: 5,
  },
  imageContainer: {

  },
  textContainer: {
    flexWrap: 'wrap',
    paddingBottom: 20,
  },
  storyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    width: '100%',
  },
  chapterText: {
    fontSize: 15,
    color: '#333', // Darker color for better readability
    textDecorationLine: 'underline', // Underline the text
    marginVertical: 5, // Space above and below the text
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
  imageButtonContainer: {
    width:'70%',
    flexDirection: 'row',
    justifyContent: 'flex-end',

  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: 10, 
    // Add any additional styles for the button if needed
  },
  buttonText: {
    // Add any additional styles for the button text if needed
  },
  chapterList: {
    marginTop: 10,
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
    paddingBottom: 30,
  },
  chapterItem: {
    marginBottom: 5, // Space between
  },
  dateText: {
    fontSize: 12,
    color: 'gray',
  },
  seeMoreText: {
    fontSize: 15,
    color: '#FF6347',
    marginTop: 10,
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF6347',
    borderRadius: 5,
    padding: 10,
    elevation: 5,
  },
  scrollToTopText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
