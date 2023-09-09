// Model
const keywords = ["declare"];
const operators = ["+", "="];

// Controller
function analyzeCode() { // function นี้ถือเป็น Controller หลักซึ่งจะไปเรียกใช้ function อื่นๆเพื่อจัดการกับ model และ source code ที่ input เข้ามาแล้วส่งการแสดงผลกลับไปที่ view
  const sourceCode = document.getElementById("sourceCode").value;
  const tokens = tokenize(sourceCode);
  const tokenTypes = classifyTokens(tokens);

  displayResult(tokenTypes);
}

function tokenize(sourceCode) {
  // ใช้แบ่ง source code ที่รับเข้ามา
  return sourceCode.split(/\s+/);
}

function classifyTokens(tokens) { //ใช้แยกประเภทว่าเป็น Token แบบไหน
  // แบ่ง rule
  const tokenTypes1 = []; // rule 4
  const tokenTypes2 = []; // rule 5

  let currentLineHasCommand = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.startsWith("//")) { // ถ้าเป็น comment จะข้ามบรรทัดนั้นทิ้งเลย
      continue;
    }

    if (keywords.includes(token)) {
      // Check "declare"
      tokenTypes1.push(token + " is Keyword");
      tokenTypes2.push(token + " is Keyword and Sign");
    } else if (operators.includes(token)) {
      if (token === "+") { // Check "+"
        tokenTypes1.push(token + " is Symbol");
        tokenTypes2.push(token + " is Keyword and Sign");
      } else { // Check "="
        tokenTypes1.push(token + " is Symbol");
        tokenTypes2.push(token + " is Assignment");
      }
    } else if (/^[a-z]+$/.test(token)) {
      //Check a-z
      tokenTypes1.push(token + " is Identifier");
      tokenTypes2.push(token + " is Variable");
    } else if (/^[0-9]+$/.test(token)) {
      // Check integer
      tokenTypes1.push(token + " is Literal");
      tokenTypes2.push(token + " is Integer");
    } else {
      // Check invalid syntax
      if (token === "declare" && currentLineHasCommand) { // จับ error multiple commands
        tokenTypes1.push(
          token + " is Invalid Syntax: Multiple commands on the same line"
        );
        tokenTypes2.push(
          token + " is Invalid Syntax: Multiple commands on the same line"
        );
      } else if (/^[A-Z]+$/.test(token)) {
        tokenTypes1.push(token + " is Invalid Syntax: Upper case");
        tokenTypes2.push(token + " is Invalid Syntax: Upper case");
      } else {
        tokenTypes1.push(token + " is Invalid");
        tokenTypes2.push(token + " is Invalid");
      }
    }

    // พยายามจะจับว่ามี multiple commands อยู่บนบรรทัดเดียวกันมั๊ยแต่ทำไม่ได้งับ เสียจุย
    const isNewLine = token === "\n";
    if (isNewLine) {
      currentLineHasCommand = false;
    } else if (token !== "//") {
      currentLineHasCommand = true;
    }
  }

  return { rule1: tokenTypes1, rule2: tokenTypes2 };
}


function displayResult(tokenTypes) { //ใช้ display ค่าที่ได้จากการนำไปทำ Regular Expression
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  for (const rule in tokenTypes) {
    const p = document.createElement("p");
    p.textContent = `${rule}:`;
    resultDiv.appendChild(p);

    const tokens = tokenTypes[rule];
    for (const type of tokens) {
      const pToken = document.createElement("p");
      pToken.textContent = type;
      resultDiv.appendChild(pToken);
    }
  }
}
