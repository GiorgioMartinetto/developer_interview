import React, { useState } from 'react';
import {
    Fab,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const MyChatBot: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: 'Ciao! Sono il tuo assistente virtuale. Come posso aiutarti oggi?',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSendMessage = () => {
        if (message.trim() === '') return;

        const userMessage: Message = {
            id: messages.length + 1,
            text: message,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setMessage('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            const botMessage: Message = {
                id: messages.length + 2,
                text: botResponse,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        }, 1000);
    };

    const getBotResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('ciao') || lowerMessage.includes('salve')) {
            return 'Ciao! Sono felice di aiutarti. Cosa stai cercando?';
        } else if (lowerMessage.includes('prodotti') || lowerMessage.includes('products')) {
            return 'Abbiamo una vasta gamma di prodotti di alta qualità. Puoi visitare la pagina Prodotti per vedere tutte le nostre offerte!';
        } else if (lowerMessage.includes('contatti') || lowerMessage.includes('contacts')) {
            return 'Puoi trovarci nella pagina Contatti. Saremo felici di rispondere alle tue domande!';
        } else if (lowerMessage.includes('ai') || lowerMessage.includes('intelligenza artificiale')) {
            return 'Sì, utilizziamo l\'intelligenza artificiale per offrirti un\'esperienza di shopping personalizzata. Come posso assisterti?';
        } else {
            return 'Grazie per il tuo messaggio! Sono qui per aiutarti con qualsiasi domanda sui nostri prodotti o servizi.';
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <Fab
                color="primary"
                aria-label="chat"
                onClick={handleClickOpen}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000
                }}
            >
                <ChatIcon />
            </Fab>

            {/* Chat Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        height: '600px',
                        position: 'fixed',
                        bottom: 80,
                        right: 16,
                        width: '350px',
                        maxWidth: '90vw'
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px'
                }}>
                    <Typography variant="h6">Assistente Virtuale</Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />

                <DialogContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'calc(100% - 120px)',
                    padding: 0
                }}>
                    {/* Messages Area */}
                    <Box sx={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}>
                        <List sx={{ width: '100%' }}>
                            {messages.map((msg) => (
                                <ListItem
                                    key={msg.id}
                                    sx={{
                                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                        padding: '4px 0'
                                    }}
                                >
                                    <Paper
                                        sx={{
                                            padding: '8px 12px',
                                            maxWidth: '70%',
                                            backgroundColor: msg.sender === 'user' ? 'primary.main' : 'grey.100',
                                            color: msg.sender === 'user' ? 'white' : 'text.primary'
                                        }}
                                    >
                                        <ListItemText
                                            primary={msg.text}
                                            primaryTypographyProps={{
                                                variant: 'body2'
                                            }}
                                        />
                                    </Paper>
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    {/* Input Area */}
                    <Box sx={{
                        padding: '16px',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        gap: 1
                    }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Scrivi un messaggio..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            size="small"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendMessage}
                            disabled={!message.trim()}
                            sx={{ minWidth: 'auto', padding: '8px' }}
                        >
                            <SendIcon />
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MyChatBot;
