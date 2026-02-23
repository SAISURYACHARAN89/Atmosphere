import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonItem from './SkeletonItem';
import { ThemeContext } from '../../contexts/ThemeContext';

const TradeSkeleton = () => {
    const { theme } = useContext(ThemeContext);
    return (
        <View style={[styles.container, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            {/* Header: Company Icon + Name + Badge */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <SkeletonItem width={40} height={40} borderRadius={8} style={{ marginRight: 12 }} />
                    <View>
                        <SkeletonItem width={120} height={16} style={{ marginBottom: 6 }} />
                        <SkeletonItem width={80} height={12} />
                    </View>
                </View>
                <SkeletonItem width={60} height={24} borderRadius={12} />
            </View>

            {/* Description Lines */}
            <SkeletonItem width="100%" height={14} style={{ marginBottom: 6 }} />
            <SkeletonItem width="90%" height={14} style={{ marginBottom: 16 }} />

            {/* Chart / Content Placeholder */}
            <SkeletonItem width="100%" height={120} borderRadius={8} style={{ marginBottom: 16 }} />

            {/* Stats Row (Saves, Views, etc) */}
            <View style={styles.footer}>
                <SkeletonItem width={60} height={14} />
                <SkeletonItem width={60} height={14} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8
    }
});

export default TradeSkeleton;
