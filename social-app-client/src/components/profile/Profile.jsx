import React, { Component } from "react"
import { shape, func } from "prop-types"
import { Link } from "react-router-dom"
import themeStyles from "../../util/theme"
import dayjs from "dayjs"
import EditDetails from "./EditDetails"
import ProfileSkeleton from "../../util/ProfileSkeleton"
//MUI stuff
import withStyles from "@material-ui/core/styles/withStyles"
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"
import MuiLink from "@material-ui/core/Link"
import Typography from "@material-ui/core/Typography"
//Icons
import LocationOn from "@material-ui/icons/LocationOn"
import LinkIcon from "@material-ui/icons/Link"
import CalendarToday from "@material-ui/icons/CalendarToday"
import EditIcon from "@material-ui/icons/Edit"
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn"
//Redux
import { connect } from "react-redux"
import { logoutUser, uploadImage } from "../../redux/actions/userActions"
import MyButton from "../../util/MyButton"

const styles = theme => themeStyles

export class Profile extends Component {
  handleImageChange = event => {
    const image = event.target.files[0]
    //send to server
    const formData = new FormData()
    formData.append("image", image, image.name)
    this.props.uploadImage(formData)
  }

  handleEditPicture = () => {
    const fileInput = document.getElementById("imageUpload")
    fileInput.click()
  }

  handleLogout = () => {
    this.props.logoutUser()
  }

  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, website, location },
        loading,
        authenticated
      }
    } = this.props

    let profileMarkup = !loading ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <div className={classes.profile}>
            <div className='image-wrapper'>
              <img src={imageUrl} alt='profile' className='profile-image' />
              <input
                type='file'
                id='imageUpload'
                hidden='hidden'
                onChange={this.handleImageChange}
              />
              <MyButton
                tip='Edit profile picture'
                onClick={this.handleEditPicture}
                btnClassName='button'
              >
                <EditIcon color='primary' />
              </MyButton>
            </div>
            <hr />
            <div className='profile-details'>
              <MuiLink
                component={Link}
                to={`/users/${handle}`}
                color='primary'
                variant='h5'
              >
                @{handle}
              </MuiLink>
              <hr />
              {bio && <Typography variant='body2'>{bio}</Typography>}
              <hr />
              {location && (
                <>
                  <LocationOn color='primary' /> <span>{location}</span>
                  <hr />
                </>
              )}
              {website && (
                <>
                  <LinkIcon color='primary' />
                  <a href={website} target='_blank' rel='noopener noreferrer'>
                    {" "}
                    {website}
                  </a>
                  <hr />
                </>
              )}
              <CalendarToday color='primary' />{" "}
              <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <EditDetails />
              <MyButton
                variant='outlined'
                tip='Logout"'
                onClick={this.handleLogout}
              >
                <KeyboardReturnIcon color='primary' />
              </MyButton>
            </div>
          </div>
        </Paper>
      ) : (
        <Paper className={classes.paper}>
          <Typography variant='body2' align='center'>
            {" "}
            No profile found, please login again
          </Typography>
          <div className={classes.buttons}>
            <Button
              variant='contained'
              color='primary'
              component={Link}
              to='/login'
            >
              Login
            </Button>
            <Button
              variant='contained'
              color='secondary'
              component={Link}
              to='/login'
            >
              Signup
            </Button>
          </div>
        </Paper>
      )
    ) : (
      <ProfileSkeleton />
    )

    return profileMarkup
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapActionsToProps = { logoutUser, uploadImage }

Profile.propTypes = {
  user: shape({}).isRequired,
  classes: shape({}).isRequired,
  logoutUser: func.isRequired,
  uploadImage: func.isRequired
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Profile))
