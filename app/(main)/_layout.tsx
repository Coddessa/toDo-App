import { Tabs } from "expo-router";
import React from "react";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const MainLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="pending"
        options={{
          title: "Pending",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="timer" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="completed"
        options={{
          title: "Completed",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default MainLayout;
