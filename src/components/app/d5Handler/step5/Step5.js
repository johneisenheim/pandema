import React from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import Check from 'material-ui/svg-icons/action/check-circle';

import $ from 'jquery';
import CircularProgress from 'material-ui/CircularProgress';
import Box from 'react-layout-components';
import RichiestaAnticipata from './RichiestaAnticipata';
import RichiestaAdempimenti from './RichiestaAdempimenti';

class Step7 extends React.Component{

  constructor(props,context){
    super(props, context);
    this.state = {
      isLoading : true,
      data : []
    }
    this.praticaPath = undefined;
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'handled1s7?id='+_self.props.dbid+'&pandema_id='+_self.props.pid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          ;
          _self.praticaPath = parsed.results[0].path;
          _self.setState({
            ..._self.state,
            isLoading : false
          })
        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
          ;
        }
    });
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
        <div style={{marginLeft:'20px'}}>
          <RichiestaAdempimenti pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
          <RichiestaAnticipata pid={this.props.pid} dbid={this.props.dbid} path={this.praticaPath}/>
        </div>
      );
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
    marginRight : '20px'
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}

export default Step7;
