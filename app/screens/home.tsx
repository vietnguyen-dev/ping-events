import { View, Text, StyleSheet } from "react-native";

const Home = () => {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
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

export default Home;
