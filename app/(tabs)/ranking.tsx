import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';

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

          updatedStories.push({ imgStory: imgStory || '', nameStory: nameStory || '', urlStory: urlStory || '' });
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
}

const url = 'https://truyenfull.vision/danh-sach/truyen-moi/';

const RankingScreen = () => {
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ranking Screen</Text>
      <FlatList
        data={stories}
        renderItem={({ item, index }) => (
          <Text key={index} style={styles.story}>{item.nameStory}</Text>
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

export default RankingScreen;
