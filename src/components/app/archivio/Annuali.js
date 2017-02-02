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

import Step1 from './annualiSteps/Step1';
import Step2 from './annualiSteps/Step2';

import { browserHistory } from 'react-router';
import $ from 'jquery';

import CircularProgress from 'material-ui/CircularProgress';
import {Link} from "react-router";

class Annuali extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      stepIndex : 0,
      opened : false,
      finished: false,
      modalContent : null,
      modalTitle : '',
      endButtonTitle : 'Avanti',
      ref_abusi : [],
      loading : true,
      path : undefined
    }
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        url: constants.DB_ADDR+'getAnnualiPath?pid='+escape(this.props.params.pid)+"&dbid="+this.props.params.dbid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.setState({
              ..._self.state,
              loading : false,
              path : parsed.results[0].path
          });
        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
        }
    });
  }

  _next (){
    if(this.state.endButtonTitle == 'Fine'){
      browserHistory.push('/');
    }else if(this.state.stepIndex == 1 ){
      browserHistory.push('/');
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
      finished: this.state.finished,
      endButtonTitle : 'Avanti'
    });
  }

  getStepContent(index){
    switch (index) {
      case 0:
        return <Step1 ref="step1" pid={this.props.params.pid} dbid={this.props.params.dbid} path={this.state.path}/>;
        break;
      case 1:
        return <Step2 ref="step2" pid={this.props.params.pid} dbid={this.props.params.dbid} path={this.state.path}/>;
        break;
    }
  }

  render (){
    if( this.state.loading ){
      return (
        <Box alignItems="center" justifyContent="center" style={{width:'100%', height : '300px'}}>
          <CircularProgress size={30}/>
        </Box>
      );
    }else{
      return (
        <MuiThemeProvider muiTheme={lightBaseTheme} >
          <div style={{width : '100%'}}>
            <Box column id="a" justifyContent="center" alignItems="center" style={{height:'100%', width: '100%', overflow:'hidden'}}>
              <p style={{color:'#666666', marginLeft : '10px', marginTop : '20px',fontFamily:'Roboto', width:'100%', textAlign:'left'}}>Pratica n°: <b>{this.props.params.pid}</b></p>
              {this.state.ref_abusi.length > 0 ? <Box alignItems="flex-start" justifyContent="flex-start" style={{width:'100%'}}><Box><p className="praticaClass" style={{marginLeft:'5px'}}>Abusi Associati:</p><SelectRefs abusi={this.state.ref_abusi}/></Box></Box>: null}
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
                        Adempimenti Annuali
                      </StepButton>
                    </Step>
                    <Step>
                      <StepButton onClick={(e) => e.preventDefault()} style={{cursor:'default', backgroundColor:'transparent'}}>
                        Verifica Annuale
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
                       label={this.state.stepIndex < 2 ? this.state.endButtonTitle: 'Fine'}
                       primary={false}
                       onTouchTap={this._next.bind(this)}
                       labelPosition="before"
                       icon={<NextIcon />}
                     />
                   </div>
                  </div>
              </Paper>
            </Box>
          </div>
        </MuiThemeProvider>
      )
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

export default Annuali;
