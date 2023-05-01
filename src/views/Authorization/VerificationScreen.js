/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import {Box, Typography, Button, Link} from '@mui/material';
import {socket,socketHasConnected} from '../../websocket/socket'
import { convertUpper } from '../../functions';
import {as_users_list, usersLoaded} from '../../objects/as_users_list';
import { getCookie } from '../../functions';
import { withRouter } from '../../withRouter';

const login_url = 'https://discord.com/api/oauth2/authorize?' + new URLSearchParams({
    client_id: process.env.REACT_APP_ENVIRONMENT == 'dev' ? '878017655028723803' : '832682369831141417',
    redirect_uri: process.env.REACT_APP_SOCKET_URL+'api/allsquads/authorization/discordOAuth2',
    response_type: 'code',
    scope:'identify email guilds',
    state: `${getCookie('login_token')}_${process.env.REACT_APP_SERVER_ADDRESS}`
}).toString();

class VerificationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.code = new URLSearchParams(this.props.location.search).get("code")
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidUpdate() {
  }

  render() {
    return (
      <div style={{justifyContent: 'center', alignItems: 'center', display: 'flex', height: '100vh'}}>
        <Box sx={{ border: 3, borderColor: 'primary.main', padding: '20px', maxWidth: '50vw'}}>
        {`Please follow these steps to verify your Warframe account:
        \u200b
          1) First make sure you are signed-in on Warframe forums by visiting this link: --link https://forums.warframe.com/ --link
          \u200b
          2) Visit this page to compose a new message to the bot (TradeKeeper): --link https://forums.warframe.com/messenger/compose/?to=6931114 --link
          \u200b
          3) Write the message body as given below:
          Subject: ${this.code}
          Message: Hi
          \u200b
          4) Click 'Send' button
          \u200b
          5) Bot will check the inbox in next couple of seconds and verify your account
          \u200b
          6) Once finished, click below to login again`.split('\n').map((line,index) => {
            return (
              <Typography key={index} variant="h5" style={{wordWrap: "break-word", width: '100%'}}>
                {line.replace(/--link.*--link/g,'').trim()} {line.match('--link') ? <a href={(line.split('--link ')[1]).replace(/--link/g,'').trim()}>{(line.split('--link ')[1]).replace(/--link/g,'').trim()}</a> : <></>}
              </Typography>
            )
        })}
        <Button href={login_url} style={{margin: '20px',}} variant='contained'>Login</Button>
        </Box>
      </div>
    );
  }
}

export default withRouter(VerificationScreen);