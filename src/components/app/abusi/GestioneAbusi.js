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

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import Search from 'material-ui/svg-icons/action/search';
import Sort from 'material-ui/svg-icons/av/sort-by-alpha';

import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';

import FlatButton from 'material-ui/FlatButton';

import Folder from 'material-ui/svg-icons/file/folder';
import Description from 'material-ui/svg-icons/action/description';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import styles from './GestioneAbusi.css.js';
import Box from 'react-layout-components';
import $ from 'jquery';
import CircularProgress from 'material-ui/CircularProgress';

import AbusoGenerico from './generico/AbusoGenerico';
import AbusoAree from './aree/AbusoAree';
import CodNav from './codnav/CodNav';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import { browserHistory } from 'react-router';

import NuovoAbuso from './NuovoAbuso';
import NuovoAbusoDropDown from './NuovoAbusoDropDown';


class GestioneAbusi extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      open: false
    }
  }

  handleTouchTap(event){
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose(){
    this.setState({
      open: false
    });
  }

  onIconMenu(e, k, v){
    switch(v){
      case 0:
        //browserHistory.push('/nuovoabuso');
        this.refs.nuovoabuso.openModal();
      break;
      case 1:
        this.refs.nuovoabusodropdown.openModal();
      break;
      case 2:
        browserHistory.push('/nuovoabusodb');
      break;
    }
  }

  render (){
    return(
        <MuiThemeProvider muiTheme={lightBaseTheme}>
          <Box column>
            <Box alignItems="center" justifyContent="flex-end" style={{marginTop:'15px'}}>
              <RaisedButton
                label="Aggiungi Abuso"
                backgroundColor ='#4CA7D0'
                icon={<ContentAdd />}
                labelStyle={{color:'#FFFFFF'}}
                style={{marginTop:'10px'}}
                onTouchTap={this.handleTouchTap.bind(this)}
              />
              <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                onRequestClose={this.handleRequestClose.bind(this)}
                touchTapCloseDelay={100}
              >
                <Menu onItemTouchTap={this.onIconMenu.bind(this)}>
                  <MenuItem primaryText="Generico" />
                  <MenuItem primaryText="In Aree in Concessione" />
                  <MenuItem primaryText="Cod. Nav. 47" />
                </Menu>
              </Popover>
            </Box>
              <Paper zDepth={1} style={styles.paper}>
                <AbusoGenerico />
              </Paper>
              <Paper zDepth={1} style={styles.paper2}>
                <AbusoAree />
              </Paper>
              <Paper zDepth={1} style={styles.paper3}>
                <CodNav />
              </Paper>
              <NuovoAbuso ref="nuovoabuso"/>
              <NuovoAbusoDropDown ref="nuovoabusodropdown" />
          </Box>
        </MuiThemeProvider>
    );
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
    primary1Color: '#E1E2E4',
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

export default GestioneAbusi;
