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



// window.addEventListener("DOMContentLoaded", function () {
//   Keyboard.init('en');
// });



class Key {
  constructor({ small, shift, code }) {
    this.code = code;
    this.small = small;
    this.shift = shift;
    this.isFnKey = Boolean(shift === null);
    this.isLetter = Boolean(small.match(/^[a-zа-я]{1}$/));
    this.keyElement = document.createElement("button");
    this.keyElement.setAttribute("type", "button");
    this.keyElement.classList.add("keyboard__key");
    this.keyElement.dataset.code = code;
    this.isFnKey ? this.keyElement.dataset.fn = true : this.keyElement.dataset.fn = false;
    this.isLetter ? this.keyElement.dataset.letter = true : this.keyElement.dataset.letter = false;
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
        this.keyElement.classList.add("keyboard__key--dark");
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
  createIconApple = (icon_name) => `<i class="material-icons">${icon_name}</i>`;
}

class Keyboard {

  constructor(rowsOrder) {
    this.rowsOrder = rowsOrder;
    //console.log(rowsOrder);
    //this.keysPressed = {};
    this.isCaps = false;
    this.isShift = false;
    this.soundOn = false;
    this.speechRecognition = false;
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

    document.addEventListener('keydown', this.handleEvent);
    document.addEventListener('keyup', this.handleEvent);
    //this.keysContainer.onmousedown = this.preHandleEvent;
    //this.keysContainer.onmouseup = this.preHandleEvent;
    //document.addEventListener('keypress', this.handleEvent);
    this.keysContainer.addEventListener('click', this.clickHandleEvent)

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
        } else {
          keyBtn.innerHTML = keyObj.createIconHTML("volume_up");
        }
        //this.playSound();
        break;
      case 'AltRight':
        this.speechRecognition = !this.speechRecognition
        keyBtn.classList.toggle('active', this.speechRecognition);
        if (this.speechRecognition) {
          keyBtn.innerHTML = keyObj.createIconHTML("mic_off");
        } else {
          keyBtn.innerHTML = keyObj.createIconHTML("mic");
        }
        //this.recognizeSpeech();
        break;
    }

    this.printToOutput(keyObj, keyObj.keyElement.innerHTML);

