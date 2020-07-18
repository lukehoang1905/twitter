let attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.
const test = { username: 'tester', password: 'abc' }


let userDataBase = [{ userName: 'tester', userPassword: 'abc', userEmail: 'test@gmail.com', userPic: "#" }]



function validate() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username == userDataBase[0].userName && password == userDataBase[0].userPassword) {
        alert("Login successfully");
        window.location = "index.html"; // Redirecting to other page.
        return false;
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
let checked = false

const check = () => {
    checked = !checked
}


let user = []

const signUp = () => {
    if (!checked) {
        alert('bip bip bo')
        return
    }

    let userName = document.getElementById('signUser').value
    let userEmail = document.getElementById('signEmail').value
    let userPassword = document.getElementById('signPassword').value
    let

    return
}


function followClicked() {
    document.getElementById("following").innerHTML = "Following";
}