
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Typography,
    Pagination,
    Card,
    CardContent,
    CardMedia,
    Button,
    CircularProgress,
    Paper,
    Divider,
} from '@mui/material';
import MyNavbar from "../components/MyNavbar.tsx";

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    tags?: string[];
    created_at: string;
    categories?: string[];
}

interface Category {
    id: number;
    name: string;
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalProducts, setTotalProducts] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(12); // Products per page

    // Filter states
    const [searchText, setSearchText] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'date_asc' | 'date_desc'>('date_desc');

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch products when filters or page changes
    useEffect(() => {
        fetchProducts();
    }, [page, searchText, selectedCategories, sortBy]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8000/v1/category/get_categories_list/');
            const data = await response.json();
            if (data.status === 200 && data.data) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const filterRequest = {
                text_filter: searchText || null,
                category_filter: selectedCategories.length > 0 ? selectedCategories : null,
                min_max_price_filter: null,
                sort_by: sortBy.includes('price')
                    ? ['price', sortBy.split('_')[1] as 'asc' | 'desc']
                    : ['date', sortBy.split('_')[1] as 'asc' | 'desc']
            };

            const response = await fetch('http://localhost:8000/v1/product/get_filtered_products/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filterRequest),
            });

            const data = await response.json();
            if (data.status === 200 && data.data) {
                setProducts(data.data.slice((page - 1) * pageSize, page * pageSize));
                setTotalProducts(data.data.length);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryToggle = (categoryName: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName]
        );
        setPage(1); // Reset to first page when filters change
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const clearFilters = () => {
        setSearchText('');
        setSelectedCategories([]);
        setSortBy('date_desc');
        setPage(1);
    };

    return (
        <>
            <MyNavbar />
            <Container maxWidth="xl" sx={{ paddingTop: '120px', paddingBottom: '40px' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                    Products
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    {/* Filters Section */}
                    <Box sx={{ flex: { xs: '1', md: '0 0 300px' } }}>
                        <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: '140px' }}>
                            <Typography variant="h6" gutterBottom>
                                Filters
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            {/* Search Text */}
                            <TextField
                                fullWidth
                                label="Search products"
                                variant="outlined"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                sx={{ mb: 3 }}
                            />

                            {/* Categories */}
                            <Typography variant="subtitle1" gutterBottom>
                                Categories
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                {categories.map((category) => (
                                    <Chip
                                        key={category.id}
                                        label={category.name}
                                        onClick={() => handleCategoryToggle(category.name)}
                                        color={selectedCategories.includes(category.name) ? 'primary' : 'default'}
                                        variant={selectedCategories.includes(category.name) ? 'filled' : 'outlined'}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </Box>

                            {/* Sort By */}
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Sort By</InputLabel>
                                <Select
                                    value={sortBy}
                                    label="Sort By"
                                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                >
                                    <MenuItem value="date_desc">Newest First</MenuItem>
                                    <MenuItem value="date_asc">Oldest First</MenuItem>
                                    <MenuItem value="price_asc">Price: Low to High</MenuItem>
                                    <MenuItem value="price_desc">Price: High to Low</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Clear Filters */}
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={clearFilters}
                                disabled={!searchText && selectedCategories.length === 0 && sortBy === 'date_desc'}
                            >
                                Clear Filters
                            </Button>
                        </Paper>
                    </Box>

                    {/* Products Section */}
                    <Box sx={{ flex: 1 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Showing {products.length} of {totalProducts} products
                                </Typography>

                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        sm: 'repeat(2, 1fr)',
                                        lg: 'repeat(3, 1fr)'
                                    },
                                    gap: 3
                                }}>
                                    {products.map((product) => (
                                        <Card key={product.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image="/src/assets/prodotti.jpg"
                                                alt={product.name}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography gutterBottom variant="h6" component="h2">
                                                    {product.name}
                                                </Typography>
                                                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                                                    €{product.price}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {product.description.length > 100
                                                        ? `${product.description.substring(0, 100)}...`
                                                        : product.description
                                                    }
                                                </Typography>
                                                {product.tags && product.tags.length > 0 && (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                                        {product.tags.slice(0, 3).map((tag, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={tag}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        ))}
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>

                                {/* Pagination */}
                                {totalProducts > pageSize && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                        <Pagination
                                            count={Math.ceil(totalProducts / pageSize)}
                                            page={page}
                                            onChange={handlePageChange}
                                            color="primary"
                                            size="large"
                                        />
                                    </Box>
                                )}

                                {products.length === 0 && !loading && (
                                    <Box sx={{ textAlign: 'center', py: 8 }}>
                                        <Typography variant="h6" color="text.secondary">
                                            No products found matching your criteria.
                                        </Typography>
                                        <Button variant="outlined" onClick={clearFilters} sx={{ mt: 2 }}>
                                            Clear Filters
                                        </Button>
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
                </Box>
            </Container>
        </>
    );
}
