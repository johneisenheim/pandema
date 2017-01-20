import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Box, Center} from 'react-layout-components';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import update from 'react-addons-update';
import Delete from 'material-ui/svg-icons/action/delete';

import Compile from 'material-ui/svg-icons/action/assignment';
import Attach from 'material-ui/svg-icons/editor/attach-file';
import NextIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import PrevIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import Check from 'material-ui/svg-icons/action/check-circle';

import $ from 'jquery';

import CircularProgress from 'material-ui/CircularProgress';

import Eye from 'material-ui/svg-icons/image/remove-red-eye';

//D4D4D4

class Pareri extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      'agenziadogana' : 'Non caricato',
      'agenziademanio' : 'Non caricato',
      'pareretecnico' : 'Non caricato',
      'parereurbanistico' : 'Non caricato',
      'pareresopraintendenza' : 'Non caricato',
      'pareresic' : 'Non caricato',
      'parereautoritamarittima' : 'Non caricato',
      'pareresopraintendenzaarcheologica' : 'Non caricato',
      'parereautoritabacino' : 'Non caricato',
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
        url: constants.DB_ADDR+'handled1s3?id='+_self.props.dbid+'&pandema_id='+_self.props.pid,
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
      case 'agenziadogana':
        aType = 14;
        file = this.refs.file1.files[0]
      break;
      case 'agenziademanio':
        aType = 15;
        file = this.refs.file2.files[0]
      break;
      case 'pareretecnico':
        aType = 16;
        file = this.refs.file3.files[0]
      break;
      case 'parereurbanistico':
        aType = 17;
        file = this.refs.file4.files[0]
      break;
      case 'pareresopraintendenza':
        aType = 18;
        file = this.refs.file5.files[0]
      break;
      case 'pareresic':
        aType = 19;
        file = this.refs.file6.files[0]
      break;
      case 'parereautoritamarittima':
        aType = 20;
        file = this.refs.file7.files[0]
      break;
      case 'pareresopraintendenzaarcheologica':
        aType = 21;
        file = this.refs.file8.files[0]
      break;
      case 'parereautoritabacino':
        aType = 22;
        file = this.refs.file9.files[0]
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
      'agenziadogana' : 'Non caricato',
      'agenziademanio' : 'Non caricato',
      'pareretecnico' : 'Non caricato',
      'parereurbanistico' : 'Non caricato',
      'pareresopraintendenza' : 'Non caricato',
      'pareresic' : 'Non caricato',
      'parereautoritamarittima' : 'Non caricato',
      'pareresopraintendenzaarcheologica' : 'Non caricato',
      'parereautoritabacino' : 'Non caricato',
      isLoading : true,
      data : null
    });
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'handled1s3?id='+_self.props.dbid+'&pandema_id='+_self.props.pid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.praticaPath = parsed.path;
          console.log(parsed);
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


  render (){
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
      return (
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
                <TableRowColumn>Agenzia delle dogane</TableRowColumn>
                <TableRowColumn><span style={this.state['agenziadogana'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['agenziadogana']}</span></TableRowColumn>
                <TableRowColumn>
                  { this.state['agenziadogana'] !== 'Non caricato' ?
                    (
                      <div>
                        <IconButton onTouchTap={this.eyePress.bind(this, tmp['agenziadogana'])}><Eye color="#909EA2"/></IconButton>
                        <IconButton onTouchTap={this.deletePress.bind(this, 'agenziadogana')}><Delete color="#909EA2"/></IconButton>
                      </div>
                    )
                    :
                    <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                      <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file1" onChange={this._onFileInputChange.bind(this, 'agenziadogana')}/>
                    </FlatButton>
                  }
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Agenzia del demanio</TableRowColumn>
                <TableRowColumn><span style={this.state['agenziademanio'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['agenziademanio']}</span></TableRowColumn>
                <TableRowColumn>
                  { this.state['agenziademanio'] !== 'Non caricato' ?
                    (
                      <div>
                        <IconButton onTouchTap={this.eyePress.bind(this, tmp['agenziademanio'])}><Eye color="#909EA2"/></IconButton>
                        <IconButton onTouchTap={this.deletePress.bind(this, 'agenziademanio')}><Delete color="#909EA2"/></IconButton>
                      </div>
                    )
                    :
                    <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                      <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file2" onChange={this._onFileInputChange.bind(this, 'agenziademanio')}/>
                    </FlatButton>
                  }
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere tecnico</TableRowColumn>
                <TableRowColumn><span style={this.state['pareretecnico'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['pareretecnico']}</span></TableRowColumn>
                <TableRowColumn>
                  { this.state['pareretecnico'] !== 'Non caricato' ?
                    (
                      <div>
                        <IconButton onTouchTap={this.eyePress.bind(this, tmp['pareretecnico'])}><Eye color="#909EA2"/></IconButton>
                        <IconButton onTouchTap={this.deletePress.bind(this, 'pareretecnico')}><Delete color="#909EA2"/></IconButton>
                      </div>
                    )
                    :
                    <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                      <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file3" onChange={this._onFileInputChange.bind(this, 'pareretecnico')}/>
                    </FlatButton>
                  }
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere urbanistico</TableRowColumn>
                <TableRowColumn><span style={this.state['parereurbanistico'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['parereurbanistico']}</span></TableRowColumn>
                <TableRowColumn>
                  { this.state['parereurbanistico'] !== 'Non caricato' ?
                    (
                      <div>
                        <IconButton onTouchTap={this.eyePress.bind(this, tmp['parereurbanistico'])}><Eye color="#909EA2"/></IconButton>
                        <IconButton onTouchTap={this.deletePress.bind(this, 'parereurbanistico')}><Delete color="#909EA2"/></IconButton>
                      </div>
                    )
                    :
                    <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                      <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file4" onChange={this._onFileInputChange.bind(this, 'parereurbanistico')}/>
                    </FlatButton>
                  }
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere sopraintendenza beni paesaggistici</TableRowColumn>
                <TableRowColumn><span style={this.state['pareresopraintendenza'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['pareresopraintendenza']}</span></TableRowColumn>
                <TableRowColumn>
                  { this.state['pareresopraintendenza'] !== 'Non caricato' ?
                    (
                      <div>
                        <IconButton onTouchTap={this.eyePress.bind(this, tmp['pareresopraintendenza'])}><Eye color="#909EA2"/></IconButton>
                        <IconButton onTouchTap={this.deletePress.bind(this, 'pareresopraintendenza')}><Delete color="#909EA2"/></IconButton>
                      </div>
                    )
                    :
                    <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                      <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file5" onChange={this._onFileInputChange.bind(this, 'pareresopraintendenza')}/>
                    </FlatButton>
                  }
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere in aree SIC</TableRowColumn>
                <TableRowColumn><span style={this.state['pareresic'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['pareresic']}</span></TableRowColumn>
                <TableRowColumn>

                  { this.state['pareresic'] !== 'Non caricato' ?
                    (
                      <div>
                        <IconButton onTouchTap={this.eyePress.bind(this, tmp['pareresic'])}><Eye color="#909EA2"/></IconButton>
                        <IconButton onTouchTap={this.deletePress.bind(this, 'pareresic')}><Delete color="#909EA2"/></IconButton>
                      </div>
                    )
                    :
                    <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                      <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file6" onChange={this._onFileInputChange.bind(this, 'pareresic')}/>
                    </FlatButton>
                  }
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere autorità marittima</TableRowColumn>
                <TableRowColumn><span style={this.state['parereautoritamarittima'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['parereautoritamarittima']}</span></TableRowColumn>
                <TableRowColumn>
                  { this.state['parereautoritamarittima'] !== 'Non caricato' ?
                    (
                      <div>
                        <IconButton onTouchTap={this.eyePress.bind(this, tmp['parereautoritamarittima'])}><Eye color="#909EA2"/></IconButton>
                        <IconButton onTouchTap={this.deletePress.bind(this, 'parereautoritamarittima')}><Delete color="#909EA2"/></IconButton>
                      </div>
                    )
                    :
                    <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                      <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file7" onChange={this._onFileInputChange.bind(this, 'parereautoritamarittima')}/>
                    </FlatButton>
                  }
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere sopraintendenza archeologica</TableRowColumn>
                <TableRowColumn><span style={this.state['pareresopraintendenzaarcheologica'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['pareresopraintendenzaarcheologica']}</span></TableRowColumn>
                <TableRowColumn>
                  { this.state['pareresopraintendenzaarcheologica'] !== 'Non caricato' ?
                    (
                      <div>
                        <IconButton onTouchTap={this.eyePress.bind(this, tmp['pareresopraintendenzaarcheologica'])}><Eye color="#909EA2"/></IconButton>
                        <IconButton onTouchTap={this.deletePress.bind(this, 'pareresopraintendenzaarcheologica')}><Delete color="#909EA2"/></IconButton>
                      </div>
                    )
                    :
                    <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                      <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file8" onChange={this._onFileInputChange.bind(this, 'pareresopraintendenzaarcheologica')}/>
                    </FlatButton>
                  }
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere autorità bacino</TableRowColumn>
                <TableRowColumn><span style={this.state['parereautoritabacino'] == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state['parereautoritabacino']}</span></TableRowColumn>
                <TableRowColumn>
                  { this.state['parereautoritabacino'] !== 'Non caricato' ?
                    (
                      <div>
                        <IconButton onTouchTap={this.eyePress.bind(this, tmp['parereautoritabacino'])}><Eye color="#909EA2"/></IconButton>
                        <IconButton onTouchTap={this.deletePress.bind(this, 'parereautoritabacino')}><Delete color="#909EA2"/></IconButton>
                      </div>
                    )
                    :
                    <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                      <input type="file" style={styles.inputFile} accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref="file9" onChange={this._onFileInputChange.bind(this, 'parereautoritabacino')}/>
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

export default Pareri;
