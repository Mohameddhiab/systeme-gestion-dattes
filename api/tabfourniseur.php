<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Configuration de la base de données
$host = $_ENV['DB_HOST'];
$dbname = $_ENV['DB_NAME'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (isset($_GET['id'])) {
            // Récupérer un fournisseur spécifique par ID
            $stmt = $pdo->prepare("SELECT * FROM fournisseurs WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $fournisseur = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($fournisseur) {
                echo json_encode(['status' => 'success', 'fournisseur' => $fournisseur]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Fournisseur non trouvé']);
            }
        } else {
            // Récupérer tous les fournisseurs ou effectuer une recherche
            $search = isset($_GET['search']) ? "%{$_GET['search']}%" : null;
            $sql = "SELECT * FROM fournisseurs";
            $params = [];

            if ($search) {
                $sql .= " WHERE nom_complet LIKE :search";
                $params[':search'] = $search;
            }

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            echo json_encode(['status' => 'success', 'fournisseurs' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID du fournisseur requis']);
            exit;
        }

        // Supprimer un fournisseur par ID
        $stmt = $pdo->prepare("DELETE FROM fournisseurs WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'success', 'message' => 'Fournisseur supprimé avec succès']);
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Fournisseur non trouvé']);
        }
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de base de données : ' . $e->getMessage()]);
}
?>