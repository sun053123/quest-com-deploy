import * as React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';

import { useNavigate } from 'react-router-dom';

function Header(props) {
  const { sections, title, setCategory } = props;
  let navigate = useNavigate();

  const HandleRouteChange = () => {
    navigate('/createclassroom');
    }

    const HandleOnSetCategory = (category) => {
        console.log(category);
        setCategory(category);
    }

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Button size="small">Subscribe</Button>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>
        {/* <Button onClick={() => HandleOnSetCategory('sci')} size="small">
            sci
        </Button> */}
        <Button variant="outlined" size="small" onClick={HandleRouteChange} >
          Create Classroom
        </Button>
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
      >
        {sections.map((section, index) => (
        //   <Link
        //     color="inherit"
        //     noWrap
        //     key={section.title}
        //     variant="body2"
        //     href={section.url}
        //     sx={{ p: 1, flexShrink: 0 }}
        //   >
        //     {section.title}
        //   </Link>
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
  title: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
};

export default Header;