import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import $ from 'jquery';
import Box from 'react-layout-components';
import CircularProgress from 'material-ui/CircularProgress';
import Chart from 'material-ui/svg-icons/editor/insert-chart';

//https://docs.google.com/spreadsheets/d/1J2koBB4QvH1KnqWzp_65pumns3lrIU2WDGJ-JuqVI3Q/pubhtml?gid=0&single=true
class Imposte extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading : true,
      value : 0,
      isBolloDefined : false,
      isNumeroPagineDefined : false,
      imposta_bollo_a_id : undefined,
      imposta_bollo_b_id : undefined,
      numeroPagineID : undefined,
      data : [],
      numero_pagine : '',
      totale : undefined,
      imposta_bollo_a : '',
      p_imposta_bollo_a : '',
      imposta_bollo_b : '',
      p_imposta_bollo_b : ''
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
          if( parsed.results.length == 0 ){
            _self.setState({
              ..._self.state,
              isLoading : false,
              isBolloDefined : false,
              isNumeroPagineDefined : false,
              imposta_bollo_a : '',
              p_imposta_bollo_a : '',
              imposta_bollo_b : '',
              p_imposta_bollo_b : ''
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
                _self.state.value = Number(parsed.results[i].tipo_imposta_id);
                _self.state.isBolloDefined = true;
                _self.state.imposta_bollo_a_id = parsed.results[i].imposta_id;
                _self.state.imposta_bollo_a = parsed.results[i].valore;
                _self.state.p_imposta_bollo_a = parsed.results[i].valore;
              break;
              case 3:
                _self.state.value = Number(parsed.results[i].tipo_imposta_id);
                _self.state.isBolloDefined = true;
                _self.state.imposta_bollo_b_id = parsed.results[i].imposta_id;
                _self.state.imposta_bollo_b = parsed.results[i].valore;
                _self.state.p_imposta_bollo_b = parsed.results[i].valore;
              break;

            }
          }
          _self.state.isLoading = false;
          _self.state.data = parsed.results;
          _self.setState(_self.state);
        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
        }
    });
  }

  onChangeHandler(e,v){
    toggleLoader.emit('toggleLoader');
    var _self = this;
    var url = '';
    var value = undefined;
    if(this.state.isBolloDefined){
      //update
      if(v == 2){
        value = 2 * this.state.numero_pagine;
      }else{
        value = 16 * (this.state.numero_pagine/4);
      }
      url = constants.DB_ADDR+'updateBollo?dbid='+_self.props.dbid+'&pid='+_self.props.pid+'&value='+escape(v)+'&iid='+escape(this.state.impostaID)+'&tot='+escape(value);
    }else{
      //insert
      if(v == 2){
        value = 2 * this.state.numero_pagine;
      }else{
        value = 16 * (this.state.numero_pagine/4);
      }
      url = constants.DB_ADDR+'addBollo?dbid='+_self.props.dbid+'&pid='+_self.props.pid+'&value='+escape(v)+'&tot='+escape(value);
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
            value : v,
            totale : value
          });

        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
          toggleLoader.emit('toggleLoader');
        }
    });
  }

  onConfirm(){
    var _self = this;
    var value = parseFloat(this.refs.numero_pagine.getValue());
    if(isNaN(value)){
      alert("Devi inserire un numero nel campo specificato");
      return;
    }
    toggleLoader.emit('toggleLoader');
    var command = undefined;
    if(this.state.isNumeroPagineDefined){
      command = constants.DB_ADDR+'updateNumeroPagine'+'?pid='+_self.props.pid+'&dbid='+_self.props.dbid+'&value='+escape(value)+'&iid='+escape(_self.state.numeroPagineID);
    }else command = constants.DB_ADDR+'addNumeroPagine'+'?pid='+_self.props.pid+'&dbid='+_self.props.dbid+'&value='+escape(value);
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
          alert("Errore : "+ JSON.stringify(err));
          _self.reload();
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
          if( parsed.results.length == 0 ){
            _self.setState({
              ..._self.state,
              isLoading : false,
              isBolloDefined : false,
              isNumeroPagineDefined : false,
              imposta_bollo_a : '',
              p_imposta_bollo_a : '',
              imposta_bollo_b : '',
              p_imposta_bollo_b : ''
            });
            return;
          }
          _self.setState({
            ..._self.state,
            imposta_bollo_a : '',
            p_imposta_bollo_a : '',
            imposta_bollo_b : '',
            p_imposta_bollo_b : ''
          })
          for ( var i = 0; i < parsed.results.length; i++ ){
            switch(parsed.results[i].tipo_imposta_id){
              case 1:
                //numero pagine atto
                _self.state.numero_pagine = Number(parsed.results[i].valore);
                _self.state.isNumeroPagineDefined = true;
                _self.state.numeroPagineID = parsed.results[i].imposta_id;
              break;
              case 2:
                _self.state.value = Number(parsed.results[i].tipo_imposta_id);
                _self.state.isBolloDefined = true;
                _self.state.imposta_bollo_a_id = parsed.results[i].imposta_id;
                _self.state.imposta_bollo_a = parsed.results[i].valore;
                _self.state.p_imposta_bollo_a = parsed.results[i].valore;
              break;
              case 3:
                _self.state.value = Number(parsed.results[i].tipo_imposta_id);
                _self.state.isBolloDefined = true;
                _self.state.imposta_bollo_b_id = parsed.results[i].imposta_id;
                _self.state.imposta_bollo_b = parsed.results[i].valore;
                _self.state.p_imposta_bollo_b = parsed.results[i].valore;
              break;

            }
            _self.state.isLoading = false;
            _self.state.data = parsed.results;
            _self.setState(_self.state);
          }

        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
        }
    });
  }

  onChangeTextField(){
    this.setState({
      ...this.state,
      numero_pagine : this.refs.numero_pagine.getValue()
    })
  }

  /*
  <RadioButtonGroup name="bollo" defaultSelected={this.state.value} onChange={this.onChangeHandler.bind(this)} style={{marginTop:'20px'}}>
    <RadioButton
      value={2}
      label="Imposta di bollo (2.00€)"
      style={{marginBottom:'10px'}}
    />
    <RadioButton
      value={3}
      label="Imposta di bollo (16.00€)"
    />
  */

  downloadModulo(who){
    window.open(LINKS.imposta_bollo, '_blank');
  }

  onChange(){

  }

  onConfirmImposta(who){
    if(this.state.numero_pagine === ''){
      alert("Attenzione! Dovresti inserire prima il numero di pagine");
      return;
    }
    var _self = this;
    var value = parseFloat(this.refs[who].getValue());
    if(isNaN(value)){
      alert("Devi inserire un numero nelle imposte");
      return;
    }
    toggleLoader.emit('toggleLoader');
    //command = constants.DB_ADDR+'updateNumeroPagine'+'?pid='+_self.props.pid+'&dbid='+_self.props.dbid+'&value='+escape(value)+'&iid='+escape(_self.state.numeroPagineID);
    var v = undefined;
    switch(who){
      case 'imposta_bollo_a':
        v = 2;
      break;
      case 'imposta_bollo_b':
        v = 3;
      break;
    }
    $.ajax({
        type: 'GET',
        url: constants.DB_ADDR+'addBollo?dbid='+_self.props.dbid+'&pid='+_self.props.pid+'&value='+escape(v)+'&tot='+escape(_self.refs[who].getValue()),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          toggleLoader.emit('toggleLoader');
          _self.reload();
        },
        error : function(err){
          toggleLoader.emit('toggleLoader');
          alert("Errore : "+ JSON.stringify(err));
          _self.reload();
        }
    });
  }

  onDelete(who){
    var _self = this;
    toggleLoader.emit('toggleLoader');
    var imposta = undefined;
    switch(who){
      case 'imposta_bollo_a':
        imposta = this.state.imposta_bollo_a_id;
      break;
      case 'imposta_bollo_b':
        imposta = this.state.imposta_bollo_b_id;
      break;
    }
    $.ajax({
        type: 'GET',
        url: constants.DB_ADDR+'deleteBollo?iid='+escape(imposta),
        processData: false,
        contentType: false,
        success: function(data) {
          toggleLoader.emit('toggleLoader');
          _self.reload();
        },
        error : function(err){
          toggleLoader.emit('toggleLoader');
          alert("Errore : "+ JSON.stringify(err));
          _self.reload();
        }
    });
  }

  onModify(who){
      var _self = this;
      var id = undefined;
      if(this.refs[who].getValue() === ''){
        alert("Non puoi modificare il campo come vuoto. Se vuoi elimnare il valore, clicca su Elimina.");
        return;
      }
      if(!isNaN(this.refs[who].getValue())){
        alert("Il valore del campo non è un numero. Inserisci in un formato x.xx");
        return;
      }
      switch(who){
        case 'imposta_bollo_a':
          id = this.state.imposta_bollo_a_id;
        break;
        case 'imposta_bollo_b':
          id = this.state.imposta_bollo_b_id;
        break;
      }
      toggleLoader.emit('toggleLoader');
      $.ajax({
          type: 'GET',
          url: constants.DB_ADDR+'updateBollo?value='+escape(_self.refs[who].getValue())+'&iid='+escape(id),
          processData: false,
          contentType: false,
          success: function(data) {
            var parsed = JSON.parse(data);
            toggleLoader.emit('toggleLoader');
            _self.reload();
          },
          error : function(err){
            toggleLoader.emit('toggleLoader');
            alert("Errore : "+ JSON.stringify(err));
            _self.reload();
          }
      });
  }

  onChangeImposta(e,v,k){
    switch(e){
      case 'imposta_bollo_a':
        this.setState({
          ...this.state,
          imposta_bollo_a : k
        })
      break;
      case 'imposta_bollo_b':
        this.setState({
          ...this.state,
          imposta_bollo_b : k
        })
      break;
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
      var totale = undefined;
      return(
        <Box column justifyContent="center" alignItems="flex-start" style={{marginLeft:'20px'}}>
            <Box justifyContent="flex-start" alignItems="flex-start" style={{marginLeft:'20px', marginTop:'10px'}}>
              <p>Numero pagine dell'atto:</p>
              <TextField hintText="Numero pagine atto" ref="numero_pagine" style={{ marginLeft:'30px', width:'180px'}} value={this.state.numero_pagine} onChange={this.onChangeTextField.bind(this)}/>
              <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '20px', marginTop:'5px'}} onTouchTap={this.onConfirm.bind(this,'numero_pagine')} disabled={this.state['numero_pagine'] === ''}/>
            </Box>
            <Box style={{marginTop:'20px'}}>
              <FlatButton label="Imposta di Bollo (2.00€)" icon={<Chart />} style={{marginTop:'10px'}} onTouchTap={this.downloadModulo.bind(this,'imposta_bollo_a')}/><TextField hintText="0.00" value={this.state['imposta_bollo_a']} ref="imposta_bollo_a" style={{ marginLeft:'20px', width:'90px'}} onChange={this.onChangeImposta.bind(this, 'imposta_bollo_a')}/>
                {this.state['p_imposta_bollo_a'] === ''
                  ?
                  <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onConfirmImposta.bind(this,'imposta_bollo_a')} disabled={this.state['imposta_bollo_a'] === ''}/>
                  :
                  <span><FlatButton label="Modifica" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onModify.bind(this,'imposta_bollo_a')}/><FlatButton label="Elimina" backgroundColor='#FFFFFF' style={{marginLeft: '10px', color:'red'}} onTouchTap={this.onDelete.bind(this,'imposta_bollo_a')}/></span>
                }
            </Box>
            <Box style={{marginBottom:'20px'}}>
              <FlatButton label="Imposta di Bollo (16.00€)" icon={<Chart />} style={{marginTop:'10px'}} onTouchTap={this.downloadModulo.bind(this,'imposta_bollo_b')}/><TextField hintText="0.00" value={this.state['imposta_bollo_b']} ref="imposta_bollo_b" style={{ marginLeft:'20px', width:'90px'}} onChange={this.onChangeImposta.bind(this, 'imposta_bollo_b')}/>
                {this.state['p_imposta_bollo_b'] === ''
                  ?
                  <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onConfirmImposta.bind(this,'imposta_bollo_b')} disabled={this.state['imposta_bollo_b'] === ''}/>
                  :
                  <span><FlatButton label="Modifica" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onModify.bind(this,'imposta_bollo_b')}/><FlatButton label="Elimina" backgroundColor='#FFFFFF' style={{marginLeft: '10px', color:'red'}} onTouchTap={this.onDelete.bind(this,'imposta_bollo_b')}/></span>
                }
              </Box>
        </Box>
      );
    }
  }

}

export default Imposte;
