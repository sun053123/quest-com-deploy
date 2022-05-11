import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Toolbar, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/Contexts/AuthContext';

function Header(props) {
  const { sections, setCategory } = props;
  const { userinfo } = useContext(AuthContext)
  let navigate = useNavigate();

  const HandleRouteChange = () => {
    navigate('/classroom/create');
    }

    const HandleOnSetCategory = (category) => {
        setCategory(category);
    }


  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Button size="small"></Button>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          Home
        </Typography>
        
        { userinfo && userinfo?.role != false && (
        <Button variant="outlined" size="meduim" onClick={HandleRouteChange} color={"secondary"} >
          Create Classroom
        </Button>
        )}
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'space-between', overflowX: 'auto' }}>
        {sections.map((section, index) => (
        <Button key={index} onClick={() => HandleOnSetCategory(`${section.value}`)} size="small">
            {section.title}
        </Button>
        ))}
      </Toolbar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  setCategory: PropTypes.func.isRequired,
};

export default Header;