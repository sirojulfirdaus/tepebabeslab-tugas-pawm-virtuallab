export const subjectFilters = [
  { id: "all", label: "All" },
  { id: "mathematics", label: "Mathematics" },
  { id: "physics", label: "Physics" },
  { id: "chemistry", label: "Chemistry" },
  { id: "computational-thinking", label: "Computational Thinking" },
  { id: "digital-ai", label: "Digital & AI" },
  { id: "sports", label: "Sports" },
  { id: "pancasila", label: "Pancasila" },
  { id: "bahasa-indonesia", label: "Bahasa Indonesia" },
  { id: "english", label: "English" }
];

export const labs = [
  {
    id: "function-playground",
    subject: "mathematics",
    subjectLabel: "Mathematics",
    title: "Function Playground",
    description: "Explore how changing inputs reshapes a mathematical function.",
    interactionType: "Canvas exploration",
    accent: "math",
    featured: false
  },
  {
    id: "projectile-motion",
    subject: "physics",
    subjectLabel: "Physics",
    title: "Projectile Motion Lab",
    description: "Investigate how launch settings influence a projectile's path.",
    interactionType: "Canvas simulation",
    accent: "physics",
    featured: true
  },
  {
    id: "ph-mixer",
    subject: "chemistry",
    subjectLabel: "Chemistry",
    title: "pH Mixer Lab",
    description: "Mix familiar solutions and observe changes in acidity and color.",
    interactionType: "Drag and mix",
    accent: "chemistry",
    featured: false
  },
  {
    id: "sorting",
    subject: "computational-thinking",
    subjectLabel: "Computational Thinking",
    title: "Sorting Lab",
    description: "Arrange values to uncover the logic behind systematic sorting.",
    interactionType: "Ordering activity",
    accent: "computational",
    featured: false
  },
  {
    id: "ai-decision",
    subject: "digital-ai",
    subjectLabel: "Digital & AI",
    title: "AI Decision Lab",
    description: "Adjust input factors and examine how a simple decision changes.",
    interactionType: "Decision model",
    accent: "ai",
    featured: false
  },
  {
    id: "pacing",
    subject: "sports",
    subjectLabel: "Sports",
    title: "Pacing Lab",
    description: "Compare duration, pace, and rest across training scenarios.",
    interactionType: "Parameter comparison",
    accent: "sports",
    featured: false
  },
  {
    id: "civic-decision",
    subject: "pancasila",
    subjectLabel: "Pancasila",
    title: "Civic Decision Lab",
    description: "Consider everyday choices through civic values and reflection.",
    interactionType: "Scenario choices",
    accent: "pancasila",
    featured: false
  },
  {
    id: "sentence-structure",
    subject: "bahasa-indonesia",
    subjectLabel: "Bahasa Indonesia",
    title: "Sentence Structure Lab",
    description: "Arrange sentence elements to examine clear Indonesian structure.",
    interactionType: "Drag and arrange",
    accent: "indonesian",
    featured: false
  },
  {
    id: "sentence-builder",
    subject: "english",
    subjectLabel: "English",
    title: "Sentence Builder Lab",
    description: "Build English sentences by testing word order and structure.",
    interactionType: "Word builder",
    accent: "english",
    featured: false
  }
];
