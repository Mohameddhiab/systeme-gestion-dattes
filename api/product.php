<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, DELETE, OPTIONS");
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

    // Vérifier la méthode HTTP
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Si un ID est fourni, récupérer un seul produit
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM produit WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($product) {
                echo json_encode(['status' => 'success', 'product' => $product]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Produit non trouvé']);
            }
        } else {
            // Recherche par code_produit
            $search = isset($_GET['search']) ? "%{$_GET['search']}%" : null;
            $sql = "SELECT * FROM produit";
            $params = [];

            if ($search) {
                $sql .= " WHERE code_produit LIKE :search";
                $params[':search'] = $search;
            }

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            echo json_encode(['status' => 'success', 'products' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        }
    }

    // Suppression d'un produit
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID du produit requis']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM produit WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'success', 'message' => 'Produit supprimé avec succès']);
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Produit non trouvé']);
        }
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de base de données : ' . $e->getMessage()]);
}
?>