"use strict";
document.addEventListener("DOMContentLoaded", init);

const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const url2 = "https://petlatkea.dk/2021/hogwarts/families.json";

let isHackingFlag; //let´s the hacking begins
//ARRAYS
let allStudents = [];
let expelledStudent = [];
let halfBlood = []; //loop to check if the student last name apears in one of the list
let pureBlood = []; //loop to check if the student last name apears in one of the list

//PROTOTYPE OBJECT
const Student = {
    name: " ",
    lastName: " ",
    middleName: " ",
    nickName: " ",
    photo: " ",
    house: " ",
    enrole: true,
    prefect: false,
    bloodStatus: "muggle",
    squad: false
}

//KARINA OBJECT
const karyObj = {
    name: "Karina",
    lastName: "Valens",
    middleName: "Elizabeth",
    nickName: "Kary",
    house: "Gryffindor",
    enrole: true,
    prefect: false,
    bloodStatus: "pure-blood",
    squad: false
};

//CONFIGURATION OBJECT WITH GLOBAL VARIABLES
const settings = {
    filterBy: "all",
    sortBy: "name",
    sortDir: "asc",
}

/* ----------------------------------- //FUNCTIONS// -------------------------- */
function init() {
    loadJson();
    buttons();
    search();
    hackTheSystem();
}

function buttons() {
    document.querySelectorAll("[data-action='filter']").forEach(button => button.addEventListener("click", selectFilter));
    document.querySelectorAll("[data-action='sort']").forEach(button => button.addEventListener("click", selectSort));

}

/* --------------------------- //LOADING JSON´s FILE// --------------------- */

async function loadJson() {
    /*  fetch(url)
         .then((res) => { //request the data
             return res.json(); //take the data and return it as json 
         })
         .then((studentData) => { //this 2 parameters are the same
             handleJsonData(studentData); //assign the data as a parameter
         }); */
    //loading first URL with async and await it is a better way to be sure to have the data ready
    const res = await fetch(url);
    const studentData = await res.json();
    const familiesData = await loadJsonFamilies(); //this line make the the call back for handleJsonData wait until familiesData is upload
    handleJsonData(studentData, familiesData);
}

async function loadJsonFamilies() {
    //loading second URL
    const res = await fetch(url2);
    const familiesData = await res.json()
    //return the families data to make it available outsite the function
    return familiesData;
}

/* ---------------------- //CONVERT THE DATA INTO JAVASCRIPT OBJ// ------------ */

function handleJsonData(studentData, familiesData) {

    familiesData.half.forEach(lastName => {
        halfBlood.push(lastName);
    }); //getting the blood status data into the halfBlood array 

    familiesData.pure.forEach(lastName => {
        pureBlood.push(lastName);
    }); //getting the blood status data into the pureBlood array 

    studentData.forEach(stud => {
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

        /* ------------------------------------- //BLOOD STATUS//-------------------------------- */
        if (isHackingFlag === true) {
            hackTheSystem();
        } else if (halfBlood.includes(student.lastName)) {
            student.bloodStatus = "half-blood";
        } else if (pureBlood.includes(student.lastName)) {
            student.bloodStatus = "pure-blood";
        } else if (!halfBlood.includes(student.lastName) && !pureBlood.includes(student.lastName)) {
            student.bloodStatus = "muggle-born"
        }

        return allStudents.push(student); //this adds a student to the allStudents array of object at the beginning of the script
    });
    buildtList(allStudents); //IF I CALL THIS FUNCTION ALL THE LIST SORT BY NAME BY DEFAULT
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
    } else if (settings.filterBy === "exp-students") {
        filteredList = expelledStudent;
        document.querySelector("#studentStatus").textContent = "Expeled";
        expStud.textContent = `${filteredList.length} students expelled `;
    } else if (settings.filterBy === "prefect") {
        filteredList = allStudents.filter(prefects);
    } else if (settings.filterBy === "inq_squad") {
        filteredList = allStudents.filter(squad);
    } else if (settings.filterBy === "*") {
        filteredList = allStudents;
        document.querySelector("#studentStatus").textContent = "Enrole";
        expStud.textContent = `Expelled Students`;
    }

    //getting the totals into input fields
    document.querySelector("#total").value = `Total of Hogwards' students ${allStudents.length+1}`;
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

function prefects(student) {
    return student.prefect === true;
}

function squad(student) {
    return student.squad === true;
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
    let currentList = filterList(allStudents);
    const sortedList = sortList(currentList);
    displayNewList(sortedList);
}

/* ------------------------------ // SEARCH // ---------------------------------- */

