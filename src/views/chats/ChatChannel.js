/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button, Drawer, Grid, Typography, Card, CardContent} from '@mui/material';
import {socket,socketHasConnected} from '../../websocket/socket'
import { convertUpper } from '../../functions';
import {as_users_list, usersLoaded} from '../../objects/as_users_list';
import { getCookie } from '../../functions';
import eventHandler from '../../event_handler/eventHandler';
import { user_logged, authorizationCompleted } from '../../objects/user_login';
import { relicBotSquadToString } from '../../functions';

class ChatChannel extends React.Component {
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

  openChat = () => {
    this.setState({open: true})
  }

  render() {
    return (
      <Card elevation={3} onClick={this.props.onClick}>
        <CardContent>
          <Typography variant='h5'>{convertUpper(this.props.squad.squad_string)}</Typography>
          <Typography style={{fontSize: '16px'}}></Typography>
        </CardContent>
      </Card>
    );
  }
}

export default ChatChannel;