import React from 'react';
import {Box, Flex} from 'react-layout-components';
import styles from './Admin.css.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {white, lightBlue200, lightBlue300, lightBlueA100} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

class Admin extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Box column alignItems="center" justifyContent="center" style={{height : '100vh', background:'-webkit-linear-gradient(top, rgba(35,103,163,1) 0%, rgba(102,161,173,1) 100%)'}}>
          <Paper zDepth={1} style={{height : '90%', width : '900px'}}>

          </Paper>
        </Box>
      </MuiThemeProvider>
    );
  }
}

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#59C2E6',
    primary2Color: lightBlue200,
    primary3Color: lightBlue300,
    textColor: '#FFFFFF',
    alternateTextColor : '#FFFFFF',
    accent1Color: lightBlueA100,
    accent2Color: '#90BF60',
    accent3Color: '#274D00',
    canvasColor: '#FFFFFF'
  },
},{
  paper: {
    height: 'auto',
    width: 'auto',
    textAlign: 'center'
  },
  userAgent: 'all'
});

export default Admin;
