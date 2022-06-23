const express = require('express')
const cronJob = require('cron').CronJob;
const mongoose = require('mongoose');
const cors = require('cors')
const axios = require('axios')

const config = require('./config');

const app = express();

app.use(cors())

mongoose.connect(config.mongoURI).then(res => console.log('MongoDB Connected')).catch(err => console.log(err))
require('./models/Transaction');

const cron = new cronJob('0 */5 * * * *', () => {
  const Transaction = mongoose.model('transactions');
  Transaction.find().then(res => res.forEach(tx => {
    axios.get(`http://api.${tx.chain}/api?module=account&action=txlist&address=${tx.contract}&startblock=0&endblock=99999999&sort=asc`).then(data => {
      if(data.data.status !== "1" || !data.data.result || data.data.result.length === 0) {
        return;
      }
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
      }));
      tx.save();
    })
  }));
})

cron.start();

app.use('/', require('./controllers/TransactionCtrl'));

app.listen(8001, () => console.log("Server is running at Port 8001"));