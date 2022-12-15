import { Box, Button, Checkbox, Dialog, DialogTitle, DialogContent, FormControlLabel, FormGroup, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Axios from 'axios';

const initialFormValues = {
    title: '',
    done_date: null,
    done: false
}

export const TodoDialog = (props) => {
    const {buttonSize, buttonLabel, dialogTitle, data} = props
    const [openDialog, setOpenDialog] = useState(false)
    const [formValues, setFormValues] = useState(initialFormValues)
    const [editMode, setEditMode] = useState(false)

/*
    const [formErrors, setFormErrors] = useState(null)
    const error = null
*/

    const handleInputChange = e => {
        const { name, value } = e.target
        setFormValues({
            ...formValues,
            [name]: value
            })
    }
/*
    const validateForm = () => {
        let temp = {}
        temp.title = formValues.title ? "" : "This field is required"
        temp.done_date = (formValues.done_date < new Date()) ? "" : "Done date cannot be later than the current date"
        setFormErrors({
            ...temp
        })

        return Object.values(temp).every(x => x == "")
    }
*/

    const initiateForm = () => {
        if (data != null)
        {
            setFormValues(data)
        } else {
            setFormValues(initialFormValues)
        }
        setOpenDialog(true)

        console.log('editMode:', editMode)
        console.log('openDialog:', openDialog)
        console.log('data:', data)
    }

    const resetFormAndQuit = () => {
        setFormValues(initialFormValues)
        setEditMode(false)
        setOpenDialog(false)
    }

    const convertToDefEventParam = (name, value) => ({
        target: {
            name, value
        }
    })

    const url = 'http://127.0.0.1:8000/todolist'
    const handleSubmit = (e) => {
        e.preventDefault()
        if (editMode) {
            Axios.put(url+"/"+data.id+"/", {
                title: formValues.title,
                done_date: formValues.done_date,
                done: formValues.done
            })
            .then(res => {
                console.log(res.data)
            })
        } else {
            Axios.post(url, {
                title: formValues.title,
                done_date: formValues.done_date,
                done: formValues.done
            })
            .then(res => {
                console.log(res.data)
            })
        }

        resetFormAndQuit()
/*
        if (validateForm())
        window.alert('Form is valid')
        else window.alert('Form invalid')
*/
        }

    useEffect(() => {
        if (data != null)
        {
            setEditMode(true)
        }
    }, [data])


    return (
        <div>
            <Button onClick={initiateForm} type="submit" size={buttonSize} variant="contained" /*error={error}*/ sx={{ mb: 2 }}>{buttonLabel}</Button>
            <Dialog open={openDialog} onClose={() => resetFormAndQuit()} maxWidth="md">
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent sx={{ width: 500 }}>
                    <FormGroup>
                        <TextField name="title" label="Title" variant="outlined" value={formValues.title} onChange={handleInputChange} sx={{ mt:2, mb:2 }} />
                        <FormControlLabel control={<Checkbox name="done" checked={formValues.done} onChange={e => handleInputChange(convertToDefEventParam("done", e.target.checked))} />} label="Task Done" sx={{ mb:2 }} />
                        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ mb:2 }}>
                          <DateTimePicker
                            inputFormat="DD.MM.YYYY HH:mm"
                            renderInput={(props) => <TextField {...props} name="done_date" />}
                            label="Done Date"
                            value={formValues.done_date}
                            onChange={date => handleInputChange(convertToDefEventParam('done_date', date))}
                          />
                        </LocalizationProvider>
                    </FormGroup>
                    <Box sx={{ mt:4 }}>
                        <Button variant="contained" onClick={e => handleSubmit(e)}>Save Task</Button>
                        <Button variant="contained" color="error" sx={{ marginLeft: 2 }} onClick={() => resetFormAndQuit()}>Cancel</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    )
}