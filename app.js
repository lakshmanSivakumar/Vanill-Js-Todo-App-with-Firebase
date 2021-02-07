const menuIcon = document.querySelector('.menuIcon');
const menu = document.querySelector('.menu');
const ul = document.querySelector('ul');

function slide() {
    if(menuIcon.getAttribute('src') === './images/hamburger.png') {
        menuIcon.src = './images/close.png';
        menu.style.display = 'flex';
    } else {
        menuIcon.src = './images/hamburger.png';
        menu.style.display = 'none';
    }
}

menu.addEventListener('click', filterTodos);

//filter todos
function filterTodos(e) {
    if(e.target.textContent === 'Completed Todos') {
        const allLi = document.querySelectorAll('li');
        let html = '';
        db.collection('todos').where('check', '==', 1).get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                allLi.forEach(li => {
                    if(li.getAttribute('data-id') === doc.id) {
                        html += li.outerHTML;
                    }
                })
            });
            ul.innerHTML = html;
        }).catch( err => {
            console.log(err);
        });    
    }
    else if(e.target.textContent === 'Incomplete Todos') {
        const allLi = document.querySelectorAll('li');
        let html = '';
        db.collection('todos').where('check', '==', 0).get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                allLi.forEach(li => {
                    if(li.getAttribute('data-id') === doc.id) {
                        html += li.outerHTML;
                    }
                })
            });
            ul.innerHTML = html;
        }).catch( err => {
            console.log(err);
        });    
    }
    else if(e.target.textContent === 'All Todos') {
        let html = '';
        db.collection('todos').get().then(snapshot => {
            snapshot.docs.forEach( doc => {
                if(doc.data().check) {
                    html += `<li class="todo" data-id=${doc.id}>
                                <div class="todoContent">
                                    <p class="lineThrough">${doc.data().todo}</p>
                                    <p>Created at - ${doc.data().created_at}</p>
                                </div>
                                <div class="icons">
                                    <img src="./images/trash.png" alt="trash">
                                    <img src="./images/edit.png" alt="edit">
                                    <img src="./images/check-mark.png" alt="check/uncheck">
                                </div>
                            </li>`
                }
                else {
                    html += `<li class="todo" data-id=${doc.id}>
                                <div class="todoContent">
                                    <p>${doc.data().todo}</p>
                                    <p>Created at - ${doc.data().created_at}</p>
                                </div>
                                <div class="icons">
                                    <img src="./images/trash.png" alt="trash">
                                    <img src="./images/edit.png" alt="edit">
                                    <img src="./images/uncheck-mark.png" alt="check/uncheck">
                                </div>
                            </li>`
                }
                ul.innerHTML = html;
            });
        }).catch( err => {
                console.log(err);
            });    
    }
}

const addForm = document.querySelector('.addForm');

addForm.addEventListener('submit', addTodo);

function addTodo(e) {
    e.preventDefault();
    const now = new Date();
    let inputVal = addForm.newTodo.value.trim();
    if(inputVal === '') {
        alert('Please enter a valid Todo');
    }
    else {
        const newTodo = {
            todo: inputVal,
            created_at: firebase.firestore.Timestamp.fromDate(now),
            check: 0
        }
        addForm.reset();
        db.collection('todos').add(newTodo).then( () => {
            console.log('todo added');
        }).catch( err => {
            console.log(err);
        });
    }
}

//realtime listener
db.collection('todos').onSnapshot( snapshot => {
    snapshot.docChanges().forEach(change => {
            changeUI(change, change.doc.id);
    })
});

