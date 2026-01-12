import React, { createContext, useContext, useState, useEffect } from 'react';
import { getEvents, saveEvents, getSettings, saveSettings } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

const EventContext = createContext();

export const useEventContext = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [settings, setSettingsState] = useState({ defaultHome: true });

  useEffect(() => {
    const loadedEvents = getEvents();
    setEvents(loadedEvents);
    const loadedSettings = getSettings();
    setSettingsState(loadedSettings);
  }, []);

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

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, settings, updateSettings }}>
      {children}
    </EventContext.Provider>
  );
};