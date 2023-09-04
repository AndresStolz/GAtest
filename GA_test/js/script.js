const disabledArea = document.querySelector('.disabled').classList;
const inputEdit = document.querySelector('.input-edit');
const buttonCreate = document.querySelector('.add-row');
const buttonRemove = document.querySelector('.remove-row');
const buttonEdit = document.getElementById('button-edit');
const buttonDownload = document.getElementById('downloadexcel');
const buttonSelectEven = document.getElementById('select-even');
const buttonSelectOdd = document.getElementById('select-odd');
const buttonDeleteFirst = document.getElementById('delete-first');
const buttonDeleteLast = document.getElementById('delete-last');
const buttonComplete = document.getElementById('complete');

let activeCell;
let iter;
let key;
let array = new Array();
// localStorage.clear();
function getAllCells() {
  let cells = document.querySelectorAll(".table-cell");
  for (let cell of cells) {
    cell.addEventListener('click', e => {
      activeCell = cell;
      chooseCell(cell);
      let cellValue = cell.innerHTML;
      inputEdit.value = cellValue;
      disabledArea.remove('disabled');
    })
  }
}
getAllCells();

function getNumberOfElements() {
  array = [-1];
  for (let index = 0; index < localStorage.length; index++) {
    array.push(JSON.parse(localStorage.key(index)));
    // console.log(index);
  }
  key = Math.max(...array);
  // console.log(key);
}
getNumberOfElements();

function chooseCell(cell) {
  let actives = document.getElementsByClassName('active');
  for (let active of actives) {
    active.classList.remove('active');
  }
  cell.classList.add('active')
}

function valueEdit(cell) {
  let valueEdited = document.querySelector('.input-edit').value;
  // console.log(valueEdited);
  cell.innerHTML = valueEdited;
}

// Рендеринг всех записей
function renderAllRows() {
  for (let index = 0; index < key + 2; index++) {
    if (localStorage.getItem(index)) {
      let temp = JSON.parse(localStorage.getItem(index));
      renderRow(temp);
      continue;
    } else continue;
  }
  getAllCells();
}

renderAllRows();
//Добавление записи

const localStorageRow = new Object();

function addRowToLocalStorage(inputName, inputType, inputPriority) {
  localStorageRow.taskName = inputName;
  localStorageRow.responsible = inputType;
  localStorageRow.priority = inputPriority;
  localStorageRow.status = "undone";

  key += 1;
  localStorage.setItem(key, JSON.stringify(localStorageRow));
  renderRow(localStorageRow);
}

function renderRow(temp) {
  let tableBody = document.querySelector('.tbody');
  if (temp.status == 'undone') {
    tableBody.insertAdjacentHTML(
      'afterbegin',
      `<tr class="table-row">
        <td class="table-cell">${temp.taskName}</td>
        <td class="table-cell">${temp.responsible}</td>
        <td class="table-cell">${temp.priority}</td>
        </tr>`
    );
  } else if (temp.status == 'done') {
    tableBody.insertAdjacentHTML(
      'beforeend',
      `<tr class="table-row">
        <td class="table-cell">${temp.taskName}</td>
        <td class="table-cell">${temp.responsible}</td>
        <td class="table-cell">${temp.priority}</td>
        </tr>`
    );
    let tbodyLastElement = tableBody.lastElementChild;
    tbodyLastElement.firstElementChild.style.textDecoration = 'line-through';
  }
}


// Удаление записи

function removeRowFromLocalStorage(row) {
  for (let index = 0; index < key + 2; index++) {
    if (localStorage.getItem(index)) {
      let temp = JSON.parse(localStorage.getItem(index));
      if (temp.taskName == row.children[0].innerHTML) {
        localStorage.removeItem(index);
        break;
      }
    } else continue;
  }
  removeRow(row);
  getNumberOfElements();
}

function removeRow(row) {
  row.remove();
}

// Изменение статуса задачи
function setComplete() {
  console.log(activeCell);
  let row = activeCell.parentNode;
  let tbody = document.querySelector('.tbody');
  tbody.insertAdjacentHTML(
    'beforeend',
    `<tr class="table-row">
      <td class="table-cell">${row.children[0].innerHTML}</td>
      <td class="table-cell">${row.children[1].innerHTML}</td>
      <td class="table-cell">${row.children[2].innerHTML}</td>
      </tr>`
  );
  getNumberOfElements();
  let tbodyLastElement = tbody.lastElementChild;
  tbodyLastElement.firstElementChild.style.textDecoration = 'line-through';

  for (let index = 0; index < key + 2; index++) {
    if (localStorage.getItem(index)) {
      let temp = JSON.parse(localStorage.getItem(index));
      if (temp.taskName == row.children[0].innerHTML) {
        updateStatus(index);
        break;
      }
    } else continue;
  }

  removeRow(row);
  getAllCells();
}

function updateStatus(taskNumber) {
  let temp = JSON.parse(localStorage.getItem(taskNumber));
  temp.status = 'done';
  localStorage.setItem(taskNumber, JSON.stringify(temp));
}

// Четные и нечетные
function cleanAll() {
  let tableRows = document.getElementsByClassName('table-row');
  iter = 0;
  do {
    tableRows[iter].style.backgroundColor = 'rgb(255, 255, 255)';
    iter++;
  } while (typeof tableRows[iter] != "undefined");
}

function selectEven() {
  cleanAll();
  let tableRows = document.getElementsByClassName('table-row');
  iter = 1;
  do {
    tableRows[iter].style.backgroundColor = 'rgba(0, 0, 227, 0.2)';
    iter += 2;
  } while (typeof tableRows[iter] != "undefined");
  iter = 0;
}

function selectOdd() {
  cleanAll();
  let tableRows = document.getElementsByClassName('table-row');
  iter = 0;
  do {
    tableRows[iter].style.backgroundColor = 'rgba(227, 0, 0, 0.2)';
    iter += 2;
  } while (typeof tableRows[iter] != "undefined");
  iter = 0;
}
//  Удаление первого и последнего
function deleteFirstElement() {
  let tbody = document.querySelector('.tbody');
  removeRowFromLocalStorage(tbody.firstElementChild);
}

function deleteLastElement() {
  let tbody = document.querySelector('.tbody');
  removeRowFromLocalStorage(tbody.lastElementChild);
}


// Кнопки
buttonEdit.addEventListener('click', e => {
  valueEdit(activeCell);
})

buttonCreate.addEventListener('click', e => {
  let inputName = document.querySelector('.input-name');
  let inputType = document.querySelector('.input-type');
  let inputAge = document.querySelector('.input-age');
  addRowToLocalStorage(inputName.value, inputType.value, inputAge.value);
  getAllCells();
})

buttonRemove.addEventListener('click', e => {
  if (activeCell){
  let row = activeCell.parentNode;
  removeRowFromLocalStorage(row);
  } else {alert("Выберите запись для удаления")}
})

buttonSelectEven.addEventListener('click', e => {
  selectEven();
})

buttonSelectOdd.addEventListener('click', e => {
  selectOdd();
})

buttonDeleteFirst.addEventListener('click', e => {
  deleteFirstElement();
})

buttonDeleteLast.addEventListener('click', e => {
  deleteLastElement();
})

buttonComplete.addEventListener('click', e => {
  if (activeCell){
    setComplete();
    }
  activeCell = null;
})

buttonDownload.addEventListener('click', e => {
  let table2excel = new Table2Excel();
  table2excel.export(document.querySelectorAll('#table'));
})




