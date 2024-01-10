// src/components/LineChart.js
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'; // Ensure Chart.js is auto-imported
import './LineChart.css'

const LineChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    const fetchTrafficData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/traffic_data/time_series');
            const data = await response.json();
            if (data && Array.isArray(data)) {
                setChartData({
                    labels: data.map(item => new Date(item.timestamp).toLocaleString()),
                    datasets: [
                        {
                            label: 'Average Traffic Speed',
                            data: data.map(item => item.average_speed),
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 2,
                            tension: 0.3, // Smooths the line
                        },
                    ],
                });
            }
        } catch (error) {
            console.error('Error fetching traffic data:', error);
        }
    };

    useEffect(() => {
        fetchTrafficData();
    }, []);

    return (
        <div className="line-chart-container">
            <div className="chart-header">
                <h2>Traffic Speed Analysis</h2>
                <p>This line chart represents the average traffic speed collected over time from various sensors across the city.</p>
            </div>
            <div className="chart-area">
                <Line data={chartData} />
            </div>
        </div>
    );
};

export default LineChart;
