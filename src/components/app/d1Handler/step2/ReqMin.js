import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import Attach from 'material-ui/svg-icons/editor/attach-file';
import Dialog from 'material-ui/Dialog';
import Check from 'material-ui/svg-icons/action/check-circle';
import Delete from 'material-ui/svg-icons/action/delete';
import TextField from 'material-ui/TextField';


class ReqMin extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      a : greatObject.d1.files !== undefined ? (greatObject.d1.files['visuracamerale'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
      b : greatObject.d1.files !== undefined ? (greatObject.d1.files['carichipenali'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
      c : greatObject.d1.files !== undefined ? (greatObject.d1.files['casellariogiudiziale'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
      d : greatObject.d1.files !== undefined ? (greatObject.d1.files['durc'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
      e : greatObject.d1.files !== undefined ? (greatObject.d1.files['certificatofallimentare'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
      f : greatObject.d1.files !== undefined ? (greatObject.d1.files['certificatoantimafia'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
      currentTitle : '',
      currentLetter : '',
      checkColor : '#D6D6D6',
      errorText : '',
      open : false
    }
  }

  _onFileInputChange(e, who){
    switch(e){
      case 'visuracamerale':
        greatObject.d1['files']['visuracamerale'] = this.refs.file1.files[0];
        this.setState({
          ...this.state,
          a : 'Caricato'
        });
      break;
      case 'carichipenali':
        greatObject.d1['files']['carichipenali'] = this.refs.file2.files[0];
        this.setState({
          ...this.state,
          b : 'Caricato'
        });
      break;
      case 'casellariogiudiziale':
        greatObject.d1['files']['casellariogiudiziale'] = this.refs.file3.files[0];
        this.setState({
          ...this.state,
          c : 'Caricato'
        });
      break;
      case 'durc':
        greatObject.d1['files']['durc'] = this.refs.file4.files[0];
        this.setState({
          ...this.state,
          d : 'Caricato'
        });
      break;
      case 'certificatofallimentare':
        greatObject.d1['files']['certificatofallimentare'] = this.refs.file5.files[0];
        this.setState({
          ...this.state,
          e : 'Caricato'
        });
      break;
      case 'certificatoantimafia':
        greatObject.d1['files']['certificatoantimafia'] = this.refs.file6.files[0];
        this.setState({
          ...this.state,
          f : 'Caricato'
        });
      break;
    }
  }

  onAllega(letter, who){
    this.state.open = true;
    this.state.currentTitle = who;
    this.state.currentLetter = letter;
    this.setState(this.state);
  }

  onDisallega(letter, who){
    switch(letter){
      case 'a':
        this.setState({
          a : 'Non caricato'
        });
        greatObject.d1['files']['visuracamerale'] = undefined;
      break;
      case 'b':
        this.setState({
          b : 'Non caricato'
        });
        greatObject.d1['files']['carichipenali'] = undefined;
      break;
      case 'c':
        this.setState({
          c : 'Non caricato'
        });
        greatObject.d1['files']['casellariogiudiziale'] = undefined;
      break;
      case 'd':
        this.setState({
          d : 'Non caricato'
        });
        greatObject.d1['files']['durc'] = undefined;
      break;
      case 'e':
        this.setState({
          e : 'Non caricato'
        });
        greatObject.d1['files']['certificatofallimentare'] = undefined;
      break;
      case 'f':
        this.setState({
          f : 'Non caricato'
        });
        greatObject.d1['files']['certificatoantimafia'] = undefined;
      break;
    }
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

  //onClick={this.onAllega.bind(this,'a', 'Visura Camerale')}

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
                <FlatButton label="Allega file" backgroundColor='#FFFFFF'>
                    <input type="file" style={styles.inputFile} ref="file1" onChange={this._onFileInputChange.bind(this, 'visuracamerale')}/>
                </FlatButton>
                { this.state.a !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'a')} icon={<Delete/>}/>: null}
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Carichi Penali</TableRowColumn>
              <TableRowColumn><span style={this.state.b == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.b}</span></TableRowColumn>
              <TableRowColumn>
                <FlatButton label="Allega file" backgroundColor='#FFFFFF' >
                  <input type="file" style={styles.inputFile} ref="file2" onChange={this._onFileInputChange.bind(this, 'carichipenali')}/>
                </FlatButton>
                { this.state.b !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'b')} icon={<Delete/>}/>: null}
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Casellario Giudiziale</TableRowColumn>
              <TableRowColumn><span style={this.state.c == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.c}</span></TableRowColumn>
              <TableRowColumn>
                <FlatButton label="Allega file" backgroundColor='#FFFFFF' >
                  <input type="file" style={styles.inputFile} ref="file3" onChange={this._onFileInputChange.bind(this, 'casellariogiudiziale')}/>
                </FlatButton>
                { this.state.c !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'c')} icon={<Delete/>}/>: null}
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>DURC</TableRowColumn>
              <TableRowColumn><span style={this.state.d == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.d}</span></TableRowColumn>
              <TableRowColumn>
                <FlatButton label="Allega file" backgroundColor='#FFFFFF'>
                  <input type="file" style={styles.inputFile} ref="file4" onChange={this._onFileInputChange.bind(this, 'durc')}/>
                </FlatButton>
                { this.state.d !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'d')} icon={<Delete/>}/>: null}
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Certificato Fallimentare</TableRowColumn>
              <TableRowColumn><span style={this.state.e == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.e}</span></TableRowColumn>
              <TableRowColumn>
                <FlatButton label="Allega file" backgroundColor='#FFFFFF'>
                  <input type="file" style={styles.inputFile} ref="file5" onChange={this._onFileInputChange.bind(this, 'certificatofallimentare')}/>
                </FlatButton>
                { this.state.e !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'e')} icon={<Delete/>}/>: null}
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Certificato Antimafia</TableRowColumn>
              <TableRowColumn><span style={this.state.f == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.f}</span></TableRowColumn>
              <TableRowColumn>
                <FlatButton label="Allega file" backgroundColor='#FFFFFF'>
                  <input type="file" style={styles.inputFile} ref="file6" onChange={this._onFileInputChange.bind(this, 'certificatoantimafia')}/>
                </FlatButton>
                { this.state.f !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'f')} icon={<Delete/>}/>: null}
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
            <TextField hintText="Numero di pratica" ref="numero_pratica"/>
            <FlatButton icon={<Attach/>} label="Allega il file di riferimento" backgroundColor='#FFFFFF'>
              <input type="file" style={styles.inputFile} ref="file1" onChange={this._onFileInputChange.bind(this)}/>
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
