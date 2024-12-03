import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles.css";

import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  useScrollTrigger,
  Box,
  Container,
  Fab,
  Fade,
  Button,
  Checkbox,
  createTheme,
  Dialog,
  TextField,
  ThemeProvider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

import {
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Menu as MenuIcon,
  AddCircle as AddCircleIcon,
  DoDisturb as DoDisturbIcon,
} from "@mui/icons-material";

import { blue, red, grey } from "@mui/material/colors";

import { useImmer } from "use-immer";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { SnackbarProvider, useSnackbar } from "notistack";

import uuid from "react-uuid";
import dayjs from "dayjs";

const customTheme = createTheme({
  palette: {
    primary: { main: blue[700] },
    secondary: { main: blue[600] },
    error: { main: red[500] },
    text: {
      primary: grey[700],
      secondary: grey[800],
      disabled: grey[800],
      hint: grey[800],
    },
  },
});

const createTask = (id, title, desc, dueDate, priorityLevel, completed) => ({
  id,
  title,
  desc,
  dueDate,
  priorityLevel,
  completed,
});

const initialTasks = [
  createTask(
    uuid(),
    "Task01",
    "Description01",
    dayjs().format("MM/DD/YY"),
    "low",
    false
  ),
];

function ScrollTop(props) {
  const { children, window } = props;
  const scrollTrigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleScrollTop = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#scroll-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({ block: "center" });
    }
  };

  return (
    <Fade in={scrollTrigger}>
      <Box
        onClick={handleScrollTop}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

function TaskDialog(props) {
  const { task, onClose, onUpdate, onAdd, open, isNew, existingTitles } = props;
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.desc);
  const [dueDate, setDueDate] = useState(dayjs(task.dueDate));
  const [priorityLevel, setPriorityLevel] = useState(task.priorityLevel);

  const [validationErrors, setValidationErrors] = useState({
    title: "",
    desc: "",
    dueDate: "",
    priorityLevel: "",
  });

  useEffect(() => {
    setTitle(task.title);
    setDesc(task.desc);
    setDueDate(dayjs(task.dueDate));
    setPriorityLevel(task.priorityLevel);
    setValidationErrors({
      title: "",
      desc: "",
      dueDate: "",
      priorityLevel: "",
    });
  }, [task]);

  const validateInputs = () => {
    let isValid = true;
    const errors = {
      title: "",
      desc: "",
      dueDate: "",
      priorityLevel: "",
    };

    if (isNew && (!title || existingTitles.includes(title))) {
      errors.title = !title ? "Title is required!" : "Title must be unique!";
      isValid = false;
    }
    if (!desc) {
      errors.desc = "Description is required!";
      isValid = false;
    }
    if (!dueDate) {
      errors.dueDate = "Deadline is required!";
      isValid = false;
    }
    if (!priorityLevel) {
      errors.priorityLevel = "Priority is required!";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSave = () => {
    if (validateInputs()) {
      const newTask = createTask(
        task.id,
        title,
        desc,
        dueDate.format("MM/DD/YY"),
        priorityLevel,
        task.completed
      );
      isNew
        ? onAdd(newTask)
        : onUpdate(task.id, desc, dueDate.format("MM/DD/YY"), priorityLevel);
      onClose();
    }
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <Toolbar
        sx={{
          backgroundColor: blue[800],
          color: "white",
          display: "flex",
          alignItems: "center",
        }}
      >
        {isNew ? <AddCircleIcon /> : <EditIcon />}
        <Typography variant="h6" component="div" sx={{ ml: 1 }}>
          {isNew ? "Add Task" : "Edit Task"}
        </Typography>
      </Toolbar>
      <Container sx={{ p: 4 }}>
        {isNew && (
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!validationErrors.title}
            helperText={validationErrors.title}
            fullWidth
            margin="normal"
          />
        )}
        <TextField
          label="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          error={!!validationErrors.desc}
          helperText={validationErrors.desc}
          fullWidth
          margin="normal"
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Deadline"
            value={dueDate}
            onChange={setDueDate}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!validationErrors.dueDate}
                helperText={validationErrors.dueDate}
                fullWidth
                margin="normal"
              />
            )}
          />
        </LocalizationProvider>
        <FormControl
          component="fieldset"
          margin="normal"
          error={!!validationErrors.priorityLevel}
          fullWidth
        >
          <FormLabel component="legend">Priority</FormLabel>
          <RadioGroup
            row
            value={priorityLevel}
            onChange={(e) => setPriorityLevel(e.target.value)}
          >
            <FormControlLabel value="low" control={<Radio />} label="Low" />
            <FormControlLabel value="med" control={<Radio />} label="Medium" />
            <FormControlLabel value="high" control={<Radio />} label="High" />
          </RadioGroup>
          {validationErrors.priorityLevel && (
            <FormHelperText>{validationErrors.priorityLevel}</FormHelperText>
          )}
        </FormControl>
      </Container>
      <Container sx={{ display: "flex", justifyContent: "flex-end", pb: 2 }}>
        <Button
          onClick={handleSave}
          variant="contained"
          color="secondary"
          startIcon={isNew ? <AddCircleIcon /> : <EditIcon />}
          sx={{ mr: 2 }}
        >
          {isNew ? "Add" : "Edit"}
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          color="error"
          startIcon={<DoDisturbIcon />}
        >
          Cancel
        </Button>
      </Container>
    </Dialog>
  );
}

TaskDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  existingTitles: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  isNew: PropTypes.bool.isRequired,
};

export default function MainComponent(props) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [taskList, updateTaskList] = useImmer(initialTasks);
  const [currentTask, setCurrentTask] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  const openEditDialog = (task) => {
    setCurrentTask(task);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const toggleTaskCompletion = (id) => {
    updateTaskList((draft) => {
      const task = draft.find((item) => item.id === id);
      if (task) task.completed = !task.completed;
    });
  };

  const deleteTask = (id) => {
    updateTaskList((draft) => draft.filter((item) => item.id !== id));
    enqueueSnackbar("Task was deleted successfully!", {
      variant: "success",
      autoHideDuration: 5000,
    });
  };

  const addTask = (newTask) => {
    updateTaskList((draft) => {
      draft.push(newTask);
    });
    enqueueSnackbar("Task was added successfully!", {
      variant: "success",
      autoHideDuration: 5000,
    });
  };

  const updateTask = (id, desc, dueDate, priorityLevel) => {
    updateTaskList((draft) => {
      const task = draft.find((item) => item.id === id);
      if (task) {
        task.desc = desc;
        task.dueDate = dueDate;
        task.priorityLevel = priorityLevel;
      }
    });
    enqueueSnackbar("Task was updated successfully!", {
      variant: "success",
      autoHideDuration: 5000,
    });
  };

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Container
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MenuIcon />
            <Typography variant="h6" component="div">
              FRAMEWORKS
            </Typography>
          </Container>
          <Button
            onClick={openAddDialog}
            variant="contained"
            startIcon={<AddCircleIcon />}
            color="secondary"
          >
            Add
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar id="scroll-to-top-anchor" />
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="task table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Deadline</TableCell>
              <TableCell align="center">Priority</TableCell>
              <TableCell align="center">Completed</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {taskList.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.title}</TableCell>
                <TableCell align="center">{row.desc}</TableCell>
                <TableCell align="center">{row.dueDate}</TableCell>
                <TableCell align="center">{row.priorityLevel}</TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={row.completed}
                    onChange={() => toggleTaskCompletion(row.id)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Container
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {!row.completed && (
                      <Button
                        onClick={() => openEditDialog(row)}
                        variant="contained"
                        startIcon={<EditIcon />}
                        color="secondary"
                        sx={{ mb: 1 }}
                      >
                        Update
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteTask(row.id)}
                      variant="contained"
                      startIcon={<CancelIcon />}
                      color="error"
                    >
                      Delete
                    </Button>
                  </Container>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ScrollTop {...props}>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
      {isAddDialogOpen && (
        <TaskDialog
          existingTitles={taskList.map((item) => item.title)}
          open={isAddDialogOpen}
          task={createTask(
            uuid(),
            "",
            "",
            dayjs().format("MM/DD/YY"),
            "low",
            false
          )}
          onClose={closeAddDialog}
          onAdd={addTask}
          onUpdate={() => {}}
          isNew={true}
        />
      )}
      {isEditDialogOpen && currentTask && (
        <TaskDialog
          existingTitles={taskList.map((item) => item.title)}
          open={isEditDialogOpen}
          task={currentTask}
          onClose={closeEditDialog}
          onAdd={() => {}}
          onUpdate={updateTask}
          isNew={false}
        />
      )}
    </ThemeProvider>
  );
}
