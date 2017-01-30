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

class VisualizzaGenerico extends React.Component{
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
        url: constants.DB_ADDR+'getRegistroGenerico?id='+escape(this.props.params.id),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.setState({
            ..._self.state,
            isLoading : false,
            data : parsed.results
          });
        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
          ;
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
                      hintText = ""
                      style={{marginLeft:'30px'}}
                      errorText={this.state.nordine}
                      value={this.state.data[0].n_ordine}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center">
                  <p style={{marginTop:'30px'}}>Concessionario:</p>
                  <TextField
                      id="concessionario"
                      ref="concessionario"
                      hintText = ""
                      style={{marginLeft:'30px'}}
                      errorText={this.state.concessionario}
                      value={this.state.data[0].concessionario}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p>Data:</p>
                  <TextField
                      id="data"
                      hintText = ""
                      style={{marginLeft:'30px'}}
                      ref="data"
                      value={new Date(this.state.data[0].data).toLocaleDateString()}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Località:</span></p>
                  <TextField
                      id="localita"
                      hintText = ""
                      style={{marginLeft:'30px'}}
                      ref="localita"
                      errorText={this.state.localita}
                      value={this.state.data[0].localita}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Superficie:</span></p>
                  <TextField
                      id="superficie"
                      hintText = ""
                      style={{marginLeft:'30px'}}
                      ref="superficie"
                      errorText={this.state.superficie}
                      value={this.state.data[0].superficie}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Scopo:</span></p>
                  <TextField
                      id="scopo"
                      hintText = ""
                      style={{marginLeft:'30px'}}
                      ref="scopo"
                      errorText={this.state.scopo}
                      value={this.state.data[0].scopo}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Durata mesi:</span></p>
                  <TextField
                      id="durata"
                      hintText = ""
                      style={{marginLeft:'30px'}}
                      ref="durata"
                      errorText={this.state.durata}
                      value={this.state.data[0].durata_mesi}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p>Scadenza:</p>
                  <TextField
                      id="scadenza"
                      hintText = ""
                      style={{marginLeft:'30px'}}
                      ref="scadenza"
                      errorText={this.state.scadenza}
                      value={new Date(this.state.data[0].scadenza).toLocaleDateString()}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Canone:</span></p>
                  <TextField
                      id="canone"
                      hintText = ""
                      style={{marginLeft:'30px'}}
                      ref="canone"
                      errorText={this.state.canone}
                      value={this.state.data[0].canone}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Quietanza:</span></p>
                  <TextField
                      id="quietanza"
                      hintText = ""
                      style={{marginLeft:'30px'}}
                      ref="quietanza"
                      errorText={this.state.quietanza}
                      value={this.state.data[0].quietanza}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px'}}>
                  <p style={{marginTop:'30px'}}><span>Pertinenza:</span></p>
                  <TextField
                      id="pertinenza"
                      hintText = ""
                      style={{marginLeft:'30px'}}
                      ref="pertinenza"
                      errorText={this.state.pertinenza}
                      value={this.state.data[0].pertinenza}
                      disabled={true}
                    />
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'15px', marginBottom:'20px'}}>
                  <p style={{marginTop:'30px'}}><span>Annotazioni:</span></p>
                  <TextField
                      id="annotazioni"
                      hintText = ""
                      style={{marginLeft:'30px'}}
                      ref="annotazioni"
                      errorText={this.state.annotazioni}
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

export default VisualizzaGenerico;
