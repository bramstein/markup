html := $(shell find public -maxdepth 3 -type f -name "*.html")

.PHONY: update deploy clean all
all: clean
	node lib/build.js

dist: all $(html)
	cp -r public/ final/
	buildProduction --outroot final --less --root public $(html)

update:
	git submodule foreach git pull origin master

deploy:
	rsync --verbose --progress --stats --compress --recursive -e ssh -a public/ nfs:/home/public/

clean:
	rm -rf public
