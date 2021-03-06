const express = require('express');
// const MTA_API_KEY = require('./secrets');
const utils = require('./utils');
const striptags = require('striptags');
const app = express();
const PORT = process.env.PORT || 3000;
const Mta = require('mta-gtfs');
const mta = new Mta({
  key: process.env.MTA_API_KEY, // only needed for mta.schedule() method
  feed_id: 1                  // optional, default = 1
});

const request = require('node-fetch');

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//gets trains and arrival times between 0-30 min for a specific station and direction
app.get('/api/station/:stationId/:direction/:feedId', async (req, res, next) => {
  try {
    const station = req.params.stationId;
    const direction = req.params.direction;
    const feed = req.params.feedId
    const stationResults = await mta.schedule(station, feed);
    const lastUpdated = stationResults["updatedOn"];
    const incomingTrainData = stationResults["schedule"][station][direction].filter(train => train["arrivalTime"] >= lastUpdated && (train["arrivalTime"] - utils.currentEpochTime()) <= 1800);
    const incomingTrains = incomingTrainData.map(incomingTrain => {
      return ({
        train: incomingTrain["routeId"],
        delay: incomingTrain["delay"],
        time: utils.untilArrival(incomingTrain["arrivalTime"]),
      })
    })
    res.send(incomingTrains)
  } catch (error) {
    next(error)
  }
})

//gets all status updates on all lines (only includes problems)
app.get('/api/notices', async (req, res) => {
  try {
    let responseFromRequest = await request('http://web.mta.info/status/serviceStatus.txt');
    // console.log('response --> ', responseFromRequest);
    let text = await responseFromRequest.text();
    console.log(text.slice(0, 1000));
    const statusResults = await mta.status('subway');
    const status = statusResults.filter(statement => statement["status"] !== "GOOD SERVICE").map(notice => {
      return ({
        lines: notice["name"],
        type: notice["status"],
        info: utils.cleanText(striptags(notice["text"]))
      })
    });
    res.send(status)
  } catch (error) {
    console.log(error)
  }
})

app.use(function (err, req, res, next) {
  const errorContent = [
    {
      "train": "No current MTA data",
      "delay": null,
      "time": ""
    },
  ]
  res.send(errorContent)
})

const server = app.listen(PORT, () => {
  const { address, port } = server.address();
  console.log(`Listening at port: ${PORT}`);
});
