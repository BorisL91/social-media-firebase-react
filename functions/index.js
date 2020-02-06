const functions = require("firebase-functions")
const admin = require("firebase-admin")

const serviceAccount = require("/Users/borislukanovic/Downloads/social-media-app-73241-firebase-adminsdk-sb74s-81f7f64cf3.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://social-media-app-73241.firebaseio.com"
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!")
})

exports.getScreams = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection("screams")
    .get()
    .then(data => {
      let screams = []
      data.forEach(doc => {
        screams.push(doc.data())
      })
      return res.json(screams)
    })
    .catch(err => console.error(err))
})

exports.createScream = functions.https.onRequest((req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Method not allowed" })
  }

  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
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
