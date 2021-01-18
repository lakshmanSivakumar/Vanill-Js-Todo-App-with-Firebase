const form = document.querySelector('form');
const listTodosUL = document.querySelector('.listTodos ul');
const showCompletedH3 = document.querySelector('.showCompleted h3');
const showCompletedUL = document.querySelector('.showCompleted ul');
const h2 = document.querySelector('h2');
const h4 = document.querySelector('h4');

const completed = [];

form.addEventListener('submit', addTodo);

function addTodo (e) {
    e.preventDefault();
    const html = `  <li>
                        <div class="todo">
                            <p>${form.todo.value}</p>
                            <img src="images/remove.png" alt="remove">
                        </div>
                    </li>`
    listTodosUL.innerHTML += html;
    form.todo.value = '';
    const array = Array.from(listTodosUL.children);
    if(array.length > 0) {
        h2.style.display = 'none';
    }
}

listTodosUL.addEventListener('click', removeTodo);

function removeTodo (e) {
    if(e.target.tagName === 'IMG') {
        e.target.parentElement.parentElement.remove();
        completed.push(e.target.previousElementSibling);
    }
    const array = Array.from(listTodosUL.children);
    if(array.length == 0) {
        h2.style.display = 'block';
    }

    if(e.target.tagName === 'P') {
        e.target.classList.toggle("lineThrough");
    }
}

showCompletedH3.addEventListener('click', showCompletedTodos);

function showCompletedTodos() {
    showCompletedUL.classList.toggle("showCompletedStyle");
    let html = ``;
    for(let i=completed.length-1; i>=0; i--) {
        html += `  <li>
                        <div class="todo">
                            <p>${completed[i].textContent}</p>
                            <img src="images/check.png" alt="checkmark">
                        </div>
                    </li>`
    }
    showCompletedUL.innerHTML = html;
    
}