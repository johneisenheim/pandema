import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Attach from 'material-ui/svg-icons/editor/attach-file';
import Check from 'material-ui/svg-icons/action/check-circle';
import Delete from 'material-ui/svg-icons/action/delete';

class Step4 extends React.Component{

  constructor(props, context) {
    super(props, context);
  }

  state = {
    'a' : greatObject.d2.files !== undefined ? (greatObject.d2.files['determina'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
    'b' : greatObject.d2.files !== undefined ? (greatObject.d2.files['delibera'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
    'c' : greatObject.d2.files !== undefined ? (greatObject.d2.files['visto'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
    currentTitle : '',
    currentLetter : '',
    checkColor : '#D6D6D6',
    open : false
  }

  _onFileInputChange(e){
    switch(e){
      case 'determina':
        greatObject.d2['files']['determina'] = this.refs.file1.files[0];
        this.setState({
          ...this.state,
          a : 'Caricato'
        });
      break;
      case 'delibera':
        greatObject.d2['files']['delibera'] = this.refs.file2.files[0];
        this.setState({
          ...this.state,
          b : 'Caricato'
        });
      break;
      case 'visto':
        greatObject.d2['files']['visto'] = this.refs.file3.files[0];
        this.setState({
          ...this.state,
          c : 'Caricato'
        });
      break;
    }
  }
  onDisallega(letter, who){
    switch(letter){
      case 'a':
        this.setState({
          a : 'Non caricato'
        });
        greatObject.d2['files']['determina'] = undefined;
      break;
      case 'b':
        this.setState({
          b : 'Non caricato'
        });
        greatObject.d2['files']['delibera'] = undefined;
      break;
      case 'c':
        this.setState({
          c : 'Non caricato'
        });
        greatObject.d2['files']['visto'] = undefined;
      break;
    }
  }

  _onFileSelection(){
    //this.state[this.state.currentLetter] = 'Caricato';
    this.state.checkColor = 'green';
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
              <TableRowColumn>Determina</TableRowColumn>
              <TableRowColumn><span style={this.state.a == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.a}</span></TableRowColumn>
              <TableRowColumn>
                <FlatButton label="Allega file" backgroundColor='#FFFFFF'>
                  <input type="file" style={styles.inputFile} accept="application/pdf" ref="file1" onChange={this._onFileInputChange.bind(this, 'determina')}/>
                </FlatButton>
                { this.state.a !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'a')} icon={<Delete/>}/>: null}
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Delibera di giunta o consiglio comunale</TableRowColumn>
              <TableRowColumn><span style={this.state.b == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.b}</span></TableRowColumn>
              <TableRowColumn>
                <FlatButton label="Allega file" backgroundColor='#FFFFFF'>
                  <input type="file" style={styles.inputFile} accept="application/pdf" ref="file2" onChange={this._onFileInputChange.bind(this, 'delibera')}/>
                </FlatButton>
                { this.state.b !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'b')} icon={<Delete/>}/>: null}
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Visto registrazione Corte dei Conti</TableRowColumn>
              <TableRowColumn><span style={this.state.c == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.c}</span></TableRowColumn>
              <TableRowColumn>
                <FlatButton label="Allega file" backgroundColor='#FFFFFF'>
                  <input type="file" style={styles.inputFile} accept="application/pdf" ref="file3" onChange={this._onFileInputChange.bind(this, 'visto')}/>
                </FlatButton>
                { this.state.c !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'c')} icon={<Delete/>}/>: null}
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
              <input type="file" style={styles.inputFile} onChange={this._onFileSelection.bind(this)}/>
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

export default Step4;
