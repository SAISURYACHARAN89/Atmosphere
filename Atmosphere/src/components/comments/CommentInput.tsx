import React, { forwardRef, useContext } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { Send } from 'lucide-react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ReplyingTo } from './types';
import { commentStyles as styles } from './styles';
import { ThemeContext } from '../../contexts/ThemeContext';

interface CommentInputProps {
    text: string;
    setText: (text: string) => void;
    submitting: boolean;
    replyingTo: ReplyingTo | null;
    onSubmit: () => void;
    onCancelReply: () => void;
}

/**
 * CommentInput - Shared input component for adding comments/replies
 */
const CommentInput = forwardRef<TextInput, CommentInputProps>(({
    text,
    setText,
    submitting,
    replyingTo,
    onSubmit,
    onCancelReply,
}, ref) => {
    const { theme } = useContext(ThemeContext);
    return (
        <>
            {/* Reply indicator */}
            {replyingTo && (
                <View style={[styles.replyIndicator, { backgroundColor: theme.inputBackground, borderBottomColor: theme.border }]}>
                    <Text style={[styles.replyIndicatorText, { color: theme.placeholder }]}>
                        Replying to <Text style={[styles.replyIndicatorUsername, { color: theme.text }]}>@{replyingTo.username}</Text>
                    </Text>
                    <TouchableOpacity onPress={onCancelReply}>
                        <Icon name="x" size={16} color={theme.placeholder} />
                    </TouchableOpacity>
                </View>
            )}

            {/* Input area */}
            <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
                <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
                    <TextInput
                        ref={ref}
                        value={text}
                        onChangeText={setText}
                        placeholder={replyingTo ? `Reply to @${replyingTo.username}...` : "Add a comment..."}
                        placeholderTextColor={theme.placeholder}
                        style={[styles.input, { color: theme.text }]}
                        editable={!submitting}
                        multiline
                    />
                    <TouchableOpacity
                        onPress={onSubmit}
                        disabled={submitting || !text.trim()}
                        style={styles.sendBtn}
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color={theme.placeholder} />
                        ) : (
                            <Send size={20} color={text.trim() ? theme.primary : theme.placeholder} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
});

CommentInput.displayName = 'CommentInput';

export default CommentInput;
