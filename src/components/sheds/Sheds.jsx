import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Plus, 
  MoreVertical, 
  Info, 
  Edit, 
  Trash2, 
  Save,
  Calendar,
  X
} from 'lucide-react';
import axios from 'axios';
import './Sheds.css';

const Sheds = () => {
  const [sheds, setSheds] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedShed, setSelectedShed] = useState(null);
  const [formData, setFormData] = useState({
    shed_number: '',
    capacity: '',
    present_hens: ''
  });
  const [dailyData, setDailyData] = useState({
    mortality: '',
    production: '',
    sales: '',
    feed: '',
    notes: '',
    present_hens: ''
  });

  // Check if we're in production mode without backend
  const isProductionMode = import.meta.env.PROD && !import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchSheds();
  }, [selectedDate]);

  const fetchSheds = async () => {
    try {
      setLoading(true);
      
      if (isProductionMode) {
        // Use demo data for production
        const demoSheds = [
          {
            id: 1,
            shed_number: '1',
            capacity: 25000,
            present_hens: 21000,
            created_at: new Date().toISOString()
          }
        ];
        setSheds(demoSheds);
      } else {
        // Use real API for development
        const response = await axios.get(`/sheds?date=${selectedDate}`);
        setSheds(response.data);
      }
    } catch (error) {
      console.error('Error fetching sheds:', error);
      if (isProductionMode) {
        // Fallback to demo data
        setSheds([
          {
            id: 1,
            shed_number: '1',
            capacity: 25000,
            present_hens: 21000,
            created_at: new Date().toISOString()
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddShed = async (e) => {
    e.preventDefault();
    try {
      if (isProductionMode) {
        // Create demo shed
        const newShed = {
          id: Date.now(),
          shed_number: formData.shed_number,
          capacity: parseInt(formData.capacity),
          present_hens: parseInt(formData.present_hens),
          created_at: new Date().toISOString()
        };
        
        setSheds(prev => [...prev, newShed]);
        setShowAddModal(false);
        setFormData({ shed_number: '', capacity: '', present_hens: '' });
        
        // Show success message
        alert('Shed added successfully! (Demo mode)');
      } else {
        // Use real API for development
        await axios.post('/sheds', formData);
        setShowAddModal(false);
        setFormData({ shed_number: '', capacity: '', present_hens: '' });
        fetchSheds();
      }
    } catch (error) {
      console.error('Error adding shed:', error);
      alert(error.response?.data?.error || 'Error adding shed');
    }
  };

  const handleEditShed = async (e) => {
    e.preventDefault();
    try {
      if (isProductionMode) {
        // Update demo shed
        setSheds(prev => prev.map(shed => 
          shed.id === selectedShed.id 
            ? { ...shed, shed_number: formData.shed_number, capacity: parseInt(formData.capacity) }
            : shed
        ));
        setShowEditModal(false);
        setSelectedShed(null);
        setFormData({ shed_number: '', capacity: '', present_hens: '' });
        alert('Shed updated successfully! (Demo mode)');
      } else {
        // Use real API for development
        await axios.put(`/sheds/${selectedShed.id}`, {
          shed_number: formData.shed_number,
          capacity: formData.capacity
        });
        setShowEditModal(false);
        setSelectedShed(null);
        setFormData({ shed_number: '', capacity: '', present_hens: '' });
        fetchSheds();
      }
    } catch (error) {
      console.error('Error updating shed:', error);
      alert(error.response?.data?.error || 'Error updating shed');
    }
  };

  const handleDeleteShed = async () => {
    if (!selectedShed) return;
    
    if (window.confirm(`Are you sure you want to delete Shed ${selectedShed.shed_number}?`)) {
      try {
        if (isProductionMode) {
          // Delete demo shed
          setSheds(prev => prev.filter(shed => shed.id !== selectedShed.id));
          setShowInfoModal(false);
          setSelectedShed(null);
          alert('Shed deleted successfully! (Demo mode)');
        } else {
          // Use real API for development
          await axios.delete(`/sheds/${selectedShed.id}`);
          setShowInfoModal(false);
          setSelectedShed(null);
          fetchSheds();
        }
      } catch (error) {
        console.error('Error deleting shed:', error);
        alert('Error deleting shed');
      }
    }
  };

  const handleSaveDailyData = async (shedId) => {
    try {
      if (isProductionMode) {
        // Save daily data for demo shed
        setSheds(prev => prev.map(shed => 
          shed.id === shedId 
            ? { ...shed, 
                mortality: dailyData.mortality,
                production: dailyData.production,
                sales: dailyData.sales,
                feed: dailyData.feed,
                notes: dailyData.notes,
                present_hens: dailyData.present_hens
              }
            : shed
        ));
        alert('Daily data saved successfully! (Demo mode)');
      } else {
        // Use real API for development
        await axios.post(`/sheds/${shedId}/daily-data`, {
          date: selectedDate,
          ...dailyData
        });
        
        // Reset form data for this shed
        setDailyData({
          mortality: '',
          production: '',
          sales: '',
          feed: '',
          notes: '',
          present_hens: ''
        });
        
        fetchSheds();
      }
    } catch (error) {
      console.error('Error saving daily data:', error);
      alert('Error saving daily data');
    }
  };

  const openModal = (type, shed = null) => {
    if (type === 'add') {
      setShowAddModal(true);
    } else if (type === 'edit' && shed) {
      setSelectedShed(shed);
      setFormData({
        shed_number: shed.shed_number,
        capacity: shed.capacity.toString(),
        present_hens: ''
      });
      setShowEditModal(true);
    } else if (type === 'info' && shed) {
      setSelectedShed(shed);
      setShowInfoModal(true);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  if (loading) {
    return (
      <div className="sheds-container">
        <div className="loading">Loading sheds...</div>
      </div>
    );
  }

  return (
    <div className="sheds-container">
      {/* Date Picker */}
      <div className="date-picker-container">
        <div className="date-picker">
          <Calendar size={20} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
          <span className="date-display">{formatDate(selectedDate)}</span>
        </div>
      </div>

      {/* Sheds List */}
      <div className="sheds-list">
        {sheds.length === 0 ? (
          <div className="no-sheds">
            <h2>No Sheds Found</h2>
            <p>Click the + button to add your first shed.</p>
          </div>
        ) : (
          sheds.map((shed) => (
            <div key={shed.id} className="shed-card">
              <div className="shed-header">
                <div className="shed-title">
                  <h3>SHED - {shed.shed_number}</h3>
                </div>
                <div className="shed-actions">
                  <button
                    className="save-button"
                    onClick={() => handleSaveDailyData(shed.id)}
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <div className="shed-menu">
                    <button
                      className="menu-button"
                      onClick={() => openModal('info', shed)}
                    >
                      <MoreVertical size={20} />
                    </button>
                    <div className="menu-dropdown">
                      <button onClick={() => openModal('info', shed)}>
                        <Info size={16} />
                        Info
                      </button>
                      <button onClick={() => openModal('edit', shed)}>
                        <Edit size={16} />
                        Edit
                      </button>
                      <button onClick={() => openModal('info', shed)}>
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="shed-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Mortality</label>
                    <input
                      type="number"
                      value={shed.mortality || ''}
                      onChange={(e) => {
                        const updatedSheds = sheds.map(s => 
                          s.id === shed.id ? { ...s, mortality: e.target.value } : s
                        );
                        setSheds(updatedSheds);
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Production</label>
                    <input
                      type="number"
                      value={shed.production || ''}
                      onChange={(e) => {
                        const updatedSheds = sheds.map(s => 
                          s.id === shed.id ? { ...s, production: e.target.value } : s
                        );
                        setSheds(updatedSheds);
                      }}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Sales</label>
                    <input
                      type="number"
                      value={shed.sales || ''}
                      onChange={(e) => {
                        const updatedSheds = sheds.map(s => 
                          s.id === shed.id ? { ...s, sales: e.target.value } : s
                        );
                        setSheds(updatedSheds);
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Feed (kg)</label>
                    <input
                      type="number"
                      value={shed.feed || ''}
                      onChange={(e) => {
                        const updatedSheds = sheds.map(s => 
                          s.id === shed.id ? { ...s, feed: e.target.value } : s
                        );
                        setSheds(updatedSheds);
                      }}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={shed.notes || ''}
                    onChange={(e) => {
                      const updatedSheds = sheds.map(s => 
                        s.id === shed.id ? { ...s, notes: e.target.value } : s
                      );
                      setSheds(updatedSheds);
                    }}
                    placeholder="Add notes for the day..."
                    rows="3"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <button
        className="add-shed-button"
        onClick={() => openModal('add')}
      >
        <Plus size={24} />
      </button>

      {/* Add Shed Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Shed</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddShed}>
              <div className="form-group">
                <label>Shed Number</label>
                <input
                  type="text"
                  value={formData.shed_number}
                  onChange={(e) => setFormData({...formData, shed_number: e.target.value})}
                  placeholder="e.g., 1, 2, 3"
                  required
                />
              </div>
              <div className="form-group">
                <label>Shed Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  placeholder="Maximum hens capacity"
                  required
                />
              </div>
              <div className="form-group">
                <label>Present Hens</label>
                <input
                  type="number"
                  value={formData.present_hens}
                  onChange={(e) => setFormData({...formData, present_hens: e.target.value})}
                  placeholder="Current hen count"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit">Add Shed</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Shed Modal */}
      {showEditModal && selectedShed && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Shed</h2>
              <button onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditShed}>
              <div className="form-group">
                <label>Shed Number</label>
                <input
                  type="text"
                  value={formData.shed_number}
                  onChange={(e) => setFormData({...formData, shed_number: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Shed Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit">Update Shed</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && selectedShed && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Shed Information</h2>
              <button onClick={() => setShowInfoModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="shed-info">
              <div className="info-row">
                <span className="info-label">Shed Number:</span>
                <span className="info-value">{selectedShed.shed_number}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Capacity:</span>
                <span className="info-value">{selectedShed.capacity} hens</span>
              </div>
              <div className="info-row">
                <span className="info-label">Present Hens:</span>
                <span className="info-value">{selectedShed.present_hens || 0} hens</span>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowInfoModal(false)}>Close</button>
              <button onClick={handleDeleteShed} className="delete-button">
                Delete Shed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sheds;
