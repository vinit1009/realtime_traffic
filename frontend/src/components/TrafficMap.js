// src/components/TrafficMap.js
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TrafficMap.css'; // Assuming you have a CSS file for styling

const TrafficMap = ({ trafficData }) => {
    const mapRef = useRef(null);
    const congestionThreshold = 30; // Threshold speed for congestion in mph

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([40.7128, -74.0060], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
        }

        trafficData.forEach(data => {
            if (data.location) {
                const isCongested = parseFloat(data.speed) < congestionThreshold;
                const markerColor = isCongested ? 'red' : 'green';
                const marker = L.circleMarker(
                    [data.location.latitude, data.location.longitude], 
                    { color: markerColor }
                ).addTo(mapRef.current);

                marker.bindPopup(`Speed: ${data.speed} mph<br>Time: ${data.data_as_of}`);
            }
        });
    }, [trafficData]);

    return (
        <div className="traffic-map-container">
            <h2>Real-Time Traffic Map of NYC</h2>
            <p>This map displays real-time traffic data. Congested areas are marked in red, while free-flowing traffic is indicated in green.</p>
            <div id="map" className="traffic-map"></div>
        </div>
    );
};

export default TrafficMap;
