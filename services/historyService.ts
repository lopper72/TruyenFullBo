import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveReadingProgress = async (storyId: string, storyName: string, chapter: number) => {
  try {
    const historyItem = {
      storyId,
      storyName,
      chapter,
      timestamp: Date.now(),
    };

    const existingHistory = await AsyncStorage.getItem('readingHistory');
    const historyData = existingHistory 
      ? JSON.parse(existingHistory)
      : {};

    historyData[storyId] = historyItem;
    await AsyncStorage.setItem('readingHistory', JSON.stringify(historyData));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}; 