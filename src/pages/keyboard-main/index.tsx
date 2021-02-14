import { Button, Grid, makeStyles, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { TextModal } from '../../components/TextModal';
import { useHistory } from 'react-router-dom';
import store from '../../store';

const b11 = '/images/b11.jpg'
const b12 = '/images/b12.jpg'
const b13 = '/images/b13.jpg'
const b14 = '/images/b14.jpg'

const fGg = '/gays/f1_gg.png'
const f1s2 = '/gays/f1s2.png'
const f1s3 = '/gays/f1s3.png'
const b31Fg = '/gays/b31_fg.png'
const b14Fg = '/gays/b14_fg.png'

const useStyles = makeStyles({
  image: {
    height: 900,
    width: 450
  },
  root: {
    flexGrow: 1
  },
  grid: {
    marginTop: 40,
    width: 900,
    marginBottom: 40
  },
  itemSelect: {
    width: 200,
    marginRight: 15
  },
  gridItem: {
    marginLeft: 10
  },
  button: {
    marginLeft: 'auto'
  },
  timer: {
    fontSize: 26
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

const TIMER_TIME = 100;

let timerRef: any = null;

const KeyboardMain: React.FC<any> = () => {
  const classes = useStyles();
  const [selectedLevel, setSelectedLevel] = useState<LessonItem>();
  const [selectedExerciseText, setSelectedExerciseText] = useState<string>()
  const [exerciseList, setExerciseList] = useState<ExerciseItem[]>([]);
  const [lessonsList, setLessonsList] = useState<LessonItem[]>([]);
  const [isStartedExercise, setStartedExercise] = useState(false);
  const [keyPressTime, setKeyPressTime] = useState(0);
  const [countErrors, setCountErrors] = useState(0);
  const [isSuccesModalOpen, setOpenSuccessModal] = useState(false);
  const [isFailureModalOpen, setOpenFailureModal] = useState(false);
  const [levelName, setLevelName] = useState('');
  const history = useHistory();

  const [bg, setBg] = useState(b11);
  const [fg, setFg] = useState(fGg);
  const [currentText, setCurrentText] = useState("");

  const [isAnsweringState, setIsAnsweringState] = useState(false);
  const [answerFirst, setAnswerFirst] = useState("");
  const [answerSecond, setAnswerSecond] = useState("");

  const [cur, setCur] = useState(0);

  const [currentTime, setCurrentTime] = useState(0);

  const [timerTime, setTimerTime] = useState(0);

  const user = store.getState().user;

  const handleLevelSelect = (e: any) => {
    const lesson = lessonsList.find(({ number }) => number === e.target.value);
    if (!lesson) {
      return;
    }

    setSelectedLevel(lesson);
    setSelectedExerciseText(undefined);
    setExerciseList([]);
    getLessons(lesson.number);
  }

  const handleExerciseSelect = (e: any) => {
    const lesson = exerciseList.filter(x => x.text === e.target.value);
    setLevelName(lesson[0].name);
    setSelectedExerciseText(e.target.value);
  }

  const getLessons = (level: number) => {
    setExerciseList([]);
    setSelectedExerciseText(undefined);
    fetch(`https://powerful-fjord-90262.herokuapp.com/api/allowed_exercises?level=${level}`)
      .then((resp) => resp.json())
      .then((json) => {
        setExerciseList(json);
      })
  }

  const getAllLevels = () => {
    fetch('https://powerful-fjord-90262.herokuapp.com/api/level/list')
      .then((resp) => resp.json())
      .then((json) => {
        setLessonsList(json);
      })
  }

  const handleA = () => {
    if (answerFirst === 'Они нарушили право собственности, гарантированное статьей 35 Конституции РФ!') {
      setCountErrors(countErrors + 1)
    }
    setIsAnsweringState(false)
    changeText()
  }

  const handleB = () => {
    if (answerSecond === 'На твоем месте я бы не спорил.') {
      setCountErrors(countErrors + 1)
    }
    if (answerSecond === 'Не переживай, не отчислят, просто не пойдут на встречу, если у тебя возникнут проблемы.') {
      setCountErrors(countErrors + 1)
    }
    if (answerSecond === 'Ты все правильно написал, и твоей вины тут нет.') {
      setCountErrors(countErrors + 1)
    }
    if (answerSecond === 'Да ничего не делай, может тебя оправдают.') {
      setCountErrors(countErrors + 1)
    }
    setIsAnsweringState(false)
    changeText()
  }

  const handleStartExercise = () => {
    if (isAnsweringState) {
      return
    }
    changeText()

    setStartedExercise(true);
  }

  const handleLessonFinish = () => {
    sendResult(0, true);
    setOpenSuccessModal(true);
  }

  const handleSuccesModalClose = () => {
    setOpenSuccessModal(false);
  }

  useEffect(() => {
    getAllLevels();
  }, []);

  const sendResult = (increment: number, isSucsess: boolean) => {
    const payload = JSON.stringify({
      userName: user.userName,
      exerciseName: levelName,
      level: selectedLevel?.number,
      leadTime: timerTime,
      numberOfErrors: countErrors + increment,
      date: Date.now(),
      isSucsess: isSucsess
    })

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    };

    fetch('https://powerful-fjord-90262.herokuapp.com/api/statistics', requestOptions)
      .then(response => response.json())
      .catch(data => console.log(data));
  }

  function levelToString(lvl: number) {
    if (lvl === 1) {
      return "Конституционное Право"
    }
    if (lvl === 2) {
      return "Уголовное Право"
    }
    if (lvl === 3) {
      return "Административное Право"
    }
    if (lvl === 4) {
      return "Гражданское Право"
    }
    return "Сломалось Право"
  }

  const p1a1 = 'Я попадаю в большое помещение.'
  const p1a2 = 'Проходя по коридору, понимаю - образовательное.'
  const p1a3 = 'Вокруг много молодых людей, в воздухе запах близкой сессии.'
  const p1a4 = 'Неожиданно, быстро распахивается ближайшая дверь и ударяет меня своим весом.'
  const p1a5 = 'Из-за двери быстрыми шагами выходит парень.'
  const p1a6 = 'Как же надоел этот университет!'
  const p1a7 = 'Осторожнее, ты куда несешься?'
  const p1a8 = 'Прости, меня очень рассердили.'
  const p1a9 = 'Поссорился с кем-то?'
  const p1a10 = 'Не совсем… У нас должна начаться учебная практика.'
  const p1a11 = 'Отправят работать в какое-то предприятие?'
  const p1a12 = 'Если бы… В этом и проблема. Вместо практики нас заставляют косить траву.'

  const p2a1 = 'Боюсь, если я откажусь, меня отчислят…'

  const p3a1 = 'Ладно, мне пора бежать.'
  const p3a2 = 'Удачи!'
  const p4a1 = 'Я вышел из заведения на улицу и решил пройтись.'
  const p4a2 = 'В кармане завибрировал телефон.'
  const p4a3 = 'Звонит мой хороший друг, я вынужден взять трубку.'
  const p4a4 = 'Привет. Ты не занят? Мне срочно нужна твоя помощь.'
  const p4a5 = 'Что случилось?'
  const p4a6 = 'Недавно я вступил в спор о религии в одной группе в вк, немного вспылил.'
  const p4a7 = 'Мягко говоря, я высказал все свои мысли по поводу нашей официальной религии.'
  const p4a8 = 'И еще мягче говоря, кажется, немного задел чувства верующих в этой группе.'
  const p4a9 = 'В итоге, на меня написали заявление в правоохранительные органы, а те в свою очередь рассматривают уголовное дело.'
  const p4a10 = 'Как мне сказали, 148-ая статья Уголовного Кодекса РФ «Нарушение права на свободу совести и вероисповеданий».'

  const p5a1 = 'Но что теперь делать?'

  const p6a1 = 'Друг поблагодарил меня за помощь, а я вскоре понял, что мои ноги отказывают.'
  const p6a2 = 'Хорошо, что мы живем в то время, когда можно взять машину напрокат прямо через телефон.'
  const p6a3 = 'Какой все-таки красивый город!'
  const p6a4 = 'Что-то я проголодался, заеду перекусить.'
  const p6a5 = 'Я припарковал машину в неположенном месте и зашел в кафе.'
  const p6a6 = 'Знатно поев, я выхожу и вижу, что машины нет.'
  const p6a7 = 'Так… А где? Неужели её забрал эвакуатор?'

  const p7a1 = 'Я докажу свою невиновность! Нужно позвонить в ГИБДД.'
  const p7a2 = 'Трубку взял вежливый полицейский и объяснил мою ошибку.'
  const p7a3 = 'Реализация права собственности должна осуществляться в рамках, установленных действующим законодательством.'
  const p7a4 = 'Право ГИБДД осуществлять эвакуацию транспортных средств, мешающих дорожному движению, предусмотрено действующим административным законодательством.'
  const p7a5 = 'Значит я все-таки был не прав, надо оплатить штраф.'

  const p8a1 = 'Вот и штраф пришел, надо оплатить.'

  const p9a1 = 'Думаю, пора перемещаться отсюда.'
  const p9a2 = 'И зачем я только оплачивал штраф?...'

  const colors1: string[] = [
    p1a1,
    p1a2,
    p1a3,
    p1a4,
    p1a5,
    p1a6,
    p1a7,
    p1a8,
    p1a9,
    p1a10,
    p1a11,
    p1a12,
    p2a1,
    p3a1,
    p3a2,
    p4a1,
    p4a2,
    p4a3,
    p4a4,
    p4a5,
    p4a6,
    p4a7,
    p4a8,
    p4a9,
    p4a10,
    p5a1,
    p6a1,
    p6a2,
    p6a3,
    p6a4,
    p6a5,
    p6a6,
    p6a7,
    p7a1,
    p7a2,
    p7a3,
    p7a4,
    p7a5,
    p8a1,
    p9a1,
    p9a2
  ];

  function changeText() {
    let a = colors1[cur]
    if (a == null) {
      handleLessonFinish()
    }
    if (a === p1a12) {
      setIsAnsweringState(true)
      setAnswerFirst('Они не имеют права заставлять вас косить траву вместо нормальной практики!')
      setAnswerSecond('На твоем месте я бы не спорил.')
    }
    if (a === p2a1) {
      setIsAnsweringState(true)
      setAnswerFirst('Мне кажется, стоит сходить в деканат и попробовать найти компромисс.')
      setAnswerSecond('Не переживай, не отчислят, просто не пойдут на встречу, если у тебя возникнут проблемы.')
    }
    if (a === p4a10) {
      setIsAnsweringState(true)
      setAnswerFirst('Нельзя же так! Ты действительно виноват.')
      setAnswerSecond('Ты все правильно написал, и твоей вины тут нет.')
    }
    if (a === p5a1) {
      setIsAnsweringState(true)
      setAnswerFirst('Я думаю, чтобы избежать уголовной ответственности, тебе надо загладить вину перед потерпевшими.')
      setAnswerSecond('Да ничего не делай, может тебя оправдают.')
    }
    if (a === p6a7) {
      setIsAnsweringState(true)
      setAnswerFirst('Они нарушили право собственности, гарантированное статьей 35 Конституции РФ!')
      setAnswerSecond('Не зря тут знак «Остановка запрещена». Я сам виноват в этом.')
    }
    setCur(cur + 1)
    setCurrentText(a);

    if (a === p4a1) {
      setBg(b12)
    }
    if (a === p6a3) {
      setBg(b13)
    }
    if (a === p6a6) {
      setBg(b14)
    }
    if (a === p1a6) { // gg + student
      setFg(f1s2)
    }
    if (a === p4a1) { // solo gg
      setFg(fGg)
    }
    if (a === p4a4) { // gg + friend
      setFg(f1s3)
    }
    if (a === p6a1) { // no one
      setFg(b31Fg)
    }
    if (a === p6a5) { // gg
      setFg(fGg)
    }
    if (a === p7a2) { // solo police
      setFg(b14Fg)
    }
    if (a === p7a5) { // gg
      setFg(fGg)
    }
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
      <Grid item xs={6}>
        <img
          style={ { backgroundImage: `url(${bg})` } }
          src={fg}
          onClick={handleStartExercise}
        />
        </Grid>
        <Grid item xs={6}>
        <Grid container direction="column" alignItems="center">
      <h2>Вы вошли как {user.userName}</h2>
        <Grid container direction="row" wrap="wrap" justify="space-between" className={classes.grid}>
            <Select
                disabled={isStartedExercise}
                className={classes.itemSelect}
                value={selectedLevel}
                onChange={handleLevelSelect}
            >
                {
                    lessonsList.map(({ number }) => (
                        <MenuItem key={number} value={number}>{levelToString(number)}</MenuItem>
                    ))
                }
            </Select>
            <Select
                value={selectedExerciseText}
                className={classes.itemSelect}
                disabled={exerciseList.length === 0 || isStartedExercise}
                onChange={handleExerciseSelect}
            >
                {
                    exerciseList.map(({ name, text }) => (
                        <MenuItem key={name} value={text}>{name}</MenuItem>
                    ))
                }
            </Select>
        </Grid>
        <Grid container direction="row" wrap="wrap" justify="space-between" className={classes.grid}>
                <strong className={classes.timer}>{currentText}</strong>
        </Grid>
        <Grid container direction="row" wrap="wrap" justify="space-between" className={classes.grid}>
        <Grid item className={classes.button}>
            { !isStartedExercise ? <Button
                size="medium"
                variant="contained"
                color={isStartedExercise ? 'secondary' : 'primary'}
                onClick={handleStartExercise}
                disabled={selectedLevel == null || selectedExerciseText == null}
            >
                {isStartedExercise ? 'Остановить' : 'Начать'}
            </Button> : null }
            </Grid>
            <Grid item className={classes.button}>
            { isAnsweringState ? <Button
                    size="medium"
                    variant="contained"
                    color={isStartedExercise ? 'secondary' : 'primary'}
                    onClick={handleA}
                    disabled={selectedLevel == null || selectedExerciseText == null}
                >
                    { answerFirst }
                </Button> : null }
            </Grid>
            <Grid item className={classes.button}>
            { isAnsweringState ? <Button
                    size="medium"
                    variant="contained"
                    color={isStartedExercise ? 'secondary' : 'primary'}
                    onClick={handleB}
                    disabled={selectedLevel == null || selectedExerciseText == null}
                >
                    { answerSecond }
                </Button> : null }
            </Grid>
        </Grid>
        <TextModal
            label="Пройдено"
            text={`Поздравляем: ы`}
            onClose={handleSuccesModalClose}
            isOpen={isSuccesModalOpen}
        />
        </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default KeyboardMain;