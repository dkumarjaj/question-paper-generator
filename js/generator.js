function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


/* =========================
   ROMAN NUMBERS
========================= */

function romanNumber(number) {

    const roman = [

        "",
        "i",
        "ii",
        "iii",
        "iv",
        "v",
        "vi",
        "vii",
        "viii",
        "ix",
        "x",
        "xi",
        "xii",
        "xiii",
        "xiv",
        "xv"

    ];

    return roman[number] || number;

}


/* =========================
   GET PAPER DETAILS
========================= */

function getPaperDetails() {

    return {

        schoolName:
            document.getElementById(
                "schoolName"
            ).value,

        examName:
            document.getElementById(
                "examName"
            ).value,

        className:
            document.getElementById(
                "className"
            ).value,

        subjectName:
            document.getElementById(
                "subjectName"
            ).value,

        fullMarks:
            document.getElementById(
                "fullMarks"
            ).value,

        examTime:
            document.getElementById(
                "examTime"
            ).value

    };

}


/* =========================
   PAPER HEADER
========================= */

function createPaperHeader(details) {

    return `

        <div class="paper-header">

            <div class="paper-school">

                ${escapeHTML(
                    details.schoolName
                )}

            </div>


            <div class="paper-exam">

                ${escapeHTML(
                    details.examName
                )}

            </div>


            <div class="paper-subject">

                Sub: ${escapeHTML(
                    details.subjectName
                )}

            </div>


            <div class="paper-info">

                <span>

                    Time:
                    ${escapeHTML(
                        details.examTime
                    )}

                </span>


                <span>

                    Class: STD-
                    ${escapeHTML(
                        details.className
                    )}

                </span>


                <span>

                    F.M.:
                    ${escapeHTML(
                        details.fullMarks
                    )}

                </span>

            </div>

        </div>

    `;

}


/* =========================
   SHUFFLE ARRAY
========================= */

function shuffleArray(array) {

    const shuffled =
        [...array];

    for (
        let i =
            shuffled.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            shuffled[i],
            shuffled[randomIndex]
        ] =
        [
            shuffled[randomIndex],
            shuffled[i]
        ];

    }

    return shuffled;

}


/* =========================
   CREATE QUESTION
========================= */

function createQuestionHTML(
    type,
    question,
    number
) {

    const text =
        escapeHTML(
            question.text
        );


    /* MCQ */

    if (type === "mcq") {

        return `

            <div class="paper-question">

                (${romanNumber(number)})

                ${text}


                <div class="paper-options">

                    ${
                        question.a
                            ? `
                                <div>
                                    (a)
                                    ${escapeHTML(
                                        question.a
                                    )}
                                </div>
                            `
                            : ""
                    }


                    ${
                        question.b
                            ? `
                                <div>
                                    (b)
                                    ${escapeHTML(
                                        question.b
                                    )}
                                </div>
                            `
                            : ""
                    }


                    ${
                        question.c
                            ? `
                                <div>
                                    (c)
                                    ${escapeHTML(
                                        question.c
                                    )}
                                </div>
                            `
                            : ""
                    }


                    ${
                        question.d
                            ? `
                                <div>
                                    (d)
                                    ${escapeHTML(
                                        question.d
                                    )}
                                </div>
                            `
                            : ""
                    }

                </div>

            </div>

        `;

    }


    /* TRUE / FALSE */

    if (type === "truefalse") {

        return `

            <div class="paper-question">

                (${romanNumber(number)})

                ${text}

                (          )

            </div>

        `;

    }


    /* ONE WORD */

    if (type === "oneword") {

        return `

            <div class="paper-question">

                (${romanNumber(number)})

                ${text}

                ____________________

            </div>

        `;

    }


    /* =========================
       FILL IN THE BLANKS

       IMPORTANT:
       NO OPTIONS HERE.

       Options are shown ONCE
       for the entire section.
    ========================= */

    if (type === "fillblank") {

        return `

            <div class="paper-question">

                (${romanNumber(number)})

                ${text}

            </div>

        `;

    }


    /* CUSTOM */

    if (type === "custom") {

        return `

            <div class="paper-question">

                (${romanNumber(number)})

                ${text}

            </div>

        `;

    }


    return "";

}


