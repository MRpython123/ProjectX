import React, { useState, useRef, useEffect } from 'react';

const AngleWheel = ({ 
  initialAngle = 0, 
  onAngleChange = () => {},
  currentValue = null,
  valueLabel = "",
  valueUnit = "",
  title = "Angle Selector",
  width = "280px",
  height = "320px",
  stepSize = 5,
  showInstructions = true
}) => {
  const [selectedAngle, setSelectedAngle] = useState(initialAngle);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(initialAngle.toString());
  const wheelRef = useRef(null);
  const lastYRef = useRef(0);
  const inputRef = useRef(null);

  // Update parent component when angle changes
  useEffect(() => {
    onAngleChange(selectedAngle);
  }, [selectedAngle, onAngleChange]);

  // Update input value when selectedAngle changes (from wheel/drag)
  useEffect(() => {
    if (!isEditing) {
      setInputValue(selectedAngle.toString());
    }
  }, [selectedAngle, isEditing]);

  // Handle manual input
  const handleInputClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setInputValue(selectedAngle.toString());
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 10);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      let normalizedAngle = ((value % 360) + 360) % 360;
      normalizedAngle = Math.round(normalizedAngle);
      setSelectedAngle(normalizedAngle);
    } else {
      setInputValue(selectedAngle.toString());
    }
    setIsEditing(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    } else if (e.key === 'Escape') {
      setInputValue(selectedAngle.toString());
      setIsEditing(false);
    }
  };

  const handleInputBlur = () => {
    handleInputSubmit();
  };

  // Handle wheel scroll
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? stepSize : -stepSize;
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

  // Generate angle marks for the wheel - create seamless circular loop
  const generateAngleMarks = () => {
    const marks = [];
    // Create enough marks to fill the visible area plus buffer
    const totalMarks = Math.ceil(parseInt(height) / 16) + 20; // 16px per mark spacing
    const startAngle = selectedAngle - (totalMarks / 2) * 10;
    
    for (let i = 0; i < totalMarks; i++) {
      const angle = startAngle + (i * 10);
      let normalizedAngle = ((angle % 360) + 360) % 360; // Normalize to 0-359
      
      marks.push({
        angle: normalizedAngle,
        position: i,
        relativePosition: angle - selectedAngle
      });
    }
    return marks;
  };

  const angleMarks = generateAngleMarks();

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      width: width,
      minWidth: width,
      flexShrink: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '16px',
        textAlign: 'center',
        color: '#1f2937',
        margin: '0 0 16px 0'
      }}>
        {title}
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
        {currentValue !== null && (
          <div style={{
            fontSize: '14px',
            color: '#64748b'
          }}>
            {valueLabel}: {typeof currentValue === 'number' ? currentValue.toFixed(2) : currentValue} {valueUnit}
          </div>
        )}
      </div>
      
      {/* Scrollable wheel */}
      <div style={{
        position: 'relative',
        height: height,
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
          height: '100%'
        }}>
          {angleMarks.map((mark, index) => {
            const distanceFromCenter = Math.abs(mark.relativePosition);
            const opacity = Math.max(0.3, 1 - distanceFromCenter / 60);
            const scale = Math.max(0.85, 1 - distanceFromCenter / 120);
            
            // Calculate position relative to center
            const yPosition = parseInt(height) / 2 + (mark.relativePosition * 1.6);
            
            // Only render if within visible bounds
            if (yPosition < -50 || yPosition > parseInt(height) + 50) {
              return null;
            }
            
            return (
              <div
                key={`mark-${mark.angle}-${index}`}
                style={{
                  position: 'absolute',
                  top: `${yPosition}px`,
                  left: '12px',
                  right: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  opacity,
                  transform: `scale(${scale})`,
                  transformOrigin: 'left center',
                  height: '24px', // Fixed height to prevent overlap
                  pointerEvents: 'none'
                }}
              >
                <div style={{
                  width: mark.angle % 30 === 0 ? '12px' : '8px',
                  height: '2px',
                  marginRight: '12px',
                  backgroundColor: mark.angle % 30 === 0 ? '#374151' : '#9ca3af',
                  flexShrink: 0
                }}></div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: mark.angle % 30 === 0 ? 'bold' : 'normal',
                  color: mark.angle % 30 === 0 ? '#374151' : '#6b7280',
                  whiteSpace: 'nowrap'
                }}>
                  {mark.angle}°
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {showInstructions && (
        <p style={{
          fontSize: '12px',
          color: '#9ca3af',
          marginTop: '12px',
          textAlign: 'center',
          margin: '12px 0 0 0'
        }}>
          Scroll, drag, or click angle to edit manually
        </p>
      )}
    </div>
  );
};

export default AngleWheel;