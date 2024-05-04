function scan() {
    var inputCode = document.getElementById("input").value;
    var tokenList = inputCode.match(/('[^'\n]*')|#.+\n|\S+|\s+/g);

    var output = document.getElementById("output");
    output.innerHTML = "";

    if (!tokenList) {
        output.innerHTML = "No tokens found!";
        return;
    }

    tokenList.forEach(function(token) {
        if (/^(\d+(\.\d+)?)$/.test(token)) {
            output.innerHTML += `(number, '${token}')<br>`;
        } else if (/^(<=|<|>|=|>=|!=|==|!|\*|%|\+|-)$/.test(token)) {
            output.innerHTML += `(operator, '${token}')<br>`;
        } else if (/^(def|if|return|elif|else|for|in)$/.test(token)) {
            output.innerHTML += `(reserved, '${token}')<br>`;
        } else if (/^[\[\]():,{}]+$/.test(token)) {
            output.innerHTML += `(symbol, '${token}')<br>`;
        } else if (/^'[^'\n]*'$|^"[^"\n]*"$/.test(token)) {
            output.innerHTML += `(string, ${token})<br>`;
        } else {
            output.innerHTML += `(identifier, '${token}')<br>`;
        }
    });
}
