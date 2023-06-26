import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

type toDo = {
  id: string;
  descricao: string;
  status: boolean;
};

export async function GetData() {
  try {
    const jsonValue = await AsyncStorage.getItem('toDo-list');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    Alert.alert('Erro ao buscar');
  }
}

export async function SetData({descricao, status, id}: toDo) {
  const newToDo = {descricao, status, id};
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
    const updatedToDoList = todoList.filter((item: toDo) => item.id !== id);
    await AsyncStorage.setItem('toDo-list', JSON.stringify(updatedToDoList));
  } catch (e) {
    Alert.alert('Erro ao excluir a tarefa');
  }
}

export async function ToggleStatus(id: string) {
  try {
    const todoList = await GetData();
    const updatedToDoList = todoList.map((item: toDo) => {
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