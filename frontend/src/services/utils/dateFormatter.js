function addZero(i) {
    if (i < 10) { i = "0" + i }
    return i;
}

export function dateFormatter(date) {
    var d = date.getDate();
    var m = date.getMonth();
    m += 1;
    var y = date.getFullYear();
    var newdate = (y + "-" + m + "-" + d);
    return newdate
}

export function dateFormatDDMMYY(a) {
    let date = new Date(a)
    var d = addZero(date.getUTCDate());
    var m = date.getUTCMonth();
    m += 1;
    m = addZero(m)
    var y = date.getUTCFullYear();
    var newdate = d + "." + m + "." + y;
    return newdate
}

export function dateFormatDDMMYYHHMM(date) {
    var d = addZero(date.getUTCDate());
    var m = date.getUTCMonth();
    m += 1;
    m = addZero(m)
    var y = date.getUTCFullYear();
    var h = addZero(date.getUTCHours());
    var min = addZero(date.getUTCMinutes());
    var newdate = d + "." + m + "." + y + " " + h + ":" + min;
    return newdate
}

export function dateFormatDDMMYYHHMMSS(date) {
    var s = addZero(date.getUTCSeconds());
    const dateDDMMYYHHMM = dateFormatDDMMYYHHMM(date);
    var newdate = dateDDMMYYHHMM + ":" + s;
    return newdate
}

export function newDate(date) {
    const dateParts = date.split("-");
    var day = dateParts[0];
    var month = dateParts[1];
    var year = dateParts[2];
    return new Date(year, month - 1, day);
}
