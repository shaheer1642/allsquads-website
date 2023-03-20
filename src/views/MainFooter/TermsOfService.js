/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, CircularProgress, Fab, Grid, Link} from '@mui/material';
import { withRouter } from '../../withRouter';
import terms_of_service from '../../terms-of-service.txt'

class TermsOfService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        termsOfService: null
    }
  }

  componentDidMount() {
    fetch(terms_of_service).then(res => res.text()).then(text => this.setState({termsOfService: text})).catch(console.error)
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
                    return <Typography variant='h5'>{`${headCounter}. ${line.replace(/^##/,'').replace(/##$/,'')}`}</Typography>
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
            <Typography variant='h4'>Terms of Service</Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography variant='h6'>{this.formatText(this.state.termsOfService) || <CircularProgress />}</Typography>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(TermsOfService);