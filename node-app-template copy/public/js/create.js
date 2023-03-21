const fieldUI = document.getElementById("field");
const titleUI = document.getElementById("title__field");
const fieldContainerUI = document.getElementById("field__box");
const formUI = document.getElementById("create__form");
const copyToClipBoardUI = document.getElementById("copy-clipboard__container");

const addBtn = document.getElementById("add-field__btn");
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');


//HANDLE TAB SYSTEM
tabs.forEach(tab => {
  tab.addEventListener("click",() => {
    const tabId = tab.getAttribute("id")

    tabs.forEach(tab =>{
      tab.classList.remove("active","bg-gray-400")
    })

    tabContents.forEach(content => {
      content.classList.add("hidden")
    })

    tab.classList.add("active", "bg-gray-400")
    document.getElementById(`content${tabId.slice(-1)}`).classList.remove("hidden")
  })
})


let fields = [];
const addField = (e) => {
  e.preventDefault();
  if (fieldUI.value && !fields.includes(fieldUI.value)) {
    fields.push(fieldUI.value);
    addToContainer(fieldUI.value, fields.length - 1);
  }else{
    fieldUI.classList.add("border-red-500","border-2")
    setTimeout(() => {
      fieldUI.classList.remove("border-red-500","border-2")
    },1000)
  }
  fieldUI.value = "";
};

const addToContainer = (field, id) => {
  let el = `<div
            id="el"
            class="rounded-lg flex justify-around items-center bg-[#808080] p-4 w-44 text-white font-semibold"
          >
            <div class="inline truncate">${field}</div>
            <button type="button" class="cancel__btn" data-index=${id}>x</button>
          </div>`;
  fieldContainerUI.innerHTML += el;
};

const removeField = (e) => {
  if (e.target.classList.contains("cancel__btn")) {
    e.target.parentElement.remove();
  }
  let id = e.target.dataset["index"];
  fields = fields.filter((field) => field !== fields[id]);
};

const populateLink = (suffix) => {
  let text = `http://localhost:4000/render-meeting?hash=${suffix}`;
  let el = `
    <div id="copy__el" class="rounded-md border-dashed border-2 border-[#cf9c2e] w-full text-center p-5 font-medium text-[#808080] hover:border-solid cursor-pointer">
    ${text}
    </div>
    `;
  copyToClipBoardUI.innerHTML = el;
};

const copyToClipboard = (e) => {
  if (e.target.getAttribute("id") == "copy__el") {
    let word = e.target.innerText;
    if (navigator.clipboard) {
      try {
        navigator.clipboard.writeText(word);
        alert(word + "copied to clipboard");
      } catch (error) {
        console.log(error);
      }
    } else {
      document.execCommand("copy");
    }
  }
};

// SEND FORM TO BACKEND
let urlSuffix;
const handleSubmit = async (e) => {
  e.preventDefault();
  fetch("/api/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: titleUI.value , fields }),
  })
    .then(async (res) => {
      const response = await res.json();
      urlSuffix = await response.urlSuffix;
      if (urlSuffix) {
        populateLink(urlSuffix);
      }
    })
    .catch((err) => console.log(err));
};

addBtn.addEventListener("click", addField);
fieldContainerUI.addEventListener("click", removeField);
formUI.addEventListener("submit", handleSubmit);
copyToClipBoardUI.addEventListener("click", copyToClipboard);
