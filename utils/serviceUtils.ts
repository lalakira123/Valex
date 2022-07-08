import dayjs from "dayjs";

function validateExpirationDate(expirationDate:string){
    const expirationDateDay = `01/${expirationDate}`;
    const differenceDates = dayjs(expirationDateDay, 'DD/MM/YY').diff(dayjs().format('DD/MM/YY'), 'month'); 

    if(differenceDates <= 0) return true;
    return false;
}

export {
    validateExpirationDate
}