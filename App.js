import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Review React Native lecture notes',
  },
  {
    id: '2',
    title: 'Complete weekly discussion',
  },
  {
    id: '3',
    title: 'Submit mobile app assignment',
  },
];

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [newTask, setNewTask] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setNewTask('');
    setModalVisible(true);
  };

  const closeModal = () => {
    setNewTask('');
    setModalVisible(false);
  };

  const addTask = () => {
    const cleanedTask = newTask.trim();

    if (!cleanedTask) {
      Alert.alert('Task required', 'Enter a task before adding it.');
      return;
    }

    const task = {
      id: `${Date.now()}-${Math.random()}`,
      title: cleanedTask,
    };

    setTasks((currentTasks) => [task, ...currentTasks]);
    setNewTask('');
    setModalVisible(false);
  };

  const deleteTask = (taskToDelete) => {
    Alert.alert(
      'Delete task?',
      `"${taskToDelete.title}" will be removed from your list.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTasks((currentTasks) =>
              currentTasks.filter((task) => task.id !== taskToDelete.id)
            );
          },
        },
      ]
    );
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskMarker} />

      <Text style={styles.taskText}>{item.title}</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Delete ${item.title}`}
        onPress={() => deleteTask(item)}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="light" backgroundColor="#841617" />

        <View style={styles.header}>
          <Image
            source={require('./assets/ou-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.headerText}>
            <Text style={styles.universityName}>
              UNIVERSITY OF OKLAHOMA
            </Text>

            <Text style={styles.title}>Student To-Do List</Text>

            <Text style={styles.taskCount}>
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} remaining
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <FlatList
            data={tasks}
            renderItem={renderTask}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              tasks.length === 0 && styles.emptyListContent,
            ]}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>Your list is empty</Text>

                <Text style={styles.emptyText}>
                  Add a task to begin organizing your work.
                </Text>
              </View>
            }
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add a new task"
            onPress={openModal}
            style={({ pressed }) => [
              styles.addTaskButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.addTaskButtonText}>Add Task</Text>
          </Pressable>
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={closeModal}
        >
          <KeyboardAvoidingView
            style={styles.modalBackdrop}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add a New Task</Text>

              <Text style={styles.inputLabel}>Task description</Text>

              <TextInput
                value={newTask}
                onChangeText={setNewTask}
                placeholder="Example: Study for Friday's quiz"
                placeholderTextColor="#777777"
                style={styles.input}
                autoFocus
                maxLength={80}
                returnKeyType="done"
                onSubmitEditing={addTask}
              />

              <Text style={styles.characterCount}>
                {newTask.length}/80 characters
              </Text>

              <View style={styles.modalButtons}>
                <Pressable
                  accessibilityRole="button"
                  onPress={closeModal}
                  style={({ pressed }) => [
                    styles.cancelButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={addTask}
                  style={({ pressed }) => [
                    styles.confirmButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.confirmButtonText}>Add Task</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#841617',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 22,
  },

  logo: {
    width: 82,
    height: 82,
    borderRadius: 16,
    marginRight: 16,
  },

  headerText: {
    flex: 1,
  },

  universityName: {
    color: '#F7F2E8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 4,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '800',
    marginBottom: 5,
  },

  taskCount: {
    color: '#F3DADA',
    fontSize: 14,
  },

  content: {
    flex: 1,
    backgroundColor: '#F7F2E8',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },

  listContent: {
    paddingBottom: 24,
  },

  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#E5D9D1',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  taskMarker: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#841617',
    marginRight: 13,
  },

  taskText: {
    flex: 1,
    color: '#252525',
    fontSize: 16,
    lineHeight: 22,
    marginRight: 10,
  },

  deleteButton: {
    backgroundColor: '#F5E6E6',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },

  deleteButtonText: {
    color: '#841617',
    fontSize: 13,
    fontWeight: '700',
  },

  addTaskButton: {
    backgroundColor: '#841617',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    elevation: 3,
  },

  addTaskButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  buttonPressed: {
    opacity: 0.7,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyTitle: {
    color: '#3A2727',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },

  emptyText: {
    color: '#6B6060',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.58)',
    paddingHorizontal: 22,
  },

  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    elevation: 10,
  },

  modalTitle: {
    color: '#841617',
    fontSize: 23,
    fontWeight: '800',
    marginBottom: 20,
  },

  inputLabel: {
    color: '#3A2727',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1.5,
    borderColor: '#B9A6A6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: '#222222',
    backgroundColor: '#FCFAF7',
    fontSize: 16,
  },

  characterCount: {
    color: '#746868',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 7,
    marginBottom: 22,
  },

  modalButtons: {
    flexDirection: 'row',
  },

  cancelButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#EAE4DE',
    borderRadius: 12,
    paddingVertical: 14,
    marginRight: 8,
  },

  cancelButtonText: {
    color: '#3A2727',
    fontSize: 15,
    fontWeight: '700',
  },

  confirmButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#841617',
    borderRadius: 12,
    paddingVertical: 14,
    marginLeft: 8,
  },

  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});