import React from 'react';
import Box from 'react-layout-components';
import styles from './RightContent.css.js';

import NavBar from './navbar/NavBar';

class RightContent extends React.Component{
  render(){
    return (
      <Box column id="bar" style={{backgroundColor:"#EEF0F4", width:"100%"}}>
        <NavBar/>
        <Box style={{flex:1, width : '100%', overflow:'scroll'}}>
          <Box style={{flex:1, marginLeft : '15px', marginRight:'15px', width : '100%'}} alignItems="flex-start" justifyContent="flex-start">
            {this.props.children}
          </Box>
        </Box>
      </Box>
    )
  }
}

export default RightContent;
