import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import $ from 'jquery';
import Box from 'react-layout-components';
import CircularProgress from 'material-ui/CircularProgress';

//https://docs.google.com/spreadsheets/d/1J2koBB4QvH1KnqWzp_65pumns3lrIU2WDGJ-JuqVI3Q/pubhtml?gid=0&single=true
class Step5 extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading : true,
      value : 0,
      isBolloDefined : false,
      isNumeroPagineDefined : false,
      impostaID : undefined,
      numeroPagineID : undefined,
      data : [],
      numero_pagine : ''
    }
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'getBolloAndPagine?dbid='+_self.props.dbid+'&pid='+_self.props.pid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log(parsed);
          if( parsed.results.length == 0 ){
            _self.setState({
              ..._self.state,
              isLoading : false,
              isBolloDefined : false
            });
            return;
          }
          for ( var i = 0; i < parsed.results.length; i++ ){
            switch(parsed.results[i].tipo_imposta_id){
              case 1:
                //numero pagine atto
                _self.state.numero_pagine = parsed.results[i].valore;
                _self.state.isNumeroPagineDefined = true;
                _self.state.numeroPagineID = parsed.results[i].imposta_id;
              break;
              case 2:
              case 3:
                _self.state.value = Number(parsed.results[i].tipo_imposta_id);
                _self.state.isBolloDefined = true;
                _self.state.impostaID = parsed.results[i].imposta_id;
              break;

            }
            _self.state.isLoading = false;
            _self.state.data = parsed.results;
            _self.setState(_self.state);
          }
          console.log(_self.state);
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });
  }

  onChangeHandler(e,v){
    toggleLoader.emit('toggleLoader');
    var _self = this;
    var url = '';
    if(this.state.isBolloDefined){
      //update
      url = constants.DB_ADDR+'updateBollo?dbid='+_self.props.dbid+'&pid='+_self.props.pid+'&value='+escape(v)+'&iid='+escape(this.state.impostaID);
    }else{
      //insert
      url = constants.DB_ADDR+'addBollo?dbid='+_self.props.dbid+'&pid='+_self.props.pid+'&value='+escape(v);
    }
    $.ajax({
        type: 'GET',
        //data: formData,
        url: url,
        processData: false,
        contentType: false,
        success: function(data) {
          toggleLoader.emit('toggleLoader');
          var parsed = JSON.parse(data);
          _self.setState({
            ..._self.state,
            value : v
          });

        },
        error : function(err){
          alert('Errore : '+err);
          toggleLoader.emit('toggleLoader');
          console.log(err);
        }
    });
  }

  onConfirm(){
    var _self = this;
    var value = parseFloat(this.refs.numero_pagine.getValue());
    if(isNaN(value)){
      alert("Devi inserire un numero del formato x.xx");
      return;
    }
    toggleLoader.emit('toggleLoader');
    var command = undefined;
    if(this.state.isNumeroPagineDefined){
      command = constants.DB_ADDR+'updateNumeroPagine'+'?pid='+_self.props.pid+'&dbid='+_self.props.dbid+'&value='+escape(value)+'&iid='+escape(_self.state.numeroPagineID);
    }else command = constants.DB_ADDR+'addNumeroPagine'+'?pid='+_self.props.pid+'&dbid='+_self.props.dbid+'&value='+escape(value);
    console.log()
    $.ajax({
        type: 'GET',
        url: command,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          toggleLoader.emit('toggleLoader');
          _self.reload();
        },
        error : function(err){
          toggleLoader.emit('toggleLoader');
          alert('Errore : '+err);
          _self.reload();
          console.log(err);
        }
    });
  }

  reload(){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'getBolloAndPagine?dbid='+_self.props.dbid+'&pid='+_self.props.pid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log('reload');
          console.log(parsed);
          if( parsed.results.length == 0 ){
            _self.setState({
              ..._self.state,
              isLoading : false,
              isBolloDefined : false
            });
            return;
          }
          for ( var i = 0; i < parsed.results.length; i++ ){
            switch(parsed.results[i].tipo_imposta_id){
              case 1:
                //numero pagine atto
                _self.state.numero_pagine = Number(parsed.results[i].valore);
                _self.state.isNumeroPagineDefined = true;
                _self.state.numeroPagineID = parsed.results[i].imposta_id;
              break;
              case 2:
              case 3:
                _self.state.value = Number(parsed.results[i].tipo_imposta_id);
                _self.state.isBolloDefined = true;
                _self.state.impostaID = parsed.results[i].imposta_id;
              break;

            }
            _self.state.isLoading = false;
            _self.state.data = parsed.results;
            _self.setState(_self.state);
          }

        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });
  }

  onChangeTextField(){
    this.setState({
      ...this.state,
      numero_pagine : this.refs.numero_pagine.getValue()
    })
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
            <p>Una volta scaricato l'atto, per favore compila i seguenti campi: </p>
            <Box justifyContent="flex-start" alignItems="flex-start">
              <p>Numero pagine dell'atto:</p>
              <TextField hintText="Numero pagine atto" ref="numero_pagine" style={{ marginLeft:'30px', width:'180px'}} value={this.state.numero_pagine} onChange={this.onChangeTextField.bind(this)}/>
              <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '20px', marginTop:'5px'}} onTouchTap={this.onConfirm.bind(this,'numero_pagine')} disabled={this.state['numero_pagine'] === ''}/>
            </Box>
            <RadioButtonGroup name="shipSpeed" defaultSelected={this.state.value} onChange={this.onChangeHandler.bind(this)} style={{marginTop:'20px'}}>
              <RadioButton
                value={2}
                label="Imposta di bollo (2.00€)"
                style={{marginBottom:'10px'}}
              />
              <RadioButton
                value={3}
                label="Imposta di bollo (16.00€)"
              />
            </RadioButtonGroup>
        </div>
      );
    }
  }

}

export default Step5;
