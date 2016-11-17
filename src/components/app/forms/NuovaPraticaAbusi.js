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
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import Attach from 'material-ui/svg-icons/editor/attach-file';
import Compile from 'material-ui/svg-icons/action/assignment';
import Calculate from 'material-ui/svg-icons/hardware/keyboard';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import { browserHistory } from 'react-router';

class NuovaPraticaAbusi extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state = {
        value : 1,
        nPratica : '',
        date : '',
        surname : '',
        name : '',
        cf : '',
        uso : ''
    }
    global.greatObject.entity = {};
  }

  onSubmit(){
    let _nPratica = '', _date = '', _surname = '', _name = '', _cf = '', _uso = '';

    if(this.refs.npratica.getValue() == ''){
      _nPratica = 'Questo campo è richiesto!';
    }
    if(this.refs.date.value == ''){
      _date = 'Questo campo è richiesto!'
    }
    if(this.refs.surname.getValue() == ''){
      _surname = 'Questo campo è richiesto!'
    }
    if(this.refs.name.getValue() == ''){
      _name = 'Questo campo è richiesto!'
    }
    if(this.refs.cf.getValue() == ''){
      _cf = 'Questo campo è richiesto!'
    }
    if(this.refs.uso.getValue() == ''){
      _uso = 'Questo campo è richiesto!'
    }
    if( _nPratica == '' && _date == '' && _surname == '' && _name == '' && _cf == '' && _uso == ''){
      this.setState({
          ...this.state,
          nPratica : _nPratica,
          date : _date,
          surname : _surname,
          name : _name,
          cf : _cf,
          uso : _uso
      });

      greatObject.entity.nPratica = _nPratica;
      greatObject.entity.date = _date;
      greatObject.entity.surname = _surname;
      greatObject.entity.name = _name;
      greatObject.entity.cf = _cf;
      greatObject.entity.uso = _uso;

      switch(this.state.value){
        case 1:
          browserHistory.push('d1handler/'+this.refs.npratica.getValue());
        break;
        case 2:
          browserHistory.push('d2handler/k');
        break;
        case 3:
          browserHistory.push('d3handler/k');
          //081 519 8152
        break;
        case 4:
          alert("Not implemented yet");
        break;
        case 5:
          alert("Not implemented yet");
        break;
        case 6:
          alert("Not implemented yet");
        break;
      }
    }

  }

  handleChange(event, index, value){
    this.setState({
      ...this.state,
      value : value
    })
  }

  render(){
    return(
      <MuiThemeProvider muiTheme={lightBaseTheme} >
        <Box column justifyContent="center" alignItems="center" style={{height:'100%'}}>
          <Paper zDepth={1} style={styles.paper}>
            <h3 style={{textAlign:'center', width : '100%'}}>Inserimento nuova pratica Abusi</h3>
            <Box justifyContent="center" alignItems="center">
              <div style={{width:'30%', height : '1px', backgroundColor : '#4CA7D0'}}></div>
            </Box>
            <Box column justifyContent="center" alignItems="flex-start" style={{marginTop:'20px', marginLeft:'20px'}}>
              <Box justifyContent="flex-start" alignItems="center">
                <p style={{marginTop:'30px'}}><span>Numero Pratica:</span></p>
                <TextField
                    id="npratica"
                    ref="npratica"
                    hintText = "Inserisci il numero della pratica"
                    style={{marginLeft:'30px'}}
                    errorText={this.state.nPratica}
                  />
              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p style={{marginTop:'30px'}}>Avviso Ingiunzione:</p>
                <FlatButton label="Carica File" labelStyle={{color:'#0BA1DA'}} style={{marginLeft:'10px', marginTop : '10px'}} icon={<Attach/>}/>
                <CheckIcon style={{marginTop : '11px', marginLeft : '5px'}} color="#979797"/>
                <FlatButton label="Compila Modulo" labelStyle={{color:'#0BA1DA'}} style={{marginLeft:'30px', marginTop : '10px'}} icon={<Compile/>}/>
                <CheckIcon style={{marginTop : '11px', marginLeft : '5px'}} color="#979797"/>
              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p style={{marginTop:'30px'}}>Ingiunzione:</p>
                <FlatButton label="Carica File" labelStyle={{color:'#0BA1DA'}} style={{marginLeft:'10px', marginTop : '10px'}} icon={<Attach/>}/>
                <CheckIcon style={{marginTop : '11px', marginLeft : '5px'}} color="#979797"/>
                <FlatButton label="Compila Modulo" labelStyle={{color:'#0BA1DA'}} style={{marginLeft:'30px', marginTop : '10px'}} icon={<Compile/>}/>
                <CheckIcon style={{marginTop : '11px', marginLeft : '5px'}} color="#979797"/>
              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p style={{marginTop:'30px'}}>Primo Avviso per recupero Indennità:</p>
                <FlatButton label="Calcola Indennità" labelStyle={{color:'#0BA1DA'}} style={{marginLeft:'10px', marginTop : '10px'}} icon={<Calculate/>}/>
                <CheckIcon style={{marginTop : '11px', marginLeft : '5px'}} color="#979797"/>
                <FlatButton label="Carica File" labelStyle={{color:'#0BA1DA'}} style={{marginLeft:'30px', marginTop : '10px'}} icon={<Attach/>}/>
                <CheckIcon style={{marginTop : '11px', marginLeft : '5px'}} color="#979797"/>
                <FlatButton label="Compila Modulo" labelStyle={{color:'#0BA1DA'}} style={{marginLeft:'30px', marginTop : '10px'}} icon={<Compile/>}/>
                <CheckIcon style={{marginTop : '11px', marginLeft : '5px'}} color="#979797"/>
              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p style={{marginTop:'30px'}}>Secondo Avviso per recupero Indennità:</p>
                <FlatButton label="Calcola Indennità" labelStyle={{color:'#0BA1DA'}} style={{marginLeft:'10px', marginTop : '10px'}} icon={<Calculate/>}/>
                <CheckIcon style={{marginTop : '11px', marginLeft : '5px'}} color="#979797"/>
                <FlatButton label="Carica File" labelStyle={{color:'#0BA1DA'}} style={{marginLeft:'30px', marginTop : '10px'}} icon={<Attach/>}/>
                <CheckIcon style={{marginTop : '11px', marginLeft : '5px'}} color="#979797"/>
                <FlatButton label="Compila Modulo" labelStyle={{color:'#0BA1DA'}} style={{marginLeft:'30px', marginTop : '10px'}} icon={<Compile/>}/>
                <CheckIcon style={{marginTop : '11px', marginLeft : '5px'}} color="#979797"/>
              </Box>
              <Box justifyContent="flex-start" alignItems="center" style={{marginBottom:'40px'}}>
                <p style={{marginTop:'30px'}}>Trasmissione all'agenzia del Demanio:</p>
                <FlatButton label="Carica File" labelStyle={{color:'#0BA1DA'}} style={{marginLeft:'10px', marginTop : '10px'}} icon={<Attach/>}/>
                <CheckIcon style={{marginTop : '11px', marginLeft : '5px'}} color="#979797"/>
                <FlatButton label="Compila Modulo" labelStyle={{color:'#0BA1DA'}} style={{marginLeft:'30px', marginTop : '10px'}} icon={<Compile/>}/>
                <CheckIcon style={{marginTop : '11px', marginLeft : '5px'}} color="#979797"/>
              </Box>
            </Box>
          </Paper>
          <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'20px'}}>
            <RaisedButton label="Annulla" primary={false} labelStyle={{color:'#FFFFFF'}} />
            <RaisedButton label="Procedi" primary={true} labelStyle={{color:'#FFFFFF'}} style={{marginLeft:'20px'}} onClick={this.onSubmit.bind(this)}/>
          </Box>
        </Box>
      </MuiThemeProvider>
    );
  }
}

const styles = {
  paper : {
    margin : '10px',
    marginTop : '20px',
    width : 'inherit',
    minWidth : '100%',
    minHeight : '450px',
    height : 'auto'
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

export default NuovaPraticaAbusi;
