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

class DynamicTable extends React.Component{
  constructor(props, context){
    super(props, context);

    this.state = {
        isLoading : true,
        results : [],
        open : false,
        checkColor : '#D6D6D6',
        abusi : []
    };
  }

  createTable(){
    var tableContents =[];
    if( this.props.abusi.length == 0 ){
      return (
        <TableRow key={0}>
          <TableRowColumn></TableRowColumn>
          <TableRowColumn>Nessun dato presente.</TableRowColumn>
          <TableRowColumn></TableRowColumn>
        </TableRow>
      );
    }
    for( var i = 0; i < this.props.abusi.length; i++ ){
      tableContents.push(
        <TableRow key={i}>
          <TableRowColumn>{this.props.abusi[i].descrizione_com}</TableRowColumn>
          <TableRowColumn>{new Date(this.props.abusi[i].data_creazione).toLocaleDateString()}</TableRowColumn>
          <TableRowColumn>
            <IconButton onTouchTap={this.eyePressAbusi.bind(this, this.props.abusi[i].id)}><Download color="#909EA2"/></IconButton>
          </TableRowColumn>
        </TableRow>
      );
    }
    return tableContents;
  }

  eyePressAbusi(id){
    window.open(constants.DB_ADDR+'downloadFileAbuso?id='+id,'_blank');
  }

  render(){
      return(
        <MuiThemeProvider muiTheme={lightBaseTheme} >
          <Box column justifyContent="center" alignItems="center" style={{height:'100%'}}>
            <Paper zDepth={1} style={styles.paper}>
              <Toolbar style={{backgroundColor:'#4CA7D0'}}>
                <ToolbarTitle text={"Allegati Abuso "+this.props.name} style={{color:'#FFFFFF', textAlign:'center', fontSize:'15px'}}/>
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
                  {this.createTable()}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        </MuiThemeProvider>
      );
    }
}

const styles = {
  paper : {
    margin : '10px',
    marginTop : '30px',
    width : 'auto',
    height : 'auto'
  },
  paper2 : {
    margin : '10px',
    marginTop : '30px',
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

export default DynamicTable;
