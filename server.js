const express = require('express')
const cronJob = require('cron').CronJob;
const mongoose = require('mongoose');
const cors = require('cors')
const axios = require('axios')

const config = require('./config');

const app = express();

app.use(cors())
require('dotenv').config();

mongoose.connect(config.mongoURI).then(res => console.log('MongoDB Connected')).catch(err => console.log(err))
require('./models/Transaction');

const cron = new cronJob('0 */5 * * * *', () => {
  const Transaction = mongoose.model('transactions');
  Transaction.find().then(res => res.forEach(tx => {
    console.log(tx.contract)
    axios.get(`http://api.etherscan.io/api?module=account&action=txlist&address=${tx.contract}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.API_KEY}`).then(data => {
      if(data.data.status !== "1" || !data.data.result || data.data.result.length === 0) {
        return;
      }
      console.log("----------", tx.contract);
      tx.transactions = data.data.result.map(item => ({
        blockNumber: item.blockNumber,
        timeStamp: item.timeStamp,
        hash: item.hash,
        nonce: item.nonce,
        blockHash: item.blockHash,
        transactionIndex: item.transactionIndex,
        from: item.from,
        to: item.to,
        value: item.value,
        gas: item.gas,
        gasPrice: item.gasPrice,
        isError: item.isError,
        txreceiptStatus: item.txreceipt_status,
        input: item.input,
        cumulativeGasUsed: item.cumulativeGasUsed,
        gasUsed: item.gasUsed,
        confirmations: item.confirmations
      }))
      tx.save();
    })
  }));
})

cron.start();

app.use('/', require('./controllers/TransactionCtrl'));

app.listen(8001, () => console.log("Server is running at Port 8001"));