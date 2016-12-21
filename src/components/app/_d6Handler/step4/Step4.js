import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Attach from 'material-ui/svg-icons/editor/attach-file';
import Check from 'material-ui/svg-icons/action/check-circle';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Box from 'react-layout-components';

class Step4 extends React.Component{

  constructor(props, context) {
    super(props, context);
  }

  state = {
    choice : null,
    checkIcon1 : '#979797',
    checkIcon2 : '#979797',
    checkIcon3 : '#979797',
    checkIcon4 : '#979797',
    checkIcon5 : '#979797',
    checkIcon6 : '#979797',
    checkIcon7 : '#979797',
    checkIcon8 : '#979797'
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
          <div syle={{marginLeft : '20px', marginTop : '45px'}}>
            <Box column alignItems="flex-start" justifyContent="flex-start" style={{marginTop:'40px', marginLeft : '30px'}}>
              <p>Atti di concessione o fitto d'azienda o di ramo di azienda:</p>
              <Box justifyContent="flex-start" alignItems="center">
                <FlatButton label="Carica File" icon={<Attach />} style={{marginTop:'10px'}}>
                    <input type="file" style={{cursor: 'pointer',position: 'absolute',top: 5,bottom: 0,right: 0,left: 20,zIndex:3,width: '100%',opacity: 0}} accept="application/pdf" onChange={this._onFileInputChange.bind(this, 0)}/>
                </FlatButton>
                <Check style={{marginTop : '11px', marginLeft : '10px'}} color={this.state.checkIcon1}/>
              </Box>
            </Box>
            <Box column alignItems="flex-start" justifyContent="flex-start" style={{marginTop:'40px', marginLeft : '30px', marginBottom : '40px'}}>
              <p>Documentazione da cui si evinca la presenza dei requisiti richiesti ai fini dell'esercizio della concessione:</p>
              <Box justifyContent="flex-start" alignItems="center">
                <FlatButton label="Carica File" icon={<Attach />} style={{marginTop:'10px'}}>
                      <input type="file" style={{cursor: 'pointer',position: 'absolute',top: 5,bottom: 0,right: 0,left: 20,zIndex:3,width: '100%',opacity: 0}} accept="application/pdf" onChange={this._onFileInputChange.bind(this, 1)}/>
                </FlatButton>
                <Check style={{marginTop : '11px', marginLeft : '10px'}} color={this.state.checkIcon2}/>
              </Box>
            </Box>
          </div>
        );
      break;
      case '1':
        return (
          <div syle={{marginLeft : '20px', marginTop : '45px'}}>
            <Box column alignItems="flex-start" justifyContent="flex-start" style={{marginTop:'40px', marginLeft : '30px'}}>
              <p>Atti che hanno portato alla variazione dell'assetto aziendale:</p>
              <Box justifyContent="flex-start" alignItems="center">
                <FlatButton label="Carica File" icon={<Attach />} style={{marginTop:'10px'}}>
                      <input type="file" style={{cursor: 'pointer',position: 'absolute',top: 5,bottom: 0,right: 0,left: 20,zIndex:3,width: '100%',opacity: 0}} accept="application/pdf" onChange={this._onFileInputChange.bind(this, 2)}/>
                </FlatButton>
                <Check style={{marginTop : '11px', marginLeft : '10px'}} color={this.state.checkIcon3}/>
              </Box>
            </Box>
            <Box column alignItems="flex-start" justifyContent="flex-start" style={{marginTop:'40px', marginLeft : '30px', marginBottom : '40px'}}>
              <p>Documentazione da cui si evinca la presenza dei requisiti richiesti ai fini dell'esercizio della concessione:</p>
              <Box justifyContent="flex-start" alignItems="center">
                <FlatButton label="Carica File" icon={<Attach />} style={{marginTop:'10px'}}>
                    <input type="file" style={{cursor: 'pointer',position: 'absolute',top: 5,bottom: 0,right: 0,left: 20,zIndex:3,width: '100%',opacity: 0}} accept="application/pdf" onChange={this._onFileInputChange.bind(this, 3)}/>
                  </FlatButton>
                  <Check style={{marginTop : '11px', marginLeft : '10px'}} color={this.state.checkIcon4}/>
              </Box>
            </Box>
        </div>
        );
      break;
      case '2':
        return (
          <div syle={{marginLeft : '20px', marginTop : '45px'}}>
            <Box column alignItems="flex-start" justifyContent="flex-start" style={{marginTop:'40px', marginLeft : '30px'}}>
              <p>Atti di vendita o aggiudicazione delle opere o impianti:</p>
              <Box justifyContent="flex-start" alignItems="center">
                <FlatButton label="Carica File" icon={<Attach />} style={{marginTop:'10px'}}>
                      <input type="file" style={{cursor: 'pointer',position: 'absolute',top: 5,bottom: 0,right: 0,left: 20,zIndex:3,width: '100%',opacity: 0}} accept="application/pdf" onChange={this._onFileInputChange.bind(this, 4)}/>
                </FlatButton>
                <Check style={{marginTop : '11px', marginLeft : '10px'}} color={this.state.checkIcon5}/>
              </Box>
            </Box>
            <Box column alignItems="flex-start" justifyContent="flex-start" style={{marginTop:'40px', marginLeft : '30px', marginBottom : '40px'}}>
              <p>Documentazione da cui si evinca la presenza dei requisiti richiesti ai fini dell'esercizio della concessione:</p>
              <Box justifyContent="flex-start" alignItems="center">
                <FlatButton label="Carica File" icon={<Attach />} style={{marginTop:'10px'}}>
                      <input type="file" style={{cursor: 'pointer',position: 'absolute',top: 5,bottom: 0,right: 0,left: 20,zIndex:3,width: '100%',opacity: 0}} accept="application/pdf" onChange={this._onFileInputChange.bind(this, 5)}/>
                </FlatButton>
                <Check style={{marginTop : '11px', marginLeft : '10px'}} color={this.state.checkIcon6}/>
              </Box>
            </Box>
        </div>
        );
      break;
      case '3':
      return (
        <div syle={{marginLeft : '20px', marginTop : '45px'}}>
          <Box column alignItems="flex-start" justifyContent="flex-start" style={{marginTop:'40px', marginLeft : '30px'}}>
            <p>Certificato di morte e atti ereditari:</p>
            <Box justifyContent="flex-start" alignItems="center">
              <FlatButton label="Carica File" icon={<Attach />} style={{marginTop:'10px'}}>
                  <input type="file" style={{cursor: 'pointer',position: 'absolute',top: 5,bottom: 0,right: 0,left: 20,zIndex:3,width: '100%',opacity: 0}} accept="application/pdf" onChange={this._onFileInputChange.bind(this, 6)}/>
                </FlatButton>
                <Check style={{marginTop : '11px', marginLeft : '10px'}} color={this.state.checkIcon7}/>
            </Box>
          </Box>
          <Box column alignItems="flex-start" justifyContent="flex-start" style={{marginTop:'40px', marginLeft : '30px', marginBottom : '40px'}}>
            <p>Documentazione da cui si evinca la presenza dei requisiti richiesti ai fini dell'esercizio della concessione:</p>
            <Box justifyContent="flex-start" alignItems="center">
              <FlatButton label="Carica File" icon={<Attach />} style={{marginTop:'10px'}}>
                  <input type="file" style={{cursor: 'pointer',position: 'absolute',top: 5,bottom: 0,right: 0,left: 20,zIndex:3,width: '100%',opacity: 0}} accept="application/pdf" onChange={this._onFileInputChange.bind(this, 7)}/>
                </FlatButton>
                <Check style={{marginTop : '11px', marginLeft : '10px'}} color={this.state.checkIcon8}/>
            </Box>
          </Box>
      </div>
      );
      break;
      default :
       return null;
    }
  }

  render(){
    return(
      <div style={{marginLeft:'20px', marginTop:'20px'}}>
        <RadioButtonGroup name="shipSpeed" onChange={this._onRadioChange.bind(this)}>
          <RadioButton
            value="0"
            label="Cessione o fitto di un'azienda, con subingresso a favore del concessionario o locatorio di azienda"
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
