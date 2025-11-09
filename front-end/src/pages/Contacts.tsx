import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MyNavbar from "../components/MyNavbar.tsx";
import MapCard from "../components/MapCard.tsx";

export default function Contacts() {
    return (
        <>
            <MyNavbar />
            <Box sx={{
                paddingTop: 12,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: '100%',
                minHeight: '100vh'
            }}>
                <Grid
                    container
                    spacing={3}
                    sx={{
                        p: 2,
                        maxWidth: { xs: '95%', sm: '90%', md: '1200px' },
                        margin: '0 auto',
                        width: '100%'
                    }}
                >
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Contacts</Typography>
                            <hr/>
                            <Box sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <PhoneIcon sx={{ mr: 1 }} />
                                    <Typography variant="body1">
                                        <strong>Phone:</strong> +39 123456789
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <EmailIcon sx={{ mr: 1 }} />
                                    <Typography variant="body1">
                                        <strong>Email:</strong> info@sgrproducts.com
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <LocationOnIcon sx={{ mr: 1 }} />
                                    <Typography variant="body1">
                                        <strong>Address:</strong> Via 1, 69100 Lugano, Switzerland
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
                                    <ScheduleIcon sx={{ mr: 1 }} />
                                    <Typography variant="body1">
                                        <strong>Working hours:</strong> 9:00 - 18:00
                                    </Typography>
                                </Box>
                            </Box>

                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Maps</Typography>
                            <hr/>
                            <Box sx={{paddingTop:5}}>
                                <MapCard />
                            </Box>

                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
