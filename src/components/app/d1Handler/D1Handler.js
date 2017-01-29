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
import Step7 from './step7/Step7';
import Step8 from './step8/Step8';

import actions from '../../../actions/actions';
import WebStorage from 'react-webstorage';

import AvvisoPubblicazione from '../forms/AvvisoPubblicazione';
import { browserHistory } from 'react-router';
import $ from 'jquery';

class D1Handler extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      stepIndex : 0,
      opened : false,
      finished: false,
      modalContent : null,
      modalTitle : '',
      endButtonTitle : 'Avanti'
    }
  }

  _next (){
    if( this.state.stepIndex == 4){
      if(this.state.endButtonTitle === 'Fine'){
        window.open(LINKS.diniegodefinitivo, '_blank');
        browserHistory.push('/');
        return;
      }
    }
    if( this.state.stepIndex == 7){
      window.open(LINKS.concessioned1, '_blank');
      browserHistory.push('/');
      return;
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
        return <Step1 ref="step1" pid={this.props.params.pid} dbid={this.props.params.dbid} tellMeModalContent={this.tellMeModalContent.bind(this)}/>;
        break;
      case 1:
        return <Step2 pid={this.props.params.pid} dbid={this.props.params.dbid} tellMeModalContent={this.tellMeModalContent.bind(this)}/>;
        break;
      case 2:
        return <Step3 pid={this.props.params.pid} dbid={this.props.params.dbid} tellMeModalContent={this.tellMeModalContent.bind(this)}/>;
        break;
      case 3:
        return <Step4 pid={this.props.params.pid} dbid={this.props.params.dbid} tellMeModalContent={this.tellMeModalContent.bind(this)}/>;
        break;
      case 4:
        return <Step5 ref="step5" pid={this.props.params.pid} dbid={this.props.params.dbid} changeEndButtonTitleInEnd={this.changeEndButtonTitleInEnd.bind(this)} changeEndButtonTitleInNext={this.changeEndButtonTitleInNext.bind(this)} tellMeModalContent={this.tellMeModalContent.bind(this)}/>;
        break;
      case 5:
        return <Step6 ref="step6" pid={this.props.params.pid} dbid={this.props.params.dbid}  tellMeModalContent={this.tellMeModalContent.bind(this)}/>;
        break;
      case 6:
        return <Step7 ref="step7" pid={this.props.params.pid} dbid={this.props.params.dbid}  tellMeModalContent={this.tellMeModalContent.bind(this)}/>;
        break;
      case 7:
        return <Step8 ref="step8" pid={this.props.params.pid} dbid={this.props.params.dbid}  tellMeModalContent={this.tellMeModalContent.bind(this)}/>;
        break;

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

  }

  handleModalClose(){}

  changeEndButtonTitleInEnd(){
    this.setState({
      ...this.state,
      endButtonTitle : 'Fine'
    });
  }

  changeEndButtonTitleInNext(){
    this.setState({
      ...this.state,
      endButtonTitle : 'Avanti'
    });
  }

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
        <div style={{width : '100%'}}>
          <Box column id="a" justifyContent="center" alignItems="center" style={{height:'100%', width: '100%', overflow: 'hidden'}}>
            <p className="praticaClass">Pratica n°: <b>{this.props.params.pid}</b></p>
            <Paper zDepth={1} style={styles.paper}>
              <Box justifyContent="center" alignItems="center">
                <Stepper
                  activeStep={this.state.stepIndex}
                  linear={false}
                  style={{marginTop:'0px', width : '100%'}}
                  ref="stepper"
                >
                  <Step style={{width : '13%', textOverflow : 'ellipsis'}}>
                    <StepButton onClick={(e) => e.preventDefault()} style={{cursor:'default', backgroundColor:'transparent'}}>
                      Verifica di compatibilità
                    </StepButton>
                  </Step>
                  <Step style={{width : '13%', textOverflow : 'ellipsis'}}>
                    <StepButton ref="2" onClick={(e) => e.preventDefault()} style={{cursor:'default', backgroundColor:'transparent'}}>
                      Istruttoria
                    </StepButton>
                  </Step>
                  <Step style={{width : '13%', textOverflow : 'ellipsis'}}>
                    <StepButton onClick={() => console.log('step click')} style={{cursor:'default', backgroundColor:'transparent'}} >
                      Richiesta Pareri
                    </StepButton>
                  </Step>
                  <Step style={{width : '13%', textOverflow : 'ellipsis'}}>
                    <StepButton onClick={() => console.log('step click')} style={{cursor:'default', backgroundColor:'transparent'}} >
                      Approvazione
                    </StepButton>
                  </Step>
                  <Step style={{width : '13%', textOverflow : 'ellipsis'}}>
                    <StepButton onClick={() => console.log('step click')} style={{cursor:'default', backgroundColor:'transparent'}} >
                      Scelta dell'atto
                    </StepButton>
                  </Step>
                  <Step style={{width : '13%', textOverflow : 'ellipsis'}}>
                    <StepButton onClick={() => console.log('step click')} style={{cursor:'default', backgroundColor:'transparent'}} >
                      Rilascio dell'atto
                    </StepButton>
                  </Step>
                  <Step style={{width : '13%', textOverflow : 'ellipsis'}}>
                    <StepButton onClick={() => console.log('step click')} style={{cursor:'default', backgroundColor:'transparent'}} >
                      Richiesta Adempimenti
                    </StepButton>
                  </Step>
                  <Step style={{width : '13%', textOverflow : 'ellipsis'}}>
                    <StepButton onClick={() => console.log('step click')} style={{cursor:'default', backgroundColor:'transparent'}} >
                      Fine
                    </StepButton>
                  </Step>
                </Stepper>
              </Box>
              <Box>
                {this.getStepContent(this.state.stepIndex)}
              </Box>
                <div style={{marginTop:'20px', width:'auto'}}>
                  <div style={{position:'relative', width : '230px', marginRight : '20px', float:'right'}}>
                  <FlatButton
                     label="indietro"
                     disabled={this.state.stepIndex === 0}
                     onTouchTap={this._prev.bind(this)}
                     primary={false}
                     icon ={<PrevIcon />}
                   />
                   <FlatButton
                     label={this.state.stepIndex < 7 ? this.state.endButtonTitle : 'Fine'}
                     primary={false}
                     onTouchTap={this._next.bind(this)}
                     labelPosition="before"
                     icon={<NextIcon />}
                   />
                 </div>
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
