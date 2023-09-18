// import { cors } from 'cors';

const express = require('express');
const cors = require('cors');
const app = express();
const ulid = require('ulid');

const port = 3000;
const redis = require('redis');
// Adding Upstash REDIS Database details

const { REDIS_URL } = process.env;
const client = redis.createClient({ url: REDIS_URL });

//CORS
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  app.use(cors());
}

client.on('Error', (error) => {
  console.error(error);
});

//console.log(REDIS_URL);

//using limit in order to avoid users putting extremely large payloads for malicious intents
app.use(express.json({ limit: '10kb' }));

app.post('/lotteries', async (req, res) => {
  const { type, name, prize } = req.body;

  if (type !== 'simple') {
    res.status(422).json({ error: 'Invalid lottery type' });
    return;
  }
  if (typeof name !== 'string' || name.length < 3) {
    res.status(422).json({ error: 'Invalid lottery name' });
    return;
  }

  if (typeof prize !== 'string' || prize.length < 3) {
    res.status(422).json({ error: 'Invalid lottery prize' });
    return;
  }
  const id = ulid.ulid();
  const newLottery = {
    id,
    name,
    prize,
    type,
    status: 'running',
  };

  try {
    //await client.connect();

    await client
      .multi()
      .hSet(`lottery.${id}`, newLottery)
      .lPush('lotteries', id)
      .exec();

    //await client.disconnect();
    res.json(newLottery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create lottery' });
  }
});

app.get('/lottery/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const lottery = await client.hGetAll(`lottery.${id}`);

    if (!Object.keys(lottery).length) {
      res
        .status(404)
        .json({ error: 'A lottery with givern id does not exits' });
      return;
    }
    res.json(lottery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to read the lottery data' });
  }
});

app.get('/lotteries', async (req, res) => {
  try {
    if (!client.isOpen) {
      client.connect;
    }
    //await client.connect();
    const lotteryIds = await client.lRange('lotteries', 0, -1);

    const transaction = client.multi();
    lotteryIds.forEach((id) => transaction.hGetAll(`lottery.${id}`));
    const lotteries = await transaction.exec();

    //await client.disconnect();
    res.json(lotteries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to read the lotteries data' });
  }
});

app.post('/register', async (req, res) => {
  //console.log(req.body)
  const { lotteryId, name } = req.body;           //unable to retrieve res.body

  if (!lotteryId) {
    res
      .status(400)
      .json({ error: "Participant's Lottery ID must be provided" });
    return;
  }
  if (!name) {
    res.status(400).json({ error: "Participant's Name must be provided" });
    return;
  }
  try {
    const lotteryStatus = await client.hGet(`lottery.${lotteryId}`, 'status');
    if (!lotteryStatus) {
      throw new Error("A lottery with a given ID doesn't exit");
    }
    if (lotteryStatus == 'finished') {
      throw new Error('The lottery with the given ID is finished');
    }
    await client.lPush(`lottery.${lotteryId}.participants`, name);

    res.json({ status: 'Success' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `Failed to register for the lottery: ${error.message}` });
  }
});

app.listen(port, async() => {
  await client.connect();
  console.log(`Server listening on port ${port}`);
});
if (process.env.NODE_ENV === 'production') {
  // Serving the bundled frontend code together with the backend on the same port in production.
  app.use(express.static('bigcorp-lotteries-client/dist'));
}
