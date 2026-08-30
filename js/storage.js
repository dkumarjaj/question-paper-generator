const STORAGE_KEY =
    "questionPaperGeneratorData";



/* =========================
   GET FIELD
========================= */

function getValue(
    parent,
    selector
) {

    const element =
        parent.querySelector(
            selector
        );


    return element
        ? element.value
        : "";

}



/* =========================
   SET FIELD
========================= */

function setValue(
    parent,
    selector,
    value
) {

    const element =
        parent.querySelector(
            selector
        );


    if (element) {

        element.value =
            value || "";

    }

}



/* =========================
   SAVE
========================= */

function saveQuestionPaper() {

    const data = {

        paperDetails: {

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

        },


        sections: []

    };


    const sections =
        document.querySelectorAll(
            ".question-section"
        );


    sections.forEach(
        section => {

            const sectionData = {

                type:
                    section.dataset.type,

                title:
                    getValue(
                        section,
                        ".custom-section-title"
                    ),

                questions: []

            };


            const questions =
                section.querySelectorAll(
                    ".question-card"
                );


            questions.forEach(
                question => {

                    sectionData.questions.push({

                        text:
                            getValue(
                                question,
                                ".question-text"
                            ),

                        a:
                            getValue(
                                question,
                                ".option-a"
                            ),

                        b:
                            getValue(
                                question,
                                ".option-b"
                            ),

                        c:
                            getValue(
                                question,
                                ".option-c"
                            ),

                        d:
                            getValue(
                                question,
                                ".option-d"
                            ),

                        jumbledOptions:
                            getValue(
                                question,
                                ".jumbled-options"
                            ),

                        matchLeft:
                            getValue(
                                question,
                                ".match-left"
                            ),

                        matchRight:
                            getValue(
                                question,
                                ".match-right"
                            )

                    });

                }
            );


            data.sections.push(
                sectionData
            );

        }
    );


    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );


    updateSaveStatus(
        "Saved"
    );

}



/* =========================
   LOAD
========================= */

function loadQuestionPaper() {

    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );

        console.log(saved)

    if (!saved) {

        alert(
            "No saved draft found."
        );

        return;

    }


    let data;


    try {

        data =
            JSON.parse(saved);

    }

    catch (error) {

        console.error(error);

        alert(
            "Saved draft is invalid."
        );

        return;

    }


    const details =
        data.paperDetails || {};


    document.getElementById(
        "schoolName"
    ).value =
        details.schoolName || "";


    document.getElementById(
        "examName"
    ).value =
        details.examName || "";


    document.getElementById(
        "className"
    ).value =
        details.className || "";


    document.getElementById(
        "subjectName"
    ).value =
        details.subjectName || "";


    document.getElementById(
        "fullMarks"
    ).value =
        details.fullMarks || "";


    document.getElementById(
        "examTime"
    ).value =
        details.examTime || "";


    const container =
        document.getElementById(
            "sectionsContainer"
        );


    container.innerHTML = "";


    if (
        !data.sections ||
        data.sections.length === 0
    ) {

        checkEmptyState();

        return;

    }


    data.sections.forEach(
        savedSection => {

            const section =
                createSection(
                    savedSection.type
                );


            setValue(
                section,
                ".custom-section-title",
                savedSection.title
            );


            const questionsContainer =
                section.querySelector(
                    ".questions-container"
                );


            questionsContainer.innerHTML = "";


            savedSection.questions.forEach(
                savedQuestion => {

                    addQuestion(
                        section
                    );


                    const question =
                        questionsContainer.lastElementChild;


                    setValue(
                        question,
                        ".question-text",
                        savedQuestion.text
                    );


                    setValue(
                        question,
                        ".option-a",
                        savedQuestion.a
                    );


                    setValue(
                        question,
                        ".option-b",
                        savedQuestion.b
                    );


                    setValue(
                        question,
                        ".option-c",
                        savedQuestion.c
                    );


                    setValue(
                        question,
                        ".option-d",
                        savedQuestion.d
                    );


                    setValue(
                        question,
                        ".jumbled-options",
                        savedQuestion.jumbledOptions
                    );


                    setValue(
                        question,
                        ".match-left",
                        savedQuestion.matchLeft
                    );


                    setValue(
                        question,
                        ".match-right",
                        savedQuestion.matchRight
                    );

                }
            );


            renumberQuestions(
                section
            );

        }
    );


    updateSaveStatus(
        "Draft loaded"
    );

}



/* =========================
   CLEAR
========================= */

function clearSavedQuestionPaper() {

    const confirmed =
        confirm(
            "Clear the saved draft?"
        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(
        STORAGE_KEY
    );


    updateSaveStatus(
        "Draft cleared"
    );


    alert(
        "Saved draft cleared successfully."
    );

}



/* =========================
   STATUS
========================= */

function updateSaveStatus(
    message
) {

    const status =
        document.getElementById(
            "saveStatus"
        );


    if (status) {

        status.textContent =
            message;

    }

}



/* =========================
   AUTO SAVE
========================= */

let autoSaveTimer;


document.addEventListener(
    "input",
    () => {

        clearTimeout(
            autoSaveTimer
        );


        updateSaveStatus(
            "Saving..."
        );


        autoSaveTimer =
            setTimeout(
                () => {

                    saveQuestionPaper();

                },
                700
            );

    }
);