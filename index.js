let data = [];
let isLoading = false;
const displayData = async () => {
  createHeaders(data);
  createRow(data);
  createCategoryDropDown();
};

const createHeaders = (users) => {
  const container = document.querySelector("thead > tr");
  const headers = Object.keys(users[0]);
  headers.forEach((header) => {
    const tableHeadEl = document.createElement("th");
    tableHeadEl.innerHTML = header;
    container.appendChild(tableHeadEl);
  });
};

const createRow = (users) => {
  const container = document.querySelector("#table-data");
  container.innerHTML = "";
  users.forEach((user) => {
    const row = container.insertRow();
    row.insertCell().innerHTML = user.id;
    row.insertCell().innerHTML = user.firstName;
    row.insertCell().innerHTML = user.lastName;
    row.insertCell().innerHTML = user.capsule;
    row.insertCell().innerHTML = user.age;
    row.insertCell().innerHTML = user.city;
    row.insertCell().innerHTML = user.gender;
    row.insertCell().innerHTML = user.hobby;
    row.insertCell().appendChild(createButtons("Edit"));
    row.insertCell().appendChild(createButtons("Delete"));
  });
};

const createCategoryDropDown = () => {
  const select = document.querySelector("select");
  select.innerHTML = "";
  for (const val in data[0]) {
    if (val !== "id") {
      const option = document.createElement("option");
      option.value = val;
      option.innerHTML = val;
      select.appendChild(option);
    }
  }
};

const manageEvents = (type, e) => {
  switch (type) {
    case "Edit":
      editRows(e);
      break;
    case "Delete":
      deleteData(e);
      break;
    case "Confirm":
      confirmEditRows(e);
      break;
    case "Cancel":
      cancelEditRows(e);
      break;
  }
};

const editRows = (e) => {
  const idCell = e.target.parentNode.parentNode.children[0];
  const rows = e.target.parentNode.parentNode.children;
  const parent = e.target.parentNode.parentNode;
  const header = document.querySelectorAll("thead > tr > th");

  [...rows].forEach((el, i) => {
    if (idCell === el) {
      return;
    }
    if (el.innerText === "Edit") {
      el.innerHTML = "";
      return el.appendChild(createButtons("Confirm"));
    }
    if (el.innerText === "Delete") {
      el.innerHTML = "";
      return el.appendChild(createButtons("Cancel"));
    }
    const text = el.textContent;
    el.innerHTML = "";
    createInput("input", header[i].innerText, text, el);
  });
};

const deleteData = (e) => {
  console.log(e.target.parentNode.parentNode);
  e.target.parentNode.parentNode.classList.add("animate");
  const index = data.findIndex(
    (student) =>
      student.id ===
      Number(e.target.parentNode.parentNode.children[0].innerText)
  );
  setTimeout(() => {
    data.splice(index, 1);
    createRow(data);
  }, 1000);
};

const confirmEditRows = (e) => {
  const index = Number(e.target.parentNode.parentNode.children[0].innerText);
  const header = document.querySelectorAll("thead > tr > th");
  const inputs = e.target.parentNode.parentNode.children;
  [...inputs].forEach((el, i) => {
    if (el.children[0] && header[i]) {
      const property = header[i].innerText;
      data[index][property] = el.children[0].value;
    }
  });
  createRow(data);
};

const cancelEditRows = (e) => {
  createRow(data);
};

const createButtons = (type) => {
  const buttonEl = document.createElement("button");
  buttonEl.innerText = type;
  buttonEl.classList.add("btn");
  buttonEl.addEventListener("click", (e) => {
    manageEvents(type, e);
  });
  return buttonEl;
};

const createInput = (type, name, content, parent) => {
  const element = document.createElement(type);
  element.setAttribute("name", name);
  element.value = content;
  parent.appendChild(element);
};

const handleLoading = () => {
  console.log(isLoading);
  const spinner = document.querySelector(".spinner-4");
  if (isLoading) {
    return spinner.classList.remove("hidden");
  }
  return spinner.classList.add("hidden");
};

const getData = async () => {
  isLoading = true;
  handleLoading();
  const users = await (
    await fetch("https://apple-seeds.herokuapp.com/api/users/")
  ).json();
  const allData = await Promise.all(
    users.map(async (u, i) => {
      const userDetail = await fetch(
        `https://apple-seeds.herokuapp.com/api/users/${u.id}`
      );
      const extra = await userDetail.json();
      return {
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        capsule: u.capsule,
        age: extra.age,
        city: extra.city,
        gender: extra.gender,
        hobby: extra.hobby,
      };
    })
  );
  isLoading = false;
  handleLoading();
  data = [...allData];
  displayData();
};
getData();

const search = (e) => {
  const value = e.target.value.toLowerCase();
  const category = document.querySelector("select").value;
  const filteredData = [...data].filter((el) => {
    const property = String(el[category]).toLowerCase();
    return property.startsWith(value);
  });
  createRow(filteredData);
};

const inputSearch = document.querySelector("input[type='search']");
inputSearch.addEventListener("keyup", (e) => search(e));
