import { useState, Fragment } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import { firebaseAuth } from "../../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Container from "../../components/container";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const auth = firebaseAuth;
  const navigation = useNavigation();

  const signIn = async () => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log(res);
    } catch (err: any) {
      console.error(err);
      alert("Sign In Failed" + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <KeyboardAvoidingView behavior="padding">
        <View>
          <Text style={styles.textCenter}>Ping Events</Text>
          <Text style={styles.textCenter}>Find Spontaneos Events</Text>
        </View>
        <View>
          <Text>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            placeholder="Email Address"
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View>
          <Text>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Fragment>
            <Button title="Sign In" onPress={signIn} />
            <Button
              title="Create Account"
              onPress={() => navigation.navigate("Signup" as never)}
            />
          </Fragment>
        )}
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  textCenter: {
    textAlign: "center",
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

export default Login;
