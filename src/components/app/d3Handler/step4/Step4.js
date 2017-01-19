import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Attach from 'material-ui/svg-icons/editor/attach-file';
import Check from 'material-ui/svg-icons/action/check-circle';
import Delete from 'material-ui/svg-icons/action/delete';
import $ from 'jquery';
import Box from 'react-layout-components';

import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';

import Eye from 'material-ui/svg-icons/image/remove-red-eye';


class Step4 extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      'determina' : 'Non caricato',
      'delibera' : 'Non caricato',
      'visto' :  'Non caricato',
      isLoading : true,
      data : []
    };
    this.praticaPath = undefined;
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'handled1s4?id='+_self.props.dbid+'&pandema_id='+_self.props.pid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.praticaPath = parsed.path;

          for( var i = 0; i < parsed.results.length; i++ ){
            if( _self.state[parsed.results[i].tipo_descrizione] !== undefined ){
              _self.state[parsed.results[i].tipo_descrizione] = 'Caricato';
            }
          }
          _self.setState({
            ..._self.state,
            isLoading : false,
            data : parsed.results.length > 0 ? parsed.results : []
          });
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });
  }

  _onFileInputChange(e){
    var file = undefined;
    var _self = this;
    var aType = undefined;
    switch(e){
      case 'determina':
        aType = 23;
        file = this.refs.file1.files[0]
      break;
      case 'delibera':
        aType = 24;
        file = this.refs.file2.files[0]
      break;
      case 'visto':
        aType = 25;
        file = this.refs.file3.files[0]
      break;
    }
    var formData = new FormData();
    formData.append('pid', this.props.pid);
    formData.append('dbid', this.props.dbid);
    formData.append('path', this.praticaPath);
    formData.append('atype', aType);
    formData.append('file', file);
    $.ajax({
        type: 'POST',
        data: formData,
        url: constants.DB_ADDR+'addFile',
        processData: false,
        contentType: false,
        success: function(data) {
          toggleLoader.emit('toggleLoader');
          //reload
          _self.reload();
        },
        error : function(err){
          toggleLoader.emit('toggleLoader');
          alert(err);
        }
    });
    toggleLoader.emit('toggleLoader');
  }

  eyePress(filename){
    window.open(constants.DB_ADDR+'see?a='+this.praticaPath+'/'+filename+'.pdf','_blank');
  }

  deletePress(filename){
    var r = confirm("Sei sicuro di voler eliminare questo documento?");
    var _self = this;
    if(r){
      var allegato_id = this.state.data.filter(function(v) {
          return v.tipo_descrizione === filename; // Filter out the appropriate one
      })[0].id;
      $.ajax({
          type: 'GET',
          url: constants.DB_ADDR+'deleteDocument?allegatoID='+escape(allegato_id)+'&path='+escape(this.praticaPath+'/'+filename+'.docx'),
          processData: false,
          contentType: false,
          success: function(data) {
            var parsed = JSON.parse(data);
            if(parsed.response){
              _self.reload();
            }
          },
          error : function(err){
            alert("Errore nell'elaborazione della richiesta. Riprova per favore.");
          }
      });
    }
  }

  reload(){
    var _self = this;
    _self.setState({
      ..._self.state,
      'determina' : 'Non caricato',
      'delibera' : 'Non caricato',
      'visto' :  'Non caricato',
      isLoading : true,
      data : null
    });
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'handled1s4?id='+_self.props.dbid+'&pandema_id='+_self.props.pid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.praticaPath = parsed.path;
          for( var i = 0; i < parsed.results.length; i++ ){
            if( _self.state[parsed.results[i].tipo_descrizione] !== undefined ){
              _self.state[parsed.results[i].tipo_descrizione] = 'Caricato';
            }
          }
          _self.setState({
            ..._self.state,
            isLoading : false,
            data : parsed.results
          });
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
      );
    }else{
      return(
        <div>
          <Table selectable={false}>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Documento</TableHeaderColumn>
                <TableHeaderColumn>Status</TableHeaderColumn>
                <TableHeaderColumn>Azioni</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} selectable={false}>
              <TableRow>
                <TableRowColumn>Determina</TableRowColumn>
                <TableRowColumn><span style={this.state['determina'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['determina']}</span></TableRowColumn>
                <TableRowColumn>
                  { this.state['determina'] !== 'Non caricato' ?
                    (
                      <div>
                        <IconButton onTouchTap={this.eyePress.bind(this, 'determina')}><Eye color="#909EA2"/></IconButton>
                        <IconButton onTouchTap={this.deletePress.bind(this, 'determina')}><Delete color="#909EA2"/></IconButton>
                      </div>
                    )
                    :
                    <FlatButton label="Allega file" backgroundColor='#FFFFFF'>
                      <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file1" onChange={this._onFileInputChange.bind(this, 'determina')}/>
                    </FlatButton>
                  }
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Delibera di giunta o consiglio comunale</TableRowColumn>
                <TableRowColumn><span style={this.state['delibera'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['delibera']}</span></TableRowColumn>
                <TableRowColumn>
                  { this.state['delibera'] !== 'Non caricato' ?
                    (
                      <div>
                        <IconButton onTouchTap={this.eyePress.bind(this, 'delibera')}><Eye color="#909EA2"/></IconButton>
                        <IconButton onTouchTap={this.deletePress.bind(this, 'delibera')}><Delete color="#909EA2"/></IconButton>
                      </div>
                    )
                    :
                    <FlatButton label="Allega file" backgroundColor='#FFFFFF'>
                      <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file2" onChange={this._onFileInputChange.bind(this, 'delibera')}/>
                    </FlatButton>
                  }
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Visto registrazione Corte dei Conti</TableRowColumn>
                <TableRowColumn><span style={this.state['visto'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['visto']}</span></TableRowColumn>
                <TableRowColumn>
                  { this.state['visto'] !== 'Non caricato' ?
                    (
                      <div>
                        <IconButton onTouchTap={this.eyePress.bind(this, 'visto')}><Eye color="#909EA2"/></IconButton>
                        <IconButton onTouchTap={this.deletePress.bind(this, 'visto')}><Delete color="#909EA2"/></IconButton>
                      </div>
                    )
                    :
                    <FlatButton label="Allega file" backgroundColor='#FFFFFF'>
                      <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file3" onChange={this._onFileInputChange.bind(this, 'visto')}/>
                    </FlatButton>
                  }
                </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
          </div>
      );
    }
  }
}

const styles = {
  notLoaded : {
    backgroundColor:'#FFA726',
    padding:'8px',
    color:'white',
    fontWeight:'bold'
  },
  loaded : {
    backgroundColor:'#2E7D32',
    padding:'8px',
    color:'white',
    fontWeight:'bold'
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
  raisedButton : {
    backgroundColor : '#FFFFFF'
  }
}

export default Step4;
