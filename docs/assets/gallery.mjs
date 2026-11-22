/** Add tabs to static screenshot galleries; without JS every screenshot remains visible. */
export function setupGalleries(root = document) {
  for (const gallery of root.querySelectorAll("[data-gallery]")) {
    const nav = gallery.querySelector(".gallery-tabs");
    const tabs = [...gallery.querySelectorAll("[data-gallery-tab]")];
    const panels = tabs.map((tab) =>
      root.getElementById(tab.dataset.galleryTab),
    );
    if (!nav || !tabs.length || panels.some((panel) => !panel)) continue;
    function activate(index, focus = false) {
      tabs.forEach((tab, position) => {
        const selected = position === index;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[position].hidden = !selected;
      });
      // A newly selected hidden panel must begin loading immediately.
      const image = panels[index].querySelector("img");
      if (image) image.loading = "eager";
      if (focus) tabs[index].focus();
    }
    tabs.forEach((tab, index) => {
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panels[index].id);
      panels[index].setAttribute("role", "tabpanel");
      panels[index].setAttribute("aria-labelledby", tab.id);
      panels[index].tabIndex = 0;
      tab.addEventListener("click", () => activate(index));
      tab.addEventListener("keydown", (event) => {
        let next;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft")
          next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        else return;
        event.preventDefault();
        activate(next, true);
      });
    });
    nav.setAttribute("role", "tablist");
    nav.hidden = false;
    gallery.classList.add("is-enhanced");
    activate(0);
  }
}
