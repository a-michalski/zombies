import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View style={styles.container}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.message}>Page not found</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Return to Main Menu</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#1a1a1a",
  },
  title: {
    fontSize: 72,
    fontWeight: "900" as const,
    color: "#FF4444",
    marginBottom: 16,
  },
  message: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 32,
  },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#333333",
    borderRadius: 8,
  },
  linkText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
