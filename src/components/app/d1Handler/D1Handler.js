import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper';

import styles from './D1Handler.css.js';

import {
lightBlue200, lightBlueA100,lightBlue300,
grey100, grey300, grey400, grey500, grey700,grey900,blue700,
pinkA200,
white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

import Box from 'react-layout-components';
import Dialog from 'material-ui/Dialog';

import {
  Step,
  Stepper,
  StepLabel,
  StepContent,
  StepButton
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';


import NextIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import PrevIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-left';

import Step1 from './step1/Step1';
import Step2 from './step2/Step2';
import Step3 from './step3/Step3';
import Step4 from './step4/Step4';
import Step5 from './step5/Step5';
import Step6 from './step6/Step6';

import actions from '../../../actions/actions';
import WebStorage from 'react-webstorage';

import AvvisoPubblicazione from '../forms/AvvisoPubblicazione';
import $ from 'jquery';

class D1Handler extends React.Component{

  constructor(props, context) {
    super(props, context);
    global.greatObject.d1 = {};
  }

  state = {
    stepIndex : 0,
    opened : false,
    finished: false,
    modalContent : null,
    modalTitle : ''
  }

  _next (){
    //alert(this.props.params.id);
    /*if(this.state.stepIndex == 0){
      var formData = new FormData();
      formData.append('entity', 'a');
      formData.append('city', global.city);
      formData.append('npratica', 'n39');
      for ( var key in global.greatObject.d1.files ){
        formData.append(key, global.greatObject.d1.files[key]);
      }

      for ( var key in global.greatObject.d1.pdfs ){
        formData.append(key, JSON.stringify(global.greatObject.d1.pdfs[key]));
      }
      console.log(global.greatObject);

      $.ajax({
          type: 'POST',
          data: formData,
          url: 'http://127.0.0.1:8001/handled1',
          processData: false,
          contentType: false,
          success: function(data) {
            console.log(data);
          },
          error : function(err){
            console.log(err);
          }
      });
      return;
    }*/
    if(this.state.stepIndex == 5){
      /*if( this.props.params.id != 'k'){
        alert('Pratica D1 per n.pratica '+this.props.params.id +' inserita correttamente!');
      }*/
      if( this.refs.step5.getDiniego() === 'deny' ){
        alert('Diniego inoltrato!');
        return;
      }
      
    }
    this.setState({
      ...this.state,
      stepIndex : this.state.stepIndex+1,
      finished: this.state.finished
    });
  }

  _prev(){
    this.setState({
      ...this.state,
      stepIndex : this.state.stepIndex-1,
      finished: this.state.finished
    });
  }

  tellMeModalContent(content){
    switch(content){
      case 'avvisopubblicazione':
        this.setState({
          ...this.state,
          modalContent : 'avvisopubblicazione',
          modalTitle : 'Avviso di Pubblicazione',
          opened : true
        })
      break;
      default :
        return <div></div>;
    }
  }

  getModalContent(){
    switch(this.state.modalContent){
      case 'avvisopubblicazione':
        return <AvvisoPubblicazione ref="avvisopubblicazione"/>;
      break;
      case null:
        return <div></div>;
      break;
    }
  }

  getStepContent(index){
    switch (index) {
      case 0:
        return <Step1 ref="step1" tellMeModalContent={this.tellMeModalContent.bind(this)}/>;
        break;
      case 1:
        return <Step2 tellMeModalContent={this.tellMeModalContent.bind(this)}/>;
        break;
      case 2:
        return <Step3 tellMeModalContent={this.tellMeModalContent.bind(this)}/>;
        break;
      case 3:
        return <Step4 tellMeModalContent={this.tellMeModalContent.bind(this)}/>;
        break;
      case 4:
        return <Step5 ref="step5" tellMeModalContent={this.tellMeModalContent.bind(this)}/>;
        break;
      case 5:
        return <Step6 tellMeModalContent={this.tellMeModalContent.bind(this)}/>;
        break;
      default:

    }
  }

  openModal(v){
    this.setState({
      ...this.state,
      opened : true
    });
  }

  handleModalButtonClose(){
    this.setState({
      ...this.state,
      opened : false
    })
  }

  handleModalButtonSubmit(){
      let json = this.refs[this.state.modalContent].validateForm();
      if( json == null)
        return;

      switch(this.refs.stepper.props.activeStep){
        case 0:
          if(this.state.modalContent == 'avvisopubblicazione'){
              //global.greatObject.d1.pdfs['avvisopubblicazione'] = json;
              console.log(global.greatObject);
              global.greatObject.d1['pdfs'] = {};
              global.greatObject.d1['pdfs']['avvisopubblicazione'] = json;
              console.log(global.greatObject);
              this.refs.step1._avvisoPubblicazioneCheckColor(true);
              this.setState({
                ...this.state,
                opened : false
              })
          }
          if(this.state.modalContent == 'avvisoistruzioni'){
              //global.greatObject.d1.pdfs['avvisopubblicazione'] = json;
              global.greatObject.d1['pdfs'] = {};
              global.greatObject.d1['pdfs']['avvisopubblicazione'] = json;
              this.refs.step1._avvisoIstruzioniCheckColor(true);
              this.setState({
                ...this.state,
                opened : false
              })
          }
        break;
      }
  }

  handleModalClose(){}

  render (){
    const actions = [
      <FlatButton
        label="Annulla"
        primary={true}
        onTouchTap={this.handleModalButtonClose.bind(this)}
        labelStyle={{color : '#4A4A4A'}}
      />,
      <FlatButton
        label="Fatto"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleModalButtonSubmit.bind(this)}
        labelStyle={{color : '#4988A9'}}
      />,
    ];

    return (
      <MuiThemeProvider muiTheme={lightBaseTheme} >
        <div>
          <Box justifyContent="center" alignItems="center" style={{height:'100%'}}>
            <Paper zDepth={1} style={styles.paper}>
              <Box justifyContent="center" alignItems="center">
                <Stepper
                  activeStep={this.state.stepIndex}
                  linear={false}
                  style={{marginTop:'0px'}}
                  ref="stepper"
                >
                  <Step>
                    <StepButton onClick={(e) => e.preventDefault()} style={{cursor:'default', backgroundColor:'transparent'}}>
                      Verifica di compatibilità
                    </StepButton>
                  </Step>
                  <Step>
                    <StepButton ref="2" onClick={(e) => e.preventDefault()} style={{cursor:'default', backgroundColor:'transparent'}}>
                      Istruttoria
                    </StepButton>
                  </Step>
                  <Step>
                    <StepButton onClick={() => console.log('step click')} style={{cursor:'default', backgroundColor:'transparent'}} >
                      Richiesta Pareri
                    </StepButton>
                  </Step>
                  <Step>
                    <StepButton onClick={() => console.log('step click')} style={{cursor:'default', backgroundColor:'transparent'}} >
                      Approvazione
                    </StepButton>
                  </Step>
                  <Step>
                    <StepButton onClick={() => console.log('step click')} style={{cursor:'default', backgroundColor:'transparent'}} >
                      Scelta dell'atto
                    </StepButton>
                  </Step>
                  <Step>
                    <StepButton onClick={() => console.log('step click')} style={{cursor:'default', backgroundColor:'transparent'}} >
                      Rilascio dell'atto
                    </StepButton>
                  </Step>
                </Stepper>
              </Box>
              <Box>
                {this.getStepContent(this.state.stepIndex)}
              </Box>
              <div style={{width:'100%', marginTop:'15px'}}>
              <Box style={{marginRight:'30px', bottom:'30px', position:'fixed', right : '10px'}}>
                <FlatButton
                   label="indietro"
                   disabled={this.state.stepIndex === 0}
                   onTouchTap={this._prev.bind(this)}
                   primary={false}
                   icon ={<PrevIcon />}
                 />
                 <FlatButton
                   label={this.state.stepIndex === 5 ? 'Fine' : 'Avanti'}
                   primary={false}
                   onTouchTap={this._next.bind(this)}
                   labelPosition="before"
                   icon={<NextIcon />}
                 />
             </Box>
           </div>
            </Paper>
          </Box>
          <Dialog
              title={this.state.modalTitle}
              actions={actions}
              modal={false}
              open={this.state.opened}
              onRequestClose={this.handleModalClose.bind(this)}
              autoScrollBodyContent={true}
              autoDetectWindowHeight={true}
              contentStyle={{width : '80%', maxWidth : 'none', height : '100%', maxHeight : 'none'}}
              titleStyle={{color:'#4988A9', textAlign:'center'}}
            >
            {this.getModalContent()}
          </Dialog>
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

export default D1Handler;
