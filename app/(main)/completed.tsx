"use client"; // важно для expo-router

import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function Completed() {
  const [TW, setTW] = useState<any>(null);

  useEffect(() => {
    // динамический импорт twrnc после инициализации RN
    const twrnc = require("twrnc").default;
    setTW(twrnc);
  }, []);

  if (!TW) return null;

  return (
    <View style={TW`flex-1 justify-center items-center bg-green-500`}>
      <Text style={TW`text-white text-xl font-bold`}>Completed Tasks</Text>
    </View>
  );
}
