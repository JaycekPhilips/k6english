(function () {
  const counterBase = "https://api.counterapi.dev/v1/k6english-jackp";
  const localPrefix = "k6english-counter-";
  const isChinese = document.documentElement.lang === "zh-CN";
  const formatter = new Intl.NumberFormat(isChinese ? "zh-CN" : "en-US");

  const readLocal = (name) => Number(localStorage.getItem(localPrefix + name) || 0);
  const writeLocal = (name, value) => localStorage.setItem(localPrefix + name, String(value));
  const setText = (selector, value) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = formatter.format(value);
    });
  };

  async function getCounter(name) {
    const response = await fetch(`${counterBase}/${name}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Counter request failed");
    const data = await response.json();
    const value = Number(data.value ?? data.count ?? data.data?.value);
    if (!Number.isFinite(value)) throw new Error("Counter response was invalid");
    return value;
  }

  async function incrementCounter(name) {
    const response = await fetch(`${counterBase}/${name}/up`, { cache: "no-store" });
    if (!response.ok) throw new Error("Counter update failed");
    const data = await response.json();
    const value = Number(data.value ?? data.count ?? data.data?.value);
    if (!Number.isFinite(value)) throw new Error("Counter response was invalid");
    writeLocal(name, value);
    return value;
  }

  function updateLocal(name, selector) {
    const value = readLocal(name) + 1;
    writeLocal(name, value);
    setText(selector, value);
    return value;
  }

  const viewSelector = "[data-site-views]";
  const likeSelector = "[data-like-count]";
  const likeButton = document.querySelector("[data-like-button]");

  setText(viewSelector, readLocal("views"));
  setText(likeSelector, readLocal("likes"));

  incrementCounter("views")
    .then((value) => setText(viewSelector, value))
    .catch(() => updateLocal("views", viewSelector));

  if (!likeButton) return;

  getCounter("likes")
    .then((value) => setText(likeSelector, value))
    .catch(() => setText(likeSelector, readLocal("likes")));

  likeButton.addEventListener("click", () => {
    incrementCounter("likes")
      .then((value) => {
        setText(likeSelector, value);
        likeButton.classList.remove("is-liked");
        void likeButton.offsetWidth;
        likeButton.classList.add("is-liked");
      })
      .catch(() => {
        updateLocal("likes", likeSelector);
        likeButton.classList.add("is-liked");
      });
  });
})();
