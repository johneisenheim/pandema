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

class DropdownB extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      opened : false,
      errorText : '',
      text : '',
      isLoading : false,
      data : [],
      nextDisabled : true,
      pratica_abuso : undefined
    }
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'getDInfosForAbusi?cid='+escape(global.city),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          var toPush = [];
          for( var i = 0; i < parsed.results.length; i++ ){
            toPush.push(parsed.results[i].pandema_id);
          }
          /*toPush.push('carrot');
          toPush.push('banana');
          toPush.push('apple');
          toPush.push('orange');*/
          _self.setState({
            ..._self.state,
            isLoading : false,
            data : toPush
          });
        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
        }
    });
  }

  openModal(v){
    this.setState({
      ...this.state,
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
    })
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'addNewAbusoCodNav?ref='+escape(_self.state.pratica_abuso)+'&comune_id='+escape(global.city),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.setState({
            ..._self.state,
            isLoading : false,
            opened : false
          });
          //vai a quello nuovo
          var link = '/handleart47/'+parsed.id+'/'+_self.state.pratica_abuso+"_"+parsed.id+"AB";
          browserHistory.push(link);
        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
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
        pratica_abuso : name
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
        onTouchTap={this.handleModalButtonSubmit.bind(this)}
        labelStyle={{color : '#4988A9'}}
        disabled={this.state.nextDisabled}
      />
    ];

    return (
      <MuiThemeProvider muiTheme={lightBaseTheme} >
        <Dialog
            title={'Nuovo Abuso Cod. Nav. 47'}
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
            <p>Per creare un nuovo abuso in aree in concessione, inserisci il numero di pratica della pratica Dx associata:</p>
            <Box style={{marginTop:'20px', width : '100%'}} alignItems="center" justifyContent="center">
            <AutoComplete
              floatingLabelText="Inserisci il numero di pratica per l'autocompletamento..."
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
               <p style={{fontSize:'13px'}}>*Non ci sono pratiche inserite a cui poter fare riferimento per gli abusi.</p>
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

export default DropdownB;
