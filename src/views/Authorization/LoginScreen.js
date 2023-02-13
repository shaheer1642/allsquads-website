/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button} from '@mui/material';
import {socket,socketHasConnected} from '../../websocket/socket'
import { convertUpper } from '../../functions';
import {as_users_list, usersLoaded} from '../../objects/as_users_list';
import { getCookie } from '../../functions';

const login_url = 'https://discord.com/api/oauth2/authorize?' + new URLSearchParams({
    client_id: process.env.REACT_APP_ENVIRONMENT == 'dev' ? '878017655028723803' : '832682369831141417',
    redirect_uri: process.env.REACT_APP_SOCKET_URL+'api/allsquads/discordOAuth2/authorize',
    response_type: 'code',
    scope:'identify email guilds',
    state: `${getCookie('login_token')}_${process.env.REACT_APP_SERVER_ADDRESS}`
}).toString();

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      <Dialog onClose={this.props.onClose} open={this.props.open} 
      sx={{ '& .MuiDialog-paper': { padding: '20px' } }}
      >
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will need to link your Discord account in order to use features on this website
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{justifyContent: 'center', alignItems: 'end'}}>
          <Button variant='contained' href={login_url} onClick={() => {}}>Login Via Discord</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default LoginScreen;