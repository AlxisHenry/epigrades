.PHONY: update
update:
	git pull
	pm2 delete eg
	pm2 save --force
	pnpm run build
	pm2 start npm --name "eg" -- run "start"
	pm2 save