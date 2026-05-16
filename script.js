(function () {
  const data = window.siteData || { worlds: [], feeds: [] };

  const worldPanel = document.getElementById("worlds");
  const feedPanel = document.getElementById("feeds");
  const worldTab = document.getElementById("tab-worlds");
  const feedTab = document.getElementById("tab-feeds");
  const worldList = document.getElementById("world-list");
  const feedList = document.getElementById("feed-list");
  const tabLinks = document.querySelectorAll("[data-tab-link]");

  function setTab(activeName) {
    const worldsActive = activeName === "worlds";
    worldPanel.hidden = !worldsActive;
    feedPanel.hidden = worldsActive;
    worldTab.setAttribute("aria-selected", String(worldsActive));
    feedTab.setAttribute("aria-selected", String(!worldsActive));
  }

  function createTextBlock(className, text) {
    const block = document.createElement("p");
    block.className = className;
    block.textContent = text;
    return block;
  }

  function createOriginBlock(origins) {
    const block = document.createElement("aside");
    block.className = "origin-block";

    const list = document.createElement("div");
    list.className = "origin-list";

    origins.forEach((origin) => {
      const link = document.createElement("a");
      link.className = "origin-link";
      link.href = origin.link || "#";
      link.textContent = origin.name || "無題";

      if (origin.link) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }

      list.append(link);
    });

    block.append(list);
    return block;
  }

  function renderWorlds() {
    if (!data.worlds.length) {
      worldList.append(createTextBlock("empty", "ワールドの詩は準備中です。"));
      return;
    }

    data.worlds.forEach((world) => {
      const details = document.createElement("details");
      details.className = "world";

      const summary = document.createElement("summary");
      summary.textContent = world.name;
      details.append(summary);

      const poemList = document.createElement("div");
      poemList.className = "poem-list";

      if (!world.poems || !world.poems.length) {
        poemList.append(createTextBlock("empty", "このワールドの詩は準備中です。"));
      } else {
        world.poems.forEach((poem, index) => {
          if (index > 0) {
            const separator = document.createElement("hr");
            separator.className = "poem-separator";
            poemList.append(separator);
          }

          const article = document.createElement("article");
          article.className = "poem";

          if (poem.title) {
            const title = document.createElement("h3");
            title.className = "poem-title";
            title.textContent = poem.title;
            article.append(title);
          }

          const body = createTextBlock("poem-body", poem.body || "");
          body.classList.add(poem.font === "Imitate" ? "font-imitate" : "font-default");
          article.append(body);

          if (poem.origin && poem.origin.length) {
            article.append(createOriginBlock(poem.origin));
          }

          poemList.append(article);
        });
      }

      details.append(poemList);
      worldList.append(details);
    });
  }

  function renderFeeds() {
    if (!data.feeds.length) {
      feedList.append(createTextBlock("empty", "フィードの文章は準備中です。"));
      return;
    }

    data.feeds.forEach((feed) => {
      const article = document.createElement("article");
      article.className = "feed";

      if (feed.title) {
        const title = document.createElement("h3");
        title.className = "feed-title";
        title.textContent = feed.title;
        article.append(title);
      }

      article.append(createTextBlock("feed-body", feed.body || ""));
      feedList.append(article);
    });
  }

  worldTab.addEventListener("click", () => setTab("worlds"));
  feedTab.addEventListener("click", () => setTab("feeds"));
  tabLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setTab(link.dataset.tabLink);
    });
  });

  renderWorlds();
  renderFeeds();
  setTab(location.hash === "#feeds" ? "feeds" : "worlds");
})();
