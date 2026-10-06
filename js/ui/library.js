function createElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}

function createStartButton(lab, onOpenLab) {
  const button = createElement("button", "button button--primary", "Start Lab");
  button.type = "button";
  button.setAttribute("aria-label", `Start ${lab.title}`);
  button.addEventListener("click", () => onOpenLab(lab.id));
  return button;
}

function createFeaturedLab(lab, onOpenLab) {
  const article = createElement("article", "featured-lab");
  article.dataset.accent = lab.accent;

  const content = createElement("div", "featured-lab__content");
  content.append(
    createElement("p", "featured-lab__subject", lab.subjectLabel),
    createElement("h3", "", lab.title),
    createElement("p", "featured-lab__description", lab.description),
    createStartButton(lab, onOpenLab)
  );

  const details = createElement("dl", "featured-lab__details");
  const interactionTerm = createElement("dt", "", "Interaction");
  const interactionValue = createElement("dd", "", lab.interactionType);
  const hintTerm = createElement("dt", "", "Experiment hint");
  const hintValue = createElement(
    "dd",
    "",
    "Change the launch setup and observe the trajectory."
  );
  details.append(interactionTerm, interactionValue, hintTerm, hintValue);

  article.append(content, details);
  return article;
}

function createLabCard(lab, onOpenLab) {
  const article = createElement("article", "lab-card");
  article.dataset.subject = lab.subject;
  article.dataset.accent = lab.accent;

  const title = createElement("h3", "", lab.title);
  title.id = `lab-${lab.id}-title`;
  article.setAttribute("aria-labelledby", title.id);

  const footer = createElement("footer", "lab-card__footer");
  footer.append(
    createElement("p", "lab-card__interaction", lab.interactionType),
    createStartButton(lab, onOpenLab)
  );

  article.append(
    createElement("p", "lab-card__subject", lab.subjectLabel),
    title,
    createElement("p", "lab-card__description", lab.description),
    footer
  );

  return article;
}

export function renderLibrary({
  labs,
  filters,
  featuredLab,
  activeSubject,
  onSubjectChange,
  onOpenLab
}) {
  const featuredRoot = document.querySelector("[data-featured-lab]");
  const filterRoot = document.querySelector("[data-subject-filters]");
  const catalogueRoot = document.querySelector("[data-lab-catalogue]");
  const count = document.querySelector("[data-catalogue-count]");

  if (!featuredRoot || !filterRoot || !catalogueRoot || !count) {
    throw new Error("Library mount regions are missing.");
  }

  featuredRoot.replaceChildren(createFeaturedLab(featuredLab, onOpenLab));

  const filterButtons = filters.map((filter) => {
    const button = createElement("button", "subject-filter", filter.label);
    button.type = "button";
    button.dataset.subject = filter.id;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => onSubjectChange(filter.id));
    return button;
  });
  filterRoot.replaceChildren(...filterButtons);

  const cards = labs.map((lab) => createLabCard(lab, onOpenLab));
  catalogueRoot.replaceChildren(...cards);

  function setActiveSubject(subjectId) {
    const activeFilter = filters.find((filter) => filter.id === subjectId) ?? filters[0];
    const visibleCards = cards.filter(
      (card) => activeFilter.id === "all" || card.dataset.subject === activeFilter.id
    );

    cards.forEach((card) => {
      card.hidden = !visibleCards.includes(card);
    });

    filterButtons.forEach((button) => {
      const isActive = button.dataset.subject === activeFilter.id;
      button.setAttribute("aria-pressed", String(isActive));

      if (isActive) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    const noun = visibleCards.length === 1 ? "lab" : "labs";
    const qualifier = activeFilter.id === "all" ? "available" : `in ${activeFilter.label}`;
    count.textContent = `${visibleCards.length} ${noun} ${qualifier}`;
  }

  setActiveSubject(activeSubject);

  return {
    setActiveSubject,
    focusHeading() {
      document.querySelector("#library-title")?.focus({ preventScroll: true });
    }
  };
}
