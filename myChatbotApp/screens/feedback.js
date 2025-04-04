import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const API_URL = 'http://192.168.100.61:3000/feedbacks'; // Replace with your IP or localhost for emulator

const FeedbackScreen = ({ userId }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbackText, setFeedbackText] = useState('');
    const [editingId, setEditingId] = useState(null);

    const fetchFeedbacks = async () => {
        try {
            const response = await fetch(`${API_URL}/${userId}`);
            const data = await response.json();
            console.log('Fetched feedbacks:', data); // Log fetched feedbacks for debugging
            if (!response.ok) {
                throw new Error('Failed to fetch feedbacks');
            }
            setFeedbacks(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleAdd = async () => {
        if (!feedbackText.trim()) return Alert.alert("Error", "Feedback cannot be empty");
        try {
            await fetch(`${API_URL}/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, text: feedbackText }),
            });
            setFeedbackText('');
            fetchFeedbacks();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async () => {
        if (!feedbackText.trim()) return Alert.alert("Error", "Feedback cannot be empty");
        try {
            await fetch(`${API_URL}/${editingId}/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: feedbackText }),
            });
            setFeedbackText('');
            setEditingId(null);
            fetchFeedbacks();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${API_URL}/${id}/${userId}`, { method: 'DELETE' });
            fetchFeedbacks();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (id, text) => {
        setFeedbackText(text);
        setEditingId(id);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Feedback</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your feedback"
                placeholderTextColor="#ccc"
                value={feedbackText}
                onChangeText={setFeedbackText}
            />
            <TouchableOpacity style={styles.button} onPress={editingId ? handleUpdate : handleAdd}>
                <Text style={styles.buttonText}>{editingId ? 'Update' : 'Submit'}</Text>
            </TouchableOpacity>

            <FlatList
                data={feedbacks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.feedbackItem}>
                        <Text style={styles.feedbackText}>{item.text}</Text>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity onPress={() => handleEdit(item.id, item.text)}>
                                <Icon name="edit" size={24} color="#FFD700" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                <Icon name="delete" size={24} color="#FF4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#27391C',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#1F7D53',
        color: 'white',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#1F7D53',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    feedbackItem: {
        backgroundColor: '#3A4C2F',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    feedbackText: {
        color: 'white',
        fontSize: 16,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        gap: 15,
    },
});

export default FeedbackScreen;
