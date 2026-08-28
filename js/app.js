document.addEventListener(
    "DOMContentLoaded",
    () => {


        const addSectionBtn =
            document.getElementById(
                "addSectionBtn"
            );


        const questionTypeSelect =
            document.getElementById(
                "questionTypeSelect"
            );


        const previewBtn =
            document.getElementById(
                "previewBtn"
            );


        const previewBtnBottom =
            document.getElementById(
                "previewBtnBottom"
            );


        const closePreviewBtn =
            document.getElementById(
                "closePreviewBtn"
            );


        const printBtn =
            document.getElementById(
                "printBtn"
            );


        const printPreviewBtn =
            document.getElementById(
                "printPreviewBtn"
            );


        const previewModal =
            document.getElementById(
                "previewModal"
            );


        const sectionsContainer =
            document.getElementById(
                "sectionsContainer"
            );


        const saveDraftBtn =
            document.getElementById(
                "saveDraftBtn"
            );


        const loadDraftBtn =
            document.getElementById(
                "loadDraftBtn"
            );


        const clearDraftBtn =
            document.getElementById(
                "clearDraftBtn"
            );


        /* =========================
           ADD SECTION
        ========================== */

        addSectionBtn.addEventListener(
            "click",
            () => {

                const type =
                    questionTypeSelect.value;


                if (!type) {

                    alert(
                        "Please select a question type."
                    );

                    return;

                }


                const emptyState =
                    sectionsContainer.querySelector(
                        ".empty-state"
                    );


                if (emptyState) {

                    emptyState.remove();

                }


                createSection(
                    type
                );


                questionTypeSelect.value =
                    "";

            }
        );



        /* =========================
           OPEN PREVIEW
        ========================== */

        function openPreview() {

            generatePreview();


            previewModal.classList.add(
                "active"
            );

        }


        previewBtn.addEventListener(
            "click",
            openPreview
        );


        previewBtnBottom.addEventListener(
            "click",
            openPreview
        );



        /* =========================
           CLOSE PREVIEW
        ========================== */

        closePreviewBtn.addEventListener(
            "click",
            () => {

                previewModal.classList.remove(
                    "active"
                );

            }
        );



        /* =========================
           SAVE
        ========================== */

        saveDraftBtn.addEventListener(
            "click",
            () => {

                saveQuestionPaper();

                alert(
                    "Draft saved successfully."
                );

            }
        );



        /* =========================
           LOAD
        ========================== */

        loadDraftBtn.addEventListener(
            "click",
            () => {

                loadQuestionPaper();

            }
        );



        /* =========================
           CLEAR
        ========================== */

        clearDraftBtn.addEventListener(
            "click",
            () => {

                clearSavedQuestionPaper();

            }
        );



        /* =========================
           PRINT
        ========================== */

        function printQuestionPaper() {

            generatePreview();


            previewModal.classList.add(
                "active"
            );


            setTimeout(
                () => {

                    window.print();

                },
                500
            );

        }


        printBtn.addEventListener(
            "click",
            printQuestionPaper
        );


        printPreviewBtn.addEventListener(
            "click",
            () => {

                window.print();

            }
        );



        /* =========================
           AFTER PRINT / CANCEL

           IMPORTANT:
           NO PAGE RELOAD
        ========================== */

        window.addEventListener(
            "afterprint",
            () => {

                updateSaveStatus(
                    "Ready"
                );

            }
        );



        /* =========================
           ESC
        ========================== */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    previewModal.classList.remove(
                        "active"
                    );

                }

            }
        );

    }
);