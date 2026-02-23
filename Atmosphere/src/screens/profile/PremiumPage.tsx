import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ArrowLeft, Info } from 'lucide-react-native';
import { ThemeContext } from '../../contexts/ThemeContext';

type PremiumPageProps = {
    onClose: () => void;
};

export default function PremiumPage({ onClose }: PremiumPageProps) {
    const { theme } = useContext(ThemeContext);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.backButton}>
                    <ArrowLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Premium</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Title */}
                <Text style={[styles.title, { color: theme.text }]}>Atmosphere +</Text>

                {/* Info Card */}
                <View style={[styles.infoCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                    <View style={styles.infoIcon}>
                        <Info size={24} color={theme.primary} />
                    </View>
                    <View style={styles.infoTextContainer}>
                        <Text style={[styles.infoText, { color: theme.text }]}>
                            Atmosphere + gives you an added advantage where you get all extra advantages.bla bla
                        </Text>
                        <Text style={[styles.infoSubtext, { color: theme.placeholder, marginTop: 16 }]}>
                            atmosphere + will be available after the early access period is finished
                        </Text>
                    </View>
                </View>

                {/* Coming Soon Badge */}
                <View style={styles.badgeContainer}>
                    <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                        <Text style={styles.badgeText}>Coming Soon</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    backButton: {
        padding: 8,
        width: 40,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
    },
    content: {
        padding: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 40,
    },
    infoCard: {
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        marginBottom: 24,
    },
    infoIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    infoTextContainer: {
        marginTop: 8,
    },
    infoText: {
        fontSize: 16,
        lineHeight: 24,
    },
    infoSubtext: {
        fontSize: 14,
        lineHeight: 20,
    },
    badgeContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    badge: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    badgeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
