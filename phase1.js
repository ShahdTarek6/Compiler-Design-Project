function speak(text) {
    var synth = window.speechSynthesis;
    var utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
}
function scan() {
    var inputCode = document.getElementById("chatbox").value;
    
    var tokenList = inputCode.match(/('[^'\n]*')|#.+\n|\b(int|float|string|double|bool|char|for|while|if|do|return|break|continue|end)\b|\b\d+(\.\d+)?\b|[a-zA-Z]+|\S|&&|;/g);
    var output = document.getElementById("chatlog1");
    output.innerHTML = "";

    if (!tokenList) {
        output.innerHTML = "<b>Chatbot:</b> Please write your expression :)";
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

    // Organize tokens into categories and add to table
    for (var index = 0; index < tokenList.length; index++) {
        var token = tokenList[index];
        if (token === '&' && tokenList[index + 1] === '&') {
            categories["<b>Symbols:</b>"].push(token);
            table += "<tr><td>symbol</td><td>AND &&</td></tr>";
            index++; // Increment index to skip the next token
        }  else if (/^(\d+(\.\d+)?)$/.test(token)) {
            categories["<b>Numbers:</b>"].push(token);
            table += "<tr><td>number</td><td>" + token + "</td></tr>";
        } else if (/^(int|float|string|double|bool|char)$/.test(token)) {
            categories["<b>Identifiers:</b>"].push(token);
            table += "<tr><td>Identifier</td><td>" + token + "</td></tr>";
        } else if (/^(for|while|if|do|return|break|continue|end)$/.test(token)) {
            categories["<b>Reserved Keywords:</b>"].push(token);
            table += "<tr><td>reserved</td><td>" + token + "</td></tr>";
        }else if (/^[a-zA-Z]+$/.test(token)) {
            categories["<b>Variables:</b>"].push(token);
            table += "<tr><td>variable</td><td>" + token + "</td></tr>";
        } else if (token === '|' && tokenList[index + 1] === '|') {
            categories["<b>Symbols:</b>"].push(token);
            table += "<tr><td>symbol</td><td>OR ||</td></tr>";
            index++; // Increment index to skip the next token
        } else if (/^[\+\-\*\/\%\(\)\{\}\[\],\;\&\|<>=!]$/.test(token)) {
            // Handle symbols individually with a creative approach
            switch(token) {
                case '+':
                    table += "<tr><td>symbol</td><td>plus +</td></tr>";
                    break;
                case '-':
                    table += "<tr><td>symbol</td><td>minus -</td></tr>";
                    break;
                case '*':
                    table += "<tr><td>symbol</td><td>multiply *</td></tr>";
                    break;
                case '/':
                    table += "<tr><td>symbol</td><td>divide /</td></tr>";
                    break;
                case '%':
                    table += "<tr><td>symbol</td><td>modulus %</td></tr>";
                    break;
                case '(':
                    table += "<tr><td>symbol</td><td>open parenthesis (</td></tr>";
                    break;
                case ')':
                    table += "<tr><td>symbol</td><td>close parenthesis )</td></tr>";
                    break;
                case '{':
                    table += "<tr><td>symbol</td><td>open brace {</td></tr>";
                    break;
                case '}':
                    table += "<tr><td>symbol</td><td>close brace }</td></tr>";
                    break;
                case '[':
                    table += "<tr><td>symbol</td><td>open square bracket [</td></tr>";
                    break;
                case ']':
                    table += "<tr><td>symbol</td><td>close square bracket ]</td></tr>";
                    break;
                case ',':
                    table += "<tr><td>symbol</td><td>comma ,</td></tr>";
                    break;
                case ';':
                    table += "<tr><td>symbol</td><td>semicolon ;</td></tr>";
                    break;
                case '<':
                    table += "<tr><td>symbol</td><td>less than <</td></tr>";
                    break;
                case '>':
                    table += "<tr><td>symbol</td><td>greater than ></td></tr>";
                    break;
                case '=':
                    table += "<tr><td>symbol</td><td>equal =</td></tr>";
                    break;
                case '!':
                    table += "<tr><td>symbol</td><td>NOT !</td></tr>";
                    break;
                default:
                    table += "<tr><td>unknown</td><td>" + token + "</td></tr>";
                    break;
            }
        } else {
            categories["<b>Unknown:</b>"].push(token);
            table += "<tr><td>unknown</td><td>" + token + "</td></tr>";
        }
    }

    table += "</table>";

    // Display the table
    output.innerHTML += "<b>Chatbot:</b> The results are" + table;
    speak("The results are.");
}
