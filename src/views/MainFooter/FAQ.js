/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, CircularProgress, Fab, Grid, Link} from '@mui/material';
import { withRouter } from '../../withRouter';
import privacy_policy from '../../privacy-policy.txt'
import { socket } from '../../websocket/socket';

class FAQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        faqs: undefined
    }
  }

  componentDidMount() {
    socket.emit('allsquads/faqs/fetch', {}, (res) => {
        console.log(res)
        if (res.code == 200) {
            this.setState({faqs: res.data})
        }
    })
  }

  componentWillUnmount() {
  }

  formatText = (text) => {
    if (!text) return
    var headCounter = 1
    return (
        <React.Fragment>
            {this.state.faqs.map(faq => (
                <React.Fragment>
                    <Typography>{'\u200b'}</Typography>
                    <Typography variant='h5'>{`${headCounter++}. ${faq.title.en}`}</Typography>
                    {faq.body.en.split('\r\n').map(line => <Typography>{line?.replace(/\*/g,'') || '\u200b'}</Typography>)}
                    {faq.image_url?.en? <img src={faq.image_url.en} /> : <></>}
                </React.Fragment>
            ))}
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
            <Typography variant='h4'>Frequency Asked Questions (FAQ)</Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography variant='h6'>{this.formatText(this.state.faqs) || <CircularProgress />}</Typography>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(FAQ);