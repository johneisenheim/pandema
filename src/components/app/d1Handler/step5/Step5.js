import React from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import Check from 'material-ui/svg-icons/action/check-circle';

class Step5 extends React.Component{

  state = {
    currentCheck : greatObject.d1.diniego !== undefined ? ( !greatObject.d1.diniego ? 'calculate' : 'deny') : 'deny',
    buttonDisabled : false
  }

  _onRadioChange(e,v){
    this.state.currentCheck = v;
    this.state.buttonDisabled = false;
    this.setState(this.state);
    v === 'deny' ? greatObject.d1.diniego = false : greatObject.d1.diniego = true;
  }

  //chiamata dal padre
  getDiniego(){
    return this.state.currentCheck;
  }

  render(){
    return(
      <div style={{marginLeft:'20px'}}>
        <p>
          Inserire esito della compatibilità con il piano di utilizzo della costa o altri atti di pianificazione:
        </p>
        <div style={{marginTop:'30px'}}>
          <RadioButtonGroup name="step5" defaultSelected="deny" onChange={this._onRadioChange.bind(this)}>
            <RadioButton
              value="deny"
              label="Diniego per struttura favorevole"
              style={styles.radioButton}
            />
            <RadioButton
              value="calculate"
              label="Calcolo del canone e rilascio dell'atto di concessione"
              style={styles.radioButton}
            />
          </RadioButtonGroup>
        </div>
        <br/>
      </div>
    )
  }

}

const styles = {
  radioButton : {
    marginLeft : '10px',
    marginTop : '10px'
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
  firstStepAddingsStyle :{
    margin : '10px'
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}

export default Step5;
