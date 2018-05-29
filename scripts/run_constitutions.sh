cd /home/hydroxide/projects/texel
ng build --watch & PORT=$1 npm start db/constitutions.sql $2 ".pdf$"
