trap 'kill $npmPid $ngPid' EXIT
npm start /home/hydroxide/data/constitutions db/dev.sql & npmPid=$!
ng build --watch & ngPid=$!
wait
