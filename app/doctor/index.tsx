import { createStackNavigator } from '@react-navigation/stack';
import Patients from "./(ViewPatients)/pages/Patients"; // Adjust the import path as necessary

// Define the RootStackParamList to type our navigation
type RootStackParamList = {
  Patients: undefined;
};

// Create the stack navigator with proper typing
const Stack = createStackNavigator<RootStackParamList>();

const ViewPatients = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Patients" component={Patients} />
  </Stack.Navigator>
);

export default ViewPatients;
