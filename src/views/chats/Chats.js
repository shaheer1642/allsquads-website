/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button, Drawer, Grid, Typography, CircularProgress} from '@mui/material';
import {ArrowBack} from '@mui/icons-material'
import {socket,socketHasConnected} from '../../websocket/socket'
import { convertUpper } from '../../functions';
import {as_users_list, usersLoaded} from '../../objects/as_users_list';
import { getCookie } from '../../functions';
import eventHandler from '../../event_handler/eventHandler';
import { user_logged, authorizationCompleted } from '../../objects/user_login';
import ChatChannel from './ChatChannel';
import { relicBotSquadToString } from '../../functions';
import Squads from '../Squads/Squads';
import ChatChannelMessages from './ChatChannelMessages';

class Chats extends React.Component {
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
    authorizationCompleted().then(() => this.fetchFilledSquads()).catch(console.error)
    
    eventHandler.addListener('openChat', this.openChat)
    socket.addEventListener('relicbot/squads/opened', this.newSquadOpenedListener)
    socket.addEventListener('squadbot/squads/opened', this.newSquadOpenedListener)
    socket.addEventListener('squadbot/squadUpdate', this.squadUpdateListener)
    socket.addEventListener('squadUpdate', this.squadUpdateListener)
  }

  componentWillUnmount() {
    eventHandler.removeListener('openChat', this.openChat)
    socket.removeEventListener('relicbot/squads/opened', this.newSquadOpenedListener)
    socket.removeEventListener('squadbot/squads/opened', this.newSquadOpenedListener)
    socket.removeEventListener('squadbot/squadUpdate', this.squadUpdateListener)
    socket.removeEventListener('squadUpdate', this.squadUpdateListener)
  }

  componentDidUpdate() {
  }

  openChat = (data) => {
    this.setState({open: true, viewChat: data?.squad?.squad_id})
  }

  newSquadOpenedListener = (data) => {
    if (data.members.includes(user_logged?.discord_id)) {
      this.fetchFilledSquads(() => {
        this.openChat({squad: data})
      })
    }
  }

  squadUpdateListener = (data) => {
    console.log('[Chats.squadUpdateListener] called')
    const updatedSquad = data[0]
    if (this.state.filledSquads.some(squad => squad.squad_id == updatedSquad.squad_id)) {
      return this.setState(state => {
          const filledSquads = state.filledSquads.map((squad, index) => {
            if (squad.squad_id === updatedSquad.squad_id) return updatedSquad.bot_type == 'relicbot' ? {...updatedSquad, squad_string: relicBotSquadToString(updatedSquad,true)} : updatedSquad;
            else return squad
          });
          return {
            filledSquads,
          }
      });
    }
  }

  fetchFilledSquads = (callback) => {
    if (!user_logged) return
    socket.emit('allsquads/user/filledSquads/fetch', {discord_id: user_logged.discord_id},(res) => {
      if (res.code == 200) {
        const filledSquads = res.data.map(squad => squad.bot_type == 'relicbot' ? ({...squad, squad_string: relicBotSquadToString(squad,true)}) : squad)
        this.setState({
          filledSquads: [...filledSquads],
          loadingSquads: false
        }, () => {
          if (callback) callback()
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
          sx: { maxWidth: "30%" },
        }}
      >
        <Grid container padding={"10px"} rowSpacing={'10px'}>
          {
            this.state.viewChat != null ?
            <Grid item xs={"auto"}>
              <Button onClick={() => this.setState({viewChat: null})}><ArrowBack /></Button>
            </Grid> : <></>
          }
          <Grid item xs={this.state.viewChat == null ? 12 : 'auto'} width="100%" style={{display: 'flex', justifyContent: 'center'}}>
            <Typography variant='h5'>{this.state.viewChat == null ? 'Squad Chats' : convertUpper(this.state.filledSquads.filter(squad => squad.squad_id == this.state.viewChat)?.[0]?.squad_string)}</Typography>
          </Grid>
          <Grid item xs={12}></Grid>
          {this.state.loadingSquads ? <CircularProgress />
          :
            this.state.viewChat == null ?
              this.state.filledSquads.map(squad => 
                (<Grid item xs={12}>
                  <ChatChannel squad={squad} onClick={() => this.setState({viewChat: squad.squad_id})}/>
                </Grid>)
              )
            :
              <ChatChannelMessages squad={this.state.filledSquads.filter(squad => squad.squad_id == this.state.viewChat)?.[0]} />
          }
        </Grid>
      </Drawer>
    );
  }
}

export default Chats;