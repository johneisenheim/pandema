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
import D6Handler from '../components/app/d6handler/D6Handler';
import Admin from '../components/admin/Admin';
import AvvisoDiniego from '../components/app/forms/AvvisoDiniego';
import AvvisoPubblicazione from '../components/app/forms/AvvisoPubblicazione';
import NuovaPraticaD1 from '../components/app/forms/NuovaPraticaD1';
import NuovaPraticaD5 from '../components/app/forms/NuovaPraticaD5';
import NuovaPraticaArchivio from '../components/app/forms/NuovaPraticaArchivio';
import GestioneAbusi from '../components/app/abusi/GestioneAbusi';
import HandleGestioneAbusi from '../components/app/abusi/HandleGestioneAbusi';
import HandleArt47 from '../components/app/abusi/HandleArt47';
import NuovaPraticaAbusi from '../components/app/forms/NuovaPraticaAbusi';
import GestisciAllegati from '../components/app/complementars/GestisciAllegati';
import GestisciAllegatiAbusi from '../components/app/complementars/GestisciAllegatiAbusi';
import Registri from '../components/app/registri/Registri';
import NuovoGenerico from '../components/app/registri/generico/NuovoGenerico';
import VisualizzaGenerico from '../components/app/registri/generico/VisualizzaGenerico';
import Archivio from '../components/app/archivio/Archivio';
import CanoniPregressi from '../components/app/archivio/CanoniPregressi';
import Decadenza from '../components/app/archivio/Decadenza';

import NuovoArt24 from '../components/app/registri/art24/NuovoArt24';
import VisualizzaArt24 from '../components/app/registri/art24/VisualizzaArt24';
import NuovoArt55 from '../components/app/registri/art55/NuovoArt55';
import VisualizzaArt55 from '../components/app/registri/art55/VisualizzaArt55';
import NuovoArt45 from '../components/app/registri/art45/NuovoArt45';
import VisualizzaArt45 from '../components/app/registri/art45/VisualizzaArt45';
import Annuali from '../components/app/archivio/Annuali';



module.exports = (
	<Router history={browserHistory}>
		<Route path="/" component={Main}>
			<IndexRoute component={Home}/>
			<Route path="/admin" component={Admin} />
			<Route path='d1handler/:pid/:dbid' component={D1Handler} />
			<Route path='d2handler/:pid/:dbid' component={D2Handler} />
			<Route path='d3handler/:pid/:dbid' component={D3Handler} />
			<Route path='d4handler/:pid/:dbid' component={D4Handler} />
			<Route path='d5handler/:pid/:dbid' component={D5Handler} />
			<Route path='d3shandler/:pid/:dbid' component={D3SHandler} />
			<Route path='d6handler/:pid/:dbid' component={D6Handler} />
			<Route path='/avvisodiniego' component={AvvisoDiniego} />
			<Route path='/gestisciallegati/:pid/:dbid' component={GestisciAllegati} />
			<Route path='/avvisopubblicazione' component={AvvisoPubblicazione} />
			<Route path='/nuovapraticad1' component={NuovaPraticaD1} />
			<Route path='/nuovapraticad5' component={NuovaPraticaD5} />
			<Route path='/nuovapraticaabusi' component={NuovaPraticaAbusi} />
			<Route path='/gestioneabusi' component={GestioneAbusi} />
			<Route path='/handlegestioneabusi/:dbid/:pid' component={HandleGestioneAbusi} />
			<Route path='/handleart47/:dbid/:pid' component={HandleArt47} />
			<Route path='/gestisciallegatiabusi/:pid/:dbid' component={GestisciAllegatiAbusi} />
			<Route path='/registri' component={Registri} />
			<Route path='/rgenerico/:id' component={VisualizzaGenerico} />
			<Route path='/rart24/:id' component={VisualizzaArt24} />
			<Route path='/rart55/:id' component={VisualizzaArt55} />
			<Route path='/rart45/:id' component={VisualizzaArt45} />
			<Route path='/addToGeneralRegistry' component={NuovoGenerico} />
			<Route path='/addToArt24Registry' component={NuovoArt24} />
			<Route path='/addToArt55Registry' component={NuovoArt55} />
			<Route path='/addToArt45Registry' component={NuovoArt45} />
			<Route path='/archivio' component={Archivio} />
			<Route path='/nuovapraticaarchivio' component={NuovaPraticaArchivio} />
			<Route path='/canone' component={CanoniPregressi} />
			<Route path='/decadenza/:pid/:dbid' component={Decadenza} />
			<Route path='/annuali/:pid/:dbid' component={Annuali} />
		</Route>
	</Router>
);
