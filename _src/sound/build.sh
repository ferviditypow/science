#!/bin/sh
cd "$(dirname "$0")"
{ cat head.html body.html; echo '<script>'; cat common.js fw.js p1.js p2.js p3.js p4.js p5.js b1.js b2.js b3.js b4.js b6.js q.js q2.js; echo '</script>'; echo '</body>'; echo '</html>'; } > /home/claude/science/sound/index.html
