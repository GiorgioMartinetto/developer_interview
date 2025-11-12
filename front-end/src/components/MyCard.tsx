import { useState, useEffect } from 'react';
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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
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

  // Update dialog state
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    name: '',
    price: '',
    description: '',
    categories: [] as string[],
    tags: ''
  });
  const [availableCategories, setAvailableCategories] = useState<{ id: number; name: string }[]>([]);
  const [updateError, setUpdateError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

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

  // Update dialog handlers
  const handleUpdateClick = () => {
    // Initialize form with current product data
    setUpdateForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      categories: product.categories?.map(cat => cat.name) || [],
      tags: product.tags?.join(', ') || ''
    });
    setUpdateDialogOpen(true);
    setUpdateError('');
  };

  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
    setUpdateForm({
      name: '',
      price: '',
      description: '',
      categories: [],
      tags: ''
    });
    setUpdateError('');
  };

  const handleUpdateFormChange = (field: string, value: any) => {
    setUpdateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateConfirm = async () => {
    setIsUpdating(true);
    try {
      const updateData = {
        id: product.id,
        name: updateForm.name.trim() || null,
        price: updateForm.price && !isNaN(parseFloat(updateForm.price)) ? parseFloat(updateForm.price) : null,
        description: updateForm.description.trim() || null,
        categories_name: updateForm.categories.length > 0 ? updateForm.categories : null,
        tags: updateForm.tags.trim() ? updateForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : null
      };

      const response = await api.put('/v1/product/update_product/', updateData);

      if (response.data.status === 200) {
        setUpdateDialogOpen(false);
        setOpen(false);
        onProductDeleted?.(); // Refresh the product list
      } else {
        setUpdateError('Errore durante l\'aggiornamento del prodotto.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setUpdateError('Errore durante l\'aggiornamento del prodotto.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Fetch available categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/v1/category/get_categories_list/');
        if (response.data.status === 200 && response.data.data) {
          setAvailableCategories(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

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
            onClick={handleUpdateClick}
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
          >
            Update
          </Button>
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

      {/* Update Product Dialog */}
      <Dialog
        open={updateDialogOpen}
        onClose={handleUpdateDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Aggiorna Prodotto
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Nome"
              variant="outlined"
              value={updateForm.name}
              onChange={(e) => handleUpdateFormChange('name', e.target.value)}
            />

            <TextField
              fullWidth
              label="Prezzo"
              variant="outlined"
              type="number"
              value={updateForm.price}
              onChange={(e) => handleUpdateFormChange('price', e.target.value)}
              inputProps={{ step: '0.01', min: '0' }}
            />

            <TextField
              fullWidth
              label="Descrizione"
              variant="outlined"
              multiline
              rows={3}
              value={updateForm.description}
              onChange={(e) => handleUpdateFormChange('description', e.target.value)}
            />

            <FormControl fullWidth>
              <InputLabel>Categorie</InputLabel>
              <Select
                multiple
                value={updateForm.categories}
                onChange={(e) => handleUpdateFormChange('categories', e.target.value)}
                renderValue={(selected) => (selected as string[]).join(', ')}
              >
                {availableCategories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    <Checkbox checked={updateForm.categories.indexOf(category.name) > -1} />
                    <ListItemText primary={category.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Tags (separati da virgola)"
              variant="outlined"
              value={updateForm.tags}
              onChange={(e) => handleUpdateFormChange('tags', e.target.value)}
              helperText="Esempio: tag1, tag2, tag3"
            />
          </Box>

          {updateError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {updateError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateDialogClose} variant="outlined" disabled={isUpdating}>
            Annulla
          </Button>
          <Button
            onClick={handleUpdateConfirm}
            variant="contained"
            color="primary"
            disabled={isUpdating}
          >
            {isUpdating ? 'Aggiornando...' : 'Aggiorna'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
