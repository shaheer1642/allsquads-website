/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Card, CardContent, Typography, Button, CardActions, CircularProgress, fabClasses} from '@mui/material';
import {DoneOutlined, CancelOutlined} from '@mui/icons-material'
import {socket,socketHasConnected} from '../../websocket/socket'
import { relicBotSquadToString } from '../../functions';
import { convertUpper } from '../../functions';
import {as_users_list, usersLoaded} from '../../objects/as_users_list';
import { user_logged } from '../../objects/user_login';
import eventHandler from '../../event_handler/eventHandler';
import * as Colors from '@mui/material/colors';

class SquadCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        usersListLoading: true,

        joiningLeavingSquadLoading: false
    }
  }

  componentDidMount() {
    console.log('[SquadCard] mounted')
    usersLoaded().then(() => {
        this.setState({
          usersListLoading: false
        })
    }).catch(console.error)
  }

  componentWillUnmount() {
  }

  componentDidUpdate() {
    console.log('[SquadCard] updated',this.state)
  }

  joinLeaveSquad = () => {
    if (!user_logged) return eventHandler.emit('requestLogin', {})
    this.setState({joiningLeavingSquadLoading: true}, () => {
      socket.emit(`${this.props.squad.bot_type}/squads/addmember`, {
        squad_id: this.props.squad.squad_id,
        discord_id: user_logged.discord_id,
        channel_id: 'web-111',
      }, (res) => {
        this.setState({joiningLeavingSquadLoading: false})
      })
    })
  }

  render() {
    return (
        <Card elevation={3} style={{padding: '10px', backgroundColor: this.props.squad.members.includes(user_logged?.discord_id) ? Colors.green[50] : 'white' }}>
          <CardContent> 
            {/* Squad title */}
            <Typography variant="h5">
                <pre style={{ fontFamily: 'inherit' }}>
                    {convertUpper(this.props.squad.squad_string)}
                </pre>
            </Typography>
            {/* Squad members */}
            {this.state.usersListLoading ? <CircularProgress /> :
            <Typography variant="h6">
                <pre style={{ fontFamily: 'inherit' }}>
                    { this.props.showMembers ? this.props.squad.members.map(id => as_users_list[id]?.ingame_name).join('\n') : `${this.props.squad.members.length}/${this.props.squad.spots || 4}`}
                </pre>
            </Typography>
            }
          </CardContent>
          <CardActions style={{justifyContent: 'center'}}>
            <Button 
            disabled={this.state.joiningLeavingSquadLoading || this.props.disableActions}
            onClick={() => this.joinLeaveSquad()} 
            size="small" variant="outlined" 
            style={this.props.disableActions ? {} : {color: this.props.squad.members.includes(user_logged?.discord_id) ? 'red' : 'green', borderColor: this.props.squad.members.includes(user_logged?.discord_id) ? 'red' : 'green'}}
            startIcon={this.state.joiningLeavingSquadLoading? null : this.props.squad.members.includes(user_logged?.discord_id) ? <CancelOutlined /> : <DoneOutlined />}>
              {this.state.joiningLeavingSquadLoading ? <CircularProgress size='20px'/> 
              : this.props.squad.members.includes(user_logged?.discord_id) ? 'Leave Squad' : 'Join Squad'}
            </Button>
          </CardActions>
        </Card>
    );
  }
}

export default SquadCard;