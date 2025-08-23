import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  ChevronDown, 
  ChevronRight, 
  Calendar,
  Users,
  TrendingDown,
  Package,
  ShoppingCart,
  Warehouse
} from 'lucide-react';
import axios from 'axios';
import './Homepage.css';

const Homepage = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});

  // Check if we're in production mode without backend
  const isProductionMode = import.meta.env.PROD && !import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (isProductionMode) {
        // Use demo data for production
        const demoData = {
          totalHens: 21000,
          totalMortality: 150,
          totalStock: 1250,
          totalSales: 800,
          totalFeed: 5000,
          sheds: [
            { shed_number: '1', hens_count: 21000, mortality: 150, stock: 1250, sales: 800 }
          ],
          feedTypes: [
            { type: 'Layer Feed', quantity: 3000 },
            { type: 'Grain Mix', quantity: 2000 }
          ]
        };
        setDashboardData(demoData);
      } else {
        // Use real API for development
        const response = await axios.get(`/dashboard/summary?date=${selectedDate}`);
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (isProductionMode) {
        // Fallback to demo data
        setDashboardData({
          totalHens: 21000,
          totalMortality: 150,
          totalStock: 1250,
          totalSales: 800,
          totalFeed: 5000,
          sheds: [
            { shed_number: '1', hens_count: 21000, mortality: 150, stock: 1250, sales: 800 }
          ],
          feedTypes: [
            { type: 'Layer Feed', quantity: 3000 },
            { type: 'Grain Mix', quantity: 2000 }
          ]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const dashboardCards = [
    {
      id: 'hens',
      title: "🐔 Total Hen's",
      icon: Users,
      color: '#4299e1',
      data: dashboardData?.totalHens,
      columns: ['Shed', "Hen's Count"]
    },
    {
      id: 'mortality',
      title: '💀 Total Mortality',
      icon: TrendingDown,
      color: '#e53e3e',
      data: dashboardData?.totalMortality,
      columns: ['Shed', "Hen's Mortality"]
    },
    {
      id: 'stock',
      title: "🥚 Total Egg-Tray's Stock",
      icon: Package,
      color: '#38a169',
      data: dashboardData?.totalStock,
      columns: ['Shed', 'Tray Stock']
    },
    {
      id: 'sales',
      title: "🛒 Total Egg-Tray's Selling",
      icon: ShoppingCart,
      color: '#d69e2e',
      data: dashboardData?.totalSales,
      columns: ['Shed', 'Trays Sold']
    },
    {
      id: 'feed',
      title: '🍽️ Total Feed in Gudam (Warehouse)',
      icon: Warehouse,
      color: '#805ad5',
      data: dashboardData?.totalFeed,
      columns: ['Feed Type', 'Quantity (kg)']
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
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

      {/* Dashboard Cards */}
      <div className="dashboard-grid">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          const isExpanded = expandedCards[card.id];
          
          return (
            <div key={card.id} className="dashboard-card">
              <div 
                className="card-header"
                onClick={() => toggleCard(card.id)}
                style={{ borderLeftColor: card.color }}
              >
                <div className="card-title">
                  <Icon size={24} style={{ color: card.color }} />
                  <h3>{card.title}</h3>
                </div>
                <div className="card-summary">
                  <span className="card-total">
                    {card.data?.total?.toLocaleString() || '0'}
                  </span>
                  <button className="expand-button">
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                </div>
              </div>

              {isExpanded && card.data?.breakdown && (
                <div className="card-content">
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          {card.columns.map((column, index) => (
                            <th key={index}>{column}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {card.data.breakdown.map((item, index) => (
                          <tr key={index}>
                            {card.id === 'feed' ? (
                              <>
                                <td>{item.feed_type}</td>
                                <td>{parseFloat(item.quantity_kg).toLocaleString()}</td>
                              </>
                            ) : (
                              <>
                                <td>{item.shed_number}</td>
                                <td>
                                  {card.id === 'hens' && item.hen_count?.toLocaleString()}
                                  {card.id === 'mortality' && item.mortality_count?.toLocaleString()}
                                  {card.id === 'stock' && item.tray_stock?.toLocaleString()}
                                  {card.id === 'sales' && item.trays_sold?.toLocaleString()}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No Data Message */}
      {dashboardData && 
       Object.values(dashboardData).every(data => 
         !data?.breakdown || data.breakdown.length === 0
       ) && (
        <div className="no-data-message">
          <p>No data available for the selected date. Please add some data to see the dashboard.</p>
        </div>
      )}
    </div>
  );
};

export default Homepage;
