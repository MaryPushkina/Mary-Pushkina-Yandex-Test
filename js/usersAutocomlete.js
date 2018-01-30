//заполнение списка пользователей 

function createAutocomplete() {
    var dataList = document.getElementById('list_users');
    var input = document.getElementById('inputusers');
    var list_button_users = document.getElementById('list_button_users');
    var jsonOptions = JSON.parse('[' +
        '{"id":"1","login": "Лекс Лютор", "homeFloor": "7 этаж","icon": "img/assets/Man1.svg"},' +
        '{"id":"2","login": "Томас Андерсон","homeFloor": "2 этаж","icon": "img/assets/luke_skywalker.svg"},' +
        '{"id":"3","login": "Дарт Вейдер","homeFloor": "1 этаж","icon": "img/assets/darth-vader.svg"},' +
        '{"id":"4", "login": "Кларк Кент","homeFloor": "2 этаж","icon": "img/assets/Man2.svg"}]');
    // Loop over the JSON array.
    jsonOptions.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item.login;
        // Add the <option> element to the <datalist>.
        dataList.appendChild(option);
        option.dataset.icon = item.icon;
        option.dataset.idUser = item.id;
        option.setAttribute('class', "option_user");
        option.setAttribute('selected', "selected");

    });
};
setTimeout(createAutocomplete, 1);

function dialog_delete_meet() {
    swal({
        icon: "img/assets/emoji1.svg",
        title: 'Встреча будет удалена безвозвратно',

        buttons: {
            cancel: "Отмена",
            true: "Удалить",
        }
    });
}

//диалоговое окно создать встречу 
function dialog_create_meet() {
    var dateText = document.createElement("div");
    var dateTextp1 = document.createElement("p");
    var dateTextp2 = document.createElement("p");
    dateTextp1.appendChild(document.createTextNode('14 декабря, 15:00-17:00'));
    dateTextp2.appendChild(document.createTextNode('Готэм 4 этаж'));
    dateText.appendChild(dateTextp1);
    dateText.appendChild(dateTextp2);

    swal({
        icon: "img/assets/emoji2.svg",
        title: 'Встреча создана',
        // text: dateText,
        content: dateText,
        buttons: {
            true: "Хорошо",
        }
    });
}

//выбор пользователя
function selectedUser() {
    var list_button_users = document.getElementById('list_button_users');
    var val = document.getElementById("inputusers").value;
    var opts = document.getElementById('list_users').childNodes;
    for (var i = 0; i < opts.length; i++) {


        if (opts[i].nodeType != 1) continue;
        var fl = true;
        if (opts[i].value === val) {

            if (list_button_users.hasChildNodes) {
                var btnusers = list_button_users.childNodes;
                for (var j = 0; j < btnusers.length; j++) {
                    if (btnusers[j].nodeType != 1) continue;
                    if (btnusers[j].dataset.idUser === opts[i].dataset.idUser) {
                        fl = false;
                        break;
                    }
                }
            }
            if (fl) {
                var userButton = document.createElement('div');
                userButton.dataset.userName = opts[i].value;
                userButton.setAttribute('class', "users_btn chip");
                userButton.dataset.idUser = opts[i].dataset.idUser;
                userButton.appendChild(document.createTextNode(opts[i].value));
                var closeUser = document.createElement('img');
                closeUser.setAttribute('src', 'img/assets/remove.svg');
                closeUser.setAttribute('class', 'closeImg');
                userButton.appendChild(closeUser);
                var imgUser = document.createElement('img');
                imgUser.setAttribute('src', opts[i].dataset.icon);
                imgUser.setAttribute('class', 'chipIcon');
                userButton.appendChild(imgUser);
                userButton.addEventListener("click", function() {
                    list_button_users.removeChild(userButton)
                });

                list_button_users.appendChild(userButton);
                break;
            }
        }
    }
}