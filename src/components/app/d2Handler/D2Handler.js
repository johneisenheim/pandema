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
import Step4 from './step4/Step4';
import Step5 from './step5/Step5';
import Step6 from './step6/Step6';
import Step5b from './step5b/Step5b';
import Step7 from './step7/Step7';
import Intermezzo from './intermezzo/Intermezzo';

import actions from '../../../actions/actions';
import WebStorage from 'react-webstorage';

import { browserHistory } from 'react-router';
import $ from 'jquery';

import CircularProgress from 'material-ui/CircularProgress';
import {Link} from "react-router";
import SelectRefs from '../complementars/SelectRefs';


class D2Handler extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      stepIndex : 0,
      finished: false,
      isCompatible : true,
      loading : true,
      ref_abusi : [],
      endButtonTitle : 'Avanti'
    }
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'getRefAbuso?dbid='+escape(_self.props.params.dbid)+'&pid='+escape(_self.props.params.pid),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log(parsed);
          if(parsed.results.length == 0){
            _self.setState({
              ..._self.state,
              loading : false
            })
          }else{
            _self.setState({
              ..._self.state,
              loading : false,
              ref_abusi : parsed.results
            })
          }

        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
        }
    });
  }

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

  _next (){
    if(this.state.endButtonTitle == 'Fine'){
      browserHistory.push('/');
    }else if( this.state.stepIndex == 6){
      window.open(LINKS.concessioned2, '_blank');
      browserHistory.push('/');
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
      finished: this.state.finished,
      endButtonTitle : 'Avanti'
    });
  }

  getStepContent(index){
    switch (index) {
      case 0:
        return <Step1 compatibility={this.tellMeIfCompatible.bind(this)} pid={this.props.params.pid} dbid={this.props.params.dbid}/>;
        break;
      case 1:
        return <Step2 pid={this.props.params.pid} dbid={this.props.params.dbid}/>;
        break;
      case 2:
        return <Step4 pid={this.props.params.pid} dbid={this.props.params.dbid} />;
        break;
      case 3 :
        return <Intermezzo pid={this.props.params.pid} dbid={this.props.params.dbid} changeEndButtonTitleInEnd={this.changeEndButtonTitleInEnd.bind(this)} changeEndButtonTitleInNext={this.changeEndButtonTitleInNext.bind(this)}/>;
        break;
      case 4:
        return <Step6 ref="step6" pid={this.props.params.pid} dbid={this.props.params.dbid}/>;
        break;
      case 5:
        if(this.state.isCompatible)
          return <Step5 pid={this.props.params.pid} dbid={this.props.params.dbid} />;
        else return <Step5b />
        break;
      case 6:
        return <Step7 pid={this.props.params.pid} dbid={this.props.params.dbid} />;
        break;
      default:

    }
  }

  render (){
    if(this.state.loading){
      return(
        <Box alignItems="center" justifyContent="center" style={{width:'100%', height : '300px'}}>
          <CircularProgress size={30}/>
        </Box>
      )
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
                >
                  <Step style={{width : '14%', textOverflow : 'ellipsis'}}>
                    <StepButton onClick={(e) => e.preventDefault()} style={{cursor:'default', backgroundColor:'transparent'}}>
                      Verifica di compatibilità
                    </StepButton>
                  </Step>
                  <Step style={{width : '14%', textOverflow : 'ellipsis'}}>
                    <StepButton ref="2" onClick={(e) => e.preventDefault()} style={{cursor:'default', backgroundColor:'transparent'}}>
                      Istruttoria
                    </StepButton>
                  </Step>
                  <Step style={{width : '14%', textOverflow : 'ellipsis'}}>
                    <StepButton onClick={() => console.log('step click')} style={{cursor:'default', backgroundColor:'transparent'}} >
                      Approvazione
                    </StepButton>
                  </Step>
                  <Step style={{width : '14%', textOverflow : 'ellipsis'}}>
                    <StepButton onClick={() => console.log('step click')} style={{cursor:'default', backgroundColor:'transparent'}} >
                      Scelta dell'atto
                    </StepButton>
                  </Step>
                  <Step style={{width : '14%', textOverflow : 'ellipsis'}}>
                    <StepButton onClick={() => console.log('step click')} style={{cursor:'default', backgroundColor:'transparent'}} >
                      Rinnovo dell'atto
                    </StepButton>
                  </Step>
                  <Step style={{width : '14%', textOverflow : 'ellipsis'}}>
                    <StepButton onClick={() => console.log('step click')} style={{cursor:'default', backgroundColor:'transparent'}} >
                      Imposte
                    </StepButton>
                  </Step>
                  <Step style={{width : '14%', textOverflow : 'ellipsis'}}>
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
                   label={(this.state.stepIndex < 6 ? this.state.endButtonTitle : 'Fine')}
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

export default D2Handler;
