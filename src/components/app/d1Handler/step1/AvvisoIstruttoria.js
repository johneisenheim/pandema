import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FlatButton from 'material-ui/FlatButton';
import Box from 'react-layout-components';

import {
lightBlue200, lightBlueA100,lightBlue300,
grey100, grey300, grey400, grey500, grey700,grey900,blue700,
pinkA200,
white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

import Attach from 'material-ui/svg-icons/editor/attach-file';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import $ from 'jquery';

import CircularProgress from 'material-ui/CircularProgress';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Add from 'material-ui/svg-icons/action/note-add';
import Check from 'material-ui/svg-icons/action/check-circle';
import TextField from 'material-ui/TextField';


import Eye from 'material-ui/svg-icons/image/remove-red-eye';
import Delete from 'material-ui/svg-icons/action/delete';
import Download from 'material-ui/svg-icons/file/file-download';

class AvvisoIstruttoria extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading : true,
      data : [],
      file : undefined
    };
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'d1avvisoistruttoria?pid='+this.props.pid+'&dbid='+this.props.dbid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log(parsed);
          _self.setState({
            ..._self.state,
            isLoading : false,
            data : parsed.results
          })
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });
  }

  _avvisoPubblicazioneFileHandler(e){
    var _self = this;
    var formData = new FormData();
    formData.append('pid', this.props.pid);
    formData.append('dbid', this.props.dbid);
    formData.append('path', this.props.path);
    formData.append('atype', 4);
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

  reload(){
    var _self = this;
    _self.setState({
      ..._self.state,
      isLoading : true,
      data : []
    })
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'d1avvisoistruttoria?pid='+this.props.pid+'&dbid='+this.props.dbid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log(parsed);
          _self.setState({
            ..._self.state,
            isLoading : false,
            data : parsed.results
          })
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });
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

  downloadModulo(){
    window.open(constants.DB_ADDR+'downloadD1AvvisoIstruttoria', '_blank')
  }

  render (){
    if( this.state.isLoading ){
      return(
        <Box alignItems="center" justifyContent="center" style={{width:'100%', height : '300px'}}>
          <CircularProgress size={30}/>
        </Box>
      )
    }else{
      var tableContents = [];
      if( this.state.data.length == 0 ){
        tableContents.push(
          <TableRow key={0}>
            <TableRowColumn style={{width:'100%', textAlign:'center'}}>Non ci sono files presenti.</TableRowColumn>
          </TableRow>
        );
      }else{
          for ( var i = 0; i < this.state.data.length; i++){
            tableContents.push(
              <TableRow key={i}>
                <TableRowColumn>File</TableRowColumn>
                <TableRowColumn>{new Date(this.state.data[i].data_creazione).toLocaleDateString()}</TableRowColumn>
                <TableRowColumn>
                  <IconButton onTouchTap={this.eyePress.bind(this, this.state.data[i].id)}><Eye color="#909EA2"/></IconButton>
                  <IconButton onTouchTap={this.deletePress.bind(this, this.state.data[i].path, this.state.data[i].id)}><Delete color="#909EA2"/></IconButton>
                </TableRowColumn>
              </TableRow>
            );
          }
      }
      return (
          <Box column style={{marginTop:'30px', width:'90%'}} alignItems="flex-start" justifyContent="flex-start">
              <Toolbar style={{backgroundColor:'#4CA7D0', width:'100%'}}>
                <ToolbarTitle text="File caricato per Avviso Pubblicazione" style={{color:'#FFFFFF', textAlign:'center', fontSize:'15px'}}/>
                <ToolbarGroup style={{marginRight:'0px'}}>
                  <FlatButton label="Scarica il modulo" icon={<Download style={{fill:'#FFFFFF'}}/>} style={{marginTop:'10px', marginRight:'0px'}} labelStyle={{color:'#FFFFFF'}} onTouchTap={this.downloadModulo.bind(this)}/>
                  <FlatButton label="Allega File" icon={<Attach style={{fill:'#FFFFFF'}}/>} style={{marginTop:'10px', marginRight:'0px'}} labelStyle={{color:'#FFFFFF'}} disabled={this.state.data.length > 0}>
                    {this.state.data.length == 0 ? <input type="file" style={styles.inputFile} onChange={this._avvisoPubblicazioneFileHandler.bind(this)} ref="file"/> : null}
                  </FlatButton>
                </ToolbarGroup>
              </Toolbar>
              <Table selectable={false} style={{width:'100%'}}>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                  <TableRow>
                    <TableHeaderColumn>Nome file</TableHeaderColumn>
                    <TableHeaderColumn>Data Caricamento</TableHeaderColumn>
                    <TableHeaderColumn>Azioni</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} selectable={false}>
                  {tableContents}
                </TableBody>
              </Table>
          </Box>
      );
    }
  }

}

const lightBaseTheme = getMuiTheme({
  spacing: {
    iconSize: 24,
    desktopGutter: 24,
    desktopGutterMore: 32,
    desktopGutterLess: 16,
    desktopGutterMini: 8,
    desktopKeylineIncrement: 64,
    desktopDropDownMenuItemHeight: 32,
    desktopDropDownMenuFontSize: 15,
    desktopDrawerMenuItemHeight: 48,
    desktopSubheaderHeight: 48,
    desktopToolbarHeight: 56,
  },
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: '#59C2E6',
    primary2Color: lightBlue200,
    primary3Color: lightBlue300,
    accent1Color: '#59C2E6',
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: grey700,
    alternateTextColor: '#666666',
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: '#59C2E6',
    clockCircleColor: fade('#E6E7EB', 0.07),
    shadowColor: grey900,
  },
},{
  userAgent : false
});

const styles = {
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
  }
};


export default AvvisoIstruttoria;
