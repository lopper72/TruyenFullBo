import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView } from 'react-native';

import axios from 'axios';
import cheerio from 'react-native-cheerio';      // Đảm bảo bạn import đúng

const getUpdateStory = (url: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        let updatedStories: Story[] = [];

        let rowStories = $('#list-page .col-truyen-main .list .row');

        rowStories.each((_, div) => {
          let imgStory = $(div).find('.col-xs-3 div[data-image]').attr('data-image');
          let nameStory = $(div).find('h3.truyen-title a').text();
          let urlStory = $(div).find('h3.truyen-title a').attr('href');
          let chapterText = $(div).find('div.text-info a').text();

          updatedStories.push({ imgStory: imgStory || '', nameStory: nameStory || '', urlStory: urlStory || '' , chapterText: chapterText || ''});
        });

        resolve(updatedStories);
      })
      .catch(error => reject(error));
  });
};


interface Story {
  imgStory: string;
  nameStory: string;
  urlStory: string;
  chapterText: string;
}

const url = 'https://truyenfull.vision/danh-sach/truyen-moi/';

const NewStory = () => {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUpdateStory(url);
      console.log(data); // Dump giá trị trả về data
      setStories(data as Story[]);
    };

    fetchData();
  }, []);
  return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mới nhất</Text>
        <FlatList
          data={stories}
          renderItem={({ item }) => (
            <View style={styles.storyItem}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.imgStory }} style={styles.storyImage} />
                <View style={styles.textContainer}>
                  <Text style={styles.storyTitle} numberOfLines={2} ellipsizeMode="tail">
                    {item.nameStory.length > 40 ? `${item.nameStory.substring(0, 40)}...` : item.nameStory}
                  </Text>
                  <Text style={styles.chapterText}>{item.chapterText}</Text> 
                </View>
              </View>
              
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
  );
};

export default NewStory; // Phải có export default

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
    flexDirection: 'row',
    width: 120,
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
    flex:1,
    flexDirection:'column'

  },
  textContainer: {
    flex:1,
    flexWrap: 'wrap',
  },
  storyTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    width: '100%',
  },
  chapterText: {
    fontSize: 9,
  },
});
