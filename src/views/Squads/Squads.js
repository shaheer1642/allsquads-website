/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Grid, Typography, FormControlLabel, Checkbox, CircularProgress, Button} from '@mui/material';
import {ControlPoint} from '@mui/icons-material'
import {socket,socketHasConnected} from '../../websocket/socket'
import { relicBotSquadToString } from '../../functions';
import SquadCard from './SquadCard';
import CreateSquad from './CreateSquad';
import { user_logged } from '../../objects/user_login';
import eventHandler from '../../event_handler/eventHandler';

class Squads extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squadsLoading: true,
      squadsRefreshing: true,
      squadsArr: [],
      showMembers: false,
      createSquadOpen: false,
    };
    this.fetchSquad = {
      timeSinceLastCall: new Date().getTime(),
      timeout: null
    }
  }

  componentDidMount() {
    console.log('[Squads] mounted')
    this.fetchSquads()
    socket.addEventListener('squadbot/squadCreate', this.squadsListenerInsert)
    socket.addEventListener('squadbot/squadUpdate', this.squadsListenerUpdate)
    socket.addEventListener('squadCreate', this.squadsListenerInsert)
    socket.addEventListener('squadUpdate', this.squadsListenerUpdate)
  }

  componentWillUnmount() {
    socket.removeEventListener('squadbot/squadCreate', this.squadsListenerInsert)
    socket.removeEventListener('squadbot/squadUpdate', this.squadsListenerUpdate)
    socket.removeEventListener('squadCreate', this.squadsListenerInsert)
    socket.removeEventListener('squadUpdate', this.squadsListenerUpdate)
  }

  componentDidUpdate() {
    console.log('[Squads] updated',this.state)
  }

  squadsListenerInsert = (data) => {
    const newSquad = data
    if (this.state.squadsArr.some(squad => squad.squad_id == data.squad_id)) return
    return this.setState({
      squadsArr: [newSquad.bot_type == 'relicbot' ? {...newSquad, squad_string: relicBotSquadToString(newSquad,true)} : newSquad, ...this.state.squadsArr]
    })
  }
  squadsListenerUpdate = (data) => {
    const updatedSquad = data[0]
    if (updatedSquad.status != 'active') return this.squadsListenerDelete(updatedSquad)
    return this.setState(state => {
        const squadsArr = state.squadsArr.map((squad, index) => {
          if (squad.squad_id === updatedSquad.squad_id) return updatedSquad.bot_type == 'relicbot' ? {...updatedSquad, squad_string: relicBotSquadToString(updatedSquad,true)} : updatedSquad;
          else return squad
        });
        return {
          squadsArr,
        }
    });
  }
  squadsListenerDelete = (data) => {
    const deletedSquad = data
    return this.setState({
      squadsArr: this.state.squadsArr.filter((squad) => squad.squad_id != deletedSquad.squad_id)
    })
  }

  fetchSquads = () => {
    this.setState({
      squadsRefreshing: true
    }, () => {
      clearTimeout(this.fetchSquad.timeout)
      const setTimeoutValue = new Date().getTime() - this.fetchSquad.timeSinceLastCall > 2000 ? 0 : 1000
      console.log('setTimeoutValue',setTimeoutValue)
      this.fetchSquad.timeout = setTimeout(() => {
        console.log('[Squads.fetchSquads] called')
        this.fetchSquad.timeSinceLastCall = new Date().getTime()
        socket.emit('relicbot/squads/fetch', {}, (res1) => {
          console.log('[Squads.fetchSquads] response1',res1.code)
          if (res1.code == 200) {
            socket.emit('squadbot/squads/fetch', {}, (res2) => {
              console.log('[Squads.fetchSquads] response2',res2.code)
              if (res2.code == 200) {
                this.setState({
                  squadsArr: [...res1.data.map(squad => ({...squad, squad_string: relicBotSquadToString(squad,true), bot_type: 'relicbot'})), ...res2.data.map(squad => ({...squad, bot_type: 'squadbot'}))],
                  squadsLoading: false,
                  squadsRefreshing: false
                })
              }
            })
          }
        })
      }, setTimeoutValue);
    })
  }

  render() {
    return (
      <Grid container spacing={1} style={{padding: '10px'}}>
        <Grid item xs={"auto"}>
          <FormControlLabel style={{userSelect: 'none'}} control={<Checkbox checked={this.state.showMembers} onChange={(e) => this.setState({showMembers: e.target.checked})}/>} label="Show Members" />
        </Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={"auto"} style={{alignItems: 'center', display: 'flex', color:'red'}}>
          <Typography sx={{wordWrap: 'break-word'}}>
          Caution! The website is for testing only. Please do not open any squads from here as there is no chat system at the moment
          </Typography>
        </Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={"auto"}>
          <Button 
            onClick={() => {
              if (!user_logged) return eventHandler.emit('requestLogin', {})
              this.setState({createSquadOpen: true})
            }}
            variant="outlined" 
            style={{color: 'green', borderColor: 'green'}}
            startIcon={<ControlPoint />}>
              Create Squad
          </Button>
        </Grid>
        <Grid item xs={"auto"} style={{alignItems: 'center', display: 'flex'}}>
          {this.state.squadsRefreshing ? 'Refreshing Squads...':''}
        </Grid>
        <Grid item xs={12}></Grid>
        {this.state.squadsLoading ? <Grid item xs={12}><CircularProgress/></Grid>:
          this.state.squadsArr.map((squad,index) => {
            return (
              <Grid item xs={"auto"} key={index}>
                <SquadCard squad={squad} showMembers={this.state.showMembers} disableActions={false}/>
              </Grid>
            )
          })
        }
        <CreateSquad onClose={() => this.setState({createSquadOpen: false})} open={this.state.createSquadOpen} />
      </Grid>
    );
  }
}

export default Squads;