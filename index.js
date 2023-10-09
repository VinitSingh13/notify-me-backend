const express = require("express");
const mongoose = require("mongoose");
const { google } = require("googleapis");
const cors = require("cors");

require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUR_CLIENT_ID,
  process.env.YOUR_CLIENT_SECRET,
  process.env.YOUR_REDIRECT_URL
);

const searchKeywords = new mongoose.Schema({
  keyword: String,
  isChecked: {
    type: Boolean,
    default: true
  }
})

const Keywords = mongoose.model("SearchKeywords", searchKeywords);

const scopes = "https://mail.google.com/";

const url = oauth2Client.generateAuthUrl({
  access_type: "offline",

  scope: scopes,
});

app.get("/auth/login", (req, res) => {
  try {
    res.status(200).json({ url });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.put("/userPermission", async (req, res) => {

  const { code } = req.body;
  console.log("use permission")
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  res.status(201).json({message:"user logged in successfully"})
})

app.get("/checkMailAndNotify", async (req, res) => {

  setInterval(async () => {
    console.log("send mail")
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const searchKeys = await Keywords.find({ isChecked: true })



    const currDate = new Date();
    let day = currDate.getDate();
    let month = currDate.getMonth() + 1;
    let year = currDate.getFullYear();
    let hour = currDate.getHours();
    let min = currDate.getMinutes();


    let currentDate = `${year}/${month}/${day}`;
    const mailIdsList = await Promise.all(
      searchKeys.map((searchKey) => (
        gmail.users.messages.list({
          userId: "me",
          q: `from:${searchKey.keyword} OR in:inbox after:${currentDate}`
        })
      ))
    )


    let mailIds = [];

    const messageList = mailIdsList.map(({ data: { messages } }) => (
      messages
    ))


    messageList.forEach((msg) => {
      if (msg) {
        mailIds.push(msg[0].id)
      }
    })


    const msgInfo = await Promise.all(
      mailIds.map((id) => (
        gmail.users.messages.get({
          userId: "me",
          id: id,
          format: "full"
        })
      ))
    )

    const sendMsg = Promise.all(
      msgInfo.map(({ data: { payload: { headers } } }) => {
        const date = headers.find(h => h.name === "Date")
        const from = headers.find(h => h.name === "From")
        const localeTime = new Date(date.value)
        const msgTimeString = localeTime.toLocaleTimeString("en-IN", { hour12: false }).split(":")
        const msgTimeHr = Number(msgTimeString[0])
        const msgTimeMin = Number(msgTimeString[1])


        const endTime = hour * 60 + min;
        const strtTime = endTime - 2;
        const msgTime = msgTimeHr * 60 + msgTimeMin


        if (msgTime >= strtTime && msgTime <= endTime) {
          console.log("op")
          client.messages.create({
            from: "whatsapp:+14155238886",
            body: `Msg from ${from.value}`,
            to: "whatsapp:+917904596118",
          })
        }
      })
    )
  }, 120000)
  res.status(201).json({ message: "message sent succesfully" })
});

app.get("/getallkeywords", async (req, res) => {
  try {
    const searchKeys = await Keywords.find({})
    res.status(201).json(searchKeys)
  }
  catch (err) {
    res.status(404).json({ error: err.message })
  }
})

app.post("/addkeyword", async (req, res) => {
  try {
    const searchKeys = await Keywords.create(req.body)
    res.status(201).json(searchKeys)
  }
  catch (err) {
    res.status(404).json({ error: err.message })
  }
})

app.put("/updateischecked", async (req, res) => {
  const filter = { keyword: req.body.keyword };
  const update = { isChecked: req.body.checkStatus }
  const doc = await Keywords.updateMany(filter, update, {
    new: true
  });
  res.status(201).json(doc)
})

const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}...`);
    });
  })
  .catch((error) => console.log(`${error} did not connect`));
