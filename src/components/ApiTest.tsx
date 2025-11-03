import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { API_CONFIG } from '@/constants/config';
import axios from 'axios';

export const ApiTest = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    setStatus('loading');
    setMessage('Testing connection...');

    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/admin/auth/health`, {
        timeout: 5000,
      });
      
      setStatus('success');
      setMessage(`✅ Connected!\n${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      setStatus('error');
      setMessage(`❌ Connection failed:\n${error.message}\n\nAPI URL: ${API_CONFIG.BASE_URL}`);
      console.error('API Test Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>
      <Text style={styles.url}>Testing: {API_CONFIG.BASE_URL}</Text>
      
      <Button title="Test Connection" onPress={testConnection} />
      
      {status !== 'idle' && (
        <View style={[
          styles.resultBox,
          status === 'success' ? styles.success : styles.error
        ]}>
          <Text style={styles.resultText}>{message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  url: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  resultBox: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
  },
  success: {
    backgroundColor: '#d4edda',
  },
  error: {
    backgroundColor: '#f8d7da',
  },
  resultText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
});