function changeUI(change, id) {
    if(change.type === 'added') {
        let todo = change.doc.data().todo;
        let created_at = change.doc.data().created_at.toDate();
        let check = change.doc.data().check;
        let html = '';
        if(check) {
            html = `<li class="todo" data-id=${id}>
                        <div class="todoContent">
                            <p class="lineThrough">${todo}</p>
                            <p>Created at - ${created_at}</p>
                        </div>
                        <div class="icons">
                            <img src="./images/trash.png" alt="trash">
                            <img src="./images/edit.png" alt="edit">
                            <img src="./images/check-mark.png" alt="check/uncheck">
                        </div>
                    </li>`
        }
        else {
            html = `<li class="todo" data-id=${id}>
                        <div class="todoContent">
                            <p>${todo}</p>
                            <p>Created at - ${created_at}</p>
                        </div>
                        <div class="icons">
                            <img src="./images/trash.png" alt="trash">
                            <img src="./images/edit.png" alt="edit">
                            <img src="./images/uncheck-mark.png" alt="check/uncheck">
                        </div>
                    </li>`
        }
        ul.innerHTML += html;
    }
    else if(change.type === 'removed') {
        const allLi = document.querySelectorAll('li');
        allLi.forEach( li => {
            if(li.getAttribute('data-id') === id)
                li.remove();
        })
    }
    else if(change.type === 'modified') {
        const allLi = document.querySelectorAll('li');
        allLi.forEach( li => {
            if(li.getAttribute('data-id') === id) {
                if(change.doc.data().todo != li.querySelector('.todoContent').children[0].textContent) {
                    let todo = change.doc.data().todo;
                    let created_at = change.doc.data().created_at.toDate();
                    li.querySelector('.todoContent').children[0].textContent = todo;
                    li.querySelector('.todoContent').children[1].textContent = `Created at - ${created_at}`;
                }
                else {
                    if(change.doc.data().check === 1) {
                        li.querySelector('.todoContent').children[0].classList.add('lineThrough');
                        li.querySelector('.icons').children[2].src = './images/check-mark.png';
                    }
                    else {
                        li.querySelector('.todoContent').children[0].classList.remove('lineThrough');
                        li.querySelector('.icons').children[2].src = './images/uncheck-mark.png';
                    }
                }
            }
        })
    }
    else if(change === 'check') {
        const allLi = document.querySelectorAll('li');
        allLi.forEach( li => {
            if(li.getAttribute('data-id') === id) {
                li.querySelector('.todoContent').children[0].classList.add('lineThrough');
                li.querySelector('.icons').children[2].src = './images/check-mark.png';
                li.setAttribute('data-check', 1);
            }
        })
    }
    else if(change === 'unCheck') {
        const allLi = document.querySelectorAll('li');
        allLi.forEach( li => {
            if(li.getAttribute('data-id') === id) {
                li.querySelector('.todoContent').children[0].classList.remove('lineThrough');
                li.querySelector('.icons').children[2].src = './images/uncheck-mark.png';
                li.setAttribute('data-check', 0);
            }
        })
    }
}

ul.addEventListener('click', deleteEditCheck);

function deleteEditCheck(e) {
    if(e.target.tagName === 'IMG' && e.target.getAttribute('src') === './images/trash.png') {
        //delete todo
        const targetId = e.target.parentElement.parentElement.getAttribute('data-id');
        db.collection('todos').doc(targetId).delete().then( () => {
            console.log('todo deleted');
        }).catch( err => {
            console.log(err);
        });
    } 
    else if (e.target.tagName === 'IMG' && e.target.getAttribute('src') === './images/edit.png') {
        //update todo
        const editId = e.target.parentElement.parentElement.getAttribute('data-id');
        const currTodoVal = e.target.parentElement.previousElementSibling.children[0].textContent;

        const editTodoInput = document.querySelector('.editTodoInput');
        editTodoInput.setAttribute('value', currTodoVal);

        const editPopUp = document.querySelector('.editPopUp');
        editPopUp.style.display = 'flex';

        editPopUp.addEventListener('click', closePopUp);

        function closePopUp(e) {
            const editFormDiv = document.querySelector('.editFormDiv');
            if(e.target.tagName === 'IMG' || !editFormDiv.contains(e.target))
                editPopUp.style.display = 'none';
        }

        const editForm = document.querySelector('.editForm');

        editForm.addEventListener('submit', editTodo);
        function editTodo(e) {
            e.preventDefault();
            const editTodoVal = editForm.editTodo.value.trim();
            if(editTodoVal === '') {
                alert('Please enter a valid Todo');
            } 
            else {
                const now = new Date();
                db.collection('todos').doc(editId).update({ todo: editTodoVal, created_at: firebase.firestore.Timestamp.fromDate(now) }).then( () => {
                    editPopUp.style.display = 'none';
                }).catch( err => {
                    console.log(err);
                });
            }
        }
    } 
    else if(e.target.tagName === 'IMG' && e.target.getAttribute('src') === './images/uncheck-mark.png') {
        //check todo
        const id = e.target.parentElement.parentElement.getAttribute('data-id');
        db.collection('todos').doc(id).update({check: 1}).then ( () => {
            console.log('checked')
        }).catch ( err => {
            console.log(err);
        });
    }
    else if(e.target.tagName === 'IMG' && e.target.getAttribute('src') === './images/check-mark.png') {
        //uncheck todo
        const id = e.target.parentElement.parentElement.getAttribute('data-id');
        db.collection('todos').doc(id).update({check: 0}).then ( () => {
            console.log('unChecked')
        }).catch ( err => {
            console.log(err);
        });
    }
}