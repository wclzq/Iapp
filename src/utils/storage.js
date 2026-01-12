import localforage from 'localforage';

localforage.config({
  name: 'MomentApp',
  storeName: 'moment_data'
});

const STORAGE_KEY = 'moment_events';
const SETTINGS_KEY = 'moment_settings';
const MEMORIES_KEY = 'moment_memories';

// Async functions now
export const getEvents = async () => {
  try {
    const data = await localforage.getItem(STORAGE_KEY);
    return data || [];
  } catch (error) {
    console.error('Error reading events', error);
    return [];
  }
};

export const saveEvents = async (events) => {
  try {
    await localforage.setItem(STORAGE_KEY, events);
  } catch (error) {
    console.error('Error saving events', error);
    alert('存储出错: ' + error.message);
  }
};

export const getSettings = async () => {
  try {
    const data = await localforage.getItem(SETTINGS_KEY);
    return data || { defaultHome: true, theme: 'rose' };
  } catch (error) {
    return { defaultHome: true, theme: 'rose' };
  }
};

export const saveSettings = async (settings) => {
  await localforage.setItem(SETTINGS_KEY, settings);
};

export const getMemories = async () => {
  try {
    const data = await localforage.getItem(MEMORIES_KEY);
    return data || [];
  } catch (error) {
    return [];
  }
};

export const saveMemories = async (memories) => {
  try {
    await localforage.setItem(MEMORIES_KEY, memories);
  } catch (error) {
      alert('无法保存照片，可能是存储空间已满');
  }
};