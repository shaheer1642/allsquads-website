/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, CircularProgress, Fab, Grid, Link} from '@mui/material';
import {DiscountRounded} from '@mui/icons-material'
import {socket,socketHasConnected} from '../websocket/socket'
import LoginScreen from '../views/Authorization/LoginScreen';
import { user_logged, authorizationCompleted } from '../objects/user_login';
import Chats from '../views/chats/Chats';
import eventHandler from '../event_handler/eventHandler';
import * as Colors from '@mui/material/colors';
import { withRouter } from '../withRouter';
import CookieConsent from '../views/CookieConsent/CookieConsent';
import theme from '../theme';

class MainFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginOpen: false,
      loginLoading: true
    };
  }

  componentDidMount() {
    console.log('[MainLayout] mounted')
    authorizationCompleted().then(() => this.setState({loginLoading: false})).catch(console.error)
  }

  componentWillUnmount() {
    console.log('[MainLayout] unmounted')
  }

  render() {
    return (
      <Grid container 
        style={{backgroundColor: theme.palette.primary.main, borderTop: `2px solid ${theme.palette.tertiary.main}`, padding: '10px'}} 
        alignItems='center' 
        justifyContent='center'
        rowSpacing={'10px'}
        columnSpacing='20px'
      >
        {/* <Grid item xs='auto'>
          <Typography variant='h4'>AllSquads</Typography>
        </Grid>
        <Grid item xs={12}></Grid> */}
        <Grid item xs={'auto'}>
          <Link style={{ cursor: 'pointer' }} color={'tertiary.main'} onClick={() => {this.props.navigate('faq');window.scrollTo({ top: 0, behavior: "smooth" })}}>FAQ</Link>
        </Grid>
        <Grid item xs={'auto'}>|</Grid>
        <Grid item xs={'auto'}>
          <Link style={{ cursor: 'pointer' }} color={'tertiary.main'} onClick={() => {this.props.navigate('terms-of-service');window.scrollTo({ top: 0, behavior: "smooth" })}}>Terms of Service</Link>
        </Grid>
        <Grid item xs={'auto'}>|</Grid>
        <Grid item xs={'auto'}>
          <Link style={{ cursor: 'pointer' }} color={'tertiary.main'} onClick={() => {this.props.navigate('privacy-policy');window.scrollTo({ top: 0, behavior: "smooth" })}}>Privacy Policy</Link>
        </Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={'auto'} alignItems='center' display='flex'>
          <img src="/icons/discord-icon.png" width={'32px'} height={'32px'} style={{margin: '5px'}}/>
          <Link href="https://discord.gg/invite/346ZthxCe8" color={'tertiary.main'}>Join us on Discord</Link>
        </Grid>
        <Grid item xs={'auto'}>|</Grid>
        <Grid item xs={'auto'} alignItems='center' display='flex'>
          <img src="/icons/patreon-icon.png" width={'24px'} height={'24px'} style={{margin: '5px'}}/>
          <Link href="https://www.patreon.com/warframehub" color={'tertiary.main'}>Support us on Patreon</Link>
        </Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={12} justifyContent='center' display={'flex'}>
          <Typography sx={{wordWrap: 'break-word'}} color='primary.light'>
            DISCLAIMER: Digital Extremes and Warframe are registered trademarks. This website has no direct affiliation with Digital Extremes. All recognizable artwork is intellectual property of these trademarks.
          </Typography>
        </Grid>
        <Grid item xs={12} justifyContent='center' display={'flex'}>
          <Typography>© AllSquads 2022-23</Typography>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(MainFooter);