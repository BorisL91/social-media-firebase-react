import React from "react"
import { shape, bool } from "prop-types"
import MyButton from "../../util/MyButton"
import DeleteScream from "./DeleteScream"
import Linkify from "react-linkify"
import ScreamDialog from "./ScreamDialog"
import LikeButton from "./LikeButton"

import { Link } from "react-router-dom"
import withStyles from "@material-ui/core/styles/withStyles"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
//material ui stuff
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import { Typography } from "@material-ui/core"
import ChatIcon from "@material-ui/icons/Chat"

import { connect } from "react-redux"

const styles = {
  card: {
    position: "relative",
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

class Scream extends React.Component {
  render() {
    dayjs.extend(relativeTime)
    const {
      scream: {
        body,
        createdAt,
        userImage,
        userHandle,
        screamId,
        likeCount,
        commentCount
      },
      user: {
        authenticated,
        credentials: { handle }
      },
      classes
    } = this.props

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteScream screamId={screamId} />
      ) : null

    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title='Profile Image'
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Linkify target='_blank'>
            <Typography
              variant='h5'
              component={Link}
              to={`/users/${userHandle}`}
              color='primary'
            >
              {userHandle}
            </Typography>
            {deleteButton}
            <Typography variant='body2' color='textSecondary'>
              {dayjs(createdAt).fromNow()}
            </Typography>
            <Typography variant='body1'>{body}</Typography>
            <LikeButton screamId={screamId} />
            <span>{likeCount} likes</span>
            <MyButton tip='comments'>
              <ChatIcon color='primary' />
            </MyButton>
            <span>{commentCount} comments</span>
          </Linkify>
          <ScreamDialog
            screamId={screamId}
            userHandle={userHandle}
            openDialog={this.props.openDialog}
          />
        </CardContent>
      </Card>
    )
  }
}

Scream.propTypes = {
  user: shape({}).isRequired,
  scream: shape({}).isRequired,
  classes: shape({}).isRequired,
  openDialog: bool
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps)(withStyles(styles)(Scream))
