<?php
error_reporting(E_ERROR | E_WARNING | E_PARSE);

// Add the correct Content-Type for the cache manifest
header('Content-Type: text/cache-manifest');

// Write the first line
echo "CACHE MANIFEST\n";

// Initialize the $hashes string
$hashes = "";

function create_manifest($folder) {
  $dir = new RecursiveDirectoryIterator($folder);
	// Iterate through all the files/folders in the current directory
	foreach (new RecursiveIteratorIterator($dir) as $file) {
		$info = pathinfo($file);

		// If the object is a file
		// and it's not called manifest.php (this file),
		// and it's not a dotfile, add it to the list
		if ($file -> IsFile() &&
			$file != "./create-maifest.php" &&
			strpos($file,'.idea') == false &&
			substr($file -> getFilename(), 0, 1) != ".") {
			// Replace spaces with %20 or it will break
			echo str_replace(' ', '%20', $file) . "\n";

			// Add this file's hash to the $hashes string
			$hashes .= md5_file($file);
		}
	}
}

create_manifest(".");

// Write the $hashes string
echo "# Hash: 000000000000000000" . md5($hashes) . "\n";
?>