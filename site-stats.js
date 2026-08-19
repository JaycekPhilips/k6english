(function () {
  // Deploy counter-worker to this origin, or override it before this script loads:
  // window.SITE_COUNTER_API = "https://your-worker.workers.dev/v1/k6english-jackp";
  const counterBase =
    window.SITE_COUNTER_API ||
    "https://k6english-counter.3486794620.workers.dev/v1/k6english-jackp";
  const isChinese = document.documentElement.lang === "zh-CN";
  const formatter = new Intl.NumberFormat(isChinese ? "zh-CN" : "en-US");

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
    const response = await fetch(`${counterBase}/${name}/up`, {
      method: "POST",
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Counter update failed");
    const data = await response.json();
    const value = Number(data.value ?? data.count ?? data.data?.value);
    if (!Number.isFinite(value)) throw new Error("Counter response was invalid");
    return value;
  }

  const likeSelector = "[data-like-count]";
  const likeButton = document.querySelector("[data-like-button]");

  setText(likeSelector, "-");

  if (!likeButton) return;

  getCounter("likes")
    .then((value) => setText(likeSelector, value))
    .catch(() => setText(likeSelector, "-"));

  likeButton.addEventListener("click", () => {
    incrementCounter("likes")
      .then((value) => {
        setText(likeSelector, value);
        likeButton.classList.remove("is-liked");
        void likeButton.offsetWidth;
        likeButton.classList.add("is-liked");
      })
      .catch(() => {
        setText(likeSelector, "-");
      });
  });
})();
