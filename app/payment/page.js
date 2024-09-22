
"use client"
import axios from 'axios';
import React, { useEffect } from 'react'

export default function payment() {
  const buyProduct1 = async () => {
    try {
      // here call a post method to save all the transaction requried data to transactions table.
      // get the transactionId from the response

      const transactionReqBody = {
        user_id: 1234,
        product_id: 1111,
        amount: 2000,
        status: '1',
      }
      
      // const response = await axios.post("/api/transactions",transactionReqBody);
      // console.log(response.data);



      // const purchaseReqBody = {
      //   productId: "530001",
      //   transactionId: transaction_id
      // }
      // const parchaseResponse = await axios.post("/api/purchaseProduct",purchaseReqBody);
      // console.log(parchaseResponse.data);

      // window.open(parchaseResponse.data.checkoutUrl, "_blank");


      // const response = await axios.get("/api/lemonsqueezy-products");
      // console.log(response.data);



      const response = await axios.get("/api/lemonsqueezy-products/358063");
      console.log(response.data);
    }
    catch (error) {
      console.error(error);
      alert("Failed to buy product #1");
    }
  }

  return (
    <div>
      <button onClick={buyProduct1} className='btn btn-success'> Buy product</button>
    </div>
  )
}
