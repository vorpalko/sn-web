/* eslint-disable no-unreachable */
/* eslint-disable prefer-promise-reject-errors */
import { Box, Button, Grid, InputLabel, makeStyles, MenuItem, Select, TextareaAutosize, TextField } from "@material-ui/core";
import { AssignmentReturnOutlined } from "@material-ui/icons";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles({
  boxContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: 'start'
  },
  textField: {
    width: "100%"
  },
  choiseZone: {
    marginTop: 10
  }
})

const AdminLevelEdit: React.FC<any> = () => {
  const location = useLocation();
  const state = location.state as any;
  const styles = useStyles();
  const [handZone, setHandZone] = useState(1);
  const [countErrors, setCountErrors] = useState("");
  const [touchTime, setTouchTime] = useState("");
  const [error, setError] = useState([""]);

  const handleLevelSubmit = (e: any) => {
    e.preventDefault();

    if (isNaN(parseFloat(touchTime))) {
      setError(["Некорректный ввод"])
      return;
    }

    if (parseFloat(touchTime) < 0.5 || parseFloat(touchTime) > 3) {
      setError(["Некоректный диапазон"])
    }

    if (isNaN(parseInt(countErrors))) {
      setError(["Некорректный ввод"])
      return;
    }

    if (parseInt(countErrors) < 1 || parseInt(countErrors) > 10) {
      setError(["Некоректный диапазон"])
      return;
    }

    setError([""])

    const payload = JSON.stringify({
      errorsAllowed: countErrors,
      keyPressTime: touchTime,
      keyboardArea: handZone
    })

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    };

    fetch(`https://powerful-fjord-90262.herokuapp.com/api/level/${state.levelId}`, requestOptions)
      .then(response => response.json())
      .catch(data => console.log(data));

    resetForm();
  }

  const handleHandZoneSelect = (e: any) => {
    setHandZone(e.target.value);
  }

  const resetForm = () => {
    setTouchTime("");
    setCountErrors("");
    alert("Успешно сохранено!");
  }

  return (
      <form autoComplete="off" onSubmit={handleLevelSubmit}>
        <Box className={styles.boxContainer}>
        <h1>Редактирование уровня { (location.state as any).levelNum }</h1>
            <Grid container direction="column" alignItems="stretch">
                <Grid item xs={12}>
                    <TextField className={styles.textField} onChange={(e) => setCountErrors(e.target.value)} required variant="standard" name="errorCount" label="Количество допустимых ошибок"/>
                </Grid>
                <Grid item>
                    <TextField className={styles.textField} onChange={(e) => setTouchTime(e.target.value)} required variant="standard" name="touchTime" label="Время нажатия на кнопку"/>
                </Grid>
                <Grid className={styles.choiseZone}>
                  <InputLabel id="demo-simple-select-label">Выбор зоны ввода</InputLabel>
                  <Select
                      id="demo-simple-select"
                      value={handZone}
                      onChange={handleHandZoneSelect}
                  >
                      <MenuItem value={1}>Зона 1</MenuItem>
                      <MenuItem value={2}>Зона 2</MenuItem>
                      <MenuItem value={3}>Зона 3</MenuItem>
                      <MenuItem value={4}>Зона 4</MenuItem>
                  </Select>
                </Grid>
                <Grid item style={{ marginLeft: "auto", alignSelf: 'end' }}>
                    <Button type="submit" variant="contained" color="secondary">Сохранить</Button>
                </Grid>
                <Grid>
                    {error.map((error: any) => (
                      error !== undefined
                        ? <div style={{ color: "red" }} key={error.toString()}>{error}</div>
                        : <div></div>
                    ))}
                </Grid>
            </Grid>
        </Box>
    </form>
  )
}

export default AdminLevelEdit;