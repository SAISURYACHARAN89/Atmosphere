import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { Building2, MapPin, ChevronDown, ExternalLink } from 'lucide-react-native';
import { ThemeContext } from '../contexts/ThemeContext';

interface OpportunityCardProps {
    item: any;
    type: string;
    onExpand: () => void;
    expanded: boolean;
}

export default function OpportunityCard({ item, type, onExpand, expanded }: OpportunityCardProps) {
    const { theme } = useContext(ThemeContext);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const tags = [item.sector, item.employmentType, item.locationType, item.companyType].filter(Boolean);

    const isRemote = item.isRemote || item.locationType === 'Remote';
    const applicantsCount = item.applicantsCount || 0;

    const handleSendApplication = async () => {
        const url = item.url || item.applicationUrl || item.link;
        if (!url) {
            Alert.alert('No Link Available', 'This opportunity does not have an application link.');
            return;
        }

        try {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Cannot Open Link', 'Unable to open the application link.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to open the application link.');
            console.error('Error opening URL:', error);
        }
    };

    return (
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            {/* Header: Icon + Startup Name + Company Type */}
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: theme.inputBackground }]}>
                    <Building2 size={20} color={theme.placeholder} />
                </View>
                <View style={styles.headerTextContainer}>
                    <View style={styles.headerTopRow}>
                        <Text style={[styles.startupName, { color: theme.text }]} numberOfLines={1}>
                            {item.poster?.displayName || item.startupName || item.organiser || item.organizer || 'Unknown'}
                        </Text>
                        <View style={[styles.badge, { backgroundColor: theme.inputBackground }]}>
                            <Text style={[styles.badgeText, { color: theme.placeholder }]}>{type.toLowerCase()}</Text>
                        </View>
                    </View>
                    <Text style={[styles.companyType, { color: theme.placeholder }]}>
                        {item.companyType || item.sector || 'Startup'}
                    </Text>
                </View>
            </View>

            {/* Role Title */}
            <Text style={[styles.roleTitle, { color: theme.text }]} numberOfLines={2}>
                {item.title || item.roleTitle || item.name || 'Untitled'}
            </Text>

            {/* Location + Remote */}
            <View style={styles.locationRow}>
                <View style={styles.locationItem}>
                    <MapPin size={12} color={theme.placeholder} />
                    <Text style={[styles.locationText, { color: theme.placeholder }]}>
                        {item.location || item.locationType || 'Remote'}
                    </Text>
                </View>
                <Text style={[styles.remoteTag, { color: isRemote ? theme.text : theme.placeholder }]}>
                    {isRemote ? 'Remote' : 'On-site'}
                </Text>
            </View>

            {/* Description with More/Less */}
            <View style={styles.descContainer}>
                <Text style={[styles.cardDesc, { color: theme.placeholder }]} numberOfLines={showFullDesc ? undefined : 2}>
                    {item.description || item.requirements || 'No description provided.'}
                </Text>
                {(item.description?.length > 80 || item.requirements?.length > 80) && (
                    <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)}>
                        <Text style={[styles.moreLess, { color: theme.text }]}>{showFullDesc ? 'Less' : 'More'}</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Tags Row */}
            {tags.length > 0 && (
                <View style={styles.tagsRow}>
                    {tags.slice(0, 4).map((tag, idx) => (
                        <View key={idx} style={[styles.tagBadge, { borderColor: theme.border }]}>
                            <Text style={[styles.tagText, { color: theme.placeholder }]}>{tag}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Footer */}
            <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
                <TouchableOpacity style={styles.applicantsBtn} onPress={onExpand}>
                    <ChevronDown size={12} color={theme.placeholder} style={expanded ? { transform: [{ rotate: '180deg' }] } : undefined} />
                    <Text style={[styles.applicantsText, { color: theme.placeholder }]}>{applicantsCount} applicants</Text>
                </TouchableOpacity>
                <Text style={[styles.employmentInfo, { color: theme.text }]}>
                    {item.employmentType || 'Full-time'} • {isRemote ? 'Remote' : 'On-site'}
                </Text>
            </View>

            {/* Expanded Section */}
            {expanded && (
                <View style={[styles.expandedBox, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
                    <Text style={[styles.expandedTitle, { color: theme.text }]}>Application</Text>
                    <Text style={[styles.expandedText, { color: theme.placeholder }]}>
                        {item.compensation || item.amount || 'Competitive compensation'}
                    </Text>
                    {item.deadline && (
                        <Text style={[styles.deadlineText, { color: theme.placeholder }]}>
                            Deadline: {new Date(item.deadline).toLocaleDateString()}
                        </Text>
                    )}
                    {item.date && (
                        <Text style={[styles.deadlineText, { color: theme.placeholder }]}>
                            Date: {new Date(item.date).toLocaleDateString()} {item.time ? `at ${item.time}` : ''}
                        </Text>
                    )}
                    <TouchableOpacity style={[styles.sendBtn, { backgroundColor: theme.inputBackground, borderColor: theme.border }]} onPress={handleSendApplication}>
                        <Text style={[styles.sendBtnText, { color: theme.text }]}>Send Application</Text>
                        <ExternalLink size={14} color={theme.text} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { borderRadius: 16, marginBottom: 16, padding: 16, borderWidth: 1 },
    cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
    iconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
    headerTextContainer: { flex: 1 },
    headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
    startupName: { fontSize: 14, fontWeight: '600', flex: 1, marginRight: 8 },
    companyType: { fontSize: 12 },
    badge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
    badgeText: { fontSize: 10, fontWeight: '500' },
    roleTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    locationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    locationItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    locationText: { fontSize: 12 },
    remoteTag: { fontSize: 12 },
    descContainer: { marginBottom: 12 },
    cardDesc: { fontSize: 12, lineHeight: 18 },
    moreLess: { fontSize: 12, marginTop: 4, fontWeight: '500' },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
    tagBadge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1 },
    tagText: { fontSize: 10 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
    applicantsBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    applicantsText: { fontSize: 12 },
    employmentInfo: { fontSize: 12, fontWeight: '500' },
    expandedBox: { marginTop: 16, borderRadius: 12, padding: 16, borderWidth: 1 },
    expandedTitle: { fontWeight: 'bold', marginBottom: 8, fontSize: 15 },
    expandedText: { fontSize: 13, marginBottom: 8 },
    deadlineText: { fontSize: 12, marginBottom: 12 },
    sendBtn: { backgroundColor: '#1a1a1a', borderRadius: 8, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
    sendBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
