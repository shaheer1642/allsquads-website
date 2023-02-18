/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Grid, Typography, FormControlLabel, Checkbox, CircularProgress, Button} from '@mui/material';
import {ControlPoint, CancelOutlined} from '@mui/icons-material'
import {socket,socketHasConnected} from '../../websocket/socket'
import { dynamicSort, relicBotSquadToString } from '../../functions';
import SquadCard from './SquadCard';
import CreateSquad from './CreateSquad';
import { user_logged } from '../../objects/user_login';
import eventHandler from '../../event_handler/eventHandler';
import ApiButton from '../../components/ApiButton';


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
    this.insertionHold = false
    this.updatationHold = false
    this.deletionHold = false
  }

  componentDidMount() {
    console.log('[Squads] mounted')
    this.fetchSquads()
    // refresh squads every 2m
    setInterval(() => {
      this.fetchSquads()
    }, 120000);

    socket.addEventListener('squadbot/squadCreate', this.squadsListenerInsert)
    socket.addEventListener('squadbot/squadUpdate', this.squadsListenerUpdate)
    socket.addEventListener('squadCreate', this.squadsListenerInsert)
    socket.addEventListener('squadUpdate', this.squadsListenerUpdate)
  }

  componentWillUnmount() {
    console.log('[Squads] unmounted')
    socket.removeEventListener('squadbot/squadCreate', this.squadsListenerInsert)
    socket.removeEventListener('squadbot/squadUpdate', this.squadsListenerUpdate)
    socket.removeEventListener('squadCreate', this.squadsListenerInsert)
    socket.removeEventListener('squadUpdate', this.squadsListenerUpdate)
  }

  componentDidUpdate() {
  }

  squadsListenerInsert = (data) => {
    if (this.insertionHold) return setTimeout(() => this.squadsListenerInsert(data), 10);
    this.insertionHold = true

    console.log('[Squads.squadsListenerInsert] called')
    const newSquad = data
    if (this.state.squadsArr.some(squad => squad.squad_id == newSquad.squad_id)) {
      console.log('[Squads.squadsListenerInsert] duplicate squad')
      return
    }
    return this.setState({
      squadsArr: [newSquad.bot_type == 'relicbot' ? {...newSquad, squad_string: relicBotSquadToString(newSquad,true)} : newSquad, ...this.state.squadsArr].sort(dynamicSort('squad_string'))
    }, () => {this.insertionHold = false})
  }

  squadsListenerUpdate = (data) => {
    if (this.updatationHold) return setTimeout(() => this.squadsListenerUpdate(data), 10);
    this.updatationHold = true
    
    console.log('[Squads.squadsListenerUpdate] called')
    const updatedSquad = data[0]
    if (updatedSquad.status != 'active') return this.squadsListenerDelete(updatedSquad)
    return this.setState(state => {
        const squadsArr = state.squadsArr.map((squad, index) => {
          if (squad.squad_id === updatedSquad.squad_id) return updatedSquad.bot_type == 'relicbot' ? {...updatedSquad, squad_string: relicBotSquadToString(updatedSquad,true)} : updatedSquad;
          else return squad
        }).sort(dynamicSort('squad_string'));
        return {
          squadsArr,
        }
    }, () => {this.updatationHold = false});
  }
  squadsListenerDelete = (data) => {
    if (this.deletionHold) return setTimeout(() => this.squadsListenerDelete(data), 10);
    this.deletionHold = true

    console.log('[Squads.squadsListenerDelete] called')
    const deletedSquad = data
    return this.setState({
      squadsArr: this.state.squadsArr.filter((squad) => squad.squad_id != deletedSquad.squad_id)
    }, () => {this.deletionHold = false});
  }

  fetchSquads = () => {
    console.log('[Squads.fetchSquads] called')
    this.setState({
      squadsRefreshing: true
    }, () => {
      socket.emit('relicbot/squads/fetch', {}, (res1) => {
        // console.log('[Squads.fetchSquads] response1',res1.code)
        if (res1.code == 200) {
          socket.emit('squadbot/squads/fetch', {}, (res2) => {
            // console.log('[Squads.fetchSquads] response2',res2.code)
            if (res2.code == 200) {
              this.setState({
                squadsArr: [...res1.data.map(squad => ({...squad, squad_string: relicBotSquadToString(squad,true)})), ...res2.data].sort(dynamicSort('squad_string')),
                squadsLoading: false,
                squadsRefreshing: false
              })
            }
          })
        }
      })
    })
  }

  leaveAllSquads = (e, callback) => {
    socket.emit(`squadbot/squads/leaveall`,{
      discord_id: user_logged.discord_id,
    }, (res) => {
      if (res.code != 200) console.log('[Squads.leaveAllSquads] query 1 error',res)
      socket.emit(`relicbot/squads/leave`,{
        discord_id: user_logged.discord_id,
        tier: 'all',
      }, (res) => {
        if (res.code != 200) console.log('[Squads.leaveAllSquads] query 2 error',res)
        if (callback) callback()
      })
    })
  }

  render() {
    return (
      <Grid container spacing={1} style={{padding: '10px'}}>
        <Grid item xs={"auto"}>
          <FormControlLabel style={{userSelect: 'none'}} control={<Checkbox color='secondary' checked={this.state.showMembers} onChange={(e) => this.setState({showMembers: e.target.checked})}/>} label="Show Members" />
        </Grid>
        {/* <Grid item xs={"auto"} style={{alignItems: 'center', display: 'flex', color:'red'}}>
          <Typography sx={{wordWrap: 'break-word'}}>
          Caution! The website is for testing only. Please do not open any squads from here as there is no chat system at the moment
          </Typography>
        </Grid>
        <Grid item xs={12}></Grid> */}
        <Grid item xs={12}></Grid>
        <Grid item xs={"auto"}>
          <Button 
            onClick={() => {
              if (!user_logged) return eventHandler.emit('requestLogin', {})
              this.setState({createSquadOpen: true})
            }}
            variant="outlined" 
            color='success'
            startIcon={<ControlPoint />}>
              Create Squad
          </Button>
        </Grid>
        {this.state.squadsArr.some(squad => squad.members.includes(user_logged?.discord_id)) ? 
          <Grid item xs={"auto"}>
          <ApiButton 
            onClick={this.leaveAllSquads}
            variant="outlined" 
            color='error'
            startIcon={<CancelOutlined />}
            label='Leave All'
          />
          </Grid> : <></>
        }
        <Grid item xs={12}></Grid>
        <Grid item xs={"auto"} style={{alignItems: 'center', display: 'flex'}}>
          {this.state.squadsRefreshing ? 'Refreshing Squads...':''}
        </Grid>
        <Grid item xs={12}></Grid>
        {this.state.squadsLoading ? <Grid item xs={12}><CircularProgress color="tertiary"/></Grid>:
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