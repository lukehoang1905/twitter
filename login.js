let attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.
const test = { username: 'tester', password: 'abc' }

function validate() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username == test.username && password == test.password) {
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