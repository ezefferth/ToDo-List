import {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
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
import {Alert} from 'react-native';

export type ToDo = {
  id: string;
  descricao: string;
  status: boolean;
  date: number;
};

export default function ToDoList(): JSX.Element {
  const [toDoList, setToDoList] = useState<Array<ToDo>>([]);

  const [descricao, setDescricao] = useState<string>('');

  const [sorted, setSorted] = useState<'data' | 'alfa'>('alfa');

  const handleSetToDo = (descricao: string) => {
    const date = new Date().getTime();
    const id = uuid.v4().toString();
    const status = false;
    /* const date = new Date().getDate().toString(); */
    if (descricao) {
      SetData({descricao, status, id, date})
        .then(() => {
          fetchData();
          setDescricao('');
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      Alert.alert('Insira alguma coisa para inserir');
    }
  };

  const handleRemoveAll = async () => {
    await RemoveAll();
    setToDoList([]);
  };

  const fetchData = async () => {
    const result: Array<ToDo> = await GetData();
    const sortedList = [...result].sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      }
      if (a.date > b.date) {
        return -1;
      }
      return 0;
    });
    setToDoList(sortedList);
  };
  const handleSort = () => {
    console.log(sorted);
    if (sorted === 'data') {
      const sortedList = [...toDoList].sort((a, b) => {
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1;
        }
        return 0;
      });
      setToDoList(sortedList);
    } else if (sorted === 'alfa') {
      const sortedList = [...toDoList].sort((a, b) => {
        if (a.descricao < b.descricao) {
          return -1;
        }
        if (a.descricao > b.descricao) {
          return 1;
        }
        return 0;
      });
      setToDoList(sortedList);
    }
  };
  useEffect(() => {
    handleSort();
  }, [sorted]);

  useEffect(() => {
    fetchData();
    //console.log(toDoList);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do</Text>

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
          <Text style={styles.buttonText}>Inserir</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        <Picker
          style={styles.picker}
          dropdownIconColor="#fff"
          selectedValue={sorted}
          onValueChange={(itemValue, itemIndex) =>
            setSorted(itemValue)
          }>
          <Picker.Item label="Alfabética" value="alfa" />
          <Picker.Item label="Data" value="data" />
        </Picker>
        {toDoList?.map(item => {
          const colorStatus = item.status ? '#0ead69' : '#ff5e5b';
          return (
            <View
              style={[styles.descricao, {borderColor: colorStatus}]}
              key={item.id}>
              <TouchableOpacity onPress={() => ToggleStatus(item.id)}>
                <Text style={styles.txtToDoItem}>{item.descricao}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.btnToDoItem,
                  item.status ? {opacity: 1} : {opacity: 0.5},
                ]}
                disabled={!item.status}
                onPress={() => RemoveItem(item.id)}>
                <Text style={{fontWeight: 'bold', color: '#fff'}}>X</Text>
              </TouchableOpacity>
            </View>
          );
        })}
        {toDoList?.length >= 10 && (
          <TouchableOpacity
            style={styles.buttonRemoveAll}
            onPress={() => handleRemoveAll()}>
            <Text style={styles.txtRemoveAll}>Remover Todos</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
    color: '#333',
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
    borderLeftWidth: 6,
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
    //marginTop: 20,
    width: 150,
  },
  txtRemoveAll: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  picker: {
    marginHorizontal: 10,
    color: '#fff',
  },
});
