import { Box, Button, Card, CardActions, CardContent, Grid, makeStyles, TextareaAutosize, TextField, Typography } from "@material-ui/core";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Switch, Route, BrowserRouter, Redirect, useHistory } from 'react-router-dom'

const useStyles = makeStyles({
  card: {
    marginTop: 10,
    background: "#F0F8FF"
  },
  addExercises: {
    marginTop: 30
  },
  grid: {
    marginTop: 40,
    marginBottom: 40
  }
});

const LevelPanel: React.FC<any> = () => {
  const classes = useStyles();
  const history = useHistory();
  const [levels, setLevels] = useState([]);

  const handleChangeLevelClick = (levelId: string, levelNum: number, errors: number, time: number) => {
    history.push(`levels/${levelId}`, { levelId, levelNum, errors, time });
  }

  React.useEffect(function effectFunction() {
    async function fetchLevels() {
      const response = await fetch('https://powerful-fjord-90262.herokuapp.com/api/level/list');
      const json = await response.json();
      setLevels(json);
    }
    fetchLevels();
  }, []);

  return (
    <Grid className={classes.grid}>
      <h2>Список доступных уровней</h2>
      {levels.map((level: any) => (
        <Card key={level.id} className={classes.card}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Уровень: {level.number}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Допустимое количество ошибок: {level.errorsAllowed}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Время нажатия клавиши: {level.keyPressTime / 1000} секунд(ы)
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Зона клавиатуры: {level.keyboardArea}
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="outlined" color="primary" onClick={() => handleChangeLevelClick(level._id, level.number, level.errorsAllowed, level.keyPressTime)}>
              Изменить
            </Button>
          </CardActions>
        </Card>
      ))}
    </Grid>
  )
}

export default LevelPanel;