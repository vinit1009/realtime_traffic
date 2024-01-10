// src/components/SpeedsDisplay.js
import React from 'react';
import './SpeedsDisplay.css'; // Make sure to create a CSS file for styling

const SpeedsDisplay = ({ trafficData }) => {
    const recentData = trafficData.slice(-50); // Get the last 50 entries

    return (
        <div className="speeds-display">
            <h2>Recent Traffic Speeds</h2>
            <p>This table displays the most recent 50 recorded traffic speeds.</p>
            <table>
                <thead>
                    <tr>
                        <th>Speed (mph)</th>
                        <th>Time Recorded</th>
                        <th> Location</th>
                    </tr>
                </thead>
                <tbody>
                    {recentData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.speed}</td>
                            <td>{new Date(data.data_as_of).toLocaleString()}</td>
                            <td>{data.link_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SpeedsDisplay;
