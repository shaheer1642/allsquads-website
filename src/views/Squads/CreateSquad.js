/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Grid, Typography, FormControlLabel, Checkbox, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField, Alert,} from '@mui/material';
import {ControlPoint} from '@mui/icons-material'
import {socket,socketHasConnected} from '../../websocket/socket'
import { relicBotSquadToString } from '../../functions';
import SquadCard from './SquadCard';
import { user_logged } from '../../objects/user_login';
import eventHandler from '../../event_handler/eventHandler';

class CreateSquad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      squadName: '',
      alertMessage: '',
      alertSeverity: 'success',
    };
    this.clearAlertTimeout = null
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidUpdate() {
  }

  createNewSquad = () => {
    if (!user_logged) return eventHandler.emit('requestLogin', {})
    this.setState({
        loading: true
    }, () => {
        const bot_type = ['lith','meso','neo','axi'].some(value => this.state.squadName.match(value)) ? 'relicbot' : 'squadbot' 
        socket.emit(`${bot_type}/squads/create`, {discord_id: user_logged.discord_id, message: this.state.squadName, channel_id: 'web-111', merge_squad: false}, (responses) => {
            var msg = ''
            responses.forEach(res => {
                if (res.code != 200)
                    msg +=  (res.message || res.err || res.error || 'Something went wrong. Please try again') + '\n'
            })
            if (msg == '') {
                this.setState({
                    alertMessage: 'Squad created!',
                    alertSeverity: 'success',
                    squadName: '',
                    loading: false
                }, this.clearAlert)
            } else {
                this.setState({
                    alertMessage: msg,
                    alertSeverity: 'warning',
                    loading: false
                }, this.clearAlert)
            }
        })
    })
  }

  clearAlert = () => {
    clearTimeout(this.clearAlertTimeout)
    this.clearAlertTimeout = setTimeout(() => {
        this.setState({
            alertMessage: '',
        })
    }, 3000);
  }

  render() {
    return (
        <Dialog onClose={this.props.onClose} open={this.props.open} sx={{ '& .MuiDialog-paper': { padding: '20px' } }}>
            <DialogTitle>
                Create Squad
            </DialogTitle>
            <DialogContent>
                {this.state.alertMessage ? <Alert severity={this.state.alertSeverity}>{this.state.alertMessage}</Alert>:<></>}
                <DialogContentText>
                    Type below name of the new squad(s) seperated by new line
                </DialogContentText>
                <TextField fullWidth style={{marginTop: '20px'}} placeholder={`aya farm\nlith v2`} multiline minRows={3} maxRows={5} label="Squad Name" value={this.state.squadName} onChange={(e) => this.setState({squadName: e.target.value})}/>
            </DialogContent>
            <DialogActions style={{justifyContent: 'start', marginLeft: '15px'}}>
                <Button variant='contained' onClick={() => this.createNewSquad()}>{this.state.loading ? <CircularProgress style={{color: 'white'}} size={"20px"}/> : 'Create'}</Button>
            </DialogActions>
        </Dialog>
    );
  }
}

export default CreateSquad;