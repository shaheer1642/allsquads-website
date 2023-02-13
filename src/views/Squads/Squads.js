/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Grid, Typography, FormControlLabel, Checkbox, CircularProgress} from '@mui/material';
import {socket,socketHasConnected} from '../../websocket/socket'
import { relicBotSquadToString } from '../../functions';
import SquadCard from './SquadCard';

class Squads extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squadsLoading: true,
      squadsArr: [],
      showMembers: false,
    };
  }

  componentDidMount() {
    console.log('[Squads] mounted')
    this.fetchSquads()
    socket.addEventListener('squadbot/squadCreate', this.fetchSquads)
    socket.addEventListener('squadbot/squadUpdate', this.fetchSquads)
    socket.addEventListener('squadCreate', this.fetchSquads)
    socket.addEventListener('squadUpdate', this.fetchSquads)
  }

  componentWillUnmount() {
    socket.removeEventListener('squadbot/squadCreate', this.fetchSquads)
    socket.removeEventListener('squadbot/squadUpdate', this.fetchSquads)
    socket.removeEventListener('squadCreate', this.fetchSquads)
    socket.removeEventListener('squadUpdate', this.fetchSquads)
  }

  componentDidUpdate() {
    console.log('[Squads] updated',this.state)
  }

  fetchSquads = () => {
    socket.emit('relicbot/squads/fetch', {}, (res1) => {
      if (res1.code == 200) {
        socket.emit('squadbot/squads/fetch', {}, (res2) => {
          if (res2.code == 200) {
            this.setState({
              squadsArr: [...res1.data.map(squad => ({...squad, squad_string: relicBotSquadToString(squad,true)})), ...res2.data],
              squadsLoading: false
            })
          }
        })
      }
    })
  }

  render() {
    return (
      <Grid container spacing={1} style={{margin: '10px'}}>
        <Grid item xs={12}>
          <FormControlLabel style={{userSelect: 'none'}} control={<Checkbox checked={this.state.showMembers} onChange={(e) => this.setState({showMembers: e.target.checked})}/>} label="Show Members" />
        </Grid>
        {this.state.squadsLoading ? <CircularProgress/>:
          this.state.squadsArr.map((squad,index) => {
            return (
              <Grid item xs={"auto"} key={index}>
                <SquadCard squad={squad} showMembers={this.state.showMembers}/>
              </Grid>
            )
          })
        }
      </Grid>
    );
  }
}

export default Squads;