import React, { useState, useEffect } from 'react';
import axios from './api/api';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import './styles/App.css';
import MyChart from './components/MyChart';

const App = () => {
  const [month, setMonth] = useState('03');
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/combined?month=${month}`);
        setTransactions(data.transactions.transactions);
        setStatistics(data.statistics);
        setBarChartData(data.barChart);
        setPieChartData(data.pieChart);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [month]);

  return (
    <div className="App">
      <h1>Transaction Dashboard</h1>
      <label htmlFor="month">Select Month:</label>
      <select id="month" value={month} onChange={(e) => setMonth(e.target.value)}>
        <option value="01">January</option>
        <option value="02">February</option>
        <option value="03">March</option>
        <option value="04">April</option>
        <option value="05">May</option>
        <option value="06">June</option>
        <option value="07">July</option>
        <option value="08">August</option>
        <option value="09">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>

      <TransactionsTable transactions={transactions} />
      <Statistics statistics={statistics} />
      <BarChart data={barChartData} />
      <PieChart data={pieChartData} />
      <MyChart />
    </div>
  );
};

export default App;
