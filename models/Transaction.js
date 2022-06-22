const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  contract: {
    type: String
  },
  transactions: [
    {
      blockNumber: {
        type: String
      },
      timeStamp: {
        type: String
      },
      hash: {
        type: String
      },
      nonce: {
        type: String
      },
      blockHash: {
        type: String
      },
      transactionIndex: {
        type: String
      },
      from: {
        type: String
      },
      to: {
        type: String
      },
      value: {
        type: String
      },
      gas: {
        type: String
      },
      gasPrice: {
        type: String
      },
      isError: {
        type: String
      },
      txreceiptStatus: {
        type: String
      },
      input: {
        type: String
      },
      cumulativeGasUsed: {
        type: String
      },
      gasUsed: {
        type: String
      },
      confirmations: {
        type: String
      }
    }
  ]
})

module.exports = mongoose.model('transactions', TransactionSchema);