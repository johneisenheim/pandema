import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

//https://docs.google.com/spreadsheets/d/1J2koBB4QvH1KnqWzp_65pumns3lrIU2WDGJ-JuqVI3Q/pubhtml?gid=0&single=true
class Step5 extends React.Component{

  constructor(props, context) {
    super(props, context);
  }

  state = {}

  _goToPage(who){

  }

  render(){
    return(
      <div style={{marginLeft:'20px'}}>
          <p>Una volta scaricato l'atto, per favore compila i seguenti campi: </p>
          <p>Numero pagine dell'atto: <TextField hintText="Numero pagine atto" style={{ marginLeft:'20px'}}/></p>
          <RadioButtonGroup name="shipSpeed" defaultSelected="0">
            <RadioButton
              value="0"
              label="Imposta di bollo (2.00€)"
              style={{marginBottom:'10px'}}
            />
            <RadioButton
              value="1"
              label="Imposta di bollo (16.00€)"

            />
          </RadioButtonGroup>
      </div>
    );
  }

}

export default Step5;
