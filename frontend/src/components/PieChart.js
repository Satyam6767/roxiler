import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item._id),
        datasets: [
            {
                label: 'Categories',
                data: data.map(item => item.count),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ]
            }
        ]
    };

    return (
        <div>
            <h3>Pie Chart</h3>
            <Pie data={chartData} />
        </div>
    );
};

export default PieChart;
