function scan() {
    var inputCode = document.getElementById("input").value;
    // Updated regular expression to capture whole words, symbols, and individual characters
    var tokenList = inputCode.match(/('[^'\n]*')|#.+\n|\b(int|float|string|double|bool|char|for|while|if|do|return|break|continue|end)\b|\b\d+(\.\d+)?\b|\S|;/g);

    var output = document.getElementById("output");
    output.innerHTML = "";

    if (!tokenList) {
        output.innerHTML = "No tokens found!";
        return;
    }

    tokenList.forEach(function(token) {
        if (/^(\d+(\.\d+)?)$/.test(token)) {
            output.innerHTML += `(number, '${token}')<br>`;
        } else if (/^(int|float|string|double|bool|char)$/.test(token)) {
            output.innerHTML += `(identifier, '${token}')<br>`;
        } else if (/^(for|while|if|do|return|break|continue|end)$/.test(token)) {
            output.innerHTML += `(reserved, '${token}')<br>`;
        } else if (/^[a-zA-Z]+$/.test(token)) {
            output.innerHTML += `(variable, '${token}')<br>`;
        } else if (/^[\+\-\*\/\%\(\)\{\}\[\],\;\&\|<>=!]$/.test(token)) {
            // Handle symbols individually with a creative approach
            switch(token) {
                case '+':
                    output.innerHTML += `(symbol, 'plus ➕')<br>`;
                    break;
                case '-':
                    output.innerHTML += `(symbol, 'minus ➖')<br>`;
                    break;
                case '*':
                    output.innerHTML += `(symbol, 'multiply ✖️')<br>`;
                    break;
                case '/':
                    output.innerHTML += `(symbol, 'divide ➗')<br>`;
                    break;
                case '%':
                    output.innerHTML += `(symbol, 'modulo %')<br>`;
                    break;
                case '(':
                    output.innerHTML += `(symbol, 'open parenthesis (')<br>`;
                    break;
                case ')':
                    output.innerHTML += `(symbol, 'close parenthesis )')<br>`;
                    break;
                case '{':
                    output.innerHTML += `(symbol, 'open curly bracket {')<br>`;
                    break;
                case '}':
                    output.innerHTML += `(symbol, 'close curly bracket }')<br>`;
                    break;
                case '[':
                    output.innerHTML += `(symbol, 'open square bracket [')<br>`;
                    break;
                case ']':
                    output.innerHTML += `(symbol, 'close square bracket ]')<br>`;
                    break;
                case ',':
                    output.innerHTML += `(symbol, 'comma ,')<br>`;
                    break;
                case ';':
                    output.innerHTML += `(symbol, 'semicolon ;')<br>`;
                    break;
                case '&':
                    output.innerHTML += `(symbol, 'AND &&')<br>`;
                    break;
                case '|':
                    output.innerHTML += `(symbol, 'OR ||')<br>`;
                    break;
                case '<':
                    output.innerHTML += `(symbol, 'less than <')<br>`;
                    break;
                case '>':
                    output.innerHTML += `(symbol, 'greater than >')<br>`;
                    break;
                case '=':
                    output.innerHTML += `(symbol, 'equal =')<br>`;
                    break;
                case '!':
                    output.innerHTML += `(symbol, 'NOT !')<br>`;
                    break;
                default:
                    output.innerHTML += `(unknown, '${token}')<br>`;
                    break;
            }
        } else {
            output.innerHTML += `(unknown, '${token}')<br>`;
        }
    });
}
