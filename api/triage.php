<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

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

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        // Check for required fields
        if (!isset($data['code_produit'], $data['date_triage'], $data['quantite_utilisee'], $data['quantite_produit_fini'])) {
            echo json_encode(['status' => 'error', 'message' => 'Tous les champs sont requis']);
            exit;
        }

        // Insert triage data into the database
        $stmt = $pdo->prepare("INSERT INTO triage (code_produit, date_triage, quantite_utilisee, quantite_produit_fini) 
                               VALUES (:code_produit, :date_triage, :quantite_utilisee, :quantite_produit_fini)");

        $stmt->execute([
            ':code_produit' => $data['code_produit'],
            ':date_triage' => $data['date_triage'],
            ':quantite_utilisee' => $data['quantite_utilisee'],
            ':quantite_produit_fini' => $data['quantite_produit_fini']
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Triage ajouté avec succès']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erreur de base de données : ' . $e->getMessage()]);
}
?>