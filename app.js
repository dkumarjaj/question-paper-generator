/**
 * QUESTION PAPER GENERATOR - CORE CONTROLLER
 */

const STORAGE_KEY = "questionPaperGeneratorData";

// Default Application State
let paperData = {
  paperDetails: {
    schoolName: "Bharat Tech Force ",
    schoolAddress: "Harhanja, Jhajha - 811308 ",
    examName: "ANNUAL EXAMINATION 2025-26",
    className: "Class VIII",
    subjectName: "Compute Science",
    fullMarks: "80",
    examTime: "3 Hours",
    numberingScheme: "restart"
  },
  sections: [],
  standaloneQuestions: []
};

// UI Element Handles
const elements = {
  schoolName: document.getElementById("schoolName"),
  schoolAddress: document.getElementById("schoolAddress"),
  examName: document.getElementById("examName"),
  className: document.getElementById("className"),
  subjectName: document.getElementById("subjectName"),
  fullMarks: document.getElementById("fullMarks"),
  examTime: document.getElementById("examTime"),
  numberingScheme: document.getElementById("numberingScheme"),
  paperCanvas: document.getElementById("paperCanvas"),
  addQuestionTypeSelect: document.getElementById("addQuestionTypeSelect"),
  btnAddQuestion: document.getElementById("btnAddQuestion"),
  btnAddSection: document.getElementById("btnAddSection"),
  btnSaveDraft: document.getElementById("btnSaveDraft"),
  btnLoadDraft: document.getElementById("btnLoadDraft"),
  btnClearDraft: document.getElementById("btnClearDraft"),
  btnImport: document.getElementById("btnImport"),
  btnExport: document.getElementById("btnExport"),
  btnTogglePreview: document.getElementById("btnTogglePreview"),
  btnPrint: document.getElementById("btnPrint"),
  editorPanel: document.getElementById("editorPanel"),
  previewPanel: document.getElementById("previewPanel"),
  btnClosePreview: document.getElementById("btnClosePreview"),
  printContainer: document.getElementById("printContainer"),
  dataModal: document.getElementById("dataModal"),
  modalTitle: document.getElementById("modalTitle"),
  modalDescription: document.getElementById("modalDescription"),
  modalTextarea: document.getElementById("modalTextarea"),
  btnModalSubmit: document.getElementById("btnModalSubmit"),
  btnModalCopy: document.getElementById("btnModalCopy"),
  btnModalClose: document.getElementById("btnModalClose")
};

// Application Initialization
document.addEventListener("DOMContentLoaded", () => {
  attachEventListeners();
  loadDraftOnStart();
});

function attachEventListeners() {
  // Details form binding
  const fields = ["schoolName", "schoolAddress", "examName", "className", "subjectName", "fullMarks", "examTime", "numberingScheme"];
  fields.forEach(field => {
    elements[field].addEventListener("input", (e) => {
      paperData.paperDetails[field] = e.target.value;
    });
  });

  // Action Buttons
  elements.btnAddSection.addEventListener("click", addSection);
  elements.btnAddQuestion.addEventListener("click", addStandaloneQuestion);
  elements.btnSaveDraft.addEventListener("click", saveDraft);
  elements.btnLoadDraft.addEventListener("click", loadDraft);
  elements.btnClearDraft.addEventListener("click", clearDraft);
  elements.btnImport.addEventListener("click", openImportModal);
  elements.btnExport.addEventListener("click", openExportModal);
  elements.btnTogglePreview.addEventListener("click", togglePreview);
  elements.btnClosePreview.addEventListener("click", togglePreview);
  elements.btnPrint.addEventListener("click", triggerPrint);

  // Modal actions
  elements.btnModalClose.addEventListener("click", closeModal);
}

// ==========================================================================
// STATE MANAGEMENT & LOCALSTORAGE
// ==========================================================================

function syncFormToState() {
  paperData.paperDetails.schoolName = elements.schoolName.value;
  paperData.paperDetails.schoolAddress = elements.schoolAddress.value;
  paperData.paperDetails.examName = elements.examName.value;
  paperData.paperDetails.className = elements.className.value;
  paperData.paperDetails.subjectName = elements.subjectName.value;
  paperData.paperDetails.fullMarks = elements.fullMarks.value;
  paperData.paperDetails.examTime = elements.examTime.value;
  paperData.paperDetails.numberingScheme = elements.numberingScheme.value;
}

function syncStateToForm() {
  elements.schoolName.value = paperData.paperDetails.schoolName || "";
  elements.schoolAddress.value = paperData.paperDetails.schoolAddress || "";
  elements.examName.value = paperData.paperDetails.examName || "";
  elements.className.value = paperData.paperDetails.className || "";
  elements.subjectName.value = paperData.paperDetails.subjectName || "";
  elements.fullMarks.value = paperData.paperDetails.fullMarks || "";
  elements.examTime.value = paperData.paperDetails.examTime || "";
  elements.numberingScheme.value = paperData.paperDetails.numberingScheme || "restart";
}

function saveDraft() {
  syncFormToState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(paperData));
  alert("Draft saved successfully to LocalStorage.");
}

function ensureDataStructure() {
  if (!paperData) paperData = {};
  if (!paperData.paperDetails) paperData.paperDetails = {};
  if (!Array.isArray(paperData.sections)) paperData.sections = [];
  if (!Array.isArray(paperData.standaloneQuestions)) paperData.standaloneQuestions = [];
}

function loadDraftOnStart() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      paperData = JSON.parse(raw);
    } catch(e) {
      console.error("Error parsing saved draft:", e);
    }
  }
  ensureDataStructure();
  syncStateToForm();
  renderEditor();
}

function loadDraft() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    alert("No saved draft found in LocalStorage.");
    return;
  }
  try {
    paperData = JSON.parse(raw);
    ensureDataStructure();
    syncStateToForm();
    renderEditor();
    alert("Draft loaded successfully.");
  } catch (e) {
    alert("Failed to parse saved draft data.");
  }
}

function clearDraft() {
  if (confirm("Are you sure you want to clear the paper draft? All unsaved work will be lost.")) {
    localStorage.removeItem(STORAGE_KEY);
    paperData = {
      paperDetails: { schoolName: "", schoolAddress: "", examName: "", className: "", subjectName: "", fullMarks: "", examTime: "", numberingScheme: "restart" },
      sections: [],
      standaloneQuestions: []
    };
    syncStateToForm();
    renderEditor();
    alert("Draft cleared.");
  }
}

// ==========================================================================
// IMPORT & EXPORT
// ==========================================================================

function openImportModal() {
  elements.modalTitle.innerText = "Import Data";
  elements.modalDescription.innerText = "Paste JSON or JavaScript code (Format 1, 2, or 3):";
  elements.modalTextarea.value = "";
  elements.btnModalSubmit.classList.remove("hidden");
  elements.btnModalCopy.classList.add("hidden");
  
  elements.btnModalSubmit.onclick = processImport;
  elements.dataModal.classList.remove("hidden");
}

function processImport() {
  const rawInput = elements.modalTextarea.value.trim();
  if (!rawInput) {
    alert("Please enter valid data to import.");
    return;
  }

  try {
    let extractedJSON = "";

    // FORMAT 3 Check (KEY / VALUE format)
    if (rawInput.includes("KEY:") && rawInput.includes("VALUE:")) {
      extractedJSON = rawInput.split("VALUE:")[1].trim();
    } 
    // FORMAT 2 Check (JavaScript variable format)
    else if (rawInput.includes("const questionPaperGeneratorData =") || rawInput.includes("var questionPaperGeneratorData =") || rawInput.includes("let questionPaperGeneratorData =")) {
      const equalIndex = rawInput.indexOf("=");
      extractedJSON = rawInput.substring(equalIndex + 1).trim();
      if (extractedJSON.endsWith(";")) {
        extractedJSON = extractedJSON.slice(0, -1).trim();
      }
    } 
    // FORMAT 1 (Raw JSON)
    else {
      extractedJSON = rawInput;
    }

    const parsed = JSON.parse(extractedJSON);

    if (parsed && typeof parsed === "object") {
      paperData = {
        paperDetails: parsed.paperDetails || { schoolName: "", schoolAddress: "", examName: "", className: "", subjectName: "", fullMarks: "", examTime: "", numberingScheme: "restart" },
        sections: parsed.sections || [],
        standaloneQuestions: parsed.standaloneQuestions || []
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(paperData));
      syncStateToForm();
      renderEditor();
      closeModal();
      alert("Question Paper Data imported and loaded successfully!");
    } else {
      throw new Error("Invalid structure");
    }
  } catch (err) {
    alert("Failed to import: Invalid format or JSON structure.\nDetails: " + err.message);
  }
}

function openExportModal() {
  syncFormToState();
  const jsonStr = JSON.stringify(paperData, null, 2);
  const formattedExport = `KEY:\n${STORAGE_KEY}\n\nVALUE:\n${jsonStr}\n\n// Or JS Variable:\nconst questionPaperGeneratorData = ${jsonStr};`;

  elements.modalTitle.innerText = "Export Question Paper Data";
  elements.modalDescription.innerText = "Copy the code below to backup or transfer data:";
  elements.modalTextarea.value = formattedExport;
  
  elements.btnModalSubmit.classList.add("hidden");
  elements.btnModalCopy.classList.remove("hidden");

  elements.btnModalCopy.onclick = () => {
    navigator.clipboard.writeText(formattedExport).then(() => {
      alert("Export data copied to clipboard!");
    });
  };

  elements.dataModal.classList.remove("hidden");
}

function closeModal() {
  elements.dataModal.classList.add("hidden");
}

// ==========================================================================
// EDITOR BUILDER & RENDERER
// ==========================================================================

function createQuestionObject(type) {
  const id = "q_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
  const base = { id, type, title: "" };

  switch (type) {
    case "mcq":
      return { ...base, title: "Which of the following is correct?", options: ["Option A", "Option B", "Option C", "Option D"] };
    case "fillInBlanks":
      return { ...base, title: "The sun rises in the ________.", wordBank: ["east", "west", "north", "south"] };
    case "trueFalse":
      return { ...base, title: "The Earth revolves around the Sun." };
    case "matchFollowing":
      return { ...base, title: "Match Column A with Column B:", colAName: "Column A", colBName: "Column B", rows: [{ a: "Temple", b: "Hinduism" }, { a: "Mosque", b: "Islam" }] };
    case "oneWord":
      return { ...base, title: "What is the capital of India?" };
    case "shortAnswer":
      return { ...base, title: "Define Newton's First Law of Motion.", answerLines: 2 };
    case "longAnswer":
      return { ...base, title: "Explain the process of photosynthesis in detail.", answerLines: 5 };
    case "numerical":
      return { ...base, title: "Solve: 345 × 23 = ________", workingSpace: 3 };
    case "arrangeOrder":
      return { ...base, title: "Arrange in correct order:", items: "Seed, Flower, Plant, Fruit" };
    case "wordMeaning":
      return { ...base, title: "Write meanings / opposite words for:", items: ["अच्छा", "अपना", "कोमल"] };
    case "essayLetter":
      return { ...base, title: "Write an essay on 'My School':", lines: 8 };
    case "drawDiagram":
      return { ...base, title: "Draw and label a neat diagram of a plant cell.", boxHeight: 120 };
    case "custom":
    case "standalone":
    default:
      return { ...base, title: "Answer the question directly." };
  }
}

function addSection() {
  const newSec = {
    id: "sec_" + Date.now(),
    heading: "Section Heading (e.g. I. Tick the correct option)",
    questions: []
  };
  paperData.sections.push(newSec);
  renderEditor();
}

function addStandaloneQuestion() {
  const selectedType = elements.addQuestionTypeSelect.value;
  const q = createQuestionObject(selectedType);
  paperData.standaloneQuestions.push(q);
  renderEditor();
}

function addQuestionToSection(secIndex) {
  const selectedType = elements.addQuestionTypeSelect.value;
  const q = createQuestionObject(selectedType);
  paperData.sections[secIndex].questions.push(q);
  renderEditor();
}

function renderEditor() {
  elements.paperCanvas.innerHTML = "";

  // Render Sections
  paperData.sections.forEach((sec, sIdx) => {
    const secCard = document.createElement("div");
    secCard.className = "card section-card";

    secCard.innerHTML = `
      <div class="card-header-actions">
        <span class="card-title-text">Section ${sIdx + 1}</span>
        <div class="card-actions">
          <button class="btn btn-sm btn-secondary" onclick="moveSection(${sIdx}, -1)">▲ Move Up</button>
          <button class="btn btn-sm btn-secondary" onclick="moveSection(${sIdx}, 1)">▼ Move Down</button>
          <button class="btn btn-sm btn-outline" onclick="duplicateSection(${sIdx})">📋 Duplicate</button>
          <button class="btn btn-sm btn-danger" onclick="removeSection(${sIdx})">🗑️ Delete Section</button>
        </div>
      </div>
      <div class="form-group mb-3">
        <label>Section Heading / Instructions</label>
        <input type="text" class="form-control" value="${escapeHtml(sec.heading)}" oninput="updateSectionHeading(${sIdx}, this.value)">
      </div>
      <div class="section-questions-container" id="sec_container_${sIdx}"></div>
      <button class="btn btn-sm btn-primary mt-3" onclick="addQuestionToSection(${sIdx})">+ Add Question to Section ${sIdx + 1}</button>
    `;

    const qContainer = secCard.querySelector(`#sec_container_${sIdx}`);
    sec.questions.forEach((q, qIdx) => {

      qContainer.appendChild(renderQuestionEditor(q, (updatedQ) => {
        sec.questions[qIdx] = updatedQ;
      }, () => {
        sec.questions.splice(qIdx, 1);
        renderEditor();
      }, () => {
        sec.questions.splice(qIdx, 0, JSON.parse(JSON.stringify(sec.questions[qIdx])));
        renderEditor();
      }, (dir) => {
        moveArrayItem(sec.questions, qIdx, qIdx + dir);
        renderEditor();
      }));
    });

    elements.paperCanvas.appendChild(secCard);
  });

  // Render Standalone Questions Container
  if (paperData.standaloneQuestions.length > 0 || paperData.sections.length === 0) {
    const standaloneWrapper = document.createElement("div");
    standaloneWrapper.className = "card standalone-wrapper-card";
    standaloneWrapper.innerHTML = `<h3>Standalone Questions (Without Section)</h3><div id="standaloneContainer"></div>`;
    const sContainer = standaloneWrapper.querySelector("#standaloneContainer");

    paperData.standaloneQuestions.forEach((q, qIdx) => {
      sContainer.appendChild(renderQuestionEditor(q, (updatedQ) => {
        paperData.standaloneQuestions[qIdx] = updatedQ;
      }, () => {
        paperData.standaloneQuestions.splice(qIdx, 1);
        renderEditor();
      }, () => {
        paperData.standaloneQuestions.splice(qIdx, 0, JSON.parse(JSON.stringify(paperData.standaloneQuestions[qIdx])));
        renderEditor();
      }, (dir) => {
        moveArrayItem(paperData.standaloneQuestions, qIdx, qIdx + dir);
        renderEditor();
      }));
    });

    elements.paperCanvas.appendChild(standaloneWrapper);
  }
}

function updateSectionHeading(sIdx, val) {
  paperData.sections[sIdx].heading = val;
}

function moveSection(index, direction) {
  if (moveArrayItem(paperData.sections, index, index + direction)) {
    renderEditor();
  }
}

function duplicateSection(index) {
  const dup = JSON.parse(JSON.stringify(paperData.sections[index]));
  dup.id = "sec_" + Date.now();
  paperData.sections.splice(index + 1, 0, dup);
  renderEditor();
}

function removeSection(index) {
  if (confirm("Are you sure you want to delete this section and all its questions?")) {
    paperData.sections.splice(index, 1);
    renderEditor();
  }
}

// Question Component Editor Renderer
function renderQuestionEditor(q, onUpdate, onDelete, onDuplicate, onMove) {
  const card = document.createElement("div");
  card.className = "question-card";

  const typeLabels = {
    mcq: "MCQ", fillInBlanks: "Fill in Blanks", trueFalse: "True/False",
    matchFollowing: "Match Following", oneWord: "One Word", shortAnswer: "Short Answer",
    longAnswer: "Long Answer", numerical: "Numerical", arrangeOrder: "Arrange Order",
    wordMeaning: "Word Meaning", essayLetter: "Essay/Letter", drawDiagram: "Draw/Diagram",
    standalone: "Standalone", custom: "Custom"
  };

  card.innerHTML = `
    <div class="card-header-actions">
      <span class="card-title-text">[${typeLabels[q.type] || "Question"}]</span>
      <div class="card-actions">
        <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();">▲</button>
        <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();">▼</button>
        <button class="btn btn-sm btn-outline" onclick="event.stopPropagation();">📋</button>
        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation();">🗑️</button>
      </div>
    </div>
    <div class="form-group">
      <label>Question Text / Prompt</label>
      <input type="text" class="form-control q-title-input" value="${escapeHtml(q.title)}">
    </div>
    <div class="q-specific-builder"></div>
  `;

  // Action Buttons Bindings
  const btns = card.querySelectorAll(".card-actions button");
  btns[0].onclick = () => onMove(-1);
  btns[1].onclick = () => onMove(1);
  btns[2].onclick = () => onDuplicate();
  btns[3].onclick = () => onDelete();

  const titleInput = card.querySelector(".q-title-input");
  titleInput.oninput = (e) => {
    q.title = e.target.value;
    onUpdate(q);
  };

  const specificBuilder = card.querySelector(".q-specific-builder");

  // Sub-editors for specific question types
  if (q.type === "mcq") {
    renderMcqEditor(specificBuilder, q, onUpdate);
  } else if (q.type === "fillInBlanks") {
    renderWordBankEditor(specificBuilder, q, onUpdate);
  } else if (q.type === "matchFollowing") {
    renderMatchEditor(specificBuilder, q, onUpdate);
  } else if (q.type === "wordMeaning") {
    renderWordMeaningEditor(specificBuilder, q, onUpdate);
  } else if (["shortAnswer", "longAnswer", "essayLetter"].includes(q.type)) {
    renderLineConfigEditor(specificBuilder, q, onUpdate);
  }

  return card;
}

// Sub-editor renderers
function renderMcqEditor(container, q, onUpdate) {
  container.innerHTML = `<div class="options-builder"><label class="form-group label">Options (2 to 6):</label><div class="opt-list"></div><button class="btn btn-sm btn-outline btn-add-opt">+ Add Option</button></div>`;
  const list = container.querySelector(".opt-list");
  
  const refresh = () => {
    list.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const row = document.createElement("div");
      row.className = "option-row";
      row.innerHTML = `
        <span>(${String.fromCharCode(65 + idx)})</span>
        <input type="text" class="form-control" value="${escapeHtml(opt)}">
        <button class="btn btn-sm btn-danger">×</button>
      `;
      row.querySelector("input").oninput = (e) => { q.options[idx] = e.target.value; onUpdate(q); };
      row.querySelector("button").onclick = () => { if (q.options.length > 2) { q.options.splice(idx, 1); onUpdate(q); refresh(); } };
      list.appendChild(row);
    });
  };

  container.querySelector(".btn-add-opt").onclick = () => {
    if (q.options.length < 6) {
      q.options.push(`Option ${String.fromCharCode(65 + q.options.length)}`);
      onUpdate(q);
      refresh();
    }
  };
  refresh();
}

function renderWordBankEditor(container, q, onUpdate) {
  container.innerHTML = `<div class="options-builder"><label class="form-group label">Word Bank Items:</label><div class="wb-list"></div><button class="btn btn-sm btn-outline btn-add-wb">+ Add Word</button></div>`;
  const list = container.querySelector(".wb-list");

  const refresh = () => {
    list.innerHTML = "";
    q.wordBank.forEach((wb, idx) => {
      const row = document.createElement("div");
      row.className = "option-row";
      row.innerHTML = `<input type="text" class="form-control" value="${escapeHtml(wb)}"><button class="btn btn-sm btn-danger">×</button>`;
      row.querySelector("input").oninput = (e) => { q.wordBank[idx] = e.target.value; onUpdate(q); };
      row.querySelector("button").onclick = () => { q.wordBank.splice(idx, 1); onUpdate(q); refresh(); };
      list.appendChild(row);
    });
  };

  container.querySelector(".btn-add-wb").onclick = () => {
    q.wordBank.push("word");
    onUpdate(q);
    refresh();
  };
  refresh();
}

function renderMatchEditor(container, q, onUpdate) {
  container.innerHTML = `
    <div class="rows-builder mt-2">
      <div class="form-grid">
        <div class="form-group span-2"><label>Column A Name</label><input type="text" class="form-control col-a-name" value="${escapeHtml(q.colAName)}"></div>
        <div class="form-group span-2"><label>Column B Name</label><input type="text" class="form-control col-b-name" value="${escapeHtml(q.colBName)}"></div>
      </div>
      <label class="form-group label mt-2">Matching Pairs:</label>
      <div class="match-list"></div>
      <button class="btn btn-sm btn-outline btn-add-pair">+ Add Pair</button>
    </div>
  `;

  container.querySelector(".col-a-name").oninput = (e) => { q.colAName = e.target.value; onUpdate(q); };
  container.querySelector(".col-b-name").oninput = (e) => { q.colBName = e.target.value; onUpdate(q); };

  const list = container.querySelector(".match-list");
  const refresh = () => {
    list.innerHTML = "";
    q.rows.forEach((r, idx) => {
      const row = document.createElement("div");
      row.className = "match-row";
      row.innerHTML = `
        <input type="text" class="form-control" placeholder="Column A Item" value="${escapeHtml(r.a)}">
        <input type="text" class="form-control" placeholder="Column B Item" value="${escapeHtml(r.b)}">
        <button class="btn btn-sm btn-danger">×</button>
      `;
      const inputs = row.querySelectorAll("input");
      inputs[0].oninput = (e) => { q.rows[idx].a = e.target.value; onUpdate(q); };
      inputs[1].oninput = (e) => { q.rows[idx].b = e.target.value; onUpdate(q); };
      row.querySelector("button").onclick = () => { q.rows.splice(idx, 1); onUpdate(q); refresh(); };
      list.appendChild(row);
    });
  };

  container.querySelector(".btn-add-pair").onclick = () => {
    q.rows.push({ a: "", b: "" });
    onUpdate(q);
    refresh();
  };
  refresh();
}

function renderWordMeaningEditor(container, q, onUpdate) {
  container.innerHTML = `<div class="options-builder"><label class="form-group label">Items / Words List:</label><div class="wm-list"></div><button class="btn btn-sm btn-outline btn-add-wm">+ Add Item</button></div>`;
  const list = container.querySelector(".wm-list");

  const refresh = () => {
    list.innerHTML = "";
    q.items.forEach((item, idx) => {
      const row = document.createElement("div");
      row.className = "option-row";
      row.innerHTML = `<input type="text" class="form-control" value="${escapeHtml(item)}"><button class="btn btn-sm btn-danger">×</button>`;
      row.querySelector("input").oninput = (e) => { q.items[idx] = e.target.value; onUpdate(q); };
      row.querySelector("button").onclick = () => { q.items.splice(idx, 1); onUpdate(q); refresh(); };
      list.appendChild(row);
    });
  };

  container.querySelector(".btn-add-wm").onclick = () => {
    q.items.push("नया शब्द");
    onUpdate(q);
    refresh();
  };
  refresh();
}

function renderLineConfigEditor(container, q, onUpdate) {
  const fieldKey = q.type === "shortAnswer" || q.type === "longAnswer" ? "answerLines" : "lines";
  container.innerHTML = `
    <div class="form-group mt-2">
      <label>Answer Lines Count</label>
      <input type="number" min="1" max="20" class="form-control" value="${q[fieldKey] || 3}">
    </div>
  `;
  container.querySelector("input").oninput = (e) => {
    q[fieldKey] = parseInt(e.target.value) || 2;
    onUpdate(q);
  };
}

// ==========================================================================
// PREVIEW & PRINT ENGINE (A4 LANDSCAPE DUAL COPY GENERATOR)
// ==========================================================================

function togglePreview() {
  syncFormToState();
  if (elements.previewPanel.classList.contains("hidden")) {
    renderPrintLayout();
    elements.editorPanel.classList.add("hidden");
    elements.previewPanel.classList.remove("hidden");
  } else {
    elements.previewPanel.classList.add("hidden");
    elements.editorPanel.classList.remove("hidden");
  }
}

function triggerPrint() {
  syncFormToState();
  renderPrintLayout();
  window.print();
}

function renderPrintLayout() {
  elements.printContainer.innerHTML = "";

  // Build Paper Content HTML
  const singlePaperHTML = generateSinglePaperHTML();

  // Wrap inside A4 Landscape Twin Container
  const pageWrapper = document.createElement("div");
  pageWrapper.className = "print-page";

  pageWrapper.innerHTML = `
    <div class="paper-copy left-copy">${singlePaperHTML}</div>
    <div class="cut-line"></div>
    <div class="paper-copy right-copy">${singlePaperHTML}</div>
  `;

  elements.printContainer.appendChild(pageWrapper);
}

