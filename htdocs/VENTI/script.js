document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signupForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log("Formulário submetido.");

        var formData = new FormData(this);
        var email = formData.get('email');

        // Verificar se o e-mail é válido
        if (isValidEmail(email)) {
            var domain = email.substring(email.lastIndexOf("@") + 1);
            verificarDominio(domain, formData);
        } else {
            document.getElementById('responseMessage').innerText = "Endereço de e-mail inválido.";
        }
    });
});

function isValidEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function verificarDominio(domain, formData) {
    var xhrDomain = new XMLHttpRequest();
    xhrDomain.open('GET', 'https://dns.google/resolve?name=' + domain, true);
    xhrDomain.onreadystatechange = function() {
        if (xhrDomain.readyState === 4) {
            if (xhrDomain.status === 200) {
                var responseDomain = JSON.parse(xhrDomain.responseText);
                if (responseDomain.Status === 0) {
                    enviarForm(formData);
                } else {
                    document.getElementById('responseMessage').innerText = "Domínio do e-mail inválido.";
                }
            } else {
                document.getElementById('responseMessage').innerText = "Erro na verificação do domínio.";
            }
        }
    };
    xhrDomain.send();
}

function enviarForm(formData) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost/VENTI/php/backend.php', true);
    console.log("Iniciando requisição AJAX.");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                document.getElementById('responseMessage').innerText = response.message;
            } else {
                document.getElementById('responseMessage').innerText = "Erro na requisição: " + xhr.status;
            }
        }
    };
    xhr.send(formData);
}
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signupForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log("Formulário submetido.");

        var formData = new FormData(this);
        var email = formData.get('email');

        // Verificar se o e-mail é válido
        if (isValidEmail(email)) {
            var domain = email.substring(email.lastIndexOf("@") + 1);
            verificarDominio(domain, formData);
        } else {
            exibirMensagem("Endereço de e-mail inválido.", "red");
        }
    });
});

// Função para validar o e-mail
function isValidEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Função para verificar o domínio do e-mail antes de enviar
function verificarDominio(domain, formData) {
    var xhrDomain = new XMLHttpRequest();
    xhrDomain.open('GET', 'https://dns.google/resolve?name=' + domain, true);
    xhrDomain.onreadystatechange = function() {
        if (xhrDomain.readyState === 4) {
            if (xhrDomain.status === 200) {
                var responseDomain = JSON.parse(xhrDomain.responseText);
                if (responseDomain.Status === 0) {
                    enviarForm(formData);
                } else {
                    exibirMensagem("Domínio do e-mail inválido.", "red");
                }
            } else {
                console.warn("Erro ao verificar domínio, enviando mesmo assim...");
                enviarForm(formData); // Permite continuar caso haja erro na API de domínio
            }
        }
    };
    xhrDomain.send();
}

// Função para enviar o formulário
function enviarForm(formData) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost/VENTI/php/backend.php', true);
    console.log("Iniciando requisição AJAX.");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log("Resposta do servidor:", xhr.responseText);
            if (xhr.status === 200) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    exibirMensagem(response.message, response.success ? "green" : "red");
                } catch (e) {
                    console.error("Erro ao processar resposta JSON:", e);
                    exibirMensagem("INSCRIÇÃO REALIZADA.", "green");
                }
            } else {
                exibirMensagem("Erro na requisição: " + xhr.status, "red");
            }
        }
    };
    xhr.send(formData);
}

// Função para exibir mensagens na tela
function exibirMensagem(texto, cor) {
    var mensagem = document.getElementById("responseMessage");
    if (mensagem) {
        mensagem.style.display = "block";
        mensagem.innerText = texto;
        mensagem.style.color = cor;
    } else {
        console.error("Elemento #responseMessage não encontrado no DOM.");
    }
}
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        var mensagem = document.getElementById("responseMessage");
        if (!mensagem) {
            console.error("Elemento #responseMessage ainda não foi encontrado!");
        }
    }, 500); // Espera 500ms para garantir que o DOM carregou
});
