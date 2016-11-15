import flux from 'flux-react';
import actions from '../actions/actions.js';

var LoginStore = flux.createStore({
    usernameError: "",
    passwordError:"",
    usernameDisabled : false,
    passwordDisabled : false,
    buttonDisabled : false,
    spinnerStatus : 'hidden',
    actions: [
        actions.toggleTextFieldStatus,
        actions.startLoading
    ],
    toggleTextFieldStatus : function (uValue, pValue, firstClick) {
        if( uValue === "")
          this.usernameError = "Questo campo è obbligatorio";
        else this.usernameError = "";
        if( pValue === "")
          this.passwordError = "Questo campo è obbligatorio";
        else this.passwordError = "";
        this.emit('login.toggledTextFieldStatus');
    },
    startLoading : function(){
        this.usernameDisabled = true;
        this.passwordDisabled = true;
        this.buttonDisabled = true;
        this.spinnerStatus = 'visible';
        this.emit('login.loadingStarted');
    },
    exports: {
        getTextFieldStatus: function () {
            return {
              usernameError : this.usernameError,
              passwordError : this.passwordError
            }
        },
        getDisabledValues : function(){
          return {
            usernameDisabled : this.usernameDisabled,
            passwordDisabled : this.passwordDisabled,
            buttonDisabled : this.buttonDisabled,
            spinnerStatus : this.spinnerStatus
          }
        },
        getLoginState : function(){
          return {
            usernameError : this.usernameError,
            passwordError : this.passwordError,
            usernameDisabled : this.usernameDisabled,
            passwordDisabled : this.passwordDisabled,
            buttonDisabled : this.buttonDisabled,
            spinnerStatus : this.spinnerStatus
          }
        }
    }
});

export default LoginStore;
