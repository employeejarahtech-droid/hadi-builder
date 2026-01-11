<?php
$data = json_encode([
    'id' => 1,
    'type' => 'mobile_menu',
    'content' => '[{"id":"elem_test","type":"container"}]',
    'css_data' => '.container { color: red; }'
]);

// Use file_put_contents to simulate input? No, php://input is read-only.
// We have to use proc_open or similar to pipe to stdin 
// OR simpler: create a temp file and redirect input in shell.

$descriptorspec = [
    0 => ["pipe", "r"],  // stdin is a pipe that the child will read from
    1 => ["pipe", "w"],  // stdout is a pipe that the child will write to
    2 => ["pipe", "w"]   // stderr
];

$process = proc_open('php admin/api/save-page.php', $descriptorspec, $pipes);

if (is_resource($process)) {
    // Write data to stdin
    fwrite($pipes[0], $data);
    fclose($pipes[0]);

    // Read output
    echo stream_get_contents($pipes[1]);
    fclose($pipes[1]);

    // Read error
    $err = stream_get_contents($pipes[2]);
    if ($err)
        echo "\nErrors:\n" . $err;
    fclose($pipes[2]);

    $return_value = proc_close($process);
    echo "\nExited with: $return_value\n";
}
?>