"use strict";
document.addEventListener("DOMContentLoaded", init);


const url = "https://petlatkea.dk/2021/hogwarts/students.json";
let allStudents = [];
let expelledStudent = [];
//prototype
const Student = {
    name: " ",
    lastName: " ",
    middleName: " ",
    nickName: " ",
    photo: " ",
    house: " ",
    enrole: true,
}

const settings = {
    filterBy: "all",
    sortBy: "name",
    sortDir: "asc",
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
            student.middleName = "-";
        } else if (student.middleName.includes(`"`)) {
            student.middleName = "-";
        }

        /* -------------------nick name------------- */
        student.nickName = capitalize(fullN.substring(fullN.indexOf(`"`) + 1, fullN.lastIndexOf(`"`)))
        if (student.nickName === "") {
            student.nickName = "-";
        }

        /* -------------------if just one name------------- */
        if (student.name === "") {
            student.name = student.lastName;
            student.lastName = "-";
        }

        /* ---------------------student.house--------------- */
        student.house = capitalize(stud.house.trim());

        //adding a student to the allStudents array of object at the beginning of the script
        return allStudents.push(student);
    });
    getTotal();
    //buildtList(allStudents);
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
    changeBodyBackg(filter); //chage the background with the shield(escudo) of each house
    cleanFilButtons(filter);
}

function setFilter(filter) {
    settings.filterBy = filter;
    buildtList();
}

function filterList(filteredList) {
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
    } else if (settings.filterBy === "exp-studenst") {
        filteredList = expelledStudent;
        document.querySelector("#studentStatus").textContent = "Expeled";
        expStud.textContent = `${filteredList.length} students expelled `;
    } else if (settings.filterBy === "*") {
        filteredList = allStudents;
        document.querySelector("#studentStatus").textContent = "Enrole";
        expStud.textContent = `Expelled Students`;

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
    } else {
        grif.textContent = grif.value;
        slyt.textContent = slyt.value;
        huff.textContent = huff.value;
        raven.textContent = raven.value;
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
    } else {
        body.classList = " ";
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
    const sortDir = event.target.dataset.sortDirection;
    //console.log(sortDir);

    //find old sort element
    const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`); //the sort that was already choosen
    oldElement.classList.remove("sortBy"); //removing the class sortBy

    //indicate active sort
    event.target.classList.add("sortBy"); //adding the class sortBy to the new choosen option

    //toggle direction (sorting in both direction)
    if (sortDir === "asc") {
        event.target.dataset.sortDirection = "desc"
    } else {
        event.target.dataset.sortDirection = "asc"
    }
    console.log(`user selected ${sortBy} ${sortDir}`);
    setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    buildtList();
}

function sortList(sortedList) {
    let direct = 1;
    //toggle the direction multiplying it to the const to change the direction value
    if (settings.sortDir === "desc") {
        direct = -1;
    } else {
        direct = 1;
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

    // console.log("student.enrole", student.enrole)
    if (student.enrole === true) {
        clone.querySelector("[data-field=enrole]").textContent = "✔️";
    } else {
        clone.querySelector("[data-field=enrole]").textContent = "❌";
    }

    clone.querySelector("[data-field=enrole]").addEventListener("click", expellStudent);

    function expellStudent() {
        if (student.enrole === true) {
            student.enrole = false;
            expelledStudent.push(allStudents.splice(allStudents.indexOf(student), 1)[0]);

            //THIS ANIMATION WORKS JUST WHEN THERE IS A MISTAKE IN THE NEXT LINE
            this.parentElement.classList.add("animation");
            console.log(thi.parent);

            buildtList();
        }

    }

    /* ----------- //POP-UP// ---------------- */
    clone.querySelector(".pop").addEventListener("click", (event) => {
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

        if (student.enrole === true) {
            document.querySelector("#expelled").textContent = "✔️ Enroled";
        } else {
            document.querySelector("#expelled").textContent = "❌ Expelled";
        }

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