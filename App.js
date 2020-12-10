/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  Text, View, FlatList, StyleSheet, TextInput, StatusBar, Button, TouchableOpacity, ActivityIndicator
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';


const storeData = async (value) => {
  console.log('aa')
  try {
    value = JSON.stringify(value);
    await AsyncStorage.setItem('@storage_Key', value)
  } catch (e) {
    // saving error
  }
}

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Key')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}

const App = () => {
  const [value, onChangeText] = React.useState('Tarefa');
  const [isEdit, setIsEdit] = React.useState(false);
  const [tasks, setTasks] = React.useState([]);
  const [taskIndex, setTaskIndex] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    const fetchStoragedData = async () => {
      const response = await getData();
      if (response) {
        setTasks(response);
        setIsLoaded(true);
      }
    }
    fetchStoragedData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      storeData(tasks);
    }
  }, [tasks]);
  

  const renderItem = ({ item, index }) => (
    <Item title={item} id={index} />
  );

  const Item = ({ title, id }) => (
    <View style={styles.item}>
      <View style={{width: 230}}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.buttonBox}>
        <Icon name="edit" size={27} style={{marginHorizontal: 10}} onPress={() => {
          onChangeText(title);
          setIsEdit(true);
          setTaskIndex(id);
        }} />
        <Icon name="trash" size={27} onPress={() => {
          const newTasks = [...tasks];
          setTaskIndex(id);
          newTasks.splice(id, 1);
          setTasks(newTasks);
        }} />
      </View>
    </View>
  );
  
  if (isLoaded) {
    return ( 
      <View style={styles.mainView}>
        <View style={styles.createTask}>
          <View style={{ marginLeft: 12}}>
            <TextInput
              style={styles.inputText}
              onChangeText={text => onChangeText(text)}
              value={value}
            />
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            <TouchableOpacity style={styles.createTastButton} onPress={async () => {
                const newTasks = [...tasks];
                if (isEdit) {
                  newTasks[taskIndex] = value;
                  setTasks(newTasks);
                  onChangeText('');
                  setIsEdit(false);
                } else {
                  newTasks.push(value);
                  setTasks(newTasks);
                  onChangeText('');
                }
              }}>
              <Text style={styles.buttonText}>{isEdit ? "EDITAR" : "ADD"}</Text></TouchableOpacity>
          </View>
        </View>
        <View style={styles.container}>
          <View style={{ paddingHorizontal: 8 }}>
            <Text style={styles.taskHeader}>{tasks.length == 0 ? "Não há tarefas": "Tarefas"}</Text>
          </View>
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  } else {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="purple" />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 6
  },
  title: {
    fontSize: 18,
  },
  buttonBox: {
    flexDirection: "row", 
    justifyContent: "space-around"
  },
  mainView: { 
    padding: 10, 
    flex: 2
  },
  createTask: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  inputText: { 
    height: 42, 
    width: 270, 
    borderColor: 'purple', 
    borderBottomWidth: 1 
  },
  taskHeader: { 
    fontWeight: "bold", 
    fontSize: 20, 
    marginTop: 16
  },
  createTastButton: {
    backgroundColor: "purple", 
    borderRadius: 6,
    height: 36,
  },
  buttonText: {
    padding: 8, 
    color: "white", 
    fontWeight: "bold"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});

export default App;
