const functions = require("firebase-functions")
const admin = require("firebase-admin")
const app = require("express")()
const firebase = require("firebase")

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
const FBAuth = (req, res, next) => {
  let idToken
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1]
  } else {
    console.error("No token found")
    return res.status(403).json({ error: "Unauthorized" })
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken
      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get()
    })
    .then(data => {
      req.user.handle = data.docs[0].data().handle
      return next()
    })
    .catch(err => {
      console.error("Error while verifying token", err)
      return res.status(403).json(err)
    })
}

//Post one scream
// eslint-disable-next-line consistent-return
app.post("/scream", FBAuth, (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" })
  }
  const newScream = {
    body: req.body.body,
    userHandle: req.user.handle,
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

//helper validation functions
const isEmail = email => {
  const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (email.match(regEx)) return true
  else return false
}
const isEmpty = string => {
  if (string.trim() === "") return true
  else return false
}

//Signup route
// eslint-disable-next-line consistent-return
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  }

  let errors = {}

  if (isEmpty(newUser.email)) {
    errors.email = "Must not be empty"
  } else if (!isEmail(newUser.email)) {
    errors.email = "Must be a valid email address"
  }

  if (isEmpty(newUser.password)) errors.password = "Must not be empty"
  if (newUser.password !== newUser.confirmPassword)
    errors.confirmPassword = "Passwords must match"
  if (isEmpty(newUser.handle)) errors.handle = "Must not be empty"

  if (Object.keys(errors).length > 0) return res.status(400).json(errors)

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

//Login route
// eslint-disable-next-line consistent-return
app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  }

  let errors = {}
  if (isEmpty(user.email)) errors.email = "Must not be empty"
  if (isEmpty(user.password)) errors.password = "Must not be empty"

  if (Object.keys(errors) > 0) return res.status(400).json(errors)

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken()
    })
    .then(token => {
      return res.json({ token })
    })
    .catch(err => {
      console.error(err)
      if (err.code === "auth/invalid-email") {
        return res
          .status(403)
          .json({ general: "Wrong credentials, please try again" })
      } else {
        return res.status(500).json({ error: err.code })
      }
    })
})

exports.api = functions.https.onRequest(app)
