import React from 'react';
import { Trash2, MapPin } from 'lucide-react';

const LocationList = ({ 
  locations, 
  selectedLocation, 
  onLocationSelect, 
  onDeleteLocation 
}) => {
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
    if (!dateString) return 'Tarih belirtilmemiş';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (locations.length === 0) {
    return (
      <div className="empty-state">
        <MapPin size={48} color="#ccc" />
        <p>Henüz hiç yer eklenmemiş</p>
        <span>İlk yerinizi eklemek için "+ Yeni Yer Ekle" butonuna tıklayın</span>
      </div>
    );
  }

  return (
    <div className="location-list">
      {locations.map(location => (
        <div
          key={location.id}
          className={`location-card ${selectedLocation?.id === location.id ? 'selected' : ''}`}
          onClick={() => onLocationSelect(location)}
        >
          <div className="location-header">
            <span className="category-icon">
              {getCategoryIcon(location.category)}
            </span>
            <h3>{location.name}</h3>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`${location.name} yerini silmek istediğinizden emin misiniz?`)) {
                  onDeleteLocation(location.id);
                }
              }}
              title="Sil"
            >
              <Trash2 size={14} />
            </button>
          </div>
          
          {location.description && (
            <p className="location-description">{location.description}</p>
          )}
          
          <div className="location-meta">
            <span className="date">
              {formatDate(location.visit_date)}
            </span>
            <span className={`category ${location.category}`}>
              {location.category === 'romantic' && 'Romantik'}
              {location.category === 'fun' && 'Eğlence'}
              {location.category === 'food' && 'Yemek'}
              {location.category === 'culture' && 'Kültür'}
              {location.category === 'adventure' && 'Macera'}
            </span>
          </div>
          
          <div className="location-coordinates">
            <small>
              {location.lat?.toFixed(6)}, {location.lng?.toFixed(6)}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationList;