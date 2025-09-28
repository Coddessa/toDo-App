import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { FontAwesome5 } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import { ZodError } from "zod";
import { router } from "expo-router";

import SafeView from "@/components/SafeView";
import Header from "@/components/Header";
import { todoValidator } from "@/validators/todo-validator";
import { useTodos } from "@/hooks/useTodos";
import { useTodo } from "@/hooks/useTodo";

const EditTodo = () => {
  const db = useSQLiteContext();
  const { getTodos } = useTodos();
  const { todo, setTodo } = useTodo();

  const [title, setTitle] = useState(todo!.title);
  const [description, setDescription] = useState(todo!.description);
  const [startDate, setStartDate] = useState(todo!.startDate);
  const [endDate, setEndDate] = useState(todo!.endDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState<"start" | "end" | null>(null);

  const handleChange = useCallback(
    (type: "title" | "description", value: string) => {
      if (type === "title") {
        setTitle(value);
      } else if (type === "description") {
        setDescription(value);
      }
    },
    []
  );

  const handleChangeDate = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      setShowDatePicker(false);
      if (event.type === "set") {
        if (type === "start" && date) {
          setStartDate(date.toDateString());
        } else if (type === "end" && date) {
          setEndDate(date.toDateString());
        }
      }
    },
    [type]
  );

  const { mutate: handleEditTodo, isPending } = useMutation({
    mutationKey: ["edit-todo"],
    mutationFn: async () => {
      const parsedData = await todoValidator.parseAsync({
        title,
        description,
        startDate,
        endDate,
      });

      if (new Date(parsedData.startDate) > new Date(parsedData.endDate)) {
        throw new Error("Start Date cannot be greater than end date");
      }

      if (
        parsedData.title === todo?.title &&
        parsedData.description === todo.description &&
        parsedData.startDate === todo.startDate &&
        parsedData.endDate === todo.endDate
      ) {
        throw new Error("Please make some changes first");
      }
      await db.runAsync(
        "UPDATE todos SET title = ?, description = ?, startDate = ?, endDate = ? WHERE id = ?",
        parsedData.title,
        parsedData.description!,
        parsedData.startDate,
        parsedData.endDate,
        todo!.id
      );

      return parsedData;
    },
    onSuccess: async (data) => {
      await getTodos(db);
      setTodo({
        id: todo!.id,
        title: data.title,
        description: data.description!,
        startDate: data.startDate,
        endDate: data.endDate,
        completed: todo!.completed,
      });
      Alert.alert("Success", "Task edited successfully", [
        {
          text: "Ok",
          onPress: router.back,
        },
      ]);
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        Alert.alert("Error", error.errors[0].message);
      } else {
        Alert.alert("Error", error.message);
      }
    },
  });
  return (
    <SafeView>
      <Header title="Edit Task" />
      {showDatePicker && type && (
        <DateTimePicker
          mode="date"
          value={new Date()}
          onChange={handleChangeDate}
        />
      )}
      <ScrollView
        contentContainerStyle={tw`mt-8 gap-y-6 items-center`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`gap-y-3 w-[85%]`}>
          <Text style={tw`text-base font-medium ml-1.5`}>Title</Text>
          <TextInput
            placeholder="Enter title"
            style={tw`bg-white py-3 px-4 rounded-xl border`}
            value={title}
            onChangeText={(text) => handleChange("title", text)}
          />
        </View>
        <View style={tw`gap-y-3 w-[85%]`}>
          <Text style={tw`text-base font-medium ml-1.5`}>Description</Text>
          <TextInput
            placeholder="Enter description"
            style={tw`bg-white py-3 px-4 rounded-xl border`}
            value={description}
            onChangeText={(text) => handleChange("description", text)}
            multiline
            numberOfLines={4}
          />
        </View>
        <View style={tw`gap-y-3 w-[85%]`}>
          <Text style={tw`text-base font-medium ml-1.5`}>Start Date</Text>
          <Pressable
            onPress={() => {
              setType("start");
              setShowDatePicker(true);
            }}
          >
            <TextInput
              placeholder="Select start date"
              style={tw`bg-white py-3 px-4 rounded-xl border text-black`}
              value={startDate}
              readOnly
            />
            <View style={tw`absolute right-3 top-[30%]`}>
              <FontAwesome5 name="calendar-alt" size={20} color="gray" />
            </View>
          </Pressable>
        </View>
        <View style={tw`gap-y-3 w-[85%]`}>
          <Text style={tw`text-base font-medium ml-1.5`}>End Date</Text>
          <Pressable
            onPress={() => {
              setType("end");
              setShowDatePicker(true);
            }}
          >
            <TextInput
              placeholder="Enter end date"
              style={tw`bg-white py-3 px-4 rounded-xl border text-black`}
              value={endDate}
              readOnly
            />
            <View style={tw`absolute right-3 top-[30%]`}>
              <FontAwesome5 name="calendar-alt" size={20} color="gray" />
            </View>
          </Pressable>
        </View>

        <Pressable
          style={tw`w-[85%] ${
            isPending ? "bg-blue-300" : "bg-blue-600"
          } items-center justify-center py-3.5 rounded-xl`}
          onPress={() => handleEditTodo()}
          disabled={isPending}
        >
          <Text style={tw`text-lg font-semibold text-white`}>
            {isPending ? "Please wait..." : "Edit"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeView>
  );
};

export default EditTodo;
