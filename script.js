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

const settings = {
    filterBy: "all",
    sortBy: "name",
    sortDir: "asc"
}


function init() {

    loadJson();
    buttons();
    search();

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
        if (student.nickName === "") {
            student.nickName = "null";
        }
        /* -------------------if just one name------------- */
        if (student.name === "") {
            student.name = student.lastName;
            student.lastName = "null";
        }

        /* ---------------------student.house--------------- */
        student.house = capitalize(stud.house.trim());

        //adding a student to the allStudents array of object at the beginning of the script
        return allStudents.push(student);
    });
    getTotal();
    displayNewList(allStudents);
}

function capitalize(str) {
    //charAt is character at index 0 to select the index 0 instid of substring(0,something) 
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
}

/* ------------------------------ // FILTERING // ---------------------------------- */

function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log(`user selected ${filter}`);
    //filterList(filter);
    setFilter(filter);
    changeBodyBackg(filter);
    cleanFilButtons(filter);
}

function setFilter(filter) {
    settings.filterBy = filter;
    buildtList();
}

function filterList(filteredList) {
    //let filteredList = allStudents;

    if (settings.filterBy === "gryffindor") {
        filteredList = allStudents.filter(houseG);
        grif.textContent = `There are ${filteredList.length} students in Gryffindor`;
    } else if (settings.filterBy === "slytherin") {
        filteredList = allStudents.filter(houseS);
        slyt.textContent = `There are ${filteredList.length} students in Slytherin`
    } else if (settings.filterBy === "hufflepuff") {
        filteredList = allStudents.filter(houseH);
        huff.textContent = `There are ${filteredList.length} students in Hufflepuff`;
    } else if (settings.filterBy === "ravenclaw") {
        filteredList = allStudents.filter(houseR)
        raven.textContent = `There are ${filteredList.length} students in Ravenclaw`;
    }

    document.querySelector("#total_disp").value = `Displaying : ${filteredList.length} students`;
    return filteredList;
}

function cleanFilButtons(studentHouse) {
    if (studentHouse === "gryffindor") {
        slyt.textContent = slyt.value;
        huff.textContent = huff.value;
        raven.textContent = raven.value;
    } else if (studentHouse === "slytherin") {
        grif.textContent = grif.value;
        huff.textContent = huff.value;
        raven.textContent = raven.value;
    } else if (studentHouse === "hufflepuff") {
        grif.textContent = grif.value;
        slyt.textContent = slyt.value;
        raven.textContent = raven.value;
    } else if (studentHouse === "ravenclaw") {
        grif.textContent = grif.value;
        slyt.textContent = slyt.value;
        huff.textContent = huff.value;
    }
}

function changeBodyBackg(house) {
    let body = document.querySelector("#body_list");
    if (house === "gryffindor") {
        body.classList = " ";
        body.classList.add("back_griff");
    } else if (house === "slytherin") {
        body.classList = " ";
        body.classList.add("back_slyt");
    } else if (house === "hufflepuff") {
        body.classList = " ";
        body.classList.add("back_huff");
    } else if (house === "ravenclaw") {
        body.classList = " ";
        body.classList.add("back_raven");
    }
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

/* ------------------------------ // SORTING // ---------------------------------- */

function selectSort(event) {
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDiretion;
    //toggle direction (sorting in both direction)
    if (sortDir === "asc") {
        event.target.dataset.sortDiretion = "desc"
    } else {
        event.target.dataset.sortDiretion = "asc"
    }
    //console.log(`user selected ${sortBy}`);
    setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    buildtList();
}

function sortList(sortedList) {
    //let sortedList = allStudents;
    let direct = 1;
    //toggle the direction multiplying it to the const to change the direction value
    if (settings.sortDir === "desc") {
        direct = -1;
    } else {
        settings.direct = 1;
    }
    sortedList = sortedList.sort(sortByProperty);
    // using closure so we can have access to th sortBy property using the sortByProperty function inside the sortList funct
    function sortByProperty(studentA, studentB) {
        if (studentA[settings.sortBy] < studentB[settings.sortBy]) { // sortBy is not a property of the object we can access it in brackets []
            return -1 * direct;
        } else {
            return 1 * direct;
        }
    }
    return sortedList;
}

function buildtList() {
    const currentList = filterList(allStudents);
    const sortedList = sortList(currentList);
    displayNewList(sortedList);
}

/* ------------------------------ // SEARCH // ---------------------------------- */

function search() {
    // Declare variables
    const searchInput = document.querySelector("[data-search]");

    //getting the input from the field
    searchInput.addEventListener("keyup", (event) => {

        let searchVal = event.target.value;

        const searchFilt = allStudents.filter(student => {
            return student.name.includes(searchVal) || student.lastName.includes(searchVal);

        })
        displayNewList(searchFilt);
    })

}
/* ------------------------------------- //TOTALS//-------------------------------- */

function getTotal() {
    document.querySelector("#total").value = `Total of Hogwards' students ${allStudents.length+1}`;
}

/* ------------------------------ // DISPLAY THE NEW VIEW // ---------------------------------- */


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
        //hidding table
        document.querySelector("main").classList.add("close");

        //tengo problemas displaying the images of patil_padma.png and patil parvati.pgn
        document.querySelector("img").src = `../images/stud_images/${student.lastName}_${student.name.charAt(0)}.png`;
        document.querySelector("img").alt = `../images/stud_images/${student.lastName}.png`;
        document.querySelector("#student_ident").textContent = `${student.name} ${student.middleName} ${student.lastName}`;
        document.querySelector("#middle_name").textContent = student.middleName;
        document.querySelector("#nick_name").textContent = student.nickName;
        document.querySelector("#house").textContent = student.house;

        //changing body background 
        //HOW TO CALL THE FUNCTION CHANGE BACKGROUND INSIDE THE CLONE?
        if (student.house === "Gryffindor") {
            document.querySelector("#body_list").classList.add("back_griff");
        } else if (student.house === "Slytherin") {
            document.querySelector("#body_list").classList.add("back_slyt");

        } else if (student.house === "Hufflepuff") {
            document.querySelector("#body_list").classList.add("back_huff");
        } else if (student.house === "Ravenclaw") {
            document.querySelector("#body_list").classList.add("back_raven");
        }
        //querySelector("#ext_curricular").textContent = student.extCurricular;
        //document.querySelector("#pic").textContent = student.pic;
    });


    // 4.- Select the new DOM parent element
    const parent = document.querySelector("tbody");

    //5.- Append the child to the new parent element inside the DOM
    parent.appendChild(clone);

}