    // if (!this.isCaps) {
    //   this.printToOutput(keyObj, this.isShift ? keyObj.shift : keyObj.small);
    // } else if (this.isCaps) {
    //     if (this.isShift) {
    //     this.printToOutput(keyObj, keyObj.isLetter ? keyObj.small : keyObj.shift);
    //   } else {
    //     this.printToOutput(keyObj, keyObj.isLetter ? keyObj.shift : keyObj.small);
    //   }
    // }
  };

  handleEvent = (event) => {
    if (event.stopPropagation) event.stopPropagation();
    const type = event.type;
    const code = event.code;
    const keyObj = this.keyButtons.find((key) => key.code === code);
    if (!keyObj) return;
    this.output.focus();
    console.log(type);
    console.log(code);
    //if (type === 'keydown') event.preventDefault();
    if (type === 'keydown' || type === 'mousedown') {

      //console.log(code.match(/Caps/));
      //keyObj.keyElement.classList.add('active');

      switch (code) {
        // case 'CapsLock':
        //   this.isCaps = !this.isCaps;
        //   console.log(this.isCaps);
        //   keyObj.keyElement.classList.toggle('active', this.isCaps);
        //   break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.isShift = !this.isShift;
          console.log(this.isShift);
          const shiftLeft = this.keyButtons.find((key) => key.code === 'ShiftLeft');
          const shiftRight = this.keyButtons.find((key) => key.code === 'ShiftRight');
          shiftLeft.keyElement.classList.toggle('active', this.isShift);
          shiftRight.keyElement.classList.toggle('active', this.isShift);
          //keyObj.keyElement.classList.toggle('active', this.isShift);
          break;
        default:
          keyObj.keyElement.classList.add('active');
          break;
      }



    } else if (type === 'keyup' || type === 'mouseup') {

      if (!code.match(/Caps/) && !code.match(/Shift/)) {
        keyObj.keyElement.classList.remove('active');
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
    console.log(currLang);
    const langAbbr = Object.keys(languages);
    console.log(langAbbr);
    let currLangIndex = langAbbr.indexOf(currLang);
    let nextLangIndex = currLangIndex + 1 < langAbbr.length ? currLangIndex + 1 : 0;
    console.log(currLangIndex);
    console.log(nextLangIndex);

    this.keyBase = languages[langAbbr[nextLangIndex]];
    console.log(this.keyBase);
    this.main.dataset.language = langAbbr[nextLangIndex];
    window.localStorage.setItem('kbLang',langAbbr[nextLangIndex]);

    this.keyButtons.forEach((button) => {
      if (button.isFnKey) return;
      const keyObj = this.keyBase.find((key) => key.code === button.code);
      if (!keyObj) return;
      button.shift = keyObj.shift;
      button.small = keyObj.small;
      button.keyElement.innerHTML = keyObj.small;
    });
  }


  // _createKeys() {
  //   const fragment = document.createDocumentFragment();
  //   const keyLayout = [
  //     "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
  //     "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
  //     "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
  //     "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
  //     "space"
  //   ];

  //   // Creates HTML for an icon
  //   const createIconHTML = (icon_name) => {
  //     return `<i class="material-icons">${icon_name}</i>`;
  //   };

  //   keyLayout.forEach(key => {
  //     const keyElement = document.createElement("button");
  //     const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

  //     // Add attributes/classes
  //     keyElement.setAttribute("type", "button");
  //     keyElement.classList.add("keyboard__key");

  //     switch (key) {
  //       case "backspace":
  //         keyElement.classList.add("keyboard__key--wide");
  //         keyElement.innerHTML = createIconHTML("backspace");

  //         keyElement.addEventListener("click", () => {
  //           this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
  //           this._triggerEvent("oninput");
  //         });

  //         break;

  //       case "caps":
  //         keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
  //         keyElement.innerHTML = createIconHTML("keyboard_capslock");

  //         keyElement.addEventListener("click", () => {
  //           this._toggleCapsLock();
  //           keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
  //         });

  //         break;

  //       case "enter":
  //         keyElement.classList.add("keyboard__key--wide");
  //         keyElement.innerHTML = createIconHTML("keyboard_return");

  //         keyElement.addEventListener("click", () => {
  //           this.properties.value += "\n";
  //           this._triggerEvent("oninput");
  //         });

  //         break;

  //       case "space":
  //         keyElement.classList.add("keyboard__key--extra-wide");
  //         keyElement.innerHTML = createIconHTML("space_bar");

  //         keyElement.addEventListener("click", () => {
  //           this.properties.value += " ";
  //           this._triggerEvent("oninput");
  //         });

  //         break;

  //       case "done":
  //         keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
  //         keyElement.innerHTML = createIconHTML("check_circle");

  //         keyElement.addEventListener("click", () => {
  //           this.close();
  //           this._triggerEvent("onclose");
  //         });

  //         break;

  //       default:
  //         keyElement.textContent = key.toLowerCase();

  //         keyElement.addEventListener("click", () => {
  //           this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
  //           this._triggerEvent("oninput");
  //         });

  //         break;
  //     }

  //     fragment.appendChild(keyElement);

  //     if (insertLineBreak) {
  //       fragment.appendChild(document.createElement("br"));
  //     }
  //   });

  //   return fragment;
  // },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  }

  // _toggleCapsLock() {
  //   this.properties.capsLock = !this.properties.capsLock;

  //   for (const key of this.elements.keys) {
  //     if (key.childElementCount === 0) {
  //       key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
  //     }
  //   }
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


// document.addEventListener('keydown', (event) => {
//   const keyName = event.key;
//   console.log(event.code);
// })

const lang = window.localStorage.getItem('kbLang') || 'ru';
new Keyboard(rowsOrder).init(lang).createKeys();