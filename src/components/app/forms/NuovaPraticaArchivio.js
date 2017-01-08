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

class NuovaPraticaArchivio extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state = {
        value : 1,
        nPratica : '',
        date : '',
        surname : '',
        name : '',
        cf : '',
        uso : '',
        isLoading : true,
        usoscopo : null,
        usoscopovalue : 0
    }
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        url: constants.DB_ADDR+'getusoscopo',
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.setState({
              ..._self.state,
              usoscopo : parsed,
              usoscopovalue : parsed[0].id,
              isLoading : false
          });
        },
        error : function(err){
          console.log(err);
        }
    });
  }

  onSubmit(){
    let _nPratica = '', _date = '', _surname = '', _name = '', _cf = '', _uso = '';
    let _self = this;

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

    if(this.refs.date.state == undefined){
      alert("Per favore, seleziona la data");
      return;
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

      console.log(JSON.stringify({comune_id: global.city, npratica : this.refs.npratica.getValue(), nome : this.refs.name.getValue(), cognome : this.refs.surname.getValue(), uso: this.state.usoscopovalue, cf : this.refs.cf.getValue(), data : new Date(this.refs.date.state.date), tipodocumento : this.state.value}))

      $.ajax({
          type: 'POST',
          data: JSON.stringify({comune_id: global.city, npratica : this.refs.npratica.getValue(), nome : this.refs.name.getValue(), cognome : this.refs.surname.getValue(), uso: this.state.usoscopovalue, cf : this.refs.cf.getValue(), data : new Date(this.refs.date.state.date), tipodocumento : this.state.value}),
          url: constants.DB_ADDR+'insertnewpraticaarchivio',
          processData: false,
          contentType: 'application/json',
          success: function(data) {
            greatObject.entity.nPratica = _self.refs.npratica.getValue();
            var parsed = JSON.parse(data);
            greatObject.entity.praticaID = parsed.id;
            toggleLoader.emit('toggleLoader');
            switch(_self.state.value){
              case 1:
                browserHistory.push('d1handler/'+_self.refs.npratica.getValue()+'/'+parsed.id);
              break;
              case 2:
                browserHistory.push('d2handler/'+_self.refs.npratica.getValue()+'/'+parsed.id);
                //browserHistory.push('d2handler/k');
              break;
              case 3:
                browserHistory.push('d3handler/'+_self.refs.npratica.getValue()+'/'+parsed.id);
              break;
              case 4:
                browserHistory.push('d4handler/'+_self.refs.npratica.getValue()+'/'+parsed.id);
              break;
              case 5:
                browserHistory.push('d5handler/'+_self.refs.npratica.getValue()+'/'+parsed.id);
              break;
              case 6:
                browserHistory.push('d3shandler/'+_self.refs.npratica.getValue()+'/'+parsed.id);
              break;
            }
          },
          error : function(err){
            toggleLoader.emit('toggleLoader');
            console.log(err);
          }
      });
      toggleLoader.emit('toggleLoader');
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
              <h3 style={{textAlign:'center', width : '100%'}}>Inserimento pratica pregresso</h3>
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
                  <p style={{marginTop:'30px'}}>Tipo:</p>
                  <DropDownMenu value={this.state.value} onChange={this.handleChange.bind(this)} style={{marginTop:'0px'}}>
                    <MenuItem value={1} primaryText="D1" />
                    <MenuItem value={2} primaryText="D2" />
                    <MenuItem value={3} primaryText="D3" />
                    <MenuItem value={4} primaryText="D4" />
                    <MenuItem value={5} primaryText="D5" />
                    <MenuItem value={6} primaryText="D3S" />
                  </DropDownMenu>
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p>Data Ricezione:</p>
                  <DatePicker hintText="Data di Ricezione" id="date" style={{marginLeft:'30px', color:'#FFFFFF'}} ref="date"/>
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Cognome Richiedente:</span></p>
                  <TextField
                      id="cognome"
                      hintText = "Inserisci il cognome del richiedente"
                      style={{marginLeft:'30px'}}
                      ref="surname"
                      errorText={this.state.surname}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Nome Richiedente:</span></p>
                  <TextField
                      id="nome"
                      hintText = "Inserisci il nome del richiedente"
                      style={{marginLeft:'30px'}}
                      ref="name"
                      errorText={this.state.name}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Codice Fiscale:</span></p>
                  <TextField
                      id="cf"
                      hintText = "Inserisci il CF del richiedente"
                      style={{marginLeft:'30px'}}
                      ref="cf"
                      errorText={this.state.cf}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px', marginBottom:'30px'}}>
                  <p style={{marginTop:'30px'}}><span>Codice Uso-Scopo:</span></p>
                    <DropDownMenu value={this.state.usoscopovalue} onChange={this.handleChangeUso.bind(this)} style={{marginTop:'0px'}}>
                        {usoscopo}
                    </DropDownMenu>
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

export default NuovaPraticaArchivio;
