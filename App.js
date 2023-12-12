import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Adjust based on the actual icon pack you are using

// Define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  playingText: {
    marginTop: 20,
  },
  transportButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  transportButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: '#3498db', // Change background color
    height: 50, // Change height
    borderWidth: 2, // Change border width
    borderColor: '#2980b9', // Change border color
    borderRadius: 8, // Add border radius for rounded corners
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff', // Change text color
    fontSize: 16, // Change text size
  },
});

const App = () => {
  const [sound, setSound] = useState(null);
  const [currentStationIndex, setCurrentStationIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffleList, setShuffleList] = useState([]);
  const [shuffleIndex, setShuffleIndex] = useState(0);

  const stations = [
    'CKDU',
    'CMHA',
    'CJLO',
    'CKUT',
    'CiTR',
    'WNYC',
    'WFMU',
    'KEXP',
    'KCRW',
    'NTS'
    // Add more station names as needed
  ];

  const streamURLs = {
    QCCR: "http://us3.streamingpulse.com:8074/stream?type=http&nocache=2864",
    CKDU: "https://archive1.ckdu.ca:9750/ckdu_1_on_air_low.mp3",
    CJLO: "http://rosetta.shoutca.st:8883/stream",
    CITR: "http://live.citr.ca:8000/live.mp3",
    CHMA: "http://chma-nicecast.mta.ca:8000/listen",
    KEXP: "http://live-mp3-128.kexp.org/kexp128.mp3",
    KCRW: "http://kcrw.streamguys1.com/kcrw_192k_mp3_e24_internet_radio",
    WFMU: "http://stream0.wfmu.org/do-or-diy",
    WNYC: "http://fm939.wnyc.org/wnycfm.aac",
    NTS:  "http://stream-relay-geo.ntslive.net/stream",
  };

  const playAudio = async (stationIndex) => {
    const station = stations[stationIndex];
    const streamURL = streamURLs[station];

    if (!streamURL || currentStationIndex === stationIndex) return;

    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }

      const newSound = new Audio.Sound();
      await newSound.loadAsync({ uri: streamURL });
      setSound(newSound);
      setCurrentStationIndex(stationIndex);
      setIsPlaying(true);
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      setIsPlaying(false);
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const previousAudio = () => {
    const prevIndex = (currentStationIndex - 1 + stations.length) % stations.length;
    stopAudio();
    playAudio(prevIndex);
  };

  const nextAudio = () => {
    const nextIndex = (currentStationIndex + 1) % stations.length;
    stopAudio();
    playAudio(nextIndex);
  };

  const shuffle = () => {
    const currentIndex = shuffleList.length > 0 ? shuffleList[shuffleList.length - 1] : currentStationIndex;
    let newIndex = currentIndex;

    while (newIndex === currentIndex) {
      newIndex = Math.floor(Math.random() * stations.length);
    }

    setShuffleList([...shuffleList, newIndex]);
    setShuffleIndex(shuffleIndex + 1);
    stopAudio();
    playAudio(newIndex);
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  
  return (
    <View style={{ flex: 1, marginTop: 40, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Internet Radio</Text>
      
      {/* List of station buttons */}
      {stations.map((station, index) => (
        <Button key={index} title={station} onPress={() => playAudio(index)} />
      ))}
  
      {/* Space to display currently playing station */}
      <Text style={{ marginTop: 20 }}>
        {isPlaying ? `Now playing: ${stations[currentStationIndex]}` : ''}
      </Text>
  
      {/* Fixed container for transport buttons and slider */}
      <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
        {/* Transport buttons with icons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Icon name="previous" size={40} onPress={previousAudio} />
          <Icon name={isPlaying ? "pause" : "play"} size={40} onPress={isPlaying ? stopAudio : () => playAudio(currentStationIndex)} />
          <Icon name="next" size={40} onPress={nextAudio} />
          <Icon name="shuffle" size={40} onPress={shuffle} />
        </View>
  
        {/* Volume Slider Container */}
        {/* <View style={{ transform: [{ scaleX: -1 }] }}> */}
          {/* Volume Slider */}
          {/* <Slider
            style={{ width: '100%', height: 40, transform: [{ scaleX: -1 }] }} // Flip the slider
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            value={0.5} // Set initial value to the midpoint
            onValueChange={(value) => {
              if (sound) {
                sound.setVolumeAsync(1 - value); // Invert the value to control the volume
              }
            }}
          />
        </View> */}
      </View>
    </View>
  );
  };
  
  export default App;