import { createStackNavigator } from '@react-navigation/stack';
import Patients from "../../components/doctor-viewpatients/pages/Patients"; 

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
