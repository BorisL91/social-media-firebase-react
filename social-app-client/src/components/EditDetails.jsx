import React, { Component } from "react"
import { shape, func } from "prop-types"
import themeStyles from "../util/theme"
import MyButton from "../util/MyButton"
//MUI
import withStyles from "@material-ui/core/styles/withStyles"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
//icons
import EditIcon from "@material-ui/icons/Edit"
//redux
import { connect } from "react-redux"
import { editUserDetails } from "../redux/actions/userActions"

const styles = theme => themeStyles

class EditDetails extends Component {
  state = {
    bio: "",
    website: "",
    location: "",
    open: false
  }

  componentDidMount() {
    const { credentials } = this.props
    this.mapUserDetailsToState(credentials)
  }

  mapUserDetailsToState = credentials => {
    this.setState({
      bio: credentials.bio ? credentials.bio : "",
      website: credentials.website ? credentials.website : "",
      location: credentials.location ? credentials.location : ""
    })
  }

  handleOpen = () => {
    const { credentials } = this.props
    this.setState({ open: true })
    this.mapUserDetailsToState(credentials)
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = () => {
    const userDetails = {
      bio: this.state.bio,
      website: this.state.website,
      location: this.state.location
    }
    this.props.editUserDetails(userDetails)
    this.handleClose()
  }

  render() {
    const { classes } = this.props
    return (
      <>
        <MyButton
          tip='Edit details'
          onClick={this.handleOpen}
          variant='outlined'
          btnClassName={classes.button}
        >
          <EditIcon color='primary' />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth='sm'
          className={classes.dialog}
        >
          <DialogTitle>Edit your details</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name='bio'
                type='text'
                label='Bio'
                multiline
                placeholder='A short bio about yourself'
                className={classes.textField}
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
              ></TextField>
              <TextField
                name='website'
                type='text'
                label='Website'
                placeholder='Your personal/professional website'
                className={classes.textField}
                value={this.state.website}
                onChange={this.handleChange}
                fullWidth
              ></TextField>
              <TextField
                name='location'
                type='text'
                label='Location'
                placeholder='Place where you live'
                className={classes.textField}
                value={this.state.location}
                onChange={this.handleChange}
                fullWidth
              ></TextField>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color='primary'>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

EditDetails.propTypes = {
  editUserDetails: func.isRequired,
  classes: shape({}).isRequired
}

const mapStateToProps = state => ({
  credentials: state.user.credentials
})

export default connect(mapStateToProps, { editUserDetails })(
  withStyles(styles)(EditDetails)
)
