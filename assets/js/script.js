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
      link.textContent = origin.name || "";

      if (!origin.link || !origin.link.startsWith("https://lyrics.imicomweb.com/songs/")) {
        link.classList.add("origin-link-muted");
      }

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

      if (world.image) {
        const imageLink = document.createElement("a");
        imageLink.className = "world-image-link";
        imageLink.href = world.link || "#";

        if (world.link) {
          imageLink.target = "_blank";
          imageLink.rel = "noopener noreferrer";
        }

        const image = document.createElement("img");
        image.className = "world-image";
        image.src = world.image;
        image.alt = `${world.name}のサムネイル画像`;
        image.loading = "lazy";
        imageLink.append(image);
        poemList.append(imageLink);
      }

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

      if (feed.image) {
        const imageLink = document.createElement("a");
        imageLink.className = "feed-image-link";
        imageLink.href = feed.link || "#";

        if (feed.link) {
          imageLink.target = "_blank";
          imageLink.rel = "noopener noreferrer";
        }

        const image = document.createElement("img");
        image.className = "feed-image";
        image.src = feed.image;
        image.alt = feed.title || "フィード画像";
        image.loading = "lazy";
        imageLink.append(image);
        article.append(imageLink);
      }

      const content = document.createElement("div");
      content.className = "feed-content";

      if (feed.title) {
        const title = document.createElement("h3");
        title.className = "feed-title";
        title.textContent = feed.title;
        content.append(title);
      }

      const body = createTextBlock("feed-body", feed.body || "");
      body.classList.add(feed.font === "Imitate" ? "font-imitate" : "font-default");
      content.append(body);

      if (feed.origin && feed.origin.length) {
        content.append(createOriginBlock(feed.origin));
      }

      article.append(content);
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
