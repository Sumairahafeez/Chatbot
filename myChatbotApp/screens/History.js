import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const History = ({ userId }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, [userId]);

    const fetchHistory = async () => {
        try {
            const response = await fetch(`http://192.168.100.61:3000/history/${userId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch history');
            }

            const filteredHistory = (data || []).map(item => ({
                chat_id: item.chat_id,
                query: item.query,
                timestamp: item.timestamp,
            }));

            setHistory(filteredHistory);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const deleteHistoryItem = async (chatId) => {
        try {
            console.log('Deleting history item with chat_id:', chatId, "user ID", userId);
            const response = await fetch(`http://192.168.100.61:3000/history/${userId}/${chatId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete history');
            }

            // Filter out the deleted item from state
            setHistory(prev => prev.filter(item => item.chat_id !== chatId));
        } catch (error) {
            console.error('Error deleting history:', error);
        }
    };

    const confirmDelete = (chatId) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this history item?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => deleteHistoryItem(chatId), style: 'destructive' },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chatbot History</Text>
            <FlatList
                data={history}
                keyExtractor={(item) => item.chat_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <View style={styles.textContainer}>
                            <Text style={styles.query}>
                                <Text style={styles.label}>Query: </Text>
                                {item.query}
                            </Text>
                            <Text style={styles.timestamp}>
                                <Text style={styles.label}>Time: </Text>
                                {item.timestamp}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => confirmDelete(item.chat_id)}>
                            <Icon name="delete" size={24} color="#27445D" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        backgroundColor: '#f9f9f9',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#27445D',
        color: '#DCD7C9',
        textAlign: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        backgroundColor: '#F3F3F3',
        borderBottomColor: '#E1E1E1',
        borderRadius: 10,
        marginBottom: 10,
    },
    textContainer: {
        flex: 1,
        paddingRight: 10,
    },
    label: {
        fontWeight: 'bold',
        color: '#27445D',
    },
    query: {
        fontSize: 16,
        color: '#444',
        marginBottom: 5,
    },
    timestamp: {
        fontSize: 14,
        color: '#666',
    },
});

export default History;
