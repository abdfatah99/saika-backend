const numberFormat = (number) => {
    const formatNumbering = new Intl.NumberFormat("id-ID");
    return formatNumbering.format(number);
};
const namesOfMonth = (localeName = "en-US", monthFormat = "long") => {
    const format = new Intl.DateTimeFormat(localeName, { month: monthFormat })
        .format;
    return [...Array(12).keys()].map((m) =>
        format(new Date(Date.UTC(2022, m)))
    );
};
const namesOfMonthLocal = (localeName = "id-ID", monthFormat = "long") => {
    const format = new Intl.DateTimeFormat(localeName, { month: monthFormat })
        .format;
    return [...Array(12).keys()].map((m) =>
        format(new Date(Date.UTC(2022, m)))
    );
};
const namesSetMonth = (indeks, zona) => {
    let arrayMonthLocal = namesOfMonthLocal();
    let arrayMonth = namesOfMonth();
    let bulan = "";
    if (zona === "en-US") {
        arrayMonth.forEach((el, i) => {
            if (i === indeks) {
                bulan = el;
            }
        });
    } else {
        arrayMonthLocal.forEach((el, i) => {
            if (i === indeks) {
                bulan = el;
            }
        });
    }
    return bulan;
};

const setIndeksHours = (hours) => {
    if (hours.length === 1) {
        return `0${hours}`;
    } else {
        return `${hours}`;
    }
};

export {
    numberFormat,
    namesOfMonth,
    namesOfMonthLocal,
    namesSetMonth,
    setIndeksHours,
};
