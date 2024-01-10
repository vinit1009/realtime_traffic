import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

const Heatmap = () => {
    const mapRef = useRef(null); // Ref for the map instance
    const containerRef = useRef(null); // Ref for the map container DOM element

    useEffect(() => {
        // Initialize the map only if it hasn't been initialized
        if (!mapRef.current && containerRef.current) {
            mapRef.current = L.map(containerRef.current).setView([40.7128, -74.0060], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
        }

        // Fetch heatmap data
        fetch('http://127.0.0.1:5000/traffic_data/heatmap')
            .then(response => response.json())
            .then(data => {
                const heatPoints = data.map(point => [point[0], point[1], point[2]]);
                L.heatLayer(heatPoints, { radius: 25, blur: 15 }).addTo(mapRef.current);
            })
            .catch(error => console.error('Error fetching heatmap data:', error));

        // Cleanup on unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.remove(); // Remove map from DOM
                mapRef.current = null;
            }
        };
    }, []);

    return <div ref={containerRef} style={{ height: '500px' }} />;
};

export default Heatmap;
