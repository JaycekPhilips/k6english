(function () {
  var isChinesePage = document.documentElement.lang === "zh-CN";
  var vocabulary = [
    ["apple", "苹果"], ["banana", "香蕉"], ["pear", "梨"], ["orange", "橙子"],
    ["watermelon", "西瓜"], ["grape", "葡萄"], ["strawberry", "草莓"], ["cat", "猫"],
    ["dog", "狗"], ["monkey", "猴子"], ["elephant", "大象"], ["panda", "熊猫"],
    ["tiger", "老虎"], ["bird", "鸟"], ["fish", "鱼"], ["duck", "鸭子"],
    ["chicken", "鸡"], ["cow", "奶牛"], ["sheep", "绵羊"], ["horse", "马"],
    ["rabbit", "兔子"], ["bear", "熊"], ["father", "爸爸"], ["mother", "妈妈"],
    ["brother", "兄弟"], ["sister", "姐妹"], ["teacher", "老师"], ["student", "学生"],
    ["friend", "朋友"], ["school", "学校"], ["classroom", "教室"], ["library", "图书馆"],
    ["playground", "操场"], ["bedroom", "卧室"], ["kitchen", "厨房"], ["bathroom", "浴室"],
    ["table", "桌子"], ["chair", "椅子"], ["desk", "课桌"], ["book", "书"],
    ["pencil", "铅笔"], ["pen", "钢笔"], ["ruler", "尺子"], ["eraser", "橡皮"],
    ["bag", "书包"], ["crayon", "蜡笔"], ["notebook", "笔记本"], ["door", "门"],
    ["window", "窗户"], ["blackboard", "黑板"], ["red", "红色"], ["blue", "蓝色"],
    ["yellow", "黄色"], ["green", "绿色"], ["white", "白色"], ["black", "黑色"],
    ["big", "大的"], ["small", "小的"], ["happy", "开心的"], ["hungry", "饿的"],
    ["beautiful", "美丽的"], ["morning", "早上"], ["weather", "天气"], ["breakfast", "早餐"],
    ["lunch", "午餐"], ["dinner", "晚餐"], ["bread", "面包"], ["rice", "米饭"],
    ["milk", "牛奶"], ["beef", "牛肉"], ["soup", "汤"], ["vegetable", "蔬菜"],
    ["fork", "叉子"], ["spoon", "勺子"], ["go", "去"], ["come", "来"],
    ["read", "读"], ["write", "写"], ["draw", "画"], ["play", "玩"],
    ["like", "喜欢"], ["have", "有"], ["help", "帮助"], ["find", "找到"],
    ["ready", "准备好"], ["forty", "四十"]
  ].map(function (item) {
    return { en: item[0], zh: item[1] };
  });

  var currentMode = "zh-en";
  var currentWord = null;
  var score = 0;
  var attempts = 0;
  var nextTimer;
  var elements = {
    card: document.querySelector("[data-flashcard]"),
    prompt: document.querySelector("[data-prompt]"),
    answer: document.querySelector("[data-answer]"),
    hint: document.querySelector("[data-hint]"),
    input: document.querySelector("[data-answer-input]"),
    form: document.querySelector("[data-quiz-form]"),
    feedback: document.querySelector("[data-feedback]"),
    score: document.querySelector("[data-score]"),
    round: document.querySelector("[data-round]"),
    celebration: document.querySelector("[data-celebration]"),
    modeButtons: document.querySelectorAll("[data-game-mode]"),
    showButton: document.querySelector("[data-show-answer]")
  };

  function copy(en, zh) {
    return isChinesePage ? zh : en;
  }

  function chooseWord() {
    var next = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    if (currentWord && vocabulary.length > 1) {
      while (next.en === currentWord.en) {
        next = vocabulary[Math.floor(Math.random() * vocabulary.length)];
      }
    }
    currentWord = next;
  }

  function renderWord() {
    chooseWord();
    elements.card.classList.remove("is-changing", "is-revealed");
    void elements.card.offsetWidth;
    elements.card.classList.add("is-changing");
    elements.prompt.textContent = currentMode === "zh-en" ? currentWord.zh : currentWord.en;
    elements.answer.textContent = currentMode === "zh-en" ? currentWord.en : currentWord.zh;
    elements.hint.textContent = currentMode === "zh-en"
      ? copy("Type the English word", "输入英文单词")
      : copy("Type the Chinese meaning", "输入中文意思");
    elements.input.value = "";
    elements.input.placeholder = currentMode === "zh-en" ? "Type your answer" : "输入中文意思";
    elements.showButton.textContent = copy("Show answer", "显示答案");
    elements.feedback.textContent = "";
    elements.feedback.className = "quiz-feedback";
    elements.round.textContent = copy("Round " + (attempts + 1), "第 " + (attempts + 1) + " 题");
    window.setTimeout(function () { elements.input.focus(); }, 220);
  }

  function setMode(mode) {
    currentMode = mode;
    elements.modeButtons.forEach(function (button) {
      button.classList.toggle("active", button.getAttribute("data-game-mode") === mode);
    });
    renderWord();
  }

  function showCelebration() {
    elements.celebration.classList.add("show");
    window.clearTimeout(nextTimer);
    nextTimer = window.setTimeout(function () {
      elements.celebration.classList.remove("show");
      renderWord();
    }, 1500);
  }

  function submitAnswer(event) {
    event.preventDefault();
    var answer = elements.input.value.trim().toLocaleLowerCase();
    var expected = (currentMode === "zh-en" ? currentWord.en : currentWord.zh).toLocaleLowerCase();
    if (!answer) return;
    if (answer === expected) {
      score += 1;
      attempts += 1;
      elements.score.textContent = score;
      elements.feedback.textContent = copy("Correct!", "答对了！");
      elements.feedback.className = "quiz-feedback is-correct";
      showCelebration();
    } else {
      elements.feedback.textContent = copy("Not quite yet. Try again!", "还差一点，再试一次！");
      elements.feedback.className = "quiz-feedback is-try-again";
      elements.card.classList.remove("is-shaking");
      void elements.card.offsetWidth;
      elements.card.classList.add("is-shaking");
      elements.input.select();
    }
  }

  elements.form.addEventListener("submit", submitAnswer);
  elements.modeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setMode(button.getAttribute("data-game-mode"));
    });
  });
  elements.showButton.addEventListener("click", function () {
    var revealed = elements.card.classList.toggle("is-revealed");
    elements.showButton.textContent = revealed ? copy("Hide answer", "隐藏答案") : copy("Show answer", "显示答案");
  });
  elements.card.addEventListener("click", function () {
    var revealed = elements.card.classList.toggle("is-revealed");
    elements.showButton.textContent = revealed ? copy("Hide answer", "隐藏答案") : copy("Show answer", "显示答案");
  });
  document.querySelectorAll("[data-confetti]").forEach(function (piece, index) {
    piece.style.setProperty("--confetti-delay", (index * 35) + "ms");
  });
  renderWord();
})();
