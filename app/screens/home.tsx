import { useEffect, useState, useRef } from "react";
import { 
  StyleSheet, 
  Text, 
  ActivityIndicator, 
  TouchableOpacity, 
  View,
  TextInput,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
  Platform
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import Container from "../components/container";

const Home = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [endPingModalVisible, setEndPingModalVisible] = useState(false);
  const [pingDescription, setPingDescription] = useState("");
  const [activePing, setActivePing] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [isMarkerFocused, setIsMarkerFocused] = useState(true);
  const mapRef = useRef(null);
  const MAX_CHARS = 140;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg("Could not fetch location");
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleStartPing = () => {
    setModalVisible(true);
    setIsMarkerFocused(false);
  };

  const handleSubmitPing = () => {
    if (location && pingDescription.trim()) {
      setActivePing({
        id: Date.now().toString(),
        coordinate: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        description: pingDescription.trim(),
      });
      setModalVisible(false);
      setPingDescription("");
      setCharCount(0);
    }
  };

  const handleEndPingRequest = () => {
    setEndPingModalVisible(true);
  };

  const handleEndPing = () => {
    setActivePing(null);
    setEndPingModalVisible(false);
    setIsMarkerFocused(false);
  };

  const handleTextChange = (text) => {
    if (text.length <= MAX_CHARS) {
      setPingDescription(text);
      setCharCount(text.length);
    }
  };

  let content;
  if (loading) {
    content = <ActivityIndicator size="large" />;
  } else if (errorMsg) {
    content = <Text style={styles.errorText}>{errorMsg}</Text>;
  } else if (location) {
    content = (
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            tracksViewChanges={isMarkerFocused}
            onPress={() => {
              setIsMarkerFocused(true);
              if (Platform.OS === 'ios') {
                if (!activePing) {
                  handleStartPing();
                } else {
                  handleEndPingRequest();
                }
              }
            }}
          >
            <Callout 
              onPress={activePing ? handleEndPingRequest : handleStartPing}
              tooltip={true}
              style={styles.callout}
            >
              <View style={styles.calloutContainer}>
                {activePing ? (
                  <View style={styles.calloutInnerContainer}>
                    <Text style={styles.calloutTitle}>
                      {activePing.description}
                    </Text>
                    <View style={styles.calloutButton}>
                      <Text style={styles.calloutButtonText}>End Ping</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.calloutInnerContainer}>
                    <Text style={styles.calloutTitle}>Start Ping?</Text>
                    <View style={styles.calloutButton}>
                      <Text style={styles.calloutButtonText}>Create</Text>
                    </View>
                  </View>
                )}
              </View>
            </Callout>
          </Marker>
        </MapView>

        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={!activePing ? handleStartPing : handleEndPingRequest}
        >
          <Text style={styles.floatingButtonText}>{!activePing ? "+" : "×"}</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    content = <Text>Unknown error occurred</Text>;
  }

  return (
    <Container>
      {content}
      
      {/* Create Ping Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create a Ping</Text>
              <Text style={styles.charCounter}>{charCount}/{MAX_CHARS}</Text>
              <TextInput
                style={styles.textInput}
                placeholder="What's happening here? (140 chars max)"
                multiline
                value={pingDescription}
                onChangeText={handleTextChange}
                maxLength={MAX_CHARS}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => {
                    setModalVisible(false);
                    setPingDescription("");
                    setCharCount(0);
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.submitButton, 
                    {opacity: pingDescription.trim() ? 1 : 0.5}
                  ]} 
                  onPress={handleSubmitPing}
                  disabled={!pingDescription.trim()}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* End Ping Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={endPingModalVisible}
        onRequestClose={() => setEndPingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>End Ping?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setEndPingModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleEndPing}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  callout: {
    backgroundColor: 'white',
    borderRadius: 6,
  },
  calloutContainer: {
    minWidth: 150,
    maxWidth: 250,
    backgroundColor: 'white',
    borderRadius: 6,
  },
  calloutInnerContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  calloutButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: "center",
  },
  calloutButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  pingDescription: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  textInput: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  charCounter: {
    alignSelf: "flex-end",
    marginBottom: 5,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#34C759",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default Home;
