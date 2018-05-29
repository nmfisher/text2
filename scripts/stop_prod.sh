kill $(ps aux | grep 'node bin\\/www' | awk '{print $2}')
