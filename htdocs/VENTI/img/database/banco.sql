document.getElementById("inscricaoForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    
    fetch("backend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome, email: email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("🎉 Inscrição realizada com sucesso! Verifique seu e-mail.");
            document.getElementById("inscricaoForm").reset();
        } else {
            alert("⚠️ Erro ao se inscrever. Tente novamente!");
        }
    })
    .catch(error => console.error("Erro:", error));
});
