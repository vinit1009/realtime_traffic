// src/App.js
import React, { useEffect, useState } from 'react';
import TrafficMap from './components/TrafficMap';
import SpeedsDisplay from './components/SpeedsDisplay';
import VolumesDisplay from './components/VolumesDisplay';
import LineChart from './components/LineChart';
import Heatmap from './components/Heatmap';
import PieChart from './components/PieChart';
import './App.css'; // Main app styling



const App = () => {
    const [trafficSpeeds, setTrafficSpeeds] = useState([]);
    const [trafficVolumes, setTrafficVolumes] = useState([]);
    const [trafficData, setTrafficData] = useState([]);

    useEffect(() => {
        // Fetch traffic speeds
        fetch('http://127.0.0.1:5000/traffic_speeds')
            .then(response => response.json())
            .then(data => setTrafficSpeeds(data));

        // Fetch traffic volumes
        fetch('http://127.0.0.1:5000/traffic_volume')
            .then(response => response.json())
            .then(data => setTrafficVolumes(data));

        fetch('http://127.0.0.1:5000/traffic_data/heatmap')
            .then(response => response.json())
            .then(data => setTrafficData(data));
    }, []);

    // Filter logic can be implemented here based on user input

    return (
        <div className="App">
            <TrafficMap trafficData={trafficSpeeds} />

            <LineChart />
            <Heatmap trafficData={trafficData} />
            <PieChart />
            <SpeedsDisplay trafficData={trafficSpeeds} />
            <VolumesDisplay trafficData={trafficVolumes} />
            

        </div>
    );
};

export default App;
