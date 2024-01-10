// src/components/PieChart.js
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const PieChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Traffic Conditions',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
        }],
    });

    const fetchTrafficConditionData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/traffic_data/conditions');
            const data = await response.json();
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                setChartData(prevData => ({
                    ...prevData,
                    labels: Object.keys(data),
                    datasets: prevData.datasets.map(dataset => ({
                        ...dataset,
                        data: Object.values(data)
                    }))
                }));
            }
        } catch (error) {
            console.error('Error fetching traffic condition data:', error);
        }
    };

    useEffect(() => {
        fetchTrafficConditionData();
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div>
                <h2>Traffic Condition Distribution</h2>
                <Pie data={chartData} />
            </div>
            <div style={{ marginLeft: '20px' }}>
                <h3>Legend</h3>
                <p><strong>Congested:</strong> Speed less than 20 mph</p>
                <p><strong>Slow-moving:</strong> Speed between 20 and 40 mph</p>
                <p><strong>Free-flowing:</strong> Speed greater than 40 mph</p>
            </div>
        </div>
    );
};

export default PieChart;
