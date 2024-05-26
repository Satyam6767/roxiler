import React from 'react';

const TransactionsTable = ({ transactions }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Sold</th>
                    <th>Category</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((transaction, index) => (
                    <tr key={index}>
                        <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                        <td>{transaction.title}</td>
                        <td>{transaction.description}</td>
                        <td>{transaction.price}</td>
                        <td>{transaction.sold ? 'Yes' : 'No'}</td>
                        <td>{transaction.category}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TransactionsTable;
