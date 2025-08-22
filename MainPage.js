import React, { useEffect, useMemo, useState } from 'react';

export default function MainPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/data', { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        const payload = await response.json();
        const normalized = Array.isArray(payload)
          ? payload
              .filter((d) => d && typeof d.angle === 'number' && typeof d.acceleration === 'number')
              .map((d) => ({ angle: d.angle, acceleration: d.acceleration }))
          : [];
        setData(normalized);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load data');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  const width = 800;
  const height = 480;
  const margin = { top: 24, right: 24, bottom: 40, left: 56 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const { xDomain, yDomain, linePoints, xTicks, yTicks } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        xDomain: [0, 1],
        yDomain: [0, 1],
        linePoints: [],
        xTicks: [],
        yTicks: [],
      };
    }

    const sorted = [...data].sort((a, b) => a.angle - b.angle);

    let minX = Math.min(...sorted.map((d) => d.acceleration));
    let maxX = Math.max(...sorted.map((d) => d.acceleration));
    if (minX === maxX) {
      const delta = Math.abs(minX) || 1;
      minX -= delta;
      maxX += delta;
    }

    let minY = Math.min(...sorted.map((d) => d.angle));
    let maxY = Math.max(...sorted.map((d) => d.angle));
    if (minY === maxY) {
      const delta = Math.abs(minY) || 1;
      minY -= delta;
      maxY += delta;
    }

    const tickCount = 6;
    const makeTicks = (min, max) => {
      const span = max - min;
      const step = span / (tickCount - 1);
      return Array.from({ length: tickCount }, (_, i) => min + i * step);
    };

    const xTicksLocal = makeTicks(minX, maxX);
    const yTicksLocal = makeTicks(minY, maxY);

    const pts = sorted
      .map((d) => ({ x: d.acceleration, y: d.angle }))
      .map((p) => ({
        x: margin.left + ((p.x - minX) / (maxX - minX)) * innerWidth,
        y: margin.top + (1 - (p.y - minY) / (maxY - minY)) * innerHeight,
      }));

    return {
      xDomain: [minX, maxX],
      yDomain: [minY, maxY],
      linePoints: pts,
      xTicks: xTicksLocal,
      yTicks: yTicksLocal,
    };
  }, [data, innerHeight, innerWidth, margin.bottom, margin.left, margin.right, margin.top]);

  const formatNumber = (n) => {
    if (Math.abs(n) >= 1000) return n.toFixed(0);
    if (Math.abs(n) >= 100) return n.toFixed(1);
    if (Math.abs(n) >= 1) return n.toFixed(2);
    return n.toExponential(1);
  };

  const xScale = (v) => {
    const [minX, maxX] = xDomain;
    return margin.left + ((v - minX) / (maxX - minX)) * innerWidth;
  };

  const yScale = (v) => {
    const [minY, maxY] = yDomain;
    return margin.top + (1 - (v - minY) / (maxY - minY)) * innerHeight;
  };

  const linePath = useMemo(() => {
    if (!linePoints || linePoints.length === 0) return '';
    return linePoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  }, [linePoints]);

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif', padding: 16 }}>
      <h2 style={{ margin: '0 0 12px 0' }}>Acceleration vs Angle</h2>
      {loading && <div>Loading…</div>}
      {!loading && error && (
        <div style={{ color: '#b00020', marginBottom: 8 }}>Error: {error}</div>
      )}
      {!loading && !error && data.length === 0 && <div>No data</div>}

      {!loading && !error && data.length > 0 && (
        <svg width={width} height={height} role="img" aria-label="Acceleration vs Angle chart">
          <rect x={0} y={0} width={width} height={height} fill="#ffffff" />

          <line
            x1={margin.left}
            y1={height - margin.bottom}
            x2={width - margin.right}
            y2={height - margin.bottom}
            stroke="#222"
            strokeWidth={1}
          />
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={height - margin.bottom}
            stroke="#222"
            strokeWidth={1}
          />

          {xTicks.map((t, i) => (
            <g key={`xt-${i}`} transform={`translate(${xScale(t)}, ${height - margin.bottom})`}>
              <line y2={6} stroke="#222" />
              <text y={20} textAnchor="middle" fontSize={12} fill="#222">
                {formatNumber(t)}
              </text>
              <line
                x1={0}
                y1={-innerHeight}
                x2={0}
                y2={0}
                stroke="#000"
                strokeOpacity={0.06}
              />
            </g>
          ))}

          {yTicks.map((t, i) => (
            <g key={`yt-${i}`} transform={`translate(${margin.left}, ${yScale(t)})`}>
              <line x1={-6} x2={0} stroke="#222" />
              <text x={-10} dy={4} textAnchor="end" fontSize={12} fill="#222">
                {formatNumber(t)}
              </text>
              <line
                x1={0}
                y1={0}
                x2={innerWidth}
                y2={0}
                stroke="#000"
                strokeOpacity={0.06}
              />
            </g>
          ))}

          <text
            x={(margin.left + width - margin.right) / 2}
            y={height - 8}
            textAnchor="middle"
            fontSize={13}
            fill="#222"
          >
            Acceleration
          </text>

          <text
            x={-(margin.top + innerHeight / 2)}
            y={16}
            transform="rotate(-90)"
            textAnchor="middle"
            fontSize={13}
            fill="#222"
          >
            Angle
          </text>

          <path d={linePath} fill="none" stroke="#2563eb" strokeWidth={2} />

          {linePoints.map((p, i) => (
            <circle key={`pt-${i}`} cx={p.x} cy={p.y} r={3} fill="#1d4ed8" />
          ))}
        </svg>
      )}

      <div style={{ marginTop: 12, color: '#555', fontSize: 12 }}>
        Data endpoint: <code>/api/data</code> expects items shaped as {`{ angle: number, acceleration: number }`}
      </div>
    </div>
  );
}