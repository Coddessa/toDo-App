import { View, Text, Pressable, Alert } from "react-native";
import React, { useCallback } from "react";
import tw from "twrnc";
import {
  AntDesign,
  MaterialIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useMutation } from "@tanstack/react-query";

import SafeView from "@/components/SafeView";
import { useTodo } from "@/hooks/useTodo";
import { useTodos } from "@/hooks/useTodos";

const Todo = () => {
  const { todo, setTodo } = useTodo();
  const { getTodos } = useTodos();
  const db = useSQLiteContext();

  const handleBack = useCallback(() => {
    setTodo(null);
    router.back();
  }, []);

  const parseDate = useCallback((date: string) => {
    const parsedDate = date.split(" ");

    return `${parsedDate[1]} ${parsedDate[2]}, ${parsedDate[3]}`;
  }, []);

  const { mutateAsync: handleDelete } = useMutation({
    mutationKey: [`delete-todo-${todo?.id}`],
    mutationFn: async () => {
      await db.runAsync("DELETE FROM todos where id = ?", todo!.id);

      return true;
    },
    onSuccess: async () => {
      await getTodos(db);
      Alert.alert("Success", "Task deleted successfully", [
        {
          text: "Ok",
          onPress: handleBack,
        },
      ]);
    },
    onError: () => {
      Alert.alert("Error", "Some error occured. Please try again later!");
    },
  });

  const { mutateAsync: handleMarkAsCompleted } = useMutation({
    mutationKey: [`mark-as-complete-${todo?.id}`],
    mutationFn: async () => {
      await db.runAsync(
        "UPDATE todos SET completed = 1 where id = ?",
        todo!.id
      );

      return true;
    },
    onSuccess: async () => {
      await getTodos(db);
      Alert.alert("Success", "Marked as completed", [
        {
          text: "Ok",
          onPress: () => {
            setTodo({ ...todo!, completed: 1 });
          },
        },
      ]);
    },
    onError: () => {
      Alert.alert("Error", "Some error occured. Please try again later!");
    },
  });
  return (
    <SafeView>
      <View style={tw`pt-4 px-5 flex-row justify-between items-center`}>
        <Pressable onPress={handleBack}>
          <AntDesign name="left" size={24} color="black" />
        </Pressable>

        <View style={tw`flex-row gap-x-4 items-center`}>
          <Pressable onPress={() => router.push("/edit-todo")}>
            <MaterialIcons name="edit" size={26} color="black" />
          </Pressable>
          <Pressable
            onPress={() => {
              Alert.alert("Warning", "Do you want to delete this todo?", [
                {
                  text: "No",
                },
                {
                  text: "Yes",
                  onPress: async () => {
                    await handleDelete();
                  },
                },
              ]);
            }}
          >
            <MaterialIcons name="delete" size={26} color="black" />
          </Pressable>
        </View>
      </View>

      <View style={tw`gap-y-6 px-5 mt-8`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-4xl font-bold`}>{todo?.title}</Text>
          {todo?.completed === 0 && (
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Warning",
                  "Do you want to mark this task as completed?",
                  [
                    {
                      text: "No",
                    },
                    {
                      text: "Yes",
                      onPress: async () => {
                        await handleMarkAsCompleted();
                      },
                    },
                  ]
                );
              }}
            >
              <Ionicons name="checkmark-done-circle" size={26} color={"blue"} />
            </Pressable>
          )}
        </View>

        <Text style={tw`text-base leading-7 text-justify`}>
          {todo?.description || "No description added"}
        </Text>

        <View style={tw`flex-row gap-x-3 items-center`}>
          <FontAwesome5 name="calendar-alt" size={17} color="gray" />
          {todo?.startDate && todo.endDate && (
            <Text style={tw`text-gray-700`}>
              {parseDate(todo.startDate)} - {parseDate(todo.endDate)}
            </Text>
          )}
        </View>
      </View>
    </SafeView>
  );
};

export default Todo;
