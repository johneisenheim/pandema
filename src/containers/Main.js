import React from "react";
import InlineCss from "react-inline-css";
import Transmit from "react-transmit";

import favicon from "favicon.ico";

//import MyPaper from "../components/Paper";

import injectTapEventPlugin from 'react-tap-event-plugin';
import Login from "../components/login/Login";
import App from "../components/app/App";
import WebStorage from 'react-webstorage';
import Loadable from 'react-loading-overlay';
var EventEmitter2 = require('eventemitter2').EventEmitter2;
import * as constants from '../constants';
import links from './links';

injectTapEventPlugin();

/**
 * Main React application entry-point for both the server and client.
 */
export default class Main extends React.Component {

	constructor(props, context){
		super(props,context);
		this.state = {
			logged : null,
			loading : false
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
			global.toggleLoader = new EventEmitter2();
			global.myGlobalVariable = 'Cane';
			//webStorage.setItem('chiave', 'valore');
			global.tryy = 'Hello guys!';
			global.constants = constants;
			global.LINKS = links;
			//global._webStorage = webStorage;
		}
	}

	componentDidMount(){
		var webStorage = new WebStorage(
			window.localStorage ||
			window.sessionStorage
		);
		var _self = this;
		//webStorage.setItem('_pandema', 'false');
		var ws = webStorage.getItem('pandemawebapp');
		toggleLoader.on('toggleLoader', function(){
			if(_self.state.loading){
				_self.setState({
					..._self.state,
					loading : false
				})
			}else{
				_self.setState({
					..._self.state,
					loading : true
				})
			}
		})
		global.city = webStorage.getItem('pandemawebappcity');
		console.log('In main, global.city è ', global.city)
		if(ws === 'true' && global.city !== null){
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
 			return (
				<div>
					<Loadable
						active={this.state.loading}
						spinner
						text=''
						background='rgba(0,0,0,0.6)'
						color='#4CA7D0'
						zIndex={3000}
						>
						<App {...this.props}/>
					</Loadable>
				</div>
		);
 	 	else return (<div><Login {...this.props} handler={this.logMeIn.bind(this)} /></div>);
	}
}
