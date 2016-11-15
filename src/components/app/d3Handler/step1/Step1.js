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

var data = {
    "prot1" : "32",
    "prot2" : "3233A",
    "demanio1" : "Jan 1",
    "demanio2" : "Off"
};

class Step1 extends React.Component{

  constructor(props, context) {
    super(props, context);
  }

  state = {
    compatibility : 1,
    istruttoriaIndex : 0,
    npraticaTextFieldEnabled : false,
    checkColorAvvisoPubblicazione : '#979797',
    checkColorDomandeOccorrenza : '#979797',
    checkColorAllegaOpposizioni : '#979797',
    checkColorAvvisoIstruzioni : '#979797'
  }

  _handleIstruttoriaChange(event, index, value){
    if( index !== 0 )
      this.setState({
        compatibility : this.state.compatibility,
        istruttoriaIndex : value,
        npraticaTextFieldEnabled : true
      });
    else
      this.setState({
        compatibility : this.state.compatibility,
        istruttoriaIndex : value,
        npraticaTextFieldEnabled : false
      });
  }

  _onFirstCheckCange (e,v){
    //console.log('State before:', this.state.compatibility);
    this.setState({
      compatibility : 1 ? this.state.compatibility == 0 : 0,
      istruttoriaIndex : this.state.istruttoriaIndex,
      npraticaTextFieldEnabled : this.state.npraticaTextFieldEnabled
    });
    //console.log('State after:', this.state.compatibility);
  }

  _domandeOccorrenzaFileHandler(e){
    this.setState({
        ...this.state,
        checkColorDomandeOccorrenza : 'green'
    });
  }

  _allegaOpposizioniFileHandler(e){
    this.setState({
        ...this.state,
        checkColorAllegaOpposizioni : 'green'
    });
  }

  renderFirstStepAddings (){
    if( this.state.compatibility )
      return (
        <div style={styles.firstStepAddingsStyle}>
          <Box justifyContent="flex-start" alignItems="center">
            <RaisedButton
              label="Compila Avviso di Pubblicazione"
              href="/avvisopubblicazione"
              primary={true}
              icon={<Compile />}
              labelStyle={{color:'#FFFFFF'}}
              style={{marginTop:'10px'}}
            />
          <CheckIcon style={{marginTop : '11px', marginLeft : '10px'}} color={this.state.checkColorAvvisoPubblicazione}/>
          </Box>
          <Box justifyContent="flex-start" alignItems="center">
              <FlatButton label="Allega Domande in occorrenza" icon={<Attach />} style={{marginTop:'10px'}}>
                  <input type="file" style={styles.inputFile} accept="application/pdf" onChange={this._domandeOccorrenzaFileHandler.bind(this)}/>
              </FlatButton>
              <CheckIcon style={{marginTop : '11px', marginLeft : '10px'}} color={this.state.checkColorDomandeOccorrenza}/>
          </Box>
          <Box justifyContent="flex-start" alignItems="center">
            <FlatButton label="Allega Opposizioni" icon={<Attach />} style={{marginTop:'10px'}}>
              <input type="file" style={styles.inputFile} accept="application/pdf" onChange={this._allegaOpposizioniFileHandler.bind(this)}/>
            </FlatButton>
            <CheckIcon style={{marginTop : '11px', marginLeft : '10px'}} color={this.state.checkColorAllegaOpposizioni}/>
          </Box>
          <Box justifyContent="flex-start" alignItems="center">
            <RaisedButton
              label="Compila Comunicazione di Avviso Istruttoria"
              href=""
              primary={true}
              icon={<Compile />}
              labelStyle={{color:'#FFFFFF'}}
              style={{marginTop:'10px'}}
            />
          <CheckIcon style={{marginTop : '11px', marginLeft : '10px'}} color={this.state.checkColorAvvisoIstruzioni}/>
          </Box>
        </div>
      );
    else return (
      <div style={styles.firstStepAddingsStyle}>
        <Box justifyContent="flex-start" alignItems="center">
            <RaisedButton
            label="Compila Avviso di Diniego"
            primary={true}
            icon={<Compile />}
            labelStyle={{color:'#FFFFFF'}}
            style={{marginTop:'10px'}}
            containerElement={<Link to="/avvisodiniego"></Link>}
          /><CheckIcon style={{marginTop : '11px', marginLeft : '10px'}}/>
        </Box>
        <Box justifyContent="flex-start" alignItems="center">
          <FlatButton label="Documentazione alternativa avviso di diniego" icon={<Attach />} style={{marginTop:'10px'}}>
             <input type="file" style={styles.inputFile} />
          </FlatButton>
          <CheckIcon style={{marginTop : '11px', marginLeft : '10px'}}/>
        </Box>
        <Box justifyContent="flex-start" alignItems="center">
         <RaisedButton
           label="Compila Diniego definitivo"
           href=""
           primary={true}
           icon={<Compile />}
           labelStyle={{color:'#FFFFFF'}}
           style={{marginTop:'10px'}}
         />
          <CheckIcon style={{marginTop : '11px', marginLeft : '10px'}}/>
        </Box>
      </div>
    );
  }

  render (){
      return (
        <div style={{marginLeft:'20px'}}>
          <p>
            Inserire esito della compatibilità con il piano di utilizzo della costa o altri atti di pianificazione:
          </p>
          <div>
            <RadioButtonGroup name="step1" defaultSelected="compatibile" onChange={this._onFirstCheckCange.bind(this)}>
              <RadioButton
                value="compatibile"
                label="Compatibile"
                style={styles.radioButton}
              />
              <RadioButton
                value="non_compatibile"
                label="Non compatibile"
                style={styles.radioButton}
              />
            </RadioButtonGroup>
            {this.renderFirstStepAddings()}
          </div>
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
