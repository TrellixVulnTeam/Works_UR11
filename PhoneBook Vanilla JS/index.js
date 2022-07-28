(() => {
    const openButton = document.querySelector('.add-btn');
    const modalDel = document.querySelector('.modal-del');
    const modalDialog = document.querySelector('.modal-dialog-del');
    const result = document.getElementById('crm-app');
    const headInput = document.querySelector('.header__input');
    const sortBtns = document.querySelectorAll('.header-item');
    let sortStatus = true;

    function spinArrowUp(data) {
        let itemAll = document.querySelectorAll(`.header-item`);
        let itemIt = document.querySelector(`.header-item[data-button="${data}"]`);

        itemAll.forEach(item => {
            item.classList.remove('from-up');
        });
        console.log(itemIt);
        itemIt.classList.add('from-up');
    }

    function spinArrowDown(data) {
        let itemAll = document.querySelectorAll(`.header-item`);
        let itemIt = document.querySelector(`.header-item[data-button="${data}"]`);

        itemAll.forEach(item => {
            item.classList.remove('from-up');
        });
        console.log(itemIt);
        itemIt.classList.remove('from-up');
    }

    async function sortOfAll(clickData) {
        const response = await fetch(`http://localhost:3000/api/clients`);
        const data = await response.json();
        // const regex = /[-.:T\s]/;
        console.log(clickData);
        if (clickData == 'createdAt' || clickData == 'updatedAt') {
            if (sortStatus) {
                data.sort(function(a, b) {
                    return new Date(a[clickData]) - new Date(b[clickData]);
                });
                spinArrowUp(clickData);
                sortStatus = false;
            } else {
                data.sort(function(a, b) {
                    return new Date(b[clickData]) - new Date(a[clickData]);

                });
                spinArrowDown(clickData);
                sortStatus = true;
            }
        } else {
            if (sortStatus) {
                data.sort((a, b) => a[clickData] > b[clickData] ? 1 : -1);
                sortStatus = false;
                spinArrowUp(clickData);
            } else {
                data.sort((a, b) => b[clickData] > a[clickData] ? 1 : -1);
                spinArrowDown(clickData);
                sortStatus = true;
            }
        }

        return data;
    };

    sortBtns.forEach(btn => {
        btn.addEventListener('click', async function() {
            if (this.dataset.button == undefined) return;
            result.innerHTML = '';
            let clickData = await sortOfAll(this.dataset.button);
            console.log(clickData);
            drawClientsList(clickData);
            openDeleteModal();
            openEditModal();
        })
    });
    //добавить клиента в базу
    async function addClient(obj) {
        const response = await fetch('http://localhost:3000/api/clients', {
            method: 'POST',
            body: JSON.stringify({
                name: obj.name,
                surname: obj.surname,
                lastName: obj.lastName,
                contacts: obj.contacts,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = response.json();
        return { data: await data, response: response.status };
    };

    //обновить данные клиента
    async function updateClient(obj, id) {
        const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                name: obj.name,
                surname: obj.surname,
                lastName: obj.lastName,
                contacts: obj.contacts,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = response.json();
        return { data: await data, response: response.status };
    }

    //поиск клинтов по вводу
    async function findClients(string) {
        const response = await fetch(`http://localhost:3000/api/clients?search=${string}`);
        const data = await response.json();
        return data;
    }

    //получить данные клиента по id
    async function getTargetClient(id) {
        const response = await fetch(`http://localhost:3000/api/clients/${id}`);
        const data = await response.json();
        return data;
    }

    //удалить клиента из базы
    async function sendDeleteClient(id) {
        const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
            method: 'DELETE',

        });
    }

    //получить данные всех клиентов с базы
    async function getClients() {
        const response = await fetch(`http://localhost:3000/api/clients`);
        const data = await response.json();
        return { data: await data, response: response.status };
    }

    //получить информацию о клиенте с формы
    function getDataClient() {
        let surname = document.querySelector('.modal__input-surname');
        let name = document.querySelector('.modal__input-name');
        let lastName = document.querySelector('.modal__input-lastname');
        let allContacts = document.querySelectorAll('.contact__input');
        let allTypeContacts = document.querySelectorAll('.contact__select');
        let contactsArr = [];

        allTypeContacts.forEach(element => {
            let obj = {
                type: element.value,
            }
            contactsArr.push(obj);
        })
        allContacts.forEach(function(element, i) {
            contactsArr[i].value = element.value
        })

        let dataClient = {
            name: name.value,
            surname: surname.value,
            lastName: lastName.value,
            contacts: contactsArr,
        };

        return dataClient;
    }

    //изменить формат отображения времени
    function getTimeFormat(string) {
        const regex = /[-.:T]/;
        let arr = string.split(regex);
        [arr[0], arr[1], arr[2]] = [arr[2], arr[1], arr[0]];
        let timeString = `${arr[0]}.${arr[1]}.${arr[2]} <span>${arr[3]}:${arr[4]}</span>`;
        return timeString;
    }

    //нарисовать список клиентов
    function drawClientsList(arr) {
        arr.forEach(function(elem) {
            const li = document.createElement('li');
            const div = document.createElement('div');
            const contactsWrap = document.createElement('div');

            div.classList.add('buttons__client');
            li.classList.add('item__client');
            contactsWrap.classList.add('wrap-contacts');

            li.setAttribute('data-id', elem.id);

            li.innerHTML = `<div class="id-client">${elem.id}</div>
                         <div class="name-client">${elem.surname} ${elem.name} ${elem.lastName}</div>
                         <div class="dateCrt-client">${getTimeFormat(elem.createdAt)}</div>
                         <div class="dateUp-client">${getTimeFormat(elem.updatedAt)}</div>`;

            li.append(contactsWrap);

            elem.contacts.forEach(contact => {
                let list = document.createElement('div');
                list.classList.add('contact-icon');
                list.setAttribute('data-type', contact.type);
                list.innerHTML = `<span class="contact-client">${contact.type}: ${contact.value}</span>`;
                contactsWrap.append(list)
            })

            div.innerHTML = `<button class="btn edit-btn" data-id=${elem.id}>Изменить</button>
                        <button class="btn del-btn" data-id=${elem.id}>Удалить</button>`;

            li.append(div);
            result.append(li);
        })
    }

    function drawError(obj) {
        const modalErr = document.querySelector('.modal__errors');
        modalErr.innerHTML = '';

        if (typeof obj == 'string') {
            let item = document.createElement('div');
            item.classList.add('modal-error');

            item.innerHTML = `<p class="text-error">Что-то пошло не так...</p>`;

            modalErr.append(item);
            return
        }

        obj.data.errors.forEach(error => {
            let element = document.createElement('div');
            element.classList.add('modal-error');

            element.innerHTML = `<p class="text-error">${error.message}</p>`;

            modalErr.append(element);
        });
    }

    //нарисовать окно удаления клиента
    function drawDelModalInput(string) {
        const divContent = document.createElement('div');
        divContent.classList.add('modal-content');

        divContent.innerHTML = `<div class="head-del-modal"><h5 class="modal-title">Удалить клиента</h5>
                                <button class="btn cross__btn"></button>
                                </div>
                                <p class="modal-text">Вы действительно хотите удалить данного клиента?</p>
                                <button class="btn delete-modal-btn" data-id=${string}>Удалить</button>
                                <button class="btn back-modal-btn">Отмена</button>`;
        modalDialog.append(divContent);
    }

    function drawEditModalInput(obj) {
        console.log(obj);
        const div = document.createElement('div');
        const divBtn = document.createElement('div');
        const divCont = document.createElement('div');

        divCont.classList.add('modal__contacts-up');
        divBtn.classList.add('modal__btns');
        div.classList.add('modal-content');
        div.innerHTML = `<div class="head-edit-modal">
                        <h5 class="modal-title">Изменить данные</h5>
                        <p class="modal-id">ID:${obj.id}</p>
                        <button class="btn cross__btn"></button>
                      </div>
                      <label class="modal__label" for="modal__input"><input type="text" class="modal__input modal__input-surname" value=${obj.surname}>Фамилия*</label>
                      <label class="modal__label" for="modal__input"><input type="text" class="modal__input modal__input-name" value=${obj.name}>Имя*</label>
                      <label class="modal__label" for="modal__input"><input type="text" class="modal__input modal__input-lastname" value=${obj.lastName}>Отчество</label>`;
        obj.contacts.forEach(contact => {
            let list = document.createElement('div');
            list.classList.add('contacts-client-modal');
            list.setAttribute('data-type', contact.type);
            list.innerHTML = `<select class="contact__select" name="hero">
                              <option selected value=${contact.type}>${contact.type}</option>
                              <option value="Email">Email</option>
                              <option value="Facebook">Facebook</option>
                              <option value="VK">VK</option>
                              <option value="Другое">Другое</option>
                              <option value="Телефон">Телефон</option>
                            </select>
                            <input type="text" class="contact__input" placeholder="Введите данные контакта" value=${contact.value}>
                            <button class="btn cancel-modal-btn"></button>`;
            divCont.append(list);
        })

        divBtn.innerHTML = `<button class="btn up-contact-btn">Добавить контакт</button>
                            <div class="modal__errors"></div>
                            <button class="btn update-btn" data-id=${obj.id}>Сохранить</button>
                            <button class="btn delete-btn" data-id=${obj.id}>Удалить клиента</button>`;

        div.append(divCont);
        div.append(divBtn);
        modalDialog.append(div);
        if (obj.contacts.length >= 10) document.querySelector('.up-contact-btn').classList.add('hide');
    }

    function drawAddModalInput() {
        const div = document.createElement('div');
        const divBtn = document.createElement('div');
        const divCont = document.createElement('div');

        divCont.classList.add('modal__contacts-up');
        divBtn.classList.add('modal__btns');
        div.classList.add('modal-content');
        div.innerHTML = `<div class="head-add-modal">
                      <h5 class="modal-title">Новый клиент</h5>
                      <button class="btn cross__btn"></button>
                    </div>
                    <label class="modal__label" for="modal__input"><input type="text" class="modal__input modal__input-surname">Фамилия*</label>
                    <label class="modal__label" for="modal__input"><input type="text" class="modal__input modal__input-name">Имя*</label>
                    <label class="modal__label" for="modal__input"><input type="text" class="modal__input modal__input-lastname">Отчество</label>
                    <div class="modal__contacts-up"></div>`;

        divBtn.innerHTML = `<button class="btn up-contact-btn">Добавить контакт</button>
                          <div class="modal__errors"></div>
                          <button class="btn save-btn">Сохранить</button>
                          <button class="btn cancel-btn">Отмена</button>`;

        div.append(divBtn);
        modalDialog.append(div);
    }

    function defaultSelect() {
        const elements = document.querySelectorAll('.contact__select');
        elements.forEach(element => {
            const choices = new Choices(element, {
                allowHTML: true,
                searchEnabled: false,
                itemSelectText: '',
            });
        });
    };

    function defaultSelectOne() {
        const elements = document.querySelectorAll('.contact__select');
        const lastElem = elements[elements.length - 1];
        const choices = new Choices(lastElem, {
            allowHTML: true,
            searchEnabled: false,
            itemSelectText: '',
        });
    };

    function drawModalInputUp() {
        const div = document.createElement('div');
        const modal = document.querySelector('.modal__contacts-up');
        div.classList.add('contacts-client-modal');
        div.innerHTML = `<select class="contact__select" name="hero">
                          <option selected value="Телефон">Телефон</option>
                          <option value="Email">Email</option>
                          <option value="Facebook">Facebook</option>
                          <option value="VK">VK</option>
                          <option value="Другое">Другое</option>
                         </select>
                         <input type="text" class="contact__input" placeholder="Введите данные контакта">
                         <button class="btn cancel-modal-btn"></button>`;
        modal.append(div);
        const deleteBtn = document.querySelectorAll('.cancel-modal-btn');
        deleteBtn[deleteBtn.length - 1].addEventListener('click', function() {
            this.parentElement.remove();
        });
        defaultSelectOne();
    }

    //добавление функции удаления клиента для всех клиентов
    function openDeleteModal() {
        const delClientBtn = document.querySelectorAll('.del-btn');
        delClientBtn.forEach(button => {
            button.addEventListener('click', () => {
                modalDialog.innerHTML = '';
                modalDel.style.display = 'block';
                drawDelModalInput(button.dataset.id);
                document.querySelector('.delete-modal-btn').addEventListener('click', async() => {
                    modalDel.style.display = 'none';
                    await sendDeleteClient(button.dataset.id);
                    loadPage();
                })
                document.querySelector('.back-modal-btn').addEventListener('click', () => {
                    modalDel.style.display = 'none';
                    modalDialog.innerHTML = '';
                });
            });
        })
    }

    function openEditModal() {
        const editClientBtn = document.querySelectorAll('.edit-btn');
        editClientBtn.forEach(button => {
            button.addEventListener('click', async() => {
                modalDialog.innerHTML = '';
                modalDel.style.display = 'block';
                let clientData = await getTargetClient(button.dataset.id);
                drawEditModalInput(clientData);
                defaultSelect();
                document.querySelector('.cross__btn').addEventListener('click', () => {
                    modalDel.style.display = 'none';
                    modalDialog.innerHTML = '';
                });

                document.querySelectorAll('.cancel-modal-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        this.parentElement.remove();
                    });
                });
                document.querySelector('.up-contact-btn').addEventListener('click', function() {
                    let contactList = document.querySelectorAll('.contacts-client-modal');
                    if (contactList.length < 10) {
                        drawModalInputUp();
                    } else {
                        return document.querySelector('.up-contact-btn').classList.add('hide');
                    }
                });
                document.querySelector('.update-btn').addEventListener('click', async() => {
                    let dataObj = getDataClient();
                    const answer = await updateClient(dataObj, button.dataset.id);
                    console.log(answer);
                    if (answer.response == 422 || answer.response == 500) {
                        drawError(answer);
                        return;
                    } else if (answer.response == 200 || answer.response == 201) {
                        loadPage();
                        modalDel.style.display = 'none';
                    } else {
                        drawError(answer);
                    }
                });
                document.querySelector('.delete-btn').addEventListener('click', async() => {
                    modalDel.style.display = 'none';
                    await sendDeleteClient(button.dataset.id);
                    loadPage();
                });
            });
        })
    }

    function openAddModal() {
        openButton.addEventListener('click', async() => {
            modalDialog.innerHTML = '';
            modalDel.style.display = 'block';
            drawAddModalInput();
            defaultSelect();
            document.querySelector('.cross__btn').addEventListener('click', () => {
                modalDel.style.display = 'none';
                modalDialog.innerHTML = '';
            });

            document.querySelectorAll('.cancel-modal-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    this.parentElement.remove();
                });
            });

            document.querySelector('.up-contact-btn').addEventListener('click', function() {
                let contactList = document.querySelectorAll('.contacts-client-modal');
                if (contactList.length < 10) {
                    drawModalInputUp();
                } else {
                    return document.querySelector('.up-contact-btn').classList.add('hide');
                }
            });

            document.querySelector('.save-btn').addEventListener('click', async() => {
                let dataObj = getDataClient();
                const answer = await addClient(dataObj);
                if (answer.response == 422 || answer.response == 500) {
                    drawError(answer);
                    return;
                } else if (answer.response == 200 || answer.response == 201) {
                    loadPage();
                    modalDel.style.display = 'none';
                } else {
                    drawError(answer);
                }
            });

            document.querySelector('.cancel-btn').addEventListener('click', () => {
                modalDel.style.display = 'none';
                modalDialog.innerHTML = '';
            });
        })
    };

    //закрытие окон
    function closeModalWindow(target) {
        target.addEventListener('click', event => {
            if (event._isClickWithinModal) return;
            target.style.display = 'none';
            modalDialog.innerHTML = '';
        });
        target.querySelector(`.${target.children[0].className}`).addEventListener('click', event => {
            event._isClickWithinModal = true;
        })
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                target.style.display = 'none';
                modalDialog.innerHTML = '';
            }
        });
    }

    //загрузить приложение
    async function loadPage() {
        result.innerHTML = '';
        modalDialog.innerHTML = '';
        let getData = await getClients();
        console.log(getData);
        drawClientsList(getData.data);

        headInput.addEventListener('keyup', () => {
            let timer = setTimeout(async() => {
                let string = headInput.value;
                console.log(string);
                let obj = await findClients(string.toString());
                result.innerHTML = '';
                drawClientsList(obj);
                openEditModal();
                openDeleteModal();
            }, 300);

            headInput.addEventListener('keyup', () => {
                clearTimeout(timer);
            });
        });

        openAddModal();
        openDeleteModal();
        openEditModal();
    }

    // closeModalWindow(modal);
    closeModalWindow(modalDel);
    loadPage();
    sortOfAll('id');

})();