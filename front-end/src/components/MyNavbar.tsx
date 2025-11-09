import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';


const pages = [
    {name:'HOME', path: '/'},
    {name: 'PRODUCTS', path: '/products'},
    {name: 'CONTACTS', path: '/contacts'}
];


function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const location = useLocation();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="sticky" sx={{
      background: 'white',
      boxShadow: 'none',
      borderBottom: '1px solid black',
      margin: 0,
      padding: 0
    }}>
      <Container maxWidth="xl" disableGutters sx={{ margin: 0, padding: 0 }}>
        <Toolbar disableGutters sx={{ paddingX: 2 }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              textDecoration: 'none',
              gap: 1
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="SGR Products Logo"
              sx={{
                height: '60px',
                width: 'auto',
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{color : 'black'}}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem
                    key={page.name}
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to={page.path}
                    sx={{
                      color: 'black',
                      fontWeight: isActivePage(page.path) ? 'bold' : 'normal',
                    }}
                >
                  <Typography sx={{ textAlign: 'center', color: 'black' }}>
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            SGR Products
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 4 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={handleCloseNavMenu}
                component={Link}
                to={page.path}
                sx={
                  {
                      my: 2,
                      color: 'black',
                      display: 'block',
                      fontSize: '0.9rem',
                      fontWeight: isActivePage(page.path) ? 'bold' : 'normal',
                      px: 2,
                      textTransform: 'none',
                      '&:hover': {
                          backgroundColor: 'transparent',
                      }
                  }
                }
              >
                {page.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
