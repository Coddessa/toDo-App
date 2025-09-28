"use client";

import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import SafeView from "@/components/SafeView";
import Progress from "@/components/Progress";
import TodoCard from "@/components/TodoCard";
import { useTodos } from "@/hooks/useTodos";

const Pending = () => {
  const { todos } = useTodos();
  const [tw, setTw] = useState<any>(null);

  useEffect(() => {
    const twrnc = require("twrnc").create();
    setTw(twrnc);
  }, []);

  if (!tw) return null; // пока twrnc не загружен

  const todayTodos = todos.filter(
    (todo) =>
      (todo.startDate === new Date().toDateString() ||
        todo.endDate === new Date().toDateString()) &&
      todo.completed === 0
  );

  return (
    <SafeView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={tw`pt-6 text-center text-3xl font-bold text-blue-900`}>
          Pending
        </Text>

        <View style={tw`items-center px-4 mt-8 gap-y-8`}>
          <Progress />

          <View style={tw`w-full gap-y-4 h-full`}>
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-blue-900 font-semibold text-2xl`}>
                Today&apos;s Task
              </Text>

              <Pressable
                style={tw`flex-row gap-x-1.5 items-center`}
                onPress={() => router.push("/all-todos")}>
                <Text style={tw`text-gray-700`}>See All</Text>
                <Entypo name="chevron-right" size={22} color="gray" />
              </Pressable>
            </View>

            {todayTodos.length === 0 && (
              <Text
                style={tw`text-rose-600 font-semibold text-base text-center`}>
                No data to show.
              </Text>
            )}

            <FlashList
              data={todayTodos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TodoCard todo={item} />}
              estimatedItemSize={50}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </ScrollView>

      <Pressable
        style={tw`absolute bg-blue-600 bottom-4 right-4 p-2 rounded-full`}
        onPress={() => router.push("/add-todo")}>
        <AntDesign name="plus" size={28} color="white" />
      </Pressable>
    </SafeView>
  );
};

export default Pending;
