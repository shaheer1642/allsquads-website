/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Button, CircularProgress, Fab, Grid} from '@mui/material';
import {Chat} from '@mui/icons-material'
import {Menu, Settings} from '@mui/icons-material';
import {socket,socketHasConnected} from '../websocket/socket'
import LoginScreen from '../views/Authorization/LoginScreen';
import { user_logged, authorizationCompleted } from '../objects/user_login';
import Chats from '../views/Chats/Chats';
import eventHandler from '../event_handler/eventHandler';
import * as Colors from '@mui/material/colors';
import { withRouter } from '../withRouter';
import CookieConsent from '../views/CookieConsent/CookieConsent';
import MainFooter from './MainFooter';

class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginOpen: false,
      loginLoading: true
    };
  }

  componentDidMount() {
    console.log('[MainLayout] mounted')
    authorizationCompleted().then(() => this.setState({loginLoading: false})).catch(console.error)
  }

  componentWillUnmount() {
    console.log('[MainLayout] unmounted')
  }

  render() {
    return (
      <Grid container>
        <Grid item xs={12}>
          <AppBar position="static">
            <Toolbar>
                <Typography 
                  variant="h6"
                  noWrap
                  component="a"
                  href="/"
                  sx={{
                    flexGrow: 1,
                    mr: 2,
                    display: { xs: 'flex' },
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  Warframe Squads
                </Typography>
              {this.state.loginLoading ? <CircularProgress color='primary'/> :
              user_logged ? 
                <Typography 
                  variant="h6"
                  noWrap
                  component="a"
                  href={`/profile/${user_logged.ingame_name}`}
                  sx={{
                    mr: 2,
                    display: { xs: 'flex' },
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  Logged in as {user_logged.ingame_name}
                </Typography>
              :
              <Button color="inherit" onClick={() => this.setState({loginOpen: true})}>Login</Button>
              }
              <Button color="inherit" onClick={() => this.props.navigate('settings')}><Settings /></Button>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={12} minHeight='80vh'>
          < Outlet />
        </Grid>
        <Grid item xs={12}>
          <MainFooter />
        </Grid>
        < LoginScreen onClose={() => this.setState({loginOpen: false})} open={this.state.loginOpen}/>
        < Chats />
        <Fab style={{position: 'fixed', right: '20px', bottom: '20px', color: 'white',backgroundColor: Colors.orange[900]}} 
          onClick={() => {
            if (!user_logged) return eventHandler.emit('requestLogin', {})
            eventHandler.emit('openChat', {})
          }}>
          <Chat />
        </Fab>
        {/* <div style={{marginLeft: '10px', alignSelf: 'end'}}>
          Sound Effects from <a href="https://pixabay.com/">Pixabay</a>
        </div> */}
        <CookieConsent />
      </Grid>
    );
  }
}

export default withRouter(MainLayout);