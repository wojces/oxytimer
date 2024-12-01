function sendNewUserEmail() {
  let params = {
    firstName: document.getElementById("newUserFirstName").value,
    lastName: document.getElementById("newUserLastName").value,
    email: document.getElementById("newUserEmail").value,
  }
  console.log(params)
  alert('Przesyłanie maili ze zgłoszeniem jest obecnie wyłączone.')
}

function sendContactEmail() {
  let params = {
    firstName: document.getElementById("contactFirstName").value,
    lastName: document.getElementById("contactLastName").value,
    email: document.getElementById("contactEmail").value,
    subject: document.getElementById("contactSubject").value,
    message: document.getElementById("contactMessage").value
  }
  console.log(params)
  alert('Przesyłanie maili kontaktowych jest obecnie wyłączone.')
}
