import React from 'react';
import $ from 'jquery';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import { browserHistory } from 'react-router';

class SelectRef extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      value : 0,
      abusi : this.props.abusi,
      abusiItems : []
    }
  }

  componentWillMount(){
    var _items = [];
    for(var i = 0; i < this.props.abusi.length; i++){
      var _value = '/handlegestioneabusi/'+this.props.abusi[i].id+'/'+this.props.abusi[i].pandema_abuso_id;
      _items.push(<MenuItem key={i} value={_value} primaryText={this.props.abusi[i].pandema_abuso_id} />)
    }
    this.setState({
      ...this.state,
      value : '/handlegestioneabusi/'+this.props.abusi[0].id+'/'+this.props.abusi[0].pandema_abuso_id,
      abusiItems : _items
    })
  }

  changePraticaStatus(e,v,m){
    browserHistory.push(m);
  }

  render(){
    return(
      <DropDownMenu ref="status" value={this.state.value} labelStyle={{fontSize:'14px'}} underlineStyle={{borderTopColor:'transparent'}} onChange={this.changePraticaStatus.bind(this)}>
        {this.state.abusiItems}
      </DropDownMenu>
    )
  }

}

export default SelectRef;
