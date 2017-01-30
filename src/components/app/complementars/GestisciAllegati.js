import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper';
import {
lightBlue200, lightBlueA100,lightBlue300,
grey100, grey300, grey400, grey500, grey700,grey900,blue700,
pinkA200,
white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

import Box from 'react-layout-components';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import { browserHistory } from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';

import Add from 'material-ui/svg-icons/action/note-add';
import Eye from 'material-ui/svg-icons/image/remove-red-eye';
import Download from 'material-ui/svg-icons/file/file-download';

import Attach from 'material-ui/svg-icons/editor/attach-file';
import Check from 'material-ui/svg-icons/action/check-circle';
import Dialog from 'material-ui/Dialog';

import $ from 'jquery';

class GestisciAllegati extends React.Component{
  constructor(props, context){
    super(props, context);

    this.state = {
        isLoading : true,
        results : [],
        open : false,
        checkColor : '#D6D6D6'
    };
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        url: constants.DB_ADDR+'getAllegatiPratica?praticaID='+_self.props.params.dbid+'&pandemaPraticaID='+_self.props.params.pid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.setState({
            ..._self.state,
            isLoading : false,
            results : parsed.results
          })
        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
        }
    });
  }

  onSubmit(){


  }

  eyePress(pratica_id, allegato_id, pratica_pandema_id){
    var _self = this;
    $.ajax({
        type: 'GET',
        url: constants.DB_ADDR+'viewDocument?allegatoID='+escape(allegato_id),
        processData: false,
        contentType: false,
        success: function(data) {
          _self.eyePressEnd(data);
        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
        }
    });
    //browserHistory.push('/viewdocument/'+allegato_id);
  }

  eyePressEnd(address){
    window.open(constants.DB_ADDR+'see?a='+address,'_blank');
  }

  deletePress(path, allegato_id){
    window.open(constants.DB_ADDR+'downloadFile?id='+allegato_id, '_blank')
    /*$.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:8001/downloadFile',
        processData: false,
        contentType: false,
        success: function(data) {
          console.log('success')

        },
        error : function(err){
          ;
        }
    });
    /*var r = confirm("Sei sicuro di voler eliminare questo documento?");
    var _self = this;
    if(r){
      $.ajax({
          type: 'GET',
          url: 'http://127.0.0.1:8001/deleteDocument?allegatoID='+escape(allegato_id)+'&path='+escape(path),
          processData: false,
          contentType: false,
          success: function(data) {
            var parsed = JSON.parse(data);
            if(parsed.response){
              $.ajax({
                  type: 'GET',
                  data: {praticaID : 1, pandemaPraticaID: _self.props.params.id},
                  url: 'http://127.0.0.1:8001/getAllegatiPratica?praticaID=1&pandemaPraticaID='+_self.props.params.id,
                  processData: false,
                  contentType: false,
                  success: function(data) {
                    console.log('success');
                    var parsed = JSON.parse(data);
                    _self.setState({
                      ..._self.state,
                      isLoading : false,
                      results : parsed
                    })
                  },
                  error : function(err){
                    ;
                  }
              });
            }
          },
          error : function(err){
            alert("Errore nell'elaborazione della richiesta. Riprova per favore.");
          }
      });
    }*/
  }

  _onFileSelection(e){
    this.setState({
      ...this.state,
      checkColor : 'green'
    });
  }

  createTable(){
    var tableContents =[];

    if( this.state.results.length == 0 ){
      return (
        <TableRow key={0}>
          <TableRowColumn></TableRowColumn>
          <TableRowColumn>Nessun dato presente.</TableRowColumn>
          <TableRowColumn></TableRowColumn>
        </TableRow>
      );
    }
    for( var i = 0; i < this.state.results.length; i++ ){
      tableContents.push(
        <TableRow key={i}>
          <TableRowColumn>{this.state.results[i].descrizione}</TableRowColumn>
          <TableRowColumn>{new Date(this.state.results[i].data_creazione).toLocaleDateString()}</TableRowColumn>
          <TableRowColumn>
            <IconButton onTouchTap={this.eyePress.bind(this, this.state.results[i].pratica_id, this.state.results[i].allegato_id, this.state.results[i].pratica_pandema_id)}><Eye color="#909EA2"/></IconButton>
            <IconButton onTouchTap={this.deletePress.bind(this, this.state.results[i].path, this.state.results[i].allegato_id)}><Download color="#909EA2"/></IconButton>
          </TableRowColumn>
        </TableRow>
      );
    }
    return tableContents;
  }

  handleChange(event, index, value){

  }

  _handleClose(){
    this.setState({
      ...this.state,
      open : false
    })
  }

  handleClose(){

  }

  openDialog(){
    console.log('open');
    this.setState({
      ...this.state,
      open : true
    })
  }

  render(){
    const actions = [
      <FlatButton
        label="Annulla"
        primary={false}
        onTouchTap={this._handleClose.bind(this)}
      />,
      <FlatButton
        label="Invia"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose.bind(this)}
      />,
    ];
    if(this.state.isLoading){
      return(
        <MuiThemeProvider muiTheme={lightBaseTheme} >
          <Box column justifyContent="center" alignItems="center" style={{height:'100vh'}}>
              <CircularProgress size={50} color="#4CA7D0"/>
          </Box>
        </MuiThemeProvider>
      );
    }else{
      return(
        <MuiThemeProvider muiTheme={lightBaseTheme} >
          <Box column justifyContent="center" alignItems="center" style={{height:'100%'}}>
            <Paper zDepth={1} style={styles.paper}>
              <Toolbar style={{backgroundColor:'#4CA7D0'}}>
                <ToolbarTitle text={"Allegati per la pratica "+this.props.params.pid} style={{color:'#FFFFFF', textAlign:'center', fontSize:'15px'}}/>
              </Toolbar>
              <Table selectable={false}>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                  <TableRow>
                    <TableHeaderColumn>Nome Documento</TableHeaderColumn>
                    <TableHeaderColumn>Data creazione</TableHeaderColumn>
                    <TableHeaderColumn>Azioni</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} selectable={false}>
                  {this.state.isLoading ? null : this.createTable()}
                </TableBody>
              </Table>
            </Paper>
            <Dialog
              title='Carica nuovo file'
              actions={actions}
              modal={true}
              open={this.state.open}
              onRequestClose={this.handleClose.bind(this, 1)}
              titleStyle={{color:'#59C2E6'}}
              contentStyle = {{color:'#666666'}}
            >
            <p>Completa le azioni per ultimare il caricamento del documento:</p>
            <div>
                <TextField hintText="Numero di pratica" />
                <FlatButton icon={<Attach/>} label="Allega il file di riferimento" backgroundColor='#FFFFFF'>
                  <input type="file" accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style={styles.inputFile} onChange={this._onFileSelection.bind(this)}/>
                </FlatButton>
                <Check style={{position:'relative',top:'6px', marginLeft:'7px'}} color={this.state.checkColor}/>
            </div>
            </Dialog>
          </Box>
        </MuiThemeProvider>
      );
    }
  }
}

const styles = {
  paper : {
    margin : '10px',
    marginTop : '20px',
    width : 'auto',
    height : 'auto'
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

export default GestisciAllegati;
