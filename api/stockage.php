<?php
// stockage.php

// Autorisations d'accès et définition du type de contenu
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Paramètres de connexion
$host = $_ENV['DB_HOST'];
$dbname = $_ENV['DB_NAME'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];

try {
    // Connexion à la base de données avec PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // On vérifie que la requête est bien en méthode POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Récupération et décodage des données JSON envoyées
        $data = json_decode(file_get_contents('php://input'), true);

        // Vérification que les champs de base sont présents
        if (!isset($data['chambre'], $data['operation'])) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Les champs "chambre" et "operation" sont requis'
            ]);
            exit;
        }

        // Détermine dans quelle table insérer selon le champ "chambre"
        $chambre = strtolower(trim($data['chambre']));
        if ($chambre === 'chambre 1') {
            $tableName = 'stockage_entre_chambre1';
        } elseif ($chambre === 'chambre 2') {
            $tableName = 'stockage_entre_chambre2';
        } elseif ($chambre === 'chambre 3') {
            $tableName = 'stockage_entre_chambre3';
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Chambre invalide'
            ]);
            exit;
        }

        // Pour la page "Stockage d'Entrée", l'opération est forcée à "entree"
        $operation = strtolower(trim($data['operation']));
        if ($operation !== 'entree') {
            echo json_encode([
                'status' => 'error',
                'message' => 'Opération invalide pour le stockage d\'entrée'
            ]);
            exit;
        }

        // Vérification des champs obligatoires pour une entrée
        // Les champs attendus sont : date_stockage, lot_number, categorie, pl, lm, gc, poids
        $required = ['date_stockage', 'lot_number', 'categorie', 'pl', 'lm', 'gc', 'poids'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || trim($data[$field]) === '') {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Champ '$field' manquant ou vide"
                ]);
                exit;
            }
        }

        // Insertion dans la table correspondant à la chambre sélectionnée
        // Les colonnes d'entrée sont renseignées et les colonnes de sortie restent à NULL (si définies avec une valeur par défaut dans la table)
        $sql = "INSERT INTO $tableName (
                    date_stockage,
                    lot_number,
                    categorie,
                    pl,
                    lm,
                    gc,
                    poids
                    
                ) VALUES (
                    :date_stockage,
                    :lot,
                    :categorie,
                    :pl ,
                    :lm,
                    :gc,
                    :poids
                )";

        $stmt = $pdo->prepare($sql);

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
            'message' => 'Stockage d\'entrée enregistré avec succès'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Méthode non autorisée'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur BD: ' . $e->getMessage()
    ]);
}
?>