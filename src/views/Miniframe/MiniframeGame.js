/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import {Grid, Typography, } from '@mui/material';
import { withHooksHOC } from '../../withHooksHOC';
import { generateDummyArray, getRandomInt, getRandomLocation } from './Functions';
import {socket,socketHasConnected} from '../../websocket/socket'

class MiniframeGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      characters: [],

      mapSizeH: 40,
      mapSizeV: 19,

      props: {
          healths: [],
          armors: [],
          enemies: [],
          swords: [],
          guns: [],
      }

    };
  }

  async componentDidMount() {
    await socketHasConnected()
    this.spawnCharacter(() => this.fetchGameData())

    document.addEventListener("keydown", this.handleKeyDown);
    socket.addEventListener('miniframe/listeners/characterUpdated', this.characterUpdatedListener)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    socket.removeEventListener('miniframe/listeners/characterUpdated', this.characterUpdatedListener)
  }

  componentDidUpdate() {
    console.log(this.state.characters)
  }

  characterUpdatedListener = (data) => {
    this.setState({
      characters: data
    })
  }

  handleKeyDown = (event) => {
    switch( event.keyCode ) {
        case 37:
          this.moveChar('left');
          break;
        case 38:
          this.moveChar('up');
          break;
        case 39:
          this.moveChar('right');
          break;
        case 40:
          this.moveChar('down');
          break;
        default: 
          break;
    }
  }


  spawnCharacter = (callback) => {
    socket.emit('miniframe/characters/spawn',{},(res) => {
      if (res.code == 200) {
        if (callback) callback()
      }
    })
  }

  fetchGameData = () => {
    socket.emit('miniframe/gamedata/fetch',{},(res) => {
      console.log(res)
      if (res.code == 200) {
        this.setState({
          ...res.data
        })
      }
    })
  }

  moveChar = (direction) => {
    this.setState(state => ({
      characters: state.characters.map(char => {
        if (char.character_id == socket.id) 
          return ({
            ...char,
            location: [
              direction == 'left' ? char.location[0] -= 1 : direction == 'right' ? char.location[0] += 1 : char.location[0],
              direction == 'up' ? char.location[1] -= 1 : direction == 'down' ? char.location[1] += 1 : char.location[1], 
            ]
          })
        else return char
      })
    }), () => {
      socket.emit('miniframe/characters/update',{ character: this.state.characters.filter(char => char.character_id == socket.id)[0]})
    })
  }

  generateMap = () => {
    if (this.generateMapTimeout) return this.cacheMap
    this.generateMapTimeout = true
    const ts = new Date().getTime()
    console.log('generatingMap')
    const map = []
    map.push(
      this.generateItem({ text: `${this.state.char_health} ❤️            ${this.state.char_armor} 🛡️`, columns: this.state.mapSizeH})
    )

    for (let i = 0; i < this.state.mapSizeV; i++) {
        for (let j = 0; j < this.state.mapSizeH; j++) {
            if (this.state.characters.some(char => i == char.location[1] && j == char.location[0]))
              map.push(this.generateItem({text: <img src="/icons/KEKFC.png" width={'48px'} height={'48px'}/>, loc: [j, i]}))
            else if (j == 0 || j == this.state.mapSizeH - 1)
              map.push(this.generateItem({text: '|', loc: [j, i]}))
            else if (i == 0 || i == this.state.mapSizeV - 1)
              map.push(this.generateItem({text: '-', loc: [j, i]}))
            else if (this.state.props.healths.some(loc => loc[0] == j && loc[1] == i))
              map.push(this.generateItem({text: '❤️', loc: [j, i]}))
            else if (this.state.props.armors.some(loc => loc[0] == j && loc[1] == i))
              map.push(this.generateItem({text: '🛡️', loc: [j, i]}))
            else if (this.state.props.enemies.some(loc => loc[0] == j && loc[1] == i))
              map.push(this.generateItem({text: '👻', loc: [j, i]}))
            else if (this.state.props.swords.some(loc => loc[0] == j && loc[1] == i))
              map.push(this.generateItem({text: '⚔️', loc: [j, i]}))
            else if (this.state.props.guns.some(loc => loc[0] == j && loc[1] == i))
              map.push(this.generateItem({text: '🔫', loc: [j, i]}))
            else 
              map.push(this.generateItem({text: ' ', loc: [j, i]}))
        }
    }

    console.log('map generated in',new Date().getTime() - ts,'ms')
    this.cacheMap = map
    setTimeout(() => {
      this.generateMapTimeout = false
    }, 10);
    return map
  }

  generateItem = ({text, columns, sx, loc}) => {
    return (
      <GenerateItem columns={columns} text={text} loc={loc}/>
    )
  }

  render() {
    return (
      <Grid container columns={this.state.mapSizeH}>
        {this.generateMap()}
      </Grid>
    );
  }
}

class GenerateItem extends React.Component {
  constructor(props) {
    super(props)
    this.key = Math.random()
  }

  render() {
    return (
      <Grid item xs={this.props.columns || 1}>
        <Typography fontSize={'32px'}>{this.props.text}</Typography>
      </Grid>
    )
  }
}

export default withHooksHOC(MiniframeGame);