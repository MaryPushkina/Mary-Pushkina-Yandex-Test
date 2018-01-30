//диаграмма встреч. 
function createMeetsbtnforDiagram() {
    var text = '{"events" :[' +
        '{"id":"1",' +
        '"title":"Рассуждения о высоком",' +
        '"dateStart":"Wed Jan 24 2018 8:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"dateEnd":"Wed Jan 24 2018 23:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"room":{"id":"1","title":"Ржавый Фред","capacity":"3-6 человек"},' +
        '"users":[' +
        '{"id":"1","login": "Лекс Лютор", "homeFloor": "7 этаж"},' +
        '{"id":"2","login": "Томас Андерсон","homeFloor": "2 этаж"},' +
        '{"id":"3","login": "Дарт Вейдер","homeFloor": "1 этаж"},' +
        '{"id":"4", "login": "Кларк Кент","homeFloor": "2 этаж"}]},' +

        '{"id":"2",' +
        '"title":"Рассуждения о высоком",' +
        '"dateStart":"Wed Jan 24 2018 8:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"dateEnd":"Wed Jan 24 2018 12:15:00 GMT+0300 (RTZ 2 (зима))",' +
        '"room":{"id":"2","title":"Прачечная","capacity":"до 10 человек"},' +
        '"users":[' +
        '{"id":"1","login": "Лекс Лютор", "homeFloor": "7 этаж"},' +
        '{"id":"2","login": "Томас Андерсон","homeFloor": "2 этаж"},' +
        '{"id":"3","login": "Дарт Вейдер","homeFloor": "1 этаж"},' +
        '{"id":"4", "login": "Кларк Кент","homeFloor": "2 этаж"}]},' +

        '{"id":"3",' +
        '"title":"Рассуждения о высоком",' +
        '"dateStart":"Wed Jan 24 2018 13:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"dateEnd":"Wed Jan 24 2018 23:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"room":{"id":"2","title":"Прачечная","capacity":"до 10 человек"},' +
        '"users":[' +
        '{"id":"1","login": "Лекс Лютор", "homeFloor": "7 этаж"},' +
        '{"id":"2","login": "Томас Андерсон","homeFloor": "2 этаж"},' +
        '{"id":"3","login": "Дарт Вейдер","homeFloor": "1 этаж"},' +
        '{"id":"4", "login": "Кларк Кент","homeFloor": "2 этаж"}]},' +

        '{"id":"4",' +
        '"title":"Рассуждения о высоком",' +
        '"dateStart":"Wed Jan 24 2018 9:15:00 GMT+0300 (RTZ 2 (зима))",' +
        '"dateEnd":"Wed Jan 24 2018 12:30:00 GMT+0300 (RTZ 2 (зима))",' +
        '"room":{"id":"3","title":"Желтый дом","capacity":"до 10 человек"},' +
        '"users":[' +
        '{"id":"1","login": "Лекс Лютор", "homeFloor": "7 этаж"},' +
        '{"id":"2","login": "Томас Андерсон","homeFloor": "2 этаж"},' +
        '{"id":"3","login": "Дарт Вейдер","homeFloor": "1 этаж"},' +
        '{"id":"4", "login": "Кларк Кент","homeFloor": "2 этаж"}]},' +

        '{"id":"5",' +
        '"title":"Рассуждения о высоком",' +
        '"dateStart":"Wed Jan 24 2018 13:40:00 GMT+0300 (RTZ 2 (зима))",' +
        '"dateEnd":"Wed Jan 24 2018 16:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"room":{"id":"3","title":"Желтый дом","capacity":"до 10 человек"},' +
        '"users":[' +
        '{"id":"1","login": "Лекс Лютор", "homeFloor": "7 этаж"},' +
        '{"id":"2","login": "Томас Андерсон","homeFloor": "2 этаж"},' +
        '{"id":"3","login": "Дарт Вейдер","homeFloor": "1 этаж"},' +
        '{"id":"4", "login": "Кларк Кент","homeFloor": "2 этаж"}]},' +
        '{"id":"6",' +
        '"title":"Рассуждения о высоком",' +
        '"dateStart":"Wed Jan 24 2018 16:40:00 GMT+0300 (RTZ 2 (зима))",' +
        '"dateEnd":"Wed Jan 24 2018 17:40:00 GMT+0300 (RTZ 2 (зима))",' +
        '"room":{"id":"3","title":"Желтый дом","capacity":"до 10 человек"},' +
        '"users":[' +
        '{"id":"1","login": "Лекс Лютор", "homeFloor": "7 этаж"},' +
        '{"id":"2","login": "Томас Андерсон","homeFloor": "2 этаж"},' +
        '{"id":"3","login": "Дарт Вейдер","homeFloor": "1 этаж"},' +
        '{"id":"4", "login": "Кларк Кент","homeFloor": "2 этаж"}]},' +

        '{"id":"7",' +
        '"title":"Рассуждения о высоком",' +
        '"dateStart":"Wed Jan 24 2018 8:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"dateEnd":"Wed Jan 24 2018 23:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"room":{"id":"4","title":"Оранжевый тюльпан","capacity":"до 10 человек"},' +
        '"users":[' +
        '{"id":"1","login": "Лекс Лютор", "homeFloor": "7 этаж"},' +
        '{"id":"2","login": "Томас Андерсон","homeFloor": "2 этаж"},' +
        '{"id":"3","login": "Дарт Вейдер","homeFloor": "1 этаж"},' +
        '{"id":"4", "login": "Кларк Кент","homeFloor": "2 этаж"}]},' +

        '{"id":"8",' +
        '"title":"Рассуждения о высоком",' +
        '"dateStart":"Wed Jan 24 2018 8:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"dateEnd":"Wed Jan 24 2018 23:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"room":{"id":"5","title":"Джокер","capacity":"3-6 человек"},' +
        '"users":[' +
        '{"id":"1","login": "Лекс Лютор", "homeFloor": "7 этаж"},' +
        '{"id":"2","login": "Томас Андерсон","homeFloor": "2 этаж"},' +
        '{"id":"3","login": "Дарт Вейдер","homeFloor": "1 этаж"},' +
        '{"id":"4", "login": "Кларк Кент","homeFloor": "2 этаж"}]},' +

        '{"id":"9",' +
        '"title":"Рассуждения о высоком",' +
        '"dateStart":"Wed Jan 24 2018 8:15:00 GMT+0300 (RTZ 2 (зима))",' +
        '"dateEnd":"Wed Jan 24 2018 15:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"room":{"id":"6","title":"Мариванна","capacity":"3-6 человек"},' +
        '"users":[' +
        '{"id":"1","login": "Лекс Лютор", "homeFloor": "7 этаж"},' +
        '{"id":"2","login": "Томас Андерсон","homeFloor": "2 этаж"},' +
        '{"id":"3","login": "Дарт Вейдер","homeFloor": "1 этаж"},' +
        '{"id":"4", "login": "Кларк Кент","homeFloor": "2 этаж"}]},' +

        '{"id":"10",' +
        '"title":"Рассуждения о высоком",' +
        '"dateStart":"Wed Jan 24 2018 15:15:00 GMT+0300 (RTZ 2 (зима))",' +
        '"dateEnd":"Wed Jan 24 2018 21:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"room":{"id":"6","title":"Мариванна","capacity":"3-6 человек"},' +
        '"users":[' +
        '{"id":"1","login": "Лекс Лютор", "homeFloor": "7 этаж"},' +
        '{"id":"2","login": "Томас Андерсон","homeFloor": "2 этаж"},' +
        '{"id":"3","login": "Дарт Вейдер","homeFloor": "1 этаж"},' +
        '{"id":"4", "login": "Кларк Кент","homeFloor": "2 этаж"}]},' +

        '{"id":"11",' +
        '"title":"Рассуждения о высоком",' +
        '"dateStart":"Wed Jan 24 2018 8:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"dateEnd":"Wed Jan 24 2018 23:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"room":{"id":"7","title":"Ржавый ФредТонкий боб","capacity":"3-6 человек"},' +
        '"users":[' +
        '{"id":"1","login": "Лекс Лютор", "homeFloor": "7 этаж"},' +
        '{"id":"2","login": "Томас Андерсон","homeFloor": "2 этаж"},' +
        '{"id":"3","login": "Дарт Вейдер","homeFloor": "1 этаж"},' +
        '{"id":"4", "login": "Кларк Кент","homeFloor": "2 этаж"}]},' +

        '{"id":"12",' +
        '"title":"Рассуждения о высоком",' +
        '"dateStart":"Wed Jan 24 2018 8:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"dateEnd":"Wed Jan 24 2018 23:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"room":{"id":"8","title":"Черная вдова","capacity":"3-6 человек"},' +
        '"users":[' +
        '{"id":"1","login": "Лекс Лютор", "homeFloor": "7 этаж"},' +
        '{"id":"2","login": "Томас Андерсон","homeFloor": "2 этаж"},' +
        '{"id":"3","login": "Дарт Вейдер","homeFloor": "1 этаж"},' +
        '{"id":"4", "login": "Кларк Кент","homeFloor": "2 этаж"}]},' +

        '{"id":"13",' +
        '"title":"Рассуждения о высоком",' +
        '"dateStart":"Wed Jan 24 2018 9:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"dateEnd":"Wed Jan 24 2018 10:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"room":{"id":"9","title":"Белорусский ликёр","capacity":"3-6 человек"},' +
        '"users":[' +
        '{"id":"1","login": "Лекс Лютор", "homeFloor": "7 этаж"},' +
        '{"id":"2","login": "Томас Андерсон","homeFloor": "2 этаж"},' +
        '{"id":"3","login": "Дарт Вейдер","homeFloor": "1 этаж"},' +
        '{"id":"4", "login": "Кларк Кент","homeFloor": "2 этаж"}]},' +

        '{"id":"14",' +
        '"title":"Рассуждения о высоком",' +
        '"dateStart":"Wed Jan 24 2018 15:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"dateEnd":"Wed Jan 24 2018 16:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"room":{"id":"9","title":"Белорусский ликёр","capacity":"3-6 человек"},' +
        '"users":[' +
        '{"id":"1","login": "Лекс Лютор", "homeFloor": "7 этаж"},' +
        '{"id":"2","login": "Томас Андерсон","homeFloor": "2 этаж"},' +
        '{"id":"3","login": "Дарт Вейдер","homeFloor": "1 этаж"},' +
        '{"id":"4", "login": "Кларк Кент","homeFloor": "2 этаж"}]},' +

        '{"id":"15",' +
        '"title":"Рассуждения о высоком",' +
        '"dateStart":"Wed Jan 24 2018 19:00:00 GMT+0300 (RTZ 2 (зима))",' +
        '"dateEnd":"Wed Jan 24 2018 21:30:00 GMT+0300 (RTZ 2 (зима))",' +
        '"room":{"id":"9","title":"Белорусский ликёр","capacity":"3-6 человек"},' +
        '"users":[' +
        '{"id":"1","login": "Лекс Лютор", "homeFloor": "7 этаж"},' +
        '{"id":"2","login": "Томас Андерсон","homeFloor": "2 этаж"},' +
        '{"id":"3","login": "Дарт Вейдер","homeFloor": "1 этаж"},' +
        '{"id":"4", "login": "Кларк Кент","homeFloor": "2 этаж"}]}' +

        ']}';


    var obj1 = JSON.parse(text);


    var listRooms = document.getElementById('listRooms');
    for (var i = 0; i < obj1.events.length; i++) {

        if (listRooms.hasChildNodes) {
            var opts = listRooms.childNodes;
            for (var j = 0; j < opts.length; j++) {
                if (opts[j].nodeType != 1) continue;
                if ((opts[j].classList.contains("rooms")) &&
                    (opts[j].dataset.idRooms == obj1.events[i].room.id)) {
                    var btn_meet = document.createElement("button");
                    var date = new Date(obj1.events[i].dateStart);
                    var dateEnd = new Date(obj1.events[i].dateEnd);
                    var hourEnd = dateEnd.getHours();
                    var minuteEnd = dateEnd.getMinutes();
                    var hour = date.getHours();
                    var minute = date.getMinutes();
                    var left = (hour - 8) * 6 + minute * 0.1 + 6;

                    var right = (hourEnd - 8) * 6 + minuteEnd * 0.1 + 6;
                    var btnwidth = right - left;
                    if (opts[j].offsetTop != 0) {
                        var btn_style = "top:" + opts[j].offsetTop + "px;width:15px;left:" +
                            left + "%;" + "width:" + btnwidth + "%";
                    } else {
                        var btn_style = "top:" + (j) * 25 + "px;width:15px;left:" +
                            left + "%;" + "width:" + btnwidth + "%";
                    }
                    btn_meet.dataset.toggle = "modal";
                    btn_meet.dataset.target = "#event_info_Modal";

                    btn_meet.setAttribute("class", "btn_diagram_meet");
                    btn_meet.setAttribute("style", btn_style);
                    btn_meet.onclick = openEventInfo;
                    div_diagram.appendChild(btn_meet);
                    break;
                }
            }
        }
    }
};

