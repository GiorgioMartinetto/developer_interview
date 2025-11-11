import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import api from '../axios/axios';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  tags?: string[];
  created_at: string;
  categories?: { id: number; name: string }[];
}

export default function MyCard({ product, image, onProductDeleted }: {
  product: Product,
  image: string,
  onProductDeleted?: () => void
}) {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    setConfirmationText('');
    setDeleteError('');
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setConfirmationText('');
    setDeleteError('');
  };

  const handleDeleteConfirm = async () => {
    if (confirmationText !== product.name) {
      setDeleteError('Il nome del prodotto non corrisponde. Riprova.');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await api.delete('/v1/product/delete_product/', {
        data: { id: product.id }
      });

      if (response.data.status === 200) {
        setDeleteDialogOpen(false);
        setOpen(false);
        onProductDeleted?.();
      } else {
        setDeleteError('Errore durante l\'eliminazione del prodotto.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setDeleteError('Errore durante l\'eliminazione del prodotto.');
    } finally {
      setIsDeleting(false);
    }
  };

  const categoryNames = product.categories?.map((cat) => cat.name).join(', ') || '';

  return (
    <>
      <Card
        sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
        onClick={handleClickOpen}
      >
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ position: 'relative', minHeight: 120, flexGrow: 1 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {product.name}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            {categoryNames}
          </Typography>
          <Typography variant="body1" sx={{ position: 'absolute', bottom: 8, right: 16, fontWeight: 'bold' }}>
            €{product.price}
          </Typography>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          {product.name}
        </DialogTitle>
        <DialogContent>
          <CardMedia
            component="img"
            height="300"
            image={image}
            alt={product.name}
            sx={{ objectFit: 'cover', mb: 2, borderRadius: 1 }}
          />

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Description
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Price
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              €{product.price}
            </Typography>
          </Box>

          {categoryNames && (
            <>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Categories
              </Typography>
              <Typography variant="body1" paragraph>
                {categoryNames}
              </Typography>
            </>
          )}

          {product.tags && product.tags.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {product.tags.map((tag, index) => (
                  <Chip key={index} label={tag} variant="outlined" size="small" />
                ))}
              </Box>
            </>
          )}

          <Typography variant="body2" color="text.secondary">
            Created: {new Date(product.created_at).toLocaleDateString()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteClick}
            variant="contained"
            color="error"
            sx={{ mr: 'auto' }}
          >
            Delete
          </Button>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: 'error.main' }}>
          Conferma Eliminazione
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Sei sicuro di voler eliminare il prodotto <strong>"{product.name}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Questa azione non può essere annullata.
          </Typography>
          <Typography variant="body2" gutterBottom>
            Per confermare, digita il nome del prodotto: <strong>{product.name}</strong>
          </Typography>
          <TextField
            fullWidth
            label="Nome del prodotto"
            variant="outlined"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            error={!!deleteError}
            helperText={deleteError}
            sx={{ mt: 2 }}
          />
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} variant="outlined" disabled={isDeleting}>
            Annulla
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={isDeleting || confirmationText !== product.name}
          >
            {isDeleting ? 'Eliminando...' : 'Elimina'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
