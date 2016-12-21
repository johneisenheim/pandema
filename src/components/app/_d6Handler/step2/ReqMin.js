import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import Attach from 'material-ui/svg-icons/editor/attach-file';
import Dialog from 'material-ui/Dialog';
import Check from 'material-ui/svg-icons/action/check-circle';
import TextField from 'material-ui/TextField';


class ReqMin extends React.Component{

  constructor(props, context) {
    super(props, context);
  }

  state = {
    a : 'Non caricato',
    b : 'Non caricato',
    c : 'Non caricato',
    d : 'Non caricato',
    e : 'Non caricato',
    f : 'Non caricato',
    currentTitle : '',
    currentLetter : '',
    checkColor : '#D6D6D6',
    open : false
  }

  _onFileInputChange(e, index){
    this.state.checkColor = 'green';
    this.setState(this.state);
  }

  onAllega(letter, who){
    this.state.open = true;
    this.state.currentTitle = who;
    this.state.currentLetter = letter;
    this.setState(this.state);
  }

  handleClose(){
    this.state[this.state.currentLetter] = 'Caricato';
    this.state.checkColor = '#D6D6D6';
    this.state.open = false;
    this.setState(this.state);
  }

  _handleClose(){
    this.state.checkColor = '#D6D6D6';
    this.state.open = false;
    this.setState(this.state);
  }

  render(){
    const actions = [
      <FlatButton
        label="Annulla"
        primary={false}
        onTouchTap={this._handleClose.bind(this)}
      />,
      <FlatButton
        label="Invia"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose.bind(this)}
      />,
    ];
    return(
      <div>
        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Documento</TableHeaderColumn>
              <TableHeaderColumn>Status</TableHeaderColumn>
              <TableHeaderColumn>Azioni</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} selectable={false}>
            <TableRow>
              <TableRowColumn>Visura Camerale</TableRowColumn>
              <TableRowColumn><span style={this.state.a == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.a}</span></TableRowColumn>
              <TableRowColumn>
                <FlatButton label="Allega file" backgroundColor='#FFFFFF' onClick={this.onAllega.bind(this,'a', 'Visura Camerale')}>
                </FlatButton>
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Carichi Penali</TableRowColumn>
              <TableRowColumn><span style={this.state.b == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.b}</span></TableRowColumn>
              <TableRowColumn>
                <FlatButton label="Allega file" backgroundColor='#FFFFFF' onClick={this.onAllega.bind(this,'b', 'Carichi Penali')}>
                </FlatButton>
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Casellario Giudiziale</TableRowColumn>
              <TableRowColumn><span style={this.state.c == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.c}</span></TableRowColumn>
              <TableRowColumn>
                <FlatButton label="Allega file" backgroundColor='#FFFFFF' onClick={this.onAllega.bind(this,'c', 'Casellario Giudiziale')}>
                </FlatButton>
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>DURC</TableRowColumn>
              <TableRowColumn><span style={this.state.d == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.d}</span></TableRowColumn>
              <TableRowColumn>
                <FlatButton label="Allega file" backgroundColor='#FFFFFF' onClick={this.onAllega.bind(this,'d','DURC')}>
                </FlatButton>
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Certificato Fallimentare</TableRowColumn>
              <TableRowColumn><span style={this.state.e == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.e}</span></TableRowColumn>
              <TableRowColumn>
                <FlatButton label="Allega file" backgroundColor='#FFFFFF' onClick={this.onAllega.bind(this,'e','Certificato Fallimentare')}>
                </FlatButton>
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Certificato Antimafia</TableRowColumn>
              <TableRowColumn><span style={this.state.f == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.f}</span></TableRowColumn>
              <TableRowColumn>
                <FlatButton label="Allega file" backgroundColor='#FFFFFF' onClick={this.onAllega.bind(this,'f','Certificato Antimafia')}>
                </FlatButton>
              </TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
        <Dialog
          title={this.state.currentTitle}
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose.bind(this, 1)}
          titleStyle={{color:'#59C2E6'}}
          contentStyle = {{color:'#666666'}}
        >
        <p>Completa le azioni per ultimare il caricamento del documento:</p>
        <div>
            <TextField hintText="Numero di pratica" />
            <FlatButton icon={<Attach/>} label="Allega il file di riferimento" backgroundColor='#FFFFFF'>
              <input type="file" style={styles.inputFile} onChange={this._onFileInputChange.bind(this)}/>
            </FlatButton>
            <Check style={{position:'relative',top:'6px', marginLeft:'7px'}} color={this.state.checkColor}/>
        </div>
        </Dialog>
      </div>
    );
  }

}

const styles = {
  notLoaded : {
    backgroundColor:'#FFA726',
    padding:'8px',
    color:'white',
    fontWeight:'bold'
  },
  loaded : {
    backgroundColor:'#2E7D32',
    padding:'8px',
    color:'white',
    fontWeight:'bold'
  },
  inputFile : {
    cursor: 'pointer',
    position: 'absolute',
    top: 5,
    bottom: 0,
    right: 0,
    left: 20,
    zIndex:3,
    width: '100%',
    opacity: 0,
  },
  raisedButton : {
    backgroundColor : '#FFFFFF'
  }
}
export default ReqMin;
