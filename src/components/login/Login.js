import React from 'react';
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {lightBlue200, lightBlue300, lightBlueA100} from 'material-ui/styles/colors';
import {Page, Box} from 'react-layout-components';
import TextField from 'material-ui/TextField';
import PandemaLogo from '../../../static/pandemalogo.png';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import styles from './Login.css.js';
import LoginStore from '../../stores/LoginStore';
import actions from '../../actions/actions';
import CircularProgress from 'material-ui/CircularProgress';
import $ from 'jquery';
import WebStorage from 'react-webstorage';

class Login extends React.Component {

  constructor(props, context) {
    super(props, context);
    console.log(props);
    this.state = LoginStore.getLoginState();
  }

  componentWillMount(){
    LoginStore.on('login.toggledTextFieldStatus', this.updateState.bind(this));
    LoginStore.on('login.loadingStarted', this.updateState.bind(this));
  }

  updateState(){
    this.setState(LoginStore.getLoginState());
  }

  childContextTypes: {
    muiTheme: React.PropTypes.object
  }

  signin () {
    let _self = this.props;
    if(this.refs.usernameField.getValue() === '' || this.refs.passwordField.getValue() === '' ){
      actions.toggleTextFieldStatus(this.refs.usernameField.getValue(), this.refs.passwordField.getValue());
    }else{

        //actions.startLoading();
        $.ajax({
						type: 'POST',
						data: {username: this.refs.usernameField.getValue(), password : this.refs.passwordField.getValue()},
            url: constants.DB_ADDR+'login',
            success: function(data) {
                var parsed = JSON.parse(data);
                if( parsed.status ){
                  if(parsed.res.length > 0){
                    var webStorage = new WebStorage(
              				window.localStorage ||
                  		window.sessionStorage
              			);
                    webStorage.setItem("_pandema", true);
                    webStorage.setItem("city", 'Nola');
                    //console.log(global.greatObject);
                    global.greatObject.entity = parsed.res.citta;
                    _self.handler();
                    //_self.history.push('/');
                  }else{
                    alert("Username o password errati!");
                  }
                }else{
                    alert("C'è stato un errore nell'elaborazione della richiesta. Per favore, riprova!");
                }
            }
        });
    }
  }

  onChangeUsernameTextField(){
    if(this.state.usernameError !== "" )
      actions.toggleTextFieldStatus(this.refs.usernameField.getValue(), this.refs.passwordField.getValue());
  }
  onChangePasswordTextField(){
    if(this.state.passwordError !== "" )
      actions.toggleTextFieldStatus(this.refs.usernameField.getValue(), this.refs.passwordField.getValue());
  }

  showItemToLog(){
    if(this.state.spinnerStatus==='visible')
      return (
        <CircularProgress size={1} style={{marginBottom:'30px', marginTop:'21px'}}/>
      );
    else return(
      <RaisedButton label="Accedi" primary={true} style={styles.button} onClick={this.signin.bind(this)} disabled={this.state.buttonDisabled}/>
    )
  }
  render(){
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Box style={styles.bg} justifyContent="center">
          <Box justifyContent="center" alignItems="center">
            <Paper zDepth={1} >
              <Box column justifyContent="center" alignItems="center">
              <img src={PandemaLogo} style={styles.logo}/>
              <TextField
                  hintText=""
                  floatingLabelText="Username"
                  id="username"
                  style = {styles.username}
                  hintStyle = {styles.hint}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelStyle={styles.floatingLabelStyle}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  errorText = {this.state.usernameError}
                  onChange = {this.onChangeUsernameTextField.bind(this)}
                  disabled = {this.state.usernameDisabled}
                  ref = "usernameField"
                />
                <TextField
                    hintText=""
                    floatingLabelText="Password"
                    type="password"
                    id="password"
                    style = {styles.password}
                    underlineStyle={styles.underlineStyle}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    errorText = {this.state.passwordError}
                    onChange = {this.onChangePasswordTextField.bind(this)}
                    disabled = {this.state.passwordDisabled}
                    ref = "passwordField"
                  />
                  <Checkbox
                    label="Ricordami d'ora in poi"
                    style = {styles.rememberMe}
                    labelStyle = {{marginLeft : "-10px"}}
                  />
                {this.showItemToLog()}
              </Box>
            </Paper>
          </Box>
        </Box>
      </MuiThemeProvider>
    )
  }
}

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#59C2E6',
    primary2Color: lightBlue200,
    primary3Color: lightBlue300,
    textColor: "#666666",
    accent1Color: lightBlueA100
  },
},{
  paper: {
    height: 'auto',
    width: 'auto',
    textAlign: 'center'
  },
  userAgent: 'all'
});


export default Login;