/* =========================
   FILL IN THE BLANKS SECTION

   ONE COMBINED
   JUMBLED OPTIONS LIST
========================= */

function createFillBlankSectionHTML(
    title,
    questions
) {

    let sectionHTML = `

        <div class="paper-section">

            <div class="paper-section-title">

                ${escapeHTML(title)}

            </div>

    `;


    /* =========================
       COLLECT ALL OPTIONS
    ========================= */

    const allOptions = [];


    questions.forEach(
        question => {

            const rawOptions =
                question.jumbledOptions ||
                "";


            rawOptions
                .split(",")
                .map(
                    option =>
                        option.trim()
                )
                .filter(
                    option =>
                        option !== ""
                )
                .forEach(
                    option => {

                        allOptions.push(
                            option
                        );

                    }
                );

        }
    );


    /* REMOVE DUPLICATES */

    const uniqueOptions =
        [...new Set(allOptions)];


    /* SHUFFLE OPTIONS */

    const shuffledOptions =
        shuffleArray(
            uniqueOptions
        );


    /* =========================
       SHOW OPTIONS ONLY ONCE
    ========================= */

    if (
        shuffledOptions.length > 0
    ) {

        sectionHTML += `

            <div class="jumbled-options-box">

                <strong>
                    Choose from:
                </strong>

                <span class="jumbled-options-list">

                    [
                    ${shuffledOptions
                        .map(
                            option =>
                                escapeHTML(option)
                        )
                        .join(", ")}
                    ]

                </span>

            </div>

        `;

    }


    /* =========================
       SHOW QUESTIONS
       WITHOUT OPTIONS
    ========================= */

    questions.forEach(
        (
            question,
            index
        ) => {

            sectionHTML +=
                createQuestionHTML(
                    "fillblank",
                    question,
                    index + 1
                );

        }
    );


    sectionHTML += `

        </div>

    `;


    return sectionHTML;

}


/* =========================
   MATCH THE FOLLOWING
========================= */

function createMatchHTML(questions) {

    let rows = "";


    questions.forEach(
        (
            question,
            index
        ) => {

            rows += `

                <tr>

                    <td>

                        ${romanNumber(index + 1)}.

                        ${escapeHTML(
                            question.matchLeft
                        )}

                    </td>


                    <td>

                        ${index + 1}.

                        ${escapeHTML(
                            question.matchRight
                        )}

                    </td>

                </tr>

            `;

        }
    );


    return `

        <table class="paper-match-table">

            <thead>

                <tr>

                    <th>
                        Column A
                    </th>

                    <th>
                        Column B
                    </th>

                </tr>

            </thead>


            <tbody>

                ${rows}

            </tbody>

        </table>

    `;

}


/* =========================
   GET QUESTION DATA
========================= */

function getQuestionData(question) {

    return {

        text:
            question.querySelector(
                ".question-text"
            )?.value || "",


        a:
            question.querySelector(
                ".option-a"
            )?.value || "",


        b:
            question.querySelector(
                ".option-b"
            )?.value || "",


        c:
            question.querySelector(
                ".option-c"
            )?.value || "",


        d:
            question.querySelector(
                ".option-d"
            )?.value || "",


        jumbledOptions:
            question.querySelector(
                ".jumbled-options"
            )?.value || ""

    };

}


/* =========================
   GET ALL PAPER BLOCKS
========================= */

