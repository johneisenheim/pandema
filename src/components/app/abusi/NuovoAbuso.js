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


import { browserHistory } from 'react-router';
import $ from 'jquery';

class NuovoAbuso extends React.Component{

  constructor(props, context) {
    super(props, context);
    /*if(greatObject.entity.name === undefined)
      browserHistory.push('/nuovapratica');*/
    global.greatObject.d1 = {};
    this.state = {
      opened : false,
      errorText : '',
      text : '',
      isLoading : false
    }
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
    var _self = this;
    if(this.refs.nabuso.getValue() === ''){
      this.setState({
        ...this.state,
        errorText : 'Questo campo è richiesto!'
      });

      return;
    }
    this.setState({
      ...this.state,
      isLoading : true
    })
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'addNewAbusoGenerico?pid='+escape(_self.refs.nabuso.getValue())+'&comune_id='+1,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.setState({
            ..._self.state,
            isLoading : false,
            opened : false
          });
          var link = '/handlegestioneabusi/'+parsed.id+'/'+_self.state.text;
          browserHistory.push(link);
          //vai a quello nuovo
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });
  }

  onChangeText(e,v){
    this.setState({
      ...this.state,
      text : v
    })
  }

  handleModalClose(){}

  render (){
    const actions = [
      <FlatButton
        label="Annulla"
        primary={true}
        onTouchTap={this.handleModalButtonClose.bind(this)}
        labelStyle={{color : '#4A4A4A'}}
      />,
      <FlatButton
        label="Aggiungi"
        primary={true}
        keyboardFocused={false}
        onTouchTap={this.handleModalButtonSubmit.bind(this)}
        labelStyle={{color : '#4988A9'}}
      />
    ];

    return (
      <MuiThemeProvider muiTheme={lightBaseTheme} >
        <Dialog
            title={'Nuovo Abuso Generico'}
            actions={actions}
            modal={true}
            open={this.state.opened}
            onRequestClose={this.handleModalClose.bind(this)}
            autoScrollBodyContent={true}
            autoDetectWindowHeight={true}
            contentStyle={{width : '80%', maxWidth : 'none', height : '100%', maxHeight : 'none'}}
            titleStyle={{color:'#4988A9', textAlign:'center'}}
          >
          {!this.state.isLoading ?
          <div>
            <p>Per creare un nuovo abuso generico, inserisci il numero di pratica che lo identifica:</p>
            <Box style={{marginTop:'20px', width : '100%'}} alignItems="center" justifyContent="center">
              <TextField
                  id="nabuso"
                  ref="nabuso"
                  hintText = "Numero della pratica di abuso"
                  style={{width:'30%'}}
                  errorText={this.state.errorText}
                  value={this.state.text}
                  onChange={this.onChangeText.bind(this)}
                />
            </Box>
          </div>
          :
          <Box alignItems="center" justifyContent="center" style={{width:'100%', height : '300px'}}>
            <CircularProgress size={30}/>
          </Box>
          }
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

export default NuovoAbuso;
