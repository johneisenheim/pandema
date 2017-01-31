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
      cauzione : '',
      p_usi_vari : '',
      p_turistico_e_diporto : '',
      p_pesca_acqua_cantieri : '',
      p_regione_campania : '',
      p_pertinenza_demaniale : '',
      p_tasse_di_registro : '',
      p_oneri_accessori : '',
      p_cauzione : '',
      data : [],
      uso_scopo : undefined
    }
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        url: constants.DB_ADDR+'handled1s6?pid='+_self.props.pid+'&dbid='+_self.props.dbid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
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
          _self.state.uso_scopo = parsed.codice[0].descrizione;
          _self.setState(_self.state);
        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
        }
    });
  }

  downloadModulo(who){
    switch (who) {
      case 'usi_vari':
        window.open(LINKS.usi_vari, '_blank');
        break;
      case 'turistico_e_diporto':
        window.open(LINKS.turistico_e_diporto, '_blank');
        break;
      case 'pesca_acqua_cantieri':
        window.open(LINKS.pesca_acqua_cantieri, '_blank');
      break;
      case 'regione_campania':
        window.open(LINKS.regione_campania, '_blank');
      break;
      case 'pertinenza_demaniale':
        window.open(LINKS.pertinenza_demaniale,'_blank');
      break;
      case 'tasse_di_registro':
        window.open(LINKS.tasse_di_registro,'_blank');
      break;
      case 'oneri_accessori':
      break;
      case 'cauzione':
        window.open(LINKS.cauzione,'_blank');
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
      case 'cauzione':
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
      case 'cauzione':
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
      case 'cauzione':
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
    this.setState({
      ...this.state,
      isLoading : true
    });
    $.ajax({
        type: 'GET',
        url: constants.DB_ADDR+'handled1s6?pid='+_self.props.pid+'&dbid='+_self.props.dbid,
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
          _self.state['cauzione'] = '';
          _self.state['p_usi_vari'] = '';
          _self.state['p_turistico_e_diporto'] = '';
          _self.state['p_pesca_acqua_cantieri'] = '';
          _self.state['p_regione_campania'] = '';
          _self.state['p_pertinenza_demaniale'] = '';
          _self.state['p_tasse_di_registro'] = '';
          _self.state['p_oneri_accessori'] = '';
          _self.state['p_cauzione'] = '';
          if(parsed.canone !== undefined){
            if(parsed.canone.length === 0){
              _self.state['usi_vari'] = '';
              _self.state['turistico_e_diporto'] = '';
              _self.state['pesca_acqua_cantieri'] = '';
              _self.state['regione_campania'] = '';
              _self.state['pertinenza_demaniale'] = '';
              _self.state['cauzione'] = '';
              _self.state['p_usi_vari'] = '';
              _self.state['p_turistico_e_diporto'] = '';
              _self.state['p_pesca_acqua_cantieri'] = '';
              _self.state['p_regione_campania'] = '';
              _self.state['p_pertinenza_demaniale'] = '';
              _self.state['p_cauzione'] = '';
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
            <FlatButton label="Usi vari" icon={<Chart />} style={{marginTop:'10px'}} onTouchTap={this.downloadModulo.bind(this,'usi_vari')} disabled={this.state.uso_scopo!=='usi_vari'}/><TextField hintText="0.00" disabled={this.state.uso_scopo!=='usi_vari'} ref="usi_vari" value={this.state['usi_vari']} onChange={this.onChange.bind(this, 'usi_vari', 'usi_vari')} style={{width:'90px', marginLeft:'20px'}}/>
            {
              this.state['p_usi_vari'] === ''
              ?
              <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onConfirm.bind(this,'usi_vari')} disabled={this.state['usi_vari'] === ''}/>
              :
              <span><FlatButton label="Modifica" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onModify.bind(this,'usi_vari')}/> <FlatButton label="Elimina" backgroundColor='#FFFFFF' style={{marginLeft: '10px', color:'red'}} onTouchTap={this.onDelete.bind(this,'usi_vari')}/></span>
            }<br/>
            <FlatButton label="Turistico e diporto" icon={<Chart />} style={{marginTop:'10px'}} onTouchTap={this.downloadModulo.bind(this,'turistico_e_diporto')} disabled={this.state.uso_scopo!=='turistico_e_diporto'}/><TextField hintText="0.00" disabled={this.state.uso_scopo!=='turistico_e_diporto'} value={this.state['turistico_e_diporto']} style={{width:'90px', marginLeft:'20px'}} ref="turistico_e_diporto" onChange={this.onChange.bind(this, 'turistico_e_diporto', 'turistico_e_diporto')}/>
            {
              this.state['p_turistico_e_diporto'] === ''
              ?
              <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onConfirm.bind(this,'turistico_e_diporto')} disabled={this.state['turistico_e_diporto'] === ''}/>
              :
              <span><FlatButton label="Modifica" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onModify.bind(this,'turistico_e_diporto')}/> <FlatButton label="Elimina" backgroundColor='#FFFFFF' style={{marginLeft: '10px', color:'red'}} onTouchTap={this.onDelete.bind(this,'turistico_e_diporto')}/></span>
            }<br/>
          <FlatButton label="Pesca, acqua e cantieri" icon={<Chart />} style={{marginTop:'10px'}} onTouchTap={this.downloadModulo.bind(this,'pesca_acqua_cantieri')} disabled={this.state.uso_scopo!=='pesca_acqua_cantieri'}/><TextField hintText="0.00" disabled={this.state.uso_scopo!=='pesca_acqua_cantieri'} value={this.state['pesca_acqua_cantieri']} style={{width:'90px', marginLeft:'20px'}} ref="pesca_acqua_cantieri" onChange={this.onChange.bind(this, 'pesca_acqua_cantieri', 'pesca_acqua_cantieri')}/>
            {
              this.state['p_pesca_acqua_cantieri'] === ''
              ?
              <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onConfirm.bind(this,'pesca_acqua_cantieri')} disabled={this.state['pesca_acqua_cantieri'] === ''}/>
              :
              <span><FlatButton label="Modifica" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onModify.bind(this,'pesca_acqua_cantieri')}/><FlatButton label="Elimina" backgroundColor='#FFFFFF' style={{marginLeft: '10px', color:'red'}} onTouchTap={this.onDelete.bind(this,'pesca_acqua_cantieri')}/></span>
            }<br/>
          <FlatButton label="Regione Campania" icon={<Chart />} style={{marginTop:'10px'}} onTouchTap={this.downloadModulo.bind(this,'regione_campania')} disabled={this.state.uso_scopo!=='regione_campania'}/><TextField hintText="0.00" disabled={this.state.uso_scopo!=='regione_campania'} value={this.state['regione_campania']} style={{width:'90px', marginLeft:'20px'}} ref="regione_campania" onChange={this.onChange.bind(this, 'regione_campania', 'regione_campania')}/>
            {this.state['p_regione_campania'] === ''
              ?
              <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onConfirm.bind(this,'regione_campania')} disabled={this.state['regione_campania'] === ''}/>
              :
              <span><FlatButton label="Modifica" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onModify.bind(this,'regione_campania')}/><FlatButton label="Elimina" backgroundColor='#FFFFFF' style={{marginLeft: '10px', color:'red'}} onTouchTap={this.onDelete.bind(this,'regione_campania')}/></span>
            }<br/>
          <FlatButton label="Pertinenza Demaniale" icon={<Chart />} style={{marginTop:'10px'}} onTouchTap={this.downloadModulo.bind(this,'pertinenza_demaniale')} disabled={this.state.uso_scopo!=='pertinenza_demaniale'}/><TextField hintText="0.00" disabled={this.state.uso_scopo!=='pertinenza_demaniale'} value={this.state['pertinenza_demaniale']} style={{width:'90px', marginLeft:'20px'}} ref="pertinenza_demaniale" onChange={this.onChange.bind(this, 'pertinenza_demaniale', 'pertinenza_demaniale')}/>
            {this.state['p_pertinenza_demaniale'] === ''
              ?
              <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onConfirm.bind(this,'pertinenza_demaniale')} disabled={this.state['pertinenza_demaniale'] === ''}/>
              :
              <span><FlatButton label="Modifica" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onModify.bind(this,'pertinenza_demaniale')}/><FlatButton label="Elimina" backgroundColor='#FFFFFF' style={{marginLeft: '10px', color:'red'}} onTouchTap={this.onDelete.bind(this,'pertinenza_demaniale')}/></span>
            }<br/>
            <br/><p>Fornisci inoltre informazioni su:</p>
            <FlatButton label="Tasse di Registro" icon={<Chart />} style={{marginTop:'10px'}} onTouchTap={this.downloadModulo.bind(this,'tasse_di_registro')}/><TextField hintText="0.00" value={this.state['tasse_di_registro']} ref="tasse_di_registro" style={{ marginLeft:'20px', width:'90px'}} onChange={this.onChange.bind(this, 'tasse_di_registro', 'tasse_di_registro')}/>
            {this.state['p_tasse_di_registro'] === ''
              ?
              <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onConfirm.bind(this,'tasse_di_registro')} disabled={this.state['tasse_di_registro'] === ''}/>
              :
              <span><FlatButton label="Modifica" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onModify.bind(this,'tasse_di_registro')}/><FlatButton label="Elimina" backgroundColor='#FFFFFF' style={{marginLeft: '10px', color:'red'}} onTouchTap={this.onDelete.bind(this,'tasse_di_registro')}/></span>
            }<br/>
          <FlatButton label="Oneri Accessori" icon={<Chart />} style={{marginTop:'10px'}} onTouchTap={this.downloadModulo.bind(this,'oneri_accessori')}/> <TextField hintText="0.00" value={this.state['oneri_accessori']} ref="oneri_accessori" style={{ marginLeft:'20px', width:'90px'}} onChange={this.onChange.bind(this, 'oneri_accessori', 'oneri_accessori')}/>
          {this.state['p_oneri_accessori'] === ''
            ?
            <FlatButton label="Conferma" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onConfirm.bind(this,'oneri_accessori')} disabled={this.state['oneri_accessori'] === ''}/>
            :
            <span><FlatButton label="Modifica" backgroundColor='#FFFFFF' style={{marginLeft: '30px'}} onTouchTap={this.onModify.bind(this,'oneri_accessori')}/><FlatButton label="Elimina" backgroundColor='#FFFFFF' style={{marginLeft: '10px', color:'red'}} onTouchTap={this.onDelete.bind(this,'oneri_accessori')}/></span>
          }<br/>
          <FlatButton label="Cauzione" icon={<Chart />} style={{marginTop:'10px'}} onTouchTap={this.downloadModulo.bind(this,'cauzione')}/> <TextField hintText="0.00" value={this.state['cauzione']} ref="cauzione" style={{ marginLeft:'20px', width:'90px'}} onChange={this.onChange.bind(this, 'cauzione', 'cauzione')}/>
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

export default Step6;
