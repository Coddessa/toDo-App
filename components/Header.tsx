import { View, Text, Pressable } from "react-native";
import React from "react";
import { create } from "twrnc";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";

const Header = ({ title }: { title: string }) => {
  const tw = create();
  return (
    <View style={tw`flex-row pt-5 pb-4 px-5 justify-between items-center`}>
      <Pressable onPress={router.back}>
        <AntDesign name="left" size={24} color="black" />
      </Pressable>
      <Text style={tw`text-3xl font-bold text-blue-900`}>{title}</Text>
      <View />
    </View>
  );
};

export default Header;
