import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import Call from 'material-ui/svg-icons/communication/call';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
//import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import {
lightBlue200, lightBlueA100,lightBlue300,
grey100, grey300, grey400, grey500,grey900,blue700,
pinkA200,
white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

import Divider from 'material-ui/Divider';
import { browserHistory } from 'react-router';
import WebStorage from 'react-webstorage';
import Avatar from 'material-ui/Avatar';
import Box from 'react-layout-components';
import $ from 'jquery';
import Credits from './Credits';
//const darkMuiTheme = getMuiTheme(darkBaseTheme);


class NavBar extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      src : ""
    }
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        url: constants.DB_ADDR+'getComuneImage?cid='+escape(global.city),
        success: function(data) {
            _self.setState({
              ..._self.state,
              src : constants.DB_ADDR+data
            });
        }
    });
  }

  onTouchTap(e,v,m,n){
    switch (v.key) {
      case '0':
          this.refs.credits.openModal();
        break;
      case '1':
        var r = confirm('Sei sicuro di voler effettuare il logout?');
        if(r){
          var webStorage = new WebStorage(
      			window.localStorage ||
      			window.sessionStorage
      		);
          global.city = null;
          webStorage.setItem("pandemawebapp", false);
          webStorage.setItem("pandemawebappcity", null);
          webStorage.setItem("pandemawebappcityname", null);
          webStorage.setItem("pandemawebtoken", null);
          location.reload();
        }
        break;
      default:

    }
  }

  render(){
    var webStorage = new WebStorage(
      window.localStorage ||
      window.sessionStorage
    );
    var avatar = undefined;
    if(this.state.src == ''){
      avatar = <Avatar size={33}>P</Avatar>;
    }else avatar = <Avatar src={this.state.src} size={33}></Avatar>;
    return(
      <MuiThemeProvider muiTheme={lightBaseTheme}>
        <div>
        <AppBar
          title=""
          showMenuIconButton = {false}
          iconElementRight={
            <Box alignItems="center" justifyContent="center">
              <p style={{color:'#666666', fontSize:'13px'}}>Comune di {webStorage.getItem("pandemawebappcityname")}</p>
              <IconMenu
                iconButtonElement={
                  <IconButton style={{marginTop:'-10px'}}>{avatar}</IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                onItemTouchTap={this.onTouchTap.bind(this)}
                style={{marginTop:'5px'}}
              >
                <MenuItem key={0} primaryText="Credits" style={{color:'#666666'}}/>
                <MenuItem key={1} primaryText="Logout" style={{color:'#666666'}}/>
              </IconMenu>
            </Box>
          }

        />
      <Credits ref="credits"/>
      </div>
      </MuiThemeProvider>
    )
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
    textColor: blue700,
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

export default NavBar;
