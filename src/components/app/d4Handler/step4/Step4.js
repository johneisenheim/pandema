import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Attach from 'material-ui/svg-icons/editor/attach-file';
import Check from 'material-ui/svg-icons/action/check-circle';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Box from 'react-layout-components';
import CircularProgress from 'material-ui/CircularProgress';
import $ from 'jquery';

import AttiCessioneFitto from './AttiCessioneFitto';
import Documentazione from './Documentazione';
import VariazioneAssetto from './VariazioneAssetto';
import VenditaAggiudicazione from './VenditaAggiudicazione';
import CertificatoMorte from './CertificatoMorte';

class Step4 extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      choice : null,
      isLoading : true,
      data : [],
      checkIcon1 : '#979797',
      checkIcon2 : '#979797',
      checkIcon3 : '#979797',
      checkIcon4 : '#979797',
      checkIcon5 : '#979797',
      checkIcon6 : '#979797',
      checkIcon7 : '#979797',
      checkIcon8 : '#979797'
    };
    this.praticaPath = undefined;
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'handled4s4?id='+_self.props.dbid+'&pandema_id='+_self.props.pid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.praticaPath = parsed.results[0].path;
          _self.setState({
            ..._self.state,
            isLoading : false,
            data : parsed.results.length > 0 ? parsed.results : []
          });
        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
          ;
        }
    });

  }

  _onRadioChange(event, value){
    this.setState({
      ...this.state,
      choice : value
    })
  }

  _onFileInputChange(who){
      switch(who){
        case 0:
          this.setState({
            ...this.state,
            checkIcon1 : 'green'
          });
        break;
        case 1:
          this.setState({
            ...this.state,
            checkIcon2 : 'green'
          });
        break;
        case 2:
          this.setState({
            ...this.state,
            checkIcon3 : 'green'
          });
        break;
        case 3:
          this.setState({
            ...this.state,
            checkIcon4 : 'green'
          });
        break;
        case 4:
          this.setState({
            ...this.state,
            checkIcon5 : 'green'
          });
        break;
        case 5:
          this.setState({
            ...this.state,
            checkIcon6 : 'green'
          });
        break;
        case 6:
          this.setState({
            ...this.state,
            checkIcon7 : 'green'
          });
        break;
        case 7:
          this.setState({
            ...this.state,
            checkIcon8 : 'green'
          });
        break;
      }
  }

  renderChoice(){
    switch(this.state.choice){
      case '0':
        return (
          <div style={{marginTop : '45px',  width : '100%', marginRight : '20px'}}>
            <Box column alignItems="flex-start" justifyContent="flex-start" style={{width:'100%'}}>
              <AttiCessioneFitto pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
            </Box>
            <Box column alignItems="flex-start" justifyContent="flex-start" style={{width:'100%'}}>
              <Documentazione pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
            </Box>
          </div>
        );
      break;
      case '1':
        return (
          <div style={{marginTop : '45px',  width : '100%', marginRight : '20px'}}>
            <Box column alignItems="flex-start" justifyContent="flex-start" style={{width:'100%'}}>
              <VariazioneAssetto pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
            </Box>
            <Box column alignItems="flex-start" justifyContent="flex-start" style={{width:'100%'}}>
              <Documentazione pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
            </Box>
        </div>
        );
      break;
      case '2':
        return (
          <div style={{marginTop : '45px',  width : '100%', marginRight : '20px'}}>
            <Box column alignItems="flex-start" justifyContent="flex-start" style={{width:'100%'}}>
              <VenditaAggiudicazione pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
            </Box>
            <Box column alignItems="flex-start" justifyContent="flex-start" style={{width:'100%'}}>
              <Documentazione pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
            </Box>
        </div>
        );
      break;
      case '3':
      return (
        <div style={{marginTop : '45px',  width : '100%', marginRight : '20px'}}>
          <Box column alignItems="flex-start" justifyContent="flex-start" style={{width:'100%'}}>
            <CertificatoMorte pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
          </Box>
          <Box column alignItems="flex-start" justifyContent="flex-start" style={{width:'100%'}}>
            <Documentazione pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
          </Box>
      </div>
      );
      break;
      default :
       return null;
    }
  }

  render(){
    if(this.state.isLoading){
      return(
        <Box alignItems="center" justifyContent="center" style={{width:'100%', height : '300px'}}>
          <CircularProgress size={30}/>
        </Box>
      );
    }else{
      return(
        <div style={{marginLeft:'20px', marginTop:'20px', marginRight:'20px'}}>
          <RadioButtonGroup name="shipSpeed" onChange={this._onRadioChange.bind(this)}>
            <RadioButton
              value="0"
              label="Cessione o fitto di un'azienda, con subingresso a favore del concessionario o locazione di azienda"
              style={{marginTop : '15px'}}
            />
            <RadioButton
              value="1"
              label="Trasformazione, fusione e scissione dell'impresa concessionaria, con subingresso a favore della nuova impresa"
              style={{marginTop:'15px'}}
            />
            <RadioButton
              value="2"
              label="Vendita o esecuzione forzata, con subingresso a favore dell'acquirente o aggiudicatario (art.46, comma 2, Cod. Nav.)"
              style={{marginTop:'15px'}}
            />
            <RadioButton
              value="3"
              label="Morte con subingresso di eredi (art. 46, comma 2, Cod. Nav.)"
              style={{marginTop:'15px'}}
            />
        </RadioButtonGroup>
        {this.renderChoice()}
        </div>
      );
    }
  }
}

const styles = {
  notLoaded : {
    backgroundColor:'#FFA726',
    padding:'8px',
    color:'white',
    fontWeight:'bold'
  },
  loaded : {
    backgroundColor:'#2E7D32',
    padding:'8px',
    color:'white',
    fontWeight:'bold'
  },
  inputFile : {
    cursor: 'pointer',
    position: 'absolute',
    top: 5,
    bottom: 0,
    right: 0,
    left: 20,
    zIndex:3,
    width: '100%',
    opacity: 0,
  },
  raisedButton : {
    backgroundColor : '#FFFFFF'
  }
}

export default Step4;
