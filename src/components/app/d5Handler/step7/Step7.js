import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

//https://docs.google.com/spreadsheets/d/1J2koBB4QvH1KnqWzp_65pumns3lrIU2WDGJ-JuqVI3Q/pubhtml?gid=0&single=true
class Step7 extends React.Component{

  constructor(props, context) {
    super(props, context);
  }

  state = {}

  _goToPage(who){

  }

  render(){
    return(
      <div style={{marginLeft:'20px'}}>
          <p>Compila, come ultimo step, i seguenti documenti:</p>
          <RaisedButton
            label="Compila Richiesta Adempimenti"
            backgroundColor ='#4CA7D0'
            labelStyle={{color:'#FFFFFF'}}
            style={{marginTop:'10px'}}
          /><br/>
          <RaisedButton
            label="Compila Atto di Anticipata"
            backgroundColor ='#4CA7D0'
            labelStyle={{color:'#FFFFFF'}}
            style={{marginTop:'10px', marginTop:'20px'}}
          />
      </div>
    );
  }

}

export default Step7;
