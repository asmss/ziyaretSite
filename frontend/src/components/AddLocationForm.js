import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';

const AddLocationForm = ({ isOpen, onClose, onAddLocation, initialCoords }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lat: '',
    lng: '',
    visit_date: new Date().toISOString().split('T')[0],
    category: 'romantic'
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialCoords) {
      setFormData(prev => ({
        ...prev,
        lat: initialCoords.lat.toFixed(6), 
        lng: initialCoords.lng.toFixed(6)
      }));
    }
  }, [initialCoords]);

  const popularCities = [
    { name: 'İstanbul (Taksim)', lat: 41.0351, lng: 28.9833 },
    { name: 'İstanbul (Kadıköy)', lat: 40.9927, lng: 29.0289 },
    { name: 'Ankara (Kızılay)', lat: 39.9208, lng: 32.8541 },
    { name: 'İzmir (Alsancak)', lat: 38.4362, lng: 27.1418 },
    { name: 'Bursa (Merkez)', lat: 40.1825, lng: 29.0669 },
    { name: 'Antalya (Lara)', lat: 36.8517, lng: 30.8487 },
    { name: 'Eskişehir (Merkez)', lat: 39.7767, lng: 30.5206 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCitySelect = (city) => {
    setFormData(prev => ({
      ...prev,
      lat: city.lat.toString(),
      lng: city.lng.toString()
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Mekan adı gereklidir';
    }
    
    if (!formData.lat || !formData.lng) {
      newErrors.coordinates = 'Koordinatlar gereklidir';
    } else if (isNaN(parseFloat(formData.lat)) || isNaN(parseFloat(formData.lng))) {
      newErrors.coordinates = 'Geçerli koordinatlar giriniz';
    }
    
    if (!formData.visit_date) {
      newErrors.visit_date = 'Ziyaret tarihi gereklidir';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await onAddLocation({
        ...formData,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng)
      });
      
      if (success) {
        handleClose();
      }
    } catch (error) {
      console.error('Form gönderilirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      lat: '',
      lng: '',
      visit_date: new Date().toISOString().split('T')[0],
      category: 'romantic'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal open">
      <div className="modal-content">
        <div className="modal-header">
          <h2>📍 Yeni Yer Ekle</h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Mekan Adı *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Örn: İstiklal Caddesi, Eminönü..."
              disabled={loading}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Burada neler yaşadınız? Özel anılarınız..."
              disabled={loading}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Hızlı Seçim (Türkiye Şehirleri)</label>
            <div className="city-buttons">
              {popularCities.map(city => (
                <button
                  key={city.name}
                  type="button"
                  className="city-btn"
                  onClick={() => handleCitySelect(city)}
                  disabled={loading}
                >
                  <MapPin size={12} />
                  {city.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lat">Enlem (Latitude) *</label>
              <input
                type="text"
                id="lat"
                name="lat"
                value={formData.lat}
                onChange={handleInputChange}
                placeholder="41.0082"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lng">Boylam (Longitude) *</label>
              <input
                type="text"
                id="lng"
                name="lng"
                value={formData.lng}
                onChange={handleInputChange}
                placeholder="28.9784"
                disabled={loading}
              />
            </div>
          </div>
          
          {errors.coordinates && (
            <span className="error" style={{display: 'block', marginTop: '-10px', marginBottom: '15px'}}>
              {errors.coordinates}
            </span>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="visit_date">Ziyaret Tarihi *</label>
              <input
                type="date"
                id="visit_date"
                name="visit_date"
                value={formData.visit_date}
                onChange={handleInputChange}
                disabled={loading}
              />
              {errors.visit_date && <span className="error">{errors.visit_date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Kategori</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="romantic">💖 Romantik</option>
                <option value="fun">😄 Eğlence</option>
                <option value="food">🍕 Yemek</option>
                <option value="culture">🎨 Kültür</option>
                <option value="adventure">🏞️ Macera</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Ekleniyor...' : '📍 Yeri Ekle'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLocationForm;