function getSectionTitle(
    type
) {

    const titles = {

        mcq:
            "Tick ( &#10003; ) the Correct Option.",

        truefalse:
            "Write \"True\" or \"False\".",

        match:
            "Match the Following.",

        oneword:
            "Answer in One Word.",

        fillblank:
            "Fill in the Blanks.",

        custom:
            "Custom Question Section."

    };


    return titles[type] || "Question Section";

}



/* =========================
   CREATE SECTION
========================= */

function createSection(
    type
) {

    const container =
        document.getElementById(
            "sectionsContainer"
        );


    if (!container) {

        return;

    }


    const section =
        document.createElement(
            "div"
        );


    section.className =
        "question-section";


    section.dataset.type =
        type;


    section.innerHTML = `

        <div class="question-section-header">

            <h3>
                ${getSectionTitle(type)}
            </h3>

            <button
                type="button"
                class="danger-btn remove-section-btn"
            >
                Remove Section
            </button>

        </div>


        <div class="question-section-body">


            <div class="form-group section-title-input">

                <label>
                    Section Heading
                </label>

                <input
                    type="text"
                    class="custom-section-title"
                    value="${getSectionTitle(type)}"
                >

            </div>


            <div class="questions-container">

            </div>


            <div class="section-actions">

                <button
                    type="button"
                    class="secondary-btn add-question-btn"
                >
                    + Add Question
                </button>

            </div>


        </div>

    `;


    container.appendChild(
        section
    );


    const addQuestionBtn =
        section.querySelector(
            ".add-question-btn"
        );


    const removeSectionBtn =
        section.querySelector(
            ".remove-section-btn"
        );


    addQuestionBtn.addEventListener(
        "click",
        () => {

            addQuestion(
                section
            );

        }
    );


    removeSectionBtn.addEventListener(
        "click",
        () => {

            section.remove();

            checkEmptyState();

        }
    );


    addQuestion(
        section
    );


    return section;

}



/* =========================
   EMPTY STATE
========================= */

function checkEmptyState() {

    const container =
        document.getElementById(
            "sectionsContainer"
        );


    if (!container) {

        return;

    }


    const sections =
        container.querySelectorAll(
            ".question-section"
        );


    if (
        sections.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No Question Sections Added
                </h3>

                <p>
                    Select a question type and click
                    "Add Section".
                </p>

            </div>

        `;

    }

}



/* =========================
   ADD QUESTION
========================= */

function addQuestion(
    section
) {

    const type =
        section.dataset.type;


    const container =
        section.querySelector(
            ".questions-container"
        );


    const question =
        document.createElement(
            "div"
        );


    question.className =
        "question-card";


    question.innerHTML = `

        <div class="question-card-top">

            <h4 class="question-number">
                Question
            </h4>

            <button
                type="button"
                class="danger-btn remove-question-btn"
            >
                Remove
            </button>

        </div>


        ${getQuestionFields(type)}

    `;


    container.appendChild(
        question
    );


    question
        .querySelector(
            ".remove-question-btn"
        )
        .addEventListener(
            "click",
            () => {

                question.remove();

                renumberQuestions(
                    section
                );

            }
        );


    renumberQuestions(
        section
    );

}



/* =========================
   QUESTION FIELDS
========================= */

function getQuestionFields(
    type
) {

    if (
        type === "mcq"
    ) {

        return `

            <div class="form-group">

                <label>
                    Question
                </label>

                <textarea
                    class="question-text"
                    placeholder="Enter question"
                ></textarea>

            </div>


            <div class="options-grid">

                <input
                    type="text"
                    class="option-a"
                    placeholder="Option A"
                >

                <input
                    type="text"
                    class="option-b"
                    placeholder="Option B"
                >

                <input
                    type="text"
                    class="option-c"
                    placeholder="Option C"
                >

                <input
                    type="text"
                    class="option-d"
                    placeholder="Option D"
                >

            </div>

        `;

    }


    if (
        type === "fillblank"
    ) {

        return `

            <div class="form-group">

                <label>
                    Fill in the Blank Question
                </label>

                <textarea
                    class="question-text"
                    placeholder="Example: A ______ is used to type letters."
                ></textarea>

            </div>


            <div class="form-group">

                <label>
                    Jumbled Options
                </label>

                <input
                    type="text"
                    class="jumbled-options"
                    placeholder="Keyboard, Mouse, Monitor"
                >

            </div>

        `;

    }


    if (
        type === "truefalse" ||
        type === "oneword" ||
        type === "custom"
    ) {

        return `

            <div class="form-group">

                <label>
                    Question
                </label>

                <textarea
                    class="question-text"
                    placeholder="Enter question"
                ></textarea>

            </div>

        `;

    }


    if (
        type === "match"
    ) {

        return `

            <div class="form-group">

                <label>
                    Column A
                </label>

                <input
                    type="text"
                    class="match-left"
                    placeholder="Example: Keyboard"
                >

            </div>


            <div class="form-group">

                <label>
                    Column B
                </label>

                <input
                    type="text"
                    class="match-right"
                    placeholder="Example: Input Device"
                >

            </div>

        `;

    }


    return "";

}



/* =========================
   RENUMBER
========================= */

function renumberQuestions(
    section
) {

    const questions =
        section.querySelectorAll(
            ".question-card"
        );


    questions.forEach(
        (
            question,
            index
        ) => {

            const number =
                question.querySelector(
                    ".question-number"
                );


            if (number) {

                number.textContent =
                    "Question " +
                    (index + 1);

            }

        }
    );

}