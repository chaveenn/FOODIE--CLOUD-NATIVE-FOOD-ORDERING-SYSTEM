import { AppBar, Toolbar, Typography, Button, Badge, Box } from '@mui/material';
import { ShoppingCart, Restaurant, List, AccountCircle } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cart } = useCart();

  return (
    <AppBar position="sticky" sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
      <Toolbar>
        <Typography
          variant="h5"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'white',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Restaurant sx={{ mr: 1 }} />
          FoodExpress
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<Restaurant />}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Menu
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/orders"
            startIcon={<List />}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Orders
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/cart"
            startIcon={
              <Badge badgeContent={cart.length} color="error">
                <ShoppingCart />
              </Badge>
            }
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Cart
          </Button>
          <Button
            color="inherit"
            startIcon={<AccountCircle />}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Account
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 
