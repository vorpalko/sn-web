/*eslint-disable */
import React, { Component } from "react";
import "./styles.css";
import { getNum } from "../../texts/numLine";
import { getArrOfText } from "./getArrOfText";

import Keyboard from "./Keyboard";
import TextField from "../TextField/TextField";
import InputTextField from "../InputText/InputText";
import TopLine from "../TopLine/TopLine";
import Progress from "../Progress/Progress";

const TIMER_TIME = 100;

interface FullKeyboardProps {
  isStarted: boolean;
  maxErrors: number | undefined;
  keyPressTime: number | undefined;
  text: string | undefined;
  onGetError: Function;
  onEndTimeKeyPress: Function;
  onTimerTimeChange: Function;
  onFinish: Function;
}

const initialState = {
  engLang: false,
  activeString: "",
  value: "",
  fullTextArr: null,
  threeStringElements: null,
  index: Math.floor(Math.random() * 9999),
  indexLetter: 0,
  error: false,
  maxErrors: 0,
  keyPressTime: 0,
  autoBackspace: false,
  backspace: false,
  lengthOfErrorString: null,
  errorCount: 0,
  timerTime: 0,
  errorStat: 0,
  inputText: false,
  progress: {}
} as Record<string, any> & {fullTextArr: any[] | null};
export class FullKeyboard extends Component<FullKeyboardProps> {
  state = initialState;
  timer: any = null;
  componentDidMount() {
    let autoBackspace = false;

    // if (localStorage.getItem("autoBackspace")) {
    //   autoBackspace = JSON.parse(localStorage.getItem("autoBackspace") || "");
    // }

    this.setState({
      autoBackspace,
    });
  }

  handleGetError = (count: number) => {
    this.props.onGetError(count);
  }

  handleEndTimeKeyPress = () => {
    this.props.onEndTimeKeyPress();
  }

  handleTimerTimeChange = (time: number) => {
    this.props.onTimerTimeChange(time);
  }

  handleKeyboardFinish = () => {
    this.props.onFinish();
  }

  componentDidUpdate(prevProps: FullKeyboardProps){
    const {isStarted, text, maxErrors, keyPressTime} = this.props;
    if(prevProps.isStarted === isStarted) {
      return;
    }

    if(isStarted) {
      this.setState({pressKeyTime: maxErrors, keyPressTime}, () => {
        this.initApp(text);
      })
    } else {
      this.setState(initialState);
      this.stopTimer();
    }
  }

  initApp = (text = "") => {
    setTimeout(() => {
      const index = this.state.index;
      const fullTextArr = getArrOfText(this.state.engLang, text);

      const threeStringElements = this.getThreeStringElements(
        index,
        fullTextArr
      );

      this.setState({
        fullTextArr,
        threeStringElements,
        value: "",
        indexLetter: 0,
        error: false
      });
    }, 10);
  };

  setActiveString = (str: string) => {
    this.setState({
      activeString: str
    });
  };

  getThreeStringElements = (index: any, arr = this.state.fullTextArr) => {
    if (Array.isArray(arr) && arr.length > 0) {
      let arrThreeStringsElements = [];

      for (let i = 0; i < 3; i++) {
        const length = arr.length;
        const newIndex = (index + i) % length;

        const stringElem = {
          text: arr[newIndex],
          id: arr[newIndex] + performance.now()
        };
        if (i === 0) {
          this.setActiveString(stringElem.text);
        }
        arrThreeStringsElements.push(stringElem);
      }

      return arrThreeStringsElements;
    }

    return null;
  };

  updateTimerToError = () => {
    this.setState(({ timerTime }: any) => {
      this.stopTimer();
      const newTime = timerTime - TIMER_TIME
      if(newTime <= 0) {
        this.handleEndTimeKeyPress();
        return;
      }
      this.handleTimerTimeChange(newTime);
      this.resumeTimer();
      return { timerTime: newTime };
    });
  }

