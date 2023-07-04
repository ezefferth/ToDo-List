import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import { ToDo } from '../toDo';



export async function GetData() {
  try {
    const jsonValue = await AsyncStorage.getItem('toDo-list');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    Alert.alert('Erro ao buscar');
  }
}

export async function SetData({descricao, status, id, date}: ToDo) {
  const newToDo = {descricao, status, id, date};
  try {
    let todoList = await GetData();
    if (todoList === null) {
      todoList = []; // Define um valor padrão como array vazio
    }
    const updatedToDo = [...todoList, newToDo];
    const jsonValue = JSON.stringify(updatedToDo);
    await AsyncStorage.setItem('toDo-list', jsonValue);
    
  } catch (e: any) {
    Alert.alert('Erro ao cadastrar a tarefa', e.message);
  }
}

export async function RemoveAll() {
  try {
    await AsyncStorage.removeItem('toDo-list');
  } catch (e) {
    Alert.alert('Erro ao remover todos os todos');
  }
}

export async function RemoveItem(id: string) {
  try {
    const todoList = await GetData();
    const updatedToDoList = todoList.filter((item: ToDo) => item.id !== id);
    await AsyncStorage.setItem('toDo-list', JSON.stringify(updatedToDoList));
  } catch (e) {
    Alert.alert('Erro ao excluir a tarefa');
  }
}

export async function ToggleStatus(id: string) {
  try {
    const todoList = await GetData();
    const updatedToDoList = todoList.map((item: ToDo) => {
      if (item.id === id) {
        return {
          ...item,
          status: !item.status,
        };
      }
      return item;
    });
    await AsyncStorage.setItem('toDo-list', JSON.stringify(updatedToDoList));
  } catch (e) {
    Alert.alert('Erro ao alterar o status da tarefa');
  }
}