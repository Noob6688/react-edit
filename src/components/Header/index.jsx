import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom'
import { NavBar, Icon } from 'zarm';

const Header = ({ title = '' }) => {
  const history = useHistory()
  return <div className='headerWarp'>
    <div className='block'>
      <NavBar
        className='header'
        left={<Icon type="arrow-left" theme="primary" onClick={() => history.goBack()} />}
        title={title}
      />
    </div>
  </div>
};

Header.propTypes = {
  title: PropTypes.string, // 标题
};

export default Header;