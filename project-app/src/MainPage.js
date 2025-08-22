import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AngleWheel from './AngleWheel';

const MainPage = () => {
  const [selectedAngle, setSelectedAngle] = useState(0);

  // Hardcoded JSON data with angle and acceleration values
  // Simulating a sinusoidal relationship for realistic physics data
  const data = [
    { angle: 0, acceleration: 0 },
    { angle: 10, acceleration: 1.74 },
    { angle: 20, acceleration: 3.42 },
    { angle: 30, acceleration: 5.00 },
    { angle: 40, acceleration: 6.43 },
    { angle: 50, acceleration: 7.66 },
    { angle: 60, acceleration: 8.66 },
    { angle: 70, acceleration: 9.40 },
    { angle: 80, acceleration: 9.85 },
    { angle: 90, acceleration: 10.00 },
    { angle: 100, acceleration: 9.85 },
    { angle: 110, acceleration: 9.40 },
    { angle: 120, acceleration: 8.66 },
    { angle: 130, acceleration: 7.66 },
    { angle: 140, acceleration: 6.43 },
    { angle: 150, acceleration: 5.00 },
    { angle: 160, acceleration: 3.42 },
    { angle: 170, acceleration: 1.74 },
    { angle: 180, acceleration: 0 },
    { angle: 190, acceleration: -1.74 },
    { angle: 200, acceleration: -3.42 },
    { angle: 210, acceleration: -5.00 },
    { angle: 220, acceleration: -6.43 },
    { angle: 230, acceleration: -7.66 },
    { angle: 240, acceleration: -8.66 },
    { angle: 250, acceleration: -9.40 },
    { angle: 260, acceleration: -9.85 },
    { angle: 270, acceleration: -10.00 },
    { angle: 280, acceleration: -9.85 },
    { angle: 290, acceleration: -9.40 },
    { angle: 300, acceleration: -8.66 },
    { angle: 310, acceleration: -7.66 },
    { angle: 320, acceleration: -6.43 },
    { angle: 330, acceleration: -5.00 },
    { angle: 340, acceleration: -3.42 },
    { angle: 350, acceleration: -1.74 },
    { angle: 360, acceleration: 0 }
  ];

  const currentAcceleration = data.find(d => Math.abs(d.angle - selectedAngle) <= 5)?.acceleration || 0;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 8px 0'
          }}>
            Acceleration vs Angle Analysis
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: 0
          }}>
            Use the angle wheel to explore acceleration values at different angles
          </p>
        </div>
        
        {/* Main Content */}
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'stretch',
          flexWrap: 'wrap'
        }}>
          {/* Angle Wheel Control */}
          <AngleWheel
            initialAngle={selectedAngle}
            onAngleChange={setSelectedAngle}
            currentValue={currentAcceleration}
            valueLabel="Acceleration"
            valueUnit="m/s²"
            title="Angle Selector"
          />
          
          {/* Graph */}
          <div style={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            minWidth: '500px'
          }}>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="acceleration" 
                  type="number"
                  domain={[-12, 12]}
                  label={{ 
                    value: 'Acceleration (m/s²)', 
                    position: 'insideBottom', 
                    offset: -10,
                    style: { textAnchor: 'middle' }
                  }}
                  stroke="#666"
                />
                <YAxis 
                  dataKey="angle"
                  type="number" 
                  domain={[selectedAngle - 50, selectedAngle + 50]}
                  label={{ 
                    value: 'Angle (°)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                  stroke="#666"
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value}${name === 'acceleration' ? ' m/s²' : '°'}`, 
                    name === 'acceleration' ? 'Acceleration' : 'Angle'
                  ]}
                  labelFormatter={(label) => `Acceleration: ${label} m/s²`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="angle" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={(props) => {
                    const isSelected = Math.abs(props.payload.angle - selectedAngle) <= 5;
                    return (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={isSelected ? 6 : 3}
                        fill={isSelected ? '#dc2626' : '#2563eb'}
                        stroke={isSelected ? '#dc2626' : '#2563eb'}
                        strokeWidth={1}
                      />
                    );
                  }}
                  name="Angle"
                />
              </LineChart>
            </ResponsiveContainer>
            
            {/* Current point highlight */}
            <div style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#eff6ff',
              border: '1px solid #dbeafe',
              borderRadius: '8px'
            }}>
              <h4 style={{
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '8px',
                margin: '0 0 8px 0'
              }}>
                Current Selection
              </h4>
              <p style={{
                color: '#1d4ed8',
                margin: 0,
                fontSize: '14px'
              }}>
                <span style={{ fontWeight: '500' }}>Angle:</span> {selectedAngle}° | 
                <span style={{ fontWeight: '500' }}> Acceleration:</span> {currentAcceleration.toFixed(2)} m/s²
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
