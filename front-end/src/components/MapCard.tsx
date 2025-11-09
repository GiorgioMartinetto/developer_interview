
import { Card, CardContent, Typography } from "@mui/material";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "12px",
};

// Coordinate di Lugano 🇨🇭
const center = {
    lat: 46.0037,
    lng: 8.9511,
};
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function MapCard() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: apiKey,
    });

    if (!isLoaded) return <div>Caricamento mappa...</div>;

    return (
        <Card sx={{ maxWidth: 600, margin: "auto", boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Sede di Lugano
                </Typography>
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
                    <Marker position={center} />
                </GoogleMap>
            </CardContent>
        </Card>
    );
}
