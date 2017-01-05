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

class VisualizzaArt45 extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state = {
        isLoading : true,
        usoscopo : null,
        usoscopovalue : 0,
        data : []
    }

  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'getRegistroArt45?id='+escape(this.props.params.id),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log('getRegistroArt45', parsed);
          _self.setState({
            ..._self.state,
            isLoading : false,
            data : parsed.results
          });
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });

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
                      style={{marginLeft:'30px'}}
                      value={this.state.data[0].n_ordine}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center">
                  <p style={{marginTop:'30px'}}>Richiedente:</p>
                  <TextField
                      id="richiedente"
                      ref="richiedente"
                      style={{marginLeft:'30px'}}
                      value={this.state.data[0].richiedente}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Data Rilascio:</span></p>
                  <TextField
                      id="data_richiesta"
                      style={{marginLeft:'30px'}}
                      ref="data_richiesta"
                      value={new Date(this.state.data[0].data_richiesta).toLocaleDateString()}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Protocollo Richiesta:</span></p>
                  <TextField
                      id="protocollo_richiesta"
                      style={{marginLeft:'30px'}}
                      ref="protocollo_richiesta"
                      value={this.state.data[0].protocollo_richiesta}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Causale Autorizzazione:</span></p>
                  <TextField
                      id="causale_autorizzazione"
                      style={{marginLeft:'30px'}}
                      ref="causale_autorizzazione"
                      value={this.state.data[0].causale_autorizzazione}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Atto di Concessione Subentro:</span></p>
                  <TextField
                      id="atto_concessione_subentro"
                      hintText = "Inserisci l'Atto di Concessione Subentro"
                      style={{marginLeft:'30px'}}
                      ref="atto_concessione_subentro"
                      value={this.state.data[0].atto_concessione_subentro}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Data Atto Rilascio:</span></p>
                  <TextField
                      id="data_atto_rilascio"
                      style={{marginLeft:'30px'}}
                      ref="data_atto_rilascio"
                      value={new Date(this.state.data[0].data_atto_rilascio).toLocaleDateString()}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Numero Atto Rilascio:</span></p>
                  <TextField
                      id="num_atto_rilascio"
                      style={{marginLeft:'30px'}}
                      ref="num_atto_rilascio"
                      value={this.state.data[0].num_atto_rilascio}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Pratica Concessione di Riferimento:</span></p>
                  <TextField
                      id="pratica_concessione_riferimento"
                      style={{marginLeft:'30px'}}
                      ref="pratica_concessione_riferimento"
                      value={this.state.data[0].pratica_concessione_riferimento}
                      disabled={true}
                    />
                </Box>
              </Box>
            </Paper>
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

export default VisualizzaArt45;
