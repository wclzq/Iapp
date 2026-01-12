import React, { createContext, useContext, useState, useEffect } from 'react';
import { getEvents, saveEvents, getSettings, saveSettings, getMemories, saveMemories } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

const EventContext = createContext();

export const useEventContext = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [settings, setSettingsState] = useState({ defaultHome: true, theme: 'rose' });
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        const loadedEvents = await getEvents();
        setEvents(loadedEvents);
        
        const loadedSettings = await getSettings();
        setSettingsState(loadedSettings || { defaultHome: true, theme: 'rose' });
        
        const loadedMemories = await getMemories();
        setMemories(loadedMemories);
        
        setLoading(false);
    };
    loadData();
  }, []);
  
  // Apply theme
  useEffect(() => {
      if (settings.theme) {
          document.documentElement.setAttribute('data-theme', settings.theme);
      } else {
          document.documentElement.removeAttribute('data-theme');
      }
  }, [settings.theme]);

  const addEvent = (eventData) => {
    const newEvent = { ...eventData, id: uuidv4(), createdAt: new Date().toISOString() };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  };

  const updateEvent = (id, updatedData) => {
    const updatedEvents = events.map(ev => ev.id === id ? { ...ev, ...updatedData } : ev);
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  };

  const deleteEvent = (id) => {
    const updatedEvents = events.filter(ev => ev.id !== id);
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  };
  
  const updateSettings = (newSettings) => {
      const updated = { ...settings, ...newSettings };
      setSettingsState(updated);
      saveSettings(updated);
  }

  const saveMemory = (index, data) => {
      const existingIndex = memories.findIndex(m => m.index === index);
      let updatedMemories;
      if (existingIndex >= 0) {
          updatedMemories = [...memories];
          updatedMemories[existingIndex] = { ...updatedMemories[existingIndex], ...data };
      } else {
          updatedMemories = [...memories, { index, ...data }];
      }
      setMemories(updatedMemories);
      saveMemories(updatedMemories);
  }

  if (loading) {
      return <div className="h-screen w-full flex items-center justify-center text-gray-400">加载中...</div>;
  }

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, settings, updateSettings, memories, saveMemory }}>
      {children}
    </EventContext.Provider>
  );
};