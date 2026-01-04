<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$servername = $_ENV['DB_HOST'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connexion échouée"]));
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $search = isset($_GET["search"]) ? $conn->real_escape_string($_GET["search"]) : "";

    // Récupération des données d'entrée
    $sqlEntre = "
        SELECT 
            id,
            date_stockage, 
            lot_number, 
            categorie, 
            pl, 
            lm, 
            gc, 
            poids
        FROM stockage_entre_chambre1
    ";
    if (!empty($search)) {
        $sqlEntre .= " WHERE lot_number LIKE '%$search%'";
    }
    $sqlEntre .= " ORDER BY date_stockage ASC";
    $resultEntre = $conn->query($sqlEntre);
    $entreData = [];
    while ($row = $resultEntre->fetch_assoc()) {
        $entreData[] = $row;
    }

    // Récupération des données de sortie
    $sqlSortie = "
        SELECT 
            id,
            date_stockage, 
            lot_number, 
            categorie, 
            pl, 
            lm, 
            gc, 
            poids
        FROM stockage_sortie_chambre1
    ";
    if (!empty($search)) {
        $sqlSortie .= " WHERE lot_number LIKE '%$search%'";
    }
    $sqlSortie .= " ORDER BY date_stockage ASC";
    $resultSortie = $conn->query($sqlSortie);
    $sortieData = [];
    while ($row = $resultSortie->fetch_assoc()) {
        $sortieData[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "entre" => $entreData,
        "sortie" => $sortieData
    ]);
} elseif ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $id = isset($_GET["id"]) ? $conn->real_escape_string($_GET["id"]) : null;
    $type = isset($_GET["type"]) ? $_GET["type"] : null; // 'entre' ou 'sortie'

    if (!$id || !$type) {
        echo json_encode(["status" => "error", "message" => "ID et type requis"]);
        exit;
    }

    $tableName = ($type === 'entre') ? 'stockage_entre_chambre1' : 'stockage_sortie_chambre1';

    $sql = "DELETE FROM $tableName WHERE id = '$id'";

    if ($conn->query($sql)) {
        echo json_encode(["status" => "success", "message" => "Supprimé avec succès"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Erreur lors de la suppression: " . $conn->error]);
    }
}

$conn->close();
?>