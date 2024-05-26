// const express = require('express');
// const router = express.Router();
// const {
//     initializeDatabase,
//     listTransactions,
//     getStatistics,
//     getBarChart,
//     getPieChart,
//     getCombinedData
// } = require('../controllers/transactionController');

// router.get('/initialize', initializeDatabase);
// router.get('/transactions', listTransactions);
// router.get('/statistics', getStatistics);
// router.get('/barchart', getBarChart);
// router.get('/piechart', getPieChart);
// router.get('/combined', getCombinedData);

// module.exports = router;


const express = require('express');
const app = express();

app.get('/api/combined', async (req, res) => {
  try {
    const month = req.query.month;
    if (!month) {
      throw new Error('Month parameter is required');
    }

    // Simulate data fetching
    const data = await fetchDataForMonth(month);
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error.message); // Log error details
    res.status(500).send('Internal Server Error');
  }
});

async function fetchDataForMonth(month) {
  // Simulate a database call or some processing
  if (month === '03') {
    throw new Error('Simulated error for month 03');
  }
  return { month, data: [] };
}

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
