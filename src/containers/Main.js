import React from "react";

import WebStorage from 'react-webstorage';
import Loadable from 'react-loading-overlay';
var EventEmitter2 = require('eventemitter2').EventEmitter2;
import * as constants from '../constants';
import links from './links';
import App from "../components/app/App";
import injectTapEventPlugin from 'react-tap-event-plugin';
import Login from "../components/login/Login";
import {version} from '../../version';

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
		}

		if (__CLIENT__) {
			console.log("Hello client");
			global.toggleLoader = new EventEmitter2();
			global.constants = constants;
			//global.LINKS = links;
		}
	}

	componentDidMount(){
		var webStorage = new WebStorage(
			window.localStorage ||
			window.sessionStorage
		);
		var _self = this;
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
		if(ws === 'true' && global.city !== null && webStorage.getItem('pandemawebappcityname') !== null && webStorage.getItem('pandemaversion') !== null){
			//console.log(webStorage.getItem('pandemawebappcityname'))
			var _city = webStorage.getItem('pandemawebappcityname');
			var goodCity = _city.replace(/\s/g,'').toLowerCase();
			try{
				var links = require('../../links/'+goodCity).default;
				global.LINKS = links;
				//console.log(global.LINKS)
			}catch(ex){
				var links = require('../../links/links').default;
				global.LINKS = links;
				//console.log('catch',global.LINKS)
			}
			this.logged = true;
			if(webStorage.getItem('pandemaversion') !== version){
				this.logged = false;
			}
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

		if( this.logged == null ){
 		 return <div></div>;
		}else if(this.logged)
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
