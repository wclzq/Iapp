const STORAGE_KEY = 'moment_events';
const SETTINGS_KEY = 'moment_settings';

export const getEvents = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading events', error);
    return [];
  }
};

export const saveEvents = (events) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events', error);
    alert('存储空间不足，无法保存更多数据 (特别是大图片)');
  }
};

export const getSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { defaultHome: true };
  } catch (error) {
    return { defaultHome: true };
  }
};

export const saveSettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};