function search() {
    // Declare variables
    const searchInput = document.querySelector("[data-search]");

    //getting the input from the field
    searchInput.addEventListener("keyup", (event) => {

        let searchVal = capitalize(event.target.value);
        const searchFilt = allStudents.filter(student => {
            return student.name.includes(searchVal) || student.lastName.includes(searchVal);
        })
        displayNewList(searchFilt);
    })
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

    /* ------------------------------ // PREFECTS// ---------------------------------------- */
    clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;

    clone.querySelector("[data-field=prefect]").addEventListener("click", selectPrefect);

    function selectPrefect() {
        if (student.prefect === true) {
            student.prefect = false;

        } else {
            managePrefects(student);

        }
        buildtList();

        //trying to change the backgroun of the prefects td
        /* if (student.house === "Gryffindor") {
            //document.querySelector("tbody tr").classList.add("gryf_background");
            this.parentElement.style.color = "red";
            console.log(this.parentElement);
        } */
    }
    /* ------------------------------ // INQUISITORIAL SQUAD // ---------------------------------------- */

    clone.querySelector("[data-field=inq_squad]").dataset.squad = student.squad;

    clone.querySelector("[data-field=inq_squad]").addEventListener("click", selectSquad);

    function selectSquad() {

        if (student.squad === true) {
            student.squad = false;
        } else if (student.bloodStatus === "pure-blood" || student.house === "Slytherin") {
            student.squad = true;
        }
        buildtList();

        if (isHackingFlag === true) {
            setTimeout(() => {
                if (student.bloodStatus === "pure-blood" || student.house === "Slytherin") {
                    student.squad = false
                }
                buildtList();
            }, 3000);
            console.log("I am being called")
        }
    }
    /* --------------------------- // EXPELL STUDENTS// -------------------------------- */
    if (student.enrole === true) {
        clone.querySelector("[data-field=enrole]").textContent = "✔️";
    } else {
        clone.querySelector("[data-field=enrole]").textContent = "❌";
    }

    clone.querySelector("[data-field=enrole]").addEventListener("click", expellStudent);

    function expellStudent() {
        if (student.enrole === true) {
            if (student === karyObj) {
                document.querySelector("#hacker").classList.add("open");
                document.querySelector("main").classList.add("close");
                document.querySelector("#close_pop_hacker").addEventListener("click", closeHackerPop)
            } else {
                student.enrole = false;
                this.parentElement.classList.add("animation");
                this.parentElement.addEventListener("animationend", () => {
                    expelledStudent.push(allStudents.splice(allStudents.indexOf(student), 1)[0]);
                    buildtList();
                })
            }
        }

        function closeHackerPop() {
            document.querySelector("#hacker").classList.remove("open");
            document.querySelector("main").classList.remove("close");
            document.querySelector("#close_pop_hacker").removeEventListener("click", closeHackerPop);
        }
    }

    /* --------------------------- //BLOOD STATUS// -------------------------------- */
    const dataBlood = clone.querySelector("[data-field=blood]");
    if (student.bloodStatus === "half-blood") {
        dataBlood.textContent = `🧙‍♂️ + 👩‍👧`;
    } else if (student.bloodStatus === "pure-blood") {
        dataBlood.textContent = `🧙‍♂️ + 🧙`;
    } else if (student.bloodStatus === "muggle-born") {
        dataBlood.textContent = `👨‍👩‍👧`;
    }

    /* ---------------------------------- //POP-UP// ----------------------------------- */

    clone.querySelector(".pop").addEventListener("click", popInfo);

    function popInfo() {

        //open pop-up
        document.querySelector("#pop_up").classList.add("open");
        //hidding table
        document.querySelector("main").classList.add("close");

        document.querySelector("#close_pop").addEventListener("click", () => {
            document.querySelector("#pop_up").classList.remove("open");
            document.querySelector("main").classList.remove("close");
            document.querySelector("#body_list").classList = " ";
        })

        //tengo problemas displaying the images of patil_padma.png and patil parvati.pgn
        document.querySelector("img").src = `../assets/images/stud_images/${student.lastName}_${student.name.charAt(0)}.png`;
        document.querySelector("img").alt = `../assets/images/stud_images/${student.lastName}.png`;
        document.querySelector("#student_full_name").textContent = `${student.name} ${student.middleName} ${student.lastName}`;
        document.querySelector("#nick_name").textContent = student.nickName;
        if (student.prefect === true && student.squad === true) {
            document.querySelector("#ext_curr").textContent = `${student.lastName} is 🧙‍♂️ & 👮‍♂️ needs social life`;
        } else if (student.prefect === true) {
            document.querySelector("#ext_curr").textContent = `${student.lastName} 🧙‍♂️ is prefect`;
        } else if (student.squad === true) {
            document.querySelector("#ext_curr").textContent = `${student.lastName} 👮‍♂️ is from the Inq. Squad`;
        } else {
            document.querySelector("#ext_curr").textContent = `${student.lastName} 👩‍💻 is just a student`;

        }
        document.querySelector("#house").textContent = student.house;
        //Enrrolled status
        if (student.enrole === true) {
            document.querySelector("#expelled").textContent = "✔️ Enroled";
        } else {
            document.querySelector("#expelled").textContent = "❌ Expelled";
        }

        //Blood status
        if (student.bloodStatus === "half--half-blood") {
            document.querySelector("#familyBlood").textContent = `🧙 + 👨‍👦 ${student.bloodStatus}`;
        } else if (student.bloodStatus === "half-blood") {
            document.querySelector("#familyBlood").textContent = `🧙‍♂️ + 👩‍👧 ${student.bloodStatus}`;
        } else if (student.bloodStatus === "pure-blood") {
            document.querySelector("#familyBlood").textContent = `🧙‍♂️ + 🧙 ${student.bloodStatus}`;
        } else if (student.bloodStatus === "muggle-born") {
            document.querySelector("#familyBlood").textContent = `👨‍👩‍👧 ${student.bloodStatus}`;
        }

        //CHANGING THEME ACORDING THE STUDENT´S HOUSE 

        const body = document.querySelector("#body_list");
        const elements = document.querySelectorAll("#house, #student_full_name, dt");

        if (student.house === "Gryffindor") {
            body.classList.add("back_griff");
            elements.forEach(element => {
                element.classList = " ";
            });
            elements.forEach(element => {
                element.classList.add("gryf_color")
            });

        } else if (student.house === "Slytherin") {
            body.classList.add("back_slyt");
            elements.forEach(element => {
                element.classList = " ";
            });
            elements.forEach(element => {
                element.classList.add("slyt_color")
            });

        } else if (student.house === "Hufflepuff") {
            body.classList.add("back_huff");
            elements.forEach(element => {
                element.classList = " ";
            });
            elements.forEach(element => {
                element.classList.add("huff_color")
            });

        } else if (student.house === "Ravenclaw") {
            body.classList.add("back_raven");
            elements.forEach(element => {
                element.classList = " ";
            });
            elements.forEach(element => {
                element.classList.add("raven_color")
            });

        }
    }

    // 4.- Select the new DOM parent element
    const parent = document.querySelector("tbody");

    //5.- Append the child to the new parent element inside the DOM
    parent.appendChild(clone);

}

