import React from 'react';
import {Box, Flex} from 'react-layout-components';
import styles from './Admin.css.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Logo from '../../../static/pandemalogo.png';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { browserHistory } from 'react-router';
import {
lightBlue200, lightBlueA100,lightBlue300,
grey100, grey300, grey400, grey500, grey700,grey900,blue700,
pinkA200,
white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import $ from 'jquery';
import * as constants from '../../constants';


class Admin extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isLogged : false,
      citta : '',
      cap : '',
      username : '',
      password : '',
      _citta : '',
      _cap : '',
      _username : '',
      _password : '',
      adminUsername : '',
      _adminUsername : '',
      adminPassword : '',
      _adminPassword : ''
    }
  }

  onSubmit(){

    let citta_ = '', cap_ = '', username_ = '', password_ = '';
    let _self = this;

    if( this.state.citta === '')
      citta_ = 'Questo campo è richiesto!';
    if( this.state.cap === '')
      cap_ = 'Questo campo è richiesto!';

    if( this.state.cap !== '' )
      if( isNaN(this.state.cap))
        cap_ = 'Il cap deve essere un numero!';

    if(citta_ !== '' || cap_ !== '' || username_ !== '' || password_ !== ''){
      this.setState({
        ...this.state,
        _citta : citta_,
        _cap : cap_,
        _username : username_,
        _password : password_
      });
      return;
    }

    var formData = new FormData();
    formData.append('citta', this.state.citta);
    formData.append('cap', this.state.cap);
    formData.append('file', this.refs.file.files[0]);

    $.ajax({
        type: 'POST',
        data: formData,
        url: constants.DB_ADDR+'addComune',
        processData: false,
        contentType: false,
        success: function(data) {
            var parsed = JSON.parse(data);
            if( parsed.status ){
              if( parsed.message !== '')
                alert(parsed.message);
              else{
                alert("Inserimento avvenuto con successo!");
                _self.setState({
                  citta : '',
                  cap : '',
                  username : '',
                  password : '',
                  _citta : '',
                  _cap : '',
                  _username : '',
                  _password : ''
                })
              }
            }else{
                alert(parsed.message);
            }
        }
    });


  }

  onCittaChange(e,v){
    this.setState({
      ...this.state,
      citta : v,
      _citta : ''
    })
  }

  onCapChange(e,v){
    this.setState({
      ...this.state,
      cap : v,
      _cap : ''
    })
  }

  onUsernameChange(e,v){
    this.setState({
      ...this.state,
      username : v,
      _username : ''
    })
  }

  onPasswordChange(e,v){
    this.setState({
      ...this.state,
      password : v,
      _password : ''
    })
  }

  onAdminUsernameChange(e,v){
    this.setState({
      ...this.state,
      adminUsername : v,
      _adminUsername : ''
    })
  }

  onAdminPasswordChange(e,v){
    this.setState({
      ...this.state,
      adminPassword : v,
      _adminPassword : ''
    })
  }

  onAccedi(){
    var username_ = '', password_ = '';
    if( this.state.adminUsername === '' )
      username_ = 'Questo campo è obbligatorio!';
    if( this.state.adminPassword === '')
      password_ = 'Questo campo è obbligatorio!';

    if( username_ === '' && password_ === '' ){
      if(this.state.adminUsername === 'admin' && this.state.adminPassword === 'pandema2016talassa'){
        this.setState({
          ...this.state,
          isLogged : true,
          _adminPassword : '',
          _adminUsername : '',
          adminPassword : '',
          adminUsername : ''
        })
      }else{
        alert('Username e/o password errati!');
      }
    }else{
      this.setState({
        ...this.state,
        _adminUsername : username_,
        _adminPassword : password_
      });
    }

  }

  imageChange(){

  }

  gotoPandema(){
    browserHistory.push('/');
  }

  render(){
    if( !this.state.isLogged ){
      return(
        <MuiThemeProvider muiTheme={lightBaseTheme}>
          <Box column alignItems="center" justifyContent="center" flex={1} style={{height:'100%'}}>
            <Paper zDepth={1} style={styles.paper}>
              <Box column justifyContent="center" alignItems="center" style={{marginTop:'20px', marginLeft:'20px'}}>
                <img src = {Logo} style = {styles.logo}/>
                <Box justifyContent="flex-start" alignItems="center">
                  <p style={{marginTop:'30px'}}><span>Username:</span></p>
                    <TextField
                        id="admin_username"
                        ref="admin_username"
                        hintText = "Username amministratore"
                        style={{marginLeft:'30px', marginTop:'5px'}}
                        errorText={this.state._adminUsername}
                        value={this.state.adminUsername}
                        onChange={this.onAdminUsernameChange.bind(this)}
                      />
                </Box>
                <Box justifyContent="flex-start" alignItems="center">
                  <p style={{marginTop:'30px'}}><span>Password:</span></p>
                    <TextField
                        id="admin_password"
                        ref="admin_password"
                        hintText = "Password amministratore"
                        type="password"
                        style={{marginLeft:'30px', marginTop:'5px'}}
                        errorText={this.state._adminPassword}
                        value={this.state.adminPassword}
                        onChange={this.onAdminPasswordChange.bind(this)}
                      />
                </Box>
                <Box column justifyContent="flex-start" alignItems="center" style={{marginTop:'30px'}}>
                  <RaisedButton label="Accedi" primary={true} labelStyle={{color:'#FFFFFF'}} onTouchTap={this.onAccedi.bind(this)}/>
                </Box>
              </Box>
            </Paper>
          </Box>
        </MuiThemeProvider>
      );
    }else{
      return (
        <MuiThemeProvider muiTheme={lightBaseTheme}>
          <Box column alignItems="center" justifyContent="center" flex={1} style={{height:'100%'}}>
            <Paper zDepth={1} style={styles.paper}>
              <Box column justifyContent="center" alignItems="center" style={{marginTop:'20px', marginLeft:'20px'}}>
                <img src = {Logo} style = {styles.logo}/>
                <Box justifyContent="flex-start" alignItems="center">
                  <p style={{marginTop:'30px'}}><span>Città:</span></p>
                    <TextField
                        id="citta"
                        ref="citta"
                        hintText = "Inserisci la città"
                        style={{marginLeft:'30px', marginTop:'5px'}}
                        errorText={this.state._citta}
                        value={this.state.citta}
                        onChange={this.onCittaChange.bind(this)}
                      />
                </Box>
                <Box justifyContent="flex-start" alignItems="center">
                  <p style={{marginTop:'30px'}}><span>CAP:</span></p>
                    <TextField
                        id="cap"
                        ref="cap"
                        hintText = "Inserisci il CAP"
                        style={{marginLeft:'30px', marginTop:'5px'}}
                        errorText={this.state._cap}
                        value={this.state.cap}
                        onChange={this.onCapChange.bind(this)}
                      />
                </Box>
                <Box column justifyContent="flex-start" alignItems="center">
                    <FlatButton label="Inserisci Immagine Comune" labelStyle={{color:'#4CA7D0'}} style={{marginTop:'10px'}}>
                      <input type="file" style={styles.inputFile} onChange={this.imageChange.bind(this)} ref="file"/>
                    </FlatButton>
                </Box>
                <Box column justifyContent="flex-start" alignItems="center" style={{marginTop:'30px'}}>
                  <RaisedButton label="Inserisci" primary={true} labelStyle={{color:'#FFFFFF'}} onTouchTap={this.onSubmit.bind(this)}/>
                  <FlatButton label="Vai a Pandemaaaaaaa" labelStyle={{color:'#4CA7D0'}} style={{marginTop:'10px'}} onTouchTap={this.gotoPandema.bind(this)}/>
                </Box>
              </Box>
            </Paper>
          </Box>
        </MuiThemeProvider>
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

export default Admin;
