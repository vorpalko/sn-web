import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@material-ui/core";
import React from "react";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Bar, Line, Pie } from 'react-chartjs-2';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset'
    }
  }
});

interface DataItem {
  exerciseName: string,
  level: number,
  leadTime: number,
  numberOfErrors: number,
  date: Date
}

interface Data {
  username: string,
  exercises: number,
  totalErrors: number,
  totalTime: number,
  statistics: [DataItem]
}

function Row(data: any) {
  const [open, setOpen] = React.useState(false);
  const [row, setRows] = React.useState(data.row);
  const classes = useRowStyles();

  if (row.length === 0) {
    return null;
  } else {
    return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row._id}
        </TableCell>
        <TableCell align="right">{row.statistics.length}</TableCell>
        <TableCell align="right">{row.numberOfErrors}</TableCell>
        <TableCell align="right">{row.totalLeadTime / 1000} секунд(ы)</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Развернутая статистика
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>Время выполнения</TableCell>
                    <TableCell align="right">Количество ошибок</TableCell>
                    <TableCell align="right">Дата прохождения</TableCell>
                    <TableCell align="right">Результат</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.statistics.map((historyRow: any) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                      </TableCell>
                      <TableCell component="th" scope="row">
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {historyRow.leadTime / 1000} секунд(ы)
                      </TableCell>
                      <TableCell align="right">{historyRow.numberOfErrors}</TableCell>
                      <TableCell align="right">
                        { new Date(historyRow.date).toLocaleString() }
                      </TableCell>
                      <TableCell align="right">{historyRow.isSucsess ? "Успешно" : "Неудача"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
    );
  }
}

const useStyles = makeStyles({
  card: {
    marginTop: 10,
    background: "#F0F8FF"
  }
});

