


.PHONY: update deploy
update:
	git submodule foreach git pull origin master

deploy:
	rsync --verbose --progress -stats --compress --recursive -e ssh -a public/ nfs:/home/public/
