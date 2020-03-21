import React, { Component } from "react"
import { shape, func, string } from "prop-types"
import withStyles from "@material-ui/core/styles/withStyles"
import MyButton from "../util/MyButton"
import dayjs from "dayjs"
import { Link } from "react-router-dom"
//MUI Stuff
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import CircularProgress from "@material-ui/core/CircularProgress"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
//icons
import CloseIcon from "@material-ui/icons/Close"
import UnfoldMore from "@material-ui/icons/UnfoldMore"
//redux
import { connect } from "react-redux"
import { getScream } from "../redux/actions/dataActions"

const styles = {
  invisibleSeparator: {
    border: "none",
    margin: 4
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: "50%",
    objectFit: "cover",
    maxWidth: "100%"
  },
  dialogContent: {
    padding: 20
  },
  closeButton: {
    position: "absolute",
    left: "90%"
  }
}

class ScreamDialog extends Component {
  state = {
    open: false
  }

  handleOpen = () => {
    this.setState({ open: true })
    this.props.getScream(this.props.screamId)
  }

  handleClose = () => {
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
        userImage,
        userHandle
      },
      UI: { loading }
    } = this.props

    const dialogMarkup = loading ? (
      <CircularProgress size={70} />
    ) : (
      <Grid container spacing={16}>
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
        </Grid>
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
            {dialogMarkup}
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
  scream: shape.isRequired,
  UI: shape.isRequired
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
