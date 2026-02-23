import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LongPressGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler';
import { ThemeContext } from '../../contexts/ThemeContext';
import { NavigationContext } from '@react-navigation/native';
import { followUser, unfollowUser, likePost, unlikePost, likeStartup, unlikeStartup, savePost, unsavePost } from '../../lib/api';
import { getImageSource } from '../../lib/image';
import CommentsOverlay from '../CommentsOverlay';
import { useAlert } from '../CustomAlert';
import ShareModal from '../ShareModal';
import { Heart, MessageCircle, Bookmark, Play, VolumeX, Volume2 } from 'lucide-react-native';
import ShareIcon from '../icons/ShareIcon';

import { StartupPostProps, AlertConfig } from './types';
import { styles } from './styles';
import { getContentId, isStartupCard } from './utils';

const StartupPost = ({ post, company, currentUserId, onOpenProfile, isVisible = false }: StartupPostProps) => {
    const { showAlert } = useAlert();
    const companyData = post || company;
    const { theme } = useContext(ThemeContext);

    const [liked, setLiked] = useState(Boolean((companyData as any)?.likedByCurrentUser));
    const stats = companyData?.stats || { likes: 0, comments: 0, shares: 0 };
    const [likes, setLikes] = useState<number>(stats.likes || 0);
    const [commentsCount, setCommentsCount] = useState<number>(stats.comments || 0);

    const [commentsOverlayVisible, setCommentsOverlayVisible] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [followed, setFollowed] = useState(Boolean((companyData as any)?.isFollowing));
    const [followLoading, setFollowLoading] = useState(false);
    const [saved, setSaved] = useState(Boolean((companyData as any)?.isSaved));
    const [savedId, setSavedId] = useState<string | null>((companyData as any)?.savedId || null);
    const [saveLoading, setSaveLoading] = useState(false);

    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [manuallyPaused, setManuallyPaused] = useState(false);

    // Video controls state
    const [isMuted, setIsMuted] = useState(true); // Start muted like Instagram
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(false);
    const videoRef = useRef<any>(null);
    const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    // Description expansion state
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const tapRef = useRef(null);
    const doubleTapRef = useRef(null);
    const longPressRef = useRef(null);

    // Auto-hide controls after 2 seconds
    const showControlsTemporarily = () => {
        setShowControls(true);
        if (controlsTimer.current) clearTimeout(controlsTimer.current);
        controlsTimer.current = setTimeout(() => {
            setShowControls(false);
        }, 2000);
    };

    // Handle long press to pause/play
    const handleLongPress = (event: any) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            setManuallyPaused(!manuallyPaused);
            showControlsTemporarily();
        }
    };

    // Handle single tap to toggle mute
    const handleSingleTap = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            setIsMuted(!isMuted);
            showControlsTemporarily();
        }
    };

    // Handle double tap to like
    const handleDoubleTapVideo = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            // Like if not already liked
            if (!liked) {
                toggleLike();
            }
            // Show heart animation
            heartScale.setValue(0);
            heartOpacity.setValue(0);

            Animated.sequence([
                Animated.parallel([
                    Animated.spring(heartScale, {
                        toValue: 2,
                        useNativeDriver: true,
                        tension: 100,
                        friction: 6,
                    }),
                    Animated.timing(heartOpacity, { toValue: 1, duration: 50, useNativeDriver: true }),
                ]),
                Animated.delay(0),
                Animated.parallel([
                    Animated.timing(heartScale, { toValue: 0.9, duration: 50, useNativeDriver: true }),
                    Animated.timing(heartOpacity, { toValue: 0, duration: 50, useNativeDriver: true }),
                ]),
            ]).start();
        }
    };

    // Video plays only when visible AND not manually paused
    const videoPaused = !isVisible || manuallyPaused;

    // Debug log
    if ((companyData as any).video) {
        // console.log('[StartupPost Video]', companyData.name, '| isVisible:', isVisible, '| manuallyPaused:', manuallyPaused, '| videoPaused:', videoPaused);
    }

    const navigation = useContext(NavigationContext) as any | undefined;

    useEffect(() => {
        const s = (companyData as any)?.stats || {};
        if (typeof s.likes === 'number') setLikes(s.likes);
        else if (typeof s.likesCount === 'number') setLikes(s.likesCount);
        if (typeof s.comments === 'number') setCommentsCount(s.comments);
        else if (typeof s.commentsCount === 'number') setCommentsCount(s.commentsCount);
        if (typeof (companyData as any)?.likedByCurrentUser === 'boolean') setLiked((companyData as any).likedByCurrentUser);
        if (typeof (companyData as any)?.isFollowing === 'boolean') setFollowed((companyData as any).isFollowing);
        if (typeof (companyData as any)?.isSaved === 'boolean') setSaved((companyData as any).isSaved);
    }, [companyData]);

    if (!companyData) return null;

    const contentId = getContentId(companyData);
    const revenueType = (companyData as any)?.financialProfile?.revenueType || (companyData as any)?.revenueType || '';
    const latestFundingRound = (() => {
        const rounds = (companyData as any)?.fundingRounds;
        if (!Array.isArray(rounds) || rounds.length === 0) return '';
        for (let i = rounds.length - 1; i >= 0; i -= 1) {
            const round = rounds[i]?.round;
            if (round) return String(round);
        }
        return '';
    })();

    // Double-tap to like
    const lastTap = useRef<number>(0);
    const heartScale = useRef(new Animated.Value(0)).current;
    const heartOpacity = useRef(new Animated.Value(0)).current;

    const handleDoubleTap = () => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;
        if (now - lastTap.current < DOUBLE_TAP_DELAY) {
            // Double tap detected - like if not already liked
            if (!liked) {
                toggleLike();
            }
            // Reset values first
            heartScale.setValue(0);
            heartOpacity.setValue(0);

            // Instagram-style heart animation
            Animated.sequence([
                // Quick pop in
                Animated.parallel([
                    Animated.spring(heartScale, {
                        toValue: 2,
                        useNativeDriver: true,
                        tension: 100,
                        friction: 6,
                    }),
                    Animated.timing(heartOpacity, { toValue: 1, duration: 50, useNativeDriver: true }),
                ]),
                // Brief hold
                Animated.delay(0),
                // Quick fade out
                Animated.parallel([
                    Animated.timing(heartScale, { toValue: 0.9, duration: 50, useNativeDriver: true }),
                    Animated.timing(heartOpacity, { toValue: 0, duration: 50, useNativeDriver: true }),
                ]),
            ]).start();
        }
        lastTap.current = now;
    };

    const toggleLike = async () => {
        if (likeLoading) return;
        setLikeLoading(true);
        const prev = liked;
        setLiked(!prev);
        setLikes(l => prev ? Math.max(0, l - 1) : l + 1);
        try {
            if (isStartupCard(companyData)) {
                prev ? await unlikeStartup(contentId) : await likeStartup(contentId);
            } else {
                prev ? await unlikePost(contentId) : await likePost(contentId);
            }
        } catch {
            setLiked(prev);
            setLikes(l => prev ? l + 1 : Math.max(0, l - 1));
        } finally {
            setLikeLoading(false);
        }
    };

    const toggleSave = async () => {
        if (saveLoading) return;
        setSaveLoading(true);
        const prevSaved = saved;
        const prevSavedId = savedId;
        setSaved(!prevSaved);
        try {
            if (!prevSaved) {
                const result = await savePost(contentId);
                if (result?._id) setSavedId(result._id);
            } else if (prevSavedId) {
                await unsavePost(prevSavedId);
                setSavedId(null);
            }
        } catch {
            setSaved(prevSaved);
            setSavedId(prevSavedId);
        } finally {
            setSaveLoading(false);
        }
    };

    const toggleFollow = async () => {
        if (followLoading) return;
        const newState = !followed;
        setFollowed(newState);
        setFollowLoading(true);
        try {
            const targetId = (companyData as any).userId || (companyData as any).user || (companyData as any).originalId || companyData.id;
            if (!targetId) throw new Error('Missing target user id');
            newState ? await followUser(String(targetId)) : await unfollowUser(String(targetId));
        } catch (err: any) {
            if (err?.message?.toLowerCase().includes('already following')) setFollowed(true);
            else { setFollowed(!newState); showAlert('Error', err?.message || 'Could not update follow status'); }
        } finally {
            setFollowLoading(false);
        }
    };

    const handleOpenProfile = () => {
        const targetId = (companyData as any).userId || (companyData as any).user || null;
        const startupDetailsId = (companyData as any).startupDetailsId || (companyData as any).originalId || (companyData as any).id || null;
        const resolvedUserId = targetId ? String(targetId) : null;
        const resolvedStartupId = startupDetailsId ? String(startupDetailsId) : null;

        if (onOpenProfile && targetId) {
            onOpenProfile(resolvedUserId || resolvedStartupId || '');
            return;
        }
        if (navigation) {
            const params: any = { backToHome: true };
            if (resolvedUserId) params.userId = resolvedUserId;
            else if (resolvedStartupId) params.startupDetailsId = resolvedStartupId;
            navigation.push?.('Profile', params) || navigation.navigate?.('Profile', params);
        }
    };

    return (
        <>
            <View style={[styles.card, styles.cardBackground, { backgroundColor: theme.cardBackground }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.headerLeftRow} activeOpacity={0.8} onPress={handleOpenProfile}>
                        <Image source={getImageSource(companyData.profileImage)} style={[styles.avatar, { backgroundColor: theme.inputBackground, borderColor: theme.border }]} />
                        <View style={[styles.headerLeft, companyData.verified ? styles.headerLeftVerified : styles.headerLeftCentered]}>
                            <View style={styles.rowCenter}>
                                <Text style={[styles.companyName, styles.whiteText, { color: theme.text }]}>{companyData.name}</Text>
                            </View>
                            {companyData.verified && <Text style={[styles.verifiedSubtext, { color: theme.placeholder }]}>Verified startup</Text>}
                            {(companyData as any).location && <Text style={[styles.locationText, { color: theme.subText }]}>{(companyData as any).location}</Text>}
                            {(companyData as any).bio && <Text style={[styles.bioText, { color: theme.subText }]}>{(companyData as any).bio}</Text>}
                        </View>
                    </TouchableOpacity>
                    {contentId !== String(currentUserId) && companyData.userId !== currentUserId && (
                        <TouchableOpacity onPress={toggleFollow} style={[styles.followBtn, followed && styles.followBtnActive, { backgroundColor: theme.inputBackground }]} disabled={followLoading}>
                            <Text style={[styles.followBtnText, followed && styles.followBtnTextActive, { color: theme.text }]}>{followed ? 'Following' : 'Follow'}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <CommentsOverlay
                    startupId={contentId}
                    visible={commentsOverlayVisible}
                    onClose={() => setCommentsOverlayVisible(false)}
                    onCommentAdded={(newCount?: number) => setCommentsCount(c => typeof newCount === 'number' ? newCount : c + 1)}
                    onCommentDeleted={(newCount?: number) => setCommentsCount(c => typeof newCount === 'number' ? newCount : Math.max(0, c - 1))}
                />

                <View style={styles.imageWrap}>
                    {(companyData as any).video ? (
                        <>
                            <Video
                                ref={videoRef}
                                source={{ uri: (companyData as any).video }}
                                style={[styles.mainImage, { backgroundColor: theme.inputBackground }]}
                                resizeMode="cover"
                                repeat
                                paused={videoPaused}
                                muted={isMuted}
                                controls={false}
                                onLoad={(data: any) => setDuration(data.duration)}
                                onProgress={(data: any) => setCurrentTime(data.currentTime)}
                                onError={(e: any) => console.log('Video error', e)}
                                bufferConfig={{
                                    minBufferMs: 15000,
                                    maxBufferMs: 50000,
                                    bufferForPlaybackMs: 2500,
                                    bufferForPlaybackAfterRebufferMs: 5000,
                                }}
                            />
                            {/* Touch overlay with gesture handlers */}
                            <LongPressGestureHandler
                                ref={longPressRef}
                                onHandlerStateChange={handleLongPress}
                                minDurationMs={500}
                                maxDist={10}
                            >
                                <TapGestureHandler
                                    ref={doubleTapRef}
                                    onHandlerStateChange={handleDoubleTapVideo}
                                    numberOfTaps={2}
                                    maxDurationMs={300}
                                >
                                    <TapGestureHandler
                                        ref={tapRef}
                                        onHandlerStateChange={handleSingleTap}
                                        waitFor={[longPressRef, doubleTapRef]}
                                    >
                                        <Animated.View style={[StyleSheet.absoluteFillObject, { zIndex: 10 }]}>
                                            {/* Play/Pause overlay - show when controls are visible */}
                                            {showControls && manuallyPaused && (
                                                <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -30 }, { translateY: -30 }], zIndex: 15 }}>
                                                    <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 30, padding: 12 }}>
                                                        <Play size={36} color="#fff" fill="#fff" />
                                                    </View>
                                                </View>
                                            )}
                                            {/* Mute indicator - show briefly when toggling */}
                                            {showControls && (
                                                <View style={{ position: 'absolute', bottom: 50, right: 16, zIndex: 15 }}>
                                                    <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, padding: 8 }}>
                                                        {isMuted ? (
                                                            <VolumeX size={20} color="#fff" strokeWidth={2.5} />
                                                        ) : (
                                                            <Volume2 size={20} color="#fff" strokeWidth={2.5} />
                                                        )}
                                                    </View>
                                                </View>
                                            )}
                                        </Animated.View>
                                    </TapGestureHandler>
                                </TapGestureHandler>
                            </LongPressGestureHandler>

                            {/* Instagram-style Progress Bar - Bottom */}
                            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', zIndex: 20 }}>
                                <View
                                    style={{
                                        height: '100%',
                                        width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                                        backgroundColor: '#fff',
                                    }}
                                />
                            </View>
                        </>
                    ) : (
                        <TouchableOpacity activeOpacity={0.9} onPress={handleDoubleTap} style={{ flex: 1 }}>
                            <Image source={getImageSource(companyData.profileImage)} style={[styles.mainImage, { backgroundColor: theme.inputBackground }]} resizeMode="cover" />
                        </TouchableOpacity>
                    )}
                    <Animated.View style={[styles.doubleTapHeart, { opacity: heartOpacity, transform: [{ scale: heartScale }] }]} pointerEvents="none">
                        <Heart size={50} color="#fff" fill="#fff" strokeWidth={0} />
                    </Animated.View>
                </View>

                <View style={styles.actionsRow}>
                    <View style={styles.statItemRow}>
                        <TouchableOpacity style={styles.statItem} onPress={toggleLike}>
                            <Heart size={24} color={liked ? '#ef4444' : '#fff'} fill={liked ? '#ef4444' : 'none'} strokeWidth={1.7} />
                            <Text style={[styles.statCount, { color: theme.text }]}>{likes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.statItem} onPress={() => setCommentsOverlayVisible(true)}>
                            <MessageCircle size={24} color="#fff" strokeWidth={1.7} />
                            <Text style={[styles.statCount, { color: theme.text }]}>{commentsCount}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.statItem} onPress={() => setShareModalVisible(true)}>
                            <ShareIcon color="#fff" size={24} />
                            <Text style={[styles.statCount, { color: theme.text }]}>{stats.shares}</Text>
                        </TouchableOpacity>
                        <View style={styles.flex1} />
                        <TouchableOpacity onPress={toggleSave}>
                            <Bookmark size={24} color="#fff" fill={saved ? '#fff' : 'none'} strokeWidth={1.7} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.body}>
                    <Text style={[styles.whatsLabel, { color: theme.placeholder }]}>WHAT'S {companyData.name.toUpperCase()}</Text>
                    {(companyData as any).about && (
                        <View style={{ marginBottom: 12 }}>
                            <Text style={[styles.sectionLabel, { color: theme.placeholder }]}>ABOUT</Text>
                            <TouchableOpacity 
                                activeOpacity={0.8} 
                                onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            >
                                <Text 
                                    style={[styles.descriptionFull, { color: theme.text }]}
                                    numberOfLines={isDescriptionExpanded ? undefined : 3}
                                >
                                    {(companyData as any).about}
                                </Text>
                                {!isDescriptionExpanded && (companyData as any).about && (companyData as any).about.length > 100 && (
                                    <Text style={[styles.descriptionFull, { color: theme.placeholder, marginTop: 4 }]}>...more</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                    {companyData.description && (
                        <TouchableOpacity 
                            activeOpacity={0.8} 
                            onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        >
                            <Text 
                                style={[styles.descriptionFull, { color: theme.text }]}
                                numberOfLines={isDescriptionExpanded ? undefined : 3}
                            >
                                {companyData.description}
                            </Text>
                            {!isDescriptionExpanded && companyData.description && companyData.description.length > 100 && (
                                <Text style={[styles.descriptionFull, { color: theme.placeholder, marginTop: 4 }]}>...more</Text>
                            )}
                        </TouchableOpacity>
                    )}
                    <View style={styles.stageRow}>
                        {((companyData as any).stage || (companyData as any).roundType) ? (
                            <Text style={[styles.stageText, { color: theme.placeholder }]}>STAGE : <Text style={[styles.stageValue, { color: theme.text }]}>{String((companyData as any).stage || (companyData as any).roundType)}</Text></Text>
                        ) : null}
                    </View>
                    <View style={styles.pillsRow}>
                        <View style={[styles.pill, { borderColor: theme.border, backgroundColor: theme.inputBackground }]}><Text style={[styles.pillText, { color: theme.text }]}>{revenueType || 'Revenue type'}</Text></View>
                        <View style={[styles.pill, { borderColor: theme.border, backgroundColor: theme.inputBackground }]}><Text style={[styles.pillText, { color: theme.text }]}>Rounds : {companyData.rounds ?? 0}</Text></View>
                        <View style={[styles.pill, { borderColor: theme.border, backgroundColor: theme.inputBackground }]}><Text style={[styles.pillText, { color: theme.text }]}>Age : {companyData.age ?? 0} yr</Text></View>
                    </View>
                    <Text style={[styles.currentRound, { color: theme.placeholder }]}>Current round : <Text style={[styles.currentRoundValue, { color: theme.text }]}>{(companyData as any).currentRound || latestFundingRound || String(companyData.stage || 'Seed')}</Text></Text>
                </View>
            </View>

            <ShareModal contentId={contentId} type="startup" visible={shareModalVisible} onClose={() => setShareModalVisible(false)} contentTitle={companyData.name} contentImage={companyData.profileImage} contentOwner={companyData.displayName || companyData.name} />
        </>
    );
};

export default StartupPost;
