/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import {Dialog, DialogTitle, DialogActions, DialogContent, 
  DialogContentText, Button, Drawer, Grid, Typography, 
  CircularProgress, FormControlLabel, Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuList, MenuItem, Paper, TextField
} from '@mui/material';
import {ArrowBack,} from '@mui/icons-material'
import { withRouter } from '../../withRouter';
import {config, updateConfig} from '../../config';
import { user_logged } from '../../objects/user_login';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,

      filledSquads: [],
      loadingSquads: true,

      viewChat: null, 

      activeMenu: 0
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidUpdate() {
  }

  PanelAlertsAndSounds = (
    <React.Fragment>
      <Grid item xs={12}>
        <FormControlLabel style={{userSelect: 'none'}} control={<Checkbox color='secondary' checked={config.play_sounds.new_message} onChange={(e) => updateConfig.play_sounds.new_message(e.target.checked, () => this.forceUpdate())}/>} label="New Message" />
      </Grid>
    </React.Fragment>
  )

  PanelAccountManagement = (
    <React.Fragment>
      <Grid item xs={'auto'}>
        <TextField disabled  color='tertiary' label='Email' value={user_logged?.email}/>
      </Grid>
      <Grid item xs={'auto'}>
        <TextField disabled color='tertiary' label='IGN' value={user_logged?.email}/>
      </Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={'auto'}>
        {user_logged?.password ? <></> : <TextField color='tertiary' label='Set account password'/>}
      </Grid>
      <Grid item xs={'auto'}>
        {user_logged?.password ? <></> : <TextField color='tertiary' label='Confirm password'/>}
      </Grid>
      <Grid item xs={12}>
        {!user_logged?.discord_id ? <></> : <Button color='tertiary' variant='outlined'>Link Discord Account</Button>}
      </Grid>
    </React.Fragment>
  )
  
  PanelsList = [{
    title: 'Account Management',
    element: this.PanelAccountManagement
  },{
    title: 'Alerts & Sounds',
    element: this.PanelAlertsAndSounds
  },]

  render() {
    return (
      <Grid container padding="10px" rowSpacing={"20px"} columnSpacing={"20px"}> 
        <Grid item xs={12} justifyContent="center" display={"flex"}>
          <Typography variant='h3'>Settings</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container sx={{backgroundColor: 'primary.dark'}} minHeight={'50vh'}>
            <Grid item xs={'auto'} md={'auto'} lg={'auto'} xl={'auto'}>
              <Paper sx={{ width: 320, maxWidth: '100%', backgroundColor: 'primary.light', height: '100%' }}>
                <MenuList>
                  {this.PanelsList.map((panel, index) => (
                    <MenuItem key={panel.title} onClick={() => this.setState({activeMenu: index})}>
                      <Typography variant="h6" color="text.secondary">
                        {panel.title}
                      </Typography>
                    </MenuItem>
                  ))}
                </MenuList>
              </Paper>
            </Grid>
            <Grid item xs={'auto'} md={'auto'} lg={'auto'} xl={'auto'} style={{backgroundColor: 'primary.light', padding: '40px'}}>
              <Grid container rowSpacing={'10px'} columnSpacing={'10px'}>
                <Grid item xs={12}>
                  <Typography variant="h4" color="text.secondary">
                    {this.PanelsList[this.state.activeMenu]?.title}
                  </Typography>
                </Grid>
                {this.PanelsList[this.state.activeMenu]?.element}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}


{/* <Typography variant='h4'></Typography>
 */}

export default withRouter(Settings);