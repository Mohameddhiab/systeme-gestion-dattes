<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Paramètres de connexion à la base de données
$host = $_ENV['DB_HOST'];
$dbname = $_ENV['DB_NAME'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];

try {
    // Connexion à la base de données avec PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Traitement de la requête GET : Récupérer les triages (avec recherche optionnelle)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $searchQuery = isset($_GET['search']) ? $_GET['search'] : '';

        if ($searchQuery) {
            // Rechercher les triages dont le code_produit contient la chaîne recherchée
            $stmt = $pdo->prepare("SELECT * FROM triage WHERE code_produit LIKE :search");
            $stmt->execute([':search' => "%" . $searchQuery . "%"]);
        } else {
            // Récupérer tous les triages
            $stmt = $pdo->prepare("SELECT * FROM triage");
            $stmt->execute();
        }

        $triages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($triages) > 0) {
            echo json_encode([
                'status' => 'success',
                'triages' => $triages
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Aucun triage trouvé'
            ]);
        }

        // Traitement de la requête DELETE : Suppression d'un triage par ID
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $id = isset($_GET['id']) ? $_GET['id'] : null;

        if (!$id) {
            echo json_encode([
                'status' => 'error',
                'message' => 'ID requis pour la suppression'
            ]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM triage WHERE id = :id");
        $stmt->execute([':id' => $id]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Triage supprimé avec succès'
        ]);

    } else {
        // Méthode HTTP non autorisée
        echo json_encode([
            'status' => 'error',
            'message' => 'Méthode non autorisée'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur de base de données : ' . $e->getMessage()
    ]);
}
?>