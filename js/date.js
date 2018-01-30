// текущая дата
function setPageTime() {
    var date = new Date;
    $("#iddate").datepicker("setDate", date);
    $("#dateappendix").html("- сегодня");
}

//событие получить следующую дату
function setPageTimeNext() {
    var currentDate = $('#iddate').datepicker("getDate");
    var tomorrowDate = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000));
    console.log(tomorrowDate);
    $("#iddate").datepicker("setDate", tomorrowDate);
    changeDateappendix(tomorrowDate);
}

//событие получить предыдущую дату
function setPageTimeAgo() {
    var currentDate = $('#iddate').datepicker("getDate");
    var yesterdayDate = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
    $("#iddate").datepicker("setDate", yesterdayDate);
    changeDateappendix(yesterdayDate);
}

function changeDateappendix(date) {
    var today = new Date();
    if ((today.getDay() === date.getDay()) &&
        (today.getMonth() === date.getMonth()) &&
        (today.getFullYear() === date.getFullYear())) {

        s = ' -  сегодня';
    } else
    if (((new Date(today.getTime() - (24 * 60 * 60 * 1000))).getDay() === date.getDay()) &&
        ((new Date(today.getTime() - (24 * 60 * 60 * 1000))).getMonth() === date.getMonth()) &&
        ((new Date(today.getTime() - (24 * 60 * 60 * 1000))).getFullYear() === date.getFullYear())) {
        s = ' -  вчера';
    } else if (((new Date(today.getTime() + (24 * 60 * 60 * 1000))).getDay() === date.getDay()) &&
        ((new Date(today.getTime() + (24 * 60 * 60 * 1000))).getMonth() === date.getMonth()) &&
        ((new Date(today.getTime() + (24 * 60 * 60 * 1000))).getFullYear() === date.getFullYear())) {

        s = ' -  завтра';
    } else
        s = ' ';
    $("#dateappendix").html(s);
}

//создать таблицу для диаграммы
function createDiagramTable() {
    var table = document.createElement("table");
    var div_diagram = document.getElementById('div_diagram');
    table.setAttribute("style", "width:100%;height: 100%;");

    table.setAttribute("id", "diagram_table");
    div_diagram.appendChild(table);
    var tr = document.createElement("tr");
    for (var j = 0; j < 17; j++) {
        var th = document.createElement("th");
        th.setAttribute("class", "diagram_grid_th");
        tr.appendChild(th);
    }
    table.appendChild(tr);
}

//создать div элементы, соответствующие пустым полям на диаграмме
function create_diagram_meet_div() {
    var height_diagram_table = 50 + "px";
    var table_diagram = document.getElementById('diagram_table');
    var div_diagram = document.getElementById('div_diagram');
    var listRooms = document.getElementById('listRooms');
    if (listRooms.hasChildNodes) {
        var opts = listRooms.childNodes;
        for (var i = 0; i < opts.length; i++) {
            if (opts[i].nodeType != 1) continue;
            var div_top;
            if (opts[i].offsetTop != 0) {
                height_diagram_table = opts[i].offsetTop + 40;
                div_top = opts[i].offsetTop;
                //phone
            } else {
                height_diagram_table = (i) * 25 + 40;
                div_top = (i) * 25;
            }
            if (opts[i].classList.contains("rooms")) {
                var div_meet = document.createElement("div");

                div_meet.setAttribute("class", "div_diagram_meet");

                //desktop

                div_meet.setAttribute("style", "top:" + div_top + "px");
                div_diagram.appendChild(div_meet);
                //создаем label элемент, соответствующий комнате для phone 
                var label_room = document.createElement("label");
                label_room.appendChild(document.createTextNode(opts[i].dataset.title));
                label_room.setAttribute("style", "top:" +
                    div_top + "px");
                if (opts[i].dataset.isFull == "true")
                    label_room.setAttribute("class", "lb_room_phone lb_room_full_phone");
                else
                    label_room.setAttribute("class", "lb_room_phone");

                div_diagram.appendChild(label_room);

            } else
            if (opts[i].classList.contains("floors")) {
                //создаем label элемент, соответствующий этажу  для phone 
                var label_floor = document.createElement("label");
                label_floor.appendChild(document.createTextNode(opts[i].dataset.floor));
                label_floor.setAttribute("style", "top:" +
                    div_top + "px");
                label_floor.setAttribute("class", "lb_floor_phone");

                div_diagram.appendChild(label_floor);
            }
        }
    }
    $(document).scroll(function() {
        $('.lb_room_phone').css({
            left: $(document).scrollLeft()
        });
        $('.navbar').css({
            left: $(document).scrollLeft()
        });

    });
    table_diagram.setAttribute("style", "width:100%; height:" + height_diagram_table + "px");
}


