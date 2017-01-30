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

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import { browserHistory } from 'react-router';

import CircularProgress from 'material-ui/CircularProgress';
import $ from 'jquery';
import IntlPolyfill from 'intl';
var DateTimeFormat = IntlPolyfill.DateTimeFormat;
require('intl/locale-data/jsonp/it');
require('intl/locale-data/jsonp/it-IT');

class NuovoGenerico extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state = {
        value : 1,
        nordine : '',
        concessionario : '',
        localita : '',
        superficie : '',
        scopo : '',
        durata : '',
        quietanza : '',
        pertinenza : '',
        annotazioni : '',
        canone :'',
        isLoading : false,
        usoscopo : null,
        usoscopovalue : 0
    }

  }

  componentDidMount(){
    var _self = this;

  }

  onSubmit(){
    var _self = this;
    let _nordine = '', _concessionario = '', _localita = '', _superficie = '', _scopo = '', _durata = '', _quietanza = '', _pertinenza = '', _annotazioni = '', _canone ='';

    if(this.refs.nordine.getValue() == ''){
      _nordine = 'Questo campo è richiesto!';
    }
    if(this.refs.concessionario.getValue() == ''){
      _concessionario = 'Questo campo è richiesto!'
    }
    if(this.refs.localita.getValue() == ''){
      _localita = 'Questo campo è richiesto!'
    }
    if(this.refs.superficie.getValue() == ''){
      _superficie = 'Questo campo è richiesto!'
    }
    if(this.refs.scopo.getValue() == ''){
      _scopo = 'Questo campo è richiesto!'
    }
    if(this.refs.durata.getValue() == ''){
      _durata = 'Questo campo è richiesto!'
    }
    if(this.refs.quietanza.getValue() == ''){
      _quietanza = 'Questo campo è richiesto!'
    }
    if(this.refs.canone.getValue() == ''){
      _canone = 'Questo campo è richiesto!'
    }
    if(this.refs.pertinenza.getValue() == ''){
      _pertinenza = 'Questo campo è richiesto!'
    }

    if(this.refs.date.state == undefined){
      alert("Per favore, seleziona la Data");
      return;
    }

    if(this.refs.scadenza.state == undefined){
      alert("Per favore, seleziona la Scadenza");
      return;
    }

    if( _nordine == '' && _concessionario == '' && _localita == '' && _superficie == '' && _scopo == '' && _durata == '' && _quietanza == '' && _pertinenza == ''&& _canone == ''){
      this.setState({
          ...this.state,
          nordine : _nordine,
          concessionario : _concessionario,
          localita : _localita,
          superficie : _superficie,
          scopo : _scopo,
          durata : _durata,
          quietanza : _quietanza,
          pertinenza : _pertinenza,
          canone : _canone
      });
      toggleLoader.emit('toggleLoader');
      $.ajax({
          type: 'POST',
          data: JSON.stringify({comune_id: 1, nordine : this.refs.nordine.getValue(), concessionario : this.refs.concessionario.getValue(), localita : this.refs.localita.getValue(), superficie: this.refs.superficie.getValue(), scopo : this.refs.scopo.getValue(), durata:this.refs.durata.getValue(), quietanza: this.refs.quietanza.getValue(), canone: this.refs.canone.getValue(), pertinenza: this.refs.pertinenza.getValue(), annotazioni : this.refs.annotazioni.getValue(), data : new Date(this.refs.date.state.date), scadenza  : new Date(this.refs.scadenza.state.date)}),
          url: constants.DB_ADDR+'addNewGeneralRegistry',
          processData: false,
          contentType: 'application/json',
          success: function(data) {
            toggleLoader.emit('toggleLoader');
            browserHistory.push('/registri');
          },
          error : function(err){
            alert("Errore : "+ JSON.stringify(err));
            ;
            toggleLoader.emit('toggleLoader');
          }
      });
    }

  }

  handleChange(event, index, value){
    this.setState({
      ...this.state,
      value : value
    })
  }

  handleChangeUso(event, index, value){
    this.setState({
      ...this.state,
      usoscopovalue : value
    })
  }

  render(){
    var usoscopo = [];
    if( this.state.usoscopo !== null){
      for(var i = 0; i < this.state.usoscopo.length; i++ ){
        usoscopo.push(
          <MenuItem key={i} value={this.state.usoscopo[i].id} primaryText={this.state.usoscopo[i].descrizione_com} />
        );
      }
    }
    if(this.state.isLoading){
      return (
        <Box alignItems="center" justifyContent="center" style={{width:'100%', height : '300px'}}>
          <CircularProgress size={30}/>
        </Box>
      );
    }else{
      return(
        <MuiThemeProvider muiTheme={lightBaseTheme} >
          <Box column justifyContent="center" alignItems="center" style={{height:'100%', width : '100%'}}>
            <Paper zDepth={1} style={styles.paper}>
              <h3 style={{textAlign:'center', width : '100%'}}>Inserimento in registro Generico</h3>
              <Box justifyContent="center" alignItems="center">
                <div style={{width:'30%', height : '1px', backgroundColor : '#4CA7D0'}}></div>
              </Box>
              <Box column justifyContent="center" alignItems="flex-start" style={{marginTop:'20px', marginLeft:'20px'}}>
                <Box justifyContent="flex-start" alignItems="center">
                  <p style={{marginTop:'30px'}}><span>Numero Ordine:</span></p>
                  <TextField
                      id="nordine"
                      ref="nordine"
                      hintText = "Inserisci il Numero Ordine"
                      style={{marginLeft:'30px'}}
                      errorText={this.state.nordine}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center">
                  <p style={{marginTop:'30px'}}>Concessionario:</p>
                  <TextField
                      id="concessionario"
                      ref="concessionario"
                      hintText = "Inserisci il Concessionario"
                      style={{marginLeft:'30px'}}
                      errorText={this.state.concessionario}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p>Data:</p>
                  <DatePicker hintText="Data" id="date" style={{marginLeft:'30px', color:'#FFFFFF'}} ref="date" DateTimeFormat={DateTimeFormat} cancelLabel="Annulla"/>
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Località:</span></p>
                  <TextField
                      id="localita"
                      hintText = "Inserisci la Località"
                      style={{marginLeft:'30px'}}
                      ref="localita"
                      errorText={this.state.localita}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Superficie:</span></p>
                  <TextField
                      id="superficie"
                      hintText = "Inserisci la Superficie"
                      style={{marginLeft:'30px'}}
                      ref="superficie"
                      errorText={this.state.superficie}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Scopo:</span></p>
                  <TextField
                      id="scopo"
                      hintText = "Inserisci lo Scopo"
                      style={{marginLeft:'30px'}}
                      ref="scopo"
                      errorText={this.state.scopo}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Durata mesi:</span></p>
                  <TextField
                      id="durata"
                      hintText = "Inserisci la Durata"
                      style={{marginLeft:'30px'}}
                      ref="durata"
                      errorText={this.state.durata}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p>Scadenza:</p>
                  <DatePicker hintText="Data" id="scadenza" style={{marginLeft:'30px', color:'#FFFFFF'}} ref="scadenza" DateTimeFormat={DateTimeFormat} cancelLabel="Annulla"/>
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Canone:</span></p>
                  <TextField
                      id="canone"
                      hintText = "Inserisci il Canone"
                      style={{marginLeft:'30px'}}
                      ref="canone"
                      errorText={this.state.canone}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Quietanza:</span></p>
                  <TextField
                      id="quietanza"
                      hintText = "Inserisci la Quietanza"
                      style={{marginLeft:'30px'}}
                      ref="quietanza"
                      errorText={this.state.quietanza}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Pertinenza:</span></p>
                  <TextField
                      id="pertinenza"
                      hintText = "Inserisci la Pertinenza"
                      style={{marginLeft:'30px'}}
                      ref="pertinenza"
                      errorText={this.state.pertinenza}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px', marginBottom:'20px'}}>
                  <p style={{marginTop:'30px'}}><span>Annotazioni:</span></p>
                  <TextField
                      id="annotazioni"
                      hintText = "Inserisci le Annotazioni"
                      style={{marginLeft:'30px'}}
                      ref="annotazioni"
                      errorText={this.state.annotazioni}
                    />
                </Box>
              </Box>
            </Paper>
            <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'20px', marginBottom:'30px'}}>
              <RaisedButton label="Annulla" primary={false} labelStyle={{color:'#FFFFFF'}} />
              <RaisedButton label="Inserisci" primary={true} labelStyle={{color:'#FFFFFF'}} style={{marginLeft:'20px'}} onClick={this.onSubmit.bind(this)}/>
            </Box>
          </Box>
        </MuiThemeProvider>
      );
    }
  }
}

const styles = {
  paper : {
    margin : '10px',
    marginTop : '20px',
    width : '70%',
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

export default NuovoGenerico;
