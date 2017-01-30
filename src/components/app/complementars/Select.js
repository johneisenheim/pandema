import React from 'react';
import $ from 'jquery';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';


class Select extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      value : this.props.value
    }
  }

  changePraticaStatus(e,v,m,k,j){
    //console.log('change',e,v,m,k,j);
    //e = pid v = dbid j = valore nuovo
    var _self = this;
    toggleLoader.emit('toggleLoader');
    $.ajax({
        type: 'GET',
        //data: formData,
        url: constants.DB_ADDR+'updateStatoPratica?pid='+_self.props.pid+'&dbid='+_self.props.dbid+'&value='+parseInt(j),
        processData: false,
        contentType: false,
        success: function(data) {
          var parsed = JSON.parse(data);
          _self.setState({
            ..._self.state,
            value : j
          });
          _self.props.reload();
          toggleLoader.emit('toggleLoader');
        },
        error : function(err){
          alert("Errore : "+ JSON.stringify(err));
          toggleLoader.emit('toggleLoader');
        }
    });
  }

  render(){
    return(
      <DropDownMenu ref="status" value={this.state.value} labelStyle={{fontSize:'14px'}} underlineStyle={{borderTopColor:'transparent'}} onChange={this.changePraticaStatus.bind(this,this.props.pid, this.props.dbid)}>
        <MenuItem value={1} primaryText="In Attesa" />
        <MenuItem value={2} primaryText="Archiviata" />
        <MenuItem value={3} primaryText="Accettata" />
        <MenuItem value={4} primaryText="Rifiutata" />
      </DropDownMenu>
    )
  }

}

export default Select;
