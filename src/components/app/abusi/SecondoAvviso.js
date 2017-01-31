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
import Calculate from 'material-ui/svg-icons/hardware/keyboard';

import Eye from 'material-ui/svg-icons/image/remove-red-eye';
import Delete from 'material-ui/svg-icons/action/delete';
import Download from 'material-ui/svg-icons/file/file-download';
import Dialog from 'material-ui/Dialog';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

class SecondoAvviso extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading : true,
      data : [],
      file : undefined,
      opened : false,
      errorText : '',
      checkIconColor : 'lightgrey'
    };
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'getSecondoAvviso?pid='+this.props.pid+'&dbid='+this.props.dbid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.setState({
            ..._self.state,
            isLoading : false,
            data : parsed.results
          })
        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
        }
    });
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
        url: constants.DB_ADDR+'getSecondoAvviso?pid='+this.props.pid+'&dbid='+this.props.dbid,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.setState({
            ..._self.state,
            isLoading : false,
            data : parsed.results
          })
        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
        }
    });
  }

  eyePress(id){
    window.open(constants.DB_ADDR+'downloadFileAbuso?id='+id,'_blank');
  }

  deletePress(path, allegato_id){
    var r = confirm("Sei sicuro di voler eliminare questo documento?");
    var _self = this;
    if(r){
      $.ajax({
          type: 'GET',
          url: constants.DB_ADDR+'deleteDocumentAbuso?allegatoID='+escape(allegato_id)+'&path='+escape(path),
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
    window.open(LINKS.secondoavviso, '_blank')
  }

  handleModalButtonClose(){
    this.setState({
      ...this.state,
      opened : false
    })
  }

  handleModalButtonSubmit(){
    if( this.state.file === undefined || this.refs.valore.getValue() === ''){
      alert("Devi inserire sia il valore che il file allegato per poter procedere.");
      return;
    }
    if(isNaN(this.refs.valore.getValue())){
      alert("Il valore deve essere di tipo 00.00");
      return;
    }
    this.setState({
      ...this.state,
      opened : false
    });

    var _self = this;
    var formData = new FormData();
    formData.append('pid', this.props.pid);
    formData.append('dbid', this.props.dbid);
    formData.append('path', this.props.path);
    formData.append('atype', 4);
    formData.append('file', this.refs.file.files[0]);
    formData.append('euroValue',this.refs.valore.getValue());
    $.ajax({
        type: 'POST',
        data: formData,
        url: constants.DB_ADDR+'addFileAbusi',
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

  handleModalClose(){

  }

  onChangeHandler(){
    this.setState({
      ...this.state,
      file : this.refs.file.files[0],
      checkIconColor : 'green'
    });
  }

  openModal(v){
    this.setState({
      ...this.state,
      opened : true
    });
  }

  handleTouchTap(event){
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose(){
    this.setState({
      open: false
    });
  }

  onIconMenu(e, k, v){

    switch(v){
      case 0:
        window.open(LINKS.i_usi_vari, '_blank');
        break;
      case 1:
        window.open(LINKS.i_turistico_e_diporto, '_blank');
        break;
      case 2:
        window.open(LINKS.i_pesca_acqua_cantieri, '_blank');
      break;
      case 3:
        window.open(LINKS.i_regione_campania, '_blank');
      break;
      case 4:
        window.open(LINKS.i_pertinenza_demaniale,'_blank');
      break;
    }

  }

  handleTouchTap2(){
    //console.log(this.props.usoscopo[0].descrizione);
  }

  downloadExcel(who){
    switch(who){
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
    }
  }


  render (){
    const actions = [
      <FlatButton
        label="Annulla"
        primary={true}
        onTouchTap={this.handleModalButtonClose.bind(this)}
        labelStyle={{color : '#4A4A4A'}}
      />,
      <FlatButton
        label="Aggiungi"
        primary={true}
        keyboardFocused={false}
        onTouchTap={this.handleModalButtonSubmit.bind(this)}
        labelStyle={{color : '#4988A9'}}
      />
    ];
    if( this.state.isLoading ){
      return(
        <Box alignItems="center" justifyContent="center" style={{width:'100%', height : '300px'}}>
          <CircularProgress size={30}/>
        </Box>
      )
    }else{
      var tableContents = [];
      var usiscopi = [];
      if(this.props.usoscopo !== undefined ){
        for (var j = 0; j < this.props.usoscopo.length; j++){
          if(this.props.usoscopo[j].descrizione_com !== undefined)
            usiscopi.push(
              <MenuItem primaryText={this.props.usoscopo[j].descrizione_com} key={j}/>
            );
        }
      }
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
                <TableRowColumn>Secondo Avviso {i+1}</TableRowColumn>
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
          <Box column style={{marginTop:'30px', width:'98%'}} alignItems="flex-start" justifyContent="flex-start">
              <Toolbar style={{backgroundColor:'#4CA7D0', width:'100%'}}>
                <ToolbarTitle text="File caricato per Secondo Avviso" style={{color:'#FFFFFF', textAlign:'center', fontSize:'15px'}}/>
                <ToolbarGroup style={{marginRight:'0px'}}>
                  { this.props.usoscopo[0].descrizione_com !== undefined ?
                    <div>
                  <FlatButton label="Calcola Indennità" icon={<Calculate style={{fill:'#FFFFFF'}}/>} style={{marginTop:'10px', marginRight:'0px'}} labelStyle={{color:'#FFFFFF'}} onTouchTap={this.handleTouchTap.bind(this)}/>
                      <Popover
                      open={this.state.open}
                      anchorEl={this.state.anchorEl}
                      anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                      targetOrigin={{horizontal: 'right', vertical: 'top'}}
                      onRequestClose={this.handleRequestClose.bind(this)}
                      touchTapCloseDelay={100}
                    >
                          <Menu onItemTouchTap={this.onIconMenu.bind(this)}>
                            {usiscopi}
                          </Menu>
                        </Popover>
                      </div>
                      :
                      <FlatButton label="Calcola Indennità" icon={<Calculate style={{fill:'#FFFFFF'}}/>} style={{marginTop:'10px', marginRight:'0px'}} labelStyle={{color:'#FFFFFF'}} onTouchTap={this.downloadExcel.bind(this,this.props.usoscopo[0].descrizione)}/>
                    }
                  <FlatButton label="Scarica il modulo" icon={<Download style={{fill:'#FFFFFF'}}/>} style={{marginTop:'10px', marginRight:'0px'}} labelStyle={{color:'#FFFFFF'}} onTouchTap={this.downloadModulo.bind(this)}/>
                  <FlatButton label="Allega File" icon={<Attach style={{fill:'#FFFFFF'}}/>} style={{marginTop:'10px', marginRight:'0px'}} labelStyle={{color:'#FFFFFF'}} disabled={this.state.data.length > 0} onTouchTap={this.openModal.bind(this)}/>
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
              <Dialog
                  title={'Primo Avviso'}
                  actions={actions}
                  modal={true}
                  open={this.state.opened}
                  onRequestClose={this.handleModalClose.bind(this)}
                  autoScrollBodyContent={true}
                  autoDetectWindowHeight={true}
                  contentStyle={{width : '80%', maxWidth : 'none', height : '100%', maxHeight : 'none'}}
                  titleStyle={{color:'#4988A9', textAlign:'center'}}
                >
                  <Box column style={{width:'100%'}} justifyContent="center" alignItems="flex-start">
                    <p>Inserisci il valore calcolato per Primo Avviso e carica il file correlato:</p>
                    <Box justifyContent="center" alignItems="center">
                      <TextField
                          id="valore"
                          ref="valore"
                          hintText = "Valore Calcolato(00.00)"
                          style={{width:'240px'}}
                          errorText={this.state.errorText}
                        />
                        <FlatButton label="Carica File" icon={<Attach/>} style={{marginTop:'10px', marginLeft : '15px', marginRight:'0px'}}>
                          <input type="file" accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style={styles.inputFile} onChange={this.onChangeHandler.bind(this)} ref="file"/>
                        </FlatButton>
                        <CheckIcon style={{fill:this.state.checkIconColor, marginTop:'10px', marginLeft:'10px'}}/>
                    </Box>
                  </Box>
                </Dialog>
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


export default SecondoAvviso;
