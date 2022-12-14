import { Box, Button, Checkbox, Dialog, DialogTitle, DialogContent, FormControlLabel, FormGroup, TextField } from '@mui/material';
import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const initialFormValues = {
    title: '',
    done_date: new Date(),
    done: false
}

export const TodoDialog = (props) => {
    const [open, setOpenDialog] = useState(false)
    const [formValues, setFormValues] = useState(initialFormValues)
    const [datetime, setDatetime] = React.useState(null)

    const handleInputChange = e => {
        const { name, value } = e.target
        setFormValues({
            ...formValues,
            [name]: value
            })
    }

    const resetFormAndQuit = () => {
        setFormValues(initialFormValues)
        setOpenDialog(false)
    }

    const convertToDefEventParam = (name, value) => ({
        target: {
            name, value
        }
    })

    return (
        <div>
            <Button onClick={() => setOpenDialog(true)} type="submit" size={props.buttonSize} variant="contained" sx={{ mb:4 }}>{props.buttonLabel}</Button>
            <Dialog open={open} onClose={() => resetFormAndQuit()} maxWidth="md">
                <DialogTitle>{props.dialogTitle}</DialogTitle>
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
                            onChange={handleInputChange}
                          />
                        </LocalizationProvider>
                    </FormGroup>
                    <Box sx={{ mt:4 }}>
                        <Button variant="contained" onClick={() => setOpenDialog(false)}>Save Task</Button>
                        <Button variant="contained" color="error" sx={{ marginLeft: 2 }} onClick={() => resetFormAndQuit()}>Cancel</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    )
}