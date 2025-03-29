import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';

const OPENROUTER_API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const DurgaAiScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! I\'m Durga AI, your personal safety assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const flatListRef = useRef(null);

  // Sample safety suggestions
  const suggestions = [
    'What should I do if I feel unsafe walking home?',
    'How do I create a safety plan?',
    'Tips for staying safe while traveling alone',
    'How to respond to harassment in public?',
    'Emergency services in my area'
  ];

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // OpenRouter API call
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://guardiandurga.com', // Replace with your app domain
          'X-Title': 'Guardian Durga Safety Assistant'
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-small-3.1-24b-instruct:free',
          messages: [
            { role: 'system', content: 'You are Durga AI, a personal safety assistant developed for the Guardian Durga app. Your primary goal is to provide helpful, accurate information related to personal safety, emergency response, self-defense, mental health during crisis, and related topics. Be concise, empathetic, and focus on practical advice that could help in real situations. Never encourage violence or illegal activities. If someone appears to be in immediate danger, strongly encourage them to contact emergency services immediately.' },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            { role: 'user', content: text }
          ],
          temperature: 0.7,
          max_tokens: 500
        }),
      });

      const data = await response.json();
      
      // Process the response
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const botMessage = {
          id: (Date.now() + 1).toString(),
          text: data.choices[0].message.content,
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } else {
        // Handle error or unexpected response
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          text: 'I apologize, but I encountered an issue while processing your request. Please try again later.',
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      
      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I encountered an error. Please check your connection and try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionPress = (suggestion) => {
    sendMessage(suggestion);
  };

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.botMessageContainer]}>
        {!isUser && (
          <View style={styles.botAvatar}>
            <Ionicons name="shield" size={24} color={Theme.colors.primary} />
          </View>
        )}
        
        <View style={[styles.messageBubble, isUser ? styles.userMessageBubble : styles.botMessageBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.botMessageText]}>
            {item.text}
          </Text>
        </View>
        
        {isUser && (
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={24} color={Theme.colors.surface} />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.chatContainer}>
          {/* Chat Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />
          
          {/* Suggestions */}
          {messages.length <= 2 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Suggested Questions</Text>
              <View style={styles.suggestionsList}>
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionPress(suggestion)}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          {/* Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Theme.colors.surface} size="small" />
              ) : (
                <Ionicons name="send" size={24} color={Theme.colors.surface} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    padding: Theme.spacing.md,
  },
  messagesList: {
    paddingBottom: Theme.spacing.md,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.md,
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    maxWidth: '80%',
  },
  userMessageBubble: {
    backgroundColor: Theme.colors.primary,
    borderTopRightRadius: Theme.borderRadius.xs,
    marginRight: Theme.spacing.xs,
  },
  botMessageBubble: {
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: Theme.borderRadius.xs,
    marginLeft: Theme.spacing.xs,
    ...Theme.shadows.sm,
  },
  messageText: {
    fontSize: Theme.fontSizes.md,
    lineHeight: 20,
  },
  userMessageText: {
    color: Theme.colors.surface,
  },
  botMessageText: {
    color: Theme.colors.text,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    marginTop: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  input: {
    flex: 1,
    padding: Theme.spacing.sm,
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Theme.spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: Theme.colors.textLight,
  },
  suggestionsContainer: {
    marginVertical: Theme.spacing.md,
    backgroundColor: `${Theme.colors.primary}10`,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  suggestionsTitle: {
    fontSize: Theme.fontSizes.md,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  suggestionsList: {
    flexDirection: 'column',
  },
  suggestionItem: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
    ...Theme.shadows.sm,
  },
  suggestionText: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.text,
  },
});

export default DurgaAiScreen;