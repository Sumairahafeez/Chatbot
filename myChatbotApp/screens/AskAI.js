import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const AskAI = () => {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const askAI = async () => {
        if (!question.trim()) return;
        setLoading(true);
        try {
            // Replace with your AI API endpoint and key
            const apiUrl = 'https://api.example.com/ask-ai';
            const apiKey = 'your-api-key';

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ question }),
            });

            const data = await res.json();
            setResponse(data.answer || 'No response from AI.');
        } catch (error) {
            setResponse('Error communicating with AI.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ask AI</Text>
            <TextInput
                style={styles.input}
                placeholder="Type your question here..."
                value={question}
                onChangeText={setQuestion}
            />
            <Button title={loading ? 'Loading...' : 'Ask'} onPress={askAI} disabled={loading} />
            <ScrollView style={styles.responseContainer}>
                <Text style={styles.response}>{response}</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    responseContainer: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
    },
    response: {
        fontSize: 16,
    },
});

export default AskAI;