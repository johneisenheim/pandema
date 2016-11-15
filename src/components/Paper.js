import React from 'react';
import Paper from 'material-ui/Paper';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {lightBlue200, lightBlue300, lightBlueA100} from 'material-ui/styles/colors';


class MyPaper extends React.Component {
  childContextTypes: {
    muiTheme: React.PropTypes.object
  }
  render(){
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Paper style={style} zDepth={1} />
      </MuiThemeProvider>
    )
  }
}

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#59C2E6',
    primary2Color: lightBlue200,
    primary3Color: lightBlue300,
    textColor: "#666666",
    accent1Color: lightBlueA100
  },
},{
  paper: {
    height: 'auto',
    width: 'auto',
    textAlign: 'center'
  },
  userAgent: 'all',
});


const style = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

export default MyPaper;
