let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
let telReg = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
let passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
export default {
    link(value) {
        if (phoneReg.test(value) || telReg.test(value)) {
            return true;
        }
        return false;
    },
    phone(value) {
        if (phoneReg.test(value)) {
            return true;
        }
        return false;
    },
    positiveInt(value) {
        if (/^[1-9]\d*$/g.test(value)) {
            return true;
        }
        return false;
    },
    password(value) {
        if (passwordReg.test(value)) {
            return true;
        }
        return false;
    }
}