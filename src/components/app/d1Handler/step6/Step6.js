import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Chart from 'material-ui/svg-icons/editor/insert-chart';
import TextField from 'material-ui/TextField';

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
          <p>Seleziona la tipologia del canone per visualizzare il foglio di calcolo: </p>
          <FlatButton label="Usi vari" icon={<Chart />} style={{marginTop:'10px'}} onClick={this._goToPage.bind(this,'a')}/><TextField hintText="0.00" style={{width:'90px', marginLeft:'20px'}}/><br/>
          <FlatButton label="Turistico e diporto" icon={<Chart />} style={{marginTop:'10px'}}/><TextField hintText="0.00" style={{width:'90px', marginLeft:'20px'}}/><br/>
          <FlatButton label="Pesca, acqua e cantieri" icon={<Chart />} style={{marginTop:'10px'}}/><TextField hintText="0.00"  style={{width:'90px', marginLeft:'20px'}}/><br/>
          <FlatButton label="Regione Campania" icon={<Chart />} style={{marginTop:'10px'}}/><TextField hintText="0.00"  style={{width:'90px', marginLeft:'20px'}}/><br/>
          <FlatButton label="Pertinenza Demaniale" icon={<Chart />} style={{marginTop:'10px'}}/><TextField hintText="0.00"  style={{width:'90px', marginLeft:'20px'}}/><br/>
      </div>
    );
  }

}

export default Step6;
