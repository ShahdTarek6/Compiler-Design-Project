function speak(text) {
    var synth = window.speechSynthesis;
    var utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
}

function scan() {
    var inputCode = document.getElementById("chatbox").value;
    // Replace && with "AND" and || with "OR" without spaces
    inputCode = inputCode.replace(/&&/g, "AND").replace(/\|\|/g, "OR");
    var tokenList = inputCode.match(/('[^'\n]*')|#.+\n|\b(int|float|string|double|bool|char|for|while|if|do|return|break|continue|end)\b|\b\d+(\.\d+)?\b|[a-zA-Z]+|\S|;/g);
    var output = document.getElementById("chatlog1");
    output.innerHTML = "";

    if (!tokenList) {
        output.innerHTML = " <b>Chatbot:</b> Please write your expression :)";
        speak("Please write your expression.");
        return;
    }

    // Create a table
    var table = "<table border='1'>";
    var categories = {
        "<b>Numbers:</b>": [],
        "<b>Identifiers:</b>": [],
        "<b>Reserved Keywords:</b>": [],
        "<b>Variables:</b>": [],
        "<b>Symbols:</b>": [],
        "<b>Unknown:</b>": []
    };

    // Organize tokens into categories
    tokenList.forEach(function(token, index) {
        if (/^(\d+(\.\d+)?)$/.test(token)) {
            categories["<b>Numbers:</b>"].push(token);
        } else if (/^(int|float|string|double|bool|char)$/.test(token)) {
            categories["<b>Identifiers:</b>"].push(token);
        } else if (/^(for|while|if|do|return|break|continue|end)$/.test(token)) {
            categories["<b>Reserved Keywords:</b>"].push(token);
        } else if (/^[a-zA-Z]+$/.test(token)) {
            categories["<b>Variables:</b>"].push(token);
        } else if (/^[\+\-\*\/\%\(\)\{\}\[\],\;\&\|<>=!]$/.test(token)) {
            categories["<b>Symbols:</b>"].push(token);
        } else {
            categories["<b>Unknown:</b>"].push(token);
        }
    });

    // Populate the table with categories and their tokens
    for (const [category, tokens] of Object.entries(categories)) {
        if (tokens.length > 0) {
            table += "<tr><td>" + category + "</td><td>" + tokens.join(", ") + "</td></tr>";
        }
    }
    table += "</table>";

    // Display the table
    output.innerHTML = "<b>Chatbot:</b> The results are" + table;
    speak("The results are.");
}
