import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EventProvider } from './context/EventContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import AddEditEvent from './pages/AddEditEvent';
import EventDetail from './pages/EventDetail';
import Settings from './pages/Settings';
import Holidays from './pages/Holidays';
import Memories from './pages/Memories';

function App() {
  return (
    <EventProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="holidays" element={<Holidays />} />
            <Route path="memories" element={<Memories />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/add" element={<AddEditEvent />} />
        <Route path="/edit/:id" element={<AddEditEvent />} />
        <Route path="/event/:id" element={<EventDetail />} />
      </Routes>
      </BrowserRouter>
    </EventProvider>
  );
}

export default App;
