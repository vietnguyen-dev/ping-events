import React from "react";
import { View, StyleSheet } from "react-native";

interface iContainer {
  children: React.ReactNode;
}
const Container: React.FC<iContainer> = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Fills the entire screen
    justifyContent: "center", // Vertical centering
    backgroundColor: "#fff",
  },
});

export default Container;
