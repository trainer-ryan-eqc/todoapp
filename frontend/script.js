const eyeButton = document.getElementById('eye');

eyeButton.addEventListener('click', function (event) {
    event.preventDefault();

    const password = document.getElementById('password');
    const eye = document.getElementById('eyeImg');

    password.type = password.type === 'password' ? 'text' : 'password';
    eye.src = password.type === "password" ? "/Images/eye-closed-svgrepo-com.svg" : "/Images/eye-svgrepo-com.svg";
});