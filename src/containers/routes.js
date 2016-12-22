import React from "react";
import {Router, Route, browserHistory, IndexRoute, RouterContext} from "react-router";

import Main from "./Main";
import Home from '../components/app/home/Home';
import D1Handler from '../components/app/d1Handler/D1Handler';
import D2Handler from '../components/app/d2Handler/D2Handler';
import D3Handler from '../components/app/d3Handler/D3Handler';
import D4Handler from '../components/app/d4Handler/D4Handler';
import D5Handler from '../components/app/d5Handler/D5Handler';
import D3SHandler from '../components/app/d3shandler/D3Shandler';
import Admin from '../components/admin/Admin';
import AvvisoDiniego from '../components/app/forms/AvvisoDiniego';
import AvvisoPubblicazione from '../components/app/forms/AvvisoPubblicazione';
import NuovaPratica from '../components/app/forms/NuovaPratica';
import GestioneAbusi from '../components/app/abusi/GestioneAbusi';
import HandleGestioneAbusi from '../components/app/abusi/HandleGestioneAbusi';
import NuovaPraticaAbusi from '../components/app/forms/NuovaPraticaAbusi';
import GestisciAllegati from '../components/app/complementars/GestisciAllegati';
/**
 * The React Router routes for both the server and the client.
 */

//<Route path="/" component={Login}/> <IndexRoute component={Home}/>
module.exports = (
	<Router history={browserHistory}>
		<Route path="/admin" component={Admin} />
		<Route path="/" component={Main}>
			<IndexRoute component={Home}/>
			<Route path='d1handler/:pid/:dbid' component={D1Handler} />
			<Route path='d2handler/:pid/:dbid' component={D2Handler} />
			<Route path='d3handler/:pid/:dbid' component={D3Handler} />
			<Route path='d4handler/:pid/:dbid' component={D4Handler} />
			<Route path='d5handler/:pid/:dbid' component={D5Handler} />
			<Route path='d3shandler/:pid/:dbid' component={D3SHandler} />
			<Route path='/avvisodiniego' component={AvvisoDiniego} />
			<Route path='/gestisciallegati/:pid/:dbid' component={GestisciAllegati} />
			<Route path='/avvisopubblicazione' component={AvvisoPubblicazione} />
			<Route path='/nuovapratica' component={NuovaPratica} />
			<Route path='/nuovapraticaabusi' component={NuovaPraticaAbusi} />
			<Route path='/gestioneabusi' component={GestioneAbusi} />
			<Route path='/handlegestioneabusi/:id' component={HandleGestioneAbusi} />
		</Route>
	</Router>
);
