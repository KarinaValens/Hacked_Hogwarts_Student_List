"use strict";
document.addEventListener("DOMContentLoaded", init);


const url = "https://petlatkea.dk/2021/hogwarts/students.json";
let allStudents = [];
//prototype
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
    buttons();
}

function buttons() {
    document.querySelectorAll("[data-action='filter']").forEach(button => button.addEventListener("click", selectFilter));
    document.querySelectorAll("[data-action='sort']").forEach(button => button.addEventListener("click", selectSort));
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

        /* -------------------nick name------------- */
        student.nickName = capitalize(fullN.substring(fullN.indexOf(`"`) + 1, fullN.lastIndexOf(`"`)))

        /* -------------------if just one name------------- */
        if (student.name === "") {
            student.name = student.lastName;
            student.lastName = "";
        }

        /* ---------------------student.house--------------- */
        student.house = capitalize(stud.house.trim());

        /* -------------------  //TOTALS// ----------------- */
        return allStudents.push(student); //adding a student to the allStudents array of object at the beginning of the script
    });
    displayNewList(allStudents);
}

function capitalize(str) {
    //charAt is character at index 0 to select the index 0 instid of substring(0,something) 
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
}

function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log(`user selected ${filter}`);
    filterList(filter);
}

function filterList(studentHouse) {
    let filteredList = allStudents;

    if (studentHouse === "gryffindor") {
        filteredList = allStudents.filter(houseG);
        grif.textContent = `There are ${filteredList.length} students in Gryffindor`;
        document.querySelector("#body_list").classList.add("back_griff");
    } else if (studentHouse === "slytherin") {
        filteredList = allStudents.filter(houseS);
        slyt.textContent = `There are ${filteredList.length} students in Slytherin`

    } else if (studentHouse === "hufflepuff") {
        filteredList = allStudents.filter(houseH);
        huff.textContent = `There are ${filteredList.length} students in Hufflepuff`

    } else if (studentHouse === "ravenclaw") {
        filteredList = allStudents.filter(houseR)
        raven.textContent = `There are ${filteredList.length} students in Ravenclaw`
    }
    document.querySelector("#total_disp").value = `Total Hogwards' Students ${filteredList.length}`;

    displayNewList(filteredList);

}



function houseG(student) {
    return student.house === "Gryffindor";
}

function houseS(student) {
    return student.house === "Slytherin";
}

function houseH(student) {
    return student.house === "Hufflepuff";
}

function houseR(student) {
    return student.house === "Ravenclaw";
}


function displayNewList(students) {

    // clear the list when we add filters else it is going to print more objects
    document.querySelector("#list tbody").innerHTML = "";

    //built a new list
    students.forEach(displayStudent);
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
    clone.querySelector("[data-field=ext_curricular]").textContent = student.extCurricular;

    /* ----------- //POP-UP// ---------------- */
    clone.querySelector("tr").addEventListener("click", (event) => {
        //open pop-up
        document.querySelector("#pop_up").classList.add("open");
        document.querySelector("#close_pop").classList.add("open");
        /* //changing body background color
        document.querySelector("body").style.backgroundColor = "black"; */
        //hidding table
        document.querySelector("main").classList.add("close");


        document.querySelector("img").src = `../images/stud_images/${student.lastName}_${student.name.substring(0,1)}.png`;
        document.querySelector("img").alt = `../images/stud_images/${student.lastName}.png`;
        document.querySelector("#student_ident").textContent = `${student.name} ${student.middleName} ${student.lastName}`;
        document.querySelector("#middle_name").textContent = student.middleName;
        document.querySelector("#nick_name").textContent = student.nickName;
        document.querySelector("#house").textContent = student.house;
        //querySelector("#ext_curricular").textContent = student.extCurricular;
        //document.querySelector("#pic").textContent = student.pic;
    });


    /* -------- //TOTALS//-------- */
    document.querySelector("#total").value = `Total Hogwards' Students ${allStudents.length+1}`;

    // 4.- Select the new DOM parent element
    const parent = document.querySelector("tbody");

    //5.- Append the child to the new parent element inside the DOM
    parent.appendChild(clone);

}