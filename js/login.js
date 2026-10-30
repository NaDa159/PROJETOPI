
const formulario = document.getElementById("form-login");
const campoSenha = document.getElementById("senha");
const mensagemErro = document.getElementById("mensagem-erro");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const senha = campoSenha.value;

    if (senha === "12345") {

        sessionStorage.setItem("perfil", "administrador");

        window.location.href = "administrador.html";

    } else if (senha === "54321") {

        sessionStorage.setItem("perfil", "usuario");

        window.location.href = "usuario.html";

    } else {

        mensagemErro.textContent = "Senha incorreta. Tente novamente.";

        campoSenha.value = "";
        campoSenha.focus();

    }
});
