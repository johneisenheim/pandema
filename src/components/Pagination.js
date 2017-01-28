import React, { PropTypes } from 'react';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import IconButton from 'material-ui/IconButton';
import Box from 'react-layout-components';

const styles = {
  footerContent: {
    float: 'right'
  },
  footerText: {
    paddingTop: '0px',
    height: '16px'
  }
};

class Pagination extends React.Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    offset: PropTypes.number.isRequired, // current offset
    total: PropTypes.number.isRequired, // total number of rows
    limit: PropTypes.number.isRequired, // num of rows in each page
    onPageRightClick: PropTypes.func.isRequired, // what to do after clicking page number
    onPageLeftClick : PropTypes.func.isRequired
  }

  render() {

    let { offset, total, limit } = this.props;

    return (
        <Box alignItems="center" justifyContent="center" style={styles.footerContent}>
          <IconButton disabled={offset === 0} onTouchTap={this.props.onPageLeftClick.bind(null, offset - limit)}>
            <ChevronLeft/>
          </IconButton>
          <span style={styles.footerText}>{Math.min((offset + 1), total) + '-' + Math.min((offset + limit), total) + ' di ' + total}</span>
          <IconButton disabled={offset + limit >= total} onTouchTap={this.props.onPageRightClick.bind(null, offset + limit)}>
            <ChevronRight/>
          </IconButton>
        </Box>
    );
  }

}

export default Pagination;
