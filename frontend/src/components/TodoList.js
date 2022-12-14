import React, { useState, useEffect } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { Button, Paper, Table, TableBody, TableCell, TableContainer,
        TableHead, TableRow, Typography } from '@mui/material';
import moment from 'moment';
import { TodoDialog } from './TodoDialog'

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
      fetch('http://127.0.0.1:8000/todolist')
         .then((response) => response.json())
         .then((data) => {
            setTodos(data);
         })
         .catch((err) => {
            console.log(err.message);
         });
  }, []);

  return (
    <React.Fragment>
    <Typography component="h2" variant="h4" color="primary" mt={2} gutterBottom>TodoList</Typography>
    <TodoDialog buttonSize="large" buttonLabel="Create New Task" dialogTitle="Add Task"></TodoDialog>
    <TableContainer component={Paper} sx={{width: 'max-content', marginLeft: 'auto', marginRight: 'auto', border: '1px solid rgba(224, 224, 224, 1)'}}>
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
                <Button type="submit" variant="contained" sx={{ mr:2 }}>Edit</Button>
                <Button type="submit" color="error" variant="contained">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </React.Fragment>
  );
}