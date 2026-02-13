const input1 = document.getElementById("input1");
const input2 = document.getElementById("input2");
const input3 = document.getElementById("input3");
const buttonA = document.getElementById("buttonA");
const buttonB = document.getElementById("buttonB");
const output = document.getElementById("output");

buttonA.onclick = function() {
    const value1 = Number(input1.value);
    const value2 = Number(input2.value);
    const value3 = Number(input3.value);

    if (value1 > value2) {
        if (value1 > value3) {
            output.innerText = "Input 1 is largest";
        } else {
            output.innerText = "input 3 is largest";
        }
    } else {
        output.innerText = "Input 2 is largest";
    }
};

buttonB.onclick = function() {
    if (input1.value === "" || input2.value === "" || input3.value === "") {
        output.innerText = "All fields must be filled.";
    } else {
        output.innerText = "All fields contain values";
    }
};
