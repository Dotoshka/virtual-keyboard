import ru from './ru.js'
import en from './en.js'

const languages = { ru, en };

const rowsOrder = [
  ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
  ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
  ['Done', 'ControlLeft', 'AltLeft', 'MetaLeft', 'Space', 'MetaRight', 'AltRight', 'ArrowLeft', 'ArrowRight'],
];


// window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// const recognition = new SpeechRecognition();
// recognition.interimResults = true;
// console.log(recognition);
// recognition.lang = 'en-US';

// recognition.addEventListener('result', e => {
//   console.log(e.results);
//   const transcript = Array.from(e.results)
//     .map(result => result[0])
//     .map(result => result.transcript)
//     .join('');

//   console.log(transcript);

// });

// recognition.addEventListener('end', recognition.start);

// window.addEventListener("DOMContentLoaded", function () {
//   Keyboard.init('en');
// });



class Key {
  constructor({ small, shift, code }) {
    this.code = code;
    this.small = small;
    this.shift = shift;
    this.isFnKey = Boolean(shift === null);
    this.keyElement = document.createElement("button");
    this.keyElement.setAttribute("type", "button");
    this.keyElement.classList.add("keyboard__key");
    this.keyElement.dataset.code = code;
    this.isFnKey ? this.keyElement.dataset.fn = true : this.keyElement.dataset.fn = false;
    this.isLetter = this.checkLetters(this.small);
    //this.isLetter ? this.keyElement.dataset.letter = true : this.keyElement.dataset.letter = false;
    //this.isFnKey ? this.keyElement.classList.add("keyboard__key--wide") : this.keyElement.classList;

    // Creates HTML for an icon

    switch (code) {
      case "Backspace":
        this.keyElement.innerHTML = this.createIconHTML("backspace");
        break;
      case "Tab":
        this.keyElement.innerHTML = this.createIconHTML("keyboard_tab");
        break;
      case "CapsLock":
        this.keyElement.classList.add("keyboard__key--activatable");
        this.keyElement.innerHTML = this.createIconHTML("keyboard_capslock");
        break;
      // case "ShiftLeft":
      // case "ShiftRight":
      //   this.keyElement.innerHTML = this.createIconHTML("keyboard_return");
      //   break;
      case "Enter":
        this.keyElement.innerHTML = this.createIconHTML("keyboard_return");
        break;
      case "Done":
        this.keyElement.innerHTML = this.createIconHTML("keyboard_hide");
        break;
      case "ControlLeft":
        this.keyElement.innerHTML = `${this.createIconHTML("language")}<br>${lang}`;
        break;
      case "AltLeft":
        this.keyElement.innerHTML = this.createIconHTML("volume_up");
        break;
      case "AltRight":
        this.keyElement.innerHTML = this.createIconHTML("mic");
        break;
      default:
        this.keyElement.innerHTML = small;
        break;
    }
  }
  createIconHTML = (icon_name) => `<i class="material-icons">${icon_name}</i>`;
  //createIconApple = (icon_name) => `<i class="material-icons">${icon_name}</i>`;
  checkLetters = (small) => {
    if (Boolean(small.match(/^[a-zA-Zа-яА-ЯёЁ]{1}$/))) {
      this.keyElement.dataset.letter = true;
      return true;
    } else {
      this.keyElement.dataset.letter = false;
      return false;
    }
  }
}

class Keyboard {

  constructor(rowsOrder) {
    this.rowsOrder = rowsOrder;
    //console.log(rowsOrder);
    this.keysPressed = {};
    this.isCaps = false;
    this.isShift = false;
    this.soundOn = false;
    this.voiceOn = false;
  }

  // elements: {
  //   main: null,
  //   keysContainer: null,
  //   keys: []
  // },

  // eventHandlers: {
  //   oninput: null,
  //   onclose: null
  // },

  // properties: {
  //   value: "",
  //   capsLock: false
  // },

