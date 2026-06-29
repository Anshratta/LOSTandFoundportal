const search = document.getElementById("search");
const items = document.querySelectorAll(".item");
const message = document.getElementById("message");

search.addEventListener("keyup", searchItems);

function searchItems() {

    let found = false;

    items.forEach(item => {

        if(item.innerText.toLowerCase().includes(search.value.toLowerCase())){

            item.style.display = "block";
            found = true;

        }

        else{

            item.style.display = "none";

        }

    });

    message.style.display = found ? "none" : "block";

}

function filterItems(type){

    let found = false;

    items.forEach(item => {

        if(type === "all"){

            item.style.display = "block";
            found = true;

        }

        else if(item.classList.contains(type)){

            item.style.display = "block";
            found = true;

        }

        else{

            item.style.display = "none";

        }

    });

    message.style.display = found ? "none" : "block";

}