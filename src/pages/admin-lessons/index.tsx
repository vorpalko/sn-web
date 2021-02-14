/* eslint-disable no-unreachable */
/* eslint-disable prefer-promise-reject-errors */
import { Box, Button, Grid, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextareaAutosize, TextField } from "@material-ui/core";
import { FormatListNumberedRtl } from "@material-ui/icons";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useHistory, useLocation } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  boxContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: 'start'
  },
  table: {
    minWidth: 650
  }
})

function isValid(str: string): boolean {
  const re = /[~`!#$%&*+=\-\]\\';,/{}|\\":<>]/g;
  return !!re.exec(str);
}

function isEnglishSymbols(str: string): boolean {
  const re = /[a-zA-Z]/g;
  return !!re.exec(str);
}

const rows = [
  {
    zon1: "'ывап ролд'",
    zon2: "'цукенгшщз ывап ролдж чсми тьбю' (Верхний регистр)",
    zon3: "Зона 2 и '1234567890', а также '. , ! ? ( )'",
    zon4: "Вся клавиатура"
  }
];

const AdminLessonsPage: React.FC<any> = () => {
  const styles = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [fileSelected, setFileSelected] = useState(false);
  const [errors, setErrors] = useState([""]);

  const editLevelName = () => {
    if (location.state) {
      fetch(`https://powerful-fjord-90262.herokuapp.com/api/exercise/${location.state}`)
        .then(response => response.json())
        .then(result => {
          setLessonName(result.name);
        })
      return;
    }
    return "";
  }

  const editLevelText = () => {
    if (location.state) {
      fetch(`https://powerful-fjord-90262.herokuapp.com/api/exercise/${location.state}`)
        .then(response => response.json())
        .then(result => {
          setLessonText(result.text);
        })
      return;
    }
    return "";
  }

  const [lessonName, setLessonName] = useState(editLevelName);
  const [lessonText, setLessonText] = useState(editLevelText);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const readFile = (file: File): Promise<any> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result);
      } else {
        reject("Пустой файл");
      }
    }
    reader.readAsText(file);
  });

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.target.files || [])];
    if (files && files.length > 0) {
      if (!files[0].name.includes(".txt")) {
        alert("Неверный формат файла, разрешено использовать файлы только с .txt расширением")
        return;
      }
      const file = await readFile(files[0])
      setSelectedFile(file);

      if ((file as string).length < 10 || (file as string).length > 255) {
        setErrors(["Недопустимая длина текста"])
        return;
      }
      // if (isValid((file as string))) {
      //   setErrors(["Некорректные символы в тексте"])
      //   return;
      // }
      if (isEnglishSymbols(file as string)) {
        setErrors(["Присутствуют символы английского алфавита"])
        return;
      }
      setLessonText(file);
    }
    setFileSelected(true)
  }

  const handleLessonSubmit = async (e: any) => {
    e.preventDefault();

    const lessonsResp = await fetch("https://powerful-fjord-90262.herokuapp.com/api/exercise/list");
    const lessonsProm = await lessonsResp.json();
    const lessons = lessonsProm.map((x: any) => x.name);

    if ((lessonName as string).length < 1 || (lessonName as string).length > 30) {
      setErrors(["Недопустимая длина названия"])
      return;
    }

    if ((lessonText as string).length < 10 || (lessonText as string).length > 255) {
      setErrors(["Недопустимая длина текста"])
      return;
    }

    if (isValid((lessonName as string))) {
      setErrors(["Некорректное название для упржанений"])
      return;
    }

    if (isEnglishSymbols(lessonText as string) || isEnglishSymbols(lessonName as string)) {
      setErrors(["Присутствуют символы английского алфавита"])
      return;
    }

    // if (isValid((lessonText as string))) {
    //   setErrors(["Некорректные символы в тексте"])
    //   return;
    // }

    setErrors([""]);

    if (location.state) {
      const lessonResp = await fetch(`https://powerful-fjord-90262.herokuapp.com/api/exercise/${location.state}`);
      const lessonProm = await lessonResp.json();

      if (lessonProm.name === lessonName) {
        const payload = JSON.stringify({
          file: selectedFile,
          name: lessonName,
          text: lessonText
        })

        const requestOptions = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: payload
        };

        fetch(`https://powerful-fjord-90262.herokuapp.com/api/exercise/${location.state}`, requestOptions)
          .then(response => response.json())
          .catch(data => console.log(data));
        resetForm();
        return;
      } else {
        if (!lessons.includes(lessonName)) {
          const payload = JSON.stringify({
            file: selectedFile,
            name: lessonName,
            text: lessonText
          })

          const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: payload
          };

          fetch(`https://powerful-fjord-90262.herokuapp.com/api/exercise/${location.state}`, requestOptions)
            .then(response => response.json())
            .catch(data => console.log(data));
          resetForm();
          return;
        } else {
          alert("Упражнение с таким названием уже существует, используйте другое название");
          return;
        }
        alert("Упражнение с таким названием уже существует, используйте другое название");
        return;
      }
    }

    if (!lessons.includes(lessonName)) {
      const payload = JSON.stringify({
        file: selectedFile,
        name: lessonName,
        text: lessonText
      })

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      };

      fetch('https://powerful-fjord-90262.herokuapp.com/api/exercise/create', requestOptions)
        .then(response => response.json())
        .catch(data => console.log(data));

      resetForm();
    } else {
      alert("Упражнение с таким названием уже существует, используйте другое название");
    }
  }

  const generateText = () => {
    fetch('https://powerful-fjord-90262.herokuapp.com/api/generate_text')
      .then(response => response.json())
      .then(result => setLessonText(result))
      .catch(data => console.log(data));
  }

  const resetForm = () => {
    setLessonText("");
    setLessonName("");
    setFileSelected(false)
    alert("Успешно сохранено!");
  }

  const handleGoMain = () => {
    history.push("/admin/users")
  }

  return (
      <form autoComplete="off" onSubmit={handleLessonSubmit}>
        <Box className={styles.boxContainer}>
            <h1>Создание упражнения</h1>
            <Grid container direction="row">
          <Grid item xs={3}>
            <h3>Название</h3>
                  <TextField
                    onChange={(e) => setLessonName(e.target.value)}
                    value={lessonName}
                    required
                    variant="standard"
                    name="name"/>
                </Grid>
                <Grid container direction="column" spacing={3} xs={6}>
                    <Grid item>
                        <Grid container direction="row" spacing={1} alignItems="center">
                            <Grid item>
                                <Button onClick={() => generateText()} disabled={fileSelected} variant="contained" color="primary">Сгенерировать текст</Button>
                            </Grid>
                            <Grid item xs={2}>
                                <label htmlFor="raised-button-file">
                                    <input
                                        accept="text/*"
                                        name="file"
                                        id="raised-button-file"
                                        type="file"
                                        onChange={handleFileSelect}
                                        />
                                </label>
                            </Grid>
                        </Grid>
                    </Grid>
            <Grid item>
              <h3>Текст</h3>
                        <TextField
                            onChange={(e) => setLessonText(e.target.value)}
                            value={lessonText}
                            disabled={fileSelected}
                            variant="outlined"
                            multiline rows={10}
                            name="text"
                            style={{ width: "100%" }}
                        />
                    </Grid>
                    <Grid item style={{ marginLeft: "auto", alignSelf: 'end' }}>
                        <Button type="submit" variant="contained" color="secondary">Сохранить</Button>
                    </Grid>
                </Grid>
                <Button
                  style={{ width: "100px", height: "100px" }}
                  onClick={handleGoMain}
                  variant="contained">
                  Вернуться на главную
              </Button>
            </Grid>
            <Grid>
              {errors.map((error: any) => (
                error !== undefined
                  ? <div style={{ color: "red" }} key={error.toString()}>{error}</div>
                  : <div></div>
              ))}
            </Grid>
            <Grid style={{ padding: 40 }}>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: 25 }} align="right">Зона 1</TableCell>
                    <TableCell style={{ fontSize: 25 }} align="right">Зона 2</TableCell>
                    <TableCell style={{ fontSize: 25 }} align="right">Зона 3</TableCell>
                    <TableCell style={{ fontSize: 25 }} align="right">Зона 4</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.zon1}>
                      <TableCell style={{ fontSize: 25 }} align="right">{row.zon1}</TableCell>
                      <TableCell style={{ fontSize: 25 }} align="right">{row.zon2}</TableCell>
                      <TableCell style={{ fontSize: 25 }} align="right">{row.zon3}</TableCell>
                      <TableCell style={{ fontSize: 25 }} align="right">{row.zon4}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </Grid>
        </Box>
    </form>
  )
}

export default AdminLessonsPage;