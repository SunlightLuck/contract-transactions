const express = require('express')
const cronJob = require('cron').CronJob;
const mongoose = require('mongoose');

const config = require('./config');

const app = express();

mongoose.connect(config.mongoURI).then(res => console.log('MongoDB Connected')).catch(err => console.log(err))
require('./models/Transaction');

const cron = new cronJob('0 */5 * * * *', () => {
  const Transaction = mongoose.model('transactions');

})

cron.start();

app.use('/', require('./controllers/TransactionCtrl'));

app.listen(8001, () => console.log("Server is running at Port 8001"));