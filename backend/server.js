

// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');

// dotenv.config();  // Load environment variables from .env file
// connectDB();

// const app = express();
// app.use(express.json());

// // Import routes
// const apiRoutes = require('./routes/api');
// app.use('/api', apiRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




const express = require('express');
const app = express();

// Example route that might be causing the error
app.get('/api/combined', async (req, res) => {
  try {
    const month = req.query.month;

    // Simulate a function that fetches data
    const data = await fetchDataForMonth(month);

    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error); // Log the error details
    res.status(500).send('Internal Server Error');
  }
});

// Example function that might be fetching data
async function fetchDataForMonth(month) {
  // Simulate an error for demonstration
  if (!month) {
    throw new Error('Month is required');
  }

  // Simulate a database call or other async operation
  return { month, data: [] };
}

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
