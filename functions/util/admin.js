const admin = require("firebase-admin")

const serviceAccount = require("/Users/borislukanovic/Downloads/social-media-app-73241-firebase-adminsdk-sb74s-81f7f64cf3.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://social-media-app-73241.firebaseio.com"
})
// admin.initializeApp()

const db = admin.firestore()

module.exports = { admin, db }
