const axios = require('axios');
const hostname = '0.0.0.0';
const express = require('express')
const cheerio = require('cheerio');
const cors = require('cors')
const app = express()
const port = process.env.PORT || "8080"
const boj = 'https://www.acmicpc.net'

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://davinci2003:${process.env.MONGODB}@cluster0.x5mhjao.mongodb.net/?retryWrites=true&w=majority`;
console.log(process.env.MONGODB[0])
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}

app.use(cors(corsOptions));

app.get('/submit/:week/:handle', async (req, res, next) => {
  console.log("gotem")
  res.data = []
  const handle = req.params['handle']
  console.log(handle)
  var nextPage = '/status?user_id=' + handle
  console.log(Math.floor(Date.now()/1000))
  const week = req.params['week']
  console.log(week)
  const s = 1705244400 + (week - 1) * 604800
  const e = s + 604800

  const thisWeek = Math.floor((Math.floor(Date.now()/1000) - 1705244400) / 604800) + 1
  
  if(thisWeek > week) {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      const col =  client.db("Data").collection("Submit")
      const query = { week: week, handle: handle };
      const result = await col.findOne(query);
      if(result) {
        res.data = result['data']
        console.log("Using Exist Data")
        next();
      } else {
        while(true) {
          const data = await axios.get(boj + nextPage, {headers})
          const $ = cheerio.load(data.data);
          const d = $('#status-table > tbody')[0].children
          const submitPage = d.map((ele) => {
            try {
              const submitID = ele.children[0].children[0].data
              const problemID = ele.children[2].children[0].children[0].data
              const submitResult = ele.children[3].children[0].attribs['data-color']
              const submitTime = ele.children[8].children[0].attribs['data-timestamp']
              return {'submitID': submitID, 'problemID': problemID, 'submitResult': submitResult, 'submitTime': submitTime}
            } catch {
              return {'submitID': "", 'problemID': "", 'submitResult': "", 'submitTime': 0}
            }
          })
          
          res.data = [...res.data, ...submitPage]
          if(submitPage.slice(-1)[0]['submitTime'] < s) break;
          nextPage = $('#next_page')['0'].attribs.href
        }
        res.data = res.data.filter((ele) => ele.submitTime >= s && ele.submitTime <= e)

        const uploadData = {
          week: week,
          handle: handle,
          data: res.data
        }
        await col.insertOne(uploadData)
        console.log("Successfully Updated")

        next()
      }
    } catch (e) {
      console.log(e)
      next()
    }
  } else {
    while(true) {
      const data = await axios.get(boj + nextPage, {headers})
      const $ = cheerio.load(data.data);
      const d = $('#status-table > tbody')[0].children
      const submitPage = d.map((ele) => {
        try {
          const submitID = ele.children[0].children[0].data
          const problemID = ele.children[2].children[0].children[0].data
          const submitResult = ele.children[3].children[0].attribs['data-color']
          const submitTime = ele.children[8].children[0].attribs['data-timestamp']
          return {'submitID': submitID, 'problemID': problemID, 'submitResult': submitResult, 'submitTime': submitTime}
        } catch {
          return {'submitID': "", 'problemID': "", 'submitResult': "", 'submitTime': 0}
        }
      })
      
      res.data = [...res.data, ...submitPage]
      if(submitPage.slice(-1)[0]['submitTime'] < s) break;
      nextPage = $('#next_page')['0'].attribs.href
    }
    res.data = res.data.filter((ele) => ele.submitTime >= s && ele.submitTime <= e)
    // console.log(res.data)
    next()
  }
}, (req, res) => {
  res.json(res.data)
})

app.get('/problem/:week', async(req, res, next) => {
  const week = req.params['week']
  const col =  client.db("Data").collection("Problem")
  const query = { week: week };
  const result = await col.findOne(query);
  console.log(result)
  if(result) {
    res.data = result['data']
  } else {
    res.data = []
  }
  next()
}, (req, res) => {
  res.json(res.data)
})

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});