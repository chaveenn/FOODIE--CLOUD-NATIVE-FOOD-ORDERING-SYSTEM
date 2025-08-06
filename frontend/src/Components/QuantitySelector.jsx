import { Box, IconButton, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const QuantitySelector = ({ quantity, onIncrease, onDecrease, min = 1, max = 10 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        width: 'fit-content',
      }}
    >
      <IconButton
        onClick={onDecrease}
        disabled={quantity <= min}
        sx={{
          borderRight: '1px solid',
          borderColor: 'divider',
          borderRadius: '4px 0 0 4px',
        }}
      >
        <Remove />
      </IconButton>
      <Typography
        sx={{
          px: 2,
          minWidth: '40px',
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        {quantity}
      </Typography>
      <IconButton
        onClick={onIncrease}
        disabled={quantity >= max}
        sx={{
          borderLeft: '1px solid',
          borderColor: 'divider',
          borderRadius: '0 4px 4px 0',
        }}
      >
        <Add />
      </IconButton>
    </Box>
  );
};

export default QuantitySelector; 