function getPaperBlocks() {

    const blocks = [];


    const sections =
        document.querySelectorAll(
            ".question-section"
        );


    sections.forEach(
        section => {

            const type =
                section.dataset.type;


            const title =
                section.querySelector(
                    ".custom-section-title"
                )?.value || "";


            const questionElements =
                section.querySelectorAll(
                    ".question-card"
                );


            if (
                questionElements.length === 0
            ) {

                return;

            }


            /* =========================
               MATCH SECTION
            ========================= */

            if (
                type === "match"
            ) {

                const matchQuestions =
                    [];


                questionElements.forEach(
                    question => {

                        matchQuestions.push({

                            matchLeft:
                                question.querySelector(
                                    ".match-left"
                                )?.value || "",


                            matchRight:
                                question.querySelector(
                                    ".match-right"
                                )?.value || ""

                        });

                    }
                );


                let sectionHTML = `

                    <div class="paper-section">

                        <div class="paper-section-title">

                            ${escapeHTML(title)}

                        </div>

                `;


                sectionHTML +=
                    createMatchHTML(
                        matchQuestions
                    );


                sectionHTML += `

                    </div>

                `;


                blocks.push(
                    sectionHTML
                );


                return;

            }


            /* =========================
               GET NORMAL QUESTION DATA
            ========================= */

            const questions = [];


            questionElements.forEach(
                question => {

                    questions.push(
                        getQuestionData(
                            question
                        )
                    );

                }
            );


            /* =========================
               FILL IN THE BLANKS

               ENTIRE SECTION IS
               GENERATED AS ONE BLOCK
            ========================= */

            if (
                type === "fillblank"
            ) {

                blocks.push(
                    createFillBlankSectionHTML(
                        title,
                        questions
                    )
                );


                return;

            }


            /* =========================
               OTHER QUESTION TYPES
            ========================= */

            let sectionStarted =
                false;


            questions.forEach(
                (
                    questionData,
                    index
                ) => {

                    let questionHTML = `

                        <div class="paper-section">

                    `;


                    if (
                        !sectionStarted
                    ) {

                        questionHTML += `

                            <div class="paper-section-title">

                                ${escapeHTML(title)}

                            </div>

                        `;


                        sectionStarted =
                            true;

                    }


                    questionHTML +=
                        createQuestionHTML(
                            type,
                            questionData,
                            index + 1
                        );


                    questionHTML += `

                        </div>

                    `;


                    blocks.push(
                        questionHTML
                    );

                }
            );

        }
    );


    return blocks;

}


/* =========================
   SPLIT INTO PAGES
========================= */

function splitIntoPages(
    details,
    blocks
) {

    const measurer =
        document.getElementById(
            "pageMeasurer"
        );


    const pages = [];


    let currentBlocks = [];


    function measure(blockList) {

        measurer.innerHTML =
            createPaperHeader(
                details
            ) +
            blockList.join("");


        return (
            measurer.scrollHeight >
            measurer.clientHeight
        );

    }


    blocks.forEach(
        block => {

            const testBlocks = [

                ...currentBlocks,
                block

            ];


            if (
                currentBlocks.length > 0 &&
                measure(testBlocks)
            ) {

                pages.push(
                    currentBlocks
                );


                currentBlocks = [
                    block
                ];

            }

            else {

                currentBlocks =
                    testBlocks;

            }

        }
    );


    if (
        currentBlocks.length > 0
    ) {

        pages.push(
            currentBlocks
        );

    }


    return pages;

}


/* =========================
   GENERATE PREVIEW
========================= */

function generatePreview() {

    const preview =
        document.getElementById(
            "paperPreview"
        );


    const details =
        getPaperDetails();


    const blocks =
        getPaperBlocks();


    if (
        blocks.length === 0
    ) {

        preview.innerHTML = `

            <div
                style="
                    padding: 40px;
                    text-align: center;
                "
            >

                No questions added.

            </div>

        `;


        return;

    }


    const pages =
        splitIntoPages(
            details,
            blocks
        );


    let finalHTML = "";


    pages.forEach(
        pageBlocks => {

            const content =
                createPaperHeader(
                    details
                ) +
                pageBlocks.join("");


            finalHTML += `

                <div class="paper-page">

                    <div class="paper-copy">

                        ${content}

                    </div>


                    <div class="paper-copy">

                        ${content}

                    </div>

                </div>

            `;

        }
    );


    preview.innerHTML =
        finalHTML;

}