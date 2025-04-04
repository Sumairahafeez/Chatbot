import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

const Recommendations = ({ userId }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            const API_URL = `http://192.168.100.61:3000/recommendations/${userId}`;
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Failed to fetch recommendations');
                }
                const data = await response.json();
                let recs = data.recommendation || [];
                if (typeof recs === 'string') {
                    recs = [recs];
                }
                console.log('Fetched recommendations:', recs); 
                setRecommendations(recs || ["No recommendations available"]); 
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                setError(error.message); // Set error message for display
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [userId]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#27445D" />
                <Text style={styles.loadingText}>Loading recommendations...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Recommendations</Text>
            <FlatList
                data={recommendations}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
                ListEmptyComponent={<Text style={styles.emptyMessage}>No recommendations available.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        marginTop: 50,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        width: '100%',
        backgroundColor: '#27445D',
        color: '#DCD7C9',
        textAlign: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    loadingText: {
        fontSize: 18,
        color: '#333',
        marginTop: 10,
    },
    errorText: {
        fontSize: 18,
        color: '#D9534F', // Red for error messages
        textAlign: 'center',
        marginTop: 10,
    },
    item: {
        fontSize: 18,
        color: '#444',
        marginVertical: 8,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        width: '100%',
    },
    emptyMessage: {
        fontSize: 18,
        color: '#666',
        fontStyle: 'italic',
    },
});

export default Recommendations;