function isValid(str: string): boolean {
  const re = /[~`!#$%&*+=\-\]\\';,/{}|\\":<>]/g;
  return !!re.exec(str);
}

const UsersAdmin: React.FC<any> = () => {
  const [open, setOpen] = React.useState(false);
  const [rows, setRow] = React.useState([]);
  const classes = useRowStyles();
  const cardClasses = useStyles();
  const [users, setUser] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [userPasswoed, setUserPassword] = React.useState("");
  const [userRepeatPassword, setUserRepeatPassword] = React.useState("");
  const [errors, setError] = React.useState([] as any);
  const [errorsToLevel, setErrorsToLevel] = React.useState([]);
  const [errorsToUser, setErrorsToUser] = React.useState([]);
  const [errorsToDate, setErrorsToDate] = React.useState([]);
  const [userToResult, setUserToResult] = React.useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError([]);
  };

  const sendUser = () => {
    const isUserUniq = users.filter((user: any) => user.email === userName);
    if (isUserUniq.length !== 0) {
      setError(["Пользователь существует"]);
      return;
    }

    if (userName === "" || userPasswoed === "" || userRepeatPassword === "") {
      setError(["Нужно заполнить все поля"]);
      return;
    }

    if (userPasswoed !== userRepeatPassword) {
      setError(["Пароли не совпадают"]);
      return;
    }

    if (userPasswoed.length < 6 || userPasswoed.length > 15) {
      setError(["Пароль должен содержать не менее 6-ти символов и не более 15-ти"]);
      return;
    }

    if (isValid(userPasswoed)) {
      setError(["Пароль должен содержать латинские буквы, цифры или нижнее подчеркивание"]);
      return;
    }

    setError([]);

    const payload = JSON.stringify({
      email: userName,
      password: userPasswoed,
      isAdmin: false
    });

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    };

    fetch('https://powerful-fjord-90262.herokuapp.com/api/user/create', requestOptions)
      .then(response => response.json())
      .catch(data => console.log(data));

    users.push({
      email: userName,
      password: userPasswoed,
      isAdmin: false
    } as never)
    setUser(users);
    setOpen(false);
  }

  const removeUser = (username: string) => {
    const newRows = rows.filter((x: any) => x._id !== username);
    setRow(newRows);
    const newUsers = users.filter((user: any) => user.email !== username);
    setUser(newUsers);

    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    };

    fetch(`https://powerful-fjord-90262.herokuapp.com/api/user/${username}`, requestOptions)
      .then(response => response.json())
      .catch(data => console.log(data));
  }

  React.useEffect(function effectFunction() {
    async function fetchBooks() {
      const response = await fetch('https://powerful-fjord-90262.herokuapp.com/api/statistics');
      const json = await response.json();
      setRow(json);
    }
    fetchBooks();
  }, []);

  React.useEffect(function effectFunction() {
    async function fetchUsers() {
      const response = await fetch('https://powerful-fjord-90262.herokuapp.com/api/user/list');
      const json = await response.json();
      setUser(json);
    }
    fetchUsers();
  }, []);

  React.useEffect(function effectFunction() {
    async function fetchErrorsToLevel() {
      const response = await fetch('https://powerful-fjord-90262.herokuapp.com/api/errors-to-levels');
      const json = await response.json();
      setErrorsToLevel(json);
    }
    fetchErrorsToLevel();
  }, []);

  React.useEffect(function effectFunction() {
    async function fetchErrorsToUser() {
      const response = await fetch('https://powerful-fjord-90262.herokuapp.com/api/user-to-errors');
      const json = await response.json();
      setErrorsToUser(json);
    }
    fetchErrorsToUser();
  }, []);

  React.useEffect(function effectFunction() {
    async function fetchErrorsToDate() {
      const response = await fetch('https://powerful-fjord-90262.herokuapp.com/api/errors-to-date');
      const json = await response.json();
      setErrorsToDate(json);
    }
    fetchErrorsToDate();
  }, []);

  React.useEffect(function effectFunction() {
    async function fetchUserToResult() {
      const response = await fetch('https://powerful-fjord-90262.herokuapp.com/api/user-to-losses');
      const json = await response.json();
      setUserToResult(json);
    }
    fetchUserToResult();
  }, []);

  const stateFirst = {
    labels: errorsToLevel.map((x: any) => "Уровень " + x._id),
    datasets: [
      {
        label: 'Ошибки',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        data: errorsToLevel.map((x: any) => "" + x.numberOfErrors)
      }
    ]
  }

  const stateSecond = {
    labels: errorsToUser.map((x: any) => "Пользоователь: " + x._id),
    datasets: [
      {
        label: 'Rainfall',
        backgroundColor: [
          '#B21F00',
          '#C9DE00',
          '#2FDE00',
          '#00A6B4',
          '#6800B4'
        ],
        hoverBackgroundColor: [
          '#501800',
          '#4B5000',
          '#175000',
          '#003350',
          '#35014F'
        ],
        data: errorsToUser.map((x: any) => x.numberOfErrors)
      }
    ]
  }

  const stateThree = {
    labels: errorsToDate.map((x: any) => new Date(x._id)).sort((a: any, b: any) => a - b).map(date => date.toLocaleString()),
    datasets: [
      {
        label: 'Ошибки',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: errorsToDate.map((x: any) => x.numberOfErrors)
      }
    ]
  }

  const stateFour = {
    labels: userToResult.map((x: any) => "Пользоователь: " + x._id),
    datasets: [
      {
        label: 'Rainfall',
        backgroundColor: [
          '#B21F00',
          '#C9DE00',
          '#2FDE00',
          '#00A6B4',
          '#6800B4'
        ],
        hoverBackgroundColor: [
          '#501800',
          '#4B5000',
          '#175000',
          '#003350',
          '#35014F'
        ],
        data: userToResult.map((x: any) => x.result.filter(Boolean).length)
      }
    ]
  }

  return (
    <Grid>
      <h2>Общая статистика по пользователям</h2>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Пользователь</TableCell>
              <TableCell align="right">Попытки</TableCell>
              <TableCell align="right">Ошибки</TableCell>
              <TableCell align="right">Общее время</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any) => (
                <Row key={row._id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid>
        <h2>Список активных пользователей</h2>
        {users.filter((user:any) => !user.isAdmin).map((user: any) => (
          <Card key={user.id} className={cardClasses.card}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {user.email}
              </Typography>
              <CardActions>
              <Button
                onClick={() => removeUser(user.email)}
                variant="contained"
                color="secondary">
                Удалить
              </Button>
            </CardActions>
            </CardContent>
        </Card>
        ))}
      </Grid>
      <Button variant="contained" color="primary" style={{ marginTop: 10 }} onClick={handleClickOpen}>
        Добавить пользователя
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Добавить пользователя</DialogTitle>
        <DialogContent>
          <TextField
            onChange={(e) => {
              setUserName(e.target.value)
            }}
            margin="dense"
            label="Имя пользователя"
            fullWidth
          />
          <TextField
            onChange={(e) => setUserPassword(e.target.value)}
            margin="dense"
            label="Пароль"
            fullWidth
          />
          <TextField
            onChange={(e) => setUserRepeatPassword(e.target.value)}
            margin="dense"
            label="Повторите пароль"
            fullWidth
          />
          {errors.map((error: any) => (
            <div style={{ color: "red" }} key={error.toString()}>{error}</div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Отмена
          </Button>
          <Button onClick={sendUser} variant="contained" color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
      <Grid>
        <h2>Графическое представление статистики</h2>
        <Grid style={{ padding: 20 }}>
          <Bar
          data={stateFirst}
          options={{
            title: {
              display: true,
              text: 'Общее количество ошибок',
              fontSize: 20
            },
            legend: {
              display: true,
              position: 'right'
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }}
        />
        </Grid>
        <Grid style={{ padding: 20 }}>
          <Pie
          data={stateSecond}
          options= {{
            title: {
              display: true,
              text: 'Количество ошибок по каждому пользователю',
              fontSize: 20
            },
            legend: {
              display: true,
              position: 'right'
            }
          }}
        />
        </Grid>
        <Grid>
          <Line
            data= {stateThree}
            options= {{
              title: {
                display: true,
                text: 'Изменение количества ошибок во времени',
                fontSize: 20
              },
              legend: {
                display: true,
                position: 'right'
              },
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }}
          />
        </Grid>
        <Grid style={{ padding: 20 }}>
          <Pie
            data={stateFour}
            options={{
              title: {
                display: true,
                text: 'Количество попыток по каждому пользователю',
                fontSize: 20
              },
              legend: {
                display: true,
                position: 'right'
              }
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default UsersAdmin;