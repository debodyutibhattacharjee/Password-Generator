const intputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_+{[}]|\:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
// set strength circle color to grey

handleSlider();
setIndicator("#ccc");
// set passwordLength
function handleSlider(){
    intputSlider.value = passwordLength
    lengthDisplay.innerHTML = passwordLength;
    const min = intputSlider.min;
    const max = intputSlider.max;
    intputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max-min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 10px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randpos = getRndInteger(0,symbols.length);
    return symbols.charAt(randpos);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;
    
    if(hasUpper && hasLower && hasNum && hasSym && passwordLength >= 10){
        setIndicator("#f00");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#0f0");
    }
}

async function copyContent(){
    try{
        return navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    // to make the copied message visible
    copyMsg.classList.add("active");
    // to make it invisible after 2secs
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked) checkCount++;
    });

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

intputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value) copyContent();
})

function shufflePassword(array){
    // Fisher Yates Method

    for(let i=array.length-1;i>0;i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

generateBtn.addEventListener('click', () => {
    // none of the checkbox is selected
    if(checkCount == 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    
    // let's find the new password

    // remove the old password

    password = "";
    // try to put the symbols maintained by checkbox

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }
    
    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    // compulsory addition
    for(let i=0;i<funcArr.length; i++){
        password += funcArr[i]();
    }

    // remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randpos = getRndInteger(0,funcArr.length);
        password += funcArr[randpos]();
    }
    // shuffle the password

    password = shufflePassword(Array.from(password));
    
    // show in UI
    passwordDisplay.value = password;

    console.log(password);
    // calculate strength
    calcStrength();

});