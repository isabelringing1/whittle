const getDateStringFormatted = (date = null) => {
    if (date == null) {
        date = new Date();
    }
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    return month + " " + day + nth(day) + ", " + year;
};

const getDateString = (date = null) => {
    if (date == null) {
        date = new Date();
    }
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    return month + "/" + day + "/" + year;
}

const getStatusClassName = (percentComplete, hasStarted = true) => {
    if (percentComplete == 0 || !hasStarted) {
        return "not-started";
    } else if (percentComplete > 0 && percentComplete < 50) {
        return "low";
    } else if (percentComplete >= 50 && percentComplete < 80) {
        return "medium";
    } else if (percentComplete >= 80 && percentComplete < 100) {
        return "high";
    } else if (percentComplete >= 100) {
        return "complete";
    }
}

const nth = (d) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};

export {getDateString, getDateStringFormatted, getStatusClassName}