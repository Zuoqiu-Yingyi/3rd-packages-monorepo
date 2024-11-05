#!/usr/bin/env nu
use utils.nu [get-paths, pnpm-update]

^pnpm update
print ""

let paths = get-paths
$paths | each {|path|
    print $path
    pnpm-update $path
    print ""
}
