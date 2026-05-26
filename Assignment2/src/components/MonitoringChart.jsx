import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, Sprout } from 'lucide-react';

export default function MonitoringChart({ records }) {
  const [chartType, setChartType] = useState('district'); // 'district' | 'species' | 'monthly'

  // 1. Process Data: Trees Planted by District
  const districtData = useMemo(() => {
    const dataMap = {};
    records.forEach(r => {
      dataMap[r.district] = (dataMap[r.district] || 0) + r.treesPlanted;
    });
    return Object.keys(dataMap).map(key => ({
      name: key,
      trees: dataMap[key]
    })).sort((a, b) => b.trees - a.trees);
  }, [records]);

  // 2. Process Data: Trees Planted by Species
  const speciesData = useMemo(() => {
    const dataMap = {};
    records.forEach(r => {
      dataMap[r.species] = (dataMap[r.species] || 0) + r.treesPlanted;
    });
    return Object.keys(dataMap).map(key => ({
      // Shorten long species names for labels if needed
      name: key.length > 15 ? key.substring(0, 13) + '..' : key,
      fullName: key,
      trees: dataMap[key]
    })).sort((a, b) => b.trees - a.trees);
  }, [records]);

  // 3. Process Data: Planting Trend over Months (timeline)
  const monthlyData = useMemo(() => {
    const dataMap = {};
    records.forEach(r => {
      // Get Year-Month key from date string (YYYY-MM)
      if (r.plantingDate) {
        const date = new Date(r.plantingDate);
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'short' });
        const sortKey = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!dataMap[sortKey]) {
          dataMap[sortKey] = {
            sortKey,
            name: `${month} ${year}`,
            trees: 0
          };
        }
        dataMap[sortKey].trees += r.treesPlanted;
      }
    });
    
    // Sort chronologically by the YYYY-MM sortKey
    return Object.keys(dataMap)
      .sort()
      .map(key => dataMap[key]);
  }, [records]);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Find full species name if abbreviated
      let displayLabel = label;
      if (chartType === 'species') {
        const matchingSpecies = speciesData.find(s => s.name === label);
        if (matchingSpecies) displayLabel = matchingSpecies.fullName;
      }

      return (
        <div className="custom-tooltip">
          <p className="custom-tooltip-title">{displayLabel}</p>
          <p className="custom-tooltip-item">
            {`Trees Planted: ${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="panel-card" id="chart-panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Agroforestry Metrics Visualizer</h2>
          <p className="panel-subtitle">Visualize plantation metrics and health logs in real time</p>
        </div>

        <div className="filter-wrapper" style={{ gap: '0.4rem' }}>
          <button
            id="btn-chart-district"
            className={`btn-page ${chartType === 'district' ? 'active' : ''}`}
            onClick={() => setChartType('district')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem',
              backgroundColor: chartType === 'district' ? 'var(--primary-color-glow)' : 'transparent',
              borderColor: chartType === 'district' ? 'var(--primary-color)' : 'var(--border-color)',
              color: chartType === 'district' ? 'var(--primary-color)' : 'var(--text-secondary)'
            }}
          >
            <BarChart3 size={14} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Districts</span>
          </button>

          <button
            id="btn-chart-species"
            className={`btn-page ${chartType === 'species' ? 'active' : ''}`}
            onClick={() => setChartType('species')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem',
              backgroundColor: chartType === 'species' ? 'var(--primary-color-glow)' : 'transparent',
              borderColor: chartType === 'species' ? 'var(--primary-color)' : 'var(--border-color)',
              color: chartType === 'species' ? 'var(--primary-color)' : 'var(--text-secondary)'
            }}
          >
            <Sprout size={14} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Species</span>
          </button>

          <button
            id="btn-chart-monthly"
            className={`btn-page ${chartType === 'monthly' ? 'active' : ''}`}
            onClick={() => setChartType('monthly')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem',
              backgroundColor: chartType === 'monthly' ? 'var(--primary-color-glow)' : 'transparent',
              borderColor: chartType === 'monthly' ? 'var(--primary-color)' : 'var(--border-color)',
              color: chartType === 'monthly' ? 'var(--primary-color)' : 'var(--text-secondary)'
            }}
          >
            <TrendingUp size={14} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Trends</span>
          </button>
        </div>
      </div>

      <div className="chart-container-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'monthly' ? (
            <AreaChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTrees" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--secondary-color)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--secondary-color)" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="var(--border-color)" 
              />
              <XAxis 
                dataKey="name" 
                stroke="var(--text-muted)" 
                fontSize={11} 
                fontWeight={600}
                tickLine={false} 
              />
              <YAxis 
                stroke="var(--text-muted)" 
                fontSize={11} 
                fontWeight={600}
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="trees" 
                stroke="var(--secondary-color)" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorTrees)" 
                name="Trees Planted"
              />
            </AreaChart>
          ) : (
            <BarChart
              data={chartType === 'district' ? districtData : speciesData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.85}/>
                  <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="var(--border-color)" 
              />
              <XAxis 
                dataKey="name" 
                stroke="var(--text-muted)" 
                fontSize={10} 
                fontWeight={600}
                tickLine={false} 
              />
              <YAxis 
                stroke="var(--text-muted)" 
                fontSize={11} 
                fontWeight={600}
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border-color)', opacity: 0.2 }} />
              <Bar 
                dataKey="trees" 
                fill="url(#barGradient)" 
                radius={[4, 4, 0, 0]} 
                name="Trees Planted"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
