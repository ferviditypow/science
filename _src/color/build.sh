#!/bin/sh
cd "$(dirname "$0")"
{ cat head.html body.html; echo '<script>'; cat common.js fw.js c1.js c2.js c3.js c4.js q.js; echo '</script>'; echo '</body>'; echo '</html>'; } > /home/claude/science/color/index.html
