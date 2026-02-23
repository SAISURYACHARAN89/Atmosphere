import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { emptyStyles as styles } from '../Meetings.styles';
import { ThemeContext } from '../../../contexts/ThemeContext';

/**
 * NoMeetings component - displays empty state when no meetings are available
 */
const NoMeetings = () => {
    const { theme } = useContext(ThemeContext);
    return (
        <View style={[styles.noMeetingsContainer, { backgroundColor: theme.background }]}>
            <MaterialIcons name="videocam-off" size={48} color={theme.placeholder} />
            <Text style={[styles.noMeetingsText, { color: theme.textSecondary }]}>No meetings found</Text>
        </View>
    );
};

export default NoMeetings;
