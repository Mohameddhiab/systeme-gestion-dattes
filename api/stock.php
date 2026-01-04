<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

try {
    require_once __DIR__ . '/vendor/autoload.php';
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    $servername = $_ENV['DB_HOST'];
    $username = $_ENV['DB_USER'];
    $password = $_ENV['DB_PASS'];
    $dbname = $_ENV['DB_NAME'];

    // Recevoir les données JSON
    $data = json_decode(file_get_contents("php://input"), true);

    // Log des données reçues pour debug
    error_log("Données reçues: " . json_encode($data));

    // Vérifier que les données sont bien reçues
    if (!$data) {
        echo json_encode([
            "status" => "error",
            "message" => "Aucune donnée reçue"
        ]);
        exit;
    }

    // Connexion à la base de données
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        throw new Exception("Connexion échouée: " . $conn->connect_error);
    }

    // Vérifier si c'est une opération d'entrée ou de sortie
    $operation = $data['operation'] ?? '';
    $chambre = $data['chambre'] ?? '';

    // Validation des paramètres requis
    if (empty($operation)) {
        echo json_encode([
            "status" => "error",
            "message" => "Le paramètre 'operation' est requis"
        ]);
        exit;
    }

    if (empty($chambre)) {
        echo json_encode([
            "status" => "error",
            "message" => "Le paramètre 'chambre' est requis"
        ]);
        exit;
    }

    // Déterminer le nom de la table selon la chambre ET l'opération
    $tableName = '';
    if ($operation === 'entree') {
        if ($chambre === 'chambre 1') {
            $tableName = 'stockage_entre_chambre1';
        } elseif ($chambre === 'chambre 2') {
            $tableName = 'stockage_entre_chambre2';
        } elseif ($chambre === 'chambre 3') {
            $tableName = 'stockage_entre_chambre3';
        }
    } elseif ($operation === 'sortie') {
        if ($chambre === 'chambre 1') {
            $tableName = 'stockage_sortie_chambre1';
        } elseif ($chambre === 'chambre 2') {
            $tableName = 'stockage_sortie_chambre2';
        } elseif ($chambre === 'chambre 3') {
            $tableName = 'stockage_sortie_chambre3';
        }
    }

    if (empty($tableName)) {
        echo json_encode([
            "status" => "error",
            "message" => "Chambre invalide: " . $chambre
        ]);
        exit;
    }

    if ($operation === 'entree') {
        // Vérifier si le lot existe déjà
        $checkLot = $conn->prepare("SELECT lot_number FROM $tableName WHERE lot_number = ?");
        if (!$checkLot) {
            throw new Exception("Erreur de préparation de la requête: " . $conn->error);
        }

        $checkLot->bind_param("s", $data['lot_number']);
        $checkLot->execute();
        $result = $checkLot->get_result();

        if ($result->num_rows > 0) {
            echo json_encode([
                "status" => "error",
                "message" => "Ce numéro de lot existe déjà"
            ]);
            exit;
        }

        // Insérer les données d'entrée
        $sql = "INSERT INTO $tableName (
            date_stockage,
            lot_number,
            categorie,
            pl,
            lm,
            gc,
            poids
        ) VALUES (?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Erreur de préparation de l'insertion d'entrée: " . $conn->error);
        }

        $stmt->bind_param(
            "sssdddd",
            $data['date_stockage'],
            $data['lot_number'],
            $data['categorie'],
            $data['pl'],
            $data['lm'],
            $data['gc'],
            $data['poids']
        );

        if ($stmt->execute()) {
            echo json_encode([
                "status" => "success",
                "message" => "Entrée enregistrée avec succès"
            ]);
        } else {
            throw new Exception("Erreur lors de l'insertion d'entrée: " . $stmt->error);
        }

        $stmt->close();

    } elseif ($operation === 'sortie') {
        // Pour les sorties, on insère directement dans la table de sortie concernée
        // Vérifier si le lot existe déjà dans la table de sortie
        $checkLot = $conn->prepare("SELECT lot_number FROM $tableName WHERE lot_number = ?");
        if (!$checkLot) {
            throw new Exception("Erreur de préparation de la requête de vérification: " . $conn->error);
        }

        $checkLot->bind_param("s", $data['lot_number']);
        $checkLot->execute();
        $result = $checkLot->get_result();

        if ($result->num_rows > 0) {
            echo json_encode([
                "status" => "error",
                "message" => "Ce numéro de lot existe déjà dans les sorties"
            ]);
            exit;
        }

        // Insérer les données de sortie
        // Note: Selon stockagesortie.php, les colonnes sont date_stockage, lot_number, categorie, pl, lm, gc, poids
        $sql = "INSERT INTO $tableName (
            date_stockage,
            lot_number,
            categorie,
            pl,
            lm,
            gc,
            poids
        ) VALUES (?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Erreur de préparation de l'insertion de sortie: " . $conn->error);
        }

        $stmt->bind_param(
            "sssdddd",
            $data['date_stockage'],
            $data['lot_number'],
            $data['categorie'],
            $data['pl'],
            $data['lm'],
            $data['gc'],
            $data['poids']
        );

        if ($stmt->execute()) {
            echo json_encode([
                "status" => "success",
                "message" => "Sortie enregistrée avec succès"
            ]);
        } else {
            throw new Exception("Erreur lors de l'insertion de sortie: " . $stmt->error);
        }

        $stmt->close();
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Opération invalide: " . $operation
        ]);
    }

    $conn->close();

} catch (Exception $e) {
    error_log("Erreur dans stock.php: " . $e->getMessage());
    echo json_encode([
        "status" => "error",
        "message" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>