  init(langCode) {
    // Create main elements
    this.keyBase = languages[langCode];
    // console.log(this.keyBase);

    this.main = document.createElement("div");
    this.keysContainer = document.createElement("div");

    // Setup main elements
    this.main.classList.add("keyboard", "1keyboard--hidden");
    this.keysContainer.classList.add("keyboard__keys");
    this.main.dataset.language = langCode;
    //this.keysContainer.appendChild(this.createKeys());
    //this.keys = this.keysContainer.querySelectorAll(".keyboard__key");
    //console.log(this.keys);
    // Add to DOM
    this.main.appendChild(this.keysContainer);
    document.body.prepend(this.main);

    this.output = document.querySelector(".use-keyboard-input");
    this.output.addEventListener("focus", () => this.open());
    //this.output.focus();

    // document.querySelectorAll(".use-keyboard-input").forEach(element => {
    //     element.addEventListener("focus", () => {
    //       this.open();
    //     })
    // })

    // Automatically use keyboard for elements with .use-keyboard-input
    // document.querySelectorAll(".use-keyboard-input").forEach(element => {
    //   element.addEventListener("focus", () => {
    //     this.open(element.value, currentValue => {
    //       element.value = currentValue;
    //     });
    //   });
    // });

    return this;
  }

  createKeys() {
    this.keyButtons = [];
    this.rowsOrder.forEach((row, i) => {
      const rowElement = document.createElement("div");
      //console.log(rowElement);
      rowElement.classList.add("keyboard__row");
      rowElement.dataset.row = i + 1;
      this.keysContainer.appendChild(rowElement);
      //const rowElement = create('div', 'keyboard__row', null, this.container, ['row', i + 1]);
      //rowElement.style.gridTemplateColumns = `repeat(${row.length}, 1fr)`;
      row.forEach((code) => {
        const keyObj = this.keyBase.find((key) => key.code === code);
        if (keyObj) {
          const keyButton = new Key(keyObj);
          this.keyButtons.push(keyButton);
          rowElement.appendChild(keyButton.keyElement);
        }
      });
    });

    document.addEventListener('keydown', this.pressHandleEvent);
    document.addEventListener('keyup', this.pressHandleEvent);
    //this.keysContainer.onmousedown = this.preHandleEvent;
    //this.keysContainer.onmouseup = this.preHandleEvent;
    //document.addEventListener('keypress', this.handleEvent);
    this.keysContainer.addEventListener('click', this.clickHandleEvent);

  }

  clickHandleEvent = (event) => {
    //event.stopPropagation();
    this.output.focus();
    const keyBtn = event.target.closest('.keyboard__key');
    if (!keyBtn) return;
    const code = keyBtn.dataset.code;
    const keyObj = this.keyButtons.find((key) => key.code === code);

    switch (code) {
      case 'CapsLock':
        this.isCaps = !this.isCaps;
        console.log(this.isCaps);
        keyBtn.classList.toggle('active', this.isCaps);
        keyBtn.classList.toggle('keyboard__key--active', this.isCaps);
        this.switchCase();
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isShift = !this.isShift;
        console.log(this.isShift);
        const shiftLeft = this.keyButtons.find((key) => key.code === 'ShiftLeft');
        const shiftRight = this.keyButtons.find((key) => key.code === 'ShiftRight');
        shiftLeft.keyElement.classList.toggle('active', this.isShift);
        shiftRight.keyElement.classList.toggle('active', this.isShift);
        this.switchCase();
        break;
      case 'Done':
        this.close();
        break;
      case 'ControlLeft':
        this.switchLanguage();
        keyBtn.innerHTML = `${keyObj.createIconHTML("language")}<br>${this.main.dataset.language}`;
        break;
      case 'AltLeft':
        this.soundOn = !this.soundOn
        keyBtn.classList.toggle('active', this.soundOn);
        if (this.soundOn) {
          keyBtn.innerHTML = keyObj.createIconHTML("volume_off");
          this.keysContainer.addEventListener('click', this.playSound);
          document.addEventListener('keydown', this.playSound);
        } else {
          keyBtn.innerHTML = keyObj.createIconHTML("volume_up");
          this.keysContainer.removeEventListener('click', this.playSound);
          document.removeEventListener('keydown', this.playSound);
        }
        break;
      case 'AltRight':
        this.voiceOn = !this.voiceOn;
        console.log(this.voiceOn);
        keyBtn.classList.toggle('active', this.voiceOn);
        if (this.voiceOn) {
          this.recognizeSpeech();
          keyBtn.innerHTML = keyObj.createIconHTML("mic_off");
          recognition.addEventListener('end', recognition.start);
          recognition.start();
        } else {
          keyBtn.innerHTML = keyObj.createIconHTML("mic");
          recognition.removeEventListener('end', recognition.start);
          recognition.stop();
        }
        break;
    }

    this.printToOutput(keyObj, keyObj.keyElement.innerText);

    if (keyBtn.classList.contains("active")) {
      this.keysPressed[keyObj.code] = keyObj;
      //console.log(this.keysPressed);
    } else {
      delete this.keysPressed[keyObj.code];
      //console.log(this.keysPressed);
    }
  };

