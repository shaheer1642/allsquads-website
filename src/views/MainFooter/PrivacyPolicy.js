/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, CircularProgress, Fab, Grid, Link} from '@mui/material';
import { withRouter } from '../../withRouter';
import privacy_policy from '../../privacy-policy.txt'

class PrivacyPolicy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        privacyPolicy: null
    }
  }

  componentDidMount() {
    fetch(privacy_policy).then(res => res.text()).then(text => this.setState({privacyPolicy: text})).catch(console.error)
  }

  componentWillUnmount() {
  }

  formatText = (text) => {
    if (!text) return
    var headCounter = 0
    return (
        <React.Fragment>
            {text.split('\r\n').map(line => {
                if (line.match(/^##/) && line.match(/##$/)) {
                    headCounter++
                    return <Typography variant='h5' color='tertiary.main'>{`${headCounter}. ${line.replace(/^##/,'').replace(/##$/,'')}`}</Typography>
                } else return <Typography>{line || '\u200b'}</Typography>
            })}
        </React.Fragment>
    )
  }

  render() {
    return (
      <Grid container 
        rowSpacing={'10px'}
        columnSpacing='20px'
        padding='20px'
      >
        <Grid item xs={12} justifyContent='center' display='flex'>
            <Typography variant='h4'>Privacy Policy</Typography>
        </Grid>
        <Grid item xs={12}>
          {this.formatText(this.state.privacyPolicy) || <CircularProgress />}
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(PrivacyPolicy);