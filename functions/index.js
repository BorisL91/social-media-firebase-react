const functions = require("firebase-functions")
const admin = require("firebase-admin")
const app = require("express")()

const serviceAccount = require("/Users/borislukanovic/Downloads/social-media-app-73241-firebase-adminsdk-sb74s-81f7f64cf3.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://social-media-app-73241.firebaseio.com"
})
// admin.initializeApp()

const firebaseConfig = {
  apiKey: "AIzaSyDW7nNmxHER_Rc2hNUM24M-4gnodx2u2F0",
  authDomain: "social-media-app-73241.firebaseapp.com",
  databaseURL: "https://social-media-app-73241.firebaseio.com",
  projectId: "social-media-app-73241",
  storageBucket: "social-media-app-73241.appspot.com",
  messagingSenderId: "395895497977",
  appId: "1:395895497977:web:a62fe657385d057b2cee28"
}

const firebase = require("firebase")
firebase.initializeApp(firebaseConfig)

const db = admin.firestore()

app.get("/screams", (req, res) => {
  db.collection("screams")
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

  db.collection("screams")
    .add(newScream)
    .then(doc => {
      return res.json({ message: `document ${doc.id} created successfully` })
    })

    .catch(err => {
      res.status(500).json({ error: "Something went wrong" })
      console.error(err)
    })
})

//Signup route
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  }

  //TODO: validate data
  let token, userId
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: "this handle is already taken" })
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    })
    .then(data => {
      userId = data.user.uid
      return data.user.getIdToken()
    })
    .then(idToken => {
      token = idToken
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      }
      return db.doc(`/users/${newUser.handle}`).set(userCredentials)
    })
    .then(() => {
      return res.status(201).json({ token })
    })
    .catch(err => {
      console.error(err)
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already in use" })
      } else {
        return res.status(500).json({ error: err.code })
      }
    })
})

exports.api = functions.https.onRequest(app)
