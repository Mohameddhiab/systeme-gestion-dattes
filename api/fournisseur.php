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

// Configuration de la base de données
$host = $_ENV['DB_HOST'];
$dbname = $_ENV['DB_NAME'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES utf8");

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        // Validation des données
        if (!isset($data['code_fournisseur']) || empty(trim($data['code_fournisseur']))) {
            throw new Exception('Le code fournisseur est requis');
        }
        if (!isset($data['nom_complet']) || empty(trim($data['nom_complet']))) {
            throw new Exception('Le nom complet est requis');
        }
        if (!isset($data['adresse']) || empty(trim($data['adresse']))) {
            throw new Exception("L'adresse est requise");
        }
        if (!isset($data['telephone']) || empty(trim($data['telephone']))) {
            throw new Exception("Le téléphone est requis");
        }

        // Vérifier si le code fournisseur existe déjà
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM fournisseurs WHERE code_fournisseur = :code_fournisseur");
        $stmt->bindValue(':code_fournisseur', trim($data['code_fournisseur']));
        $stmt->execute();
        if ($stmt->fetchColumn() > 0) {
            throw new Exception('Le code fournisseur existe déjà');
        }

        // Début de la transaction
        $pdo->beginTransaction();

        try {
            // Insérer les données du fournisseur
            $sql = "INSERT INTO fournisseurs (code_fournisseur, nom_complet, adresse, telephone)
                    VALUES (:code_fournisseur, :nom_complet, :adresse, :telephone)";

            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':code_fournisseur', trim($data['code_fournisseur']));
            $stmt->bindValue(':nom_complet', trim($data['nom_complet']));
            $stmt->bindValue(':adresse', trim($data['adresse']));
            $stmt->bindValue(':telephone', trim($data['telephone']));

            $stmt->execute();

            // Valider la transaction
            $pdo->commit();

            echo json_encode([
                'status' => 'success',
                'message' => 'Fournisseur ajouté avec succès',
                'fournisseur_id' => $pdo->lastInsertId()
            ]);
        } catch (Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
    } else {
        throw new Exception('Méthode non autorisée');
    }
} catch (PDOException $e) {
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