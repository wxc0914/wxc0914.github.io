git add .
git commit -m 'update the theme'
git push

hexo clean
hexo g
gulp
hexo d