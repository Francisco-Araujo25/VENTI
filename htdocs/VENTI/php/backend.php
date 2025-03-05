<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$database = "ventibd";

$response = ["success" => false, "message" => ""];

// Criando conexão com o banco de dados
$conn = new mysqli($servername, $username, $password, $database);

// Verificando conexão
if ($conn->connect_error) {
    $response["message"] = "Falha na conexão com o banco de dados";
    echo json_encode($response);
    exit;
}

// Verifica se a requisição é POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $response["message"] = "Método inválido. Use POST.";
    echo json_encode($response);
    exit;
}

// Verificando se os valores foram enviados corretamente
$nome = isset($_POST['nome']) ? trim($_POST['nome']) : null;
$email = isset($_POST['email']) ? trim($_POST['email']) : null;

if (!$nome || !$email) {
    $response["message"] = "Nome e e-mail são obrigatórios";
    echo json_encode($response);
    exit;
}

// Verificar se o e-mail já existe
$email_check_query = $conn->prepare("SELECT id FROM inscricoes WHERE email = ?");
$email_check_query->bind_param("s", $email);
$email_check_query->execute();
$email_check_query->store_result();

if ($email_check_query->num_rows > 0) {
    $response["message"] = "Este e-mail foi registrado.";
    $email_check_query->close();
    echo json_encode($response);
    exit;
} else {
    $email_check_query->close();
}


try {
    // Preparando o SQL para evitar SQL Injection
    $stmt = $conn->prepare("INSERT INTO inscricoes (nome, email) VALUES (?, ?)");
    $stmt->bind_param("ss", $nome, $email);
    
    if ($stmt->execute()) {
        // Enviar e-mail de confirmação
        $subject = "Confirmação de Inscrição";
        $message = "Olá $nome,\n\nSua inscrição foi realizada com sucesso! Estamos felizes em tê-lo conosco.\n\nAtenciosamente,\nEquipe Venti";
        $headers = "From: ventioficial043@gmail.com\r\n";

        if (mail($email, $subject, $message, $headers)) {
            $response["success"] = true;
            $response["message"] = "<span style='color: #155724;'>Inscrição realizada com sucesso e e-mail enviado.</span>";
        } else {
            $response["success"] = true;
            $response["message"] = "<span style='color: #155724;'>Inscrição realizada com sucesso.</span>";
        }
    } else {
        throw new Exception("Erro ao salvar a inscrição");
    }
    $stmt->close();
} catch (mysqli_sql_exception $e) {
    $response["message"] = "aguarde... " . $e->getMessage() ;
}

$conn->close();
echo json_encode($response);
?>