  pressHandleEvent = (event) => {
    if (event.stopPropagation) event.stopPropagation();
    const type = event.type;
    const code = event.code;

    const keyObj = this.keyButtons.find((key) => key.code === code);
    if (!keyObj) return;
    const keyBtn = keyObj.keyElement;
    this.output.focus();
    console.log(type);
    console.log(code);

    if (code === 'CapsLock') {
      event.preventDefault();
      this.isCaps = !this.isCaps;
      //console.log(this.isCaps);
      keyBtn.classList.toggle('active', this.isCaps);
      keyBtn.classList.toggle('keyboard__key--active', this.isCaps);
      this.switchCase();
    }

    if (type === 'keydown') {
      event.preventDefault();

      switch (code) {
        case 'ShiftLeft':
        case 'ShiftRight':
          this.isShift = !this.isShift;
          console.log(this.isShift);
          const shiftLeft = this.keyButtons.find((key) => key.code === 'ShiftLeft');
          const shiftRight = this.keyButtons.find((key) => key.code === 'ShiftRight');
          shiftLeft.keyElement.classList.toggle('active', this.isShift);
          shiftRight.keyElement.classList.toggle('active', this.isShift);
          this.switchCase();
          break;
        case 'ControlLeft':
          this.switchLanguage();
          keyBtn.innerHTML = `${keyObj.createIconHTML("language")}<br>${this.main.dataset.language}`;
          break;
        case 'AltLeft':
          this.soundOn = !this.soundOn
          keyBtn.classList.toggle('active', this.soundOn);
          if (this.soundOn) {
            keyBtn.innerHTML = keyObj.createIconHTML("volume_off");
            this.keysContainer.addEventListener('click', this.playSound);
            document.addEventListener('keydown', this.playSound);
          } else {
            keyBtn.innerHTML = keyObj.createIconHTML("volume_up");
            this.keysContainer.removeEventListener('click', this.playSound);
            document.removeEventListener('keydown', this.playSound);
          }
          break;
        case 'AltRight':
          this.voiceOn = !this.voiceOn;
          console.log(this.voiceOn);
          keyBtn.classList.toggle('active', this.voiceOn);
          if (this.voiceOn) {
            this.recognizeSpeech();
            keyBtn.innerHTML = keyObj.createIconHTML("mic_off");
            recognition.addEventListener('end', recognition.start);
            recognition.start();
          } else {
            keyBtn.innerHTML = keyObj.createIconHTML("mic");
            recognition.removeEventListener('end', recognition.start);
            recognition.stop();
          }
          break;
        default:
          keyObj.keyElement.classList.add('active');
          break;
      }

      this.printToOutput(keyObj, keyObj.keyElement.innerText);

    } else if (type === 'keyup') {

      switch (code) {
        case 'ShiftLeft':
        case 'ShiftRight':
        case 'ControlLeft':
        case 'AltLeft':
        case 'AltRight':
          break;
        default:
          keyObj.keyElement.classList.remove('active');
          break;
      }
    }
  }

  switchCase = () => {

    this.keyButtons.forEach((button) => {

      if (button.isFnKey) return;
      if (this.isCaps && !this.isShift) {
        if (button.isLetter) {
          button.keyElement.innerHTML = button.shift;
        }
      } else if (!this.isCaps && this.isShift) {
        button.keyElement.innerHTML = button.shift;
      } else if (this.isCaps && this.isShift) {
        if (button.isLetter) {
          button.keyElement.innerHTML = button.small;
        } else {
          button.keyElement.innerHTML = button.shift;
        }
      } else {
        button.keyElement.innerHTML = button.small;
      }

    })
  }

