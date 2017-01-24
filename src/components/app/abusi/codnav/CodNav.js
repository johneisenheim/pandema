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

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import Search from 'material-ui/svg-icons/action/search';
import Sort from 'material-ui/svg-icons/av/sort-by-alpha';

import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';

import FlatButton from 'material-ui/FlatButton';

import Folder from 'material-ui/svg-icons/file/folder';
import Description from 'material-ui/svg-icons/action/description';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import Box from 'react-layout-components';
import $ from 'jquery';
import CircularProgress from 'material-ui/CircularProgress';

import styles from './CodNav.css.js';
import SelectAbusi from '../../complementars/SelectAbusi';
import {Link} from "react-router";


class CodNav extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isLoading : true,
      data : []
    };
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'getAbusiCodNav?cid='+escape(global.city),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log('getAbusiCodNav', parsed)
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

  onSearchChange(e,v){
    var _self = this;
    if(!this.state.isLoading){
      this.setState({
        ...this.state,
        //isLoading : true
      });
    }
    if(v === ''){
      $.ajax({
          type: 'GET',
          url: constants.DB_ADDR+'getAbusiCodNav?cid='+escape(global.city),
          processData: false,
          contentType: false,
          success: function(data) {
            var parsed = JSON.parse(data);
            console.log('home successs')
            console.log(parsed);
            _self.setState({
                ..._self.state,
                isLoading : false,
                data : parsed.results
            });
            console.log(parsed);
          },
          error : function(err){
            console.log(err);
          }
      });
    }else{
      $.ajax({
          type: 'GET',
          url: constants.DB_ADDR+'searchTableE?search='+escape(v)+'&cid='+escape(global.city),
          processData: false,
          contentType: false,
          success: function(data) {
            var parsed = JSON.parse(data);
            _self.setState({
                ..._self.state,
                //isLoading : false,
                data : parsed.results
            });
            console.log('searchTableA',parsed);
          },
          error : function(err){
            console.log(err);
          }
      });
    }

  }

  onCalcola(usoscopo){
    console.log(usoscopo);
  }

  render (){
    if(this.state.isLoading){
      return(
        <Box alignItems="center" justifyContent="center" style={{width:'100%', height : '300px'}}>
          <CircularProgress size={30}/>
        </Box>
      );
    }else{
      var toReturn = [];
      if(this.state.data.length > 0){
        for( var i = 0 ; i < this.state.data.length; i++ ){
          toReturn.push(
            <TableRow key={i}>
              <TableRowColumn style={{ width:'80px' }}>{this.state.data[i].pratica_pandema_id}</TableRowColumn>
              <TableRowColumn style={{textAlign:'center'}}>
                <SelectAbusi value={this.state.data[i].stato_pratica_abuso_id} pid={this.state.data[i].pandema_abuso_id} dbid={this.state.data[i].id}/>
              </TableRowColumn>
              <TableRowColumn>{this.state.data[i].primo_avviso == null ? '-' : this.state.data[i].primo_avviso}</TableRowColumn>
              <TableRowColumn>{this.state.data[i].secondo_avviso == null ? '-' : this.state.data[i].secondo_avviso}</TableRowColumn>
              <TableRowColumn style={{ width:'160px' }}>
                <FlatButton label="Calcola" labelStyle={{color:'#0BA1DA'}} style={{marginLeft:'0px'}} onTouchTap={this.onCalcola.bind(this, this.state.data[i].descrizione)}/>
              </TableRowColumn>
              <TableRowColumn>
                <IconButton>
                  <Folder color={'#909EA2'}/>
                </IconButton>
              </TableRowColumn>
              <TableRowColumn>
                <FlatButton label="Gestisci" containerElement={<Link to={`/handleart47/`+this.state.data[i].id+'/'+this.state.data[i].pandema_abuso_id} style={{color: 'white', textDecoration:'none'}} activeStyle={{color: 'white'}}/>} labelStyle={{color:'#0BA1DA'}} style={{marginLeft:'0px'}}/>
              </TableRowColumn>
            </TableRow>
          );
        }
      }else{
        toReturn.push(
          <TableRow key={0}>
            <TableRowColumn style={{width:'100%', textAlign:'center'}}>Non ci sono abusi Cod. Nav. 47 inseriti.</TableRowColumn>
          </TableRow>
        )
      }
      return(
        <MuiThemeProvider muiTheme={lightBaseTheme}>
          <div>
                <Toolbar style={{backgroundColor:'#4CA7D0'}}>
                  <ToolbarTitle text="Abusi Cod. Nav. 47" style={{color:'#FFFFFF', textAlign:'center', fontSize:'15px'}}/>
                  <ToolbarGroup>
                    <FontIcon className="muidocs-icon-custom-sort" />
                    <ToolbarSeparator style={{backgroundColor:'rgba(255,255,255,0.4)'}}/>
                    <ToolbarGroup>
                      <IconMenu
                        iconButtonElement={<IconButton><Sort /></IconButton>}
                        value={1}
                        iconStyle={{width:'28px', height:'28px', fill:'#FFFFFF'}}
                        style={{marginLeft:'15px'}}
                      >
                        <MenuItem value="1" primaryText="N°Pratica" />
                        <MenuItem value="2" primaryText="Tipo" />
                        <MenuItem value="3" primaryText="Stato" />
                        <MenuItem value="4" primaryText="Data Ricezione" />
                        <MenuItem value="5" primaryText="Cognome Richiedente" />
                        <MenuItem value="5" primaryText="Codice uso/scopo" />
                      </IconMenu>
                        <Search color={'#FFFFFF'} style={{marginTop:'14px', width:'25px', height: '25px', marginRight:'10px', marginLeft:'20px'}}/>
                          <TextField
                            hintText="Cerca"
                            hintStyle = {styles.searchHintStyle}
                            inputStyle = {styles.searchInputStyle}
                            underlineFocusStyle = {styles.searchUnderlineFocusStyle}
                            onChange={this.onSearchChange.bind(this)}
                            id={'search'}
                          />
                    </ToolbarGroup>
                  </ToolbarGroup>
                </Toolbar>
                <Table selectable={false}>
                  <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                      <TableHeaderColumn style={{ width:'80px' }}>N°Pratica</TableHeaderColumn>
                      <TableHeaderColumn style={{ width:'50px' }}>Stato</TableHeaderColumn>
                      <TableHeaderColumn>Primo Avviso (€)</TableHeaderColumn>
                      <TableHeaderColumn>Secondo Avviso (€)</TableHeaderColumn>
                      <TableHeaderColumn style={{ width:'160px' }}>Calcola Importo alla data odierna</TableHeaderColumn>
                      <TableHeaderColumn>Fascicolo</TableHeaderColumn>
                      <TableHeaderColumn></TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false} selectable={false}>
                    {toReturn}
                  </TableBody>
                </Table>
              </div>
        </MuiThemeProvider>
      )
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
    primary1Color: '#E1E2E4',
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

export default CodNav;
