const search = document.getElementById("search");
const items = document.querySelectorAll(".item");

search.addEventListener("keyup", function () {

    const value = search.value.toLowerCase();

    items.forEach(item => {

        const text = item.innerText.toLowerCase();

        if(text.includes(value)){

            item.style.display = "block";

        }

        else{

            item.style.display = "none";

        }

    });

});