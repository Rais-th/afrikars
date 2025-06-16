import { Stack } from "expo-router";

export default function RootLayout() {
  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="car/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="post-car" options={{ headerShown: false }} />
        <Stack.Screen name="checkout/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      </Stack>
  );
}
