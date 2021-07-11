git pull
git add .
git commit -m 'update the theme'
git push

npx hexo clean
npx hexo g
npx gulp
npx hexo d
