/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button, Drawer, Grid, Typography} from '@mui/material';
import {socket,socketHasConnected} from '../../websocket/socket'
import { convertUpper } from '../../functions';
import {as_users_list, usersLoaded} from '../../objects/as_users_list';
import { getCookie } from '../../functions';
import eventHandler from '../../event_handler/eventHandler';
import { user_logged } from '../../objects/user_login';

class Chats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,

      chatsObj: {},
      loadingChats: true
    }
  }

  componentDidMount() {
    this.fetchChats()
    eventHandler.addListener('openChat', this.openChat)
  }

  componentWillUnmount() {
    eventHandler.removeListener('openChat', this.openChat)
  }

  componentDidUpdate() {
  }

  openChat = () => {
    this.setState({open: true})
  }

  fetchChats = () => {
    if (!user_logged) return
    socket.emit('allsquads/user/chats/fetch', {discord_id: user_logged.discord_id},(res) => {
      if (res.code == 200) {
        console.log('fetchchats res',res)
        this.setState({
          chatsObj: {...res.data},
          loadingChats: false
        })
      }
    })
  }

  render() {
    return (
      <Drawer
        keepMounted={false}
        anchor={'right'}
        open={this.state.open}
        onClose={() => this.setState({open: false})}
        PaperProps={{
          sx: { width: "30vw" },
        }}
      >
        <Grid container padding={"10px"}>
          <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
            <Typography variant='h5'>Squad Chats</Typography>
          </Grid>
          {Object.values(this.state.chatsObj).map(squad => squad.map(chat => 
            (<Grid item xs={12}>
              <Typography sx={{wordWrap: 'break-word'}}>{`[${chat.squad_string || (chat.tier + chat.main_relics.join(' '))}] ${as_users_list[chat.discord_id]?.ingame_name}: ${chat.message}`}</Typography>
              
            </Grid>)
          ))
          }
        </Grid>
      </Drawer>
    );
  }
}

export default Chats;