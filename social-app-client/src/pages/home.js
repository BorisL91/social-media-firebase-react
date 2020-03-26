import React, { Component } from "react"
import { func, shape } from "prop-types"
import Grid from "@material-ui/core/Grid"
import Scream from "../components/scream/Scream"
import Profile from "../components/profile/Profile"
import ScreamSkeleton from "../util/ScreamSkeleton"

import { connect } from "react-redux"
import { getScreams } from "../redux/actions/dataActions"

export class Home extends Component {
  componentDidMount() {
    this.props.getScreams()
  }

  render() {
    const { screams, loading } = this.props.data

    let recentScreams = !loading ? (
      screams.map(screamData => (
        <Scream scream={screamData} key={screamData.screamId} />
      ))
    ) : (
      <ScreamSkeleton />
    )

    return (
      <Grid container spacing={9}>
        <Grid item sm={8} xs={12}>
          {recentScreams}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    )
  }
}

Home.propTypes = {
  getScreams: func.isRequired,
  data: shape({}).isRequired
}

const mapStateToProps = state => ({
  data: state.data
})

export default connect(mapStateToProps, { getScreams })(Home)
