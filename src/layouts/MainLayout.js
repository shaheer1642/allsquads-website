/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React, { useEffect } from 'react';
import { Link, Outlet } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Button, CircularProgress, Fab, Grid} from '@mui/material';
import {Chat} from '@mui/icons-material'
import {Menu, Settings} from '@mui/icons-material';
import {socket,socketHasConnected} from '../websocket/socket'
import LoginScreen from '../views/Authorization/LoginScreen';
// import { this.props.user, authorizationCompleted } from '../objects/user_login';
import Chats from '../views/Chats/Chats';
import eventHandler from '../event_handler/eventHandler';
import * as Colors from '@mui/material/colors';
import { withHooksHOC } from '../withHooksHOC';
import CookieConsent from '../views/CookieConsent/CookieConsent';
import MainFooter from './MainFooter';
import Verification from '../views/Verification/Verification';
import { useAuth } from '../hooks/useAuth';

class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    console.log('[MainLayout] mounted')

    this.props.login()

    eventHandler.addListener('user/logout', this.handleLogout)

    socket.addEventListener('allsquads/users/update', this.updateUserContext)
  }

  componentWillUnmount() {
    console.log('[MainLayout] unmounted')
    eventHandler.removeListener('user/logout', this.handleLogout)
    socket.removeEventListener('allsquads/users/update', this.updateUserContext)
  }

  updateUserContext = (data) => {
    console.log('updateUserContext called',this.props.user?.ingame_name,data.ingame_name)
    if (this.props.user?.user_id == data.user_id) {
        const updatedIGN = this.props.user?.ingame_name != data.ingame_name ? true : false
        this.props.login(() => {
          if (updatedIGN) eventHandler.emit('user/updatedIGN')
        })
    }
  }

  handleLogout = () => {
    this.props.navigate('/')
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
              {this.props.user ? 
                <Typography 
                  variant="h6"
                  noWrap
                  component="a"
                  href={`/profile/${this.props.user.ingame_name}`}
                  sx={{
                    mr: 2,
                    display: { xs: 'flex' },
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  Logged in as {this.props.user.ingame_name}
                </Typography>
              :
              <Button color="inherit" onClick={() => eventHandler.emit('requestLogin')}>Login</Button>
              }
              {this.props.user? <Button color="inherit" onClick={() => this.props.navigate('settings')}><Settings /></Button> : <></>}
              
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={12} minHeight='80vh'>
          < Outlet />
        </Grid>
        <Grid item xs={12}>
          <MainFooter />
        </Grid>
        < LoginScreen />
        < Chats />
        <Fab style={{position: 'fixed', right: '20px', bottom: '20px', color: 'white',backgroundColor: Colors.orange[900]}} 
          onClick={() => {
            if (!this.props.user) return eventHandler.emit('requestLogin', {})
            if (!this.props.user.ingame_name) return eventHandler.emit('requestVerify', {})
            eventHandler.emit('openChat', {})
          }}>
          <Chat />
        </Fab>
        {/* <div style={{marginLeft: '10px', alignSelf: 'end'}}>
          Sound Effects from <a href="https://pixabay.com/">Pixabay</a>
        </div> */}
        <CookieConsent />
        <Verification/>
      </Grid>
    );
  }
}

export default withHooksHOC(MainLayout);