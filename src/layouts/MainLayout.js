/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Box, AppBar, Toolbar, IconButton, Typography, Button, CircularProgress} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {socket,socketHasConnected} from '../websocket/socket'
import LoginScreen from '../views/Authorization/LoginScreen';
import { user_logged, authorizationCompleted } from '../objects/user_login';

class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginOpen: false,
      loginLoading: true
    };
  }

  componentDidMount() {
    console.log('mainlayout mounted')
    authorizationCompleted().then(() => this.setState({loginLoading: false})).catch(console.error)
  }

  componentWillUnmount() {
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
              <MenuIcon />
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
          </Toolbar>
        </AppBar>
        < Outlet />
        < LoginScreen onClose={() => this.setState({loginOpen: false})} open={this.state.loginOpen}/>
      </Box>
    );
  }
}

export default MainLayout;