function generateSinglePaperHTML() {
  const details = paperData.paperDetails;

  let html = `
    <div class="print-header">
      <div class="print-school-name">${escapeHtml(details.schoolName || "SCHOOL NAME")}</div>
      <div class="print-school-address">${escapeHtml(details.schoolAddress || "School Address Here")}</div>
      <div class="print-exam-name">${escapeHtml(details.examName || "EXAMINATION NAME")}</div>

      <div class="print-meta-line">
        <span>Class: ${escapeHtml(details.className || "____")}</span>
        <span>Subject: ${escapeHtml(details.subjectName || "____")}</span>
        <span>Time: ${escapeHtml(details.examTime || "____")}</span>
        <span>Full Marks: ${escapeHtml(details.fullMarks || "____")}</span>
      </div>

      <div class="print-student-line">
        <span>Name: ____________________________________</span>
        <span>Adm. No.: ____________</span>
      </div>
    </div>

    <div class="print-body">
  `;

  // Sections
  paperData.sections.forEach((sec, sectionIndex) => {
    const sectionNumber = sectionIndex + 1;

    // Section heading
    html += `
      <div class="print-section-heading">
        ${sectionNumber}. ${escapeHtml(sec.heading)}
      </div>
    `;

    // ==========================================================
    // COLLECT ALL WORD BANK ITEMS FOR THIS SECTION
    // ==========================================================

    const sectionWordBank = [];

    sec.questions.forEach((q) => {
      if (
        q.type === "fillInBlanks" &&
        Array.isArray(q.wordBank)
      ) {
        q.wordBank.forEach((word) => {
          const cleanWord = String(word || "").trim();

          // Remove empty and duplicate words
          if (
            cleanWord &&
            !sectionWordBank.includes(cleanWord)
          ) {
            sectionWordBank.push(cleanWord);
          }
        });
      }
    });

    // ==========================================================
    // SINGLE OPTION BOX AFTER SECTION HEADING
    // ==========================================================

    if (sectionWordBank.length > 0) {
      html += `
        <div class="print-word-bank">
          <strong>Option Box:</strong>
      `;

      sectionWordBank.forEach((word, index) => {
        const optionLetter = String.fromCharCode(97 + index);

        html += `
          <span>
            ${optionLetter}. ${escapeHtml(word)}
          </span>
        `;
      });

      html += `
        </div>
      `;
    }

    // ==========================================================
    // QUESTIONS
    // ==========================================================

    sec.questions.forEach((q, questionIndex) => {
      const romanNumber = toRoman(questionIndex + 1);

      html += renderQuestionPrintHTML(
        q,
        romanNumber
      );
    });
  });

  // ==========================================================
  // STANDALONE QUESTIONS
  // ==========================================================

  if (paperData.standaloneQuestions.length > 0) {

    if (paperData.sections.length > 0) {
      const sectionNumber =
        paperData.sections.length + 1;

      html += `
        <div class="print-section-heading">
          ${sectionNumber}. General Questions
        </div>
      `;
    }

    paperData.standaloneQuestions.forEach(
      (q, questionIndex) => {

        const romanNumber =
          toRoman(questionIndex + 1);

        html += renderQuestionPrintHTML(
          q,
          romanNumber
        );
      }
    );
  }

  html += `</div>`;

  return html;
}
function renderQuestionPrintHTML(q, qNum) {

  let html = `
    <div class="print-question-block">
      <span class="print-question-text">
        ${qNum}. ${escapeHtml(q.title)}
      </span>
  `;


  switch (q.type) {

    // ==========================================================
    // MCQ
    // Options = a, b, c, d...
    // ==========================================================

    case "mcq":

      html += `<div class="print-options-container">`;

      q.options.forEach((opt, idx) => {

        const optionLetter =
          String.fromCharCode(97 + idx);

        html += `
          <span class="print-option-item">
            ${optionLetter}. ${escapeHtml(opt)}
          </span>
        `;

      });

      html += `</div>`;

      break;


    // ==========================================================
    // FILL IN THE BLANKS
    // ==========================================================

  case "fillInBlanks":
  // Option Box is displayed once after the section heading
  break;
    // ==========================================================
    // TRUE / FALSE
    // ==========================================================

    case "trueFalse":

      html += `
        <span style="float: right;">
          [ &nbsp; &nbsp; ]
        </span>
      `;

      break;


    // ==========================================================
    // MATCH THE FOLLOWING
    // ==========================================================

    case "matchFollowing":

      html += `
        <div class="print-match-container">

          <div class="print-match-header">

            <div class="print-match-col-a">
              ${escapeHtml(q.colAName || "Column A")}
            </div>

            <div class="print-match-col-b">
              ${escapeHtml(q.colBName || "Column B")}
            </div>

          </div>
      `;


      q.rows.forEach((r, idx) => {

        // Match rows = a, b, c...
        const rowLetter =
          String.fromCharCode(97 + idx);

        html += `
          <div class="print-match-row">

            <div class="print-match-col-a">
              ${rowLetter}. ${escapeHtml(r.a)}
            </div>

            <div class="print-match-col-b">
              ${escapeHtml(r.b)}
            </div>

          </div>
        `;

      });


      html += `</div>`;

      break;


    // ==========================================================
    // WORD MEANING
    // Items = a, b, c...
    // ==========================================================

    case "wordMeaning":

      html += `<div class="print-word-grid">`;

      q.items.forEach((item, idx) => {

        const itemLetter =
          String.fromCharCode(97 + idx);

        html += `
          <div class="print-word-item">
            ${itemLetter}. ${escapeHtml(item)}
          </div>
        `;

      });

      html += `</div>`;

      break;


    // ==========================================================
    // OTHER QUESTION TYPES
    // ==========================================================

    case "shortAnswer":
    case "longAnswer":
    case "essayLetter":
    case "drawDiagram":
    case "numerical":
    case "oneWord":
    default:

      break;
  }


  html += `</div>`;

  return html;
}

// Helper Utilities
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toRoman(num) {

  const romanMap = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"]
  ];

  let result = "";

  for (const [value, symbol] of romanMap) {

    while (num >= value) {
      result += symbol;
      num -= value;
    }

  }

  return result;
}

function moveArrayItem(arr, from, to) {
  if (to < 0 || to >= arr.length) return false;
  const item = arr.splice(from, 1)[0];
  arr.splice(to, 0, item);
  return true;
}