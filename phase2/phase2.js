function checkIfElseSyntax() {
    var code = document.getElementById("chatbox").value;
    var lines = code.split('\n');
    var output = document.getElementById("chatlog1");
    output.innerHTML = ""; // Clear previous content
    var switchStack= [];
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
            var tokenList = line.match(/('[^'\n]*')|#.+\n|\b(int|float|string|double|bool|char|for|while|if|do|return|break|continue|end|==|!=|<=|>=|<|>)\b|\b\d+(\.\d+)?\b|[a-zA-Z]+|\S|&&|;/g);
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
            // check between bracket
            if(!isVariable(tokenList[2] || !(/^(\d+(\.\d+)?)$/.test(tokenList[2])))){
                table += "<tr><td>Missing Variable </td><td>Missing 'number' or 'variable' before operatin in if statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;  
            }
            var index=-1;var flag=-1;
            if(isVariable(tokenList[2] || (/^(\d+(\.\d+)?)$/.test(tokenList[2])))){
                    
                if ((tokenList[3]=='!'&&tokenList[4]=='=')) {
                    index=4;
                    flag=1;
                }
                else if((tokenList[3]=='='&&tokenList[4]=='=')){
                    index=4;
                    flag=1
                }
                else if(tokenList[3]=='>'||tokenList[3]=='<'){
                   flag=1;
                }
                if(flag!=1){
                    table += "<tr><td>Missing Operation</td><td>1-Missing '==', '!=', '<', '>', '<=', '>=' in if statement</td></tr>"+tokenList[4];
                    output.innerHTML = table + "</table>";
                    return;
                }
                else if(tokenList[4]=='='){
                    index=4;
                }
                if(index==4){
                    if(!isVariable(tokenList[5] || !(/^(\d+(\.\d+)?)$/.test(tokenList[5])))){
                        table += "<tr><td>Missing Variable </td><td>Missing 'number' or 'variable' after operation in if statement</td></tr>";
                        output.innerHTML = table + "</table>";
                        return;
                        
                    }
                }
                else{
                    if(!isVariable(tokenList[4] || !(/^(\d+(\.\d+)?)$/.test(tokenList[4])))){
                        table += "<tr><td>Missing Variable </td><td>Missing 'number' or 'variable' after operation in if statement</td></tr>";
                        output.innerHTML = table + "</table>";
                        return;
                        
                    }
                }
                
            }
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
                // Check for switch statement
        else if (line.startsWith('switch')) {
            if (!line.includes('(')) {
                table += "<tr><td>Missing Parenthesis</td><td>Missing '(' in switch statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            if (!line.includes(')')) {
                table += "<tr><td>Missing Parenthesis</td><td>Missing ')' in switch statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            if (line.indexOf(')') < line.indexOf('(')) {
                table += "<tr><td>Incorrect Parenthesis Order</td><td>')' appears before '(' in switch statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            if (!line.includes('{')) {
                table += "<tr><td>Missing Brace</td><td>Missing '{' in switch statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            var tokenList = line.match(/('[^'\n]*')|#.+\n|\b(int|float|string|double|bool|char|for|while|if|do|return|break|continue|end|==|!=|<=|>=|<|>)\b|\b\d+(\.\d+)?\b|[a-zA-Z]+|\S|&&|;/g);
            if(!isVariable(tokenList[2] || !(/^(\d+(\.\d+)?)$/.test(tokenList[2])))){
                table += "<tr><td>Missing Variable </td><td>Missing 'number' or 'variable' in switch</td></tr>";
                output.innerHTML = table + "</table>";
                return;  
            }
            switchStack.push('switch');
            currentBlock = 'switch';
            caseFlag = false;
            defaultFlag = false;
        }
        // Check for case statement
        else if (line.startsWith('case')) {
            if (switchStack.length === 0) {
                table += "<tr><td>Unexpected Case</td><td>Case statement outside switch block</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            if (!line.includes(':')) {
                table += "<tr><td>Missing Colon</td><td>Missing ':' in case statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            caseFlag = true;
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
            else if (currentBlock === 'switch') {
                switchStack.pop();
            }
            currentBlock = null;
        }
    }

    // Check if all blocks are closed
    if (ifStack.length > 0 || elseStack.length > 0 || switchStack.length > 0||currentBlock) {
        table += "<tr><td>Unclosed Blocks</td><td>Unclosed blocks</td></tr>";
        output.innerHTML = table + "</table>";
        return;
    }
    
    // No errors
    table += "<tr><td>NO ERROR</td></tr>";
    output.innerHTML = table + "</table>";
}

function isVariable(token) {
    // List of keywords and symbols
    var keywords = ["int", "float", "string", "double", "bool", "char", "for", "while", "if", "do", "return", "break", "continue", "end"];
    var symbols = ["+", "-", "*", "/", "%", "(", ")", "{", "}", "[", "]", ",", ";", "<", ">", "=", "!", "&&", "||"];

    // Check if token is not in the list of keywords and symbols
    return !keywords.includes(token) && !symbols.includes(token);
}