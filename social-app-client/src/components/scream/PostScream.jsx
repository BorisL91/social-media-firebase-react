import React, { Component } from "react"
import { shape, func } from "prop-types"
import MyButton from "../../util/MyButton"

//MUI
import withStyles from "@material-ui/core/styles/withStyles"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import CircularProgress from "@material-ui/core/CircularProgress"
//icons
import AddIcon from "@material-ui/icons/Add"
import CloseIcon from "@material-ui/icons/Close"
//redux
import { connect } from "react-redux"
import { postScream, clearErrors } from "../../redux/actions/dataActions"

const styles = {
  submitButton: {
    position: "relative",
    marginTop: "1rem",
    marginBottom: "1rem",
    float: "right"
  },
  progressSpinner: {
    position: "absolute"
  },
  closeButton: {
    position: "absolute",
    left: "90%",
    top: "5%"
  }
}

class PostScream extends Component {
  state = {
    open: false,
    body: "",
    errors: {}
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors
      })
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: "", open: false, errors: {} })
    }
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.props.clearErrors()
    this.setState({ open: false, errors: {} })
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.postScream({ body: this.state.body })
  }

  render() {
    const { errors } = this.state
    const {
      classes,
      UI: { loading }
    } = this.props

    return (
      <>
        <MyButton tip='Post a scream!' onClick={this.handleOpen}>
          <AddIcon />
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
          <DialogTitle> Post something!</DialogTitle>

          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <TextField
                name='body'
                type='text'
                label='Scream!'
                multiline
                placeholder='Post something for your friends!'
                error={errors.body ? true : false}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
              <Button
                type='submit'
                variant='contained'
                color='primary'
                className={classes.submitButton}
                disabled={loading}
              >
                Submit
                {loading && (
                  <CircularProgress className={classes.progressSpinner} />
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </>
    )
  }
}

PostScream.propTypes = {
  postScrean: func,
  clearErrors: func.isRequired,
  UI: shape({}).isRequired
}

const mapStateToProps = state => ({
  UI: state.UI
})

export default connect(mapStateToProps, { postScream, clearErrors })(
  withStyles(styles)(PostScream)
)
