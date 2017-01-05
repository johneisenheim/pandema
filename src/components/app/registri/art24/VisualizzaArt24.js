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

class VisualizzaArt24 extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state = {
        data : [],
        isLoading : true,
        usoscopo : null,
        usoscopovalue : 0
    }

  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'getRegistroArt24?id='+escape(this.props.params.id),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log('getRegistroArt24', parsed);
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
                  <p style={{marginTop:'30px'}}><span>Data:</span></p>
                  <TextField
                      id="data"
                      style={{marginLeft:'30px'}}
                      ref="data"
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
                  <p style={{marginTop:'30px'}}><span>Scopo:</span></p>
                  <TextField
                      id="scopo"
                      style={{marginLeft:'30px'}}
                      ref="scopo"
                      value={this.state.data[0].scopo}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Area Coperta:</span></p>
                  <TextField
                      id="area_coperta"
                      style={{marginLeft:'30px'}}
                      ref="area_coperta"
                      value={this.state.data[0].area_coperta}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Area Scoperta:</span></p>
                  <TextField
                      id="area_scoperta"
                      style={{marginLeft:'30px'}}
                      ref="area_scoperta"
                      value={this.state.data[0].area_scoperta}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Volumetria:</span></p>
                  <TextField
                      id="volumetria"
                      style={{marginLeft:'30px'}}
                      ref="volumetria"
                      value={this.state.data[0].volumetria}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Codice Comune:</span></p>
                  <TextField
                      id="codice_comune"
                      style={{marginLeft:'30px'}}
                      ref="codice_comune"
                      value={this.state.data[0].codice_comune}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Sezione:</span></p>
                  <TextField
                      id="sezione"
                      style={{marginLeft:'30px'}}
                      ref="sezione"
                      value={this.state.data[0].sezione}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Foglio:</span></p>
                  <TextField
                      id="foglio"
                      style={{marginLeft:'30px'}}
                      ref="foglio"
                      value={this.state.data[0].foglio}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Particella:</span></p>
                  <TextField
                      id="particella"
                      style={{marginLeft:'30px'}}
                      ref="particella"
                      value={this.state.data[0].particella}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Subalterni:</span></p>
                  <TextField
                      id="subalterni"
                      style={{marginLeft:'30px'}}
                      ref="subalterni"
                      value={this.state.data[0].subalterni}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px', marginBottom:'20px'}}>
                  <p style={{marginTop:'30px'}}><span>Annotazioni:</span></p>
                  <TextField
                      id="annotazioni"
                      style={{marginLeft:'30px'}}
                      ref="annotazioni"
                      value={this.state.data[0].annotazioni}
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

export default VisualizzaArt24;
