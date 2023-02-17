/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button, Drawer, Grid, Typography, CircularProgress, TextField} from '@mui/material';
import {Send} from '@mui/icons-material'
import {socket,socketHasConnected} from '../../websocket/socket'
import { convertUpper, sortCaseInsensitive } from '../../functions';
import {as_users_list, usersLoaded} from '../../objects/as_users_list';
import { getCookie, } from '../../functions';
import eventHandler from '../../event_handler/eventHandler';
import { user_logged, authorizationCompleted } from '../../objects/user_login';
import * as uuid from 'uuid';
import * as Colors from '@mui/material/colors';


function enquote(username) {
  return username.match(' ') ? `"${username}"`:username
}


class ChatChannelMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      newMessage: '',
      chatsArr: [],
      loadingChats: true
    }
  }

  componentDidMount() {
    console.log('mounting chatchannel messages')
    this.fetchSquadChats()
    socket.addEventListener('squadbot/squadMessageCreate', this.squadMessageListenerInsert)
    socket.addEventListener('squadMessageCreate', this.squadMessageListenerInsert)
    
  }

  componentWillUnmount() {
    console.log('unmounting chatchannel messages')
    socket.removeEventListener('squadbot/squadMessageCreate', this.squadMessageListenerInsert)
    socket.removeEventListener('squadMessageCreate', this.squadMessageListenerInsert)
  }

  componentDidUpdate(prevProps) {
  }

  squadMessageListenerInsert = (data) => {
    if (data.squad_id != this.props.squad.squad_id) return
    return this.setState({
      chatsArr: [...this.state.chatsArr, data]
    })
  }

  fetchSquadChats = () => {
    socket.emit(`${this.props.squad.bot_type}/squads/messagesFetch`, {squad_id: this.props.squad.squad_id}, (res) => {
      console.log('chatfetch res',res)
      if (res.code == 200) {
        this.setState({
          chatsArr: [...res.data],
          loadingChats: false
        })
      }
    })
  }

  sendNewMessage = () => {
    socket.emit(`${this.props.squad.bot_type}/squads/messageCreate`, {
      message_id: uuid.v4(),
      squad_id: this.props.squad.squad_id, 
      thread_id: 'web-111', 
      message: this.state.newMessage, 
      discord_id: user_logged.discord_id
    }, (res) => {
      this.setState({
        newMessage: ''
      })
      if (res.code != 200) {
        console.log('[ChatChannelMessages.sendNewMessage] error:',res)
      }
    })
  }

  onBecomeHostClick = () => {
    socket.emit(`${this.props.squad.bot_type}/squads/selecthost`,{squad_id: this.props.squad.squad_id, discord_id: user_logged.discord_id},(res) => {
      if (res.code != 200) {
        console.log('[ChatChannelMessages.onBecomeHostClick] error',res)
      }
    })
  }

  render() {
    var hosts = this.props.squad.host_recommendation;
    var host_selection;
    if (hosts?.[0].considered_ping == null) {
      host_selection = `Please decide a host and invite each other in the game`
    } else {
      host_selection = `Recommended Host: ${hosts[0].ign} with avg squad ping of ${hosts[0].avg_squad_ping}`
    }
    const invite_list = `/invite ${sortCaseInsensitive(this.props.squad.members.map(id => enquote(as_users_list[id]?.ingame_name))).join('\n/invite ')}`
    const squad_status_message = this.props.squad.status != 'opened' ? `This squad has been ${this.props.squad.status}` : ''
    const squad_host = this.props.squad.squad_host ? `${as_users_list[this.props.squad.squad_host]?.ingame_name} is hosting this squad\n- Please invite everyone, and make sure the squad is set to "invite-only"\n- Only the host should initiate the mission\n- If host migrates, same rules apply` : ''
    console.log('squad host',squad_host,this.props.squad.squad_host)
    return (
        <Grid container rowSpacing={"10px"} style={{display: 'flex', alignItems: 'end', }}>
          {
            this.state.loadingChats ? <Grid item xs={12} style={{display:'flex', justifyContent:'center'}}><CircularProgress /></Grid> :
            [
              <Grid item xs={12}><pre style={{overflowX: 'auto', whiteSpace: 'pre-line', wordWrap: 'break-word', color: Colors.orange[900]}}>{`Squad Filled\n\n${host_selection}\n\n${invite_list}\n\nStart chatting with your teammates below`}</pre></Grid>,
              <Grid item xs={12}>
                {this.props.squad.squad_host ? <pre style={{overflowX: 'auto', whiteSpace: 'pre-line', wordWrap: 'break-word', color: Colors.blue[700]}}>{squad_host}</pre> : <Button variant='outlined' onClick={() => this.onBecomeHostClick()}>Become Host</Button>}
              </Grid>,
              this.state.chatsArr.map((chat,index) => 
                (<Grid item xs={12} key={index} style={{wordWrap: 'break-word'}}>
                  {`${getTimestamp(Number(chat.creation_timestamp))} ${as_users_list[chat.discord_id]?.ingame_name}: ${chat.message}`}
                </Grid>)
              ),
              <Grid item xs={12}><pre style={{overflowX: 'auto', whiteSpace: 'pre-line', wordWrap: 'break-word', color: Colors.orange[900]}}>{squad_status_message}</pre></Grid>
            ]
            
          }
          <Grid item xs={12}></Grid>
          <Grid item xs={10}>
            <TextField 
              fullWidth
              size="small"
              disabled={this.props.squad.status != 'opened' ? true : false} 
              placeholder={this.props.squad.status != 'opened' ? 'Squad has been closed' : 'Type new message'}  
              value={this.state.newMessage}  
              onChange={(e) => this.setState({newMessage: e.target.value})} 
              onKeyDown={(e) => {
                if (e.key == 'Enter') this.sendNewMessage()
              }}
              />
          </Grid>
          <Grid item xs={2}>
            <Button onClick={() => this.sendNewMessage()}><Send /></Button>
          </Grid>
          
        </Grid>
    );
  }
}

function getTimestamp(timestamp) {
  return timestamp > new Date(new Date().setHours(0,0,0,0)).getTime() ? 
  `[${new Date(timestamp).toLocaleTimeString()}]` :
  `[${new Date(timestamp).toLocaleDateString()} ${new Date(timestamp).toLocaleTimeString()}]`
}

export default ChatChannelMessages;