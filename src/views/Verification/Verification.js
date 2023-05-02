import { Snackbar, Button, IconButton, Dialog, Grid, Typography } from '@mui/material';
import React, { Component } from 'react';
import { user_logged } from '../../objects/user_login';
import { getCookie } from '../../cookie_handler';
import eventHandler from '../../event_handler/eventHandler';

class Verification extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            snackBarOpen: false,
            dialogOpen: false,
            verificationCode: null,
            updatedIgn: false
        }
    }

    componentDidMount() {
        this.checkVerification()
        eventHandler.addListener('userLogin/stateChange',this.checkVerification)
        eventHandler.addListener('verification/updatedIgn',this.handleIgnUpdate)
    }

    componentWillUnmount() {
        eventHandler.removeListener('userLogin/stateChange',this.checkVerification)
        eventHandler.removeListener('verification/updatedIgn',this.handleIgnUpdate)
    }

    handleIgnUpdate = () => {
        this.closeSnackBar()
        this.closeDialog()
        this.setState({updatedIgn: true})
    }

    checkVerification = () => {
        if (user_logged) {
            if (!user_logged.ingame_name) {
                this.openSnackBar()
            } else {
                this.closeSnackBar()
            }
        }
    }

    componentDidUpdate() {
    }

    closeSnackBar = () => {
        this.setState({snackBarOpen: false})
    }
    closeDialog = () => {
        this.setState({dialogOpen: false})
    }
    openSnackBar = () => {
        this.setState({snackBarOpen: true})
    }
    openDialog = () => {
        this.fetchVerificationCode().then(() => this.setState({dialogOpen: true}))
    }

    fetchVerificationCode = () => {
        return new Promise((resolve, reject) => {
            if (this.state.verificationCode) return resolve()
            fetch(`${process.env.REACT_APP_SOCKET_URL}api/allsquads/authorization/verification/ign/fetchCode?login_token=${getCookie('login_token')}`)
            .then((res) => res.json())
            .then((res) => {
                if (res.code == 200) {
                    this.setState({
                        verificationCode: res.verificationCode
                    }, () => resolve())
                }
            }).catch(console.error);
        })
    }

    action = (
        <React.Fragment>
            <Button variant='outlined' color="primary" size="small" onClick={this.openDialog}>
                Verify
            </Button>
        </React.Fragment>
    )

    render() { 
        return (  
            <React.Fragment>
                <Snackbar
                    style={{color: 'yellow'}}
                    open={this.state.dialogOpen ? false : this.state.snackBarOpen}
                    message="Please verify your Warframe username in order to create/join squads"
                    action={this.action}
                />
                <Dialog onClose={this.closeDialog} open={this.state.dialogOpen} sx={{ '& .MuiDialog-paper': { padding: '20px' } }}>
                    <Grid container>
                        <Grid item xs={12}>
                                {`Please follow these steps to verify your Warframe account:
                                \u200b
                                1) First make sure you are signed-in on Warframe forums by visiting this link: --link https://forums.warframe.com/ --link
                                \u200b
                                2) Visit this page to compose a new message to the bot (TradeKeeper): --link https://forums.warframe.com/messenger/compose/?to=6931114 --link
                                \u200b
                                3) Write the message body as given below:
                                Subject: ${this.state.verificationCode}
                                Message: Hi
                                \u200b
                                4) Click 'Send' button
                                \u200b
                                5) Bot will check the inbox in next couple of seconds and verify your account`.split('\n').map((line,index) => {
                                    return (
                                    <Typography key={index}  style={{wordWrap: "break-word", width: '100%'}}>
                                        {line.replace(/--link.*--link/g,'').trim()} {line.match('--link') ? <a target='_bank' href={(line.split('--link ')[1]).replace(/--link/g,'').trim()}>{(line.split('--link ')[1]).replace(/--link/g,'').trim()}</a> : <></>}
                                    </Typography>
                                    )
                                })}
                        </Grid>
                    </Grid>
                </Dialog>
                <Dialog onClose={() => this.setState({updatedIgn: false})} open={this.state.updatedIgn} sx={{ '& .MuiDialog-paper': { padding: '20px' } }}>
                    <Typography>Your IGN has been updated to {user_logged?.ingame_name}</Typography>
                </Dialog>
            </React.Fragment>
        );
    }
}
 
export default Verification;