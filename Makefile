

.PHONY: update deploy clean all
all: clean
	node build.js

update:
	git submodule foreach git pull origin master

deploy:
	rsync --verbose --progress -stats --compress --recursive -e ssh -a public/ nfs:/home/public/

clean:
	rm -rf public
