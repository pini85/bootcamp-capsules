const data = [];

const displayData = async () => {
  createHeaders(data);
  createRow(data);
  //   createButtons(data);
};
const createHeaders = (users) => {
  const container = document.querySelector(".container");
  const headerEl = document.createElement("div");
  headerEl.classList.add("header");

  const headers = Object.keys(users[0]);
  headers.forEach((header) => {
    createElement("div", "header-child", header, headerEl);
  });
  container.appendChild(headerEl);
};
const createRow = (users) => {
  const container = document.querySelector(".container");
  users.forEach((user) => {
    const rowContainerEl = document.createElement("div");
    rowContainerEl.classList.add("row");

    createElement("div", "row-child", user.id, rowContainerEl);
    createElement("div", "row-child", user.firstName, rowContainerEl, user.id);
    createElement("div", "row-child", user.lastName, rowContainerEl, user.id);
    createElement("div", "row-child", user.capsule, rowContainerEl, user.id);
    createElement("div", "row-child", user.age, rowContainerEl, user.id);
    createElement("div", "row-child", user.city, rowContainerEl, user.id);
    createElement("div", "row-child", user.gender, rowContainerEl, user.id);
    createElement("div", "row-child", user.hobby, rowContainerEl, user.id);
    createButtons(rowContainerEl, "edit");
    createButtons(rowContainerEl, "delete");
    container.appendChild(rowContainerEl);
  });
};

const createButtons = (parent, type, editActive) => {
  console.count();
  const buttonEditEl = document.createElement("button");
  buttonEditEl.textContent = type;
  buttonEditEl.addEventListener(
    "click",
    editActive ? confirmEditRows : editRows
  );

  //   const buttonDeleteEl = document.createElement("button");
  //   buttonDeleteEl.textContent = "Delete";
  parent.appendChild(buttonEditEl);
  //   parent.appendChild(buttonDeleteEl);
};

const editRows = (e) => {
  const rows = e.target.parentNode.children;
  const parent = e.target.parentNode;

  [...rows].forEach((el) => {
    if (el.tagName === "BUTTON") {
      el.remove();
      return createButtons(parent, true);
    }
    const text = el.textContent;
    el.innerHTML = "";

    createElement("input", "x", text, parent);
  });
};
const confirmEditRows = () => {
  console.log("yup");
};

const createElement = (type, className, content, parent) => {
  const element = document.createElement(type);
  element.classList.add(className);
  if (type === "input") {
    element.value = content;
    console.log(element);
  } else element.textContent = content;

  parent.appendChild(element);
};
const addEventListeners = (el, type, fn) => {};

const getData = async () => {
  const users = await (
    await fetch("https://apple-seeds.herokuapp.com/api/users/")
  ).json();
  await Promise.all(
    users.map(async (u, i) => {
      const userDetail = await fetch(
        `https://apple-seeds.herokuapp.com/api/users/${u.id}`
      );
      const extra = await userDetail.json();
      data.push({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        capsule: u.capsule,
        age: extra.age,
        city: extra.city,
        gender: extra.gender,
        hobby: extra.hobby,
      });
    })
  );
  displayData();
};
getData();
