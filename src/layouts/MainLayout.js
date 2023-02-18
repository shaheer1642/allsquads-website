/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Box, AppBar, Toolbar, IconButton, Typography, Button, CircularProgress, Fab} from '@mui/material';
import {Chat} from '@mui/icons-material'
import {Menu, Settings} from '@mui/icons-material';
import {socket,socketHasConnected} from '../websocket/socket'
import LoginScreen from '../views/Authorization/LoginScreen';
import { user_logged, authorizationCompleted } from '../objects/user_login';
import Chats from '../views/chats/Chats';
import eventHandler from '../event_handler/eventHandler';
import * as Colors from '@mui/material/colors';
import { withRouter } from '../withRouter';
import CookieConsent from '../views/CookieConsent/CookieConsent';

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
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Warframe Squads
            </Typography>
            {this.state.loginLoading ? <CircularProgress color='secondary'/> :
            user_logged ? 
            <Typography color="inherit" variant="h6">
              Logged in as {user_logged.ingame_name}
            </Typography>
            :
            <Button color="inherit" onClick={() => this.setState({loginOpen: true})}>Login</Button>
            }
            <Button color="inherit" onClick={() => this.props.navigate('settings')}><Settings /></Button>
          </Toolbar>
        </AppBar>
        < Outlet />
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
      </Box>
    );
  }
}

export default withRouter(MainLayout);