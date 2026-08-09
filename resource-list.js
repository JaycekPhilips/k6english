(function () {
  var isChinesePage = document.documentElement.lang === "zh-CN";

  function createEmptyMessage() {
    var empty = document.createElement("p");
    empty.className = "resource-empty";
    empty.textContent = isChinesePage ? "本栏目资源正在整理中。" : "Resources for this section are being organized.";
    return empty;
  }

  function renderResourceList(container) {
    var key = container.getAttribute("data-resource-list");
    var resources = key === "course-files"
      ? (window.K6_COURSE_FILES || [])
      : ((window.K6_RESOURCES && window.K6_RESOURCES[key]) || []);

    if (key === "textbooks") {
      resources = resources.filter(function (item) {
        return item.fileName !== "人教版PEP小学英语三至六年级词汇表.pdf";
      });
    }

    if (!resources.length) {
      container.appendChild(createEmptyMessage());
      return;
    }

    resources.forEach(function (item) {
      var card = document.createElement("a");
      card.className = "resource-item";
      card.href = item.url;
      card.setAttribute("download", item.downloadName || item.fileName);

      var main = document.createElement("span");
      main.className = "resource-main";

      var title = document.createElement("strong");
      title.textContent = item.title;

      var meta = document.createElement("span");
      meta.className = "resource-meta";
      var category = isChinesePage ? item.categoryZh : item.category;
      meta.textContent = (category ? category + " · " : "") + item.type + " / " + item.size;

      main.appendChild(title);

      if (item.description || item.descriptionZh) {
        var description = document.createElement("span");
        description.className = "resource-description";
        description.textContent = isChinesePage ? item.descriptionZh : item.description;
        main.appendChild(description);
      }

      main.appendChild(meta);

      var action = document.createElement("span");
      action.className = "resource-action";
      action.textContent = isChinesePage ? "下载" : "Download";

      card.appendChild(main);
      card.appendChild(action);
      container.appendChild(card);
    });
  }

  document.querySelectorAll("[data-resource-list]").forEach(renderResourceList);
})();
