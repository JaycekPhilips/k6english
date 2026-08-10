(function () {
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const image = carousel.querySelector("[data-carousel-image]");
  const isChinese = document.documentElement.lang === "zh-CN";
  const slides = [
    {
      src: "assets/k6english-cover-village.png",
      alt: isChinese ? "中国乡村山村与学校操场" : "Mountain village and school courtyard in rural China"
    },
    {
      src: "assets/mountain-view-day.jpg",
      alt: isChinese ? "蓝天下的山村风景" : "Mountain village beneath a bright blue sky"
    },
    {
      src: "assets/mountain-view-evening.jpg",
      alt: isChinese ? "暮色中的山谷风景" : "Mountain valley in the evening light"
    }
  ];

  let current = 0;
  let timer;

  function render(index) {
    current = (index + slides.length) % slides.length;
    const slide = slides[current];
    image.classList.add("is-changing");

    window.setTimeout(() => {
      image.src = slide.src;
      image.alt = slide.alt;
      image.classList.remove("is-changing");
    }, 130);
  }

  timer = window.setInterval(() => render(current + 1), 5000);
})();
