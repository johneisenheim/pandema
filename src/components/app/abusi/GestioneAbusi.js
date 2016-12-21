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

import styles from './GestioneAbusi.css.js';
import Box from 'react-layout-components';
import {Link} from "react-router";


class GestioneAbusi extends React.Component{

  constructor(props){
    super(props);
  }

  render (){
    return (
      <MuiThemeProvider muiTheme={lightBaseTheme} >
        <div style={{width : '100%', marginTop:'20px'}}>
          <Box id="a" justifyContent="center" alignItems="center" style={{height:'100%', width: '100%', overflow:'scroll'}}>
            <Paper zDepth={1} style={styles.paper}>
              <center><p style={{marginLeft:'30px', marginTop:'40px'}}>Seleziona la tipologia di abuso:</p></center>
              <Box column justifyContent="flex-start" alignItems="center" style={{marginLeft:'30px'}}>
                <RaisedButton
                  label="Abuso Generico"
                  containerElement={<Link to="/nuovapraticaabusi"/>}
                  backgroundColor ='#4CA7D0'
                  icon={<Description />}
                  labelStyle={{color:'#FFFFFF'}}
                  style={{marginTop:'30px'}}
                />

                <RaisedButton
                  label="Abusi in aree in concessione"
                  containerElement={<Link to="/nuovapraticaabusi"/>}
                  backgroundColor ='#4CA7D0'
                  icon={<Description />}
                  labelStyle={{color:'#FFFFFF'}}
                  style={{marginTop:'30px'}}
                />

                <RaisedButton
                  label="Cod. Nav. 47"
                  containerElement={<Link to="/nuovapraticaabusi"/>}
                  backgroundColor ='#4CA7D0'
                  icon={<Description />}
                  labelStyle={{color:'#FFFFFF'}}
                  style={{marginTop:'30px', marginBottom:'20px'}}
                />
              </Box>
            </Paper>
          </Box>
        </div>
      </MuiThemeProvider>
    )
    /*return (
      <MuiThemeProvider muiTheme={lightBaseTheme}>
        <Box column>
          <Box alignItems="center" justifyContent="flex-end" style={{marginTop:'15px'}}>
            <RaisedButton
              label="Aggiungi nuova pratica"
              containerElement={<Link to="/nuovapraticaabusi"/>}
              backgroundColor ='#4CA7D0'
              icon={<ContentAdd />}
              labelStyle={{color:'#FFFFFF'}}
              style={{marginTop:'10px'}}
            />
          </Box>
            <Paper zDepth={1} style={styles.paper}>
              <Toolbar style={{backgroundColor:'#4CA7D0'}}>
                <ToolbarTitle text="Gestione Abusi" style={{color:'#FFFFFF', textAlign:'center', fontSize:'15px'}}/>
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
                  <TableRow>
                    <TableRowColumn style={{ width:'80px' }}>N8977</TableRowColumn>
                    <TableRowColumn style={{ width:'50px' }}>D1</TableRowColumn>
                    <TableRowColumn>xxxxxx</TableRowColumn>
                    <TableRowColumn>xxxxxx</TableRowColumn>
                    <TableRowColumn style={{ width:'160px' }}>xxxxxx</TableRowColumn>
                    <TableRowColumn>
                      <IconButton>
                        <Folder color={'#909EA2'}/>
                      </IconButton>
                    </TableRowColumn>
                    <TableRowColumn>
                      <FlatButton label="Gestisci" containerElement={<Link to={`/handlegestioneabusi/k`} style={{color: 'white', textDecoration:'none'}} activeStyle={{color: 'white'}}/>} labelStyle={{color:'#0BA1DA'}} style={{marginLeft:'0px'}}/>
                    </TableRowColumn>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Box>
      </MuiThemeProvider>
    )*/
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

export default GestioneAbusi;
