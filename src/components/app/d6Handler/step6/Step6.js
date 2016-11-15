import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Chart from 'material-ui/svg-icons/editor/insert-chart';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Compile from 'material-ui/svg-icons/action/assignment';

//https://docs.google.com/spreadsheets/d/1J2koBB4QvH1KnqWzp_65pumns3lrIU2WDGJ-JuqVI3Q/pubhtml?gid=0&single=true
class Step6 extends React.Component{

  constructor(props, context) {
    super(props, context);
    console.log(props);
    console.log(context);
  }

  state = {}

  _goToPage(who){
    switch (who) {
      case 'a':
        window.open('https://docs.google.com/spreadsheets/d/1J2koBB4QvH1KnqWzp_65pumns3lrIU2WDGJ-JuqVI3Q/pub?output=xlsx');
        break;
      default:

    }
  }

  render(){
    return(
      <div style={{marginLeft:'20px'}}>
            <br/><p>Fornisci informazioni su:</p>
            <p style={{marginLeft:'20px'}}>Tasse di registro: <TextField hintText="0.00" style={{ marginLeft:'20px', width:'90px'}}/></p>
            <p style={{marginLeft:'20px'}}>Oneri accessori: <TextField hintText="0.00" style={{ marginLeft:'20px', width:'90px'}}/></p>
            <br/><br/>
            <p>Compila uno dei seguenti documenti:</p>
              <RaisedButton
                label="Compila Richiesta Adempimenti"
                primary={true}
                icon={<Compile />}
                labelStyle={{color:'#FFFFFF'}}
                style={{marginTop:'10px' , marginLeft : '20px'}}
              />
            <br/><br/>
              <RaisedButton
                label="Compila Atto di Autorizzazione"
                primary={true}
                icon={<Compile />}
                labelStyle={{color:'#FFFFFF'}}
                style={{marginTop:'10px', marginLeft : '20px', marginBottom : '50px'}}
              />
      </div>
    );
  }

}

export default Step6;
