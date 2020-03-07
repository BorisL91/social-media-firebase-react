import React, { Component } from "react"
import { shape } from "prop-types"
import { Link } from "react-router-dom"
import themeStyles from "../util/theme"
import dayjs from "dayjs"
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
//Redux
import { connect } from "react-redux"

const styles = theme => themeStyles

export class Profile extends Component {
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
      <p>loading...</p>
    )

    return profileMarkup
  }
}

const mapStateToProps = state => ({
  user: state.user
})

Profile.propTypes = {
  user: shape({}).isRequired,
  classes: shape({}).isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(Profile))
