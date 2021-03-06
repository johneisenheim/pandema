import React from 'react';
import {Box, Flex} from 'react-layout-components';
import styles from './App.css.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {white, lightBlue200, lightBlue300, lightBlueA100} from 'material-ui/styles/colors';

import Sidebar from './sidebar/Sidebar';
import RightContent from './rightContent/RightContent.js';
import Home from './home/Home';

import actions from '../../actions/actions';

class App extends React.Component{

  constructor(props, context) {
    super(props, context);
    if(props.location.pathname.includes('d1handler') || props.location.pathname.includes('d2handler') || props.location.pathname.includes('d3handler')
    || props.location.pathname.includes('d4handler') || props.location.pathname.includes('d5handler') || props.location.pathname.includes('d3shandler')
    || props.location.pathname.includes('gestisciallegati')){
        actions.selectMenuItem(0);
    }else if(props.location.pathname.includes('gestioneabusi') || props.location.pathname.includes('gestisciallegatiabusi')){
        actions.selectMenuItem(3);
    }else if(props.location.pathname.includes('registri') || props.location.pathname.includes('rgenerico')||props.location.pathname.includes('addToArt24Registry') ||
  props.location.pathname.includes('addToGeneralRegistry')|| props.location.pathname.includes('addToArt55Registry') || props.location.pathname.includes('rart24') ||
  props.location.pathname.includes('rart55') || props.location.pathname.includes('rart45') ||props.location.pathname.includes('addToArt45Registry')){
      actions.selectMenuItem(2);
    }else if(props.location.pathname.includes('archivio') ||props.location.pathname.includes('nuovapraticaarchivio')){
      actions.selectMenuItem(1);
    }
  }

  render(){
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Box style={{flex:1, height:'100vh'}}>
          <Sidebar/>
          <RightContent>
            <Box style={{flex:1}}>

              {this.props.children}

            </Box>
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
