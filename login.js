let attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.
const test = { username: 'tester', password: 'abc' }


let userDataBase = [{ userName: 'tester', userPassword: 'abc', userEmail: 'test@gmail.com', userPic: "#", userLink: "##" }]

function validate() {
    let usernameInput = document.getElementById("username").value;
    let passwordInput = document.getElementById("password").value;

    for (i = 0; i < userDataBase.length; i++) {
        if (usernameInput == userDataBase[i].userName && passwordInput == userDataBase[i].userPassword) {
            alert("Login successfully");
            window.location = "index.html"; // Redirecting to other page.

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


let user = []









const signUp = () => {
    if (!checked) {
        alert('bip bip bo are u a robot ')
        return
    }

    aUserName = document.getElementById('signUser').value

    aUserEmail = document.getElementById('signEmail').value

    // if(userDataBase.map((data, index) => data.userName).includes(aUserName)===true ||
    // userDataBase.map((data, index) => data.userPassword).includes(aUserEmail)===false)

    aUserPassword = document.getElementById('signPassword').value
    aUserPic = 'default'

    let newUser = {
        'userName': aUserName,
        'userPassword': aUserPassword,
        'userEmail': aUserEmail,
        'userPic': "#",
        'userLink': "##"
    }

    userDataBase.push(newUser)

    console.log(userDataBase)

}