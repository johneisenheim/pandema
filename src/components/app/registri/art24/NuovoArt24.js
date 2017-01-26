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

class NuovoArt24 extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state = {
        value : 1,
        nordine : '',
        richiedente : '',
        protocollo_richiesta : '',
        area_coperta : '',
        scopo : '',
        area_scoperta : '',
        codice_comune : '',
        sezione : '',
        annotazioni : '',
        volumetria :'',
        foglio : '',
        particella : '',
        subalterni : '',
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
    let _nordine = '', _richiedente = '', _protocollo_richiesta = '', _area_coperta = '', _scopo = '', _area_scoperta = '', _quietanza = '', _sezione = '', _annotazioni = '', _volumetria ='', _foglio = '', _particella = '', _subalterni = '', _codice_comune = '';

    if(this.refs.nordine.getValue() == ''){
      _nordine = 'Questo campo è richiesto!';
    }
    if(this.refs.richiedente.getValue() == ''){
      _richiedente = 'Questo campo è richiesto!'
    }
    if(this.refs.protocollo_richiesta.getValue() == ''){
      _protocollo_richiesta = 'Questo campo è richiesto!'
    }
    if(this.refs.area_coperta.getValue() == ''){
      _area_coperta = 'Questo campo è richiesto!'
    }
    if(this.refs.scopo.getValue() == ''){
      _scopo = 'Questo campo è richiesto!'
    }
    if(this.refs.area_scoperta.getValue() == ''){
      _area_scoperta = 'Questo campo è richiesto!'
    }
    if(this.refs.codice_comune.getValue() == ''){
      _codice_comune = 'Questo campo è richiesto!'
    }
    if(this.refs.volumetria.getValue() == ''){
      _canone = 'Questo campo è richiesto!'
    }
    if(this.refs.sezione.getValue() == ''){
      _sezione = 'Questo campo è richiesto!'
    }
    if(this.refs.foglio.getValue() == ''){
      _foglio = 'Questo campo è richiesto!'
    }
    if(this.refs.particella.getValue() == ''){
      _particella = 'Questo campo è richiesto!'
    }
    if(this.refs.subalterni.getValue() == ''){
      _subalterni = 'Questo campo è richiesto!'
    }



    if(this.refs.date.state == undefined){
      alert("Per favore, seleziona la Data");
      return;
    }

    if( _nordine == '' && _richiedente == '' && _protocollo_richiesta == '' && _area_coperta == '' && _scopo == '' && _area_scoperta == '' && _codice_comune == '' && _sezione == ''&& _volumetria == '' && _foglio =='' && _particella =='' && _subalterni==''){
      this.setState({
          ...this.state,
          nordine : _nordine,
          richiedente : _richiedente,
          protocollo_richiesta : _protocollo_richiesta,
          area_coperta : _area_coperta,
          scopo : _scopo,
          area_scoperta : _area_scoperta,
          codice_comune : _codice_comune,
          sezione : _sezione,
          volumetria : _volumetria,
          particella : _particella,
          subalterni : _subalterni,
          foglio : _foglio
      });
      toggleLoader.emit('toggleLoader');
      $.ajax({
          type: 'POST',
          data: JSON.stringify({comune_id: 1, nordine : this.refs.nordine.getValue(), richiedente : this.refs.richiedente.getValue(), protocollo_richiesta : this.refs.protocollo_richiesta.getValue(), area_coperta: this.refs.area_coperta.getValue(), scopo : this.refs.scopo.getValue(), area_scoperta:this.refs.area_scoperta.getValue(), codice_comune: this.refs.codice_comune.getValue(), volumetria: this.refs.volumetria.getValue(), sezione: this.refs.sezione.getValue(), annotazioni : this.refs.annotazioni.getValue(), foglio : this.refs.foglio.getValue(), particella : this.refs.particella.getValue(),  subalterni : this.refs.subalterni.getValue(), data : new Date(this.refs.date.state.date)}),
          url: constants.DB_ADDR+'addNewArt24Registry',
          processData: false,
          contentType: 'application/json',
          success: function(data) {
            toggleLoader.emit('toggleLoader');
            browserHistory.push('/registri');
          },
          error : function(err){
            alert('Errore : '+err);
            console.log(err);
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
              <h3 style={{textAlign:'center', width : '100%'}}>Inserimento in Registro ex art.24</h3>
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
                  <p style={{marginTop:'30px'}}>Richiedente:</p>
                  <TextField
                      id="richiedente"
                      ref="richiedente"
                      hintText = "Inserisci il Richiedente"
                      style={{marginLeft:'30px'}}
                      errorText={this.state.richiedente}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p>Data:</p>
                  <DatePicker hintText="Data Richiesta" id="date" style={{marginLeft:'30px', color:'#FFFFFF'}} ref="date"  DateTimeFormat={DateTimeFormat} cancelLabel="Annulla"/>
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Protocollo Richiesta:</span></p>
                  <TextField
                      id="protocollo_richiesta"
                      hintText = "Inserisci il Protocollo Richiesta"
                      style={{marginLeft:'30px'}}
                      ref="protocollo_richiesta"
                      errorText={this.state.protocollo_richiesta}
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
                  <p style={{marginTop:'30px'}}><span>Area Coperta:</span></p>
                  <TextField
                      id="area_coperta"
                      hintText = "Inserisci l'Area Coperta'"
                      style={{marginLeft:'30px'}}
                      ref="area_coperta"
                      errorText={this.state.area_coperta}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Area Scoperta:</span></p>
                  <TextField
                      id="area_scoperta"
                      hintText = "Inserisci l'Area Scoperta"
                      style={{marginLeft:'30px'}}
                      ref="area_scoperta"
                      errorText={this.state.area_scoperta}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Volumetria:</span></p>
                  <TextField
                      id="volumetria"
                      hintText = "Inserisci la Volumetria"
                      style={{marginLeft:'30px'}}
                      ref="volumetria"
                      errorText={this.state.volumetria}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Codice Comune:</span></p>
                  <TextField
                      id="codice_comune"
                      hintText = "Inserisci il Codice Comune"
                      style={{marginLeft:'30px'}}
                      ref="codice_comune"
                      errorText={this.state.codice_comune}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Sezione:</span></p>
                  <TextField
                      id="sezione"
                      hintText = "Inserisci la Sezione"
                      style={{marginLeft:'30px'}}
                      ref="sezione"
                      errorText={this.state.sezione}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Foglio:</span></p>
                  <TextField
                      id="foglio"
                      hintText = "Inserisci il Foglio"
                      style={{marginLeft:'30px'}}
                      ref="foglio"
                      errorText={this.state.foglio}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Particella:</span></p>
                  <TextField
                      id="particella"
                      hintText = "Inserisci la Particella"
                      style={{marginLeft:'30px'}}
                      ref="particella"
                      errorText={this.state.particella}
                    />
                </Box>


                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Subalterni:</span></p>
                  <TextField
                      id="subalterni"
                      hintText = "Inserisci Subalterni"
                      style={{marginLeft:'30px'}}
                      ref="subalterni"
                      errorText={this.state.subalterni}
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

export default NuovoArt24;
