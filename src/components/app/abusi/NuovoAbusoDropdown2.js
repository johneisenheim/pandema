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


import { browserHistory } from 'react-router';
import $ from 'jquery';

class NuovoAbusoDropDown2 extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      opened : false,
      errorText : '',
      text : '',
      isLoading : false,
      data : []
    }
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'getDInfosForAbusi',
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log('getDInfosForAbusi');
          console.log(parsed);
          var toPush = [];
          for( var i = 0; i < parsed.results.length; i++ ){
            toPush.push(parsed.results[i].pandema_id);
          }
          /*toPush.push('carrot');
          toPush.push('banana');
          toPush.push('apple');
          toPush.push('orange');*/
          _self.setState({
            ..._self.state,
            isLoading : false,
            data : toPush
          });
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });
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
        url: constants.DB_ADDR+'addNewAbusoCodNav?pid='+escape(_self.refs.nabuso.getValue())+'&comune_id='+1,
        processData: false,
        contentType: false,
        success: function(data) {
          _self.setState({
            ..._self.state,
            isLoading : false,
            opened : false
          });
          //vai a quello nuovo
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });
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
        disabled={this.state.data.length == 0}
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
            <p>Per creare un nuovo abuso in aree in concessione, inserisci il numero di pratica della pratica Dx associata:</p>
            <Box style={{marginTop:'20px', width : '100%'}} alignItems="center" justifyContent="center">
            <AutoComplete
              floatingLabelText="Inserisci il numero di pratica per l'autocompletamento..."
              filter={AutoComplete.caseInsensitiveFilter}
              dataSource={this.state.data}
              maxSearchResults={10}
              fullWidth={true}
              disabled={this.state.data.length == 0}
            />
            </Box>
            {this.state.data.length == 0
              ?
               <p style={{fontSize:'13px'}}>*Non ci sono pratiche inserite a cui poter fare riferimento per gli abusi.</p>
              :
              null
            }
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

export default NuovoAbusoDropDown2;