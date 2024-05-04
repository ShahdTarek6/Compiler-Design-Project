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
        } else if (/^[\+\-\/\%\*]$/.test(token)) {
            output.innerHTML += `(operator, '${token}')<br>`;
        } else if (/^[\(\{\[\)\}\]\,\;]$/.test(token)) {
            output.innerHTML += `(symbol, '${token}')<br>`;
        } else {
            output.innerHTML += `(unknown, '${token}')<br>`;
        }
    });
}
