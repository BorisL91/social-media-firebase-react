const functions = require("firebase-functions")
const admin = require("firebase-admin")

const serviceAccount = require("/Users/borislukanovic/Downloads/social-media-app-73241-firebase-adminsdk-sb74s-81f7f64cf3.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://social-media-app-73241.firebaseio.com"
})
// admin.initializeApp()

const express = require("express")
const app = express()

app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let screams = []
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        })
      })
      return res.json(screams)
    })
    .catch(err => console.error(err))
})

// eslint-disable-next-line consistent-return
app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  }

  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then(doc => {
      return res.json({ message: `document ${doc.id} created successfully` })
    })

    .catch(err => {
      res.status(500).json({ error: "Something went wrong" })
      console.error(err)
    })
})

exports.api = functions.https.onRequest(app)
