// import dbConnect, { pool } from '@/utils/dbConnect';
// export const dynamic = 'force-dynamic';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function TransactionTable() {
    const [transactions, setTransactions] = useState([]);
    const fetchTransactions = async () =>{
        const response = await axios.get("/api/transactions-data");
        setTransactions(response?.data);
    }
    useEffect(()=>{
        fetchTransactions();
    },[])
    return (
        <div className='mt-10'>
            <div className="overflow-x-auto">
                <table className="table table-xs">
                    <thead>
                        <tr>
                            <th>product_id</th>
                            <th>product_name</th>
                            <th>customer_id</th>
                            <th>user_name</th>
                            <th>Last total</th>
                            <th>status</th>
                            <th>created_at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.product_id}</td>
                                    <td>{item.product_name}</td>
                                    <td>{item.customer_id}</td>
                                    <td>{item.user_name}</td>
                                    <td>{item.total}</td>
                                    <td>{item.status}</td>
                                    <td>{item.created_at}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No transactions found</td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    )
}
