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
import DatePicker from 'material-ui/DatePicker';

var fetch = require('node-fetch');

class AvvisoPubblicazione extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state = {
      de : '',
      ufficio : '',
      npratica : '',
      data : '',
      societa : '',
      piva : '',
      sede : '',
      scopo : '',
      periodo : '',
      durata : '',
      localita : '',
      superficie : '',
      via : '',
      _de : '',
      _npratica : '',
      _data : '',
      _societa : '',
      _piva : '',
      _sede : '',
      _scopo : '',
      _periodo : '',
      _durata : '',
      _localita : '',
      _superficie : '',
      _via : ''
    };
  }

  sendModule(){

    //fetch("http://139.162.162.26:8001/avvisopubblicazione?data="+JSON.stringify(obj));
  }

  validateForm(){
    let canSend = true;

    if(this.refs.de.getValue() == ''){
      this.state._de = 'Richiesto!';
      canSend = false;
    }

    if(this.refs.ufficio.getValue() == ''){
      this.state._ufficio = 'Questo campo è richiesto!';
      canSend = false;
    }

    if(this.refs.npratica.getValue() == ''){
      this.state._npratica = 'Questo campo è richiesto!';
      canSend = false;
    }

    if(this.refs.data_pratica.value == ''){
      this.state._data = 'Questo campo è richiesto!';
      canSend = false;
    }

    if(this.refs.societa.getValue() == ''){
      this.state._societa = 'Questo campo è richiesto!';
      canSend = false;
    }

    if(this.refs.piva.getValue() == ''){
      this.state._piva = 'Questo campo è richiesto!';
      canSend = false;
    }

    if(this.refs.sede.getValue() == ''){
      this.state._sede = 'Questo campo è richiesto!';
      canSend = false;
    }

    if(this.refs.scopo.getValue() == ''){
      this.state._scopo = 'Questo campo è richiesto!';
      canSend = false;
    }

    if(this.refs.periodo.getValue() == ''){
      this.state._periodo = 'Questo campo è richiesto!';
      canSend = false;
    }

    if(this.refs.durata.getValue() == ''){
      this.state._durata = 'Questo campo è richiesto!';
      canSend = false;
    }

    if(this.refs.localita.getValue() == ''){
      this.state._localita = 'Questo campo è richiesto!';
      canSend = false;
    }

    if(this.refs.superficie.getValue() == ''){
      this.state._superficie = 'Questo campo è richiesto!';
      canSend = false;
    }

    /*if(this.refs.via.getValue() == ''){
      this.state._via = 'Questo campo è richiesto!';
      canSend = false;
    }*/

    if(!canSend){
      this.setState(this.state);
      return null;
    }else{

      var obj = {
        '1' : this.refs.de.getValue(),
        '2' : this.refs.ufficio.getValue(),
        '3' : this.refs.npratica.getValue(),
        '4' : this.refs.data_pratica.value,
        '5' : this.refs.societa.getValue(),
        '6' : this.refs.piva.getValue(),
        '7' : this.refs.sede.getValue(),
        '8' : this.refs.scopo.getValue(),
        '9' : this.refs.periodo.getValue(),
        '10' : this.refs.durata.getValue(),
        '11' : this.refs.localita.getValue(),
        '12' : this.refs.superficie.getValue(),
        '13' : ''
      };
      return obj;
    }

  }

  textfieldChange(who, v, value){
    let tmp = '_'+who;
    this.state[who] = value;
    this.state[tmp] = '';
    this.setState(this.state);
  }

  render(){
    return(

        <Box column justifyContent="center" alignItems="center" style={{height:'100%'}}>
            <Box column justifyContent="center" alignItems="flex-start">
              <Box justifyContent="flex-start" alignItems="center">
                <p style={{color:'#4A4A4A'}}>Prot. DE</p>
                <TextField
                    id="de"
                    ref="de"
                    hintText = "DE"
                    style={{width:'50px', color:'red', marginLeft:'10px'}}
                    errorText={this.state._de}
                    value={this.state.de}
                    onChange={this.textfieldChange.bind(this, 'de')}
                  /> /
                  <TextField
                      id="npratica"
                      ref="npratica"
                      hintText = "Numero pratica"
                      style={{marginLeft:'10px', width:'130px'}}
                      errorText={this.state._npratica}
                      value={this.state.npratica}
                      onChange={this.textfieldChange.bind(this, 'npratica')}
                    />
              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p style={{color:'#4A4A4A'}}>in data/</p>
                <DatePicker id="data_pratica" ref="data_pratica" hintText="Data" style={{marginLeft:'10px'}}/>
              </Box><br></br>
              <Box column justifyContent="flex-start" alignItems="center">
                <p style={{color:'#4A4A4A'}}>AVVISO DI PUBBLICAZIONE DA AFFIGERSI ALL’ALBO DEL COMUNE, SITO ISTITUZIONALE,UFFICIO MARITTIMO DI</p>
                  <TextField
                      id="ufficio"
                      ref="ufficio"
                      hintText = "Specifica Comune"
                      style={{width:'400px'}}
                      errorText={this.state._ufficio}
                      onChange={this.textfieldChange.bind(this)}
                      value={this.state.ufficio}
                      onChange={this.textfieldChange.bind(this, 'ufficio')}
                    />
                    <p style={{color:'#4A4A4A'}}>Il Responsabile</p>
                    <p style={{textAlign:'center', color:'#4A4A4A'}}>VISTA la direttiva fornita dalla regione Campania con decreto area trasporti e Viabilità n.
          133/2010 in ordine alle pubblicazioni di domande di concessione;
          CONSIDERATO che la citata direttiva prevede, nella fase istruttoria, il completamento
          della procedura anche con la pubblicazione della domanda all’albo della all’albo del
          comune, sito istituzionale, ufficio marittimo e sul burc regione Campania;
          VISTI gli atti di ufficio;</p>
                    <p style={{color:'#4A4A4A'}}>RENDE NOTO</p>
              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p style={{color:'#4A4A4A'}}>che la Società:</p>
                  <TextField
                      id="societa"
                      ref="societa"
                      hintText = "Società"
                      style={{marginLeft:'10px', width:'400px'}}
                      errorText={this.state._societa}
                      value={this.state.societa}
                      onChange={this.textfieldChange.bind(this, 'societa')}
                    />
              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p style={{color:'#4A4A4A'}}>Con Partita IVA</p>
                  <TextField
                      id="piva"
                      ref="piva"
                      hintText = "Partita IVA"
                      style={{marginLeft:'10px', width:'200px', marginRight:'15px'}}
                      errorText={this.state._piva}
                      value={this.state.piva}
                      onChange={this.textfieldChange.bind(this, 'piva')}
                    />
                  <p style={{color:'#4A4A4A'}}> e con sede legale in </p>
                    <TextField
                        id="sede"
                        ref="sede"
                        hintText = "Luogo"
                        style={{marginLeft:'15px', width:'200px'}}
                        errorText={this.state._sede}
                        value={this.state.sede}
                        onChange={this.textfieldChange.bind(this, 'sede')}
                      />
              </Box>
              <br/>
              <Box justifyContent="flex-start" alignItems="flex-start">
              <p style={{color:'#4A4A4A'}}>ha presentato
          Domanda per rilascio/anticipata occupazione per una concessione demaniale marittima del seguente
          tipo:</p>
              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p style={{color:'#4A4A4A'}}>Scopo</p>
                  <TextField
                      id="scopo"
                      ref="scopo"
                      hintText = "Scopo"
                      style={{width:'400px', marginLeft:'15px'}}
                      errorText={this.state._scopo}
                      value={this.state.scopo}
                      onChange={this.textfieldChange.bind(this, 'scopo')}
                    />

              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p style={{color:'#4A4A4A'}}>Periodo</p>
                  <TextField
                      id="periodo"
                      ref="periodo"
                      hintText = "Periodo"
                      style={{width:'400px', marginLeft:'15px'}}
                      errorText={this.state._periodo}
                      value={this.state.periodo}
                      onChange={this.textfieldChange.bind(this, 'periodo')}
                    />

              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p style={{color:'#4A4A4A'}}>Durata</p>
                  <TextField
                      id="durata"
                      ref="durata"
                      hintText = "Durata"
                      style={{width:'400px', marginLeft:'15px'}}
                      errorText={this.state._durata}
                      value={this.state.durata}
                      onChange={this.textfieldChange.bind(this, 'durata')}
                    />
              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p style={{color:'#4A4A4A'}}>Località e dati catastali</p>
                  <TextField
                      id="localita"
                      ref="localita"
                      hintText = "Località e dati catastali"
                      style={{width:'400px', marginLeft:'15px'}}
                      errorText={this.state._localita}
                      value={this.state.localita}
                      onChange={this.textfieldChange.bind(this, 'localita')}
                    />

              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p style={{color:'#4A4A4A'}}>Superficie richiesta: </p>
                  <TextField
                      id="superficie"
                      ref="superficie"
                      hintText = "Superficie"
                      style={{width:'400px', marginLeft:'15px'}}
                      errorText={this.state._superficie}
                      value={this.state.superficie}
                      onChange={this.textfieldChange.bind(this, 'superficie')}
                    />

              </Box>
              <p style={{color:'#4A4A4A'}}>In applicazione del disposto dell’art.18 del Regolamento al Codice della Navigazione
          e successive modificazioni, nonchè ai sensi dell’art. 10 della legge 241/90 invita tutti coloro
          che ritenessero di avervi interesse a presentare per iscritto al comune entro 20 giorni dalla
          data di affissione all’albo quelle osservazioni che ritenessero opportune a tutela dei loro
          eventuali diritti, con l’avvertenza che, trascorso il termine stabilito, si darà ulteriore corso
          alle pratiche inerenti alla richiesta, a conclusione del procedimento istruttorio avviato.
          Il predetto termine di Venti giorni vale anche ai fini della presentazione di domande
          concorrenti.</p>
            </Box>
        </Box>
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

export default AvvisoPubblicazione;
