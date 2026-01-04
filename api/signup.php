<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$host = $_ENV['DB_HOST'];
$dbname = $_ENV['DB_NAME'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES utf8");


    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        // Validation
        if (empty($data['fullName'])) {
            throw new Exception('Le nom complet est requis');
        }
        if (empty($data['email'])) {
            throw new Exception('L\'email est requis');
        }
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Format d\'email invalide');
        }
        if (empty($data['password'])) {
            throw new Exception('Le mot de passe est requis');
        }
        if (strlen($data['password']) < 6) {
            throw new Exception('Le mot de passe doit contenir au moins 6 caractères');
        }

        // Check if email exists
        $checkEmail = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = :email");
        $checkEmail->execute(['email' => $data['email']]);
        if ($checkEmail->fetchColumn() > 0) {
            throw new Exception('Cet email est déjà utilisé');
        }

        // Insert new user
        $stmt = $pdo->prepare("INSERT INTO users (fullName, email, mod_pass) VALUES (:fullName, :email, :password)");

        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

        $stmt->execute([
            'fullName' => $data['fullName'],
            'email' => $data['email'],
            'password' => $hashedPassword
        ]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Inscription réussie',
            'user_id' => $pdo->lastInsertId()
        ]);
    } else {
        throw new Exception('Méthode non autorisée');
    }
} catch (PDOException $e) {
    error_log('Database Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur de base de données: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>