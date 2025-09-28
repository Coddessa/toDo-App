import { View, Text, ScrollView, TextInput } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import tw from "twrnc";
import { FlashList } from "@shopify/flash-list";

import SafeView from "@/components/SafeView";
import Header from "@/components/Header";
import TodoCard from "@/components/TodoCard";
import { useTodos } from "@/hooks/useTodos";

const AllTodos = () => {
  const { todos } = useTodos();

  const [filteredTodos, setFilteredTodos] = useState(
    todos.filter((todo) => todo.completed === 0)
  );

  const filterTodos = useCallback(
    (searchQuery: string) => {
      if (searchQuery === "") {
        if (filteredTodos === todos.filter((todo) => todo.completed === 0)) {
          return;
        } else {
          return setFilteredTodos(todos.filter((todo) => todo.completed === 0));
        }
      }

      const newTodos = todos.filter((todo) =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredTodos(newTodos);
    },
    [todos, filteredTodos]
  );

  useEffect(() => {
    setFilteredTodos(todos.filter((todo) => todo.completed === 0));
  }, [todos]);

  return (
    <SafeView>
      <Header title="All Pending Tasks" />

      <View style={tw`items-center mb-6`}>
        <TextInput
          style={tw`bg-white shadow shadow-black border border-gray-300 w-[90%] py-2.5 px-3 rounded-xl`}
          placeholder="Search..."
          onChangeText={filterTodos}
        />
      </View>

      <View style={tw`h-full px-4`}>
        {filteredTodos.length === 0 && (
          <Text style={tw`text-rose-600 font-semibold text-base text-center`}>
            No data to show.
          </Text>
        )}

        <FlashList
          data={filteredTodos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return <TodoCard todo={item} />;
          }}
          estimatedItemSize={50}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeView>
  );
};

export default AllTodos;
