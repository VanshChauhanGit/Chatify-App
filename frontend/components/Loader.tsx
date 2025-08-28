import { colors } from "@/constants/theme";
import { ActivityIndicator } from "react-native";

function Loader({ size = 40 }) {
  return <ActivityIndicator size={size} color={colors.primary} />;
}

export default Loader;
