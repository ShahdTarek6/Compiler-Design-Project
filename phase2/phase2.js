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
            // Check if closed parenthesis appears before open parenthesis
            if (line.indexOf(')') < line.indexOf('(')) {
                table += "<tr><td>Incorrect Parenthesis Order</td><td>')' appears before '(' in if statement</td></tr>";
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
