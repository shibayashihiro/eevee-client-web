schema:
	git submodule update --init

update-schema:
	@echo "!! submodule(graphql-apis) をpullします !!"
	cd graphql-apis && git pull
