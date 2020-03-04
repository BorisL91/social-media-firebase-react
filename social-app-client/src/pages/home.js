import React, { Component } from "react"
import Grid from "@material-ui/core/Grid"
import Scream from "../components/Scream"
import axios from "axios"

export class Home extends Component {
  state = {
    screams: null
  }

  componentDidMount() {
    axios
      .get("/screams")
      .then(res => {
        this.setState({
          screams: res.data
        })
      })
      .catch(err => console.error(err))
  }

  render() {
    let recentScreams = this.state.screams ? (
      this.state.screams.map(screamData => (
        <Scream scream={screamData} key={screamData.screamId} />
      ))
    ) : (
      <p>Loading...</p>
    )

    return (
      <Grid container spacing={9}>
        <Grid item sm={8} xs={12}>
          {recentScreams}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Profile...</p>
        </Grid>
      </Grid>
    )
  }
}

export default Home
