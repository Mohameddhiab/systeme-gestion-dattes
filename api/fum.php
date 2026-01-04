<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
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

    // POST request - Insert a new fumigation record
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['code_produit'], $data['numero_lot'], $data['quantite_utilisee'], $data['date_debut_fumigation'], $data['date_fin_fumigation'])) {
            echo json_encode(['status' => 'error', 'message' => 'Tous les champs sont requis']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO fumigation (code_produit, numero_lot, quantite_utilisee, date_debut_fumigation, date_fin_fumigation) 
                               VALUES (:code_produit, :numero_lot, :quantite_utilisee, :date_debut_fumigation, :date_fin_fumigation)");

        $stmt->execute([
            ':code_produit' => $data['code_produit'],
            ':numero_lot' => $data['numero_lot'],
            ':quantite_utilisee' => $data['quantite_utilisee'],
            ':date_debut_fumigation' => $data['date_debut_fumigation'],
            ':date_fin_fumigation' => $data['date_fin_fumigation']
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Fumigation ajoutée avec succès']);

        // GET request - Fetch all fumigation records or search by code_produit
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $searchQuery = isset($_GET['search']) ? $_GET['search'] : '';

        if ($searchQuery) {
            $stmt = $pdo->prepare("SELECT * FROM fumigation WHERE code_produit LIKE :search");
            $stmt->execute([':search' => "%" . $searchQuery . "%"]);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM fumigation");
            $stmt->execute();
        }

        $fumigations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['fumigations' => $fumigations]);

        // DELETE request - Delete a fumigation record by ID
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $id = isset($_GET['id']) ? $_GET['id'] : null;

        if (!$id) {
            echo json_encode(['status' => 'error', 'message' => 'ID requis pour suppression']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM fumigation WHERE id = :id");
        $stmt->execute([':id' => $id]);

        echo json_encode(['status' => 'success', 'message' => 'Fumigation supprimée avec succès']);

    } else {
        echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
    }

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erreur de base de données : ' . $e->getMessage()]);
}
?>