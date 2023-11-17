//const url = `https://localhost:7117/Contact`;
const url = `https://ery9ct8r48.execute-api.ap-south-1.amazonaws.com/Contact`;
var modal = new bootstrap.Modal(document.querySelector(".modal"));

const toastRendered = (message, error) => {
  console.log(message);
  let toast;
  let toastContent;
  if (error) {
    toast = document.querySelector(".toast-error");
    toastContent = document.querySelector(".toast-body-error");
  } else {
    toast = document.querySelector(".toast-success");
    toastContent = document.querySelector(".toast-body-success");
  }
  let b = new bootstrap.Toast(toast);
  b.show();
  toast.addEventListener("shown.bs.toast", function () {
    toastContent.innerHTML = message;
  });
};

const openEditModal = (data) => {
  console.log(data);
  modal.show();
  document
    .querySelector(".modal")
    .addEventListener("shown.bs.modal", function () {
      document.querySelector("#name").value = data.name;
      document.querySelector("#email").value = data.email;
      document.querySelector("#phone").value = data.phone;
      document.querySelector(".edit-form").id = data.id;
    });
};

const dateFormatter = (date) => {
  if (date) {
    //date = date.split(/[- : T]/)+"Z";

    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear().toString().slice(2);

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    console.log(d.getHours());
    return [month, day, year].join("/");
  } else return "";
};
//GET

const getContacts = () => {
  let table = document.getElementById("table");
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      let tableContent = `
      <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Phone</th>
        <th scope="col"> Created</th>
        <th scope="col"> Actions</th>
      </tr>
      </thead>`;
      if ((res || []).length) {
        res.reverse().forEach((element) => {
          tableContent += `<tr>
          <td>${dateFormatter("2023-12-12")}</td>
          <td>${dateFormatter("2023-12-12 12:45")}</td>
          <td>${dateFormatter("2023/12/12")}</td>
          <td>${dateFormatter("2023/12/12 12:45")}</td>
          <td class="table-action"  >
          <i class="bi bi-trash" onclick="deleteContact(${element.id})"></i>
          <i class="bi bi-pencil-square" onclick='openEditModal(${JSON.stringify(
            element
          )})'></i>
            
          </td>
        </tr>`;
        });
      } else {
        tableContent = `<div class"no-content-text">No Contacts Yet</div>`;
      }
      table.innerHTML = tableContent;
    });
};

//POST

const onSubmit = (e) => {
  e.preventDefault();
  let requestObj = {};
  for (let i = 0; i < 6; i++) {
    let { name, value, tagName } = e.target[i] || {};
    if (tagName === "INPUT") {
      requestObj[name] = value;
    }
  }
  console.log(e.target.id);

  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestObj),
  })
    .then((res) => {
      console.log(res);
      if (res.ok) {
        success = true;
        window.location.href = "contacts.html";
      } else success = false;
      return res.json();
    })
    .then((res) => {
      console.log(res);
      success
        ? toastRendered(res)
        : toastRendered(res?.title || "Something Went wrong", true);
    })
    .catch((err) => {
      console.log(err);
      toastRendered("Something Went wrong", true);
    });

  return false;
};

//EDIT

const onEditContact = (e) => {
  e.preventDefault();
  let requestObj = {};
  for (let i = 0; i < 6; i++) {
    let { name, value, tagName } = e.target[i] || {};
    if (tagName === "INPUT") {
      requestObj[name] = value;
    }
  }
  //delete requestObj.name;

  let success;
  fetch(url + "/" + e.target.id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestObj),
  })
    .then((res) => {
      console.log(res);
      if (res.ok) {
        success = true;
        modal.hide();
        getContacts();
      } else success = false;
      return res.json();
    })
    .then((res) => {
      console.log(res);
      success
        ? toastRendered(res)
        : toastRendered(res?.title || "Something Went wrong", true);
    })
    .catch((err) => {
      console.log(err);
      toastRendered("Something Went wrong", true);
    });

  return false;
};

//DELETE

const deleteContact = (id) => {
  let success;
  fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      console.log(res);
      if (res.ok) {
        success = true;
        getContacts();
      } else success = false;
      return res.json();
    })
    .then((res) => {
      success
        ? toastRendered(res)
        : toastRendered(res?.title || "Something Went wrong", true);
    })
    .catch((err) => toastRendered("Something Went wrong", true));
};