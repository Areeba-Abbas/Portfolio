document.getElementById("whatsappBtn").addEventListener("click", function () {
  const name = document.querySelector('input[placeholder="Your Name *"]').value;
  const email = document.querySelector(
    'input[placeholder="Email Address *"]'
  ).value;
  const phone = document.querySelector(
    'input[placeholder="Your Phone *"]'
  ).value;
  const subject = document.querySelector(
    'input[placeholder="Subject *"]'
  ).value;
  const message = document.querySelector("textarea").value;

  const whatsappNumber = "923166432128"; // replace with your own number
  const url = `https://wa.me/${whatsappNumber}?text=
      *Name:* ${name}%0A
      *Email:* ${email}%0A
      *Phone:* ${phone}%0A
      *Subject:* ${subject}%0A
      *Message:* ${message}`;

  window.open(url, "_blank");
});
