const urlParams = new URLSearchParams(window.location.search)
const query = urlParams.get("hash")
const containerUI = document.getElementById("container")
const title = document.createElement("h2")
const form = document.createElement('form');
const successUI = document.getElementById("success__container")



window.addEventListener("load",() => {
    fetch("/api/load-meeting",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({key:query})})
        .then(res => res.json())
        .then(data => {
            title.innerText = `Register for ${data.title}`
            title.classList.add("text-4xl","text-center","font-semibold","text-[#cf9c2e]")
            data.fields.forEach(field => {
                const label = document.createElement('label');
                label.innerText = field
                label.classList.add("my-3", "block","text-base","font-medium","text-[#07074D]")
                const input = document.createElement('input');
                input.type = field.toLowerCase() === "email" ? "email" : "text"
                input.name = field.toLowerCase()
                input.classList.add('w-full', 'rounded-md', 'border', 'border-[#e0e0e0]', 'bg-white', 'py-3', 'px-6', 'text-base', 'font-medium', 'text-[#6B7280]', 'outline-none', 'focus:border-[#cf9c2e]', 'focus:shadow-md');
                form.appendChild(label)
                form.appendChild(input)

            })
            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = 'Submit';
            submitButton.classList.add("my-3",'rounded-md', 'bg-[#cf9c2e]', 'h-14', 'capitalize', 'text-white', 'font-semibold', 'w-full', 'text-xl');
            form.appendChild(submitButton)
            containerUI.appendChild(title)
            containerUI.appendChild(form)

        })
        .catch(err => console.log(err))
})

const register = async (key,details) => {
    await fetch("/api/register",{
        method:"POST",
        headers: {
        "Content-Type":"application/json"
    },
        body:JSON.stringify({key,details})
    })
        .then(res => {
           if(res.status === 200){
               console.log("success")
               containerUI.remove()
               successUI.classList.remove("-top-full")
           }
           return res.json()
        })
        .then(data => {
            console.log(data)
        })
        .catch(err => console.error(err))
}

const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const formDataObject = Object.fromEntries(formData.entries())
    await register(query,formDataObject)
}
form.addEventListener("submit",handleSubmit)