  stopTimer = () => {
    if(this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  resumeTimer = () => {
    this.timer = setTimeout(() => this.updateTimerToError(), TIMER_TIME);
  }

  startTimer = () => {
    this.setState(({ keyPressTime }: any) => ({
        timerTime: keyPressTime
      }),
      () => this.resumeTimer()
    )
  }

  checkValue = (str: string) => {
    this.stopTimer();
    this.startTimer();
    let value = str;
    let error = false;
    const activeString = this.state.activeString;

    const length = str.length;
    const partOfActiveString = activeString.slice(0, length);

    if (str === partOfActiveString) {
      if (length === activeString.length) {
        this.changeIndex();
        this.handleKeyboardFinish();
        return;
      }
      this.setState({
        inputText: true,
        value,
        error,
        lengthOfErrorString: null,
        indexLetter: str.length,
        backspace: false,
      });
    } else {
      error = true;
      this.setState((prevState: any) => {
        let errorCount = prevState.errorCount;
        const { lengthOfErrorString, maxErrors } = prevState;
        const length = str.length;
        if (!prevState.lengthOfErrorString) {
          errorCount++;
          this.handleGetError(errorCount);
        } else if (lengthOfErrorString <= length) {
          errorCount++;
          this.handleGetError(errorCount);
        }

        return {
          inputText: true,
          error: true,
          backspace: true,
          lengthOfErrorString: str.length,
          value,
          errorCount
        };
      });
    }

    if (length === activeString.length && !error) {
      this.changeIndex();
    }
  };

  changeIndex = () => {
    let index = this.state.index + 1;

    const threeStringElements = this.getThreeStringElements(index);
    this.setState((prevState: any) => {
      let errorStat = prevState.errorCount

      return {
        inputText: false,
        index,
        threeStringElements,
        value: "",
        indexLetter: 0,
        error: false,
        errorCount: 0,
        errorStat
      };
    });
  };

  autoBackspaceHandle = () => {
    this.setState((prevState: any) => {
      //@ts-ignore
      localStorage.setItem("autoBackspace", !prevState.autoBackspace);
      return {
        autoBackspace: !prevState.autoBackspace
      };
    });
  };

  changeLanguage = (value: string, text: string) => {
    console.log(value, text)
    if (value === "eng") {
      this.setState({
        engLang: true
      });
    } else if (value === "ru") {
      this.setState({
        engLang: false
      });
    } else if (value === "myEng") {
      this.changeLanguage("eng", text);
      return;
    } else if (value === "myRu") {
      this.changeLanguage("ru", text);
      return;
    } else if (value === "engNum") {
      this.changeLanguage("eng", getNum("eng"));
      return;
    } else if (value === "ruNum") {
      this.changeLanguage("ru", getNum("ru"));
      return;
    }

    this.initApp(text);
  };

  newAchievement = (options: any) => {
    this.setState((prevState: any) => {
      const progress = { ...prevState.progress };

      const newAch = {
        achievement: options.lastSpeed,
        date: new Date()
      };

      progress[options.lang].push(newAch);

      localStorage.setItem("progress", JSON.stringify(progress));

      return {
        progress
      };
    });
  };

  deleteAchievement = (index: number, lang: string) => {
    this.setState((prevState: any) => {
      let progress = { ...prevState.progress };

      progress[lang].splice(index, 1);

      localStorage.setItem("progress", JSON.stringify(progress));

      return {
        progress
      };
    });
  };

  render() {
    const index = this.state.indexLetter;
    const str = this.state.activeString;
    let character = str !== "" ? str[index] : "";
    if (this.state.error) {
      if (!this.state.autoBackspace) {
        character = "Backspace";
      }
    }

    return (
      <div className="app">
        {/* <TopLine
          value={this.state.value}
          length={this.state.activeString.length}
          changeLanguage={this.changeLanguage}
          inputText={this.state.inputText}
          errorStat={this.state.errorStat}
          engLang={this.state.engLang}
          progress={this.state.progress}
          newAchievement={this.newAchievement}
        /> */}
        <InputTextField
          handleChange={this.checkValue}
          isStarted={this.props.isStarted}
          error={this.state.error}
          value={this.state.value}
          autoBackspace={this.state.autoBackspace}
          backspace={this.state.backspace}
        />
        <TextField text={this.state.threeStringElements} index={index} />
        <Keyboard
          character={character}
          engLang={this.state.engLang}
          autoBackspaceHandle={this.autoBackspaceHandle}
          autoBackspace={this.state.autoBackspace}
        />
      </div>
    );
  }
}
