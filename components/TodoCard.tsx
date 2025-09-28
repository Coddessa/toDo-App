import { View, Text, Pressable } from "react-native";
import React, { useCallback } from "react";
import { create } from "twrnc";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

import { useTodo } from "@/hooks/useTodo";
import type { TodoType } from "@/hooks/useTodos";

const TodoCard = ({ todo }: { todo: TodoType }) => {
  const { setTodo } = useTodo();
  const tw = create();
  const handlePress = useCallback(() => {
    setTodo(todo);
    router.push("/todo");
  }, [todo]);

  const parseDate = useCallback((date: string) => {
    const parsedDate = date.split(" ");

    return `${parsedDate[1]} ${parsedDate[2]}, ${parsedDate[3]}`;
  }, []);
  return (
    <Pressable
      style={tw`p-4 bg-white border border-gray-300 rounded-xl flex-row justify-between items-center shadow-lg shadow-gray-300 mb-4`}
      onPress={handlePress}>
      <View style={tw`gap-y-1.5`}>
        <Text style={tw`text-lg font-semibold`}>{todo?.title}</Text>
        <View style={tw`flex-row gap-x-3 items-center`}>
          <FontAwesome5 name="calendar-alt" size={17} color="gray" />
          <Text style={tw`text-gray-700`}>
            {parseDate(todo?.startDate)} - {parseDate(todo?.endDate)}
          </Text>
        </View>
      </View>

      <Entypo name="chevron-right" size={24} color="black" />
    </Pressable>
  );
};

export default TodoCard;
