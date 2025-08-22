import { useEffect, useState } from 'react'
import './App.css'
import {
	ResponsiveContainer,
	ScatterChart,
	Scatter,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend
} from 'recharts'

interface AngleAccelPoint {
	angle: number
	acceleration: number
}

function App() {
	const [data, setData] = useState<AngleAccelPoint[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	useEffect(() => {
		async function loadData() {
			try {
				const response = await fetch('/data/angleAcceleration.json')
				if (!response.ok) throw new Error(`Failed to load data: ${response.status}`)
				const json = (await response.json()) as AngleAccelPoint[]
				// Sort by angle ascending for nicer Y-axis ordering
				json.sort((a, b) => a.angle - b.angle)
				setData(json)
			} catch (error) {
				setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
			} finally {
				setIsLoading(false)
			}
		}
		loadData()
	}, [])

	return (
		<div style={{ width: '100%', height: '100vh', padding: 16, boxSizing: 'border-box' }}>
			<h1 style={{ marginTop: 0 }}>Acceleration vs Angle</h1>
			<p style={{ marginTop: 0 }}>X-axis: acceleration, Y-axis: angle</p>
			{isLoading && <div>Loading…</div>}
			{errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
			{!isLoading && !errorMessage && (
				<ResponsiveContainer width="100%" height="80%">
					<ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
						<CartesianGrid />
						<XAxis type="number" dataKey="acceleration" name="acceleration" label={{ value: 'Acceleration', position: 'insideBottom', offset: -5 }} />
						<YAxis type="number" dataKey="angle" name="angle" label={{ value: 'Angle (deg)', angle: -90, position: 'insideLeft' }} />
						<Tooltip cursor={{ strokeDasharray: '3 3' }} />
						<Legend />
						<Scatter name="Samples" data={data} fill="#8884d8" />
					</ScatterChart>
				</ResponsiveContainer>
			)}
		</div>
	)
}

export default App