/* ------------------------------ // PREFECTS // ---------------------------------- */

function managePrefects(selectedStudent) {

    const prefects = allStudents.filter(student => student.prefect); //filter gives me an array back
    const otherPrefect = prefects.filter(student => student.house === selectedStudent.house); //gives me an array with the prefects from each house
    const prefectsPerHouse = otherPrefect.length;

    //if there are 2 of the same type    
    if (prefectsPerHouse === 2) {
        removeAorB(otherPrefect[0], otherPrefect[1]); //the two first items in the array
    } else {
        assignPrefect(selectedStudent);
    }

    function removeAorB(prefectA, prefectB) {
        //ask the user to cancel or move A or B
        //if user cancel do nothing
        //if remove A
        document.querySelector("#close_pop_remov_aorb").addEventListener("click", closePopUp)
        document.querySelector("#remove_aorb").classList.add("open");
        document.querySelector("#house_name").textContent = selectedStudent.house.toUpperCase();
        //hidde the main
        document.querySelector("main").classList.add("close");

        document.querySelector("#remove_a").addEventListener("click", removeA);
        document.querySelector("#remove_aorb [data-field=prefectA]").textContent = prefectA.name;
        document.querySelector("#remove_b").addEventListener("click", removeB);
        document.querySelector("#remove_aorb [data-field=prefectB]").textContent = prefectB.name;

        function removeA() {
            assignPrefect(selectedStudent);
            removePrefect(prefectA);
            closePopUp();
            buildtList();
        }

        function removeB() {
            assignPrefect(selectedStudent);
            removePrefect(prefectB);
            closePopUp();
            buildtList();
        }

        function closePopUp() {
            document.querySelector("#remove_a").removeEventListener("click", removeA);
            document.querySelector("#remove_b").removeEventListener("click", removeB);
            document.querySelector("#remove_aorb").classList.remove("open");
            document.querySelector("main").classList.remove("close");
        }
    }

    function removePrefect(student) {
        student.prefect = false;
    }

    function assignPrefect(student) {
        student.prefect = true;
    }
}

/* --------------------------- // HACKING// -------------------------------- */

function hackTheSystem() {

    isHackingFlag = false;
    document.addEventListener("keydown", hacking)

    function hacking(e) {
        if (e.key === "Delete") {
            isHackingFlag = !isHackingFlag;

            document.querySelector("#hacking").classList.add("open");
            document.querySelector("#body_list").classList.add("backgroundDark");
            document.querySelector("main").classList.add("close");
            document.querySelector("#close_pop_hack").addEventListener("click", closePop)
            document.removeEventListener("keydown", hacking)

            //adding an object to the student list 
            allStudents.push(karyObj);
            buildtList(karyObj);
        }

        function closePop() {
            document.querySelector("#hacking").classList.remove("open");
            document.querySelector("#body_list").classList.remove("backgroundDark");
            document.querySelector("main").classList.remove("close");
            document.querySelector("#close_pop_hack").removeEventListener("click", closePop);
        }
        allStudents.forEach((student) => {
            //check if blood is pure then randomize and set to half or muggle
            //else if halfblood = pureblood
            //else if muggle = pureblood
            const randomBlood = Math.floor(Math.random() * 3);
            const array = ["pure-blood", "muggle-born", "half-blood"]

            if (student.bloodStatus === "pure-blood") {
                student.bloodStatus = array[randomBlood];
            } else {
                student.bloodStatus = "pure-blood"
            }
        })
        buildtList();
    }
}