import { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import api from '../axios/axios';

interface Category {
    id: number;
    name: string;
}

interface AddProductCardProps {
    onProductAdded: () => void;
}

export default function AddProductCard({ onProductAdded }: AddProductCardProps) {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        description: '',
        tags: [] as string[],
    });
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [creatingCategory, setCreatingCategory] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
        fetchCategories();
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setSelectedCategoryIds([]);
        setNewCategoryName('');
        setProductData({
            name: '',
            price: '',
            description: '',
            tags: [],
        });
        setTagInput('');
    };

    const selectedCategories = categories.filter(cat => selectedCategoryIds.includes(cat.id.toString()));

    const fetchCategories = async () => {
        try {
            const response = await api.get('/v1/category/get_categories_list/');
            if (response.data.status === 200 && response.data.data) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;

        setCreatingCategory(true);
        try {
            const response = await api.post('/v1/category/create_category/', {
                name: newCategoryName.trim(),
            });

            if (response.data.status === 201) {
                await fetchCategories();
                setNewCategoryName('');
            }
        } catch (error) {
            console.error('Error creating category:', error);
        } finally {
            setCreatingCategory(false);
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim()) {
            // Split tags by comma and process each one
            const newTags = tagInput
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0)
                .filter(tag => !productData.tags.includes(tag));

            if (newTags.length > 0) {
                setProductData(prev => ({
                    ...prev,
                    tags: [...prev.tags, ...newTags],
                }));
                setTagInput('');
            }
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setProductData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove),
        }));
    };

    const handleCreateProduct = async () => {
        if (!productData.name.trim() || !productData.price || !productData.description.trim() || selectedCategories.length === 0) {
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/v1/product/create_product/', {
                name: productData.name.trim(),
                price: parseFloat(productData.price),
                categories_name: selectedCategories.map(cat => cat.name),
                tags: productData.tags.length > 0 ? productData.tags : null,
                description: productData.description.trim(),
            });

            if (response.data.status === 201) {
                onProductAdded();
                handleClose();
            }
        } catch (error) {
            console.error('Error creating product:', error);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = selectedCategories.length > 0 && productData.name.trim() && productData.price && productData.description.trim();

    return (
        <>
            <Card
                sx={{
                    maxWidth: 345,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                    border: '2px dashed #ccc',
                    '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: '#f9f9f9',
                    }
                }}
                onClick={handleClickOpen}
            >
                <CardContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 200,
                    textAlign: 'center'
                }}>
                    <AddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        Add Product
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
                    Create New Product
                </DialogTitle>
                <DialogContent>
                    {/* Category Selection Section */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Step 1: Select Categories *
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Select existing categories or create new ones. Product fields will be unlocked after selecting at least one category.
                        </Typography>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Select Categories</InputLabel>
                            <Select
                                multiple
                                value={selectedCategoryIds}
                                label="Select Categories"
                                onChange={(e) => setSelectedCategoryIds(e.target.value as string[])}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {(selected as string[]).map((categoryId) => {
                                            const category = categories.find(cat => cat.id.toString() === categoryId);
                                            return category ? (
                                                <Chip key={category.id} label={category.name} size="small" />
                                            ) : null;
                                        })}
                                    </Box>
                                )}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <TextField
                                fullWidth
                                label="New Category Name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleCreateCategory();
                                    }
                                }}
                            />
                            <Button
                                variant="outlined"
                                onClick={handleCreateCategory}
                                disabled={!newCategoryName.trim() || creatingCategory}
                                sx={{ minWidth: 120 }}
                            >
                                {creatingCategory ? <CircularProgress size={20} /> : 'Create'}
                            </Button>
                        </Box>

                        {selectedCategories.length > 0 && (
                            <Typography variant="body2" color="success.main">
                                ✓ {selectedCategories.length} category(ies) selected
                            </Typography>
                        )}
                    </Box>

                    {/* Product Details Section */}
                    <Box sx={{ opacity: selectedCategories.length === 0 ? 0.5 : 1, pointerEvents: selectedCategories.length === 0 ? 'none' : 'auto' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Step 2: Product Details
                        </Typography>

                        <TextField
                            fullWidth
                            label="Product Name *"
                            value={productData.name}
                            onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                            sx={{ mb: 2 }}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Price (€) *"
                            type="number"
                            value={productData.price}
                            onChange={(e) => setProductData(prev => ({ ...prev, price: e.target.value }))}
                            sx={{ mb: 2 }}
                            required
                            inputProps={{ min: 0, step: 0.01 }}
                        />

                        <TextField
                            fullWidth
                            label="Description *"
                            multiline
                            rows={4}
                            value={productData.description}
                            onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
                            sx={{ mb: 2 }}
                            required
                        />

                        {/* Tags Section */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body1" gutterBottom>
                                Tags (Optional)
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <TextField
                                    fullWidth
                                    label="Add Tags (separate with commas)"
                                    placeholder="e.g. pc, gaming, performance"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddTag();
                                        }
                                    }}
                                />
                                <Button variant="outlined" onClick={handleAddTag}>
                                    Add
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {productData.tags.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={tag}
                                        onDelete={() => handleRemoveTag(tag)}
                                        size="small"
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateProduct}
                        variant="contained"
                        disabled={!isFormValid || loading}
                    >
                        {loading ? <CircularProgress size={20} /> : 'Create Product'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