  printToOutput(keyObj, symbol) {
    let cursorPos = this.output.selectionStart;
    const left = this.output.value.slice(0, cursorPos);
    const right = this.output.value.slice(cursorPos);

    switch (keyObj.code) {
      case 'Backspace':
        this.output.value = `${left.slice(0, -1)}${right}`;
        cursorPos -= 1;
        break;
      case 'Tab':
        this.output.value = `${left}\t${right}`;
        cursorPos += 1;
        break;
      case 'Enter':
        this.output.value = `${left}\n${right}`;
        cursorPos += 1;
        break;
      case 'Space':
        this.output.value = `${left} ${right}`;
        cursorPos += 1;
        break;
      case 'ArrowLeft':
        cursorPos = cursorPos - 1 >= 0 ? cursorPos - 1 : 0;
        break;
      case 'ArrowRight':
        cursorPos += 1;
        break;
      default:
        if (!keyObj.isFnKey) {
          this.output.value = `${left}${symbol || ''}${right}`;
          cursorPos += 1;
        }
        break;
    }

    this.output.setSelectionRange(cursorPos, cursorPos);

  }

  switchLanguage = () => {
    let currLang = this.main.dataset.language;
    //console.log(currLang);
    const langAbbr = Object.keys(languages);
    //console.log(langAbbr);
    let currLangIndex = langAbbr.indexOf(currLang);
    let nextLangIndex = currLangIndex + 1 < langAbbr.length ? currLangIndex + 1 : 0;
    //console.log(currLangIndex);
    //console.log(nextLangIndex);

    this.keyBase = languages[langAbbr[nextLangIndex]];
    //console.log(this.keyBase);
    this.main.dataset.language = langAbbr[nextLangIndex];
    recognition.lang = this.main.dataset.language;
    //console.log(recognition.lang);
    //console.log(recognition.lang);
    window.localStorage.setItem('kbLang', langAbbr[nextLangIndex]);

    this.keyButtons.forEach((button) => {
      if (button.isFnKey) return;
      const keyObj = this.keyBase.find((key) => key.code === button.code);
      if (!keyObj) return;
      button.shift = keyObj.shift;
      button.small = keyObj.small;
      button.keyElement.innerHTML = keyObj.small;
      button.isLetter = button.checkLetters(button.small);
      //this.isCaps = false;
      //this.isShift = false;
      this.switchCase();
    });
  }

  playSound = (event) => {

    let currLang = this.main.dataset.language;
    const keysAudio = document.querySelector(`audio[data-language="${currLang}"]`);
    if (!keysAudio) return;

    if (event.type === 'click') {
      const keyBtn = event.target.closest('.keyboard__key');
      if (!keyBtn) return;
    } else if (event.type === 'keydown') {
      const keyObj = this.keyButtons.find((key) => key.code === event.code);
      if (!keyObj) return;
    }

    keysAudio.currentTime = 0;
    keysAudio.play();
    
  }

  recognizeSpeech = () => {
    let cursorPos = this.output.selectionStart;
    let left = this.output.value.slice(0, cursorPos);
    let right = this.output.value.slice(cursorPos);

    recognition.addEventListener('result', e => {

      const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      this.output.value = `${left}${transcript} ${right}`;

      if (e.results[0].isFinal) {
        cursorPos += transcript.length + 1;
        this.output.setSelectionRange(cursorPos, cursorPos);
        left = this.output.value.slice(0, cursorPos);
        right = this.output.value.slice(cursorPos);
      }

    });
  }

  // resetPressedButtons = (targetCode) => {
  //   if (!this.keysPressed[targetCode]) return;
  //   if (!this.isCaps) this.keysPressed[targetCode].div.classList.remove('active');
  //   this.keysPressed[targetCode].div.removeEventListener('mouseleave', this.resetButtonState);
  //   delete this.keysPressed[targetCode];
  // }

  open() {
    //this.properties.value = initialValue || "";
    //this.eventHandlers.oninput = oninput;
    //this.eventHandlers.onclose = onclose;
    this.main.classList.remove("keyboard--hidden");
  }

  close() {
    //this.properties.value = "";
    //this.eventHandlers.oninput = oninput;
    //this.eventHandlers.onclose = onclose;
    this.main.classList.add("keyboard--hidden");
    this.output.blur();
  }
};

// Speech recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;

const lang = window.localStorage.getItem('kbLang') || 'en';

recognition.lang = lang;
//console.log(recognition.lang);
new Keyboard(rowsOrder).init(lang).createKeys();