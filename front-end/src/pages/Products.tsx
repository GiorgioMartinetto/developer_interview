import { useState, useEffect } from 'react';
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
    Button,
    CircularProgress,
    Paper,
    Divider,
    Slider,
    Pagination,
} from '@mui/material';
import MyNavbar from "../components/MyNavbar.tsx";
import MyCard from "../components/MyCard.tsx";
import AddProductCard from "../components/AddProductCard.tsx";
import api from "../axios/axios.ts";

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    tags?: string[];
    created_at: string;
    categories?: { id: number; name: string }[];
}

interface Category {
    id: number;
    name: string;
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    // Filter states
    const [searchText, setSearchText] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
    const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'date_asc' | 'date_desc'>('date_desc');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch products when filters or pagination change
    useEffect(() => {
        fetchProducts();
    }, [searchText, selectedCategories, priceRange, sortBy, currentPage, pageSize]);

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

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const filterRequest = {
                text_filter: searchText || null,
                category_filter: selectedCategories.length > 0 ? selectedCategories : null,
                min_max_price_filter: priceRange[0] !== 0 || priceRange[1] !== 2000 ? priceRange : null,
                sort_by: sortBy.includes('price')
                    ? ['price', sortBy.split('_')[1] as 'asc' | 'desc']
                    : ['date', sortBy.split('_')[1] as 'asc' | 'desc'],
                page: currentPage,
                page_size: pageSize
            };

            const response = await api.post('/v1/product/get_filtered_products/', filterRequest);
            if (response.data.status === 200 && response.data.data) {
                setProducts(response.data.data.products || []);
                setTotalCount(response.data.data.pagination?.total_count || 0);
                setTotalPages(response.data.data.pagination?.total_pages || 0);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSearchText('');
        setSelectedCategories([]);
        setPriceRange([0, 2000]);
        setSortBy('date_desc');
        setCurrentPage(1);
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
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Categories</InputLabel>
                                <Select
                                    multiple
                                    value={selectedCategories}
                                    label="Categories"
                                    onChange={(e) => setSelectedCategories(e.target.value as string[])}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {(selected as string[]).map((value) => (
                                                <Chip key={value} label={value} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.name}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Price Range */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" gutterBottom>
                                    Price Range
                                </Typography>
                                <Slider
                                    value={priceRange}
                                    onChange={(_event, newValue) => setPriceRange(newValue as number[])}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={2000}
                                    step={10}
                                    marks={[
                                        { value: 0, label: '€0' },
                                        { value: 1000, label: '€1000' },
                                        { value: 2000, label: '€2000' }
                                    ]}
                                    sx={{ mt: 2 }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        €{priceRange[0]}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        €{priceRange[1]}
                                    </Typography>
                                </Box>
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

                            {/* Page Size */}
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Products per page</InputLabel>
                                <Select
                                    value={pageSize}
                                    label="Products per page"
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setCurrentPage(1); // Reset to first page when changing page size
                                    }}
                                >
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Clear Filters */}
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={clearFilters}
                                disabled={!searchText && selectedCategories.length === 0 && priceRange[0] === 0 && priceRange[1] === 2000 && sortBy === 'date_desc'}
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
                                    {totalCount} product{totalCount !== 1 ? 's' : ''} found
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
                                    <AddProductCard onProductAdded={fetchProducts} />
                                    {products.map((product) => (
                                        <MyCard
                                            key={product.id}
                                            product={product}
                                            image="/src/assets/prodotti.jpg"
                                            onProductDeleted={fetchProducts}
                                        />
                                    ))}
                                </Box>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                        <Pagination
                                            count={totalPages}
                                            page={currentPage}
                                            onChange={(_event, page) => setCurrentPage(page)}
                                            color="primary"
                                            size="large"
                                            showFirstButton
                                            showLastButton
                                        />
                                    </Box>
                                )}

                                {products.length === 0 && !loading && (
                                    <Box sx={{ textAlign: 'center', py: 8 }}>
                                        <Typography variant="h6" color="text.secondary">
                                            No products found matching your criteria.
                                        </Typography>
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
