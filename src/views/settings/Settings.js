/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button, Drawer, Grid, Typography, CircularProgress, FormControlLabel, Checkbox} from '@mui/material';
import {ArrowBack} from '@mui/icons-material'
import { withRouter } from '../../withRouter';
import {config, updateConfig} from '../../config';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,

      filledSquads: [],
      loadingSquads: true,

      viewChat: null
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidUpdate() {
  }

  render() {
    return (
      <Grid container margin="10px" padding="10px" rowSpacing={"20px"} columnSpacing={"20px"}> 
        <Grid item xs={12} justifyContent="center" display={"flex"}>
          <Typography variant='h3'>Settings</Typography>
        </Grid>
        <Grid item xs="auto">
          <Typography variant='h4'>Alerts & Sounds</Typography>
          <FormControlLabel style={{userSelect: 'none'}} control={<Checkbox color='secondary' checked={config.play_sounds.new_message} onChange={(e) => updateConfig.play_sounds.new_message(e.target.checked, () => this.forceUpdate())}/>} label="New Message" />
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(Settings);