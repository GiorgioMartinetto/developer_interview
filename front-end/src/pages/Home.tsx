import MyNavbar from '../components/MyNavbar.tsx';
import { Box, Typography, Divider, Paper } from '@mui/material';
import prodotti from '../assets/prodotti.jpg';
import ai_img from '../assets/intelligenza_artificiale_italia.png'

export default function Home() {

    return (
        <>
            <MyNavbar />
            <Box sx={{ padding: 2, paddingTop: 12, maxWidth: '80%', margin: '0 auto' }}>
                {/* First row: Image left, Text right */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    marginBottom: 10,
                    gap: 2
                }}>
                    <Box
                        component="img"
                        src={prodotti}
                        alt="Logo SGR Products"
                        sx={{
                            width: { xs: '100%', md: '40%' },
                            aspectRatio: '1',
                            objectFit: 'cover',
                            borderRadius: 2,
                            padding: 1
                        }}
                    />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: { xs: '100%', md: '60%' },
                        minHeight: '300px'
                    }}>
                        <Paper sx={{ padding: 3 }}>
                            <Typography variant="h3" component="h1" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                                SGR PRODUCTS
                            </Typography>
                            <Typography variant="h6" component="p">
                                We offer high-quality products designed to meet your everyday requirements with smart and practical solutions.
                                Our commitment to excellence ensures reliability and long-lasting performance in everything we create.
                                By combining innovation with affordability, we make advanced solutions accessible to everyone.
                                Whether for home, work, or leisure, our products are crafted to enhance your daily life with comfort and efficiency.
                            </Typography>
                        </Paper>
                    </Box>
                </Box>

                <Divider sx={{ marginY: 4 }} />

                {/* Second row: Text left, Image right */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: { xs: '100%', md: '60%' },
                        minHeight: '300px'
                    }}>
                        <Paper sx={{ padding: 3 }}>
                            <Typography variant="h3" component="h1" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                                POWERED BY AI
                            </Typography>
                            <Typography variant="body1" component="p">
                                Discover a new, AI-powered shopping experience designed just for you!
                                Our intelligent virtual assistant is here to guide you every step of the way, helping you explore our wide range of products effortlessly.
                                Simply tell it what you’re looking for, and it will instantly recommend the most suitable options based on your needs and preferences.
                                No more endless scrolling or guessing — let smart technology do the work for you.
                                Find your perfect product faster, easier, and smarter than ever before.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box
                        component="img"
                        src={ai_img}
                        alt="Powered by AI"
                        sx={{
                            width: { xs: '100%', md: '40%' },
                            aspectRatio: '1',
                            objectFit: 'cover',
                            borderRadius: 2,
                            padding: 1
                        }}
                    />
                </Box>
            </Box>
        </>
    );
}
