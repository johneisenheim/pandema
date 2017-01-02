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

import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';

class CanoniPregressi extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state = {
      value : 0
    }
  }

  handleChange(e,v){
    this.setState({
      ...this.state,
      value : v
    });
  }

  render(){
    var years = [];
    for (var i = 0; i < 18; i++){
      var len = i.toString().length;
      var txt = "2000";
      txt = txt.substring(0, txt.length-len);
      txt += i;
      years.push(
        <MenuItem value={i} primaryText={txt} />
      );
    }
    console.log('years',years);
    return(
      <MuiThemeProvider muiTheme={lightBaseTheme} >
        <Box column justifyContent="center" alignItems="center" style={{height:'100%', width:'100%'}}>
          <Paper zDepth={1} style={styles.paper}>
            <Box column justifyContent="center" alignItems="center" style={{marginTop:'20px', marginLeft:'20px'}}>
              <p>Seleziona l&rsquo;anno per il calcolo delle informazioni:</p>
              <DropDownMenu value={this.state.value} onChange={this.handleChange.bind(this)}>
                {years}
              </DropDownMenu>
            </Box>
            <Box column justifyContent="center" alignItems="center" style={{marginTop:'30px', marginBottom:'30px'}}>
              <RaisedButton label="Calcola Canone" primary={true} labelStyle={{color:'#FFFFFF'}} />
              <RaisedButton label="Calcola Tassa Regionale" primary={true} labelStyle={{color:'#FFFFFF'}} style={{marginTop:'20px'}}/>
            </Box>
          </Paper>
        </Box>
      </MuiThemeProvider>
    );
  }
}

const styles = {
  paper : {
    margin : '10px',
    marginTop : '20px',
    width : '70%',
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

export default CanoniPregressi;
