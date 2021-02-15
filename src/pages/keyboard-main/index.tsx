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
  const [currentAuthor, setCurrentAuthor] = useState("");

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
    if (answerFirst === 'К сожалению, ты превысил меры допустимого, и теперь тебя ждет наказание.') {
      setCountErrors(countErrors + 1)
    }
    if (answerFirst === 'Наверное я буду, ведь пешеход всегда прав…') {
      setCur(cur + 1)
      setCountErrors(countErrors + 1)
    }
    if (answerFirst === 'Да, сам будет оплачивать.') {
      setCountErrors(countErrors + 1)
    }
    if (answerFirst === 'Вы молодец. Но что поделаешь, есть такие неблагодарные люди.') {
      setCountErrors(countErrors + 1)
    }
    setIsAnsweringState(false)
    changeText()
  }

  const handleB = () => {
    if (answerSecond === 'На твоем месте я бы не спорил.') {
      setCur(cur + 1)
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
    if (answerSecond === 'Парню уже 14 лет, так что его ждет уголовная ответственность. Будет в ответе зато, что натворил.') {
      setCountErrors(countErrors + 1)
    }
    if (answerSecond === 'Нет, это же всего лишь маковая соломка.') {
      setCountErrors(countErrors + 1)
    }
    if (answerSecond === 'Вы зря сердитесь. Ваш ректор прав.') {
      setCountErrors(countErrors + 1)
    }
    if (answerSecond === 'Все правильно. Продает то он скрипку, а не футляр.') {
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

  const k1a1 = 'Я попадаю в какое то странное место. Кругом старые панельки, некоторые выглядят очень обветшало.'
  const k1a2 = 'А улицы довольно узкие и неосвещенные.'
  const k1a3 = 'Неожиданный женский крик пронзает тишину. Он донесся из переулка рядом. Я бегу туда.'
  const k1a4 = 'Быстрее меня туда сворачивает мужчина, оказавшийся ближе.'
  const k1a5 = 'Там, во тьме, двое мужчин пытаются вырвать сумку у девушки.'
  const k1a6 = 'Что же думает сейчас мужчина, оказавшийся там быстрее?'
  const k1a7 = 'Мужчина, конечно, сразу влетает с кулаками.'
  const k4a1 = 'Происходит очень скоротечная драка.'
  const k4a2 = 'Видимо, парень долго увлекался единоборствами.'
  const k4a3 = 'Кажется, есть пострадавшие… Надо вызвать скорую.'
  const k4a4 = 'Что же теперь будет со мной?'
  const k4aaction1 = 'К сожалению, ты превысил меры допустимого, и теперь тебя ждет наказание.'
  const k4aaction2 = 'Это была крайняя необходимость. Все будет хорошо.'

  const k5a1 = 'Фух, надеюсь больше ничего не случится…'
  const k5a2 = 'Район в который я попал выглядит уж слишком криминально.'
  const k5a3 = 'Стоп, что это там происходит?'
  const k5a4 = 'Впереди стоит группа подростков.'
  const k5a5 = 'Они громко горланят, а в центре стоит парень помладше.'
  const k5a6 = 'Он хвастается новым ножом, подаренным ему сегодня в честь четырнадцатилетия.'
  const k5a7 = 'Пацан размахивает им и игриво направляет на остальных.'
  const k5a8 = 'Вдруг он решает проверить, насколько он острый, и наносит удар одному парню из его компании.'
  const k5a9 = 'Все начинают разбегаться.'
  const k5a10 = 'Надо вызвать полицию и скорую!'
  const k5a11 = 'Довольно быстро подъезжают спецмашины.'
  const k5a12 = 'Скажите, что теперь будет с этим мальчиком?'
  const k5aaction1 = 'Ему-то ничего не будет, ведь ему 14 исполняется только сегодня. За него будутотвечать родители.'
  const k5aaction2 = 'Парню уже 14 лет, так что его ждет уголовная ответственность. Будет в ответе зато, что натворил.'

  const k6a1 = 'А ты чего такой уставший?'
  const k6a2 = 'Да, тяжелый день…'
  const k6a3 = 'У меня тоже непростой. Необычная история произошла сегодня. Один пареньрешил продавать наркотики, и чтобы его не нашли, решил прятать их в пастушьем домике у своейбабушки в Казахстане. Там было целых 150кг маковой соломки!'
  const k6a4 = 'Ничего себе! А этот парень подлежит уголовной ответственности?'

  const k6aaction1 = 'Да, конечно.'
  const k6aaction2 = 'Нет, это же всего лишь маковая соломка.'

  const k7a1 = 'Ну и денек… Я так устал. Пойду в отель и завтра отправлюсь в новый город.'

  const b1a1 = 'Вот я и оказался в новом городе. Привычно решил осмотреть его, я взял машину в аренду и поехал по городу.'
  const b1a2 = 'Вдруг, на проезжую часть под машину бросается мальчик, не глядя на дорогу.'
  const b1a3 = 'Чтобы не сбить подростка, я сильно повернул вправо и въехал прямо в столб уличного освещения.'
  const b1a4 = 'Я был в порядке, но машина и столб знатно пострадали. Мне помог выбраться прохожий.'
  const b1a5 = 'Вы целы?'
  const b1a6 = 'Да, кажется, отделался парой царапин.'
  const b1a7 = 'Эй, парень, ты зачем под машину бросаешься?'
  const b1a8 = 'Простите, я не заметил…'
  const b1a9 = 'Нельзя же не глядя бежать на дорогу в неположенном месте!'
  const b1a10 = 'Интересно, кто будет отвечать за происшедшее?'
  const b1aaction1 = 'Наверное я буду, ведь пешеход всегда прав…'
  const b1aaction2 = 'В этой ситуации виноват подросток, значит он будет возмещать ущерб.'

  const b2a1 = 'Да этому мальчику всего лет 13, разве он сам будет возмещать ущерб?'
  const b2aaction1 = 'Да, сам будет оплачивать.'
  const b2aaction2 = 'Нет, оплачивать будут родители.'
  const b2aaction3 = 'Нет, никто не будет отдавать деньги, это же несчастный случай.'

  const b3a1 = 'Я решил развеиться и зайти в ТЦ, посмотреть кино.'
  const b3a2 = 'Так много людей… А до сеанса еще 20 минут. Делать нечего, подожду.'
  const b3a3 = 'Рядом сел молодой человек. Он эмоционально разговаривает по телефону и я вынужден подслушать разговор.'
  const b3a4 = 'Да зачем мне оформлять разрешение на использование иностранной рабочей силы?'
  const b3a5 = 'Ну и что, что я из Китая! Я же всего лишь хочу подработать в бригаде проводников во время студенческих каникул. Это будет мне полезно для развития речи и профессиональных навыков.'
  const b3a6 = 'Да-да, понял. Я вам перезвоню.'
  const b3a7 = 'Я понял в чем дело и решил вмешаться в этот вопрос.'
  const b3a8 = 'Извините, я случайно услышал ваш разговор по телефону. Вас просят получить разрешение на использование иностранной рабочей силы, да?'
  const b3a9 = 'Да, ректор сказал, что без этого договора меня не допустят.'
  const b3aaction1 = 'Я думаю, ваш ректор не прав.'
  const b3aaction2 = 'Вы зря сердитесь. Ваш ректор прав.'

  const b4a1 = 'Вам надо доказать свою правоту опираясь на ст. 13.4 ФЗ N 115 "О правовом положении иностранных граждан в Российской Федерации" – там прописана ваша проблема.'

  const b5a1 = 'Вам надо смириться и получить разрешение.'

  const b6a1 = 'Спасибо за совет! Фильм уже начинается, после него буду разбираться с моей практикой.'
  const b6a2 = 'После просмотра фильма я попрощался с парнем и решил перемещаться в другой город.'

  const s1a1 = 'Я попадаю в другой город. Здесь очень много снега и довольно холодно.'
  const s1a2 = 'Не успев сделать шага, я поскальзывюсь и падаю.'
  const s1a3 = 'Мимо проходила женщина с ребенком и помогла мне подняться.'
  const s1a4 = 'Вы не ушиблись?'
  const s1a5 = 'Нет, все в порядке, спасибо.'
  const s1a6 = 'Кажется у вас кровь на затылке.'
  const s1a7 = 'Пойдемте ко мне домой, я вас перебинтую, заодно чай попьем.'
  const s1a8 = 'Ох.. Это было бы отлично! Спасибо!'

  const s1a9 = 'Мам, все-таки хорошо, что мои вещи не приняли обратно в магазин.'
  const s1a10 = 'Вы представляете, мой сын принял участие в съемках фильма и получил вознаграждение. Ему двенадцать лет всего, а уже деньги заработал, молодец он у нас.'
  const s1a11 = 'Только купил бы что-то хорошее или с нами посоветовался. А он пошел и купил на них канцелярии всякой – ручки, пенал и записную книжку.'
  const s1a12 = 'Но я всегда хотел красивую записную книжку…'
  const s1a13 = 'Пошли мы возвращать в магазин. А директор отказался принимать, говорит – Александр сам заработал деньги, значит, может самостоятельно распоряжаться своим заработком.'
  const s1aaction1 = 'Странно. Он должен был вернуть часть денег. Ведь Александру только двенадцать лет. Значит, он частично дееспособен и может совершать сделки только с согласия родителей.'
  const s1aaction2 = 'Так-то он прав, это мелкая бытовая сделка. Он не должен возвращать вам деньги.'

  const s2a2 = 'Вот мы и дома. Сейчас перебинтую вам руку и будем пить чай.'
  const s2a3 = 'Женщина поставила чай и усадила меня за стол.'
  const s2a4 = 'Муж у меня в командировке, сегодня должен вернуться. А в комнате старший сын – он уже работает, девушку себе нашел, хочет теперь купить квартиру.'
  const s2a5 = 'На кухню заходит старший сын.'
  const s2a6 = 'Хочу купить квартиру, но пока не могу. Для этого мне нужно освободиться от ограничений для совершения сделок.'
  const s2a7 = 'Но я уже все придумал, так что я побежал, мам.'
  const s2a8 = 'Куда ты?'
  const s2aaction1 = 'В суд?'
  const s2aaction2 = 'В администрацию?'
  const s2aaction3 = 'В ЗАГС?'

  const s3a1 = 'Парень только успел выйти, как в квартиру зашел муж женщины.'
  const s3a2 = 'Смотрите, кто вернулся!'
  const s3a3 = 'Столько всего рассказать нужно! Меня окружают одни клоуны.'
  const s3a4 = 'Женщина рассказала мужу про встречу со мной и усадила его тоже пить чай.'
  const s3a5 = 'Я, значит, решил купить младшему скрипку на день рождения. Новую дороговато, зато я нашел скрипку с рук, но такую красивую, совсем без царапин.'
  const s3a6 = 'И что же?'
  const s3a7 = 'Прихожу её забирать. А она без футляра. Продавец говорит – футляр не отдам! В нем его собака спит, представляете?'
  const s3aaction1 = 'Он не имеет права так делать.'
  const s3aaction2 = 'Все правильно. Продает то он скрипку, а не футляр.'

  const s4a1 = 'В общем, ушел я от этого клоуна. Иду по парку, а на дорожке лежит дамская сумочка. Я поднял, а в ней много ценных вещей. По записной книжке нашел владелицу.'
  const s4a2 = 'Вот это да! И решил вернуть ей?'
  const s4a3 = 'Ну конечно. Оказалось, она живет далеко. А мне в тот день уезжать как раз в командировку, времени мало. Решил такси вызвать до нее.'
  const s4a4 = 'Отдал аж 750 руб. Ну, думаю, она будет благодарна, возместит.'
  const s4a5 = 'И что же?'
  const s4a6 = 'А она отказалась. Такая неприятная женщина… Как будто я украл у неё вещи, даже спасибо не сказала.'
  const s4aaction1 = 'Но ведь по закону вы вправе получить вознаграждение!'
  const s4aaction2 = 'Вы молодец. Но что поделаешь, есть такие неблагодарные люди.'

  const s5a1 = 'Я допил свой чай и подумал, что стоит завершить это путешествие и не мешать людям.'
  const s5a2 = 'За этот день я увидел много людей, много разных историй и очень вымотался.'

  function changeText() {
    if (levelName === "") {
      const lesson = lessonsList.find(({ number }) => number === 1);
      if (lesson) {
        setSelectedLevel(lesson);
        setSelectedExerciseText(undefined);
        setExerciseList([]);
        getLessons(lesson.number);
      }
    }
    if (!selectedExerciseText) {
      setLevelName("1");
      setSelectedExerciseText('павп');
    }

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
    if (a === k4a4) {
      setIsAnsweringState(true)
      setAnswerFirst('К сожалению, ты превысил меры допустимого, и теперь тебя ждет наказание.')
      setAnswerSecond('Это была крайняя необходимость. Все будет хорошо.')
    }
    if (a === k5a12) {
      setIsAnsweringState(true)
      setAnswerFirst('Ему-то ничего не будет, ведь ему 14 исполняется только сегодня. За него будутотвечать родители.')
      setAnswerSecond('Парню уже 14 лет, так что его ждет уголовная ответственность. Будет в ответе зато, что натворил.')
    }
    if (a === k6a4) {
      setIsAnsweringState(true)
      setAnswerFirst('Да, конечно.')
      setAnswerSecond('Нет, это же всего лишь маковая соломка.')
    }
    if (a === b1a10) {
      setIsAnsweringState(true)
      setAnswerFirst('Наверное я буду, ведь пешеход всегда прав…')
      setAnswerSecond('В этой ситуации виноват подросток, значит он будет возмещать ущерб.')
    }
    if (a === b2a1) {
      setIsAnsweringState(true)
      setAnswerFirst('Да, сам будет оплачивать.')
      setAnswerSecond('Нет, оплачивать будут родители.')
    }
    if (a === b3a9) {
      setIsAnsweringState(true)
      setAnswerFirst('Я думаю, ваш ректор не прав.')
      setAnswerSecond('Вы зря сердитесь. Ваш ректор прав.')
    }
    if (a === s1a13) {
      setIsAnsweringState(true)
      setAnswerFirst('Странно. Он должен был вернуть часть денег. Ведь Александру только двенадцать лет. Значит, он частично дееспособен и может совершать сделки только с согласия родителей.')
      setAnswerSecond('Так-то он прав, это мелкая бытовая сделка. Он не должен возвращать вам деньги.')
    }
    if (a === s3a7) {
      setIsAnsweringState(true)
      setAnswerFirst('Он не имеет права так делать.')
      setAnswerSecond('Все правильно. Продает то он скрипку, а не футляр.')
    }
    if (a === s4a6) {
      setIsAnsweringState(true)
      setAnswerFirst('Но ведь по закону вы вправе получить вознаграждение!')
      setAnswerSecond('Вы молодец. Но что поделаешь, есть такие неблагодарные люди.')
    }

    setCur(cur + 1)
    setCurrentText(a)
    setCurrentAuthor(user.userName)

    if (cur === 5 || cur === 7 || cur === 9 || cur === 11 || cur === 12 || cur === 13) {
      setCurrentAuthor("Студент")
    }
    if (cur === 18 || cur === 20 || cur === 21 || cur === 22 || cur === 23 || cur === 24 || cur === 25) {
      setCurrentAuthor("Друг")
    }
    if (cur === 35 || cur === 36) {
      setCurrentAuthor("Представитель ГИБДД")
    }
    if (cur === 51) {
      setCurrentAuthor("Парень")
    }
    if (cur === 64 || cur === 66) {
      setCurrentAuthor("Полицейский")
    }
    if (cur === 73 || cur === 75 || cur === 77 || cur === 78 || cur === 79) {
      setCurrentAuthor("Прохожий")
    }
    if (cur === 76) {
      setCurrentAuthor("Мальчик")
    }
    if (cur === 83 || cur === 84 || cur === 85 || cur === 88 || cur === 91) {
      setCurrentAuthor("Азиат")
    }
    if (cur === 96 || cur === 99 || cur === 98 || cur === 102 || cur === 103 || cur === 104 || cur === 105 || cur === 106 || cur === 108 || cur === 112 || cur === 114 || cur === 118 || cur === 121 || cur === 124) {
      setCurrentAuthor("Женщина")
    }
    if (cur === 115 || cur === 117 || cur === 119 || cur === 120 || cur === 123 || cur === 122 || cur === 125) {
      setCurrentAuthor("Муж")
    }
    if (cur === 101 || cur === 104) {
      setCurrentAuthor("Мальчик")
    }
    if (cur === 110 || cur === 111) {
      setCurrentAuthor("Старший сын")
    }

    if (a === p4a1) {
      setBg(b12)
    }
    if (a === p6a3) {
      setBg(b13)
    }
    if (a === p6a6) {
      setBg(b14)
    }
    if (a === k1a1) {
      setBg('/images/b21.jpg')
    }
    if (a === k1a5) {
      setBg('/images/b22.jpg')
    }
    if (a === k5a11) {
      setBg('/images/b23.jpg')
    }
    if (a === b1a1) {
      setBg('/images/b31.jpg')
    }
    if (a === b1a4) {
      setBg('/images/b32.jpg')
    }
    if (a === b3a1) {
      setBg('/images/b33.jpg')
    }
    if (a === s1a1) {
      setBg('/images/b41.jpg')
    }
    if (a === s2a2) {
      setBg('/images/b42.jpg')
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
    if (a === p6a6) { // gg
      setFg(fGg)
    }
    if (a === p7a2) { // solo police
      setFg(b14Fg)
    }
    if (a === p7a5) { // gg
      setFg(fGg)
    }

    if (a === k1a6) {
      setFg('/gays/f2a1.png')
    }
    if (a === k4a3) {
      setFg('/gays/f2s2.png')
    }
    if (a === k5a1) {
      setFg(fGg)
    }
    if (a === k5a5) {
      setFg('/gays/f2s3.png')
    }
    if (a === k5a8) {
      setFg('/gays/f2s4.png')
    }
    if (a === k5a12) {
      setFg('/gays/f2s5.png')
    }
    if (a === b1a1) {
      setFg(fGg)
    }
    if (a === b1a5) {
      setFg('/gays/f3s1.png')
    }
    if (a === b1a7) {
      setFg('/gays/f3s2.png')
    }
    if (a === b3a1) {
      setFg(fGg)
    }
    if (a === b3a3) {
      setFg('/gays/f3s4.png')
    }
    if (a === b3a7) {
      setFg('/gays/f3s5.png')
    }
    if (a === s1a1) {
      setFg(fGg)
    }
    if (a === s1a3) {
      setFg('/gays/f4s2.png')
    }
    if (a === s2a5) {
      setFg('/gays/f4s3.png')
    }
    if (a === s3a1) {
      setFg('/gays/f4s5.png')
    }
  }

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
    p9a2,
    k1a1,
    k1a2,
    k1a3,
    k1a4,
    k1a5,
    k1a6,
    k1a7,
    k4a1,
    k4a2,
    k4a3,
    k4a4,
    k5a1,
    k5a2,
    k5a3,
    k5a4,
    k5a5,
    k5a6,
    k5a7,
    k5a8,
    k5a9,
    k5a10,
    k5a11,
    k5a12,
    k6a1,
    k6a2,
    k6a3,
    k6a4,
    k7a1,
    b1a1,
    b1a2,
    b1a3,
    b1a4,
    b1a5,
    b1a6,
    b1a7,
    b1a8,
    b1a9,
    b1a10,
    b2a1,
    b3a1,
    b3a2,
    b3a3,
    b3a4,
    b3a5,
    b3a6,
    b3a7,
    b3a8,
    b3a9,
    b4a1,
    b5a1,
    b6a1,
    b6a2,
    s1a1,
    s1a2,
    s1a3,
    s1a4,
    s1a5,
    s1a6,
    s1a7,
    s1a8,
    s1a9,
    s1a10,
    s1a11,
    s1a12,
    s1a13,
    s2a2,
    s2a3,
    s2a4,
    s2a5,
    s2a6,
    s2a7,
    s2a8,
    s3a1,
    s3a2,
    s3a3,
    s3a4,
    s3a5,
    s3a6,
    s3a7,
    s4a1,
    s4a2,
    s4a3,
    s4a4,
    s4a5,
    s4a6,
    s5a1,
    s5a2];

  return (
    <div className={classes.root}>
      <Grid container spacing={0}>
      <Grid item xs={5}>
        <img
          style={ { backgroundImage: `url(${bg})` } }
          src={fg}
          width="700"
          height="800"
          onClick={handleStartExercise}
        />
        </Grid>
        <Grid item xs={5}>
        <Grid container direction="column" alignItems="center">
        <Grid container direction="row" wrap="wrap" justify="flex-start" className={classes.grid}>
        { isStartedExercise ? <strong className={classes.timer}>{currentAuthor}</strong> : null }
        </Grid>
        <Grid container direction="row" wrap="wrap" justify="flex-start" className={classes.grid}>
                <strong className={classes.timer}>{currentText}</strong>
        </Grid>
        <Grid container direction="row" wrap="wrap" justify="center" className={classes.grid}>
        <Grid container direction="row" wrap="wrap" justify="center" className={classes.grid}>
            { !isStartedExercise ? <Button
                size="large"
                variant="outlined"
                color={isStartedExercise ? 'secondary' : 'primary'}
                onClick={handleStartExercise}
            >
                {isStartedExercise ? 'Остановить' : 'Начать'}
            </Button> : null }
            </Grid>
            <Grid container direction="row" wrap="wrap" justify="center" className={classes.grid}>
            { isAnsweringState ? <Button
                    size="large"
                    variant="outlined"
                    color={isStartedExercise ? 'secondary' : 'primary'}
                    onClick={handleA}
                >
                    { answerFirst }
                </Button> : null }
            </Grid>
            <Grid container direction="row" wrap="wrap" justify="center" className={classes.grid}>
            { isAnsweringState ? <Button
                    size="large"
                    variant="outlined"
                    color={isStartedExercise ? 'secondary' : 'primary'}
                    onClick={handleB}
                >
                    { answerSecond }
                </Button> : null }
            </Grid>
        </Grid>
        <TextModal
            label="Весь тест пройден"
            text={`Результат: ${countErrors} ошибок. Круто.`}
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