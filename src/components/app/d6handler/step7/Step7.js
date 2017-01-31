import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Chart from 'material-ui/svg-icons/editor/insert-chart';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import Box from 'react-layout-components';
import $ from 'jquery';

//https://docs.google.com/spreadsheets/d/1J2koBB4QvH1KnqWzp_65pumns3lrIU2WDGJ-JuqVI3Q/pubhtml?gid=0&single=true
class Step7 extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading : true,
      data : [],
      tasse_di_registro : '',
      oneri_accessori : '',
      cauzione : '',
      p_tasse_di_registro : '',
      p_oneri_accessori : '',
      p_cauzione : '',
    }
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        url: constants.DB_ADDR+'handled4s7?pid='+_self.props.pid+'&dbid='+_self.props.dbid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          if(parsed.imposta !== undefined){
            for( var i = 0; i < parsed.imposta.length; i++){
              _self.state[parsed.imposta[i].descrizione] = parsed.imposta[i].valore;
              var str = 'p_'+parsed.imposta[i].descrizione;
              _self.state[str] = parsed.imposta[i].valore;
            }
          }
          _self.state.isLoading = false;
          _self.state.data = parsed;
          _self.setState(_self.state);
        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
          ;
        }
    });
  }

  _goToPage(who){
    switch (who) {
      case 'a':
        window.open('https://docs.google.com/spreadsheets/d/1J2koBB4QvH1KnqWzp_65pumns3lrIU2WDGJ-JuqVI3Q/pub?output=xlsx');
        break;
      default:

    }
  }

  onChange(who, ref){
    this.state[who] = this.refs[ref].getValue();
    this.setState(this.state);
  }

  onConfirm(who){
    var _self = this;
    if(this.refs[who].getValue() === '')
      return;
    var value = parseFloat(this.refs[who].getValue());
    if(isNaN(value)){
      alert("Devi inserire un numero del formato x.xx");
      return;
    }
    toggleLoader.emit('toggleLoader');
    var command = undefined;
    switch(who){
      case 'tasse_di_registro':
      case 'oneri_accessori':
      case 'cauzione' :
        command = 'addImposta';
      break;
    }
    $.ajax({
        type: 'GET',
        url: constants.DB_ADDR+command+'?pid='+_self.props.pid+'&dbid='+_self.props.dbid+'&value='+escape(value)+'&who='+escape(who),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          ;
          toggleLoader.emit('toggleLoader');
          _self.reload();
        },
        error : function(err){
          toggleLoader.emit('toggleLoader');
          alert("Errore : "+ JSON.stringify(err));
          _self.reload();
          ;
        }
    });
  }

  onModify(who){
    var entity = undefined;
    var _self = this;
    toggleLoader.emit('toggleLoader');
    switch(who){
      case 'tasse_di_registro':
      case 'oneri_accessori':
      case 'cauzione' :
        entity = 'imposta';
      break;
    }
    var arr = this.state.data[entity];
    var id = undefined;
    for( var i = 0; i < arr.length; i++){
      if(arr[i].descrizione === who){
        id = arr[i].id;
        break;
      }
    }
    var value = this.refs[who].getValue();
    $.ajax({
        type: 'GET',
        url: constants.DB_ADDR+'modify'+entity+'?pid='+_self.props.pid+'&dbid='+_self.props.dbid+'&id='+escape(id)+'&value='+escape(value),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          ;
          toggleLoader.emit('toggleLoader');
          _self.reload();
        },
        error : function(err){
          toggleLoader.emit('toggleLoader');
          alert("Errore : "+ JSON.stringify(err));
          _self.reload();
          ;
        }
    });
  }

  onDelete(who){
    var entity = undefined;
    var _self = this;
    toggleLoader.emit('toggleLoader');
    switch(who){
      case 'tasse_di_registro':
      case 'oneri_accessori':
        entity = 'imposta';
      break;
    }
    var arr = this.state.data[entity];
    var id = undefined;
    for( var i = 0; i < arr.length; i++){
      if(arr[i].descrizione === who){
        id = arr[i].id;
        break;
      }
    }
    $.ajax({
        type: 'GET',
        url: constants.DB_ADDR+'delete'+entity+'?pid='+_self.props.pid+'&dbid='+_self.props.dbid+'&id='+escape(id),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          ;
          toggleLoader.emit('toggleLoader');
          _self.reload();
        },
        error : function(err){
          toggleLoader.emit('toggleLoader');
          alert("Errore : "+ JSON.stringify(err));
          _self.reload();
          ;
        }
    });
  }

  reload(){
    var _self = this;
    this.setState({
      ...this.state,
      isLoading : true
    });
    $.ajax({
        type: 'GET',
        url: constants.DB_ADDR+'handled4s7?pid='+_self.props.pid+'&dbid='+_self.props.dbid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.state['tasse_di_registro'] = '';
          _self.state['oneri_accessori'] = '';
          _self.state['cauzione'] = '';
          if(parsed.imposta !== undefined){
            if(parsed.imposta.length === 0){
              _self.state['tasse_di_registro'] = '';
              _self.state['oneri_accessori'] = '';
              _self.state['cauzione'] = '';
              _self.state['p_tasse_di_registro'] = '';
              _self.state['p_oneri_accessori'] = '';
              _self.state['p_cauzione'] = '';
            }else{
              for( var i = 0; i < parsed.imposta.length; i++){
                _self.state[parsed.imposta[i].descrizione] = parsed.imposta[i].valore;
                var str = 'p_'+parsed.imposta[i].descrizione;
                _self.state[str] = parsed.imposta[i].valore;
              }
            }
          }
          _self.state.isLoading = false;
          _self.state.data = parsed;
          _self.setState(_self.state);
        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
          ;
        }
    });
  }

  render(){
    if( this.state.isLoading ){
      return(
        <Box alignItems="center" justifyContent="center" style={{width:'100%', height : '300px'}}>
          <CircularProgress size={30}/>
        </Box>
      )
    }else{
      return(
        <div style={{marginLeft:'20px'}}>
            <br/><p>Fornisci informazioni su:</p>
            <FlatButton label="Tasse di Registro" icon={<Chart />} style={{marginTop:'10px'}} onClick={this._goToPage.bind(this,'a')}/><TextField hintText="0.00" value={this.state['tasse_di_registro']} ref="tasse_di_registro" style={{ marginLeft:'20px', width:'90px'}} onChange={this.onChange.bind(this, 'tasse_di_registro', 'tasse_di_registro')}/>
            {this.state['p_tasse_di_registro'] === ''
              ?
              <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onConfirm.bind(this,'tasse_di_registro')} disabled={this.state['tasse_di_registro'] === ''}/>
              :
              <span><FlatButton label="Modifica" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onModify.bind(this,'tasse_di_registro')}/><FlatButton label="Elimina" backgroundColor='#FFFFFF' style={{marginLeft: '10px', color:'red'}} onTouchTap={this.onDelete.bind(this,'tasse_di_registro')}/></span>
            }<br/>
          <FlatButton label="Oneri Accessori" icon={<Chart />} style={{marginTop:'10px'}} onClick={this._goToPage.bind(this,'a')}/> <TextField hintText="0.00" value={this.state['oneri_accessori']} ref="oneri_accessori" style={{ marginLeft:'20px', width:'90px'}} onChange={this.onChange.bind(this, 'oneri_accessori', 'oneri_accessori')}/>
          {this.state['p_oneri_accessori'] === ''
            ?
            <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onConfirm.bind(this,'oneri_accessori')} disabled={this.state['oneri_accessori'] === ''}/>
            :
            <span><FlatButton label="Modifica" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onModify.bind(this,'oneri_accessori')}/><FlatButton label="Elimina" backgroundColor='#FFFFFF' style={{marginLeft: '10px', color:'red'}} onTouchTap={this.onDelete.bind(this,'oneri_accessori')}/></span>
          }<br/>
          <FlatButton label="Cauzione" icon={<Chart />} style={{marginTop:'10px'}} onClick={this._goToPage.bind(this,'a')}/> <TextField hintText="0.00" value={this.state['cauzione']} ref="cauzione" style={{ marginLeft:'20px', width:'90px'}} onChange={this.onChange.bind(this, 'cauzione', 'cauzione')}/>
            {this.state['p_cauzione'] === ''
              ?
              <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onConfirm.bind(this,'cauzione')} disabled={this.state['cauzione'] === ''}/>
              :
              <span><FlatButton label="Modifica" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onModify.bind(this,'cauzione')}/><FlatButton label="Elimina" backgroundColor='#FFFFFF' style={{marginLeft: '10px', color:'red'}} onTouchTap={this.onDelete.bind(this,'cauzione')}/></span>
            }<br/>
        <br/>
        </div>
      );
    }
  }

}

export default Step7;
