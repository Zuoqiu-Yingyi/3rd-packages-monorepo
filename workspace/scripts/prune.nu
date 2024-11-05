#!/usr/bin/env nu
use utils.nu [get-paths, pnpm-prune]

^pnpm prune
print ""

let paths = get-paths
$paths | each {|path|
    print $path
    pnpm-prune $path
    print ""
}
