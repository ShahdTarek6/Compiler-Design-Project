function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}

function scan() {
    var inputCode = document.getElementById("chatbox").value;
    var tokenList = inputCode.match(/('[^'\n]*')|#.+\n|\b(int|float|string|double|bool|char|for|while|if|do|return|break|continue|end)\b|\b\d+(\.\d+)?\b|[a-zA-Z]+|\S|;/g);
    var output = document.getElementById("chatlog1");
    output.innerHTML = "";

    if (!tokenList) {
        output.innerHTML = " <b>Chatbot:</b> Please write your expression :)";
        speak("Please write your expression.");
        return;
    }

    output.innerHTML += `<b>Chatbot:</b> `;
    tokenList.forEach(function(token, index) {
        if (/^(\d+(\.\d+)?)$/.test(token)) {
            output.innerHTML += `number = '${token}'<br>`;
            speak("number " + token);
        } else if (/^(int|float|string|double|bool|char)$/.test(token)) {
            output.innerHTML += `identifier = '${token}'<br>`;
            speak("identifier " + token);
        } else if (/^(for|while|if|do|return|break|continue|end)$/.test(token)) {
            output.innerHTML += `reserved = '${token}'<br>`;
            speak("reserved " + token);
        } else if (/^[a-zA-Z]+$/.test(token)) {
            output.innerHTML += `variable = '${token}'<br>`;
            speak("variable " + token);
        } else if (token === '||') {
            output.innerHTML += `symbol = 'OR ||'<br>`;
            speak(" symbol OR");
        } else if (token === '&&') {
            output.innerHTML += `symbol = 'AND &&'<br>`;
            speak(" symbol AND");
        } else if (/^[\+\-\*\/\%\(\)\{\}\[\],\;\&\|<>=!]$/.test(token)) {
            switch (token) {
                case '+':
                    output.innerHTML += `symbol = 'plus ➕'<br>`;
                    speak("symbol plus");
                    break;
                case '-':
                    output.innerHTML += `symbol = 'minus ➖'<br>`;
                    speak("symbol minus");
                    break;
                case '*':
                    output.innerHTML += `symbol, 'multiply ✖️'<br>`;
                    speak("symbol multiply");
                    break;
                case '/':
                    output.innerHTML += `symbol = 'divide ➗'<br>`;
                    speak("symbol divide");
                    break;
                case '%':
                    output.innerHTML += `symbol = 'modulo %'<br>`;
                    speak("symbol modulo");
                    break;
                case '(':
                    output.innerHTML += `symbol = 'open parenthesis ('<br>`;
                    speak("symbol open parenthesis");
                    break;
                case ')':
                    output.innerHTML += `symbol = 'close parenthesis )'<br>`;
                    speak("symbol close parenthesis");
                    break;
                case '{':
                    output.innerHTML += `symbol = 'open curly bracket {'<br>`;
                    speak("symbol open curly bracket");
                    break;
                case '}':
                    output.innerHTML += `symbol = 'close curly bracket }'<br>`;
                    speak("symbol close curly bracket");
                    break;
                case '[':
                    output.innerHTML += `symbol = 'open square bracket ['<br>`;
                    speak("symbol open square bracket");
                    break;
                case ']':
                    output.innerHTML += `symbol = 'close square bracket ]'<br>`;
                    speak("symbol close square bracket");
                    break;
                case ',':
                    output.innerHTML += `symbol = 'comma ,'<br>`;
                    speak("symbol comma");
                    break;
                case ';':
                    output.innerHTML += `symbol = 'semicolon ;'<br>`;
                    speak("symbol semicolon");
                    break;
                case '<':
                    output.innerHTML += `symbol = 'less than <'<br>`;
                    speak("symbol less than");
                    break;
                case '>':
                    output.innerHTML += `symbol = 'greater than >'<br>`;
                    speak("symbol greater than");
                    break;
                case '=':
                    output.innerHTML += `symbol = 'equal ='<br>`;
                    speak("symbol equal");
                    break;
                case '!':
                    output.innerHTML += `symbol = 'NOT !'<br>`;
                    speak("symbol NOT");
                    break;
                default:
                    output.innerHTML += `unknown = '${token}'<br>`;
                    speak("unknown " + token);
                    break;
            }
        } else {
            output.innerHTML += `unknown = '${token}'<br>`;
            speak("unknown " + token);
        }
    });
}
