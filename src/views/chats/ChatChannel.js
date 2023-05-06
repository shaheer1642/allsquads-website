/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button, Drawer, Grid, Typography, Card, CardContent} from '@mui/material';
import {socket,socketHasConnected} from '../../websocket/socket'
import { convertUpper } from '../../functions';
import {as_users_list, usersLoaded} from '../../objects/as_users_list';
import { getCookie } from '../../functions';
import eventHandler from '../../event_handler/eventHandler';
import { relicBotSquadToString } from '../../functions';
import theme from '../../theme';
import { withHooksHOC } from '../../withHooksHOC';

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

  render() {
    return (
      <Card elevation={3} onClick={this.props.onClick} style={{background: theme.palette.background.default}}>
        <CardContent>
          <Typography variant='h5'>{convertUpper(this.props.squad.squad_string)}</Typography>
          <Typography style={{fontSize: '16px'}}></Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withHooksHOC(ChatChannel);