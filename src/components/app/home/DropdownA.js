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
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import AutoComplete from 'material-ui/AutoComplete';


import { browserHistory } from 'react-router';
import $ from 'jquery';

class DropdownA extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      opened : false,
      errorText : '',
      text : '',
      isLoading : false,
      data : [],
      ids : {},
      selectedPID : undefined,
      nextDisabled : true,
      dtype : undefined
    }
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'getD1s?cid='+escape(global.city),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          var toPush = [];
          var ids = {};
          for( var i = 0; i < parsed.results.length; i++ ){
            toPush.push(parsed.results[i].pandema_id);
            ids[parsed.results[i].pandema_id] = parsed.results[i].id;
          }
          _self.setState({
            ..._self.state,
            isLoading : false,
            data : toPush,
            ids : ids
          });
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });
  }

  openModal(v){
    this.setState({
      ...this.state,
      opened : true
    });
  }

  setdtype(type){
    console.log(type);
    this.setState({
      ...this.state,
      dtype : type,
      opened : true
    });
  }

  handleModalButtonClose(){
    this.setState({
      ...this.state,
      opened : false
    })
  }

  handleModalButtonSubmit(){
    var _self = this;
    this.setState({
      ...this.state,
      isLoading : true
    });
    //JOHNEISENHEIM devi inserire la query del tipo insertnewpraticadropdown
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'insertnewpraticadropdown?comune_id='+escape(global.city)+'&tipodocumento='+escape(_self.state.dtype.toUpperCase())+'&npratica='+escape(_self.state.selectedPID)+'&pid='+escape(_self.state.ids[_self.state.selectedPID]),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log('parsed', parsed.response)
          if(parsed.response){
            _self.setState({
              ..._self.state,
              isLoading : false
            });
            var linkto = _self.state.dtype+'handler/'+_self.state.selectedPID+'/'+_self.state.ids[_self.state.selectedPID];
            browserHistory.push(linkto);
          }else alert('Errore', parsed.err);
        },
        error : function(err){
          alert('Errore : '+err);
          console.log(err);
        }
    });
  }

  handleModalClose(){}

  _onUpdateInput(searchText, dataSource){
    if(dataSource.indexOf(searchText) == -1)
      this.setState({
        ...this.state,
        nextDisabled : true
      });
    else this.setState({
      ...this.state,
      nextDisabled : false
    });
  }

  onMenuItemTap(name,index){
    if(index !== -1){
      //significa che non ha scritto cose a caso
      this.setState({
        ...this.state,
        nextDisabled : false,
        selectedPID : name
      })
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
        ref="next"
        onTouchTap={this.handleModalButtonSubmit.bind(this)}
        labelStyle={{color : '#4988A9'}}
        disabled={this.state.nextDisabled}
      />
    ];

    var praticaType = this.state.dtype !== undefined ? this.state.dtype : '';
    return (
      <MuiThemeProvider muiTheme={lightBaseTheme} >
        <Dialog
            title={'Nuova Pratica '+praticaType}
            actions={actions}
            modal={true}
            open={this.state.opened}
            onRequestClose={this.handleModalClose.bind(this)}
            autoScrollBodyContent={true}
            autoDetectWindowHeight={true}
            contentStyle={{width : '80%', maxWidth : 'none', height : '100%', maxHeight : 'none'}}
            titleStyle={{color:'#4988A9', textAlign:'center'}}
          >
          {!this.state.isLoading ?
          <div>
            <p>Per creare una nuova pratica, inserisci il numero di pratica D1 associata:</p>
            <Box style={{marginTop:'20px', width : '100%'}} alignItems="center" justifyContent="center">
            <AutoComplete
              floatingLabelText="Inserisci il numero di pratica per l'autocompletamento"
              filter={AutoComplete.caseInsensitiveFilter}
              dataSource={this.state.data}
              maxSearchResults={10}
              fullWidth={true}
              disabled={this.state.data.length == 0}
              onNewRequest={this.onMenuItemTap.bind(this)}
              onUpdateInput={this._onUpdateInput.bind(this)}
            />
            </Box>
            {this.state.data.length == 0
              ?
               <p style={{fontSize:'13px'}}><b>*Non ci sono pratiche inserite a cui poter fare riferimento.</b></p>
              :
              null
            }
          </div>
          :
          <Box alignItems="center" justifyContent="center" style={{width:'100%', height : '300px'}}>
            <CircularProgress size={30}/>
          </Box>
          }
        </Dialog>
      </MuiThemeProvider>
    )
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

export default DropdownA;
