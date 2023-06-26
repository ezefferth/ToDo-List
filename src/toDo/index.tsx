import {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import uuid from 'react-native-uuid';

import {GetData, RemoveAll, RemoveItem, SetData, ToggleStatus} from '../db';
import {ScrollView} from 'react-native';

type toDo = {
  id: string;
  descricao: string;
  status: boolean;
};

export default function ToDoList(): JSX.Element {
  const [toDoList, setToDoList] = useState<Array<toDo>>([]);

  const [descricao, setDescricao] = useState<string>('');

  const handleSetToDo = (descricao: string) => {
    const id = uuid.v4().toString();
    const status = false;
    SetData({descricao, status, id})
      .then(() => {
        fetchData();
        setDescricao('');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fetchData = async () => {
    const result = await GetData();
    setToDoList(result);
  };

  useEffect(() => {
    fetchData();
    //console.log(toDoList);
  }, [toDoList]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="Digite aqui"
          onChangeText={e => setDescricao(e)}
          value={descricao}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSetToDo(descricao)}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {toDoList?.map(item => {
          const colorStatus = item.status ? '#0ead69' : '#ff5e5b'
          return (
            <View style={[styles.descricao, {borderColor: colorStatus}]} key={item.id}>
              <TouchableOpacity onPress={() => ToggleStatus(item.id)}>
                <Text style={styles.txtToDoItem}>{item.descricao}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnToDoItem} onPress={() => RemoveItem(item.id)}>
                <Text style={{fontWeight: 'bold', color: '#fff'}}>Excluir</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.viewRemoveAll}>
        <TouchableOpacity style={styles.buttonRemoveAll} onPress={RemoveAll}>
          <Text style={styles.txtRemoveAll}>Remover Todos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, //pega toda a tela
    alignItems: 'center', //centraliza os elementos do container
    backgroundColor: '#353535',
  },
  title: {
    marginTop: 30,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputView: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#284B63',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    marginBottom: 80, // Altura do botão de exclusão
  },
  descricao: {
    marginHorizontal: 20,
    borderLeftWidth: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    height: 40,
    alignItems: 'center',
  },
  txtToDoItem: {
    paddingHorizontal: 10,
    fontSize: 18,
    color: '#fff',
  },
  btnToDoItem: {
    paddingHorizontal: 10,
    backgroundColor: '#a4161a',
    borderRadius: 10,
    height: 30,
    justifyContent: 'center',
  },
  viewRemoveAll: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 20,
  },
  buttonRemoveAll: {
    backgroundColor: '#85182a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
    width: 150,
  },
  txtRemoveAll: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
