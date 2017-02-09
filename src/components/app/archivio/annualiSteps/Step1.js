import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Box from 'react-layout-components';

import {
lightBlue200, lightBlueA100,lightBlue300,
grey100, grey300, grey400, grey500, grey700,grey900,blue700,
pinkA200,
white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

import styles from './Step1.css.js';

import Compile from 'material-ui/svg-icons/action/assignment';
import Attach from 'material-ui/svg-icons/editor/attach-file';
import NextIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import PrevIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';
import {Link} from "react-router";
import $ from 'jquery';

import CircularProgress from 'material-ui/CircularProgress';
import AdempimentiAnuali from './AdempimentiAnuali';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class Step1 extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading : true,
      value : null
    };

  }

  componentDidMount(){}

  handleChange(event, index, value){
    this.setState({
      ...this.state,
      value : value
    }, function(){
      switch(value){
        case null:
        break;
        case 0:
          window.open(LINKS.usi_vari_base, '_blank');
        break;
        case 1:
          window.open(LINKS.turistico_e_diporto_base, '_blank');
        break;
        case 2:
          window.open(LINKS.pesca_acqua_cantieri_base, '_blank');
        break;
        case 3:
          window.open(LINKS.regione_campania_base, '_blank');
        break;
      }
    });
  }

  render (){
      return (
          <div style={{marginLeft:'20px', width : '100%', marginRight:'20px'}}>
            <Box alignItems="center" justifyContent="flex-start">
              <span style={{marginTop:'25px'}}>Scarica i files:</span>
                <SelectField
                  floatingLabelText="Seleziona il file"
                  value={this.state.value}
                  onChange={this.handleChange.bind(this)}
                  style={{marginLeft:'20px'}}
                >
                  <MenuItem value={null} primaryText="" />
                  <MenuItem value={0} primaryText="Usi Vari" />
                  <MenuItem value={1} primaryText="Turistico e Diporto" />
                  <MenuItem value={2} primaryText="Pesca Acquacoltura e Cantieri" />
                  <MenuItem value={3} primaryText="Regione Campania" />
                </SelectField>
            </Box>
            <AdempimentiAnuali pid={this.props.pid} dbid={this.props.dbid} path={this.props.path}/>
          </div>
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

export default Step1;
