import React from "react"
import { shape, func } from "prop-types"
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
import FavoriteIcon from "@material-ui/icons/Favorite"
import FavoriteBorder from "@material-ui/icons/FavoriteBorder"

import { connect } from "react-redux"
import { likeScream, unlikeScream } from "../redux/actions/dataActions"

import MyButton from "../util/MyButton"

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

class Scream extends React.Component {
  likedScream = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        like => like.screamId === this.props.scream.screamId
      )
    )
      return true
    else return false
  }

  likeScream = () => {
    this.props.likeScream(this.props.scream.screamId)
  }

  unlikeScream = () => {
    this.props.unlikeScream(this.props.scream.screamId)
  }

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
      user: { authenticated },
      classes
    } = this.props

    const likeButton = !authenticated ? (
      <MyButton tip='like'>
        <Link to='/login'>
          <FavoriteBorder color='primary' />
        </Link>
      </MyButton>
    ) : this.likedScream() ? (
      <MyButton tip='Undo like' onClick={this.unlikeScream}>
        <FavoriteIcon color='primary' />
      </MyButton>
    ) : (
      <MyButton tip='Like' onClick={this.likeScream}>
        <FavoriteBorder color='primary' />
      </MyButton>
    )

    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title='Profile Image'
          className={classes.image}
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
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant='body1'>{body}</Typography>
          {likeButton}
          <span>{likeCount} likes</span>
          <MyButton tip='comments'>
            <ChatIcon color='primary' />
          </MyButton>
          <span>{commentCount} comments</span>
        </CardContent>
      </Card>
    )
  }
}

Scream.propTypes = {
  likeScream: func.isRequired,
  unlikeScream: func.isRequired,
  user: shape({}).isRequired,
  scream: shape({}).isRequired,
  classes: shape({}).isRequired
}

const mapStateToProps = state => ({
  user: state.user
})

const mapActionsToProps = {
  likeScream,
  unlikeScream
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Scream))
