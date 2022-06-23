const express = require('express');
const axios = require('axios');
const router = express.Router();
const mongoose = require('mongoose');

const Transaction = mongoose.model('transactions');
const chains = ["etherscan.io", "bscscan.com", "polygonscan.com"]

router.get('/contract-save', (req, res) => {
  axios.get(`http://api.${chains[req.query.chain]}/api?module=account&action=txlist&address=${req.query.contract}&startblock=0&endblock=99999999&sort=asc`).then(data => {
    if(!data.data.result || data.data.result.length === 0) {
      return res.json({error: 'Contract doesn\'t exist'})
    }
    const newTrans = new Transaction({
      contract: req.query.contract,
      chain: chains[req.query.chain],
      transactions: data.data.result.map(item => (
        {
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
        }
      ))
    })
    newTrans.save().then(() => res.json({success: 'Success'})).catch(err => console.log({error: err}));
  }).catch(err => console.log(err))
})

router.get('/contract-load', (req, res) => {
  Transaction.findOne({contract: req.query.contract, chain: chains[req.query.chain]}).then(data => {
    if(!data || data.length === 0) {
      return res.json({error: 'Contract doesn\'t exist'})
    }
    res.json({transaction: data.transactions});
  }).catch(err => console.log(err))
})

module.exports = router;