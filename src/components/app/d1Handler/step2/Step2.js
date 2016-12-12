import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Box, Center} from 'react-layout-components';
import {Tabs, Tab} from 'material-ui/Tabs';

import {
lightBlue200, lightBlueA100,lightBlue300,
grey100, grey300, grey400, grey500, grey700,grey900,blue700,
pinkA200,
white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

import styles from './Step2.css.js';

import ReqMin from './ReqMin';
import ReqFac from './ReqFac';

import Compile from 'material-ui/svg-icons/action/assignment';
import Attach from 'material-ui/svg-icons/editor/attach-file';
import NextIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import PrevIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-left';

//D4D4D4

class Step2 extends React.Component{

  constructor(props, context) {
    super(props, context);
  }

  state = {
    value : 'a'
  }

  _onFileInputChange(index){
    for (var i = 1; i <= 7; i++ ){
      if( i == index )
        this.state['d'+i] = '#49DE82';
    }
    this.setState(this.state);
  }

  handleChange(v){
    this.setState({
      value : v
    })
  }


  render (){
      return (
        <Tabs
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
        >
        <Tab label="Requisiti Minimi" value="a" style={{backgroundColor:'white'}}>
            <div style={{marginBottom:'70px'}}>
              <ReqMin pid={this.props.pid} dbid={this.props.dbid} />
            </div>
        </Tab>
        <Tab label="Requisiti Facoltativi" value="b" style={{backgroundColor:'white'}}>
          <div>
            <ReqFac pid={this.props.pid} dbid={this.props.dbid}/>
          </div>
        </Tab>
        </Tabs>
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

export default Step2;
