import React, { useState, useEffect } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { Button, Paper, Table, TableBody, TableCell, TableContainer,
        TableHead, TableRow, Typography } from '@mui/material';
import moment from 'moment';
import Axios from 'axios';
import { TodoDialog } from './TodoDialog';
import _ from 'lodash';


export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const url = 'http://127.0.0.1:8000/todolist';

  useEffect(() => {
      fetch(url)
         .then((response) => response.json())
         .then((data) => {
            setTodos(data);
         })
         .catch((err) => {
            console.log(err.message);
         });
  }, []);

  const arrayWithoutElementAtIndex = function (arr, index) {
  return arr.filter(function(value, arrIndex) {
    return index !== arrIndex;
  });
  }

  const taskDelete = (id, e) => {
        const deletedId = _.findIndex(todos, { 'id': id });
        const newTodos = arrayWithoutElementAtIndex(todos, deletedId)
        setTodos(newTodos)

        e.preventDefault()
        Axios.delete(url+"/"+id)
        .then(res => {
            console.log("Task deleted:", res.data)
        })

 }

  return (
    <React.Fragment>
    <Typography component="h2" variant="h4" color="primary" mt={2} gutterBottom>TodoList</Typography>
    <TodoDialog buttonSize="large" buttonLabel="Create New Task" dialogTitle="Add Task" todos={todos}></TodoDialog>
    <TableContainer component={Paper} sx={{width: 'max-content', marginLeft: 'auto', marginRight: 'auto', border: '1px solid rgba(224, 224, 224, 1)', marginTop: 2}}>
      <Table sx={{tableLayout: "auto", minWidth: 1200}}>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Done</TableCell>
            <TableCell>Author IP</TableCell>
            <TableCell>Created Date</TableCell>
            <TableCell>Done Date</TableCell>
            <TableCell>Modify Task</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {todos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>{todo.title}</TableCell>
              <TableCell>{todo.done ? <DoneIcon></DoneIcon> : null}</TableCell>
              <TableCell>{todo.author_ip}</TableCell>
              <TableCell>{todo.created_date ? moment(todo.created_date).format('DD.MM.YYYY HH:mm') : null}</TableCell>
              <TableCell>{todo.done_date ? moment(todo.done_date).format('DD.MM.YYYY HH:mm') : null}</TableCell>
              <TableCell>
                <TodoDialog buttonSize="medium" buttonLabel="Edit" dialogTitle="Edit Task" todo={todo} todos={todos}></TodoDialog>
                <Button type="submit" color="error" variant="contained" onClick={e => taskDelete(todo.id, e)} sx={{ marginLeft: 2 }}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </React.Fragment>
  );
}