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

import DomandeConcorrenza from './DomandeConcorrenza';
import Opposizioni from './Opposizioni';
import AlternativaDiniego from './AlternativaDiniego';
import AvvisoPubblicazione from './AvvisoPubblicazione';
import AvvisoDiniego from './AvvisoDiniego';
import DiniegoDefinitivo from './DiniegoDefinitivo';

class Step1 extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading : true,
      compatibility : -1
    };
    this.praticaPath = null;
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'handled1s1?id='+_self.props.dbid+'&pandema_id='+_self.props.pid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.praticaPath = parsed.results[0].path;
          _self.setState({
            ..._self.state,
            isLoading : false,
            compatibility : parsed.results[0].compatibile !== undefined ? parseInt(parsed.results[0].compatibile) : -1
          })
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });
  }

  _handleIstruttoriaChange(event, index, value){
    if( index !== 0 )
      this.setState({
        ...this.state,
        compatibility : this.state.compatibility,
        istruttoriaIndex : value,
        npraticaTextFieldEnabled : true
      });
    else
      this.setState({
        ...this.state,
        compatibility : this.state.compatibility,
        istruttoriaIndex : value,
        npraticaTextFieldEnabled : false
      });
  }

  _onFirstCheckCange (e,v){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'changeCompatibility?pid='+_self.props.pid+'&dbid='+_self.props.dbid+'&compatibility='+v,
        processData: false,
        contentType: false,
        success: function(data) {
          _self.setState({
            ..._self.state,
            compatibility : v
          })
          _//self.props.tellMeIfCompatible(_self.state.compatibility);
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });
  }

  //richiamato dal padre
  _avvisoPubblicazioneCheckColor(operation){
    if(operation)
      this.setState({
        ...this.state,
        checkColorAvvisoPubblicazione : 'green'
      })
    else
      this.setState({
        ...this.state,
        checkColorAvvisoPubblicazione : '#979797'
      })
  }

  _avvisoIstruzioniCheckColor(operation){
    if(operation)
      this.setState({
        ...this.state,
        checkColorAvvisoIstruzioni : 'green'
      })
    else
      this.setState({
        ...this.state,
        checkColorAvvisoIstruzioni : '#979797'
      })
  }

  //<CheckIcon style={{marginTop : '11px', marginLeft : '10px'}} color={this.state.checkColorAvvisoIstruzioni}/>
  /*
  <RaisedButton
    label="Compila Avviso di Pubblicazione"
    primary={true}
    icon={<Compile />}
    labelStyle={{color:'#FFFFFF'}}
    style={{marginTop:'10px'}}
    onTouchTap={this.props.tellMeModalContent.bind(this, 'avvisopubblicazione')}
  />
  */
  renderFirstStepAddings (){
    if( this.state.compatibility === 1){
      return (
        <div style={styles.firstStepAddingsStyle}>
          <AvvisoPubblicazione pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
          <DomandeConcorrenza pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
          <Opposizioni pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
        </div>
      );
    }else if(this.state.compatibility === 0){
      return (
        <div style={styles.firstStepAddingsStyle}>
          <AvvisoDiniego pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
          <AlternativaDiniego pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
          <DiniegoDefinitivo pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
        </div>
      );
    }else return null;
  }

  render (){
    if( this.state.isLoading ){
      return(
        <Box alignItems="center" justifyContent="center" style={{width:'100%', height : '300px'}}>
          <CircularProgress size={30}/>
        </Box>
      )
    }else{
      return (
          <div style={{marginLeft:'20px', width : '100%'}}>
            <p>
              Inserire esito della compatibilità con il piano di utilizzo della costa o altri atti di pianificazione:
            </p>
            <div>
              <RadioButtonGroup name="step1" defaultSelected={this.state.compatibility} onChange={this._onFirstCheckCange.bind(this)}>
                <RadioButton
                  value={1}
                  label="Compatibile"
                  style={styles.radioButton}
                />
                <RadioButton
                  value={0}
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
