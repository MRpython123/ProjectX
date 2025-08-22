import React, { useState, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MainPage = () => {
  const [selectedAngle, setSelectedAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const wheelRef = useRef(null);
  const lastYRef = useRef(0);

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

  // Handle wheel scroll
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 5 : -5;
    setSelectedAngle(prev => {
      let newAngle = prev + delta;
      if (newAngle < 0) newAngle = 360 + newAngle;
      if (newAngle >= 360) newAngle = newAngle - 360;
      return newAngle;
    });
  };

  // Handle mouse drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    lastYRef.current = e.clientY;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaY = lastYRef.current - e.clientY;
    const angleDelta = deltaY * 0.5; // Sensitivity adjustment
    
    setSelectedAngle(prev => {
      let newAngle = prev + angleDelta;
      if (newAngle < 0) newAngle = 360 + (newAngle % 360);
      if (newAngle >= 360) newAngle = newAngle % 360;
      return Math.round(newAngle);
    });
    
    lastYRef.current = e.clientY;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Generate angle marks for the wheel
  const generateAngleMarks = () => {
    const marks = [];
    for (let i = 0; i < 360; i += 10) {
      marks.push(i);
    }
    return marks;
  };

  const angleMarks = generateAngleMarks();
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
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            width: '280px',
            minWidth: '280px',
            flexShrink: 0
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '16px',
              textAlign: 'center',
              color: '#1f2937',
              margin: '0 0 16px 0'
            }}>
              Angle Selector
            </h3>
            
            {/* Current angle display */}
            <div style={{
              textAlign: 'center',
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              border: '1px solid #e0f2fe'
            }}>
              <div style={{
                fontSize: '42px',
                fontWeight: 'bold',
                color: '#2563eb',
                lineHeight: 1,
                marginBottom: '4px'
              }}>
                {selectedAngle}°
              </div>
              <div style={{
                fontSize: '14px',
                color: '#64748b'
              }}>
                Acceleration: {currentAcceleration.toFixed(2)} m/s²
              </div>
            </div>
            
            {/* Scrollable wheel */}
            <div style={{
              position: 'relative',
              height: '320px',
              overflow: 'hidden',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              backgroundColor: '#fafafa'
            }}
              ref={wheelRef}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
            >
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, transparent 20%, transparent 80%, rgba(255,255,255,0.9) 100%)',
                pointerEvents: 'none',
                zIndex: 10
              }}></div>
              
              {/* Center indicator line */}
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '50%',
                height: '2px',
                backgroundColor: '#2563eb',
                zIndex: 20,
                transform: 'translateY(-1px)'
              }}></div>
              <div style={{
                position: 'absolute',
                left: 0,
                width: '16px',
                top: '50%',
                height: '2px',
                backgroundColor: '#1d4ed8',
                zIndex: 20,
                transform: 'translateY(-1px)'
              }}></div>
              <div style={{
                position: 'absolute',
                right: 0,
                width: '16px',
                top: '50%',
                height: '2px',
                backgroundColor: '#1d4ed8',
                zIndex: 20,
                transform: 'translateY(-1px)'
              }}></div>
              
              {/* Angle marks */}
              <div style={{
                position: 'relative',
                transform: `translateY(${160 - (selectedAngle * 1.6)}px)`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                paddingTop: '200px',
                paddingBottom: '200px'
              }}>
                {angleMarks.map((angle) => {
                  const distance = Math.abs(angle - selectedAngle);
                  const minDistance = Math.min(distance, 360 - distance);
                  const opacity = Math.max(0.3, 1 - minDistance / 60);
                  const scale = Math.max(0.85, 1 - minDistance / 120);
                  
                  return (
                    <div
                      key={angle}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '6px 12px',
                        opacity,
                        transform: `scale(${scale})`,
                        transformOrigin: 'left center'
                      }}
                    >
                      <div style={{
                        width: angle % 30 === 0 ? '12px' : '8px',
                        height: '2px',
                        marginRight: '12px',
                        backgroundColor: angle % 30 === 0 ? '#374151' : '#9ca3af'
                      }}></div>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: angle % 30 === 0 ? 'bold' : 'normal',
                        color: angle % 30 === 0 ? '#374151' : '#6b7280'
                      }}>
                        {angle}°
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <p style={{
              fontSize: '12px',
              color: '#9ca3af',
              marginTop: '12px',
              textAlign: 'center',
              margin: '12px 0 0 0'
            }}>
              Scroll or drag to change angle
            </p>
          </div>
          
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