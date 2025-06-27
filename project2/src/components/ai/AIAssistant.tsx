import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, X } from 'lucide-react';
import { AIMessage } from '../../types';
import Button from '../ui/Button';

interface AIAssistantProps {}

const AIAssistant: React.FC<AIAssistantProps> = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm Ethereal, your personal culinary concierge. I can help you discover amazing restaurants, make reservations, and find experiences tailored to your taste. What are you in the mood for today?",
      timestamp: new Date(),
      suggestions: ["Find romantic dinner", "Quick lunch nearby", "Group dining", "Surprise me"],
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I understand you're looking for something special. Based on your preferences, I found some excellent options. Would you like me to show you restaurants with immediate availability or would you prefer to plan for later?",
        timestamp: new Date(),
        suggestions: ["Show available now", "Plan for later", "More options"],
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      {/* Fixed Floating Assistant Button */}
      <motion.button
        className={`fixed bottom-24 right-6 z-50 w-16 h-16 rounded-full transition-all duration-300 ${
          isListening 
            ? 'bg-gradient-to-br from-luxury-rose to-royal-purple shadow-lg shadow-luxury-rose/30' 
            : 'bg-gradient-to-br from-champagne-gold to-royal-purple shadow-lg shadow-champagne-gold/30'
        }`}
        onClick={() => setIsVisible(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isListening ? { 
          boxShadow: [
            '0 4px 20px rgba(212, 175, 55, 0.4)',
            '0 8px 40px rgba(212, 175, 55, 0.8)',
            '0 4px 20px rgba(212, 175, 55, 0.4)'
          ]
        } : {}}
        transition={{ 
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="flex items-center justify-center">
          {isListening ? (
            <MicOff className="w-7 h-7 text-midnight-navy" />
          ) : (
            <div className="w-8 h-8 bg-midnight-navy rounded-full flex items-center justify-center">
              <span className="text-champagne-gold font-playfair font-bold text-lg">E</span>
            </div>
          )}
        </div>
      </motion.button>

      {/* Full Screen Chat Interface */}
      <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-midnight-navy/95 backdrop-blur-xl z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          {/* Chat Interface */}
          <motion.div
            className="fixed inset-0 z-50 flex flex-col max-w-md mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="p-4 sm:p-6 pt-12 sm:pt-16 border-b border-surface-elevated bg-surface-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-champagne-gold to-royal-purple rounded-full flex items-center justify-center">
                    <span className="text-midnight-navy font-playfair font-bold text-lg">E</span>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-crimson font-semibold text-text-primary">Ethereal</h3>
                    <p className="text-sm font-lato text-text-secondary">Your Culinary Concierge</p>
                  </div>
                </div>
                
                <Button variant="ghost" onClick={handleClose}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 w-full">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-champagne-gold text-midnight-navy ml-4 font-inter'
                        : 'bg-surface-elevated text-text-primary mr-4 font-inter'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {message.suggestions && message.type === 'assistant' && (
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-3">
                        {message.suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-lato bg-surface-card hover:bg-champagne-gold/20 text-text-secondary hover:text-champagne-gold rounded-lg transition-colors"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface-elevated text-text-primary p-3 sm:p-4 rounded-2xl mr-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-champagne-gold rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-champagne-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-champagne-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input */}
            <div className="p-4 sm:p-6 border-t border-surface-elevated bg-surface-card w-full">
              <div className="flex items-center gap-3">
                <motion.button
                  className={`p-2 sm:p-3 rounded-full transition-colors ${
                    isListening 
                      ? 'bg-error-red text-white' 
                      : 'bg-champagne-gold text-midnight-navy hover:bg-champagne-gold/80'
                  }`}
                  onClick={toggleVoice}
                  whileTap={{ scale: 0.9 }}
                >
                  {isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
                </motion.button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                    placeholder="Ask me anything about dining..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 font-inter bg-surface-elevated border border-surface-card rounded-xl text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-champagne-gold/20 focus:border-champagne-gold text-sm sm:text-base"
                  />
                </div>
                
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;