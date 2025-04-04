import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const AskAI = () => {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const askAI = async () => {
        if (!question.trim()) return;
        setLoading(true);
        try {
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
                placeholderTextColor="#aaa"
                value={question}
                onChangeText={setQuestion}
            />
            <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={askAI}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Ask'}</Text>
            </TouchableOpacity>

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
        marginTop: 50,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#3D8D7A',
        color: '#DCD7C9',
        textAlign: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 10,
        backgroundColor: '#fff',
        color: '#B3D8A8',
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#3D8D7A',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#DCD7C9',
        fontWeight: 'bold',
        fontSize: 16,
    },
    responseContainer: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderColor: '#444',
        borderWidth: 1,
        maxHeight: 300,
    },
    response: {
        color: '#ddd',
        fontSize: 16,
        lineHeight: 22,
    },
});

export default AskAI;
