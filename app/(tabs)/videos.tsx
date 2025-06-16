import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ViewToken,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
// import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Removed as not needed for height calc

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

interface Video {
  id: string;
  videoUrl: string;
}

interface VideoItemWrapperProps {
  screenHeight: number;
  children: React.ReactNode;
}

const VideoItemWrapper: React.FC<VideoItemWrapperProps> = ({ screenHeight, children }) => {
  return (
    <View
      style={{
        height: screenHeight,
        width: windowWidth, // Ensure wrapper takes full width
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,0,0,0.2)', // TEMPORARY: for visual debugging (red)
      }}
    >
      {children}
    </View>
  );
};

const VideoPlayer = ({ videoUrl, isVisible }: { videoUrl: string; isVisible: boolean }) => {
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
  });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isVisible) {
      player.play();
      setIsPlaying(true);
      console.log(`Playing video: ${videoUrl}`);
    } else {
      player.pause();
      setIsPlaying(false);
      console.log(`Pausing video: ${videoUrl}`);
    }
  }, [isVisible, player, videoUrl]);

  const togglePlay = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <TouchableOpacity
      onPress={togglePlay}
      style={styles.videoContainer}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        console.log(`VideoPlayer Rendered Height: ${height}`);
      }}
    >
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />
      {!isPlaying && (
        <View style={styles.playButton}>
          <Ionicons name="play" size={60} color="rgba(255, 255, 255, 0.7)" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const Videos = () => {
  const tabBarHeight = 88; // From app/(tabs)/_layout.tsx
  const screenHeight = windowHeight - tabBarHeight; // Accurate content height for this tab

  const mockVideos: Video[] = [
    { id: 'v1', videoUrl: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
    { id: 'v2', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    { id: 'v3', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { id: 'v4', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4' },
  ];

  const [videoFeed, setVideoFeed] = useState<Video[]>(mockVideos);
  const [viewableItems, setViewableItems] = useState<string[]>([]);

  const onViewableItemsChanged = ({ viewableItems: viewable }: { viewableItems: ViewToken[] }) => {
    const newViewableIds = viewable.filter((item) => item.isViewable).map((item) => item.item.id);
    setViewableItems(newViewableIds);
    console.log("Viewable Items Reported by FlatList:", newViewableIds);
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 75,
  };

  const filteredFeed = videoFeed.filter((item) => !!item && item.videoUrl);

  return (
    <View style={styles.container}>
      {filteredFeed.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="play-circle-outline" size={64} color="#E5E5E5" />
          <Text style={styles.emptyText}>Aucune vidéo disponible</Text>
        </View>
      ) : (
      <FlatList
        data={filteredFeed}
          keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <VideoItemWrapper screenHeight={screenHeight}>
          <VideoPlayer
            videoUrl={item.videoUrl}
                isVisible={viewableItems.includes(item.id)}
          />
            </VideoItemWrapper>
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={2}
          getItemLayout={(data, index) => ({
            length: screenHeight,
            offset: screenHeight * index,
            index,
          })}
          style={{ flex: 1, width: '100%' }} // FlatList itself takes remaining space
      />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  videoContainer: {
    flex: 1, // Ensure it fills its parent VideoItemWrapper
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  playButton: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    position: "absolute",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
  },
});

export default Videos; 