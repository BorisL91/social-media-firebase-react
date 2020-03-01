import React from "react"
import { Link } from "react-router-dom"
import withStyles from "@material-ui/core/styles/withStyles"
//material ui stuff
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import { Typography } from "@material-ui/core"

const styles = {
  card: {
    display: "flex",
    marginBottom: 20
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 25,
    objectFit: "cover"
  }
}

const Scream = ({
  scream: {
    body,
    createdAt,
    userImage,
    userHandle,
    screamId,
    likeCount,
    commentCount
  },
  classes
}) => {
  return (
    <Card className={classes.card}>
      <CardMedia
        image={userImage}
        title='Profile Image'
        className={classes.image}
        component={() => null}
      />
      <CardContent className={classes.content}>
        <Typography
          variant='h5'
          component={Link}
          to={`/users/${userHandle}`}
          color='primary'
        >
          {userHandle}
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          {createdAt}
        </Typography>
        <Typography variant='body1'>{body}</Typography>
      </CardContent>
    </Card>
  )
}
export default withStyles(styles)(Scream)
