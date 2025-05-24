import { View, Text, Button, StyleSheet } from "react-native";
import { firebaseAuth } from "../../../firebaseConfig";

const Settings = () => {
  const auth = firebaseAuth;

  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <Button title="Sign Out" onPress={() => firebaseAuth.signOut()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 3,
    flex: 1, // Fills the entire screen
    justifyContent: "center", // Vertical centering
    backgroundColor: "#fff", // Optional background
  },
  text: {
    fontSize: 18,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
});

export default Settings;
