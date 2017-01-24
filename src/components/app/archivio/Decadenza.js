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
import $ from 'jquery';
import CircularProgress from 'material-ui/CircularProgress';
import AnnotazioneRegolarita from './AnnotazioneRegolarita';
import Revoca from './Revoca';
import AvvioDecadenza from './AvvioDecadenza';
import AttoDecadenza from './AttoDecadenza';

class Decadenza extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state = {
      value : 0,
      isLoading : true,
      path : undefined
    }
  }

  componentDidMount(){
    //handled1s7
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'handled1s7?pandema_id='+this.props.params.pid+'&id='+this.props.params.dbid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log('Decadenza', parsed);
          _self.setState({
            ..._self.state,
            isLoading : false,
            path : parsed.results[0].path
          })
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });
  }

  render(){
    if(this.state.isLoading){
      return(
        <Box alignItems="center" justifyContent="center" style={{width:'100%', height : '300px'}}>
          <CircularProgress size={30}/>
        </Box>
      )
    }else{
      return(
        <MuiThemeProvider muiTheme={lightBaseTheme} >
          <Box column justifyContent="center" alignItems="center" style={{height:'100%', width:'100%'}}>
            <Paper zDepth={1} style={styles.paper}>
              <Box column justifyContent="center" alignItems="center" style={{marginTop:'20px', marginLeft:'20px'}}>
                  <AnnotazioneRegolarita path={this.state.path} pid={this.props.params.pid} dbid={this.props.params.dbid}/>
                  <Revoca path={this.state.path} pid={this.props.params.pid} dbid={this.props.params.dbid}/>
                  <AvvioDecadenza path={this.state.path} pid={this.props.params.pid} dbid={this.props.params.dbid}/>
                  <AttoDecadenza path={this.state.path} pid={this.props.params.pid} dbid={this.props.params.dbid}/>
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
    width : '99%',
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

export default Decadenza;
