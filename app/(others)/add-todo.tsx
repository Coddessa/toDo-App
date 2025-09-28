"use client";

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
import UUID from "react-native-uuid";
import { router } from "expo-router";

import SafeView from "@/components/SafeView";
import Header from "@/components/Header";
import { todoValidator } from "@/validators/todo-validator";
import { useTodos } from "@/hooks/useTodos";

const AddTodo = () => {
  const db = useSQLiteContext();
  const { getTodos } = useTodos();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [pickerVisible, setPickerVisible] = useState<"start" | "end" | null>(
    null
  );

  const handleChange = useCallback(
    (type: "title" | "description", value: string) => {
      if (type === "title") setTitle(value);
      else setDescription(value);
    },
    []
  );

  const handleChangeDate = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (event.type === "set" && selectedDate) {
        if (pickerVisible === "start") setStartDate(selectedDate);
        else if (pickerVisible === "end") setEndDate(selectedDate);
      }
      setPickerVisible(null);
    },
    [pickerVisible]
  );

  const { mutate: handleAddTodo, isPending } = useMutation({
    mutationKey: ["add-todo"],
    mutationFn: async () => {
      const parsedData = await todoValidator.parseAsync({
        title,
        description,
        startDate: startDate.toDateString(),
        endDate: endDate.toDateString(),
      });

      if (startDate > endDate) {
        throw new Error("Start Date cannot be greater than End Date");
      }

      const newTodo = {
        id: UUID.v4().toString(),
        ...parsedData,
        completed: 0,
      };

      await db.runAsync(
        "INSERT INTO todos VALUES (?,?,?,?,?,?)",
        newTodo.id,
        title,
        newTodo.description!,
        newTodo.startDate,
        newTodo.endDate,
        0
      );

      return newTodo;
    },
    onSuccess: async () => {
      await getTodos(db);
      setTitle("");
      setDescription("");
      setStartDate(new Date());
      setEndDate(new Date());
      Alert.alert("Success", "Task added successfully", [
        {
          text: "OK",
          onPress: () => {
            if (router.canGoBack()) router.back();
            else router.replace("/pending");
          },
        },
      ]);
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
      <Header title="Add Task" />
      <ScrollView
        contentContainerStyle={tw`mt-8 gap-y-6 items-center`}
        showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={tw`gap-y-3 w-[85%]`}>
          <Text style={tw`text-base font-medium ml-1.5`}>Title</Text>
          <TextInput
            placeholder="Enter title"
            style={tw`bg-white py-3 px-4 rounded-xl border`}
            value={title}
            onChangeText={(text) => handleChange("title", text)}
          />
        </View>

        {/* Description */}
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

        {/* Start Date */}
        <View style={tw`gap-y-3 w-[85%]`}>
          <Text style={tw`text-base font-medium ml-1.5`}>Start Date</Text>
          <Pressable onPress={() => setPickerVisible("start")}>
            <TextInput
              placeholder="Select start date"
              style={tw`bg-white py-3 px-4 rounded-xl border text-black`}
              value={startDate.toDateString()}
              editable={false}
              pointerEvents="none"
            />
            <View style={tw`absolute right-3 top-[30%]`}>
              <FontAwesome5 name="calendar-alt" size={20} color="gray" />
            </View>
          </Pressable>
        </View>

        {/* End Date */}
        <View style={tw`gap-y-3 w-[85%]`}>
          <Text style={tw`text-base font-medium ml-1.5`}>End Date</Text>
          <Pressable onPress={() => setPickerVisible("end")}>
            <TextInput
              placeholder="Select end date"
              style={tw`bg-white py-3 px-4 rounded-xl border text-black`}
              value={endDate.toDateString()}
              editable={false}
              pointerEvents="none"
            />
            <View style={tw`absolute right-3 top-[30%]`}>
              <FontAwesome5 name="calendar-alt" size={20} color="gray" />
            </View>
          </Pressable>
        </View>

        {/* DateTimePicker */}
        {pickerVisible && (
          <DateTimePicker
            value={pickerVisible === "start" ? startDate : endDate}
            mode="date"
            display="default"
            onChange={handleChangeDate}
          />
        )}

        {/* Add Button */}
        <Pressable
          style={tw`w-[85%] ${
            isPending ? "bg-blue-300" : "bg-blue-600"
          } items-center justify-center py-3.5 rounded-xl`}
          onPress={() => handleAddTodo()}
          disabled={isPending}>
          <Text style={tw`text-lg font-semibold text-white`}>
            {isPending ? "Please wait..." : "Add"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeView>
  );
};

export default AddTodo;
