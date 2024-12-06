//Init emailjs
emailjs.init(config.publicKey);

//Add submit forms listeners
document
  .getElementById("newUserForm")
  .addEventListener("submit", sendNewUserEmail);

document
  .getElementById("contactForm")
  .addEventListener("submit", sendContactEmail);

//Toastify configuration
const toast = (text, color) =>
  Toastify({
    text: text,
    duration: 2000,
    close: true,
    gravity: "bottom",
    position: "center",
    style: {
      background: color,
    },
  }).showToast();

//Phone number configuration
function phoneNumberFormatter(phoneNumberId) {
  document.getElementById(phoneNumberId).addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/^(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3");
    e.target.value = value;
  });
}
phoneNumberFormatter("newUserPhoneNumber");
phoneNumberFormatter("contactPhoneNumber");

//New user function
function sendNewUserEmail(event) {
  event.preventDefault();

  const spinner = document.querySelector(".spinner");
  spinner.style.display = "block";

  let params = {
    firstName: document.getElementById("newUserFirstName").value,
    lastName: document.getElementById("newUserLastName").value,
    email: document.getElementById("newUserEmail").value,
    phoneNumber: document.getElementById("newUserPhoneNumber").value,
    subject: "New User",
  };
  emailjs
    .send(config.serviceId, config.newUserTemplateId, params)
    .then(() => {
      spinner.style.display = "none";
      toast("Zgłoszenie wysłane", "#7fd1ae");
      document.getElementById("newUserFirstName").value = "";
      document.getElementById("newUserLastName").value = "";
      document.getElementById("newUserEmail").value = "";
      document.getElementById("newUserPhoneNumber").value = "";
    })
    .catch((error) => {
      spinner.style.display = "none";
      toast("Błąd wysyłania, spróbuj ponownie.", "#ff768e");
      console.log(error("Błąd wysyłania zgłoszenia:", error));
    });
}

//Contact function
function sendContactEmail(event) {
  event.preventDefault();

  const spinner = document.querySelector(".spinner");
  spinner.style.display = "block";

  let params = {
    firstName: document.getElementById("contactFirstName").value,
    lastName: document.getElementById("contactLastName").value,
    phoneNumber: document.getElementById("contactPhoneNumber").value,
    email: document.getElementById("contactEmail").value,
    message: document.getElementById("contactMessage").value,
    subject: "Contact",
  };
  emailjs
    .send(config.serviceId, config.contactTemplateId, params)
    .then(() => {
      spinner.style.display = "none";
      toast("Wiadomość wysłana", "#7fd1ae");
      document.getElementById("contactFirstName").value = "";
      document.getElementById("contactLastName").value = "";
      document.getElementById("contactPhoneNumber").value = "";
      document.getElementById("contactEmail").value = "";
      document.getElementById("contactMessage").value = "";
    })
    .catch((error) => {
      spinner.style.display = "none";
      toast("Błąd wysyłania, spróbuj ponownie.", "#ff768e");
      console.log("Błąd wysyłania wiadomości:", error);
    });
}
