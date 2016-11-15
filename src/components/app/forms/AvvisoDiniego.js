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

class AvvisoDiniego extends React.Component{
  constructor(props, context){
    super(props, context);
  }
  render(){
    return(
      <MuiThemeProvider muiTheme={lightBaseTheme} >
        <Box column justifyContent="center" alignItems="center" style={{height:'100%'}}>
          <Paper zDepth={1} style={styles.paper}>
            <Box column justifyContent="center" alignItems="flex-start" style={{marginTop:'20px', marginLeft:'20px'}}>
              <Box justifyContent="flex-start" alignItems="center">
                <p>Prot. DE</p>
                <TextField
                    id="prot1"
                    hintText = "..."
                    style={{width:'50px', color:'red', marginLeft:'10px'}}
                  />
                  <TextField
                      id="prot2"
                      hintText = "..."
                      style={{marginLeft:'10px', width:'90px'}}
                    />
              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p>Ufficio demanio/</p>
                  <TextField
                      id="dem1"
                      hintText = "..."
                      style={{width:'90px', color:'red', marginLeft:'10px'}}
                    />
                    <TextField
                        id="dem2"
                        hintText = "..."
                        style={{marginLeft:'10px', width:'120px'}}
                      />
              </Box><br></br>
              <Box column justifyContent="flex-start" alignItems="center">
                <p>Oggetto: Richiesta di concessione/anticipata occupazione/rinnovo/subingresso/affidamento art. 45bis c.n. su area demaniale marittima per </p>
                  <TextField
                      id="oggetto"
                      hintText = "Oggetto"
                      style={{width:'100%'}}
                    />
              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p>Società:</p>
                  <TextField
                      id="societa"
                      hintText = "Società"
                      style={{marginLeft:'10px', width:'400px'}}
                    />
              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p>Rif. istanza al protocollo n.</p>
                  <TextField
                      id="rif"
                      hintText = "Numero"
                      style={{marginLeft:'10px', width:'200px', marginRight:'15px'}}
                    />
                  <p> del </p>
                    <TextField
                        id="del"
                        hintText = "Data"
                        style={{marginLeft:'15px', width:'200px'}}
                      />
              </Box>
              <br></br><br></br>
              <Box column justifyContent="center" alignItems="center" alignSelf="center">
                <p>PREAVVISO DI PROVVEDIMENTO</p>
                <p>(art 10 bis Legge 07-08-1990, n. 241 succ. mod. ed integr)</p>
              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p>Oggetto provvedimento: Si comunica che con le motivazioni di cui alla determina</p>
                  <TextField
                      id="det"
                      hintText = "Determina"
                      style={{width:'400px', marginLeft:'15px'}}
                    />

              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p>che si richiama quale parte integrante del presente provvedimento – pubblicata e rinvenibile anche sul sito web</p>
                  <TextField
                      id="web"
                      hintText = "Sito Web"
                      style={{width:'200px', marginLeft:'15px'}}
                    />
              </Box>
              <Box column justifyContent="center" alignItems="center" alignSelf="center">
                <p>il comune ritiene non proseguibile l’istruttoria sulla domanda in oggetto, per le seguenti motivazioni :</p>
                  <TextField
                      id="mot"
                      hintText = "Motivazioni diniego"
                      style={{width:'100%'}}
                      multiLine={true}
                      rows={5}
                    />
              </Box>
              <Box column justifyContent="flex-start" alignItems="flex-start">
                <p>Partecipazione al procedimento: La partecipazione al procedimento è, comunque, assicurata ai sensi e per gli effetti degli artt. 7 e 8 della l. 241/90 s.s.m.m.i.i., con possibilità di accesso agli atti citati e presenti negli archivi di Ufficio. Competente è l’Area demanio/ via</p>
                  <TextField
                      id="via"
                      hintText = "Via"
                      style={{width:'400px'}}
                    />
              </Box>
              <Box justifyContent="flex-start" alignItems="center">
                <p>nella persona del</p>
                  <TextField
                      id="persona"
                      hintText = "Persona"
                      style={{width:'200px', marginLeft:'15px'}}
                    />
              </Box>
              <p>e, ai sensi dell’art. 10 bis l. 241/90 s.s.m.m.i.i., si potrà prendere visione degli atti ed esercitare il proprio diritto di partecipazione nei giorni di ricevimento al pubblico. Osservazioni di parte in merito al provvedimento – Art. 10 bis legge 241/90 . tempi - Gli interessati al provvedimento finale, hanno il diritto di prendere visione degli atti e di presentare memorie scritte e documenti che il comune valuterà, se pertinenti, preliminarmente ovvero in uno al successivo provvedimento finale. Il termine per la presentazione è fissato in giorni 10 (dieci) dalla data di notifica del presente atto. Natura provvedimento finale -Il provvedimento che sarà emesso, anche in seguito ad approfondimenti ed alle memorie e ai documenti che eventualmente saranno presentati sarà adottato ai sensi del codice della navigazione e relativo regolamento attuativo; R.D. 30-03-1942 n. 327 e collegati.
Termine e Autorità cui é possibile ricorrere - Si informa che l’eventuale impugnativa può essere proposta a decorrere dalla notifica del provvedimento con ricorso entro 60 giorni al Tribunale amministrativo regionale (TAR) e/o entro 120 giorni al Presidente della Repubblica.</p>
            </Box>
          </Paper>
          <Box justifyContent="flex-start" alignItems="center">
            <RaisedButton label="Annulla" primary={false} labelStyle={{color:'#FFFFFF'}}  />
            <RaisedButton label="Stampa modulo PDF" primary={true} labelStyle={{color:'#FFFFFF'}} style={{marginLeft:'20px'}}/>
          </Box>
        </Box>
      </MuiThemeProvider>
    );
  }
}

const styles = {
  paper : {
    margin : '10px',
    marginTop : '20px',
    width : 'inherit',
    minWidth : '100%',
    minHeight : '450px',
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

export default AvvisoDiniego;
