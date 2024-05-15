function speak(text) {
    var synth = window.speechSynthesis;
    var utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
}
function checkForSyntax() {
    var code = document.getElementById("chatbox").value;
    var lines = code.split(/\r\n|\r|\n/); // Split on all types of line breaks
    var output = document.getElementById("chatlog1");
    output.innerHTML = ""; // Clear previous content


    var identifiers = ['int', 'float', 'string', 'double', 'bool', 'char'];
    var enteredWords = ['for','if','while','whiledo'];
    var switchStack= [];
    var whileStack = [];
    var ifStack = [];
    var elseStack = [];
    var doStack = [];
    var forStack = [];
    var currentBlock = null;
    var currentBlock1 = null;
    var currentBlock2 = null;
    var currentBlock3 = null;
    var currentBlock4 = null;
    var currentBlock5 = null;
    var caseFlag = false;
    var defaultFlag = false;
    var flagdoo=0;
    var table = "<table border='1'><tr><th>Error Type</th><th>Error Message</th></tr>";

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();

        // Skip empty lines
        if (line === '')  
        {
          speak("Please write your expression.");
          continue;
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (identifiers.some(prefix => line.startsWith(prefix))) {
            // Check if any letter appears after an identifier
            var match = line.match(/\b(int|float|string|double|bool|char)\s+([a-zA-Z]+)/);
            if (!match) {
                table += "<tr><td>Missing Letter</td><td>Missing letter after identifier</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            var word = match[2];
            if (enteredWords.includes(word)) {
                table += "<tr><td>Duplicate Entry</td><td>The word '" + word + "' has already been entered</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            enteredWords.push(word); // Push the word or letter after the identifier into the array
             // Check if for statement is followed by '='
             if (!line.includes('=')) {
                table += "<tr><td>Missing Equals Sign</td><td>Missing '=' in for statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            
            // Extract variable type and value from the assignment statement
            var assignment = line.split('=');
            var assignedValue = assignment[1].trim();
            assignedValue = assignedValue.replace(/;.*$/, ''); // Remove semicolon from the end of assignedValue
            
            // Match variable type without the semicolon
            var variableTypeMatch = assignment[0].match(/\b(int|float|string|double|bool|char)\b/);
            if (!variableTypeMatch) {
                table += "<tr><td>Invalid Syntax</td><td>Unable to determine variable type</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            var variableType = variableTypeMatch[0];
            
            // Validate the assigned value based on variable type
            if (!isValidAssignment(variableType, assignedValue)) {
                table += "<tr><td>Invalid Assignment</td><td>Invalid value assigned to '" + variableType + "' variable</td></tr>";
                output.innerHTML = table + "</table>";
                check = true;
                return;
            }
            
            // Check if for statement is followed by ';'
            if (!line.includes(';')) {
                table += "<tr><td>Missing Semicolon</td><td>Missing ';' in for statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }

            
        }else if (!enteredWords.some(enteredWord => !line.startsWith(enteredWord))) {
          table += "<tr><td>Word not intilized/Letter</td><td>Word/Letter not stored</td></tr>";
          output.innerHTML = table + "</table>";
          console.log(enteredWords);
          return;
            
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var flagcase=-1;
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Check if statement
        if (line.startsWith('if')) {
            var tokenList = line.match(/('[^'\n]*')|#.+\n|\b(int|float|string|double|bool|char|for|while|if|do|return|break|continue|end|==|!=|<=|>=|<|>)\b|\b\d+(\.\d+)?\b|[a-zA-Z]+|\S|&&|;/g);
            // Push current block to stack if not null
            if (currentBlock1) {
                ifStack.push(currentBlock1);
                currentBlock1 = null;
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
            currentBlock1 = 'if';

        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Check else statement
        else if (line.startsWith('else')) {
            // Check if else statement is followed by '{'
            if (!line.includes('{')) {
                table += "<tr><td>Missing Brace</td><td>Missing '{' in else statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            currentBlock4 = 'else';
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Check switch statement
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
            currentBlock5 = 'switch';
            caseFlag = false;
            defaultFlag = false;
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Check case statement
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
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Check default statement
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
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Check while statement
        else if (line.startsWith('while')&& flagdoo===0) {
            var tokenList = line.match(/('[^'\n]*')|#.+\n|\b(int|float|string|double|bool|char|for|while|if|do|return|break|continue|end|==|!=|<=|>=|<|>)\b|\b\d+(\.\d+)?\b|[a-zA-Z]+|\S|&&|;/g);
            // Push current block to stack if not null
            if (currentBlock2) {
                whileStack.push(currentBlock2);
                currentBlock2 = null;
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
            var index=-1;var flagwhile=-1;
            if(isVariable(tokenList[2] || (/^(\d+(\.\d+)?)$/.test(tokenList[2])))){
                    
                if ((tokenList[3]=='!'&&tokenList[4]=='=')) {
                    index=4;
                    flagwhile=1;
                }
                else if((tokenList[3]=='='&&tokenList[4]=='=')){
                    index=4;
                    flagwhile=1
                }
                else if(tokenList[3]=='>'||tokenList[3]=='<'){
                    flagwhile=1;
                }
                if(flagwhile!=1){
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
            currentBlock2 = 'while';

        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////check whiledo statments
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
            var index=-1;var flagwhiledo=-1;
            if(isVariable(tokenList[2] || (/^(\d+(\.\d+)?)$/.test(tokenList[2])))){
                    
                if ((tokenList[3]=='!'&&tokenList[4]=='=')) {
                    index=4;
                    flagwhiledo=1;
                }
                else if((tokenList[3]=='='&&tokenList[4]=='=')){
                    index=4;
                    flagwhiledo=1
                }
                else if(tokenList[3]=='>'||tokenList[3]=='<'){
                    flagwhiledo=1;
                }
                if(flagwhiledo!=1){
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
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Check do statement
        else if (line.startsWith('do')) {
            flagdoo=1;
            // Check if do statement is followed by '{'
            if (!line.includes('{')) {
                table += "<tr><td>Missing Brace</td><td>Missing '{' in do statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
            doStack.push('do');
            currentBlock3 = 'do';
            
        } 
         //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Check for statement
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
                                var index=-1;var flagfor=-1;
                                if(isVariable(tokenList[7] || (/^(\d+(\.\d+)?)$/.test(tokenList[7])))){
                                        
                                    if ((tokenList[8]=='!'&&tokenList[9]=='=')) {
                                        index=4;
                                        flagfor=1;
                                    }
                                    else if((tokenList[8]=='='&&tokenList[9]=='=')){
                                        index=4;
                                        flagfor=1
                                    }
                                    else if(tokenList[8]=='>'||tokenList[9]=='<'){
                                        flagfor=1;
                                    }
                                    if(flagfor!=1){
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
                                        flagfor=1;
                                    }
                                    else if((tokenList[8]=='='&&tokenList[9]=='=')){
                                        index=4;
                                        flagfor=1
                                    }
                                    else if(tokenList[8]=='>'||tokenList[9]=='<'){
                                    flflagforag=1;
                                    }
                                    if(flagfor!=1){
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
                                        flagfor=1;
                                    }
                                    else if((tokenList[8]=='='&&tokenList[9]=='=')){
                                        index=4;
                                        flagfor=1
                                    }
                                    else if(tokenList[8]=='>'||tokenList[9]=='<'){
                                        flagfor=1;
                                    }
                                    if(flagfor!=1){
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
            //forStack.push('for');
            //currentBlock = 'for';
            //currentBlock1 = 'if';
            //currentBlock2 = 'while';
            //currentBlock3 = 'do';
            //currentBlock4 = 'else';
            //currentBlock5 = 'switch';

        }
        
        // Optional: Check if for statement is followed by '{'
        if (i + 1 < lines.length) {
            var nextLine = lines[i + 1].trim();
            if (!nextLine.includes('{')) {
                console.log("kkkkkkkk");
                continue;
            }
        }
        // Optional: Check if if statement is followed by '}', if not, continue reading through the lines
         if (i <= lines.length) {
            var foundClosingBrace = false;
            for (var j = i; j < lines.length; j++) {
                var nextLine = lines[j].trim();
                if (nextLine.includes('}')) {
                    foundClosingBrace = true;
                    break;
                }
            }
            if (!foundClosingBrace) {
                table += "<tr><td>Missing Brace</td><td>Missing '}' in for statement</td></tr>";
                output.innerHTML = table + "</table>";
                return;
            }
        }

    }

    // Check if all blocks are closed
    //if (ifStack.length > 0 || elseStack.length > 0 || switchStack.length > 0||doStack.length>0||whileStack.length>0||forStack.length>0||currentBlock) {
    //    table += "<tr><td>Unclosed Blocks</td><td>Unclosed blocks</td></tr>";
    //    output.innerHTML = table + "</table>";
    //    return;
    //}
         
      
    table += "<tr><td colspan='2'>No Errors</td></tr>";
    output.innerHTML = table + "</table>";
}

function isVariable(token) {
    // List of keywords and symbols
    var keywords = ["int", "float", "string", "double", "bool", "char", "for", "while", "if", "do", "return", "break", "continue", "end","case","switch"];
    var symbols = ["+", "-", "*", "/", "%", "(", ")", "{", "}", "[", "]", ",", ";", "<", ">", "=", "!", "&&", "||",":"];

    // Check if token is not in the list of keywords and symbols
    return !keywords.includes(token) && !symbols.includes(token);
}


function isValidAssignment(variableType, assignedValue) {
    switch (variableType) {
        case 'int':
            return /^-?\d+$/.test(assignedValue); // Check if assigned value consists of numbers only
        case 'float':
            return /^\d+(\.\d+)?$/.test(assignedValue); // Check if assigned value is a valid float
        case 'string':
            return /^[a-zA-Z]+$/.test(assignedValue); // Check if assigned value consists of letters only
        case 'double':
            return /^\d+(\.\d+)?$/.test(assignedValue); // Check if assigned value is a valid double
        case 'bool':
            return /^(true|false)$/.test(assignedValue.toLowerCase()); // Check if assigned value is a boolean
        case 'char':
            return /^[a-zA-Z]$/.test(assignedValue); // Check if assigned value is a single character
        default:
            return false;
    }
}