import { Box, Button, Card, CardActions, CardContent, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, makeStyles, MenuItem, Select, Slide, TextareaAutosize, TextField, Typography } from '@material-ui/core';
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { TransitionProps } from '@material-ui/core/transitions/transition';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addExercises: {
    marginTop: 30
  },
  grid: {
    marginTop: 40,
    marginBottom: 40
  },
  typography: {
    marginBottom: 0
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '12px',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15
  },
  levelSelect: {
    width: 250,
    marginLeft: 15
  }
});

interface ExerciseItem {
  name: string;
  text: string;
}

interface LessonItem {
  number: number;
  errorsAllowed: number;
  keyPressTime: number;
  keyboardArea: number;
}

const MainAdminPanel: React.FC<any> = () => {
  const classes = useStyles();
  const [exercises, setExercises] = useState([]);
  const [text, setText] = useState('');
  const [open, setOpen] = React.useState(false);
  const [selectedLevel, setSelectedLevel] = useState<LessonItem | string>('');
  const [lessonsList, setLessonsList] = useState<LessonItem[]>([]);
  const history = useHistory();

  const handleClickOpen = (text: string) => {
    setText(text);
    setOpen(true);
  };

  const getLessons = (level: number) => {
    setExercises([]);
    fetch(`https://powerful-fjord-90262.herokuapp.com/api/allowed_exercises?level=${level}`)
      .then((resp) => resp.json())
      .then((json) => {
        setExercises(json);
      })
  }

  const getAllLessons = async () => {
    const response = await fetch('https://powerful-fjord-90262.herokuapp.com/api/exercise/list');
    const json = await response.json();
    setExercises(json);
  }

  const getAllLevels = async () => {
    return await fetch('https://powerful-fjord-90262.herokuapp.com/api/level/list')
      .then((resp) => resp.json())
      .then((json) => {
        setLessonsList([...json]);
      })
  }

  const handleLevelSelect = (e: any) => {
    if (e.target.value === '') {
      setSelectedLevel(e.target.value);
      setExercises([]);
      getAllLessons();
      return;
    }

    const lesson = lessonsList.find(({ number }) => number === e.target.value);
    if (!lesson) {
      return;
    }

    setSelectedLevel(lesson);
    setExercises([]);
    getLessons(lesson.number);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeExercisesClick = (id: string) => {
    history.push(`lessons/${id}`, id);
  }

  useEffect(() => {
    getAllLevels().then(() => {
      getAllLessons();
    });
  }, []);

  const handleClickAddLesson = () => {
    history.push('lessons');
  }

  return (
    <Grid className={classes.grid}>
      <Grid container alignItems="flex-end">
        <Button variant="contained" color="primary" style={{ marginTop: 10 }} onClick={handleClickAddLesson}>Добавить упражнение</Button>
        <Select
          displayEmpty
          className={classes.levelSelect}
          value={(selectedLevel as any)?.number || selectedLevel}
          onChange={handleLevelSelect}
        >
            <MenuItem value="">
                Не Выбрано
            </MenuItem>
          {
              lessonsList.map(({ number }) => (
                  <MenuItem key={number} value={number}>Уровень {number}</MenuItem>
              ))
          }
              </Select>
      </Grid>
      <h2>Список доступных упражнений</h2>
      {exercises.map((exercise: any) => (
        <div key={performance.now()} className={classes.cardContainer}>
          <div style={{ flex: 1 }}>
            <Card raised key={exercise.id} className={classes.card}>
              <CardContent>
                <Typography color="textSecondary">
                  Название: {exercise.name}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div style={{ flex: 0 }}>
            <Button variant="outlined" color="primary" onClick={() => handleChangeExercisesClick(exercise._id)}>
              Изменить
            </Button>
          </div>
        </div>
      ))}
      <Grid>
        <Dialog
            open={open}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {text}
              </DialogContentText>
            </DialogContent>
          </Dialog>
      </Grid>
    </Grid>
  )
}

export default MainAdminPanel;
