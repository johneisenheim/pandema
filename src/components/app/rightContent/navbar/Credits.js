import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper';

import {
lightBlue200, lightBlueA100,lightBlue300,
grey100, grey300, grey400, grey500, grey700,grey900,blue700,
pinkA200,
white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

import Box from 'react-layout-components';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import AutoComplete from 'material-ui/AutoComplete';
import Mailto from 'react-mailto';
import PandemaLogo from '../../../../../static/pandemalogo.png';



import { browserHistory } from 'react-router';
import $ from 'jquery';

class Credits extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      opened : false
    }
  }

  componentDidMount(){
    var _self = this;
  }

  openModal(v){
    this.setState({
      ...this.state,
      opened : true
    });
  }

  handleModalButtonClose(){
    this.setState({
      ...this.state,
      opened : false
    })
  }

  handleModalButtonSubmit(){
    this.setState({
      opened : false
    })
  }

  handleModalClose(){}

  //59C2E6

  render (){
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={false}
        onTouchTap={this.handleModalButtonSubmit.bind(this)}
        labelStyle={{color : '#4988A9'}}
      />
    ];

    return (
      <MuiThemeProvider muiTheme={lightBaseTheme} >
        <Dialog
            title={'Credits'}
            actions={actions}
            modal={true}
            open={this.state.opened}
            onRequestClose={this.handleModalClose.bind(this)}
            autoScrollBodyContent={true}
            autoDetectWindowHeight={true}
            contentStyle={{width : '37%', maxWidth : 'none', height : '100%', maxHeight : 'none'}}
            titleStyle={{color:'#4988A9', textAlign:'center'}}
          >
          <Box column alignItems="center" justifyContent="center">
            <Box alignItems="center" justifyContent="center">
              <Box alignItems="center" justifyContent="center" style={{backgroundColor:'#FFFFFF', width : '120px', height:'120px', borderRadius:'60px',marginTop:'20px'}}>
                <img src={PandemaLogo} style={{width:'110px', height:'110px', borderRadius:'60px'}}/>
              </Box>
            </Box>
            <p style={{textAlign : 'center', fontSize : '14px', color : '#666666'}}>Pandema è stato sviluppato da Nello Saulino, per conto della società Talassa s.r.l.</p>
            <p style={{textAlign : 'center', fontSize : '14px', color : '#666666'}}>Per qualsiasi malfunzionamento riscontrato, puoi inviare una mail tramite il link sottostante.</p>
             <Mailto email="nello.saulino@gmail.com" obfuscate={true}>
               Invia richiesta di intervento
             </Mailto>
            <p style={{textAlign : 'center', fontSize : '14px', color : '#666666'}}>O puoi chiamare il numero <i>+393207628440</i></p>
           </Box>
        </Dialog>
      </MuiThemeProvider>
    )
  }

}

const lightBaseTheme = getMuiTheme({
  spacing: {
    iconSize: 24,
    desktopGutter: 24,
    desktopGutterMore: 32,
    desktopGutterLess: 16,
    desktopGutterMini: 8,
    desktopKeylineIncrement: 64,
    desktopDropDownMenuItemHeight: 32,
    desktopDropDownMenuFontSize: 15,
    desktopDrawerMenuItemHeight: 48,
    desktopSubheaderHeight: 48,
    desktopToolbarHeight: 56,
  },
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: '#59C2E6',
    primary2Color: lightBlue200,
    primary3Color: lightBlue300,
    accent1Color: '#59C2E6',
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: grey700,
    alternateTextColor: '#666666',
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: '#59C2E6',
    clockCircleColor: fade('#E6E7EB', 0.07),
    shadowColor: grey900,
  },
},{
  userAgent : false
});

export default Credits;