//модальное окно с информацией о событии
function openEventInfo(event) {
    event.stopPropagation();
    var dialogModal = document.getElementById('dialogModal');
    dialogModal.setAttribute("style", "display:block");
    var event_info = document.getElementById('event_info');
    var x = event.clientX;
    var y = event.clientY;
    event_info.setAttribute("style", "top:" + y + "px; left:" +
        x + "px");
    $("#event_info_Modal").modal("show");
};

function hideModal() {
    $("#event_info").modal("hide");
    var dialogModal = document.getElementById("dialogModal");
    dialogModal.setAttribute("style", "display:none;");
}

//линия текущего времени
function drawLine() {

    var div_line = document.createElement("div");
    var btn_circle = document.getElementById('btn_circle');
    var div_diagram = document.getElementById('div_diagram');
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var left = (hour - 8) * 6 + minute * 0.1 + 6;
    var left_btn = (hour - 8) * 6 + minute * 0.1 + 7;
    div_line.setAttribute("id", "line_current_time");
    div_line.setAttribute("style", "left:" + left + "%");
    btn_circle.setAttribute("style", "display: inline-block;left:" + left_btn + "%; top:20%");
    div_line.setAttribute("class", "vl");
    div_diagram.appendChild(div_line);
    if ((hour > 23) || (hour < 8)) {
        div_line.setAttribute("style", "display: none");
        btn_circle.setAttribute("style", "display: none");
    }
};

// перерисовка линии текущего времени
function updateLine() {
    var btn_circle = document.getElementById('btn_circle');
    var div_line = document.getElementById('line_current_time');
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var left = (hour - 8) * 6 + minute * 0.1 + 6;
    var left_btn = (hour - 8) * 6 + minute * 0.1 + 7;
    if ((hour > 23) || (hour < 8)) {
        div_line.setAttribute("style", "display: none");
        btn_circle.setAttribute("style", "display: none");
    } else {
        div_line.setAttribute("style", "left:" + left + "%");
        btn_circle.setAttribute("style", "display: inline-block;left:" + left_btn + "%; top:20%");
    }

}

setInterval(updateLine, 60000);
setTimeout(createMeetsbtnforDiagram, 1);
setTimeout(drawLine, 1);