import React, { Component } from "react"
import { shape, func, string } from "prop-types"
import withStyles from "@material-ui/core/styles/withStyles"
import MyButton from "../../util/MyButton"
import dayjs from "dayjs"
import Linkify from "react-linkify"
import { Link } from "react-router-dom"
import LikeButton from "./LikeButton"
import Comments from "./Comments"
import CommentForm from "./CommentForm"
import themeStyles from "../../util/theme"
//MUI Stuff
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import CircularProgress from "@material-ui/core/CircularProgress"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
//icons
import CloseIcon from "@material-ui/icons/Close"
import UnfoldMore from "@material-ui/icons/UnfoldMore"
import ChatIcon from "@material-ui/icons/Chat"
//redux
import { connect } from "react-redux"
import { getScream } from "../../redux/actions/dataActions"

const styles = theme => themeStyles

class ScreamDialog extends Component {
  state = {
    open: false,
    oldPath: "",
    newPath: ""
  }

  componentDidMount() {
    if (this.props.openDialog) {
      this.handleOpen()
    }
  }

  handleOpen = () => {
    let oldPath = window.location.pathname

    const { userHandle, screamId } = this.props
    const newPath = `/users/${userHandle}/scream/${screamId}`

    if (oldPath === newPath) oldPath = `/users/${userHandle}`
    window.history.pushState(null, null, newPath)

    this.setState({ open: true, oldPath, newPath })
    this.props.getScream(this.props.screamId)
  }

  handleClose = () => {
    window.history.pushState(null, null, this.state.oldPath)
    this.setState({ open: false })
  }

  render() {
    const {
      classes,
      scream: {
        screamId,
        body,
        createdAt,
        likeCount,
        commentCount,
        comments,
        userImage,
        userHandle
      },
      UI: { loading }
    } = this.props

    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={70} thickness={2} />
      </div>
    ) : (
      <Grid container spacing={2}>
        <Grid item sm={5}>
          <img src={userImage} alt='Profile' className={classes.profileImage} />
        </Grid>
        <Grid item sm={7}>
          <Typography
            component={Link}
            color='primary'
            variant='h5'
            to={`users/${userHandle}`}
          >
            @{userHandle}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant='body2' color='textSecondary'>
            {dayjs(createdAt).format("h:mm a, MMM DD YYYY")}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant='body1'>{body}</Typography>
          <LikeButton screamId={screamId} />
          <span>{likeCount} likes</span>
          <MyButton tip='comments'>
            <ChatIcon color='primary' />
          </MyButton>
          <span>{commentCount} comments</span>
        </Grid>
        <CommentForm screamId={screamId} />
        <Comments comments={comments} />
      </Grid>
    )

    return (
      <>
        <MyButton
          onClick={this.handleOpen}
          tip='Expand Post'
          tipClassName={classes.expandButton}
        >
          <UnfoldMore color='primary' />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth='sm'
        >
          <MyButton
            tip='Close'
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogContent className={classes.dialogContent}>
            <Linkify> {dialogMarkup}</Linkify>
          </DialogContent>
        </Dialog>
      </>
    )
  }
}

ScreamDialog.propTypes = {
  getScream: func.isRequired,
  screamId: string.isRequired,
  userHandle: string.isRequired,
  scream: shape({}).isRequired,
  UI: shape({}).isRequired
}

const mapStateToProps = state => ({
  scream: state.data.scream,
  UI: state.UI
})

const mapActionsToProps = {
  getScream
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(ScreamDialog))
