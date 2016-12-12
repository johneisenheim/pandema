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
        url: 'http://127.0.0.1:8001/handled1s1?id='+_self.props.dbid+'&pandema_id='+_self.props.pid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.praticaPath = parsed.results[0].path;
          /*var state = {
            compatibility : parsed.length > 0 ? parsed.compatibile : -1,
            istruttoriaIndex : 0,
            npraticaTextFieldEnabled : false,
            checkColorAvvisoPubblicazione : greatObject.d1.pdfs !== undefined ? (greatObject.d1.pdfs['avvisopubblicazione'] !== undefined ? 'green' : '#979797') : '#979797',
            checkColorDomandeConcorrenza : greatObject.d1.files !== undefined ? (greatObject.d1.files['domandeconcorrenza'] !== undefined ? 'green' : '#979797') : '#979797',
            checkColorAllegaOpposizioni : greatObject.d1.files !== undefined ? (greatObject.d1.files['opposizioni'] !== undefined ? 'green' : '#979797') : '#979797',
            checkColorAvvisoIstruzioni : greatObject.d1.pdfs !== undefined ? (greatObject.d1.pdfs['avvisoistruzioni'] !== undefined ? 'green' : '#979797') : '#979797',
            checkColorDocumentazioneAlternativa : greatObject.d1.files !== undefined ? (greatObject.d1.files['documetazionealternativa'] !== undefined ? 'green' : '#979797') : '#979797',
            checkColorAvvisoDiniego : greatObject.d1.pdfs !== undefined ? (greatObject.d1.pdfs['avvisodiniego'] !== undefined ? 'green' : '#979797') : '#979797',
            checkColorAvvisoDiniegoDefinitivo : greatObject.d1.pdfs !== undefined ? (greatObject.d1.pdfs['avvisodiniegodefinitivo'] !== undefined ? 'green' : '#979797') : '#979797',
          };*/
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
        url: 'http://127.0.0.1:8001/changeCompatibility?pid='+_self.props.pid+'&dbid='+_self.props.dbid+'&compatibility='+v,
        processData: false,
        contentType: false,
        success: function(data) {
          _self.setState({
            ..._self.state,
            compatibility : v
          })
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });
    //console.log('State before:', this.state.compatibility);
    /*this.setState({
      ...this.state,
      compatibility : 1 ? this.state.compatibility == 0 : 0,
      istruttoriaIndex : this.state.istruttoriaIndex,
      npraticaTextFieldEnabled : this.state.npraticaTextFieldEnabled,
      checkColorAvvisoPubblicazione : '#979797',
      checkColorDomandeConcorrenza : '#979797',
      checkColorAllegaOpposizioni : '#979797',
      checkColorAvvisoIstruzioni : '#979797',
      checkColorDocumentazioneAlternativa : '#979797',
      checkColorAvvisoDiniego : '#979797',
      checkColorAvvisoDiniegoDefinitivo : '#979797'
    });
    global.greatObject.d1['compatibility'] = v;
    global.greatObject.d1['files'] = {};
    global.greatObject.d1['pdfs'] = {};
    //console.log('State after:', this.state.compatibility);*/
  }

  _domandeConcorrenzaFileHandler(e){
    console.log(this.refs.file1.files[0]);
    /*var formData = new FormData();
    formData.append('primo', this.refs.file1.files[0]);
    $.ajax({
        type: 'POST',
        data: formData,
        url: 'http://127.0.0.1:8001/provafile',
        processData: false,
        contentType: false,
        success: function(data) {
          console.log(data);
        },
        error : function(err){
          console.log(err);
        }
    });*/
    this.setState({
        ...this.state,
        checkColorDomandeConcorrenza : 'green'
    });
    if( typeof global.greatObject.d1['files'] !== 'undefined'){
      global.greatObject.d1['files']['domandeconcorrenza'] = this.refs.file1.files[0];
    } else {
      global.greatObject.d1['files'] = {};
      global.greatObject.d1['files']['domandeconcorrenza'] = this.refs.file1.files[0];
    }
    //console.log(global.greatObject);
  }

  _allegaOpposizioniFileHandler(e){
    this.setState({
        ...this.state,
        checkColorAllegaOpposizioni : 'green'
    });
    if( typeof global.greatObject.d1['files'] !== 'undefined'){
      global.greatObject.d1['files']['opposizioni'] = this.refs.file2.files[0];
    } else {
      global.greatObject.d1['files'] = {};
      global.greatObject.d1['files']['opposizioni'] = this.refs.file2.files[0];
    }
    //console.log(global.greatObject);
  }

  _allegaDocumentazioneAlternativa(e){
    this.setState({
        ...this.state,
        checkColorDocumentazioneAlternativa : 'green'
    });
    if( typeof global.greatObject.d1['files'] !== 'undefined'){
      global.greatObject.d1['files']['documetazionealternativa'] = this.refs.file3.files[0];
    } else {
      global.greatObject.d1['files'] = {};
      global.greatObject.d1['files']['documetazionealternativa'] = this.refs.file3.files[0];
    }
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
  renderFirstStepAddings (){
    if( this.state.compatibility === 1){
      return (
        <div style={styles.firstStepAddingsStyle}>
          <Box justifyContent="flex-start" alignItems="center">
            <RaisedButton
              label="Compila Avviso di Pubblicazione"
              primary={true}
              icon={<Compile />}
              labelStyle={{color:'#FFFFFF'}}
              style={{marginTop:'10px'}}
              onTouchTap={this.props.tellMeModalContent.bind(this, 'avvisopubblicazione')}
            />
          </Box>
          <DomandeConcorrenza pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
          <Opposizioni pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
          <Box justifyContent="flex-start" alignItems="center">
            <RaisedButton
              label="Compila Comunicazione di Avviso Istruttoria"
              href=""
              primary={true}
              icon={<Compile />}
              labelStyle={{color:'#FFFFFF'}}
              style={{marginTop:'10px'}}
            />
          </Box>
        </div>
      );
    }else if(this.state.compatibility === 0){
      return (
        <div style={styles.firstStepAddingsStyle}>
          <Box justifyContent="flex-start" alignItems="center">
              <RaisedButton
              label="Compila Avviso di Diniego"
              primary={true}
              icon={<Compile />}
              labelStyle={{color:'#FFFFFF'}}
              style={{marginTop:'10px'}}
              containerElement={<Link to="/avvisodiniego"></Link>}
            />
          </Box>
          <AlternativaDiniego pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
          <Box justifyContent="flex-start" alignItems="center">
           <RaisedButton
             label="Compila Diniego definitivo"
             href=""
             primary={true}
             icon={<Compile />}
             labelStyle={{color:'#FFFFFF'}}
             style={{marginTop:'10px'}}
           />
          </Box>
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
