#!/bin/sh
cd "$(dirname "$0")"
{ cat head.html body.html; echo '<script>'; cat common.js fw.js s1.js s2.js s3.js s4.js q.js; echo '</script>'; echo '</body>'; echo '</html>'; } > /home/claude/science/static/index.html
