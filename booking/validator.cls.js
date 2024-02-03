class Validator{

    

    constructor(o){
        this.email = o.email;
        this.tel = o.tel;
        this.alertbox = o.alertbox;
        this.nameField = o.nameField; 
        this.emailField = o.emailField;
        this.telField = o.telField;
        this.success = o.success;
        this.validator = {
            errorMessage: 'A mezőt kötelező kitölteni!',
            fields: {
                email: {
                    required: true,
                    reg: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    errorMessage: 'Az email mező hibásan lett kitöltve!',
                    input: this.email,
                    alert: 'Valid email required'
                },
                tel: {
                    required: true,
                    reg: /^(\+36|06)[0-9]0\d{7}$/,
                    errorMessage: 'A telefon mező hibásan lett kitöltve!',
                    input: this.tel,
                    alert: 'Valid tel. required'
                },
            },
        };
    };

    isValid() {
        let isValid = true;

        for (let field in this.validator.fields) {
            let data = this.validator.fields[field];
            
            if (!(data.reg.test(data.input) && data.required) ||
                (!data.reg.test(data.input) && !data.required && data.input.length > 0)) {
                this.alert(data);
                isValid = false;
            }

            if (data.required && data.input === '') {
                this.alert(data);
                isValid = false;
            }
        }

        if (isValid) {
            return true;
        }
        
    };


    alert(data){
        this.alertbox.innerHTML = data.alert;
        this.inputField.classList.add('alert-bg','alert-color');
        this.alertbox.classList.add('alert-color');
    };
}