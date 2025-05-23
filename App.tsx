import { useEffect, useState, Fragment } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged, User } from "firebase/auth";
import Login from "./app/screens/auth/login";
import Signup from "./app/screens/auth/signup";
import Home from "./app/screens/home";
import Saved from "./app/screens/saved";
import Settings from "./app/screens/settings";
import { firebaseAuth } from "./firebaseConfig";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function LoggedIn() {
  return (
    <Tab.Navigator id={undefined}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Saved"
        component={Saved}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      console.log(user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" id={undefined}>
        {user ? (
          <Stack.Screen
            name="LoggedIn"
            component={LoggedIn}
            options={{ headerShown: false }}
          />
        ) : (
          <Fragment>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={{ headerShown: false }}
            />
          </Fragment>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
