/* eslint-disable multiline-ternary */
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

interface TextModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const styles: any = (theme: any) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  title: {
    fontWeight: 'bold'
  }
});

const DialogTitle = withStyles(styles)(((props) => {
  const { children, classes, onClose, ...other } = props as any;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6" className={classes.title}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
}) as React.FC<any>);

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

const useModalStyles = makeStyles({
  highlightText: {
    fontWeight: 'bold'
  }
})

export const AboutModal: React.FC<TextModalProps> = ({ isOpen, onClose }) => {
  const styles = useModalStyles();
  return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle onClose={onClose}>Информация о разработчиках</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
                Самарский Университет
          </Typography>
          <Typography gutterBottom>
               Кафедра программных систем
          </Typography>
          <Typography gutterBottom>
          Курсовой проект по дисциплине «Программная инженерия»
          </Typography>
          <Typography gutterBottom>
            Тема проекта: Автоматизированная система «Клавиатурный тренажер» с функциями администратора
          </Typography>
          <Typography gutterBottom className={styles.highlightText}>
                Разработчики: студенты группы 6413-020302D:
          </Typography>
          <Typography gutterBottom>
                Кривощапов Максим Владимирович aka 🐕
          </Typography>
          <Typography gutterBottom>
                Алкеев Максим Генадьевич aka 🐗
          </Typography>
          <Typography gutterBottom>
                Полушкин Денис Васильевич aka 🎅
          </Typography>
        </DialogContent>
        <DialogActions>
          <Typography gutterBottom>
            Самара 2020
          </Typography>
        </DialogActions>
      </Dialog>
  );
}
