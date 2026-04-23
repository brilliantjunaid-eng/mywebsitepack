"use strict";

/* â”€â”€ ROUTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const PAGE_TEMPLATES = {};
const VALID_PAGES = ["home", "login", "app", "hook", "session"];

function normalizePageName(pageName) {
  if (!pageName) return "home";
  if (pageName === "index") return "home";
  return VALID_PAGES.indexOf(pageName) >= 0 ? pageName : "home";
}

function pageToHash(pageName) {
  return "#" + normalizePageName(pageName);
}

function getPageFromLocation() {
  var rawHash = (window.location.hash || "").replace(/^#/, "").trim();
  return normalizePageName(rawHash || "home");
}

function navigate(pageName, options) {
  options = options || {};
  pageName = normalizePageName(pageName);
  stopSessionTimer();

  // Cache original templates once
  ["home","login","app","hook","session"].forEach(function(name) {
    var el = document.getElementById("page-" + name);
    if (el && !PAGE_TEMPLATES[name]) {
      PAGE_TEMPLATES[name] = el.innerHTML;
    }
  });

  // Hide all
  document.querySelectorAll(".page-view").forEach(function(el) {
    el.classList.remove("active");
  });

  // Restore fresh DOM and show
  var target = document.getElementById("page-" + pageName);
  if (!target) return;
  if (PAGE_TEMPLATES[pageName]) target.innerHTML = PAGE_TEMPLATES[pageName];
  target.classList.add("active");
  window.scrollTo(0, 0);

  if (!options.skipHash) {
    var nextHash = pageToHash(pageName);
    if (window.location.hash !== nextHash) {
      history.replaceState(null, "", nextHash);
    }
  }

  // Init
  switch (pageName) {
    case "home":    initHomePage();    break;
    case "login":   initLoginPage();   break;
    case "app":     initAppPage();     break;
    case "hook":    initHookPage();    break;
    case "session": initSessionPage(); break;
  }
}

// Intercept all internal <a href="*.html"> clicks
document.addEventListener("click", function(e) {
  var link = e.target.closest("a[href]");
  if (!link) return;
  var href = link.getAttribute("href");
  var match = href && href.match(/^(index|login|app|hook|session)\.html/);
  if (match) {
    e.preventDefault();
    navigate(match[1] === "index" ? "home" : match[1]);
    return;
  }

  if (href && href.charAt(0) === "#") {
    var hashTarget = normalizePageName(href.slice(1));
    if (VALID_PAGES.indexOf(hashTarget) >= 0) {
      e.preventDefault();
      navigate(hashTarget);
    }
  }
});

window.addEventListener("hashchange", function() {
  navigate(getPageFromLocation(), { skipHash: true });
});

/* â”€â”€ CONSTANTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const STORAGE_KEYS = {
  user: "pact.user",
  sessions: "pact.sessions",
  state: "pact.state"
};

const DEFAULT_DURATION = 25;
const XP_PER_25_MIN_SESSION = 100;
const XP_PER_LEVEL = 300;
const XP_SESSION_MINUTES = 25;

/* â”€â”€ TOPIC LIBRARY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const TOPIC_LIBRARY = [
  {
    subject: "mathematics",
    keywords: ["complex numbers", "complex number", "imaginary numbers", "imaginary number"],
    title: "Complex Numbers",
    hook: "The equation e^(iÏ€) + 1 = 0 only looks magical until you realize complex numbers are really a language of rotation.",
    hookLong: "Complex numbers seem fake the first time you meet them. Then one geometric insight changes everything: multiplying by i turns a point ninety degrees on the complex plane. Once multiplication becomes rotation, Euler's identity stops feeling like a stunt and starts feeling like a compressed map of circles, waves, growth, and symmetry all speaking the same language.",
    beauty: "The beauty here is that a symbol invented to patch an impossible equation becomes a way of describing motion itself.",
    lens: "While you study, keep sketching the plane beside the algebra. Each multiplication by i is not just arithmetic. It is a turn.",
    payoff: "If the student sees the turning picture early, the formulas stop floating and start attaching themselves to an image that memory can hold.",
    visualKind: "complex-plane",
    visualTitle: "Rotation on the complex plane",
    visualCaption: "One multiplication by i turns the point from 1 on the real axis to i on the imaginary axis.",
    lowSupport: [
      "What first looks imaginary becomes useful the moment you realize it can track turning, not just counting.",
      "Engineers use complex numbers because some motions are easier to describe as rotations than as separate pieces."
    ],
    midSupport: [
      "Ask what ordinary real numbers fail to express cleanly here.",
      "Look for the instant this stops being a trick and starts becoming a new geometric language."
    ],
    highSupport: [
      "You are in a good state. Keep following the turning idea quietly.",
      "Stay with the structure. No extra stimulation needed."
    ],
    challenge: {
      question: "Why does multiplying by i correspond to a quarter-turn on the complex plane, and why does that make Euler's identity feel less mysterious?",
      cues: "A strong answer connects the real and imaginary axes, ninety-degree rotation, repeated multiplication, and the way exponentials can encode circular motion."
    }
  },
  {
    subject: "mathematics",
    keywords: ["quadratic equations", "quadratic equation", "quadratics", "quadratic"],
    title: "Quadratic Equations",
    hook: "Quadratics return everywhere because they describe systems that rise, peak, and then turn back on themselves.",
    hookLong: "A quadratic can look like just another formula to solve, but its deeper pattern is a turning point. The parabola rises, reaches a peak or valley, and bends. That is why quadratics keep appearing in motion, optimization, area problems, and countless school problems that secretly ask where something changes direction.",
    beauty: "The beautiful part is that factoring, graphs, and completing the square are not separate tricks. They are three views of one turning shape.",
    lens: "While you study, keep asking what each form reveals: roots, symmetry, or the vertex. Do not just solve. Compare perspectives.",
    payoff: "If the student feels the parabola as a shape rather than a worksheet procedure, later algebra becomes much less brittle.",
    visualKind: "parabola",
    visualTitle: "A parabola as a turning point",
    visualCaption: "The roots, symmetry line, and vertex are all different ways of reading the same quadratic.",
    lowSupport: [
      "A quadratic is not only a formula to solve. It is a model of turning points.",
      "Look for the moment the graph changes direction. That is where the meaning lives."
    ],
    midSupport: [
      "Ask what the vertex tells you before you manipulate anything.",
      "Try reading the shape first and the algebra second."
    ],
    highSupport: [
      "Your state is solid. Keep going one step at a time.",
      "Stay with the pattern. You do not need another spark."
    ],
    challenge: {
      question: "How do factoring, completing the square, and the graph of a parabola all describe the same quadratic from different angles?",
      cues: "A strong answer links roots, symmetry, the vertex form, and how each representation highlights a different structural feature of the same expression."
    }
  },
  {
    subject: "physics",
    keywords: ["thermodynamics", "entropy", "second law"],
    title: "Thermodynamics and Entropy",
    hook: "Entropy is not just about disorder. It is about which changes the universe quietly allows and which ones it almost never gives back.",
    hookLong: "Thermodynamics feels dry until you realize it is secretly answering one of the strangest questions in science: why does time seem to have a direction? Entropy tracks how energy spreads into more probable arrangements. That is why broken things do not usually unbreak, hot coffee cools, and the universe keeps preferring some changes over their reverses.",
    beauty: "What makes this beautiful is that a simple-looking law about heat reaches all the way into probability, irreversibility, and the arrow of time.",
    lens: "While you study, do not ask only what the formula calculates. Ask what it forbids, and why reversal is statistically so rare.",
    payoff: "If the student feels entropy as a law about probable change rather than mess, the chapter becomes much more coherent and much more memorable.",
    visualKind: "entropy",
    visualTitle: "Energy spreads into more probable arrangements",
    visualCaption: "The system naturally moves from concentrated energy to dispersed energy because there are vastly more dispersed arrangements available.",
    lowSupport: [
      "Thermodynamics is really a theory of one-wayness: why some changes feel natural and reversal feels expensive.",
      "When this topic feels dry, look for the hidden question underneath it: why does time seem to have a direction?"
    ],
    midSupport: [
      "Ask what this law says about possibility, not just heat.",
      "Look for the constraint underneath the formula."
    ],
    highSupport: [
      "You are moving well. Keep your attention on the next relation.",
      "Good state. Stay quiet and let the idea settle."
    ],
    challenge: {
      question: "Why is entropy more useful to think of as a constraint on possible changes than as a vague synonym for disorder?",
      cues: "A strong answer touches probability, energy spreading, irreversibility, and why macroscopic systems overwhelmingly move toward more likely arrangements."
    }
  },
  {
    subject: "history",
    keywords: ["french revolution", "the french revolution"],
    title: "The French Revolution",
    hook: "The French Revolution did not begin when people became angry. It began when an old system could no longer absorb the pressure building inside it.",
    hookLong: "The most interesting way to enter the French Revolution is not as a list of dates, but as a pressure system. Ideas, hunger, debt, inequality, and political weakness were all rising at once. Revolutions often feel sudden only because we arrive late to the pressure that made them possible.",
    beauty: "The beauty here is structural: once you see the old regime as a system under strain, events that once looked chaotic begin to organize themselves.",
    lens: "While you study, keep asking what pressure is rising, who can still absorb it, and what changes once the state loses legitimacy.",
    payoff: "That systems view turns memorization into reasoning. Causes and consequences stop feeling scattered because they are tied to the same mounting strain.",
    visualKind: "pressure",
    visualTitle: "Pressure building before rupture",
    visualCaption: "The dramatic event is usually only the visible break. The real story begins with the long pressure curve underneath.",
    lowSupport: [
      "History often turns when institutions lose the ability to contain ordinary frustration.",
      "Try reading this topic as a study of pressure, bottlenecks, and release rather than a pile of dates."
    ],
    midSupport: [
      "Ask what made reform feel impossible before explosion felt inevitable.",
      "Look for the structural tension, not just the dramatic moment."
    ],
    highSupport: [
      "Your state is steady. Keep tracing cause into consequence.",
      "You do not need more intensity right now. Just keep going."
    ],
    challenge: {
      question: "Was the French Revolution mainly caused by ideas, by economic strain, or by political structure? Build the strongest case you can without reducing it to one factor.",
      cues: "A strong answer weighs Enlightenment ideas, fiscal crisis, inequality, state weakness, and why these forces mattered more together than separately."
    }
  },
  {
    subject: "biology",
    keywords: ["photosynthesis", "cellular respiration", "respiration"],
    title: "Photosynthesis and Respiration",
    hook: "Life survives by borrowing concentrated energy, storing it briefly, and then spending it carefully before the rest diffuses away.",
    hookLong: "Photosynthesis and respiration become far more interesting when you see them as partners in an energy conversation. One process captures usable energy and stores it in chemical bonds. The other breaks those bonds open so living cells can spend that energy on movement, repair, growth, and survival. The chapter is really about how life holds order for a while inside a universe that tends toward spread.",
    beauty: "The beautiful part is the cycle itself: sunlight becomes stored chemical possibility, and stored chemical possibility becomes living action.",
    lens: "While you study, keep following energy, carbon, and oxygen together. If you know where those three are going, the details stop feeling random.",
    payoff: "That energy-first view turns a memorization-heavy biology unit into a single connected story.",
    visualKind: "cycle",
    visualTitle: "A living energy cycle",
    visualCaption: "Photosynthesis stores energy into glucose. Respiration releases that stored energy back into usable cellular work.",
    lowSupport: [
      "Biology becomes clearer when you see organisms as negotiators of energy, not just collections of parts.",
      "This topic is really about how life borrows concentrated energy and then spends it carefully."
    ],
    midSupport: [
      "Ask what is being transformed, stored, and lost at each step.",
      "Follow the energy, and the details will start organizing themselves."
    ],
    highSupport: [
      "You are in range. Keep tracing the pathway calmly.",
      "Good state. Let the sequence carry you."
    ],
    challenge: {
      question: "How are photosynthesis and cellular respiration opposites in one sense and partners in another?",
      cues: "A strong answer explains energy capture versus release, the movement of carbon and oxygen, and why the products of one process become reactants for the other."
    }
  },
  {
    subject: "chemistry",
    keywords: ["atomic structure", "atom", "electrons", "periodic table"],
    title: "Atomic Structure",
    hook: "The periodic table looks neat because electron structure underneath it repeats with a hidden rhythm.",
    hookLong: "Atomic structure starts feeling elegant when the periodic table stops looking like a chart to memorize and starts looking like a shadow cast by electron arrangement. Shells fill, outer electrons repeat patterns, and whole columns of the table begin behaving alike for a reason. The visible chart is only the surface. The rhythm underneath is the real story.",
    beauty: "What makes this beautiful is that huge chemical patterns can emerge from a surprisingly small set of structural rules.",
    lens: "While you study, keep asking what the outer electrons are doing. Group behavior, bonding, and reactivity all start there.",
    payoff: "Once the student sees repeating chemistry as repeating electron logic, the table becomes easier to remember and far easier to reason with.",
    visualKind: "shells",
    visualTitle: "Electron shells and repeating behavior",
    visualCaption: "As shells fill and outer electrons repeat, the periodic table starts repeating visible behavior too.",
    lowSupport: [
      "Chemistry starts to click when you see patterns as consequences of electron arrangement, not memorization.",
      "The table is not arbitrary. It is what repeated quantum structure looks like from a distance."
    ],
    midSupport: [
      "Ask what electron behavior makes a whole column feel like a family.",
      "Look underneath the chart and search for the repeating cause."
    ],
    highSupport: [
      "You are steady. Keep following the pattern.",
      "No need for more noise. Stay with the logic."
    ],
    challenge: {
      question: "Why does electron arrangement explain both periodic trends and the similar behavior of elements in the same group?",
      cues: "A strong answer connects shells, valence electrons, repeating patterns, and how outer-electron structure shapes bonding and reactivity."
    }
  },
  {
    subject: "literature",
    keywords: ["macbeth", "hamlet", "shakespeare", "poetry"],
    title: "Literary Tension",
    hook: "Great literature lasts because the characters are never only characters. They are pressure points inside human beings that still exist now.",
    hookLong: "Literature becomes much easier to care about when you stop asking only what happens and start asking what the text knows about fear, desire, shame, ambition, grief, or self-deception. The plot matters, but the lasting power of a work comes from the pressure it places on human conflict and the precision with which language makes that conflict felt.",
    beauty: "The beautiful part is that language can make an inner struggle feel more visible than ordinary speech ever could.",
    lens: "While you study, keep asking what tension the language is sharpening. Do not just summarize events. Track pressure and tone.",
    payoff: "That shift turns literature from a memory test about scenes into a more alive reading of what the work is revealing about people.",
    visualKind: "tension",
    visualTitle: "A tension arc through the text",
    visualCaption: "Plot moves forward on the surface, but underneath it a central human tension keeps tightening.",
    lowSupport: [
      "If the text feels distant, ask which human fear or desire it is exposing so clearly that it still hurts.",
      "Literature becomes alive when you stop asking what happens and start asking what the work knows about people."
    ],
    midSupport: [
      "Look for the tension under the language, not just the plot above it.",
      "Ask what the writer is revealing that ordinary speech tries to hide."
    ],
    highSupport: [
      "Good state. Stay close to the lines and the tension inside them.",
      "You already have enough energy. Keep reading carefully."
    ],
    challenge: {
      question: "Choose one central tension in the text and explain how the language makes that tension feel unavoidable rather than merely stated.",
      cues: "A strong answer identifies a core tension, uses precise textual evidence, and shows how imagery, rhythm, or contrast intensifies meaning."
    }
  },
  {
    subject: "economics",
    keywords: ["supply and demand", "market equilibrium", "elasticity", "economics"],
    title: "Supply and Demand",
    hook: "Markets look calm on the graph, but that calm is actually a truce between competing pressures that keep shifting underneath.",
    hookLong: "Supply and demand can feel too simple until you notice what the graph is really doing. It compresses thousands of choices, limits, incentives, and competing desires into one moving balance point. The curves are not just lines. They are pressure maps of human behavior under constraint.",
    beauty: "What makes this beautiful is the compression: a whole market negotiation becomes visible in one clean crossing.",
    lens: "While you study, ask what pressure is moving the curve, who is responding, and why the new equilibrium changes.",
    payoff: "That pressure-based lens makes economics less about memorizing diagrams and more about reading why systems settle where they do.",
    visualKind: "supply-demand",
    visualTitle: "A truce between two pressures",
    visualCaption: "Demand pulls one way, supply pushes another, and equilibrium marks where those pressures temporarily settle.",
    lowSupport: [
      "An economics curve is not just a line. It is compressed human behavior under constraints.",
      "What matters is not the graph alone, but the pressure each side puts on price and quantity."
    ],
    midSupport: [
      "Ask what changes first when incentives shift.",
      "Look for the pressure that moves the equilibrium instead of memorizing the picture."
    ],
    highSupport: [
      "You are tracking well. Stay with the mechanism.",
      "Quiet confidence is enough right now. Keep going."
    ],
    challenge: {
      question: "Why is equilibrium not the same thing as fairness, and what does that distinction reveal about what supply and demand can and cannot explain?",
      cues: "A strong answer distinguishes descriptive market balance from ethical judgment and explains that equilibrium shows where pressures settle, not whether the outcome is desirable."
    }
  }
];

/* â”€â”€ SUBJECT FALLBACKS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const SUBJECT_FALLBACKS = {
  mathematics: {
    title: "{topic}",
    hook: "{topic} starts feeling lighter once you stop treating it as symbol pushing and start treating it as a structure you can see.",
    hookLong: "{topic} is often difficult at the start because the symbols arrive before the picture. A better entry is to search for the structure underneath: what changes, what stays stable, what turns, what repeats, or what relation the chapter is really trying to express.",
    beauty: "Math becomes beautiful the moment a procedure turns into a picture and the picture starts explaining the procedure back to you.",
    lens: "While you study, keep translating notation into plain language and diagrams. If you can say what the symbols are doing, the problem usually softens.",
    payoff: "That habit makes later topics easier because the student stops waiting passively for meaning and begins building it.",
    visualKind: "generic-math",
    visualTitle: "A pattern becoming visible",
    visualCaption: "The hardest part is often the moment before the pattern clicks. After that, memory has something to hold onto.",
    lowSupport: ["Look for the structure before the procedure.", "Ask what this topic lets you see that ordinary arithmetic could not."],
    midSupport: ["What changes once you see the pattern underneath the notation?", "Try naming the core relationship in plain words first."],
    highSupport: ["You are settled. Keep following the next connection.", "No extra push. Just stay with the line of thought."],
    challenge: { question: "Explain the central idea of this topic as if you were teaching someone one year younger. What does it reveal that simpler tools could not?", cues: "A strong answer defines the idea clearly, gives a concrete example, and explains why older methods were not enough." }
  },
  physics: {
    title: "{topic}",
    hook: "{topic} gets interesting when the equations stop looking like recipes and start looking like claims about what the universe allows.",
    hookLong: "Physics topics often feel mechanical at first because the formulas arrive before the constraints they represent. A better way in is to ask what relation the chapter is protecting: what changes together, what resists change, and what the universe is refusing to let happen for free.",
    beauty: "The beauty of physics is that abstract symbols can end up describing an astonishingly real limit on how the world behaves.",
    lens: "While you study, keep asking what physical story the variables are telling and which constraint matters most.",
    payoff: "That moves attention away from blind substitution and toward actual understanding, which makes later problems less intimidating.",
    visualKind: "generic-curve",
    visualTitle: "A relationship, not just a formula",
    visualCaption: "The equation matters because it pins one changing quantity to another in a physically meaningful way.",
    lowSupport: ["Ask what physical constraint the equation is trying to protect.", "Look past the symbols and name the tradeoff in plain language."],
    midSupport: ["What does this rule say can happen, and what does it say cannot?", "Find the underlying relationship before the calculation."],
    highSupport: ["You are in a good state. Stay precise and keep moving.", "Let the idea stay quiet and exact."],
    challenge: { question: "What is the key relationship this topic is trying to describe, and why does that relationship matter physically?", cues: "A strong answer names the quantities involved, explains how they influence one another, and connects the math to a real physical situation." }
  },
  chemistry: {
    title: "{topic}",
    hook: "{topic} becomes less about memorizing facts and more about seeing why matter prefers some arrangements over others.",
    hookLong: "Chemistry topics feel far less arbitrary once you notice that particles are usually trying to settle into more stable arrangements. What looks like a list of rules is often just the visible consequence of a few recurring preferences about energy, attraction, and electron arrangement.",
    beauty: "The beautiful part is that tiny invisible changes can produce large visible regularities.",
    lens: "While you study, ask what arrangement the system seems to prefer and what cost or stability is being lowered.",
    payoff: "That gives the student a reason underneath the fact, and reasons usually survive longer than isolated facts do.",
    visualKind: "shells",
    visualTitle: "Invisible structure, visible behavior",
    visualCaption: "Microscopic arrangement quietly controls the larger pattern you can actually observe.",
    lowSupport: ["Ask what particles are trying to stabilize, share, or lower here.", "The hidden question is often why this arrangement is favored."],
    midSupport: ["What is the driving tendency behind the reaction or pattern?", "Look for the reason the system prefers one state over another."],
    highSupport: ["Steady state. Keep tracing the pattern.", "Enough energy already. Stay with the logic."],
    challenge: { question: "What hidden preference or constraint explains the behavior in this chemistry topic?", cues: "A strong answer discusses particles, stability, energy, and why the observed pattern follows from those forces." }
  },
  biology: {
    title: "{topic}",
    hook: "{topic} usually becomes clearer once you see it as a solution to an energy or survival problem.",
    hookLong: "Biology can feel like a long list of names until you begin asking what the organism is trying to protect, move, repair, or survive. Many chapters become simpler the moment the function comes into focus and the details line up behind it.",
    beauty: "The beauty is that living systems are messy on the surface but often surprisingly elegant in purpose.",
    lens: "While you study, ask what need the organism is solving and how each step helps solve it.",
    payoff: "That functional view gives memory a backbone, because the details now have a job rather than just a label.",
    visualKind: "cycle",
    visualTitle: "A biological process solving a problem",
    visualCaption: "When you can see the need each step serves, the process becomes much easier to remember.",
    lowSupport: ["Ask what the organism gains or protects through this process.", "Many details become easier once you follow the purpose of the system."],
    midSupport: ["What survival problem is this process solving?", "Track the flow of matter or energy through the system."],
    highSupport: ["Good state. Keep following the pathway.", "You do not need more stimulation. Keep tracing the system."],
    challenge: { question: "What problem does this biological process solve for the organism, and how does each step help solve it?", cues: "A strong answer identifies the organism's need, explains the process step by step, and links details back to function." }
  },
  history: {
    title: "{topic}",
    hook: "{topic} sharpens when events stop looking isolated and start feeling like pressures accumulating inside a system.",
    hookLong: "History topics become far more compelling when they are approached as systems under strain. Instead of seeing isolated dates, start asking what was building quietly, who could absorb the pressure, and what changed once that system stopped holding.",
    beauty: "The beautiful part is the hidden structure: what once looked like scattered events begins to form an intelligible pattern of buildup and release.",
    lens: "While you study, look for long-term pressure, immediate triggers, and the point where reform stops working.",
    payoff: "That systems view helps the student reason through unfamiliar questions instead of depending only on memorized sequences.",
    visualKind: "pressure",
    visualTitle: "A system under growing strain",
    visualCaption: "The visible event is only the break. The more interesting story is the pressure line rising beforehand.",
    lowSupport: ["Ask what long pressure made the event possible before the event itself arrived.", "Dates matter less once you can see the structure underneath them."],
    midSupport: ["What tensions were building before the turning point?", "Look for structure first, then sequence."],
    highSupport: ["You are steady. Keep following cause into consequence.", "Stay with the thread. No extra push."],
    challenge: { question: "What pressures were building beneath this topic, and why did they matter when events finally turned?", cues: "A strong answer identifies long-term causes, immediate triggers, and shows how they interacted." }
  },
  literature: {
    title: "{topic}",
    hook: "{topic} becomes alive when the text stops feeling like plot summary and starts feeling like human tension caught in language.",
    hookLong: "Literature gets easier to begin when you look for the pressure inside it: fear, desire, guilt, ambition, grief, vanity, or self-deception. The point is not only what happens, but what the language makes visible about people that ordinary speech usually hides.",
    beauty: "The beautiful part is that words can make an inner conflict feel sharper than life usually does.",
    lens: "While you study, watch for tone, contrast, repetition, and imagery. Ask what pressure they are tightening.",
    payoff: "That shift turns reading from plot recall into interpretation, which usually makes the work feel far more alive.",
    visualKind: "tension",
    visualTitle: "Language tightening a central tension",
    visualCaption: "The story moves outward, but the real force often comes from an inner tension getting tighter.",
    lowSupport: ["Ask what human tension is being exposed here that still feels recognizable.", "If the text feels distant, search for the fear, desire, or contradiction underneath it."],
    midSupport: ["What does the language let the reader feel that summary would erase?", "Look for tension, not just events."],
    highSupport: ["Good state. Stay close to the words.", "The text is carrying you. Keep going."],
    challenge: { question: "What central human tension does this work reveal, and how does the language sharpen that tension?", cues: "A strong answer identifies the tension, uses specific details, and explains how literary choices deepen meaning." }
  },
  economics: {
    title: "{topic}",
    hook: "{topic} becomes vivid when graphs stop being diagrams and start becoming maps of pressure, incentives, and tradeoffs.",
    hookLong: "Economics often looks sterile until you notice that the model is compressing real human pushes and pulls. Behind every curve is desire, scarcity, risk, and response. The graph matters because it makes those hidden negotiations visible in a simplified form.",
    beauty: "The beautiful part is that something messy and human can become legible without becoming meaningless.",
    lens: "While you study, keep asking which incentive is doing the work and what tradeoff the model is exposing.",
    payoff: "That approach makes the graph easier to reason with, because it stops feeling detached from life.",
    visualKind: "supply-demand",
    visualTitle: "Competing pressures settling temporarily",
    visualCaption: "The visible crossing point only makes sense once you feel the push and pull behind it.",
    lowSupport: ["Ask what each actor wants, what each actor lacks, and how that creates pressure.", "The graph is only a still image of a moving negotiation."],
    midSupport: ["What incentive is doing the real work here?", "Follow the tradeoff, not just the formula."],
    highSupport: ["You are in range. Keep tracing the mechanism.", "Stay with the next relationship."],
    challenge: { question: "What pressure or incentive is doing the main explanatory work in this topic, and what are its limits?", cues: "A strong answer identifies the core incentive, explains its effects, and notes what the model leaves out." }
  },
  general: {
    title: "{topic}",
    hook: "{topic} becomes easier to approach once the hidden question inside it becomes visible.",
    hookLong: "{topic} probably feels larger than it needs to right now. A better way in is to ask what puzzle the topic is really trying to solve and what makes that puzzle interesting enough to care about.",
    beauty: "The beautiful part is usually the moment when a pile of details suddenly turns into one underlying question.",
    lens: "While you study, keep asking what mystery, pattern, or problem the chapter exists to answer.",
    payoff: "Once the student can name that central question, attention gets sharper and the first step usually feels less heavy.",
    visualKind: "generic-curve",
    visualTitle: "A hidden question becoming visible",
    visualCaption: "The chapter becomes easier to enter when the central question stands out clearly enough to follow.",
    lowSupport: ["Ask what puzzle this topic exists to solve.", "Do not attack the whole thing. Find the smallest live question inside it."],
    midSupport: ["What would feel mysterious here if you had never seen the chapter title?", "Name the core question before the details."],
    highSupport: ["Your state is good. Keep moving calmly.", "No extra spark needed. Stay with the work."],
    challenge: { question: "What is the central question inside this topic, and how would you answer it in your own words?", cues: "A strong answer names the question, answers it clearly, and supports the answer with one meaningful example." }
  }
};

/* â”€â”€ TIMER HANDLE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
var sessionTimerHandle = null;

/* â”€â”€ PAGE INITS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function initHomePage() {
  var user = getUser();
  var navCta  = document.getElementById("homePrimaryCta");
  var heroCta = document.getElementById("homeHeroCta");

  if (user && navCta && heroCta) {
    navCta.textContent = "Continue";
    navCta.href = "app.html";
    heroCta.textContent = "Return to your study space";
    heroCta.href = "app.html";
  }
}

function initLoginPage() {
  var form          = document.getElementById("loginForm");
  var input         = document.getElementById("nameInput");
  var returningCard = document.getElementById("returningUserCard");
  var returningText = document.getElementById("returningUserText");
  var resetButton   = document.getElementById("resetUserButton");
  var user          = getUser();

  if (user && returningCard && returningText) {
    returningCard.hidden = false;
    returningText.textContent = user.name;
  }

  form.addEventListener("submit", function(event) {
    event.preventDefault();
    var name = input.value.trim();
    if (!name) { input.focus(); return; }
    setUser(name);
    navigate("app");
  });

  if (resetButton) {
    resetButton.addEventListener("click", function() {
      localStorage.removeItem(STORAGE_KEYS.user);
      returningCard.hidden = true;
      input.value = "";
      input.focus();
    });
  }
}

function initAppPage() {
  var user = requireUser();
  if (!user) return;

  var els = {
    notice:             document.getElementById("appNotice"),
    greeting:           document.getElementById("appGreeting"),
    subcopy:            document.getElementById("appSubcopy"),
    supportBadge:       document.getElementById("supportBadge"),
    pactInput:          document.getElementById("pactInput"),
    subjectSelect:      document.getElementById("subjectSelect"),
    topicInput:         document.getElementById("topicInput"),
    durationRange:      document.getElementById("durationRange"),
    durationValue:      document.getElementById("durationValue"),
    hookPreviewTitle:   document.getElementById("hookPreviewTitle"),
    hookPreviewText:    document.getElementById("hookPreviewText"),
    taskInput:          document.getElementById("taskInput"),
    addTaskButton:      document.getElementById("addTaskButton"),
    draftTaskList:      document.getElementById("draftTaskList"),
    startSessionButton: document.getElementById("startSessionButton"),
    resetDraftButton:   document.getElementById("resetDraftButton"),
    streakValue:        document.getElementById("streakValue"),
    sessionCountValue:  document.getElementById("sessionCountValue"),
    levelValue:         document.getElementById("levelValue"),
    xpHeadline:         document.getElementById("xpHeadline"),
    xpSubcopy:          document.getElementById("xpSubcopy"),
    xpTotalValue:       document.getElementById("xpTotalValue"),
    xpRingLabel:        document.getElementById("xpRingLabel"),
    xpRingProgress:     document.getElementById("xpRingProgress"),
    supportTitle:       document.getElementById("supportTitle"),
    supportDescription: document.getElementById("supportDescription"),
    graduationNote:     document.getElementById("graduationNote"),
    recentSessionsList: document.getElementById("recentSessionsList"),
    clearIdentityButton:document.getElementById("clearIdentityButton")
  };

  var state    = hydrateAppState(getState());
  var sessions = getSessions();

  var supportProfile = function() { return getSupportProfile(sessions); };

  var saveStateOnly = function() { saveState(state); };

  var renderNotice = function() { renderNoticeElement(els.notice, state.notice); };

  var setNotice = function(message) {
    state.notice = message;
    saveStateOnly();
    renderNotice();
  };

  var clearNotice = function() {
    state.notice = "";
    saveStateOnly();
    renderNotice();
  };

  var renderGreeting = function() {
    var profile = supportProfile();
    var name    = user.name;
    var count   = sessions.length;
    var hour    = new Date().getHours();
    var streak  = calculateStreak(sessions);
    var last    = sessions[0] ? sessions[0].finishedAt : null;
    var daysAgo = last ? daysBetween(new Date(last), new Date()) : null;

    var greeting;
    if      (count === 0)                         greeting = "Welcome, " + name + ".";
    else if (daysAgo !== null && daysAgo >= 7)    greeting = "Good to have you back, " + name + ".";
    else if (streak >= 7)                         greeting = streak + " days running, " + name + ".";
    else if (hour < 7)                            greeting = "Still here, " + name + ".";
    else if (hour < 9)                            greeting = "Early today, " + name + ".";
    else if (hour >= 21)                          greeting = "Late session, " + name + ".";
    else {
      var pool = [
        "Back at it, " + name + ".",
        "One step is enough, " + name + ".",
        "The work can wait for a clean beginning, " + name + ".",
        "Set the runway, " + name + ".",
        "Good to see you, " + name + "."
      ];
      greeting = pool[count % pool.length];
    }

    els.greeting.textContent = greeting;
    els.subcopy.textContent = profile.level === "guided"
      ? "Right now the app is slightly more present because the hardest part is still the beginning."
      : profile.level === "steady"
        ? "You are beginning to carry more of the session yourself, so the support is already getting lighter."
        : "The app is quieter because your recent sessions suggest the work is generating more of its own momentum.";
  };

  var renderSupport = function() {
    var profile = supportProfile();
    els.supportBadge.textContent       = profile.badge;
    els.supportTitle.textContent       = profile.title;
    els.supportDescription.textContent = profile.description;
    els.graduationNote.textContent     = profile.note;
  };

  var renderMetrics = function() {
    var streak   = calculateStreak(sessions);
    var totalXp  = calculateTotalXp(sessions);
    var xpStatus = getXpStatus(totalXp);
    els.streakValue.textContent       = String(streak);
    els.sessionCountValue.textContent = String(sessions.length);
    els.levelValue.textContent        = String(xpStatus.level);
    els.xpHeadline.textContent        = xpStatus.sessionsToNext === 1
      ? "One more focus block to level " + (xpStatus.level + 1) + "."
      : xpStatus.sessionsToNext + " more focus blocks to level " + (xpStatus.level + 1) + ".";
    els.xpSubcopy.textContent         = totalXp
      ? xpStatus.xpToNext + " XP left before the next level."
      : "Each full 25-minute block adds 100 XP. Every 300 XP lifts you one level.";
    els.xpTotalValue.textContent      = totalXp + " XP";
    els.xpRingLabel.textContent       = xpStatus.xpIntoLevel + " / " + XP_PER_LEVEL + " XP this level";
    setCircleProgress(els.xpRingProgress, xpStatus.progressRatio);
  };

  var renderHookPreview = function() {
    var draft = state.draft;
    if (!draft.topic.trim()) {
      els.hookPreviewTitle.textContent = "Give the chapter a reason to matter first.";
      els.hookPreviewText.textContent  = "Enter a topic and the warm-up will turn it into something your brain can approach more willingly.";
      return;
    }
    var content = lookupContent(draft.topic, draft.subject);
    els.hookPreviewTitle.textContent = content.title;
    els.hookPreviewText.textContent  = content.hook;
  };

  var renderDraftTasks = function() {
    renderTaskList({
      listElement: els.draftTaskList,
      tasks: state.draft.tasks,
      onToggle: function(taskId) {
        state.draft.tasks = state.draft.tasks.map(function(task) {
          return task.id === taskId ? Object.assign({}, task, { done: !task.done }) : task;
        });
        saveStateOnly();
        renderDraftTasks();
      },
      onRemove: function(taskId) {
        state.draft.tasks = state.draft.tasks.filter(function(task) { return task.id !== taskId; });
        saveStateOnly();
        renderDraftTasks();
      },
      emptyMessage: "Add one to three steps you could actually begin without arguing with yourself first."
    });
  };

  var renderRecentSessions = function() {
    els.recentSessionsList.innerHTML = "";
    if (!sessions.length) {
      var empty = document.createElement("li");
      empty.className = "session-entry";
      empty.innerHTML = "<small>No sessions yet. The first honest block you complete will appear here.</small>";
      els.recentSessionsList.appendChild(empty);
      return;
    }
    sessions.slice(0, 4).forEach(function(session) {
      var item = document.createElement("li");
      item.className = "session-entry";
      item.innerHTML = "<strong>" + escapeHtml(session.topic) + "</strong>" +
        "<small>" + formatDate(session.finishedAt) + " Â· " + session.durationMinutes + " min" +
        (session.avgState ? " Â· avg state " + session.avgState : "") + "</small>";
      els.recentSessionsList.appendChild(item);
    });
  };

  var renderAll = function() {
    renderNotice();
    renderGreeting();
    renderSupport();
    renderMetrics();
    els.pactInput.value       = state.draft.pact;
    els.subjectSelect.value   = state.draft.subject;
    els.topicInput.value      = state.draft.topic;
    els.durationRange.value   = String(state.draft.durationMinutes);
    els.durationValue.textContent = String(state.draft.durationMinutes);
    renderHookPreview();
    renderDraftTasks();
    renderRecentSessions();
  };

  var addTask = function() {
    var text = els.taskInput.value.trim();
    if (!text) return;
    state.draft.tasks = state.draft.tasks.concat([{
      id: Date.now() + Math.floor(Math.random() * 1000),
      text: text,
      done: false
    }]);
    els.taskInput.value = "";
    saveStateOnly();
    renderDraftTasks();
  };

  els.pactInput.addEventListener("input", function(e) { state.draft.pact = e.target.value; saveStateOnly(); });
  els.subjectSelect.addEventListener("change", function(e) { state.draft.subject = e.target.value; saveStateOnly(); renderHookPreview(); });
  els.topicInput.addEventListener("input", function(e) { state.draft.topic = e.target.value; saveStateOnly(); renderHookPreview(); });
  els.durationRange.addEventListener("input", function(e) {
    state.draft.durationMinutes = Number(e.target.value) || DEFAULT_DURATION;
    els.durationValue.textContent = String(state.draft.durationMinutes);
    saveStateOnly();
  });

  document.querySelectorAll(".suggestion-chip").forEach(function(button) {
    button.addEventListener("click", function() {
      var addition = button.dataset.value;
      var current  = els.pactInput.value.trim();
      els.pactInput.value = current ? current + " " + addition : addition;
      state.draft.pact    = els.pactInput.value;
      saveStateOnly();
    });
  });

  els.addTaskButton.addEventListener("click", addTask);
  els.taskInput.addEventListener("keydown", function(e) { if (e.key === "Enter") { e.preventDefault(); addTask(); } });

  els.startSessionButton.addEventListener("click", function() {
    clearNotice();
    var result = createActiveSessionFromDraft(state);
    if (!result.ok) {
      setNotice(result.message);
      if (result.focusId && els[result.focusId]) els[result.focusId].focus();
      return;
    }
    saveStateOnly();
    navigate("session");
  });

  els.resetDraftButton.addEventListener("click", function() {
    if (state.activeSession) {
      setNotice("A focus sprint is already running. Finish that one first, or return to it.");
      return;
    }
    state.draft = defaultDraftState();
    saveStateOnly();
    setNotice("Setup cleared.");
    renderAll();
  });

  els.clearIdentityButton.addEventListener("click", function() {
    clearIdentity();
    navigate("login");
  });

  renderAll();
}

function initHookPage() {
  var user = requireUser();
  if (!user) return;

  var els = {
    notice:           document.getElementById("hookNotice"),
    topicLabel:       document.getElementById("hookTopicLabel"),
    title:            document.getElementById("hookTitle"),
    shortText:        document.getElementById("hookShortText"),
    longText:         document.getElementById("hookLongText"),
    beautyText:       document.getElementById("hookBeautyText"),
    lensText:         document.getElementById("hookLensText"),
    payoffText:       document.getElementById("hookPayoffText"),
    visualTitle:      document.getElementById("hookVisualTitle"),
    visualGraphic:    document.getElementById("hookVisualGraphic"),
    visualCaption:    document.getElementById("hookVisualCaption"),
    topicName:        document.getElementById("hookTopicName"),
    stateHint:        document.getElementById("hookStateHint"),
    challengePreview: document.getElementById("hookChallengePreview"),
    startButton:      document.getElementById("startFromHookButton"),
    switchButton:     document.getElementById("hookSwitchIdentityButton")
  };

  var state   = hydrateAppState(getState());
  var context = getCurrentTopicContext(state);

  renderNoticeElement(els.notice, state.notice);

  if (!context.topic.trim()) {
    els.topicLabel.textContent    = "Curiosity warm-up";
    els.title.textContent         = "Give the session something to point at.";
    els.shortText.textContent     = "The warm-up becomes specific once the study space has a topic to aim at.";
    els.longText.textContent      = "Go to the study space, choose a subject and write the topic, then come back here. This page is designed to make that topic feel alive before the focus sprint starts.";
    els.beautyText.textContent    = "A good hook reveals the most beautiful or surprising destination of the topic without over-explaining it.";
    els.lensText.textContent      = "The best study lens tells you what to watch for so the chapter has a direction instead of just detail.";
    els.payoffText.textContent    = "Once the topic feels meaningful, the starting resistance usually weakens because the brain has something to lean toward.";
    els.visualTitle.textContent   = "The visual appears when a topic is chosen.";
    els.visualGraphic.innerHTML   = renderTopicVisual({ visualKind: "generic-curve" });
    els.visualCaption.textContent = "Choose a topic in the study space to load a more specific explanation and visual.";
    els.topicName.textContent     = "Nothing chosen yet";
    els.stateHint.textContent     = "Return to the study space, write the topic, then come back.";
    els.challengePreview.textContent = "The retrieval question preview appears once the topic is known.";
    els.startButton.textContent   = "Go to study space";
    els.startButton.addEventListener("click", function() { navigate("app"); });
  } else {
    var content = lookupContent(context.topic, context.subject);
    els.topicLabel.textContent    = formatSubjectLabel(context.subject) + " warm-up";
    els.title.textContent         = content.title;
    els.shortText.textContent     = content.hook;
    els.longText.textContent      = content.hookLong;
    els.beautyText.textContent    = content.beauty;
    els.lensText.textContent      = content.lens;
    els.payoffText.textContent    = content.payoff;
    els.visualTitle.textContent   = content.visualTitle;
    els.visualGraphic.innerHTML   = renderTopicVisual(content);
    els.visualCaption.textContent = content.visualCaption;
    els.topicName.textContent     = context.topic;
    els.stateHint.textContent     = "The current setup is ready to become a " + context.durationMinutes + "-minute focus block.";
    els.challengePreview.textContent = content.challenge.question;
    enhanceHookPageWithAI(els, context, state, content);
    if (state.activeSession) {
      els.startButton.textContent = "Return to focus sprint";
      els.startButton.addEventListener("click", function() { navigate("session"); });
    } else {
      els.startButton.textContent = "Start this focus sprint";
      els.startButton.addEventListener("click", function() {
        var latest = hydrateAppState(getState());
        var result = createActiveSessionFromDraft(latest);
        if (!result.ok) {
          latest.notice = result.message;
          saveState(latest);
          navigate("app");
          return;
        }
        saveState(latest);
        navigate("session");
      });
    }
  }

  if (els.switchButton) {
    els.switchButton.addEventListener("click", function() { clearIdentity(); navigate("login"); });
  }
}

function initSessionPage() {
  var user = requireUser();
  if (!user) return;

  var els = {
    notice:             document.getElementById("sessionNotice"),
    emptyState:         document.getElementById("sessionEmptyState"),
    livePanel:          document.getElementById("sessionLivePanel"),
    wrapPanel:          document.getElementById("wrapPanel"),
    subjectLabel:       document.getElementById("sessionSubjectLabel"),
    topicTitle:         document.getElementById("sessionTopicTitle"),
    hookReminder:       document.getElementById("sessionHookReminder"),
    remainingTimer:     document.getElementById("remainingTimer"),
    elapsedTimer:       document.getElementById("elapsedTimer"),
    dialProgress:       document.getElementById("sessionDialProgress"),
    durationText:       document.getElementById("sessionDurationText"),
    nextCheckInText:    document.getElementById("nextCheckInText"),
    checkInCount:       document.getElementById("checkInCount"),
    liveSupportLabel:   document.getElementById("liveSupportLabel"),
    sessionPactSummary: document.getElementById("sessionPactSummary"),
    liveSupportText:    document.getElementById("liveSupportText"),
    liveTaskList:       document.getElementById("liveTaskList"),
    checkInPrompt:      document.getElementById("checkInPrompt"),
    ratingGrid:         document.getElementById("ratingGrid"),
    thermostatCard:     document.getElementById("thermostatCard"),
    thermostatLabel:    document.getElementById("thermostatLabel"),
    thermostatTitle:    document.getElementById("thermostatTitle"),
    thermostatMessage:  document.getElementById("thermostatMessage"),
    manualCheckInButton:document.getElementById("manualCheckInButton"),
    endSessionButton:   document.getElementById("endSessionButton"),
    challengeQuestion:  document.getElementById("challengeQuestion"),
    answerInput:        document.getElementById("answerInput"),
    revealCuesButton:   document.getElementById("revealCuesButton"),
    answerCuesCard:     document.getElementById("answerCuesCard"),
    answerCuesText:     document.getElementById("answerCuesText"),
    reflectionInput:    document.getElementById("reflectionInput"),
    saveSessionButton:  document.getElementById("saveSessionButton"),
    switchIdentityButton: document.getElementById("sessionSwitchIdentityButton")
  };

  var state    = hydrateAppState(getState());
  var sessions = getSessions();

  var renderNotice = function() { renderNoticeElement(els.notice, state.notice); };

  var setNotice = function(message) { state.notice = message; saveState(state); renderNotice(); };

  var renderLiveTasks = function() {
    var active = state.activeSession;
    renderTaskList({
      listElement: els.liveTaskList,
      tasks: active ? active.tasks : [],
      onToggle: function(taskId) {
        if (!state.activeSession) return;
        state.activeSession.tasks = state.activeSession.tasks.map(function(task) {
          return task.id === taskId ? Object.assign({}, task, { done: !task.done }) : task;
        });
        saveState(state);
        renderLiveTasks();
      },
      onRemove: null,
      emptyMessage: "No steps saved for this sprint yet."
    });
  };

  var renderCheckInPrompt = function() {
    var active     = state.activeSession;
    var shouldShow = Boolean(active && active.checkInOpen);
    els.checkInPrompt.hidden = !shouldShow;
    els.ratingGrid.innerHTML = "";
    if (!shouldShow) return;
    for (var rating = 1; rating <= 10; rating++) {
      (function(r) {
        var button = document.createElement("button");
        button.type      = "button";
        button.className = "rating-button";
        button.textContent = String(r);
        button.addEventListener("click", function() { submitCheckIn(r); });
        els.ratingGrid.appendChild(button);
      })(rating);
    }
  };

  var renderThermostatCard = function() {
    var active   = state.activeSession;
    var response = active ? active.lastResponse : null;
    els.thermostatCard.hidden = !response;
    if (!response) return;
    els.thermostatLabel.textContent  = "Thermostat response";
    els.thermostatTitle.textContent  = response.title;
    els.thermostatMessage.textContent = response.message;
  };

  var renderWrapUp = function() {
    var wrap = state.wrapUp;
    els.wrapPanel.hidden = !wrap;
    if (!wrap) {
      els.answerInput.value    = "";
      els.reflectionInput.value = "";
      els.answerCuesCard.hidden = true;
      return;
    }
    els.challengeQuestion.textContent = wrap.challenge.question;
    els.answerInput.value             = wrap.answer || "";
    els.reflectionInput.value         = wrap.reflection || "";
    els.answerCuesText.textContent    = wrap.challenge.cues;
    els.answerCuesCard.hidden         = !wrap.revealed;
  };

  var renderActiveSession = function() {
    var active = state.activeSession;
    els.livePanel.hidden = !active;
    if (!active) return;
    var content = lookupContent(active.topic, active.subject);
    els.subjectLabel.textContent    = formatSubjectLabel(active.subject) + " focus sprint";
    els.topicTitle.textContent      = active.topic;
    els.checkInCount.textContent    = String(active.checkIns.length);
    els.sessionPactSummary.textContent = summarizePact(active.pact);
    els.durationText.textContent    = active.durationMinutes + " minute block";
    if (active.lastResponse) {
      els.liveSupportLabel.textContent = active.lastResponse.label;
      els.liveSupportText.textContent  = active.lastResponse.message;
    } else {
      els.liveSupportLabel.textContent = "Warm-up anchor";
      els.liveSupportText.textContent  = active.currentHook || content.hook;
    }
    els.hookReminder.textContent = content.hookLong;
    renderLiveTasks();
    renderCheckInPrompt();
    renderThermostatCard();
    refreshSessionTimer();
  };

  var refreshSessionTimer = function() {
    var active = state.activeSession;
    if (!active) {
      els.remainingTimer.textContent  = "00:00";
      els.elapsedTimer.textContent    = "elapsed 00:00";
      setCircleProgress(els.dialProgress, 0);
      els.nextCheckInText.textContent = "Next check-in in --:--";
      return;
    }
    var now      = Date.now();
    var elapsed  = Math.max(0, now - active.startedAt);
    var remaining = Math.max(0, active.endsAt - now);
    var progress = Math.min(100, Math.round((elapsed / (active.durationMinutes * 60000)) * 100));
    els.remainingTimer.textContent = formatDuration(remaining);
    els.elapsedTimer.textContent   = "elapsed " + formatDuration(elapsed);
    setCircleProgress(els.dialProgress, progress / 100);
    if (active.checkInOpen) {
      els.nextCheckInText.textContent = "Check-in open now";
    } else if (active.nextCheckInAt >= active.endsAt) {
      els.nextCheckInText.textContent = "Next check-in at the end of the block";
    } else {
      els.nextCheckInText.textContent = "Next check-in in " + formatDuration(Math.max(0, active.nextCheckInAt - now));
    }
    if (remaining <= 0 && !active.durationReached) {
      active.durationReached = true;
      state.notice = "Your chosen sprint is complete. End the session when you are ready, or stay a few more minutes if the work is flowing.";
      saveState(state);
      renderNotice();
    }
    if (now >= active.nextCheckInAt && !active.checkInOpen) {
      active.checkInOpen = true;
      saveState(state);
      renderCheckInPrompt();
    }
  };

  var renderPage = function() {
    renderNotice();
    var hasActive = Boolean(state.activeSession);
    var hasWrapUp = Boolean(state.wrapUp);
    els.emptyState.hidden = hasActive || hasWrapUp;
    if (hasActive) { renderActiveSession(); } else { els.livePanel.hidden = true; }
    renderWrapUp();
    if (!hasActive) stopSessionTimer();
  };

  var submitCheckIn = function(rating) {
    if (!state.activeSession) return;
    var active  = state.activeSession;
    var content = lookupContent(active.topic, active.subject);
    var response = buildThermostatResponse({ rating: rating, activeSession: active, support: getSupportProfile(sessions), content: content });
    active.checkIns.push({ rating: rating, at: Date.now() });
    active.lastResponse = response;
    active.currentHook  = response.message;
    active.checkInOpen  = false;
    active.nextCheckInAt = Math.min(active.endsAt, Date.now() + active.checkInIntervalMs);
    saveState(state);
    renderActiveSession();
  };

  var endSession = function() {
    if (!state.activeSession) return;
    var active          = state.activeSession;
    var durationMinutes = Math.max(1, Math.round((Date.now() - active.startedAt) / 60000));
    var challenge       = lookupContent(active.topic, active.subject).challenge;
    state.wrapUp = {
      topic: active.topic, subject: active.subject, pact: active.pact,
      tasks: active.tasks.map(function(t) { return Object.assign({}, t); }),
      checkIns: active.checkIns.slice(), durationMinutes: durationMinutes,
      challenge: challenge, answer: "", reflection: "", revealed: false
    };
    state.activeSession = null;
    state.notice = "Sprint closed. End with one difficult retrieval attempt before you move on.";
    saveState(state);
    stopSessionTimer();
    renderPage();
  };

  var saveCompletedSession = function() {
    if (!state.wrapUp) return;
    var answer     = els.answerInput.value.trim();
    var reflection = els.reflectionInput.value.trim();
    if (!answer)     { setNotice("Write your retrieval answer before saving. That effort is part of the reward."); els.answerInput.focus(); return; }
    if (!reflection) { setNotice("Add one honest reflection on what surprised you."); els.reflectionInput.focus(); return; }
    var avgState    = state.wrapUp.checkIns.length
      ? Math.round(state.wrapUp.checkIns.reduce(function(s,i){return s+i.rating;},0) / state.wrapUp.checkIns.length)
      : null;
    var strongSession = avgState !== null ? avgState >= 7 : state.wrapUp.durationMinutes >= 20;
    var earnedXp      = calculateSessionXp(state.wrapUp.durationMinutes);
    sessions = [{
      id: Date.now(), topic: state.wrapUp.topic, subject: state.wrapUp.subject,
      pact: state.wrapUp.pact, tasks: state.wrapUp.tasks, checkIns: state.wrapUp.checkIns,
      durationMinutes: state.wrapUp.durationMinutes, answer: answer, reflection: reflection,
      avgState: avgState, strong: strongSession, earnedXp: earnedXp, finishedAt: new Date().toISOString()
    }].concat(sessions);
    state.wrapUp       = null;
    state.draft.topic  = "";
    state.draft.pact   = "";
    state.draft.tasks  = [];
    state.notice = earnedXp > 0
      ? "Session saved. You earned " + earnedXp + " XP from that block."
      : strongSession
        ? "Session saved. That looked steady enough to count as a strong block."
        : "Session saved. Quiet repetition matters more than dramatic wins.";
    saveSessions(sessions);
    saveState(state);
    navigate("app");
  };

  els.manualCheckInButton.addEventListener("click", function() {
    if (!state.activeSession) return;
    state.activeSession.checkInOpen = true;
    saveState(state);
    renderCheckInPrompt();
  });
  els.endSessionButton.addEventListener("click", endSession);
  els.revealCuesButton.addEventListener("click", function() {
    if (!state.wrapUp) return;
    state.wrapUp.revealed = !state.wrapUp.revealed;
    saveState(state);
    renderWrapUp();
  });
  els.answerInput.addEventListener("input", function(e) {
    if (!state.wrapUp) return;
    state.wrapUp.answer = e.target.value;
    saveState(state);
  });
  els.reflectionInput.addEventListener("input", function(e) {
    if (!state.wrapUp) return;
    state.wrapUp.reflection = e.target.value;
    saveState(state);
  });
  els.saveSessionButton.addEventListener("click", saveCompletedSession);
  els.switchIdentityButton.addEventListener("click", function() { clearIdentity(); navigate("login"); });

  renderPage();
  if (state.activeSession) startSessionTimer(refreshSessionTimer);
}

/* â”€â”€ SESSION FACTORY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function createActiveSessionFromDraft(state) {
  var draft           = state.draft;
  var pact            = draft.pact.trim();
  var topic           = draft.topic.trim();
  var tasks           = draft.tasks.filter(function(t) { return t.text.trim(); });
  var durationMinutes = Number(draft.durationMinutes) || DEFAULT_DURATION;

  if (state.activeSession) return { ok: false, message: "A focus sprint is already running. Return to it instead of starting a new one." };
  if (!pact)  return { ok: false, message: "Write a short pact first so the block begins deliberately.", focusId: "pactInput" };
  if (!topic) return { ok: false, message: "Add the topic before starting so the warm-up can aim at something real.", focusId: "topicInput" };
  if (!tasks.length) return { ok: false, message: "Add at least one reachable first step so the block has a clear beginning.", focusId: "taskInput" };

  var content          = lookupContent(topic, draft.subject);
  var startedAt        = Date.now();
  var checkInIntervalMs = getCheckInIntervalMs(durationMinutes);
  var endsAt           = startedAt + durationMinutes * 60000;

  state.activeSession = {
    id: startedAt, startedAt: startedAt, endsAt: endsAt,
    durationMinutes: durationMinutes, checkInIntervalMs: checkInIntervalMs,
    nextCheckInAt: Math.min(endsAt, startedAt + checkInIntervalMs),
    checkInOpen: false, durationReached: false,
    subject: draft.subject, topic: topic, pact: pact,
    tasks: tasks.map(function(t) { return Object.assign({}, t); }),
    checkIns: [], currentHook: content.hook, lastResponse: null
  };
  state.wrapUp  = null;
  state.notice  = "Focus sprint started for " + durationMinutes + " minutes. The app will stay quiet unless your state asks for something.";
  return { ok: true };
}

/* â”€â”€ TASK LIST RENDERER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function renderTaskList(opts) {
  var listElement  = opts.listElement;
  var tasks        = opts.tasks;
  var onToggle     = opts.onToggle;
  var onRemove     = opts.onRemove;
  var emptyMessage = opts.emptyMessage;

  listElement.innerHTML = "";
  if (!tasks.length) {
    var empty = document.createElement("li");
    empty.className = "task-item";
    empty.innerHTML = "<small>" + escapeHtml(emptyMessage) + "</small>";
    listElement.appendChild(empty);
    return;
  }
  tasks.forEach(function(task) {
    var item = document.createElement("li");
    item.className = "task-item";
    var row = document.createElement("div");
    row.className = "task-row";
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox"; checkbox.className = "task-checkbox"; checkbox.checked = Boolean(task.done);
    checkbox.addEventListener("change", function() { if (onToggle) onToggle(task.id); });
    var text = document.createElement("span");
    text.className = "task-text" + (task.done ? " completed" : "");
    text.textContent = task.text;
    row.appendChild(checkbox);
    row.appendChild(text);
    if (onRemove) {
      var remove = document.createElement("button");
      remove.type = "button"; remove.className = "task-remove"; remove.textContent = "Remove";
      remove.addEventListener("click", function() { onRemove(task.id); });
      row.appendChild(remove);
    }
    item.appendChild(row);
    listElement.appendChild(item);
  });
}

/* â”€â”€ THERMOSTAT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function buildThermostatResponse(opts) {
  var rating        = opts.rating;
  var activeSession = opts.activeSession;
  var support       = opts.support;
  var content       = opts.content;
  var cycleIndex    = activeSession.checkIns.length;

  if (rating <= 5) {
    var core = selectByRotation(content.lowSupport, cycleIndex);
    return {
      label: support.level === "quiet" ? "Small reset" : "A small spark",
      title: support.level === "quiet" ? "Small reset" : "A small spark",
      message: support.level === "guided"
        ? core + " Stay with only the next five minutes."
        : core + " Return to the smallest next move.",
      band: "low"
    };
  }
  if (rating <= 7) {
    return {
      label: "Mild nudge",
      title: "Mild nudge",
      message: selectByRotation(content.midSupport, cycleIndex),
      band: "mid"
    };
  }
  return {
    label: "Quiet acknowledgement",
    title: "Quiet acknowledgement",
    message: selectByRotation(content.highSupport, cycleIndex),
    band: "high"
  };
}

/* â”€â”€ CONTENT LOOKUP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function lookupContent(topic, subject) {
  var normalizedTopic   = normalize(topic);
  var normalizedSubject = subject || "general";

  var topicMatch = TOPIC_LIBRARY.find(function(entry) {
    return entry.keywords.some(function(keyword) { return normalizedTopic.includes(normalize(keyword)); });
  });
  if (topicMatch) return topicMatch;

  var template = SUBJECT_FALLBACKS[normalizedSubject] || SUBJECT_FALLBACKS.general;
  var label    = topic.trim() ? toTitleCase(topic.trim()) : template.title.replace("{topic}", "This Topic");
  return fillTemplateFields(template, label);
}

function fillTemplateFields(template, topicLabel) {
  return Object.assign({}, template, {
    title:        fillTemplate(template.title, topicLabel),
    hook:         fillTemplate(template.hook, topicLabel),
    hookLong:     fillTemplate(template.hookLong, topicLabel),
    beauty:       fillTemplate(template.beauty, topicLabel),
    lens:         fillTemplate(template.lens, topicLabel),
    payoff:       fillTemplate(template.payoff, topicLabel),
    visualTitle:  fillTemplate(template.visualTitle, topicLabel),
    visualCaption:fillTemplate(template.visualCaption, topicLabel),
    challenge: {
      question: fillTemplate(template.challenge.question, topicLabel),
      cues:     fillTemplate(template.challenge.cues, topicLabel)
    }
  });
}

/* â”€â”€ SUPPORT PROFILE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function getSupportProfile(sessions) {
  if (sessions.length < 4) {
    return { level: "guided", badge: "More support", title: "More support right now",
      description: "Early on, the app gives a little more scaffolding because the student is still rebuilding the ability to begin cleanly.",
      note: "Keep showing up. The app should become quieter as your own momentum gets stronger." };
  }
  var recent      = sessions.slice(0, 6);
  var strongCount = recent.filter(function(s) { return s.strong; }).length;
  var weeklyStrong = sessions.filter(function(s) {
    return daysBetween(new Date(s.finishedAt), new Date()) <= 7 && s.strong;
  }).length;
  if (strongCount >= 4) {
    return { level: "quiet", badge: "Quieter support", title: "Quieter support",
      description: "Recent sessions suggest the student can carry more of the drive internally, so the app stays calmer and interrupts less.",
      note: weeklyStrong >= 7
        ? "You have had 7 strong sessions this week. A good next step would be trying one session tomorrow without opening the app first."
        : "The system is tapering. Curiosity remains, but extra stimulation is being pulled back." };
  }
  return { level: "steady", badge: "Steadier support", title: "Steadier support",
    description: "The app is beginning to reduce noise. It still nudges, but it is leaning more on the student's own rising baseline.",
    note: "This is the middle stage. Keep the rituals, but let the rewards get lighter." };
}

/* â”€â”€ STREAK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function calculateStreak(sessions) {
  if (!sessions.length) return 0;
  var uniqueDates  = Array.from(new Set(sessions.map(function(s) { return dateKey(new Date(s.finishedAt)); })));
  var sortedDates  = uniqueDates.sort(function(a,b) { return new Date(b) - new Date(a); });
  var todayKey     = dateKey(new Date());
  var yesterday    = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  var yesterdayKey = dateKey(yesterday);
  if (sortedDates[0] !== todayKey && sortedDates[0] !== yesterdayKey) return 0;
  var streak = 1;
  for (var i = 0; i < sortedDates.length - 1; i++) {
    var diff = Math.round((new Date(sortedDates[i]) - new Date(sortedDates[i+1])) / 86400000);
    if (diff === 1) streak++; else break;
  }
  return streak;
}

function calculateSessionXp(durationMinutes) {
  var minutes = Number(durationMinutes) || 0;
  return Math.max(0, Math.floor(minutes / XP_SESSION_MINUTES) * XP_PER_25_MIN_SESSION);
}

function calculateTotalXp(sessions) {
  return sessions.reduce(function(sum, session) {
    if (typeof session.earnedXp === "number") return sum + session.earnedXp;
    return sum + calculateSessionXp(session.durationMinutes);
  }, 0);
}

function getXpStatus(totalXp) {
  var level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  var xpIntoLevel = totalXp % XP_PER_LEVEL;
  var xpToNext = XP_PER_LEVEL - xpIntoLevel;
  return {
    level: level,
    xpIntoLevel: xpIntoLevel,
    xpToNext: xpToNext,
    progressRatio: xpIntoLevel / XP_PER_LEVEL,
    sessionsToNext: Math.max(1, Math.ceil(xpToNext / XP_PER_25_MIN_SESSION))
  };
}

function setCircleProgress(element, ratio) {
  if (!element) return;
  var radius = Number(element.getAttribute("r")) || 0;
  var circumference = 2 * Math.PI * radius;
  var safeRatio = Math.max(0, Math.min(1, ratio || 0));
  element.style.strokeDasharray = String(circumference);
  element.style.strokeDashoffset = String(circumference * (1 - safeRatio));
}

/* â”€â”€ TIMER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function startSessionTimer(onTick) {
  stopSessionTimer();
  onTick();
  sessionTimerHandle = window.setInterval(onTick, 1000);
}

function stopSessionTimer() {
  if (sessionTimerHandle) { window.clearInterval(sessionTimerHandle); sessionTimerHandle = null; }
}

function getCheckInIntervalMs(durationMinutes) {
  if (durationMinutes <= 20) return 10 * 60 * 1000;
  if (durationMinutes <= 30) return 15 * 60 * 1000;
  return 25 * 60 * 1000;
}

/* â”€â”€ STATE HELPERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function getCurrentTopicContext(state) {
  if (state.activeSession) return { topic: state.activeSession.topic, subject: state.activeSession.subject, durationMinutes: state.activeSession.durationMinutes };
  return { topic: state.draft.topic, subject: state.draft.subject, durationMinutes: state.draft.durationMinutes };
}

function renderNoticeElement(element, message) {
  if (!element) return;
  if (!message) { element.hidden = true; element.textContent = ""; return; }
  element.hidden = false; element.textContent = message;
}

/* â”€â”€ VISUAL RENDERER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function renderTopicVisual(content) {
  switch (content.visualKind) {
    case "complex-plane": return '<svg viewBox="0 0 420 280" aria-label="Complex plane rotation"><rect x="20" y="20" width="380" height="240" rx="28" fill="#fffaf4"></rect><line x1="70" y1="140" x2="350" y2="140" stroke="#7a746e" stroke-width="2"></line><line x1="210" y1="50" x2="210" y2="230" stroke="#7a746e" stroke-width="2"></line><circle cx="210" cy="140" r="82" fill="none" stroke="#355c56" stroke-width="3"></circle><circle cx="292" cy="140" r="7" fill="#d58d7b"></circle><circle cx="210" cy="58" r="7" fill="#355c56"></circle><path d="M292 140 A82 82 0 0 0 210 58" fill="none" stroke="#d58d7b" stroke-width="4" stroke-linecap="round"></path><path d="M228 60 L210 58 L218 75" fill="none" stroke="#d58d7b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><text x="305" y="130" font-size="20" fill="#2d2a29" font-family="Plus Jakarta Sans">1</text><text x="224" y="55" font-size="20" fill="#2d2a29" font-family="Plus Jakarta Sans">i</text><text x="82" y="160" font-size="14" fill="#6f6761" font-family="Plus Jakarta Sans">real axis</text><text x="222" y="80" font-size="14" fill="#6f6761" font-family="Plus Jakarta Sans">imaginary axis</text></svg>';
    case "parabola":      return '<svg viewBox="0 0 420 280" aria-label="Parabola graph"><rect x="20" y="20" width="380" height="240" rx="28" fill="#fffaf4"></rect><line x1="70" y1="210" x2="350" y2="210" stroke="#7a746e" stroke-width="2"></line><line x1="210" y1="50" x2="210" y2="230" stroke="#7a746e" stroke-width="2"></line><path d="M95 190 Q210 60 325 190" fill="none" stroke="#355c56" stroke-width="4"></path><line x1="210" y1="60" x2="210" y2="210" stroke="#d58d7b" stroke-dasharray="6 6" stroke-width="2"></line><circle cx="210" cy="60" r="6" fill="#d58d7b"></circle><circle cx="125" cy="210" r="6" fill="#355c56"></circle><circle cx="295" cy="210" r="6" fill="#355c56"></circle><text x="222" y="58" font-size="15" fill="#2d2a29" font-family="Plus Jakarta Sans">vertex</text><text x="103" y="232" font-size="14" fill="#6f6761" font-family="Plus Jakarta Sans">root</text><text x="284" y="232" font-size="14" fill="#6f6761" font-family="Plus Jakarta Sans">root</text></svg>';
    case "pressure":      return '<svg viewBox="0 0 420 280" aria-label="Pressure curve"><rect x="20" y="20" width="380" height="240" rx="28" fill="#fffaf4"></rect><line x1="70" y1="220" x2="350" y2="220" stroke="#7a746e" stroke-width="2"></line><line x1="70" y1="220" x2="70" y2="60" stroke="#7a746e" stroke-width="2"></line><path d="M78 212 C140 208 172 192 210 165 C250 136 282 110 332 62" fill="none" stroke="#d58d7b" stroke-width="5" stroke-linecap="round"></path><line x1="320" y1="50" x2="320" y2="220" stroke="#355c56" stroke-dasharray="6 6" stroke-width="2"></line><text x="84" y="74" font-size="14" fill="#6f6761" font-family="Plus Jakarta Sans">pressure</text><text x="262" y="78" font-size="14" fill="#355c56" font-family="Plus Jakarta Sans">rupture point</text><text x="86" y="242" font-size="14" fill="#6f6761" font-family="Plus Jakarta Sans">time</text></svg>';
    case "cycle":         return '<svg viewBox="0 0 420 280" aria-label="Energy cycle"><rect x="20" y="20" width="380" height="240" rx="28" fill="#fffaf4"></rect><rect x="68" y="105" width="110" height="70" rx="18" fill="#dce9e2"></rect><rect x="242" y="105" width="110" height="70" rx="18" fill="#dce8f3"></rect><path d="M178 140 C205 100 220 100 242 140" fill="none" stroke="#d58d7b" stroke-width="4" stroke-linecap="round"></path><path d="M242 150 C220 190 205 190 178 150" fill="none" stroke="#355c56" stroke-width="4" stroke-linecap="round"></path><path d="M236 136 L243 141 L233 148" fill="none" stroke="#d58d7b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M184 154 L177 149 L187 142" fill="none" stroke="#355c56" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><text x="92" y="145" font-size="16" fill="#2d2a29" font-family="Plus Jakarta Sans">photosyn.</text><text x="258" y="145" font-size="16" fill="#2d2a29" font-family="Plus Jakarta Sans">respiration</text></svg>';
    case "shells":        return '<svg viewBox="0 0 420 280" aria-label="Electron shells"><rect x="20" y="20" width="380" height="240" rx="28" fill="#fffaf4"></rect><circle cx="210" cy="140" r="20" fill="#d58d7b"></circle><circle cx="210" cy="140" r="48" fill="none" stroke="#355c56" stroke-width="3"></circle><circle cx="210" cy="140" r="82" fill="none" stroke="#8aa6a0" stroke-width="3"></circle><circle cx="258" cy="140" r="5" fill="#355c56"></circle><circle cx="210" cy="58" r="5" fill="#355c56"></circle><circle cx="128" cy="140" r="5" fill="#355c56"></circle><circle cx="210" cy="188" r="5" fill="#355c56"></circle><text x="196" y="145" font-size="13" fill="#fffaf4" font-family="Plus Jakarta Sans">nucleus</text><text x="265" y="138" font-size="13" fill="#6f6761" font-family="Plus Jakarta Sans">outer electrons</text></svg>';
    case "supply-demand": return '<svg viewBox="0 0 420 280" aria-label="Supply and demand graph"><rect x="20" y="20" width="380" height="240" rx="28" fill="#fffaf4"></rect><line x1="70" y1="220" x2="350" y2="220" stroke="#7a746e" stroke-width="2"></line><line x1="70" y1="220" x2="70" y2="60" stroke="#7a746e" stroke-width="2"></line><line x1="95" y1="205" x2="320" y2="80" stroke="#355c56" stroke-width="4"></line><line x1="105" y1="82" x2="325" y2="195" stroke="#d58d7b" stroke-width="4"></line><circle cx="216" cy="139" r="7" fill="#2d2a29"></circle><text x="95" y="76" font-size="15" fill="#d58d7b" font-family="Plus Jakarta Sans">demand</text><text x="305" y="92" font-size="15" fill="#355c56" font-family="Plus Jakarta Sans">supply</text><text x="225" y="130" font-size="14" fill="#2d2a29" font-family="Plus Jakarta Sans">equilibrium</text></svg>';
    case "tension":       return '<svg viewBox="0 0 420 280" aria-label="Narrative tension arc"><rect x="20" y="20" width="380" height="240" rx="28" fill="#fffaf4"></rect><line x1="70" y1="220" x2="350" y2="220" stroke="#7a746e" stroke-width="2"></line><path d="M75 220 C135 214 170 190 210 130 C245 78 292 72 346 118" fill="none" stroke="#355c56" stroke-width="5" stroke-linecap="round"></path><path d="M346 118 C356 130 360 140 360 168" fill="none" stroke="#d58d7b" stroke-width="4" stroke-linecap="round"></path><text x="82" y="236" font-size="13" fill="#6f6761" font-family="Plus Jakarta Sans">opening</text><text x="194" y="118" font-size="14" fill="#355c56" font-family="Plus Jakarta Sans">pressure peaks</text><text x="305" y="184" font-size="13" fill="#d58d7b" font-family="Plus Jakarta Sans">resolution</text></svg>';
    case "entropy":       return '<svg viewBox="0 0 420 280" aria-label="Energy spreading"><rect x="20" y="20" width="380" height="240" rx="28" fill="#fffaf4"></rect><rect x="70" y="95" width="110" height="90" rx="18" fill="#dce8f3"></rect><rect x="240" y="95" width="110" height="90" rx="18" fill="#dce9e2"></rect><circle cx="102" cy="124" r="8" fill="#d58d7b"></circle><circle cx="126" cy="124" r="8" fill="#d58d7b"></circle><circle cx="114" cy="152" r="8" fill="#d58d7b"></circle><circle cx="284" cy="118" r="8" fill="#355c56"></circle><circle cx="314" cy="122" r="8" fill="#355c56"></circle><circle cx="264" cy="145" r="8" fill="#355c56"></circle><circle cx="302" cy="154" r="8" fill="#355c56"></circle><circle cx="336" cy="168" r="8" fill="#355c56"></circle><path d="M182 140 L238 140" stroke="#7a746e" stroke-width="3" stroke-linecap="round"></path><path d="M224 126 L238 140 L224 154" fill="none" stroke="#7a746e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><text x="76" y="82" font-size="14" fill="#6f6761" font-family="Plus Jakarta Sans">concentrated</text><text x="250" y="82" font-size="14" fill="#6f6761" font-family="Plus Jakarta Sans">dispersed</text></svg>';
    default:              return '<svg viewBox="0 0 420 280" aria-label="General topic visual"><rect x="20" y="20" width="380" height="240" rx="28" fill="#fffaf4"></rect><circle cx="108" cy="140" r="16" fill="#d58d7b"></circle><circle cx="210" cy="100" r="16" fill="#355c56"></circle><circle cx="312" cy="160" r="16" fill="#9bb7c1"></circle><path d="M124 140 C150 140 165 115 194 104" fill="none" stroke="#7a746e" stroke-width="3" stroke-linecap="round"></path><path d="M226 104 C250 110 270 140 296 156" fill="none" stroke="#7a746e" stroke-width="3" stroke-linecap="round"></path><text x="74" y="172" font-size="14" fill="#6f6761" font-family="Plus Jakarta Sans">question</text><text x="180" y="82" font-size="14" fill="#6f6761" font-family="Plus Jakarta Sans">pattern</text><text x="288" y="190" font-size="14" fill="#6f6761" font-family="Plus Jakarta Sans">insight</text></svg>';
  }
}

/* â”€â”€ STORAGE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function hydrateAppState(rawState) {
  return {
    draft: Object.assign(defaultDraftState(), (rawState && rawState.draft) ? rawState.draft : {}),
    activeSession: (rawState && rawState.activeSession) ? rawState.activeSession : null,
    wrapUp:        (rawState && rawState.wrapUp)        ? rawState.wrapUp        : null,
    notice:        (rawState && rawState.notice)        ? rawState.notice        : ""
  };
}

function defaultDraftState() {
  return { pact: "", subject: "mathematics", topic: "", durationMinutes: DEFAULT_DURATION, tasks: [] };
}

function getUser()   { return readJson(STORAGE_KEYS.user, null); }
function setUser(name) { writeJson(STORAGE_KEYS.user, { name: name, createdAt: new Date().toISOString() }); }
function clearIdentity() { localStorage.removeItem(STORAGE_KEYS.user); }

function requireUser() {
  var user = getUser();
  if (!user) { navigate("login"); return null; }
  return user;
}

function getSessions()          { return readJson(STORAGE_KEYS.sessions, []); }
function saveSessions(sessions) { writeJson(STORAGE_KEYS.sessions, sessions); }
function getState()             { return readJson(STORAGE_KEYS.state, null); }
function saveState(state)       { writeJson(STORAGE_KEYS.state, state); }

function readJson(key, fallback) {
  try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(e) { return fallback; }
}
function writeJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

/* â”€â”€ TEMPLATE / FORMAT UTILS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function fillTemplate(template, topicLabel) {
  return String(template).replace(/\{topic\}/g, topicLabel || "this topic");
}

function normalize(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function toTitleCase(value) {
  return String(value || "").split(/\s+/).filter(Boolean)
    .map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }).join(" ");
}

function selectByRotation(list, index) { return list[index % list.length]; }

function formatDuration(milliseconds) {
  var total   = Math.max(0, Math.floor(milliseconds / 1000));
  var minutes = String(Math.floor(total / 60)).padStart(2, "0");
  var seconds = String(total % 60).padStart(2, "0");
  return minutes + ":" + seconds;
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatSubjectLabel(subject) {
  var labels = { mathematics:"Mathematics", physics:"Physics", chemistry:"Chemistry", biology:"Biology", history:"History", literature:"Literature", economics:"Economics", general:"General" };
  return labels[subject] || "General";
}

function summarizePact(pact) {
  var cleaned = pact.trim();
  if (!cleaned) return "-";
  return cleaned.length > 38 ? cleaned.slice(0, 38) + "..." : cleaned;
}

function dateKey(date) {
  return date.getFullYear() + "-" + String(date.getMonth()+1).padStart(2,"0") + "-" + String(date.getDate()).padStart(2,"0");
}

function daysBetween(a, b) {
  var fa = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  var fb = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.abs(Math.round((fb - fa) / 86400000));
}

function escapeHtml(value) {
  return String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

/* â”€â”€ BOOT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
document.addEventListener("DOMContentLoaded", function() {
  // Cache all page templates before first navigation
  ["home","login","app","hook","session"].forEach(function(name) {
    var el = document.getElementById("page-" + name);
    if (el) PAGE_TEMPLATES[name] = el.innerHTML;
  });

  navigate(getPageFromLocation(), { skipHash: true });
});
