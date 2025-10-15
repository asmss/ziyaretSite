import React from'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const LocationSearchField = () => {
  const map = useMap();

  React.useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar', 
      showMarker: true, 
      showPopup: false, 
      autoClose: true, 
      retainZoomLevel: false, 
      animateZoom: true,
      keepResult: true, 
      searchLabel: 'Adres veya yer arayın...',
    });

    map.addControl(searchControl);
    
    return () => map.removeControl(searchControl);
  }, [map]);

  return null; 
};


const MapView = ({ locations, selectedLocation, onLocationSelect, onMapClick }) => {
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'romantic': return '💖';
      case 'fun': return '😄';
      case 'food': return '🍕';
      case 'culture': return '🎨';
      case 'adventure': return '🏞️';
      default: return '📍';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryName = (category) => {
    switch(category) {
      case 'romantic': return 'Romantik';
      case 'fun': return 'Eğlence';
      case 'food': return 'Yemek';
      case 'culture': return 'Kültür';
      case 'adventure': return 'Macera';
      default: 'Diğer';
    }
  };

  const center = locations.length > 0 
    ? [locations[0].lat, locations[0].lng]
    : [41.0082, 28.9784];

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      <LocationSearchField />

      {locations.map(location => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          eventHandlers={{
            click: () => onLocationSelect(location),
          }}
        >
          <Popup>
            <div className="popup-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '18px' }}>{getCategoryIcon(location.category)}</span>
                <h3 style={{ margin: 0, fontSize: '16px' }}>{location.name}</h3>
              </div>
              
              {location.description && (
                <p style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                  {location.description}
                </p>
              )}
              
              <div className="popup-meta">
                <span style={{ 
                  padding: '2px 6px', 
                  borderRadius: '8px', 
                  fontSize: '10px',
                  background: location.category === 'romantic' ? '#ffebee' :
                             location.category === 'fun' ? '#e3f2fd' :
                             location.category === 'food' ? '#e8f5e8' :
                             location.category === 'culture' ? '#f3e5f5' : '#fff3e0',
                  color: location.category === 'romantic' ? '#c62828' :
                         location.category === 'fun' ? '#1565c0' :
                         location.category === 'food' ? '#2e7d32' :
                         location.category === 'culture' ? '#7b1fa2' : '#ef6c00'
                }}>
                  {getCategoryName(location.category)}
                </span>
                <span style={{ fontSize: '11px', color: '#999' }}>
                  {formatDate(location.visit_date)}
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      <MapClickHandler onMapClick={onMapClick} />
    </MapContainer>
  );
};

export default MapView;