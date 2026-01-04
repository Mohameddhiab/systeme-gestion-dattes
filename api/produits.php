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

        if (!isset($data['code_fournisseur'], $data['type_produit'], $data['date_reception'], $data['quantite'], $data['code_produit'])) {
            echo json_encode(['status' => 'error', 'message' => 'Tous les champs sont requis']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO produit (code_fournisseur, type_produit, date_reception, quantite, code_produit) 
                               VALUES (:code_fournisseur, :type_produit, :date_reception, :quantite, :code_produit)");

        $stmt->execute([
            ':code_fournisseur' => $data['code_fournisseur'],
            ':type_produit' => $data['type_produit'],
            ':date_reception' => $data['date_reception'],
            ':quantite' => $data['quantite'],
            ':code_produit' => $data['code_produit']
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Produit ajouté avec succès']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erreur de base de données : ' . $e->getMessage()]);
}
?>