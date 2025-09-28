import { router, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { create } from "twrnc";
import { useQuery } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";

import SafeView from "@/components/SafeView";
import { useTodos } from "@/hooks/useTodos";

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const db = useSQLiteContext();
  const { getTodos } = useTodos();
  const tw = create();
  const { data } = useQuery({
    queryKey: ["get-todos"],
    queryFn: () => getTodos(db),
  });

  useEffect(() => {
    if (rootNavigationState?.key) {
      if (data) {
        router.replace("/pending");
      }
    }
  }, [rootNavigationState?.key, data]);
  return (
    <SafeView style={tw`items-center justify-center gap-y-12`}>
      <View style={tw`gap-y-4 items-center`}>
        <Image
          source={require("../assets/images/logo.png")}
          style={tw`w-36 h-36 rounded-full`}
        />
        <Text style={tw`font-bold text-3xl`}>Todo List</Text>
      </View>
      <ActivityIndicator size={45} color={"blue"} />
    </SafeView>
  );
}
