import React, {useState} from 'react';
import './App.css';
import TodoList from "./TodoList";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";

export type TaskType = {
    id: string;
    title: string;
    isDone: boolean;
}

export type FilterValuesType = "all" | "active" | "completed"   //ипизирование фильтра
export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    //BLL:
    const todoListId_1 = v1();
    const todoListId_2 = v1();

    const [todoLists, setTodoLists] = useState<Array<TodoListType>>([
        {id: todoListId_1, title: 'What to learn', filter: "all"},
        {id: todoListId_2, title: 'What to buy', filter: "all"},
    ])

    const [tasks, setTasks] = useState<TasksStateType>({
        [todoListId_1]: [
            {id: v1(), title: "HTML", isDone: true},
            {id: v1(), title: "CSS", isDone: true},
            {id: v1(), title: "React", isDone: false}
        ],
        [todoListId_2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "Bread", isDone: true}
        ],
    })



    function removeTask(taskID: string, todoListId: string) {
        const updatedTasks = tasks[todoListId].filter(t => t.id !== taskID)
        setTasks({
            ...tasks,
            [todoListId]: updatedTasks
        })
    }
    function addTask(title: string, todoListId: string) {
        const newTask = {
            id: v1(),
            isDone: false,
            title: title //из парепетра тайтл
        }
        const updatedTasks = [newTask, ...tasks[todoListId]]
        setTasks({
            ...tasks,
            [todoListId]: updatedTasks
        })
    }
    function changeTaskStatus(taskID: string, newIsDoneValue: boolean, todoListId: string) {
        const updatedTasks = tasks[todoListId].map(t => t.id === taskID ? {...t, isDone: newIsDoneValue} : t)
        setTasks({
            ...tasks,
            [todoListId]: updatedTasks
        })
    }
    function changeTaskTitle(taskID: string, title: string, todoListId: string) {
        const updatedTasks = tasks[todoListId].map(t => t.id === taskID ? {...t, title} : t)
        setTasks({
            ...tasks,
            [todoListId]: updatedTasks
        })
    }


    function changeTodoListTitle(title: string, todoListID: string) {
        const updatedTodoLists = todoLists.map(tl => tl.id === todoListID ? {...tl, title} : tl)
        setTodoLists(updatedTodoLists)
    }
    function changeTodoListFilter(newFilterValue: FilterValuesType, todoListId: string) {
        const updatedTodoList = todoLists.map(tl => tl.id === todoListId ? {...tl, filter: newFilterValue} : tl)
        setTodoLists(updatedTodoList)
    }
    function removeTodoList(todoListId: string) {
        const updatedTodoList = todoLists.filter(tl => tl.id !== todoListId)
        setTodoLists(updatedTodoList);
        delete tasks[todoListId]   //удалил таски из массива, тк без этой функции они удаляются только из ui
    }
    function addTodoList(title: string) {
        const newTodoListID = v1()
        const newTodoList: TodoListType = {
            id: newTodoListID, title, filter: "all"
        }
        setTodoLists([...todoLists, newTodoList])
        setTasks({...tasks, [newTodoListID]: []})
    }


    function getTasksForTodoList(todoList: TodoListType): Array<TaskType> /*типизируем что мы вернем*/ {
        switch (todoList.filter) {
            case "active":
                return tasks[todoList.id].filter(t => !t.isDone)
            case "completed":
                return tasks[todoList.id].filter(t => t.isDone)
            default:
                return tasks[todoList.id]
        }
    }
    const todoListComponents = todoLists.map((tl) => {
        return (
            <Grid item={true} key={tl.id}>
            <Paper elevation={6} style={{padding: '20px'}}>
                <TodoList
                    title={tl.title}
                    tasks={getTasksForTodoList(tl)}
                    removeTask={removeTask}
                    changeTodoListFilter={changeTodoListFilter}
                    addTask={addTask}
                    todoListFilter={tl.filter}
                    changeTaskStatus={changeTaskStatus}
                    Id={tl.id}
                    removeTodoList={removeTodoList}
                    changeTodoListTitle={changeTodoListTitle}
                    changeTaskTitle={changeTaskTitle}
                />
            </Paper>
            </Grid>)
    })

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={{justifyContent: 'space-between'}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        TodoLists
                    </Typography>
                    <Button variant={'outlined'} color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container={true} style={{padding: '20px 0px'}}>
                    <AddItemForm label={'Enter the todoList title'} addItem={addTodoList}/>
                </Grid>
                <Grid container={true} spacing={5}>
                    {todoListComponents}
                </Grid>
            </Container>
        </div>
    );
}

export default App;

