import { migrateDbIfNeeded } from "@/utils/db";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SQLiteProvider onInit={migrateDbIfNeeded} databaseName="todos.db">
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </SQLiteProvider>
  );
}
