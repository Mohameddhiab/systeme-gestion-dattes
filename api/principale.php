<?php
require_once __DIR__ . '/vendor/autoload.php';

try {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
} catch (Exception $e) {
    // Fail silently or handle error if .env is missing in production?
    // For dev, this is fine.
}

function getDBConnection()
{
    $servername = $_ENV['DB_HOST'] ?? 'localhost';
    $username = $_ENV['DB_USER'] ?? 'root';
    $password = $_ENV['DB_PASS'] ?? 'root';
    $dbname = $_ENV['DB_NAME'] ?? 'Dates';

    try {
        $conn = new mysqli($servername, $username, $password, $dbname);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $conn->set_charset("utf8mb4");
        return $conn;
    } catch (Exception $e) {
        die("Connection failed: " . $e->getMessage());
    }
}

function closeDBConnection($conn)
{
    if ($conn) {
        $conn->close();
    }
}
?>