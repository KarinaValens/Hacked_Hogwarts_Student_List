"use strict";
document.addEventListener("DOMContentLoaded", init);


const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const studNewList = [];

const Student = {
    name: " ",
    lastName: " ",
    middleName: " ",
    nickName: " ",
    photo: " ",
    house: " ",
}

function init() {

    loadJson();
}

function loadJson() {
    fetch(url)
        .then((res) => { //request the data
            return res.json(); //take the data and return it as json 
        })
        .then((studentData) => { //this 2 parameters are the same
            handleJsonData(studentData); //assign the data as a parameter
        });
}

function capitalize(str) {
    //charAt is character at index 0 to select the index 0 instid of substring(0,something) 
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
}



/* function fullName(lastName, firstName, middleName) {
    if (middleName) {
        return `${firstName} ${middleName} ${lastName}`;
    }
    return `${firstName}`
    //return `name: _${firstName}_, lastname: _${lastName}_, middlename: _${middleName}_`;
} */

function handleJsonData(studentInf) {
    //console.log(studentInf);

    studentInf.forEach(stud => {
        //clean the data for each element
        const student = Object.create(Student); //at this point create the Prototype object for Student
        const fullN = stud.fullname.trim();

        /* -------------------first name------------- */
        student.name = capitalize(fullN.substring(0, fullN.indexOf(" ")));

        /* -------------------last-name------------- */
        student.lastName = capitalize(fullN.substring(fullN.lastIndexOf(" ") + 1));

        if (student.lastName.includes("-")) {
            student.lastName = student.lastName.substring(0, student.lastName.indexOf("-") + 1) + capitalize(student.lastName.substring(student.lastName.indexOf("-") + 1))
        }

        /* -------------------middle-name------------- */

        student.middleName = capitalize(fullN.substring(fullN.indexOf(" ") + 1, fullN.lastIndexOf(" ") + 1));

        if (student.middleName.length < 1) {
            student.middleName = "null";
        } else if (student.middleName.includes(`"`)) {
            student.middleName = "null";
        }

        /* -------------------if just one name------------- */
        //Leanne

        /* -------------------nick name------------- */
        student.nickName = capitalize(fullN.substring(fullN.indexOf(`"`) + 1, fullN.lastIndexOf(`"`)))

        /* -------------student.house----------- */
        student.house = capitalize(stud.house.trim());
        return studNewList.push(student); //adding a student to the allStudents array of object at the beginning of the script
    });

    displayNewList();
}

function displayNewList() {
    //display new list
    studNewList.forEach(displayStudent);
}

function displayStudent(student) {

    // 1.- Select the content from the template
    const template = document.querySelector("#template").content;
    // 2.- Clone the template
    const clone = template.cloneNode(true);
    // 3.- Populate the data
    clone.querySelector("[data-field=name]").textContent = student.name;
    clone.querySelector("[data-field=middle_name]").textContent = student.middleName;
    clone.querySelector("[data-field=last_name]").textContent = student.lastName;
    clone.querySelector("[data-field=nick_name]").textContent = student.nickName;
    clone.querySelector("[data-field=house]").textContent = student.house;

    // 4.- Select the new DOM parent element
    const parent = document.querySelector("tbody");

    //5.- Append the child to the new parent element inside the DOM
    parent.appendChild(clone);

}