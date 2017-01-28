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

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter} from 'material-ui/Table';

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
import Edit from 'material-ui/svg-icons/editor/mode-edit';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import styles from './Home.css.js';
import Box from 'react-layout-components';
import {Link} from "react-router";

import CircularProgress from 'material-ui/CircularProgress';
import $ from 'jquery';
import Select from '../complementars/Select';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import DropdownA from './DropdownA';
import { browserHistory } from 'react-router';
import Mailto from 'react-mailto';
import Pagination from '../../Pagination';

//67B8DD 67B3DD 62ABD3 73B7DD 4CA7D0 909EA2

//"/home/d1handler"

/*<FloatingActionButton mini={true} style={{marginRight:'15px'}} primary={true} iconStyle={{fill:'#FFFFFF'}} backgroundColor='#4CA7D0' containerElement={<Link to="/nuovapratica"></Link>}>
    <ContentAdd/>
</FloatingActionButton>*/

class Home extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isLoading : true,
      open : false,
      data : [],
      offset : 0,
      count : 0
    };
    console.log(constants.DB_ADDR);
  }

  componentDidMount(){
    var _self = this;
    $.ajax({
        type: 'GET',
        url: constants.DB_ADDR+'getgeneralinfos?cid='+escape(global.city)+'&offset='+this.state.offset,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log('home successs',parsed);
          _self.setState({
              ..._self.state,
              isLoading : false,
              data : parsed.results,
              count : parsed.count[0].ccount
          });
          console.log(parsed);
        },
        error : function(err){
          console.log(err);
        }
    });
  }

  createSelect(){
    //{this.state.data[i].stato_pratica_desc}
  }

  changePraticaStatus(e,v,a,b){
    console.log(a);
    this.refs.status.props.value = a;
    console.log(this.refs.status);
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
          url: constants.DB_ADDR+'getgeneralinfos?cid='+escape(global.city)+'&offset='+this.state.offset,
          processData: false,
          contentType: false,
          success: function(data) {
            var parsed = JSON.parse(data);
            console.log('home successs')
            console.log(parsed);
            _self.setState({
                ..._self.state,
                isLoading : false,
                data : parsed.results,
                count : parsed.count[0].ccount
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
          url: constants.DB_ADDR+'searchTableA?search='+escape(v)+'&cid='+escape(global.city),
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

  handleRequestClose(){
    this.setState({
      open: false
    });
  }

  onIconMenu(e, k, v){
    console.log('herre', e, k, v)
    switch(v){
      case 0:
        browserHistory.push('/nuovapraticad1');
      break;
      case 1:
        this.refs.dropdown.setdtype('d2');
      break;
      case 2:
        this.refs.dropdown.setdtype('d3');
      break;
      case 3:
        this.refs.dropdown.setdtype('d3s');
      break;
      case 4:
        this.refs.dropdown.setdtype('d4');
      break;
      case 5:
        browserHistory.push('/nuovapraticad5');
      break;
      case 6:
        this.refs.dropdown.setdtype('d6');
      break;
    }
  }

  handleTouchTap(event){
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  reload(){
    var _self = this;
    $.ajax({
        type: 'GET',
        url: constants.DB_ADDR+'getgeneralinfos?cid='+escape(global.city)+'&offset='+this.state.offset,
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          console.log('home successs',parsed);
          _self.setState({
              ..._self.state,
              isLoading : false,
              data : parsed.results,
              count : parsed.count[0].ccount
          });
          console.log(parsed);
        },
        error : function(err){
          console.log(err);
        }
    });
  }

  onPageRightClick(){
    var _self = this;
    this.setState({
      ...this.state,
      offset : this.state.offset+1
    },
      function(){
        console.log('OFFSET',_self.state.offset)
        _self.reload();
      }
    );
  }

  onPageLeftClick(e,v){
    var _self = this;
    this.setState({
      ...this.state,
      offset : this.state.offset-1
    },
      function(){
        _self.reload();
      }
    );
  }

  /**/

  render (){
    var tableContents = [];
    if( this.state.isLoading ){
      return (
        <Box alignItems="center" justifyContent="center" style={{width:'100%', height : '300px'}}>
          <CircularProgress size={30}/>
        </Box>
      );
    }else{
      if(this.state.data.length == 0){
        tableContents.push(
          <TableRow key={0}>
            <TableRowColumn style={{width:'100%', textAlign:'center'}}>Non ci sono pratiche inserite.</TableRowColumn>
          </TableRow>
        );
      }else{
        for( var i = 0; i < this.state.data.length; i++ ){
          var linkToD = 0;
          switch(this.state.data[i].tipo_documento_id){
            case 1 :
              linkToD = '/d1handler/'+this.state.data[i].pandema_id+'/'+this.state.data[i].id;
            break;
            case 2:
              linkToD = '/d2handler/'+this.state.data[i].pandema_id+'/'+this.state.data[i].id;
            break;
            case 3:
              linkToD = '/d3handler/'+this.state.data[i].pandema_id+'/'+this.state.data[i].id;
            break;
            case 4:
              linkToD = '/d4handler/'+this.state.data[i].pandema_id+'/'+this.state.data[i].id;
            break;
            case 5:
              linkToD = '/d5handler/'+this.state.data[i].pandema_id+'/'+this.state.data[i].id;
            break;
            case 6:
              linkToD = '/d3shandler/'+this.state.data[i].pandema_id+'/'+this.state.data[i].id;
            break;
            case 7:
              linkToD = '/d6handler/'+this.state.data[i].pandema_id+'/'+this.state.data[i].id;
            break;
          }
          console.log(this.state.data[i].email);
          tableContents.push(
            <TableRow key={i}>
              <TableRowColumn style={{textAlign:'center'}}>{this.state.data[i].pandema_id}</TableRowColumn>
              <TableRowColumn style={{width:'20px', textAlign:'center'}}>{this.state.data[i].descrizione}</TableRowColumn>
              <TableRowColumn style={{width:'100px', textAlign:'center'}}>
                <Select value={this.state.data[i].stato_pratica_id} pid={this.state.data[i].pandema_id} dbid={this.state.data[i].id} reload={this.reload.bind(this)} />
              </TableRowColumn>
              <TableRowColumn style={{textAlign:'center'}}>{new Date(this.state.data[i].data).toLocaleDateString()}</TableRowColumn>
              <TableRowColumn style={{textAlign:'center'}}>{this.state.data[i].nome} {this.state.data[i].cognome}</TableRowColumn>
              <TableRowColumn style={{textAlign:'center'}}>{
                  this.state.data[i].email !== null
                  ?
                  <Mailto email={this.state.data[i].email} obfuscate={true}>
                    {this.state.data[i].email}
                  </Mailto>
                  :
                  "-"}
              </TableRowColumn>
              <TableRowColumn style={{textAlign:'center'}}>{this.state.data[i].descrizione_com}</TableRowColumn>
              <TableRowColumn>
                <center><IconButton containerElement={<Link to={`/gestisciallegati/`+this.state.data[i].pandema_id+'/'+this.state.data[i].id} style={{color: 'white', textDecoration:'none'}} activeStyle={{color: 'white'}}></Link>}><Folder color={'#909EA2'}/></IconButton></center>
              </TableRowColumn>
              <TableRowColumn>
                <Link to={linkToD} style={{color: 'white', textDecoration:'none'}} activeStyle={{color: 'white'}}><FlatButton label="Gestisci" labelStyle={{color:'#0BA1DA'}} style={{marginLeft:'0px'}}/></Link>
              </TableRowColumn>
            </TableRow>
          );
        }
      }
      return (
        <MuiThemeProvider muiTheme={lightBaseTheme}>
          <Box column>
            <Box alignItems="center" justifyContent="flex-end" style={{marginTop:'15px'}}>
              <RaisedButton
                label="Aggiungi nuova pratica"
                backgroundColor ='#4CA7D0'
                icon={<ContentAdd />}
                labelStyle={{color:'#FFFFFF'}}
                style={{marginTop:'10px'}}
                onTouchTap={this.handleTouchTap.bind(this)}
              />
              <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                onRequestClose={this.handleRequestClose.bind(this)}
                touchTapCloseDelay={100}
              >
                <Menu onItemTouchTap={this.onIconMenu.bind(this)}>
                  <MenuItem primaryText="D1" />
                  <MenuItem primaryText="D2" />
                  <MenuItem primaryText="D3" />
                  <MenuItem primaryText="D3S" />
                  <MenuItem primaryText="D4" />
                  <MenuItem primaryText="D5" />
                  <MenuItem primaryText="D6" />
                </Menu>
              </Popover>
            </Box>
              <Paper zDepth={1} style={styles.paper}>
                <Toolbar style={{backgroundColor:'#4CA7D0'}}>
                  <ToolbarTitle text="Licenze, Concessioni e Autorizzazioni" style={{color:'#FFFFFF', textAlign:'center', fontSize:'15px'}}/>
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
                      <TableHeaderColumn style={{textAlign:'center'}}>N°Pratica</TableHeaderColumn>
                      <TableHeaderColumn style={{width:'20px'}}>Tipo</TableHeaderColumn>
                      <TableHeaderColumn style={{width:'100px', textAlign:'center'}}>Stato</TableHeaderColumn>
                      <TableHeaderColumn style={{textAlign:'center'}}>Data Ricezione</TableHeaderColumn>
                      <TableHeaderColumn style={{textAlign:'center'}}>Richiedente</TableHeaderColumn>
                      <TableHeaderColumn style={{textAlign:'center'}}>Email</TableHeaderColumn>
                      <TableHeaderColumn style={{textAlign:'center'}}>Codice uso/scopo</TableHeaderColumn>
                      <TableHeaderColumn style={{textAlign:'center'}}>Allegati</TableHeaderColumn>
                      <TableHeaderColumn style={{textAlign:'center'}}></TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false} selectable={false}>
                    {tableContents}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableRowColumn>
                        <Pagination offset={this.state.offset} limit={10} total={this.state.count} onPageRightClick={this.onPageRightClick.bind(this)} onPageLeftClick={this.onPageLeftClick.bind(this)}/>
                      </TableRowColumn>
                    </TableRow>
                  </TableFooter>
                </Table>
              </Paper>
              <DropdownA ref="dropdown"/>
            </Box>
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

export default Home;