//заполнение строки времени
function feelTimeRow() {
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var time_row = document.getElementById('time_line');
    var currentTimelabel = document.getElementById('currentTimelabel');
    for (var i = 8; i < 24; i++) {
        var label = document.createElement("label");
        label.setAttribute("class", "time_label");
        if (hour >= i) {

            label.setAttribute("style", "color:#E9ECEF");
        }

        label.dataset.time = i;
        label.appendChild(document.createTextNode(i));
        time_row.appendChild(label);
    }

    //вычисление по времени отступа слева
    var left = (hour - 8) * 6 + minute * 0.1 + 3;
    var currentTimelabel = document.createElement("label");
    currentTimelabel.setAttribute("id", "currentTimelabel");
    currentTimelabel.setAttribute("class", "current_time_label");
    currentTimelabel.setAttribute("style", "left:" + left + "%");
    currentTimelabel.appendChild(document.createTextNode(hour + ":" + minute));
    if ((hour < 8) || (hour > 23)) {
        currentTimelabel.setAttribute("style", "display:none");
    }

    time_row.appendChild(currentTimelabel);
}

//обновление строки времени с текущим временем через каждые 5 минут
function updateTimeRow() {
    var date = new Date();
    var hour = date.getHours();
    var currentTimelabel = document.getElementById('currentTimelabel');
    $("#currentTimelabel").empty();
    var minute = date.getMinutes();
    var time_row = document.getElementById('time_line');
    if (time_row.hasChildNodes) {
        var opts = time_row.childNodes;
        for (var j = 0; j < opts.length; j++) {
            if (opts[j].nodeType != 1) continue;
            if (opts[j].classList.contains("time_label")) {
                if (opts[j].dataset.time <= (hour)) {
                    opts[j].setAttribute("style", "color:#E9ECEF");
                }
            }
        }
    }
    var left = (hour - 8) * 6 + minute * 0.1 + 3;
    currentTimelabel.setAttribute("style", "left:" + left + "%");
    currentTimelabel.appendChild(document.createTextNode(hour + ":" + minute));
    if ((hour < 8) || (hour > 23)) {
        currentTimelabel.setAttribute("style", "display:none");
    }

}


//комнаты для переговворок. левая колонка на главной странице
function getRoomsCollection() {
    var text = '{ "floors" :[ ' +
        '{  "floor":"7 этаж",' +
        '   "rooms":[' +
        '         {"id":"1","title":"Ржавый Фред","capacity":"3-6 человек","isfull":"true"},' +
        '         {"id":"2","title":"Прачечная","capacity":"до 10 человек","isfull":"false"},' +
        '         {"id":"3","title":"Желтый дом","capacity":"до 10 человек","isfull":"false"},' +
        '         {"id":"4","title":"Оранжевый тюлбпан","capacity":"до 10 человек","isfull":"true"}' +
        '    ]' +
        '},' +
        '{  "floor":"6 этаж",' +
        '   "rooms":[' +
        '         {"id":"5","title":"Джокер","capacity":"3-6 человек","isfull":"true"},' +
        '         {"id":"6","title":"Мариванна","capacity":"3-6 человек","isfull":"false"},' +
        '         {"id":"7","title":"Тонкий боб","capacity":"3-6 человек","isfull":"true"},' +
        '         {"id":"8","title":"Черная вдова","capacity":"3-6 человек","isfull":"true"},' +
        '         {"id":"9","title":"Белорусский ликёр","capacity":"3-6 человек","isfull":"false"}' +
        '    ]' +
        '}' +
        ']}';
    var obj = JSON.parse(text);
    var sel = document.getElementById('listRooms');
    for (var i = 0; i < obj.floors.length; i++) {
        var pfloor = document.createElement("p");
        pfloor.appendChild(document.createTextNode(obj.floors[i].floor));
        pfloor.setAttribute('class', 'floors');
        pfloor.dataset.floor = obj.floors[i].floor;
        sel.appendChild(pfloor);
        for (var j = 0; j < obj.floors[i].rooms.length; j++) {
            var proom = document.createElement("p");
            proom.appendChild(document.createTextNode(obj.floors[i].rooms[j].title));
            proom.dataset.idRooms = obj.floors[i].rooms[j].id;
            proom.dataset.isFull = obj.floors[i].rooms[j].isfull;
            proom.dataset.title = obj.floors[i].rooms[j].title;
            proom.setAttribute('class', 'rooms');
            sel.appendChild(proom);
            var pcapacity = document.createElement("p");
            pcapacity.appendChild(document.createTextNode(obj.floors[i].rooms[j].capacity));
            if (obj.floors[i].rooms[j].isfull === 'false') {
                pcapacity.setAttribute('class', 'capacity_notfull');
            } else
                pcapacity.setAttribute('class', 'capacity_full');
            sel.appendChild(pcapacity);
        }
    }
}

setTimeout(getRoomsCollection, 1);
setTimeout(feelTimeRow, 1);
setTimeout(createDiagramTable, 1);
setTimeout(create_diagram_meet_div, 10);
setTimeout(setPageTime, 1);
setInterval(updateTimeRow, 60000);