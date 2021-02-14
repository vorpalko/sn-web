import React from 'react'
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core'
import { Face, Fingerprint } from '@material-ui/icons'
import { connect } from 'react-redux'
import { loginActionSuccess } from '../../store/actions'

const styles = (theme: any) => ({
  margin: {
    margin: theme.spacing.unit * 2
  },
  padding: {
    padding: theme.spacing.unit
  },
  center: {
    margin: 'auto',
    width: '30vw',
    marginTop: 150
  },
  mainContainer: {
    width: '100vw',
    height: '100vh'
  }
})

function isValid (str: string): boolean {
  const re = /[~`!#$%&*+=\-\]\\';,/{}|\\":<>]/g;
  return !!re.exec(str);
}

class LoginTab extends React.Component<any, any> {
  constructor (props: any) {
    super(props)
    this.state = {
      isRegister: false,
      emailRegister: '',
      passwordRegister: '',
      passwordRepeatRegister: '',
      emailLogin: '',
      passwordLogin: '',
      passwordRepeatLogin: '',
      errorsLogin: [],
      errorsRegister: [],
      isOpenAboutDevelopers: false
    }
    console.log(props);
  }

  emailChangeHandlerLogin = (event: any) => {
    this.setState({ emailLogin: event.target.value });
  }

  passwordChangeHandlerLogin = (event: any) => {
    this.setState({ passwordLogin: event.target.value });
  }

  emailChangeHandlerRegister = (event: any) => {
    this.setState({ emailRegister: event.target.value });
  }

  passwordChangeHandlerRegister = (event: any) => {
    this.setState({ passwordRegister: event.target.value });
  }

  passwordChangeRepeatHandlerRegister = (event: any) => {
    this.setState({ passwordRepeatRegister: event.target.value });
  }

  registerReq () {
    if (isValid(this.state.emailRegister) || this.state.emailRegister.length < 3 || this.state.emailRegister.length > 15) {
      this.setState({ errorsRegister: ['Неверно введенено имя пользователя'] });
      return;
    }

    if (this.state.emailRegister === '' || this.state.passwordRegister === '' || this.state.passwordRepeatRegister === '') {
      this.setState({ errorsRegister: ['Необходимо заполнить все поля'] });
      return;
    }

    if (this.state.passwordRegister !== this.state.passwordRepeatRegister) {
      this.setState({ errorsRegister: ['Пароли должны совпадать'] });
      return;
    }

    if (this.state.passwordRegister.length < 6 || this.state.passwordRegister.length > 15) {
      this.setState({ errorsRegister: ['Пароль должен содержать не менее 6-ти символов и не более 15-ти'] });
      return;
    }

    if (isValid(this.state.passwordRegister)) {
      this.setState({ errorsRegister: ['Пароль должен содержать латинские буквы, цифры или нижнее подчеркивание'] });
      return;
    }

    this.setState({ errorsRegister: [] });

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: this.state.emailRegister, password: this.state.passwordRegister })
    };
    
    fetch('https://powerful-fjord-90262.herokuapp.com/api/signup', requestOptions)
      .then(response => response.json())
      .then((x: any) => {
        if (x.error) {
          this.setState({ errorsRegister: [x.error] })
        } else {
          alert('Успешно зарегистрировано')
          this.setState({
            isRegister: false
          });
          window.location.reload();
        }
        return x;
      })
      .catch(data => {
        console.log(data);
        this.setState({ errorsRegister: [data] })
      });
  }

  handleRegister = () => {
    this.registerReq()
    this.setState({
      emailLogin: '',
      passwordLogin: '',
      passwordRepeatLogin: ''
    });
  }

  handleLoginClick = () => {
    this.setState({
      isRegister: true
    })
  }

  handleLogin = () => {
    if (isValid(this.state.emailLogin) || this.state.emailLogin.length < 3 || this.state.emailLogin.length > 15) {
      this.setState({ errorsLogin: ['Неверно введенено имя пользователя'] });
      return;
    }

    if (this.state.emailLogin === '' || this.state.passwordLogin === '') {
      this.setState({ errorsLogin: ['Необходимо заполнить все поля'] });
      return;
    }

    if (this.state.passwordLogin.length < 6 || this.state.passwordLogin.length > 15) {
      this.setState({ errorsLogin: ['Неверный пароль'] });
      return;
    }

    if (isValid(this.state.passwordLogin)) {
      this.setState({ errorsLogin: ['Пароль должен содержать латинские буквы, цифры или нижнее подчеркивание'] });
      return;
    }

    this.setState({ errorsLogin: [] });
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: this.state.emailLogin, password: this.state.passwordLogin })
    };

    fetch('https://powerful-fjord-90262.herokuapp.com/api/signin', requestOptions)
      .then(response => response.json().then(x => {
        if (!x) {
          return;
        }
        if (x.errors == null) {
          (this.props as any).onLogin({ isAdmin: x.isAdmin, userName: x.email })
          console.log(x)
        } else {
          this.setState({ errorsLogin: [x.errors.message] });
        }
      }))
      .catch(data => console.log(data));
  }

  renderLogin = () => (
      <>
    <Grid container spacing={8} alignItems="flex-end">
        <Grid item>
            <Face />
        </Grid>
        <Grid item md={true} sm={true} xs={true}>
            <TextField onChange={this.emailChangeHandlerLogin} id="username" label="Имя пользователя" type="email" fullWidth autoFocus required />
        </Grid>
    </Grid>
    <Grid container spacing={8} alignItems="flex-end">
        <Grid item>
            <Fingerprint />
        </Grid>
        <Grid item md={true} sm={true} xs={true}>
            <TextField onChange={this.passwordChangeHandlerLogin} id="username" label="Пароль" type="password" fullWidth required />
        </Grid>
    </Grid>
    <Grid style={{ marginTop: 15 }} container justify="center" alignItems="center">
        <Grid item>
            <Button onClick={this.handleLoginClick} disableFocusRipple disableRipple style={{ textTransform: 'none' }} variant="text" color="primary">Еще не зарегестрированы?</Button>
        </Grid>
    </Grid>
    <Grid container justify="center" style={{ marginTop: '10px' }}>
        <Button onClick={this.handleLogin} variant="outlined" color="primary" style={{ textTransform: 'none' }}>Вход</Button>
    </Grid>
      <Grid>
        {this.state.errorsLogin.map((error: any) => (
          error !== undefined
            ? <div style={{ color: 'red' }} key={error.toString()}>{error}</div>
            : <div></div>
        ))}
    </Grid>
      </>
  )

  renderRegister = () => (
      <>
    <Grid container spacing={8} alignItems="flex-end">
        <Grid item>
            <Face />
        </Grid>
        <Grid item md={true} sm={true} xs={true}>
            <TextField onChange={this.emailChangeHandlerRegister} id="username" label="Имя пользователя" type="email" fullWidth autoFocus required />
        </Grid>
    </Grid>
    <Grid container spacing={8} alignItems="flex-end">
        <Grid item>
            <Fingerprint />
        </Grid>
        <Grid item md={true} sm={true} xs={true}>
            <TextField onChange={this.passwordChangeHandlerRegister} id="username" label="Пароль" type="password" fullWidth required />
        </Grid>
    </Grid>
    <Grid container spacing={8} alignItems="flex-end">
        <Grid item>
            <Fingerprint />
        </Grid>
        <Grid item md={true} sm={true} xs={true}>
            <TextField onChange={this.passwordChangeRepeatHandlerRegister} id="username" label="Повторите пароль" type="password" fullWidth required />
        </Grid>
    </Grid>
    <Grid container justify="center" style={{ marginTop: '10px' }}>
        <Button onClick={this.handleRegister} variant="outlined" color="primary" style={{ textTransform: 'none' }}>Регистрация</Button>
      </Grid>
      <Grid>
        {this.state.errorsRegister.map((error: any) => (
          error !== undefined
            ? <div style={{ color: 'red' }} key={error.toString()}>{error}</div>
            : <div></div>
        ))}
    </Grid>
      </>
  )

  handleAboutDevelopersModalOpen = () => {
    this.setState({ isOpenAboutDevelopers: true })
  }

  handleAboutDevelopersModalClose = () => {
    this.setState({ isOpenAboutDevelopers: false })
  }

  render () {
    const { classes } = this.props as any
    const { isOpenAboutDevelopers } = this.state;
    return (
        <div className={classes.mainContainer}>
          <div className={classes.center}>
            <Paper className={classes.padding}>
                <div className={classes.margin}>
                  {this.state.isRegister ? this.renderRegister() : this.renderLogin()}
                </div>
            </Paper>
          </div>
      </div>
    )
  }
}

export const LoginScreen = connect(undefined, {
  onLogin: loginActionSuccess
})(withStyles(styles)(LoginTab))
