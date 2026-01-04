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
        if (empty($data['email'])) {
            throw new Exception('L\'email est requis');
        }
        if (empty($data['password'])) {
            throw new Exception('Le mot de passe est requis');
        }

        // Get user by email
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
        $stmt->execute(['email' => $data['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            throw new Exception('Email ou mot de passe incorrect');
        }

        // Verify password
        if (!password_verify($data['password'], $user['mod_pass'])) {
            throw new Exception('Email ou mot de passe incorrect');
        }

        // Remove password from response
        unset($user['password']);

        echo json_encode([
            'status' => 'success',
            'message' => 'Connexion réussie',
            'user' => $user
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