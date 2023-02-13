/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Card, CardContent, Typography, Button, CardActions, CircularProgress} from '@mui/material';
import {socket,socketHasConnected} from '../../websocket/socket'
import { relicBotSquadToString } from '../../functions';
import { convertUpper } from '../../functions';
import {as_users_list, usersLoaded} from '../../objects/as_users_list';

class SquadCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        usersListLoading: true,
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

  render() {
    return (
        <Card elevation={3} style={{padding: '10px' }}>
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
            <Button size="small">✅ Join Squad</Button>
          </CardActions>
        </Card>
    );
  }
}

export default SquadCard;