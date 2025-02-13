document.addEventListener("DOMContentLoaded", function () {
    const submitBtn = document.getElementById("button1");
    const subjectInput = document.getElementById("subject");
    const questionInput = document.getElementById("textarea");
    const questionList = document.getElementById("question-list");
    const questionTitle = document.getElementById("Question-title");
    const questionDescription = document.getElementById("Question-description");
    const discussionBox = document.getElementById("discussion");
    const welcome = document.getElementById("welcom");
    const nameInput = document.getElementById("name");
    const responseCommentInput = document.getElementById("comment");
    const responseBtn = document.getElementById("submitResponse");
    const mainResponses = document.getElementById("responses");
    const resolveBtn = document.getElementById("resolve-btn");
    const searchInput =document.getElementById("search");

    let currentQuestion = null;

    
    function loadQuestions() {
        const storedQuestions = JSON.parse(localStorage.getItem("questions")) || [];
        questionList.innerHTML = "";
        storedQuestions.forEach(({ subject, question }) => addQuestionToList(subject, question));
    }

    
    function saveQuestions() {
        const questions = [];
        document.querySelectorAll(".question-box").forEach((box) => {
            questions.push({
                subject: box.querySelector("h3").textContent,
                question: box.querySelector("p").textContent
            });
        });
        localStorage.setItem("questions", JSON.stringify(questions));
    }

    
    function addQuestionToList(subject, question) {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question-box");

        const subjectHeading = document.createElement("h3");
        subjectHeading.textContent = subject;

        const questionParagraph = document.createElement("p");
        questionParagraph.textContent = question;

        questionDiv.append(subjectHeading, questionParagraph);

        questionDiv.addEventListener("click", function () {
            questionTitle.textContent = subject;
            questionDescription.textContent = question;
            discussionBox.classList.remove("hidden");
            welcome.classList.add("Yourswlcm");
            currentQuestion = subject;
            loadResponses(subject);
        });

        questionList.append(questionDiv);
    }

    submitBtn.addEventListener("click", function () {
        const subject = subjectInput.value.trim();
        const question = questionInput.value.trim();

        if (subject === "" || question === "") {
            alert("Enter both Subject and Question.");
            return;
        }

        addQuestionToList(subject, question);
        saveQuestions();

        subjectInput.value = "";
        questionInput.value = "";
    });

    
    function loadResponses(subject) {
        mainResponses.innerHTML = "";
        const storedResponses = JSON.parse(localStorage.getItem("responses")) || {};
        const responsesForQuestion = storedResponses[subject] || [];
        
        responsesForQuestion.forEach(({ name, response }) => addResponseToList(name, response));
    }

    function saveResponses(subject) {
        let storedResponses = JSON.parse(localStorage.getItem("responses")) || {};
        let responsesForQuestion = [];

        document.querySelectorAll(".response-box").forEach((box) => {
            responsesForQuestion.push({
                name: box.querySelector("h4").textContent,
                response: box.querySelector("p").textContent
            });
        });

        storedResponses[subject] = responsesForQuestion;
        localStorage.setItem("responses", JSON.stringify(storedResponses));
    }

    function addResponseToList(name, response) {
        const responsesDiv = document.createElement("div");
        responsesDiv.classList.add("response-box");

        const ResponseName = document.createElement("h4");
        ResponseName.classList.add("Bottom");
        ResponseName.textContent = name;

        const responsePara = document.createElement("p");
        responsePara.textContent = response;

        responsesDiv.append(ResponseName, responsePara);
        mainResponses.append(responsesDiv);
    }

    responseBtn.addEventListener("click", function () {
        if (!currentQuestion) {
            alert("Select a question first.");
            return;
        }

        const nam = nameInput.value.trim();
        const responseComment = responseCommentInput.value.trim();

        if (nam === "" || responseComment === "") {
            alert("Enter your name and comment both");
            return;
        }

        addResponseToList(nam, responseComment);
        saveResponses(currentQuestion);

        nameInput.value = "";
        responseCommentInput.value = "";
    });

    
    resolveBtn.addEventListener("click", function () {
        if (!currentQuestion) return;

        
        let questions = JSON.parse(localStorage.getItem("questions")) || [];
        questions = questions.filter(q => q.subject !== currentQuestion);
        localStorage.setItem("questions", JSON.stringify(questions));

        
        let responses = JSON.parse(localStorage.getItem("responses")) || {};
        delete responses[currentQuestion];
        localStorage.setItem("responses", JSON.stringify(responses));

        
        const questionDivs = document.querySelectorAll(".question-box");
        questionDivs.forEach(div => {
            if (div.querySelector("h3").textContent === currentQuestion) {
                div.remove();
            }
        });

        
        questionTitle.textContent = "";
        questionDescription.textContent = "";
        mainResponses.innerHTML = "";
        discussionBox.classList.add("hidden");
        welcome.classList.remove("Yourswlcm");

        currentQuestion = null;
    });
    loadQuestions();
    searchInput.addEventListener("input", function () {
        const query = this.value.trim().toLowerCase();
        const questions = Array.from(document.querySelectorAll(".question-box"));
        const questionList = document.getElementById("question-list");

        if(query == ""){
            questionList.innerHTML="";
            questions.forEach(q => questionList.append(q));
            loadQuestions();
            return;
        }
    
        
        const matchingQuestions = questions
            .filter(q => q.querySelector("h3").textContent.toLowerCase().includes(query) || 
                         q.querySelector("p").textContent.toLowerCase().includes(query))
            .sort((a, b) => a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent));
    
        
        questionList.innerHTML = matchingQuestions.length ? "" : `<div id="no-match" style="color:black;text-align:center;margin-top:10px;">No Match Found</div>`;
        matchingQuestions.forEach(q => questionList.appendChild(q));
    });
    
    
});
