import React from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import Check from 'material-ui/svg-icons/action/check-circle';

import $ from 'jquery';
import CircularProgress from 'material-ui/CircularProgress';
import Box from 'react-layout-components';

class Step5 extends React.Component{

  constructor(props,context){
    super(props, context);
    this.state = {
      isLoading : true,
      data : [],
      value : -1
    }
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'getStatoPratica?pid='+this.props.pid+'&dbid='+this.props.dbid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log('parsed');
          console.log(parsed.results[0].stato_pratica_id);
          if( Number(parsed.results[0].stato_pratica_id) === 3){
            _self.props.changeEndButtonTitleInNext();
          }else{
            _self.props.changeEndButtonTitleInEnd();
          }
          _self.setState({
            ..._self.state,
            isLoading : false,
            value : parsed.results[0].stato_pratica_id
          })
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });
  }

  _onRadioChange(e,v){
    var _self = this;
    this.setState({
      ...this.state,
      isLoading : true
    });
    if(v == 3){
      this.props.changeEndButtonTitleInNext();
    }else{
      this.props.changeEndButtonTitleInEnd();
    }
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'updateStatoPratica?pid='+_self.props.pid+'&dbid='+_self.props.dbid+'&value='+parseInt(v),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.setState({
            ..._self.state,
            isLoading : false,
            value : v
          })
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });

  }

  render(){
    if(this.state.isLoading){
      return(
        <Box alignItems="center" justifyContent="center" style={{width:'100%', height : '300px'}}>
          <CircularProgress size={30}/>
        </Box>
      )
    }else{
      return(
        <div style={{marginLeft:'20px'}}>
          <p>
            Inserire esito della compatibilità con il piano di utilizzo della costa o altri atti di pianificazione:
          </p>
          <div style={{marginTop:'30px'}}>
            <RadioButtonGroup name="step5" defaultSelected={this.state.value} onChange={this._onRadioChange.bind(this)}>
              <RadioButton
                value={4}
                label="Diniego per istruttoria sfavorevole"
                style={styles.radioButton}
              />
              <RadioButton
                value={3}
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
