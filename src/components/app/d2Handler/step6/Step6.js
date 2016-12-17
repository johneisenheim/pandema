import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Chart from 'material-ui/svg-icons/editor/insert-chart';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import Box from 'react-layout-components';
import $ from 'jquery';

//https://docs.google.com/spreadsheets/d/1J2koBB4QvH1KnqWzp_65pumns3lrIU2WDGJ-JuqVI3Q/pubhtml?gid=0&single=true
class Step6 extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading : true,
      data : [],
      usi_vari : '',
      turistico_e_diporto : '',
      pesca_acqua_cantieri : '',
      regione_campania : '',
      pertinenza_demaniale : '',
      tasse_di_registro : '',
      oneri_accessori : '',
      p_usi_vari : '',
      p_turistico_e_diporto : '',
      p_pesca_acqua_cantieri : '',
      p_regione_campania : '',
      p_pertinenza_demaniale : '',
      p_tasse_di_registro : '',
      p_oneri_accessori : '',
      data : []
    }
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:8001/handled1s6?pid='+_self.props.pid+'&dbid='+_self.props.dbid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log(parsed);
          if(parsed.canone !== undefined){
            for( var i = 0; i < parsed.canone.length; i++){
              _self.state[parsed.canone[i].descrizione] = parsed.canone[i].valore;
              var str = 'p_'+parsed.canone[i].descrizione;
              _self.state[str] = parsed.canone[i].valore;
            }
          }
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
          console.log(_self.state)
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
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
      case 'usi_vari':
      case 'turistico_e_diporto':
      case 'pesca_acqua_cantieri':
      case 'regione_campania':
      case 'pertinenza_demaniale':
        command = 'addCanone';
      break;
      case 'tasse_di_registro':
      case 'oneri_accessori':
        command = 'addImposta';
      break;
    }
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:8001/'+command+'?pid='+_self.props.pid+'&dbid='+_self.props.dbid+'&value='+escape(value)+'&who='+escape(who),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log(parsed);
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

  onModify(who){
    var entity = undefined;
    var _self = this;
    toggleLoader.emit('toggleLoader');
    switch(who){
      case 'usi_vari':
      case 'turistico_e_diporto':
      case 'pesca_acqua_cantieri':
      case 'regione_campania':
      case 'pertinenza_demaniale':
        entity = 'canone';
      break;
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
    var value = this.refs[who].getValue();
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:8001/modify'+entity+'?pid='+_self.props.pid+'&dbid='+_self.props.dbid+'&id='+escape(id)+'&value='+escape(value),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log(parsed);
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

  onDelete(who){
    var entity = undefined;
    var _self = this;
    toggleLoader.emit('toggleLoader');
    switch(who){
      case 'usi_vari':
      case 'turistico_e_diporto':
      case 'pesca_acqua_cantieri':
      case 'regione_campania':
      case 'pertinenza_demaniale':
        entity = 'canone';
      break;
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
        url: 'http://127.0.0.1:8001/delete'+entity+'?pid='+_self.props.pid+'&dbid='+_self.props.dbid+'&id='+escape(id),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log(parsed);
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
    this.setState({
      ...this.state,
      isLoading : true
    });
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:8001/handled1s6?pid='+_self.props.pid+'&dbid='+_self.props.dbid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.state['usi_vari'] = '';
          _self.state['turistico_e_diporto'] = '';
          _self.state['pesca_acqua_cantieri'] = '';
          _self.state['regione_campania'] = '';
          _self.state['pertinenza_demaniale'] = '';
          _self.state['tasse_di_registro'] = '';
          _self.state['oneri_accessori'] = '';
          _self.state['p_usi_vari'] = '';
          _self.state['p_turistico_e_diporto'] = '';
          _self.state['p_pesca_acqua_cantieri'] = '';
          _self.state['p_regione_campania'] = '';
          _self.state['p_pertinenza_demaniale'] = '';
          _self.state['p_tasse_di_registro'] = '';
          _self.state['p_oneri_accessori'] = '';
          if(parsed.canone !== undefined){
            if(parsed.canone.length === 0){
              _self.state['usi_vari'] = '';
              _self.state['turistico_e_diporto'] = '';
              _self.state['pesca_acqua_cantieri'] = '';
              _self.state['regione_campania'] = '';
              _self.state['pertinenza_demaniale'] = '';
              _self.state['p_usi_vari'] = '';
              _self.state['p_turistico_e_diporto'] = '';
              _self.state['p_pesca_acqua_cantieri'] = '';
              _self.state['p_regione_campania'] = '';
              _self.state['p_pertinenza_demaniale'] = '';
            }else{
              for( var i = 0; i < parsed.canone.length; i++){
                _self.state[parsed.canone[i].descrizione] = parsed.canone[i].valore;
                var str = 'p_'+parsed.canone[i].descrizione;
                _self.state[str] = parsed.canone[i].valore;
              }
            }
          }
          if(parsed.imposta !== undefined){
            if(parsed.imposta.length === 0){
              _self.state['tasse_di_registro'] = '';
              _self.state['oneri_accessori'] = '';
              _self.state['p_tasse_di_registro'] = '';
              _self.state['p_oneri_accessori'] = '';
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
          console.log(_self.state);
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
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
            <p>Seleziona la tipologia del canone per visualizzare il foglio di calcolo: </p>
            <FlatButton label="Usi vari" icon={<Chart />} style={{marginTop:'10px'}} onClick={this._goToPage.bind(this,'a')}/><TextField hintText="0.00" ref="usi_vari" value={this.state['usi_vari']} onChange={this.onChange.bind(this, 'usi_vari', 'usi_vari')} style={{width:'90px', marginLeft:'20px'}}/>
            {
              this.state['p_usi_vari'] === ''
              ?
              <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onConfirm.bind(this,'usi_vari')} disabled={this.state['usi_vari'] === ''}/>
              :
              <span><FlatButton label="Modifica" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onModify.bind(this,'usi_vari')}/> <FlatButton label="Elimina" backgroundColor='#FFFFFF' style={{marginLeft: '10px', color:'red'}} onTouchTap={this.onDelete.bind(this,'usi_vari')}/></span>
            }<br/>
            <FlatButton label="Turistico e diporto" icon={<Chart />} style={{marginTop:'10px'}}/><TextField hintText="0.00" value={this.state['turistico_e_diporto']} style={{width:'90px', marginLeft:'20px'}} ref="turistico_e_diporto" onChange={this.onChange.bind(this, 'turistico_e_diporto', 'turistico_e_diporto')}/>
            {
              this.state['p_turistico_e_diporto'] === ''
              ?
              <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onConfirm.bind(this,'turistico_e_diporto')} disabled={this.state['turistico_e_diporto'] === ''}/>
              :
              <span><FlatButton label="Modifica" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onModify.bind(this,'turistico_e_diporto')}/> <FlatButton label="Elimina" backgroundColor='#FFFFFF' style={{marginLeft: '10px', color:'red'}} onTouchTap={this.onDelete.bind(this,'turistico_e_diporto')}/></span>
            }<br/>
          <FlatButton label="Pesca, acqua e cantieri" icon={<Chart />} style={{marginTop:'10px'}}/><TextField hintText="0.00" value={this.state['pesca_acqua_cantieri']} style={{width:'90px', marginLeft:'20px'}} ref="pesca_acqua_cantieri" onChange={this.onChange.bind(this, 'pesca_acqua_cantieri', 'pesca_acqua_cantieri')}/>
            {
              this.state['p_pesca_acqua_cantieri'] === ''
              ?
              <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onConfirm.bind(this,'pesca_acqua_cantieri')} disabled={this.state['pesca_acqua_cantieri'] === ''}/>
              :
              <span><FlatButton label="Modifica" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onModify.bind(this,'pesca_acqua_cantieri')}/><FlatButton label="Elimina" backgroundColor='#FFFFFF' style={{marginLeft: '10px', color:'red'}} onTouchTap={this.onDelete.bind(this,'pesca_acqua_cantieri')}/></span>
            }<br/>
          <FlatButton label="Regione Campania" icon={<Chart />} style={{marginTop:'10px'}}/><TextField hintText="0.00" value={this.state['regione_campania']} style={{width:'90px', marginLeft:'20px'}} ref="regione_campania" onChange={this.onChange.bind(this, 'regione_campania', 'regione_campania')}/>
            {this.state['p_regione_campania'] === ''
              ?
              <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onConfirm.bind(this,'regione_campania')} disabled={this.state['regione_campania'] === ''}/>
              :
              <span><FlatButton label="Modifica" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onModify.bind(this,'regione_campania')}/><FlatButton label="Elimina" backgroundColor='#FFFFFF' style={{marginLeft: '10px', color:'red'}} onTouchTap={this.onDelete.bind(this,'regione_campania')}/></span>
            }<br/>
          <FlatButton label="Pertinenza Demaniale" icon={<Chart />} style={{marginTop:'10px'}}/><TextField hintText="0.00" value={this.state['pertinenza_demaniale']} style={{width:'90px', marginLeft:'20px'}} ref="pertinenza_demaniale" onChange={this.onChange.bind(this, 'pertinenza_demaniale', 'pertinenza_demaniale')}/>
            {this.state['p_pertinenza_demaniale'] === ''
              ?
              <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onConfirm.bind(this,'pertinenza_demaniale')} disabled={this.state['pertinenza_demaniale'] === ''}/>
              :
              <span><FlatButton label="Modifica" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onModify.bind(this,'pertinenza_demaniale')}/><FlatButton label="Elimina" backgroundColor='#FFFFFF' style={{marginLeft: '10px', color:'red'}} onTouchTap={this.onDelete.bind(this,'pertinenza_demaniale')}/></span>
            }<br/>
            <br/><p>Fornisci inoltre informazioni su:</p>
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
        <br/>
        </div>
      );
    }
  }

}

export default Step6;
