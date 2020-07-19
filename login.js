//clear all storage when reload this page
window.localStorage.clear();

let attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.

const test = { username: 'tester', password: 'abc' }
let user = []

let userDataBase = [{ userName: 'tester', userPassword: 'abc', userEmail: 'test@gmail.com', userPic: "#", userLink: "" }]



function validate() {
    let usernameInput = document.getElementById("username").value;
    let passwordInput = document.getElementById("password").value;

    for (i = 0; i < userDataBase.length; i++) {
        if (usernameInput == userDataBase[i].userName && passwordInput == userDataBase[i].userPassword) {
            alert("Log-in successfully");
            window.location = "home.html"; // Redirecting to other page.

        } else {
            attempt--; // Decrementing by one.
            alert("You have left " + attempt + " attempt;");
            // Disabling fields after 3 attempts.
            if (attempt == 0) {
                document.getElementById("username").disabled = true;
                document.getElementById("password").disabled = true;
                document.getElementById("submit").disabled = true;
                return false;
            }
        }
    }
}
let checked = false

const check = () => {
    checked = !checked
}




const signUp = () => {
    if (!checked) {
        alert('bip bip bo are u a robot ')
        return
    }

    aUserName = document.getElementById('signUser').value
    checkUserName(aUserName)

    aUserEmail = document.getElementById('signEmail').value
    checkUserEmail(aUserEmail)
    aUserPassword = document.getElementById('signPassword').value
    checkPassword(aUserPassword)
    aUserPic = JSON.parse(window.localStorage.getItem('userPic'))

    document.getElementById('out').setAttribute(`src`, aUserPic)


    if (checkUserName(aUserName) === true && checkPassword(aUserPassword) === true && checkUserEmail(aUserEmail) === true) {
        let newUser = {
            'userName': aUserName,
            'userPassword': aUserPassword,
            'userEmail': aUserEmail,
            'userPic': aUserPic,
            'userLink': `@${aUserName}`
        }

        userDataBase.push(newUser)

        //import onto
        window.localStorage.setItem('user', JSON.stringify(newUser));
        alert("sign up successful")
    } else {
        alert("sign up unsuccessful")

    }
    console.log(userDataBase)
    console.log(JSON.parse(window.localStorage.getItem('user')))
    return
}




const checkPassword = (password) => {
    if (password.length < 8) {
        alert("password must be at least 8 characters")
        return false
    }
    if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%* #+=\(\)\^?&])[A-Za-z\d$@$!%* #+=\(\)\^?&]{3,}$/)) {
        alert("password must include at least 1 number and 1 letter and 1 special character")
        return false
    }
    return true

};

const checkUserName = (a) => {
    for (i = 0; i < userDataBase.length; i++) {
        if (userDataBase[i].userName == a) {
            console.log("Username already taken")
            return false
        }
    }
    alert('You can use this Username')
    return true
}
const checkUserEmail = (a) => {
    for (i = 0; i < userDataBase.length; i++) {
        if (userDataBase[i].userEmail == a) {
            console.log("email already taken")
            return false
        }
    }
    alert('You can use this Email')
    return true
}