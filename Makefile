install:
	mkdir /usr/share/Bookkeeper
	cp -av __init__.py /usr/share/Bookkeeper
	cp -avr modules /usr/share/Bookkeeper
	chmod 777 /usr/share/Bookkeeper/__init__.py
	ln -s /usr/share/Bookkeeper/__init__.py /usr/bin/bkp
