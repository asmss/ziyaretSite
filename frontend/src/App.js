import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import LocationList from './components/LocationList';
import AddLocationForm from './components/AddLocationForm';
import { locationsAPI } from './services/api';
import './App.css';

function App() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newLocationCoords, setNewLocationCoords] = useState(null);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const locationsArray = await locationsAPI.getAll();
      setLocations(locationsArray);
    } catch (error) {
      console.error('Lokasyonlar yüklenirken hata:', error);
      alert('Lokasyonlar yüklenirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddLocation = async (locationData) => {
    try {
      const newLocation = await locationsAPI.create(locationData);
      setLocations(prev => [newLocation, ...prev]);
      return true;
    } catch (error) {
      console.error('Lokasyon eklenirken hata:', error);
      alert('Lokasyon eklenirken bir hata oluştu!');
      return false;
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      await locationsAPI.delete(id);
      setLocations(prev => prev.filter(loc => loc.id !== id));
      setSelectedLocation(null);
      return true;
    } catch (error) {
      console.error('Lokasyon silinirken hata:', error);
      alert('Lokasyon silinirken bir hata oluştu!');
      return false;
    }
  };

  const handleMapClick = (coords) => {
    setNewLocationCoords(coords);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setNewLocationCoords(null); 
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Yerler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <header className="sidebar-header">
          <h1>💑 Bizim Yerlerimiz</h1>
          <p className="subtitle">Birlikte gittiğimiz özel yerler</p>
          <button 
            onClick={() => setIsFormOpen(true)} 
            className="add-btn"
          >
            + Yeni Yer Ekle
          </button>
        </header>

        <LocationList 
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
          onDeleteLocation={handleDeleteLocation}
        />
      </div>

      <div className="map-container">
        <MapView 
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
          onMapClick={handleMapClick}
        />
      </div>

      <AddLocationForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onAddLocation={handleAddLocation}
        initialCoords={newLocationCoords}
      />
    </div>
  );
}

export default App;