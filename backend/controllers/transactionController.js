const axios = require('axios');
const Transaction = require('../models/Transaction');

exports.initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;
        await Transaction.deleteMany({});
        await Transaction.insertMany(data);
        res.status(200).json({ message: 'Database initialized successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listTransactions = async (req, res) => {
    const { month, page = 1, perPage = 10, search = '' } = req.query;
    const startOfMonth = new Date(`2024-${month}-01`);
    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
    const query = {
        dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
        $or: [
            { title: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
            { price: new RegExp(search, 'i') }
        ]
    };

    try {
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));

        const count = await Transaction.countDocuments(query);

        res.status(200).json({ transactions, totalPages: Math.ceil(count / perPage), currentPage: Number(page) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStatistics = async (req, res) => {
    const { month } = req.query;
    const startOfMonth = new Date(`2024-${month}-01`);
    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);

    try {
        const totalSaleAmount = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startOfMonth, $lt: endOfMonth } } },
            { $group: { _id: null, totalAmount: { $sum: "$price" } } }
        ]);

        const totalSoldItems = await Transaction.countDocuments({
            dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
            sold: true
        });

        const totalNotSoldItems = await Transaction.countDocuments({
            dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
            sold: false
        });

        res.status(200).json({
            totalSaleAmount: totalSaleAmount[0] ? totalSaleAmount[0].totalAmount : 0,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBarChart = async (req, res) => {
    const { month } = req.query;
    const startOfMonth = new Date(`2024-${month}-01`);
    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);

    const priceRanges = [
        { min: 0, max: 100 },
        { min: 101, max: 200 },
        { min: 201, max: 300 },
        { min: 301, max: 400 },
        { min: 401, max: 500 },
        { min: 501, max: 600 },
        { min: 601, max: 700 },
        { min: 701, max: 800 },
        { min: 801, max: 900 },
        { min: 901, max: Infinity }
    ];

    try {
        const barChartData = await Promise.all(priceRanges.map(async range => {
            const count = await Transaction.countDocuments({
                dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
                price: { $gte: range.min, $lt: range.max }
            });

            return { range: `${range.min}-${range.max}`, count };
        }));

        res.status(200).json(barChartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPieChart = async (req, res) => {
    const { month } = req.query;
    const startOfMonth = new Date(`2024-${month}-01`);
    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);

    try {
        const pieChartData = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startOfMonth, $lt: endOfMonth } } },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        res.status(200).json(pieChartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCombinedData = async (req, res) => {
    const { month } = req.query;

    try {
        const [transactions, statistics, barChart, pieChart] = await Promise.all([
            axios.get(`http://localhost:5000/api/transactions?month=${month}`),
            axios.get(`http://localhost:5000/api/statistics?month=${month}`),
            axios.get(`http://localhost:5000/api/barchart?month=${month}`),
            axios.get(`http://localhost:5000/api/piechart?month=${month}`)
        ]);

        res.status(200).json({
            transactions: transactions.data,
            statistics: statistics.data,
            barChart: barChart.data,
            pieChart: pieChart.data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
