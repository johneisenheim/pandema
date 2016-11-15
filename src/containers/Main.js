import React from "react";
import InlineCss from "react-inline-css";
import Transmit from "react-transmit";

import favicon from "favicon.ico";

//import MyPaper from "../components/Paper";

import injectTapEventPlugin from 'react-tap-event-plugin';
import Login from "../components/login/Login";
import App from "../components/app/App";
import WebStorage from 'react-webstorage';

injectTapEventPlugin();

/**
 * Main React application entry-point for both the server and client.
 */
export default class Main extends React.Component {

	constructor(props, context){
		super(props,context);
		this.state = {
			logged : null
		}
		this.logged = null;
	}
	/**
	 * componentWillMount() runs on server and client.
	 */
	componentWillMount () {
		if (__SERVER__) {
			console.log("Hello server");
			global.myServerVariable = 'Gatto';
		}

		if (__CLIENT__) {
			console.log("Hello client");
			global.myGlobalVariable = 'Cane';
			//webStorage.setItem('chiave', 'valore');
			global.tryy = 'Hello guys!';
			global.greatObject = {
				entity : {},
				d1 : {},
				d2 : {},
				d3 : {},
				d4 : {},
				d5 : {},
				d6 : {}
			};
			//global._webStorage = webStorage;
			console.log('from Main.js '+global.greatObject);
		}
	}

	componentDidMount(){
		var webStorage = new WebStorage(
			window.localStorage ||
			window.sessionStorage
		);
		//webStorage.setItem('_pandema', 'false');
		var ws = webStorage.getItem('_pandema');
		webStorage.setItem('city', 'Nola'); //johneisenheim
		global.city = webStorage.getItem('city');
		if(ws === 'true'){
			this.logged = true;
		}else{
			this.logged = false;
		}
		if(this.logged){
			this.setState({
				logged : true
			})
		}else{
			this.setState({
				logged : false
			})
		}
	}

	logMeIn(){
		this.logged = true;
		this.setState({
			logged : true
		})
	}

	/**
	 * Runs on server and client.

	 */
	render () {
		if( this.logged == null )
 		 return <div></div>;
 	 	else if(this.logged)
 			return <div><App {...this.props}/></div>;
 	 	else return (<div><Login {...this.props} handler={this.logMeIn.bind(this)} /></div>);
	}
}
