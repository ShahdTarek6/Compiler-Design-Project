function checkIfElseSyntax() {
    var code = document.getElementById("chatbox").value;
    var lines = code.split('\n');
    var output = document.getElementById("chatlog1");
    output.innerHTML = ""; // Clear previous content
    var switchStack= [];
    var whileStack = [];
    var ifStack = [];
    var elseStack = [];
    var doStack = [];
    var forStack = [];
    var currentBlock = null;
    var caseFlag = false;
    var defaultFlag = false;
    var table = "<table border='1'><tr><th>Error Type</th><th>Error Message</th></tr>";
    var flagdoo=0;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        
        // Skip empty lines
        if (line === '') continue;
        var flagcase=-1;
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
            var tokenList = line.match(/('[^'\n]*')|#.+\n|\b(int|float|string|double|bool|char|for|while|if|case|switch|do|return|break|continue|end|==|!=|<=|>=|<|>)\b|\b\d+(\.\d+)?\b|[a-zA-Z]+|\S|&&|;/g);
            if (switchStack.length === 0) {
                table += "<tr><td>Unexpected Case</td><td>Case statement outside switch block</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            
            if((/^(\d+(\.\d+)?)$/.test(tokenList[1]))){
               flagcase=1;  
            }
            else if(isVariable(tokenList[1])){
                flagcase=1;
            }
            if(flagcase!=1){
                table += "<tr><td>Missing Variable </td><td>Missing 'number' or 'variable' After case </td></tr>";
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
        // Check for default statement
        else if (line.startsWith('default')) {
            if (switchStack.length === 0) {
                table += "<tr><td>Unexpected Default</td><td>Default statement outside switch block</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            if (!line.includes(':')) {
                table += "<tr><td>Missing Colon</td><td>Missing ':' in default statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            if (defaultFlag) {
                table += "<tr><td>Multiple Defaults</td><td>Multiple default statements in switch block</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            defaultFlag = true;
        }
        else if (line.startsWith('while')&& flagdoo===0) {
            var tokenList = line.match(/('[^'\n]*')|#.+\n|\b(int|float|string|double|bool|char|for|while|if|do|return|break|continue|end|==|!=|<=|>=|<|>)\b|\b\d+(\.\d+)?\b|[a-zA-Z]+|\S|&&|;/g);
            // Push current block to stack if not null
            if (currentBlock) {
                whileStack.push(currentBlock);
                currentBlock = null;
            }
            // Check if if statement is followed by '('
            if (!line.includes('(')) {
                table += "<tr><td>Missing Parenthesis</td><td>Missing '(' in while statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            // check between bracket
            if(!isVariable(tokenList[2] || !(/^(\d+(\.\d+)?)$/.test(tokenList[2])))){
                table += "<tr><td>Missing Variable </td><td>Missing 'number' or 'variable' before operatin in while statement</td></tr>";
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
                    table += "<tr><td>Missing Operation</td><td>1-Missing '==', '!=', '<', '>', '<=', '>=' in while statement</td></tr>"+tokenList[4];
                    output.innerHTML = table + "</table>";
                    return;
                }
                else if(tokenList[4]=='='){
                    index=4;
                }
                if(index==4){
                    if(!isVariable(tokenList[5] || !(/^(\d+(\.\d+)?)$/.test(tokenList[5])))){
                        table += "<tr><td>Missing Variable </td><td>Missing 'number' or 'variable' after operation in while statement</td></tr>";
                        output.innerHTML = table + "</table>";
                        return;
                        
                    }
                }
                else{
                    if(!isVariable(tokenList[4] || !(/^(\d+(\.\d+)?)$/.test(tokenList[4])))){
                        table += "<tr><td>Missing Variable </td><td>Missing 'number' or 'variable' after operation in while statement</td></tr>";
                        output.innerHTML = table + "</table>";
                        return;
                        
                    }
                }
                
            }
            if (!line.includes(')')) {
                table += "<tr><td>Missing Parenthesis</td><td>Missing ')' in while statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }

            // Check if closed parenthesis appears before open parenthesis
            if (line.indexOf(')') < line.indexOf('(')) {
                table += "<tr><td>Incorrect Parenthesis Order</td><td>')' appears before '(' in while statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }

            // Check if if statement is followed by '{'
            if (!line.includes('{')) {
                table += "<tr><td>Missing Brace</td><td>Missing '{' in while statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            currentBlock = 'while';

        }
        else if (line.startsWith('while')) {
            if(flagdoo===0){
                table += "<tr><td>Missing</td><td>Missing while in do statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            else{
                var tokenList = line.match(/('[^'\n]*')|#.+\n|\b(int|float|string|double|bool|char|for|while|if|do|return|break|continue|end|==|!=|<=|>=|<|>)\b|\b\d+(\.\d+)?\b|[a-zA-Z]+|\S|&&|;/g);
            
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

            
            }
        }
        // Check for do statement
        else if (line.startsWith('do')) {
            flagdoo=1;
            // Check if do statement is followed by '{'
            if (!line.includes('{')) {
                table += "<tr><td>Missing Brace</td><td>Missing '{' in do statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            doStack.push('do');
            currentBlock = 'do';
            
        }
        // Check for for 
         // Check for for statement
        else if(line.startsWith('for')){
            if (!line.includes('(')) {
                table += "<tr><td>Missing Parenthesis</td><td>Missing '(' in for statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            if (!line.includes(')')) {
                table += "<tr><td>Missing Parenthesis</td><td>Missing ')' in for statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            if (line.indexOf(')') < line.indexOf('(')) {
                table += "<tr><td>Incorrect Parenthesis Order</td><td>')' appears before '(' in for statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            var tokenList = line.match(/('[^'\n]*')|#.+\n|\b(int|float|string|double|bool|char|for|while|if|do|return|break|continue|end|==|!=|<=|>=|<|>|&&|\+|-)\b|\b\d+(\.\d+)?\b|[a-zA-Z]+|\S|;/g);
            // for (initialization; condition; increment/decrement)
            if(tokenList[2]!='int'){
                table += "<tr><td>Missing Initialization</td><td>Missing initialization part in for statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            if(tokenList[2]=='int'){
                if(!isVariable(tokenList[3]) ){
                    table += "<tr><td>Missing Variable </td><td>Missing Variable after initialization part in for statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
                }
            }
            if(tokenList[2]=='int'){
                if(isVariable(tokenList[3]) ){
                    if(tokenList[4]!='='){
                        table += "<tr><td>Missing Operation</td><td>Missing = part in for statement</td></tr>";
                        output.innerHTML = table + "</table>";
                        return;
                    }
                }
            }
            if(tokenList[2]=='int'){
                if(isVariable(tokenList[3]) ){
                    if(tokenList[4]=='='){
                        if(!(/^(\d+(\.\d+)?)$/.test(tokenList[5]))){
                            table += "<tr><td>Missing number</td><td>Missing number after = part in for statement</td></tr>";
                            output.innerHTML = table + "</table>";
                            return;
                        }
                    }
                }
            }
            if(tokenList[2]=='int'){
                if(isVariable(tokenList[3]) ){
                    if(tokenList[4]=='='){
                        if((/^(\d+(\.\d+)?)$/.test(tokenList[5]))){
                            if(tokenList[6]!=';'){
                                table += "<tr><td>Missing ;</td><td>Missing ; before condition part in for statement</td></tr>";
                                output.innerHTML = table + "</table>";
                                return;
                            }
                        }
                    }
                }
            }
            if(tokenList[2]=='int'){
                if(isVariable(tokenList[3]) ){
                    if(tokenList[4]=='='){
                        if((/^(\d+(\.\d+)?)$/.test(tokenList[5]))){
                            if(tokenList[6]==';'){
                               // check between bracket
                                if(!isVariable(tokenList[7] || !(/^(\d+(\.\d+)?)$/.test(tokenList[7])))){
                                    table += "<tr><td>Missing Variable </td><td>Missing 'number' or 'variable' before operatin in if statement</td></tr>";
                                    output.innerHTML = table + "</table>";
                                    return;  
                                }
                                var index=-1;var flag=-1;
                                if(isVariable(tokenList[7] || (/^(\d+(\.\d+)?)$/.test(tokenList[7])))){
                                        
                                    if ((tokenList[8]=='!'&&tokenList[9]=='=')) {
                                        index=4;
                                        flag=1;
                                    }
                                    else if((tokenList[8]=='='&&tokenList[9]=='=')){
                                        index=4;
                                        flag=1
                                    }
                                    else if(tokenList[8]=='>'||tokenList[9]=='<'){
                                    flag=1;
                                    }
                                    if(flag!=1){
                                        table += "<tr><td>Missing Operation</td><td>1-Missing '==', '!=', '<', '>', '<=', '>=' in if statement</td></tr>"+tokenList[4];
                                        output.innerHTML = table + "</table>";
                                        return;
                                    }
                                    else if(tokenList[9]=='='){
                                        index=4;
                                    }
                                    if(index==4){
                                        if(!isVariable(tokenList[10] || !(/^(\d+(\.\d+)?)$/.test(tokenList[10])))){
                                            table += "<tr><td>Missing Variable </td><td>Missing 'number' or 'variable' after operation in if statement</td></tr>";
                                            output.innerHTML = table + "</table>";
                                            return;
                                            
                                        }
                                    }
                                    else{
                                        if(!isVariable(tokenList[9] || !(/^(\d+(\.\d+)?)$/.test(tokenList[9])))){
                                            table += "<tr><td>Missing Variable </td><td>Missing 'number' or 'variable' after operation in if statement</td></tr>";
                                            output.innerHTML = table + "</table>";
                                            return;
                                            
                                        }
                                    }
                
                                }
                            }
                        }
                    }
                }
            }
            if(tokenList[2]=='int'){
                if(isVariable(tokenList[3]) ){
                    if(tokenList[4]=='='){
                        if((/^(\d+(\.\d+)?)$/.test(tokenList[5]))){
                            if(tokenList[6]==';'){
                                if(isVariable(tokenList[7] || (/^(\d+(\.\d+)?)$/.test(tokenList[7])))){
                                        
                                    if ((tokenList[8]=='!'&&tokenList[9]=='=')) {
                                        index=4;
                                        flag=1;
                                    }
                                    else if((tokenList[8]=='='&&tokenList[9]=='=')){
                                        index=4;
                                        flag=1
                                    }
                                    else if(tokenList[8]=='>'||tokenList[9]=='<'){
                                    flag=1;
                                    }
                                    if(flag!=1){
                                        table += "<tr><td>Missing Operation</td><td>1-Missing '==', '!=', '<', '>', '<=', '>=' in if statement</td></tr>"+tokenList[4];
                                        output.innerHTML = table + "</table>";
                                        return;
                                    }
                                    else if(tokenList[9]=='='){
                                        index=4;
                                    }
                                    if(index==4){
                                        if(isVariable(tokenList[10] || (/^(\d+(\.\d+)?)$/.test(tokenList[10])))){
                                            if(tokenList[11]!=';'){
                                                table += "<tr><td>Missing ; </td><td>Missing ;</td></tr>";
                                                output.innerHTML = table + "</table>";
                                                return;
                                            }
                                            
                                        }
                                    }
                                    else{
                                        if(!isVariable(tokenList[9] || !(/^(\d+(\.\d+)?)$/.test(tokenList[9])))){
                                            if(tokenList[10]!=';'){
                                                table += "<tr><td>Missing ; </td><td>Missing ;</td></tr>";
                                                output.innerHTML = table + "</table>";
                                                return;
                                            }
                                            
                                        }
                                    }
                
                                }
                            }
                        }
                    }
                }
            }
            if(tokenList[2]=='int'){
                if(isVariable(tokenList[3]) ){
                    if(tokenList[4]=='='){
                        if((/^(\d+(\.\d+)?)$/.test(tokenList[5]))){
                            if(tokenList[6]==';'){
                                if(isVariable(tokenList[7] || (/^(\d+(\.\d+)?)$/.test(tokenList[7])))){
                                        
                                    if ((tokenList[8]=='!'&&tokenList[9]=='=')) {
                                        index=4;
                                        flag=1;
                                    }
                                    else if((tokenList[8]=='='&&tokenList[9]=='=')){
                                        index=4;
                                        flag=1
                                    }
                                    else if(tokenList[8]=='>'||tokenList[9]=='<'){
                                    flag=1;
                                    }
                                    if(flag!=1){
                                        table += "<tr><td>Missing Operation</td><td>1-Missing '==', '!=', '<', '>', '<=', '>=' in if statement</td></tr>"+tokenList[4];
                                        output.innerHTML = table + "</table>";
                                        return;
                                    }
                                    else if(tokenList[9]=='='){
                                        index=4;
                                    }
                                    if(index==4){
                                        if(isVariable(tokenList[10] || (/^(\d+(\.\d+)?)$/.test(tokenList[10])))){
                                            if(tokenList[11]==';'){
                                                
                                                if(tokenList[12]!=tokenList[3]||tokenList[13]!='+'||tokenList[14]!='+'){
                                                    table += "<tr><td>Missing Increment</td><td>Missing increment part in for statement</td></tr>";
                                                    output.innerHTML = table + "</table>";
                                                    return;

                                                }
                                            }
                                            
                                        }
                                    }
                                    else{
                                        if(!isVariable(tokenList[9] || !(/^(\d+(\.\d+)?)$/.test(tokenList[9])))){
                                            if(tokenList[10]==';'){
                                                if(tokenList[11]!=tokenList[3]||tokenList[12]!='-'||tokenList[13]!='-'){
                                                    table += "<tr><td>Missing Increment</td><td>Missing increment part in for statement</td></tr>";
                                                    output.innerHTML = table + "</table>";
                                                    return;

                                                }
                                            }
                                            
                                        }
                                    }
                
                                }
                            }
                        }
                    }
                }
            }
            if (!line.includes('{')) {
                table += "<tr><td>Missing Brace</td><td>Missing '{' in for statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            forStack.push('for');
            currentBlock = 'for';
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
            else if (currentBlock === 'do') {
                doStack.pop();
            }
            else if(currentBlock === 'while'){
                whileStack.pop();
            }
            else if(currentBlock === 'for'){
                forStack.pop();
            }
            currentBlock = null;
        }
    }

    // Check if all blocks are closed
    if (ifStack.length > 0 || elseStack.length > 0 || switchStack.length > 0||doStack.length>0||whileStack.length>0||forStack.length>0||currentBlock) {
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
    var keywords = ["int", "float", "string", "double", "bool", "char", "for", "while", "if", "do", "return", "break", "continue", "end","case","switch"];
    var symbols = ["+", "-", "*", "/", "%", "(", ")", "{", "}", "[", "]", ",", ";", "<", ">", "=", "!", "&&", "||",":"];

    // Check if token is not in the list of keywords and symbols
    return !keywords.includes(token) && !symbols.includes(token);
}
