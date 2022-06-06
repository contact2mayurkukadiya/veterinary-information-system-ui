install:
	npm install -g @angular/cli # Install the Angular CLI globally using a terminal/console window;
	npm install --legacy-peer-deps # install app's dependencies;
	ng serve

run:
	ng serve

push:
	git add .
	git commit -m "Work in progress."
	git push origin alex
