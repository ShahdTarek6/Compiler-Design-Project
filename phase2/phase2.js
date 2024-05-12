function speak(text) {
    var synth = window.speechSynthesis;
    var utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
}
function isVariable(token) {
    // List of keywords and symbols
    var keywords = ["int", "float", "string", "double", "bool", "char", "for", "while", "if", "do", "return", "break", "continue", "end"];
    var symbols = ["+", "-", "*", "/", "%", "(", ")", "{", "}", "[", "]", ",", ";", "<", ">", "=", "!", "&&", "||"];

    // Check if token is not in the list of keywords and symbols
    return !keywords.includes(token) && !symbols.includes(token);
}
function handleKeyPress(event) {
    if (event.keyCode === 13) {
        event.preventDefault(); // Prevent default Enter behavior (submitting the form)
        var textarea = event.target;
        var cursorPosition = textarea.selectionStart;
        var value = textarea.value;
        textarea.value = value.substring(0, cursorPosition) + "\n" + value.substring(cursorPosition);
        textarea.setSelectionRange(cursorPosition + 1, cursorPosition + 1); // Move cursor to the new line
    }
}

function checkIfElseSyntax() {
    var code = document.getElementById("chatbox").value;
    var lines = code.split('\n');
    var output = document.getElementById("chatlog1");
    output.innerHTML = ""; // Clear previous content

    var ifStack = [];
    var elseStack = [];
    var currentBlock = null;

    var table = "<table border='1'><tr><th>Error Type</th><th>Error Message</th></tr>";

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        
        // Skip empty lines
        if (line === '') continue;

        // Check for if statement
        if (line.startsWith('if')) {
            // Push current block to stack if not null
            if (currentBlock) {
                ifStack.push(currentBlock);
                currentBlock = null;
            }
            // Check if if statement is followed by '('
            if (!line.includes('(')) {
                table += "<tr><td>Missing Parenthesis</td><td>Missing '(' in if statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            // Check if if statement is followed by ')'
            if (!line.includes(')')) {
                table += "<tr><td>Missing Parenthesis</td><td>Missing ')' in if statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            // Check if if statement is followed by '{'
            if (!line.includes('{')) {
                table += "<tr><td>Missing Brace</td><td>Missing '{' in if statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            currentBlock = 'if';
        }
        // Check for else statement
        else if (line.startsWith('else')) {
            // Check if else statement is followed by '{'
            if (!line.includes('{')) {
                table += "<tr><td>Missing Brace</td><td>Missing '{' in else statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            currentBlock = 'else';
        }
        // Check for '}' to close blocks
        else if (line === '}') {
            // Check if there's a current block to close
            if (!currentBlock) {
                table += "<tr><td>Unexpected Brace</td><td>Unexpected '}'</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            // Check if current block matches with 'if' or 'else'
            if (currentBlock === 'if') {
                ifStack.pop();
            } else if (currentBlock === 'else') {
                elseStack.pop();
            }
            currentBlock = null;
        }
    }

    // Check if all blocks are closed
    if (ifStack.length > 0 || elseStack.length > 0 || currentBlock) {
        table += "<tr><td>Unclosed Blocks</td><td>Unclosed blocks</td></tr>";
        output.innerHTML = table + "</table>";
        return;
    }
    // No errors
    table += "<tr><td colspan='2'>No Errors</td></tr>";
    output.innerHTML = table + "</table>";
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
        }else if (isVariable(token)) {
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
