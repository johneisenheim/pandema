import React from 'react';
import {Box, Flex} from 'react-layout-components';
import styles from './App.css.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {white, lightBlue200, lightBlue300, lightBlueA100} from 'material-ui/styles/colors';

import Sidebar from './sidebar/Sidebar';
import RightContent from './rightContent/RightContent.js';
import Home from './home/Home';

import EasyTransition from 'react-easy-transition';
//import Middleware from '../../Middleware';

//leaveStyle={{opacity: 0}}

class App extends React.Component{

  constructor(props, context) {
    super(props, context);
    //console.log(global.myGlobalVariable);
    //console.log(global._webStorage.getItem('chiave'));
  }

  //{this.props.children}

  render(){
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Box style={{height:"100vh", overflowX:'hidden'}}>
          <Sidebar/>
          <RightContent>
            <div id="pre" style={{width:'100%', height:'100%', overflow:"scroll"}}>
              <EasyTransition
                  path={this.props.location.pathname}
                  initialStyle={{opacity: 0, transform: 'translateX(100%)'}}
                  transition="opacity 0.2s ease-in, transform 0.3s ease-in-out 0.3s"
                  finalStyle={{opacity: 1, transform: 'translateX(0%)'}}
                  leaveStyle={{opacity: 0.9, transform: 'translateX(100%)'}}
                  style={{height:'100%'}}
              >
              {this.props.children}
              </EasyTransition>
            </div>
          </RightContent>
        </Box>
      </MuiThemeProvider>
    )
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

export default App;
