import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const History = ({user_id}) => {
    // Sample data for historic questions
    const [history, setHistory] = useState([
        'What is AI?',
        'How does a chatbot work?',
        'What is React Native?',
        'Tell me about Expo.',
    ]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chatbot History</Text>
            <FlatList
                data={history}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    itemContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 16,
    },
});

export default History;