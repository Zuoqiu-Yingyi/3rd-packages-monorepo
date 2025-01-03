#!/usr/bin/env nu
use utils.nu [get-paths, pnpm-outdated]

^pnpm outdated

let paths = get-paths
$paths | each {|path|
    print $path
    pnpm-outdated $path
    print ""
}
