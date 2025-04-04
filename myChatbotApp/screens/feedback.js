import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const API_URL = 'http://192.168.100.61:3000/feedbacks'; // Replace with your IP or localhost for emulator

const FeedbackScreen = ({userId}) => {
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
            console.log('Feedbacks:', data); // Log the feedbacks for debugging
            setFeedbacks(data || []); // Set feedbacks to an empty array if null or undefined
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
            await fetch(`${API_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({user_id: userId, feedback: feedbackText }),
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
                body: JSON.stringify({ feedback: feedbackText }),
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
                keyExtractor={(item) => item.feedback_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.feedbackItem}>
                        <Text style={styles.feedbackText}>{item.feedback}</Text>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity onPress={() => handleEdit(item.feedback_id, item.feedback)}>
                                <Icon name="edit" size={24} color="#3D8D7A" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item.feedback_id)}>
                                <Icon name="delete" size={24} color="#3D8D7A" />
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
        marginTop: 20,
        backgroundColor: '#f9f9f9',
        padding: 20,
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
        width: '100%',
        backgroundColor: 'white',
        borderColor: "#3D8D7A",
        borderRadius: 20,
        padding: 15,
        marginTop: 15,
        shadowColor: '#3D8D7A',
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        shadowOpacity: 0.5,
    },
    button: {
        backgroundColor: '#3D8D7A',
        padding: 15,
        borderRadius: 20,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    feedbackItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        backgroundColor: '#F3F3F3',
        borderBottomColor: '#E1E1E1',
        borderRadius: 10,
        marginVertical: 10,
    },
    
    feedbackText: {
        color: '#27445D',
        fontSize: 16,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        gap: 8,
    },
});

export default FeedbackScreen;
