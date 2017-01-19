import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import Attach from 'material-ui/svg-icons/editor/attach-file';
import Dialog from 'material-ui/Dialog';
import Check from 'material-ui/svg-icons/action/check-circle';
import Delete from 'material-ui/svg-icons/action/delete';
import TextField from 'material-ui/TextField';
import Box from 'react-layout-components';

import $ from 'jquery';

import CircularProgress from 'material-ui/CircularProgress';

import Eye from 'material-ui/svg-icons/image/remove-red-eye';
import IconButton from 'material-ui/IconButton';


class ReqMin extends React.Component{

  constructor(props, context) {
    super(props, context);
    /*this.state = {
      isLoading : true,
      data : undefined
    }*/
    this.state = {
      'visuracamerale' : 'Non caricato',
      'carichipenali' : 'Non caricato',
      'casellariogiudiziale' : 'Non caricato',
      'durc' : 'Non caricato',
      'certificatofallimentare' : 'Non caricato',
      'certificatoantimafia' : 'Non caricato',
      'verificadocumentazionetecnica' : 'Non caricato',
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
        url: constants.DB_ADDR+'handled1s2reqmin?id='+_self.props.dbid+'&pandema_id='+_self.props.pid,
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

  _onFileInputChange(e, who){
    var file = undefined;
    var _self = this;
    var aType = undefined;
    switch(e){
      case 'visuracamerale':
        aType = 8;
        file = this.refs.file1.files[0]
      break;
      case 'carichipenali':
        aType = 9;
        file = this.refs.file2.files[0]
      break;
      case 'casellariogiudiziale':
        aType = 10;
        file = this.refs.file3.files[0]
      break;
      case 'durc':
        aType = 11;
        file = this.refs.file4.files[0]
      break;
      case 'certificatofallimentare':
        aType = 12;
        file = this.refs.file5.files[0]
      break;
      case 'certificatoantimafia':
        aType = 13;
        file = this.refs.file6.files[0]
      break;
      case 'verificadocumentazionetecnica':
        aType = 29;
        file = this.refs.file7.files[0]
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

  eyePress(id){
    window.open(constants.DB_ADDR+'downloadFile?id='+id,'_blank');
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
      'visuracamerale' : 'Non caricato',
      'carichipenali' : 'Non caricato',
      'casellariogiudiziale' : 'Non caricato',
      'durc' : 'Non caricato',
      'certificatofallimentare' : 'Non caricato',
      'certificatoantimafia' : 'Non caricato',
      'verificadocumentazionetecnica' : 'Non caricato',
      isLoading : true,
      data : null
    });
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'handled1s2reqmin?id='+_self.props.dbid+'&pandema_id='+_self.props.pid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log(parsed);
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
        var tmp = {};
        for(var i = 0 ; i < this.state.data.length; i++){
          tmp[this.state.data[i].tipo_descrizione] = this.state.data[i].id;
        }
        return(
          <Box column style={{marginTop:'20px', width:'100%'}} alignItems="flex-start" justifyContent="flex-start">
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
                  <TableRowColumn>Visura Camerale</TableRowColumn>
                  <TableRowColumn><span style={this.state['visuracamerale'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['visuracamerale']}</span></TableRowColumn>
                  <TableRowColumn>
                    { this.state['visuracamerale'] !== 'Non caricato' ?
                      (
                        <div>
                          <IconButton onTouchTap={this.eyePress.bind(this, tmp['visuracamerale'])}><Eye color="#909EA2"/></IconButton>
                          <IconButton onTouchTap={this.deletePress.bind(this, 'visuracamerale')}><Delete color="#909EA2"/></IconButton>
                        </div>
                      )
                      :
                      <FlatButton label="Allega file" backgroundColor='#FFFFFF'>
                          <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file1" onChange={this._onFileInputChange.bind(this, 'visuracamerale')}/>
                      </FlatButton>
                    }
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>Carichi Pendenti</TableRowColumn>
                  <TableRowColumn><span style={this.state['carichipenali'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['carichipenali']}</span></TableRowColumn>
                  <TableRowColumn>
                    { this.state['carichipenali'] !== 'Non caricato' ?

                        (
                          <div>
                            <IconButton onTouchTap={this.eyePress.bind(this, tmp['carichipenali'])}><Eye color="#909EA2"/></IconButton>
                            <IconButton onTouchTap={this.deletePress.bind(this, 'carichipenali')}><Delete color="#909EA2"/></IconButton>
                          </div>
                        )

                      :
                      <FlatButton label="Allega file" backgroundColor='#FFFFFF' >
                        <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file2" onChange={this._onFileInputChange.bind(this, 'carichipenali')}/>
                      </FlatButton>
                    }
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>Casellario Giudiziale</TableRowColumn>
                  <TableRowColumn><span style={this.state['casellariogiudiziale'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['casellariogiudiziale']}</span></TableRowColumn>
                  <TableRowColumn>
                    { this.state['casellariogiudiziale'] !== 'Non caricato' ?
                      (
                        <div>
                          <IconButton onTouchTap={this.eyePress.bind(this, tmp['casellariogiudiziale'])}><Eye color="#909EA2"/></IconButton>
                          <IconButton onTouchTap={this.deletePress.bind(this, 'casellariogiudiziale')}><Delete color="#909EA2"/></IconButton>
                        </div>
                      )
                      :
                      <FlatButton label="Allega file" backgroundColor='#FFFFFF' >
                        <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file3" onChange={this._onFileInputChange.bind(this, 'casellariogiudiziale')}/>
                      </FlatButton>
                    }
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>DURC</TableRowColumn>
                  <TableRowColumn><span style={this.state['durc'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['durc']}</span></TableRowColumn>
                  <TableRowColumn>
                    { this.state['durc'] !== 'Non caricato' ?
                      (
                        <div>
                          <IconButton onTouchTap={this.eyePress.bind(this, tmp['durc'])}><Eye color="#909EA2"/></IconButton>
                          <IconButton onTouchTap={this.deletePress.bind(this, 'durc')}><Delete color="#909EA2"/></IconButton>
                        </div>
                      )
                      :
                      <FlatButton label="Allega file" backgroundColor='#FFFFFF'>
                        <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file4" onChange={this._onFileInputChange.bind(this, 'durc')}/>
                      </FlatButton>
                    }
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>Certificato Fallimentare</TableRowColumn>
                  <TableRowColumn><span style={this.state['certificatofallimentare'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['certificatofallimentare']}</span></TableRowColumn>
                  <TableRowColumn>
                    { this.state['certificatofallimentare'] !== 'Non caricato' ?
                      (
                        <div>
                          <IconButton onTouchTap={this.eyePress.bind(this, tmp['certificatofallimentare'])}><Eye color="#909EA2"/></IconButton>
                          <IconButton onTouchTap={this.deletePress.bind(this, 'certificatofallimentare')}><Delete color="#909EA2"/></IconButton>
                        </div>
                      )
                      :
                      <FlatButton label="Allega file" backgroundColor='#FFFFFF'>
                        <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file5" onChange={this._onFileInputChange.bind(this, 'certificatofallimentare')}/>
                      </FlatButton>
                    }
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>Certificato Antimafia</TableRowColumn>
                  <TableRowColumn><span style={this.state['certificatoantimafia'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['certificatoantimafia']}</span></TableRowColumn>
                  <TableRowColumn>
                    { this.state['certificatoantimafia'] !== 'Non caricato' ?
                      (
                        <div>
                          <IconButton onTouchTap={this.eyePress.bind(this, tmp['certificatoantimafia'])}><Eye color="#909EA2"/></IconButton>
                          <IconButton onTouchTap={this.deletePress.bind(this, 'certificatoantimafia')}><Delete color="#909EA2"/></IconButton>
                        </div>
                      )
                      :
                      <FlatButton label="Allega file" backgroundColor='#FFFFFF'>
                        <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file6" onChange={this._onFileInputChange.bind(this, 'certificatoantimafia')}/>
                      </FlatButton>
                    }
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>Verifica Documentazione Tecnica</TableRowColumn>
                  <TableRowColumn><span style={this.state['verificadocumentazionetecnica'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['verificadocumentazionetecnica']}</span></TableRowColumn>
                  <TableRowColumn>
                    { this.state['verificadocumentazionetecnica'] !== 'Non caricato' ?
                      (
                        <div>
                          <IconButton onTouchTap={this.eyePress.bind(this, tmp['verificadocumentazionetecnica'])}><Eye color="#909EA2"/></IconButton>
                          <IconButton onTouchTap={this.deletePress.bind(this, 'verificadocumentazionetecnica')}><Delete color="#909EA2"/></IconButton>
                        </div>
                      )
                      :
                      <FlatButton label="Allega file" backgroundColor='#FFFFFF'>
                        <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file7" onChange={this._onFileInputChange.bind(this, 'verificadocumentazionetecnica')}/>
                      </FlatButton>
                    }
                  </TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        )
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
export default ReqMin;
