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
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import store from '../../store';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { useHistory } from 'react-router-dom';
import { Pie } from "react-chartjs-2";

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset'
    }
  }
});

function Row(data: any) {
  const [open, setOpen] = React.useState(true);
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
                    <TableCell>Упражнение</TableCell>
                    <TableCell>Уровень</TableCell>
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
                        {historyRow.exerciseName}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {historyRow.level}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {historyRow.leadTime / 1000} секунд(ы)
                      </TableCell>
                      <TableCell align="right">{historyRow.numberOfErrors}</TableCell>
                      <TableCell align="right">{new Date(historyRow.date).toLocaleString()}</TableCell>
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

const UserStatistics: React.FC<any> = () => {
  const [statistics, setStatistics] = React.useState([]);
  const [userToResult, setUserToResult] = React.useState([]);
  const history = useHistory();

  const user = store.getState().user;

  React.useEffect(function effectFunction() {
    async function fetchStatistics() {
      const response = await fetch('https://powerful-fjord-90262.herokuapp.com/api/statistics');
      const json = await response.json();
      setStatistics(json.filter((x: any) => x._id === user.userName));
    }
    fetchStatistics();
  }, []);

  React.useEffect(function effectFunction() {
    async function fetchUserToResult() {
      const response = await fetch('https://powerful-fjord-90262.herokuapp.com/api/user-to-losses');
      const json = await response.json();
      setUserToResult(json.filter((x: any) => x._id === user.userName));
    }
    fetchUserToResult();
  }, []);

  const returnToKeyboard = () => {
    history.push("/keyboard");
  }

  const stateFour = {
    labels: ["Успешные", "Неуспешные"],
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
        data: [userToResult.map((x: any) => x.result.filter(Boolean).length), userToResult.map((x: any) => x.result.length - x.result.filter(Boolean).length)]
      }
    ]
  }

  return (
    <Grid container direction="column" alignItems="center">
      <h2>Стастистика пользователя: {user.userName}</h2>
      <Grid style={{ padding: 20 }}>
          <Pie
            data={stateFour}
            width={500}
            height={500}
            options={{
              title: {
                display: true,
                text: 'Количество успешно и неуспешно пройденных упражнений',
                fontSize: 20
              },
              legend: {
                display: true,
                position: 'right'
              }
            }}
          />
        </Grid>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Пользователь</TableCell>
              <TableCell align="right">Упражнения</TableCell>
              <TableCell align="right">Ошибки</TableCell>
              <TableCell align="right">Общее время</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statistics.map((row: any) => (
                <Row key={row._id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" onClick={returnToKeyboard}>К тренажеру</Button>
    </Grid>
  )
}

export default UserStatistics;