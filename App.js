import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar 
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { parse } from 'iptv-playlist-parser';

export default function App() {
  const [channels, setChannels] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tamil channels playlist from iptv-org
  const PLAYLIST_URL = "https://iptv-org.github.io/iptv/languages/tam.m3u";

  useEffect(() => {
    loadPlaylist();
  }, []);

  const loadPlaylist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(PLAYLIST_URL);
      const text = await response.text();
      const parsed = parse(text);
      setChannels(parsed.items || []);
    } catch (err) {
      console.log(err);
      setError("Playlist load ஆகல. Internet check பண்ணுங்க.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Tamil Channels Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadPlaylist}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (selected) {
    return (
      <View style={styles.playerContainer}>
        <StatusBar hidden />
        <Video
          source={{ uri: selected.url }}
          style={styles.video}
          useNativeControls
          shouldPlay
          resizeMode={ResizeMode.CONTAIN}
          onError={(e) => console.log("Video Error:", e)}
        />
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => setSelected(null)}
        >
          <Text style={styles.backText}>← Back to Channels</Text>
        </TouchableOpacity>
        <Text style={styles.channelTitle} numberOfLines={1}>
          {selected.name}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>📺 Tamil IPTV</Text>
      <Text style={styles.subtitle}>{channels.length} Channels</Text>
      
      <FlatList
        data={channels}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.channel} 
            onPress={() => setSelected(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.channelName} numberOfLines={1}>
              {item.name}
            </Text>
            {item.group?.title ? (
              <Text style={styles.groupName}>{item.group.title}</Text>
            ) : null}
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0a0a0a', 
    paddingTop: 10 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#0a0a0a' 
  },
  title: { 
    color: '#00d4ff', 
    fontSize: 26, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 4 
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15
  },
  loadingText: { 
    color: '#ccc', 
    marginTop: 12, 
    fontSize: 16 
  },
  errorText: { 
    color: '#ff5555', 
    fontSize: 16, 
    textAlign: 'center',
    marginHorizontal: 20
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: '#00d4ff',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8
  },
  retryText: {
    color: '#000',
    fontWeight: 'bold'
  },
  channel: { 
    paddingVertical: 14, 
    paddingHorizontal: 18,
    borderBottomWidth: 1, 
    borderBottomColor: '#1a1a1a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  channelName: { 
    color: '#fff', 
    fontSize: 16,
    flex: 1
  },
  groupName: {
    color: '#666',
    fontSize: 12,
    marginLeft: 10
  },
  playerContainer: { 
    flex: 1, 
    backgroundColor: 'black' 
  },
  video: { 
    flex: 1 
  },
  backBtn: { 
    position: 'absolute', 
    top: 40, 
    left: 16, 
    backgroundColor: 'rgba(0,0,0,0.75)', 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 8,
    zIndex: 10
  },
  backText: { 
    color: 'white',
    fontSize: 15
  },
  channelTitle: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 6,
    textAlign: 'center'
  }
});
