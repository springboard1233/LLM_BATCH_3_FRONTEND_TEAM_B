/**
 * Customizable Dashboard with drag-and-drop layout
 */
import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const CustomizableDashboard = ({ dashboardId = 'default', userId }) => {
  const [layout, setLayout] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardLayout();
  }, [dashboardId, userId]);

  const loadDashboardLayout = async () => {
    try {
      const response = await fetch(
        `/api/user-preferences/dashboard-layout/${dashboardId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setWidgets(data.layout?.widgets || []);
        setLayout(data.layout?.widgets?.map(w => w.position) || []);
      }
    } catch (error) {
      console.error('Error loading dashboard layout:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDashboardLayout = async () => {
    try {
      const updatedWidgets = widgets.map((widget, index) => ({
        ...widget,
        position: layout[index]
      }));

      const response = await fetch(
        `/api/user-preferences/dashboard-layout/${dashboardId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({
            layout: {
              widgets: updatedWidgets,
              grid_config: {
                cols: 12,
                row_height: 60,
                margin: [16, 16]
              }
            }
          })
        }
      );

      if (response.ok) {
        console.log('Dashboard layout saved');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving dashboard layout:', error);
    }
  };

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  const resetLayout = async () => {
    try {
      const response = await fetch(
        `/api/user-preferences/dashboard-layout/${dashboardId}/reset`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );

      if (response.ok) {
        await loadDashboardLayout();
      }
    } catch (error) {
      console.error('Error resetting dashboard layout:', error);
    }
  };

  const renderWidget = (widget) => {
    switch (widget.type) {
      case 'stats':
        return <StatsWidget config={widget.config} />;
      case 'chart':
        return <ChartWidget config={widget.config} />;
      case 'alerts':
        return <AlertsWidget config={widget.config} />;
      case 'table':
        return <TableWidget config={widget.config} />;
      default:
        return <div>Unknown widget type: {widget.type}</div>;
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="customizable-dashboard">
      <div className="dashboard-controls">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="button-secondary"
        >
          {isEditing ? 'Cancel' : 'Edit Layout'}
        </button>
        {isEditing && (
          <>
            <button onClick={saveDashboardLayout} className="button-primary">
              Save Layout
            </button>
            <button onClick={resetLayout} className="button-secondary">
              Reset to Default
            </button>
          </>
        )}
      </div>

      <ResponsiveGridLayout
        className="dashboard-grid"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        isDraggable={isEditing}
        isResizable={isEditing}
        onLayoutChange={handleLayoutChange}
        margin={[16, 16]}
        containerPadding={[16, 16]}
      >
        {widgets.map((widget) => (
          <div key={widget.id} className="dashboard-widget">
            <div className="widget-header">
              <h3>{widget.id}</h3>
              {isEditing && (
                <button className="widget-remove">×</button>
              )}
            </div>
            <div className="widget-content">
              {renderWidget(widget)}
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

// Placeholder widget components
const StatsWidget = ({ config }) => (
  <div className="stats-widget">
    <div className="stat-item">
      <span className="stat-label">Total Transactions</span>
      <span className="stat-value">12,345</span>
    </div>
  </div>
);

const ChartWidget = ({ config }) => (
  <div className="chart-widget">
    <p>Chart: {config.metric}</p>
  </div>
);

const AlertsWidget = ({ config }) => (
  <div className="alerts-widget">
    <p>Recent Alerts (limit: {config.limit})</p>
  </div>
);

const TableWidget = ({ config }) => (
  <div className="table-widget">
    <p>Transaction Table</p>
  </div>
);

export default CustomizableDashboard;
