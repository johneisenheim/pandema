import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Attach from 'material-ui/svg-icons/editor/attach-file';
import TextField from 'material-ui/TextField';
import Box from 'react-layout-components';

import $ from 'jquery';

import CircularProgress from 'material-ui/CircularProgress';

import Eye from 'material-ui/svg-icons/image/remove-red-eye';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';


class ReqFac extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
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
        url: constants.DB_ADDR+'handled1s2reqfac?id='+_self.props.dbid+'&pandema_id='+_self.props.pid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.praticaPath = parsed.path;
          _self.setState({
            ..._self.state,
            isLoading : false,
            data : parsed.results
          });
        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
          ;
        }
    });
  }


  _onFileInputChange(e, index){
    e.stopPropagation();
    var _self = this;
    var formData = new FormData();
    formData.append('pid', this.props.pid);
    formData.append('dbid', this.props.dbid);
    formData.append('path', this.praticaPath);
    formData.append('atype', 28);
    formData.append('file', this.refs.file.files[0]);

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

  deletePress(path, allegato_id){
    var r = confirm("Sei sicuro di voler eliminare questo documento?");
    var _self = this;
    if(r){
      $.ajax({
          type: 'GET',
          url: constants.DB_ADDR+'deleteDocument?allegatoID='+escape(allegato_id)+'&path='+escape(path),
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
      isLoading : true,
      data : null
    })
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'handled1s2reqfac?id='+_self.props.dbid+'&pandema_id='+_self.props.pid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.praticaPath = parsed.path;
          _self.setState({
            ..._self.state,
            isLoading : false,
            data : parsed.results
          });
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
      );
    }else{
      var tableContents = [];
      if( this.state.data.length == 0 ){
        tableContents.push(
          <TableRow key={0}>
            <TableRowColumn style={{width:'100%', textAlign:'center'}}>Non ci sono files presenti.</TableRowColumn>
          </TableRow>
        );
      }else{
        for(var i = 0; i < this.state.data.length; i++){
          tableContents.push(
            <TableRow key={i}>
              <TableRowColumn>Requisito Facoltativo {i+1}</TableRowColumn>
              <TableRowColumn>{new Date(this.state.data[i].data_creazione).toLocaleDateString()}</TableRowColumn>
              <TableRowColumn>
                <IconButton onTouchTap={this.eyePress.bind(this, this.state.data[i].id)}><Eye color="#909EA2"/></IconButton>
                <IconButton onTouchTap={this.deletePress.bind(this, this.state.data[i].path, this.state.data[i].id)}><Delete color="#909EA2"/></IconButton>
              </TableRowColumn>
            </TableRow>
          );
        }
      }
      return(
        <div>
          <div style={{width:'100%', marginTop:'30px'}}>
            <Box alignItems='flex-end' justifyContent='flex-end' style={{marginRight:'20px'}}>
                <RaisedButton icon={<Attach/>} label="Allega nuovo documento" primary={true} labelStyle={{color:'#FFFFFF'}}>
                  <input type="file" accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style={styles.inputFile} onChange={this._onFileInputChange.bind(this)} ref="file"/>
                </RaisedButton>
            </Box>
          </div>
          <Table selectable={false}>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Documento</TableHeaderColumn>
                <TableHeaderColumn>Data Creazione</TableHeaderColumn>
                <TableHeaderColumn>Azioni</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} selectable={false}>
              {tableContents}
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
export default ReqFac;
