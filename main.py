#encoding=utf-8

from urls import URLS
import os

cwd = os.getcwd();
print "Current working dir is %s" % cwd
print "Total urls: %d" % len(URLS)
print "Working..."

for i in xrange(205, len(URLS)):
	url = URLS[i]
	cmd = r'"phantomjs %s\url_to_pdf.js "%s\\pdf\\" "%s"' % (cwd, cwd, url)
	print "Dealing [%d] cmd=%s" % (i, cmd)
	os.system(cmd)
	# break

print "Done."