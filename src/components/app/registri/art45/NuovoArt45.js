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

class NuovoArt45 extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state = {
        value : 1,
        nordine : '',
        richiedente : '',
        protocollo_richiesta : '',
        causale_autorizzazione : '',
        atto_concessione_subentro : '',
        num_atto_rilascio : '',
        pratica_concessione_riferimento : '',
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
    var _nordine = '',
    _richiedente = '',
    _protocollo_richiesta = '',
    _causale_autorizzazione = '',
    _atto_concessione_subentro = '',
    _num_atto_rilascio = '',
    _pratica_concessione_riferimento = '';

    if(this.refs.nordine.getValue() == ''){
      _nordine = 'Questo campo è richiesto!';
    }
    if(this.refs.richiedente.getValue() == ''){
      _richiedente = 'Questo campo è richiesto!'
    }
    if(this.refs.protocollo_richiesta.getValue() == ''){
      _protocollo_richiesta = 'Questo campo è richiesto!'
    }
    if(this.refs.causale_autorizzazione.getValue() == ''){
      _causale_autorizzazione = 'Questo campo è richiesto!'
    }
    if(this.refs.atto_concessione_subentro.getValue() == ''){
      _atto_concessione_subentro = 'Questo campo è richiesto!'
    }
    if(this.refs.num_atto_rilascio.getValue() == ''){
      _num_atto_rilascio = 'Questo campo è richiesto!'
    }
    if(this.refs.pratica_concessione_riferimento.getValue() == ''){
      _pratica_concessione_riferimento = 'Questo campo è richiesto!'
    }

    if(this.refs.date.state == undefined){
      alert("Per favore, seleziona la Data");
      return;
    }

    if(this.refs.date_rilascio_atto.state == undefined){
      alert("Per favore, seleziona la Data di Rilascio");
      return;
    }

    if( _nordine == '' && _richiedente == '' && _protocollo_richiesta == '' && _causale_autorizzazione == '' && _atto_concessione_subentro == '' && _num_atto_rilascio == '' && _pratica_concessione_riferimento == ''){
      this.setState({
          ...this.state,
          nordine : _nordine,
          richiedente : _richiedente,
          protocollo_richiesta : _protocollo_richiesta,
          causale_autorizzazione : _causale_autorizzazione,
          atto_concessione_subentro : _atto_concessione_subentro,
          num_atto_rilascio : _num_atto_rilascio,
          pratica_concessione_riferimento : _pratica_concessione_riferimento
      });

      toggleLoader.emit('toggleLoader');
      $.ajax({
          type: 'POST',
          data: JSON.stringify({comune_id: 1, nordine : this.refs.nordine.getValue(), richiedente : this.refs.richiedente.getValue(), protocollo_richiesta : this.refs.protocollo_richiesta.getValue(), causale_autorizzazione: this.refs.causale_autorizzazione.getValue(), atto_concessione_subentro : this.refs.atto_concessione_subentro.getValue(), num_atto_rilascio: this.refs.num_atto_rilascio.getValue(), pratica_concessione_riferimento: this.refs.pratica_concessione_riferimento.getValue(), data_richiesta : new Date(this.refs.date.state.date), data_atto_rilascio : new Date(this.refs.date_rilascio.state.date)}),
          url: constants.DB_ADDR+'addNewArt45Registry',
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
              <h3 style={{textAlign:'center', width : '100%'}}>Inserimento in Registro Istruttorie per Autorizzazioni per Subingresso(ex art.55)</h3>
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
                  <DatePicker hintText="Data Richiesta" id="date" style={{marginLeft:'30px', color:'#FFFFFF'}} ref="date"/>
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
                  <p style={{marginTop:'30px'}}><span>Causale Autorizzazione:</span></p>
                  <TextField
                      id="causale_autorizzazione"
                      hintText = "Inserisci la Causale Autorizzazione"
                      style={{marginLeft:'30px'}}
                      ref="causale_autorizzazione"
                      errorText={this.state.causale_autorizzazione}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p>Data:</p>
                  <DatePicker hintText="Data Rilascio" id="date_rilascio" style={{marginLeft:'30px', color:'#FFFFFF'}} ref="date_rilascio"/>
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Atto di Concessione Subentro:</span></p>
                  <TextField
                      id="atto_concessione_subentro"
                      hintText = "Inserisci l'Atto di Concessione Subentro"
                      style={{marginLeft:'30px'}}
                      ref="atto_concessione_subentro"
                      errorText={this.state.atto_concessione_subentro}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p>Data Rilascio Atto:</p>
                  <DatePicker hintText="Data Rilascio Atto" id="date_rilascio_atto" style={{marginLeft:'30px', color:'#FFFFFF'}} ref="date_rilascio_atto"/>
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Numero Atto Rilascio:</span></p>
                  <TextField
                      id="num_atto_rilascio"
                      hintText = "Inserisci il Numero Atto Rilascio"
                      style={{marginLeft:'30px'}}
                      ref="num_atto_rilascio"
                      errorText={this.state.num_atto_rilascio}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Pratica Concessione di Riferimento:</span></p>
                  <TextField
                      id="pratica_concessione_riferimento"
                      hintText = "Inserisci la Pratica Concessione di Riferimento"
                      style={{marginLeft:'30px'}}
                      ref="pratica_concessione_riferimento"
                      errorText={this.state.pratica_concessione_riferimento}
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

export default NuovoArt45;
