<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Configuration de la connexion à la base de données
$host = $_ENV['DB_HOST'];
$dbname = $_ENV['DB_NAME'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];

try {
    // Connexion via PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Récupérer les données envoyées en JSON
        $data = json_decode(file_get_contents('php://input'), true);

        // Vérifier que les champs "chambre" et "operation" sont présents
        if (!isset($data['chambre']) || !isset($data['operation'])) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Les champs "chambre" et "operation" sont requis'
            ]);
            exit;
        }

        // Déterminer la table cible en fonction de la chambre
        $chambre = strtolower(trim($data['chambre']));
        if ($chambre === 'chambre 1') {
            $tableName = 'stockage_sortie_chambre1';
        } elseif ($chambre === 'chambre 2') {
            $tableName = 'stockage_sortie_chambre2';
        } elseif ($chambre === 'chambre 3') {
            $tableName = 'stockage_sortie_chambre3';
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Chambre invalide'
            ]);
            exit;
        }

        // Récupérer le type d'opération (ici, on s'attend à "sortie" pour ce formulaire)
        $operation = strtolower(trim($data['operation']));

        if ($operation === 'sortie') {
            // Vérification des champs requis pour le stockage de sortie
            // On attend ici : date_stockage, lot_number (pour la sortie), categorie, pl, lm, gc, et poids
            if (
                !isset(
                $data['date_stockage'],
                $data['lot_number'],
                $data['categorie'],
                $data['pl'],
                $data['lm'],
                $data['gc'],
                $data['poids']
            )
            ) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Tous les champs de sortie sont requis'
                ]);
                exit;
            }

            // Insertion d'un nouvel enregistrement avec les données de sortie
            $stmt = $pdo->prepare("
                INSERT INTO $tableName 
                    (date_stockage, lot_number, categorie, pl, lm, gc, poids)
                VALUES 
                    (:date_stockage, :lot, :categorie, :pl, :lm, :gc, :poids)
            ");

            $stmt->execute([
                ':date_stockage' => $data['date_stockage'],
                ':lot' => $data['lot_number'],
                ':categorie' => $data['categorie'],
                ':pl' => $data['pl'],
                ':lm' => $data['lm'],
                ':gc' => $data['gc'],
                ':poids' => $data['poids']
            ]);

            echo json_encode([
                'status' => 'success',
                'message' => 'Stockage de sortie enregistré avec succès'
            ]);

        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Type d\'opération invalide'
            ]);
        }
    } else {
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