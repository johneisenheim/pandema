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
import CircularProgress from 'material-ui/CircularProgress';
import $ from 'jquery';

import AvvisoIngiunzione from './AvvisoIngiunzione';
import Ingiunzione from './Ingiunzione';
import PrimoAvviso from './PrimoAvviso';
import SecondoAvviso from './SecondoAvviso';
import Trasmissione from './Trasmissione';

class HandleGestioneAbusi extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state = {
        value : 1,
        nPratica : '',
        isLoading : true,
        path : undefined,
        usoscopo : undefined,
        open : false
    };
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'getAbusoPath?pid='+this.props.params.pid+'&dbid='+this.props.params.dbid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log('HandleGestioneAbusi()', parsed);
          _self.setState({
            ..._self.state,
            isLoading : false,
            path : parsed.results[0].path,
            usoscopo : parsed.usoscopo
          });
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });
  }

  onSubmit(){

  }

  render(){
    if( this.state.isLoading){
      return(
        <Box alignItems="center" justifyContent="center" style={{width:'100%', height : '300px'}}>
          <CircularProgress size={30}/>
        </Box>
      )
    }else{
      return(
        <MuiThemeProvider muiTheme={lightBaseTheme} >
          <Box column justifyContent="center" alignItems="center" style={{width:'100%'}}>
            <Paper zDepth={1} style={styles.paper}>
              <Box column justifyContent="center" alignItems="flex-start" style={{marginTop:'20px', marginLeft:'20px'}}>
                <Box justifyContent="flex-start" alignItems="center">
                  <p style={{marginTop:'30px'}}><span>Abuso n°:</span></p>
                  <TextField
                      id="npratica"
                      ref="npratica"
                      style={{marginLeft:'30px'}}
                      errorText={this.state.nPratica}
                      value={this.props.params.pid}
                      disabled={true}
                    />
                </Box>
                <Box column justifyContent="flex-start" alignItems="flex-start" style={{marginTop:'30px'}}>
                  <AvvisoIngiunzione pid={this.props.params.pid} dbid={this.props.params.dbid} path={this.state.path}/>
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'30px'}}>
                  <Ingiunzione pid={this.props.params.pid} dbid={this.props.params.dbid} path={this.state.path}/>
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'30px'}}>
                  <PrimoAvviso pid={this.props.params.pid} dbid={this.props.params.dbid} path={this.state.path} usoscopo={this.state.usoscopo}/>
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginTop:'30px'}}>
                  <SecondoAvviso pid={this.props.params.pid} dbid={this.props.params.dbid} path={this.state.path} usoscopo={this.state.usoscopo}/>
                </Box>
                <Box justifyContent="flex-start" alignItems="center" style={{marginBottom:'30px'}}>
                  <Trasmissione pid={this.props.params.pid} dbid={this.props.params.dbid} path={this.state.path}/>
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
    marginTop : '20px',
    height : 'auto',
    width : '99%',
    marginBottom : '30px'
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

export default HandleGestioneAbusi;
