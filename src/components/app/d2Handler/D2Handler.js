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
import Step5b from './step5b/Step5b';

import actions from '../../../actions/actions';


class D2Handler extends React.Component{

  constructor(props, context) {
    super(props, context);
  }

  state = {
    stepIndex : 0,
    finished: false,
    isCompatible : true
  }

  _next (){
    if(this.state.stepIndex == 4){
      window.open('https://drive.google.com/open?id=0B5KalOy4omiKWFBWZnhQeWt2Szg');
      this.setState({
        ...this.state,
        stepIndex : 5
      })
    }else if( this.state.stepIndex == 5){
      alert("Concluso!");
    }else{
      this.setState({
        stepIndex : this.state.stepIndex+1,
        finished: this.state.finished
      });
    }
  }

  tellMeIfCompatible(compatible){
    this.setState({
      ...this.state,
      isCompatible : compatible
    })
  }

  _prev(){
    this.setState({
      stepIndex : this.state.stepIndex-1,
      finished: this.state.finished
    });
  }

  getStepContent(index){
    switch (index) {
      case 0:
        return <Step1 compatibility={this.tellMeIfCompatible.bind(this)}/>;
        break;
      case 1:
        return <Step2 />;
        break;
      case 2:
        return <Step3 />;
        break;
      case 3:
        return <Step4 />;
        break;
      case 4:
        return <Step6 />;
        break;
      case 5:
        if(this.state.isCompatible === 'compatibile')
          return <Step5 />;
        else return <Step5b />
        break;
      default:

    }
  }

  render (){
    return (
      <MuiThemeProvider muiTheme={lightBaseTheme} >
        <Box justifyContent="center" alignItems="center" style={{height:'100%'}}>
          <Paper zDepth={1} style={styles.paper}>
            <Box justifyContent="center" alignItems="center">
              <Stepper
                activeStep={this.state.stepIndex}
                linear={false}
                style={{marginTop:'0px'}}
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
                    Rinnovo dell'atto
                  </StepButton>
                </Step>
                <Step>
                  <StepButton onClick={() => console.log('step click')} style={{cursor:'default', backgroundColor:'transparent'}} >
                    Fine
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
                 label={this.state.stepIndex === 4 ? 'Rilascio Atto' : (this.state.stepIndex === 5 ? 'Fine' : 'Avanti')}
                 primary={false}
                 onTouchTap={this._next.bind(this)}
                 labelPosition="before"
                 icon={<NextIcon />}
               />
           </Box>
         </div>
          </Paper>
        </Box>
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

export default D2Handler;
