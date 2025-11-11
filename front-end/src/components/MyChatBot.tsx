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
    Divider,
    CircularProgress
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import api from '../axios/axios';

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
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSendMessage = async () => {
        if (message.trim() === '' || isLoading) return;

        const userMessage: Message = {
            id: messages.length + 1,
            text: message.trim(),
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const currentMessage = message;
        setMessage('');
        setIsLoading(true);
        setIsTyping(true);

        try {
            const response = await api.post('/v1/chatbot/conversation', {
                message: currentMessage
            });

            const botMessage: Message = {
                id: messages.length + 2,
                text: response.data,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: messages.length + 2,
                text: 'Mi dispiace, si è verificato un errore. Riprova più tardi.',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    };



    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleCloseConversation = async () => {
        try {
            await api.post('/v1/chatbot/reset_conversation');
            // Reset local chat state
            setMessages([
                {
                    id: 1,
                    text: 'Ciao! Sono il tuo assistente virtuale. Come posso aiutarti oggi?',
                    sender: 'bot',
                    timestamp: new Date()
                }
            ]);
            setMessage('');
            setIsLoading(false);
            setIsTyping(false);
        } catch (error) {
            console.error('Error resetting conversation:', error);
            // Still reset local state even if API call fails
            setMessages([
                {
                    id: 1,
                    text: 'Ciao! Sono il tuo assistente virtuale. Come posso aiutarti oggi?',
                    sender: 'bot',
                    timestamp: new Date()
                }
            ]);
            setMessage('');
            setIsLoading(false);
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
                            {isTyping && (
                                <ListItem
                                    sx={{
                                        justifyContent: 'flex-start',
                                        padding: '4px 0'
                                    }}
                                >
                                    <Paper
                                        sx={{
                                            padding: '8px 12px',
                                            maxWidth: '70%',
                                            backgroundColor: 'grey.100',
                                            color: 'text.primary',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                            Assistente sta scrivendo
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <Box
                                                sx={{
                                                    width: 4,
                                                    height: 4,
                                                    borderRadius: '50%',
                                                    backgroundColor: 'grey.500',
                                                    animation: 'bounce 1.4s infinite ease-in-out',
                                                    animationDelay: '0s',
                                                    '@keyframes bounce': {
                                                        '0%, 80%, 100%': { transform: 'scale(0)' },
                                                        '40%': { transform: 'scale(1)' }
                                                    }
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    width: 4,
                                                    height: 4,
                                                    borderRadius: '50%',
                                                    backgroundColor: 'grey.500',
                                                    animation: 'bounce 1.4s infinite ease-in-out',
                                                    animationDelay: '0.2s',
                                                    '@keyframes bounce': {
                                                        '0%, 80%, 100%': { transform: 'scale(0)' },
                                                        '40%': { transform: 'scale(1)' }
                                                    }
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    width: 4,
                                                    height: 4,
                                                    borderRadius: '50%',
                                                    backgroundColor: 'grey.500',
                                                    animation: 'bounce 1.4s infinite ease-in-out',
                                                    animationDelay: '0.4s',
                                                    '@keyframes bounce': {
                                                        '0%, 80%, 100%': { transform: 'scale(0)' },
                                                        '40%': { transform: 'scale(1)' }
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </Paper>
                                </ListItem>
                            )}
                        </List>
                    </Box>

                    {/* Input Area */}
                    <Box sx={{
                        padding: '16px',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}>
                        <Box sx={{
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
                                disabled={!message.trim() || isLoading}
                                sx={{ minWidth: 'auto', padding: '8px' }}
                            >
                                {isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                            </Button>
                        </Box>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCloseConversation}
                            startIcon={<ExitToAppIcon />}
                            size="small"
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            Chiudi Conversazione
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MyChatBot;
