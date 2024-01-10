// src/components/VolumesDisplay.js
import React from 'react';

import './SpeedsDisplay'; // Make sure to create a CSS file for styling

const VolumesDisplay = ({ trafficData }) => {
    const recentData = trafficData.slice(-50); // Get the last 50 entries

    return (
        <div className="volumes-display">
            <h2>Recent Traffic Volumes</h2>
            <p>This table displays the most recent 50 traffic volume counts along with their locations.</p>
            <table>
                <thead>
                    <tr>
                        <th>Volume</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {recentData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.volume}</td>
                            <td>{data.street}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VolumesDisplay;
